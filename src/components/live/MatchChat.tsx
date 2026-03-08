import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface ChatMessage {
  id: number
  user_id: string
  message: string
  created_at: string
  profile?: { display_name: string }
}

interface MatchChatProps {
  matchdayId: number
}

export function MatchChat({ matchdayId }: MatchChatProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load existing messages
    supabase
      .from('matchday_messages')
      .select('id, user_id, message, created_at, profile:profiles(display_name)')
      .eq('matchday_id', matchdayId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages((data ?? []) as unknown as ChatMessage[]))

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat-${matchdayId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'matchday_messages', filter: `matchday_id=eq.${matchdayId}` },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', payload.new.user_id)
            .single()
          const msg: ChatMessage = {
            ...(payload.new as ChatMessage),
            profile: profile ?? undefined,
          }
          setMessages((prev) => [...prev, msg])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [matchdayId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim() || !user || sending) return
    setSending(true)
    await supabase.from('matchday_messages').insert({
      matchday_id: matchdayId,
      user_id: user.id,
      message: text.trim(),
    })
    setText('')
    setSending(false)
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col rounded-lg border bg-card" style={{ height: '400px' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.user_id === user?.id
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-lg px-3 py-1.5 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {!isMe && (
                  <p className="text-[10px] font-bold opacity-70">{msg.profile?.display_name ?? 'Unknown'}</p>
                )}
                <p className="text-sm break-words">{msg.message}</p>
                <p className={`text-[9px] text-right ${isMe ? 'opacity-60' : 'text-muted-foreground'}`}>
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t px-3 py-2">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            maxLength={500}
            className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="rounded-md bg-primary p-2 text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
