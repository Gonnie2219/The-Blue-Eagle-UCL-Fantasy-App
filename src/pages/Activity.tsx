import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { usePlayerStats } from '@/contexts/PlayerStatsContext'

interface ActivityItem {
  id: string
  type: 'draft' | 'trade' | 'transfer'
  timestamp: string
  description: string
  players: Array<{ id: number; name: string; position: string }>
}

export default function Activity() {
  const { openPlayerStats } = usePlayerStats()
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      // Draft picks
      supabase
        .from('draft_picks')
        .select('id, user_id, round, pick_number, picked_at, player:players(id, name, position), profile:profiles(display_name)')
        .order('picked_at', { ascending: false })
        .limit(50),
      // Trades (accepted only)
      supabase
        .from('trades')
        .select('id, proposed_at, resolved_at, proposer:profiles!proposer_id(display_name), receiver:profiles!receiver_id(display_name), trade_players(player:players(id, name, position), from_user_id)')
        .eq('status', 'accepted')
        .order('resolved_at', { ascending: false })
        .limit(30),
      // Transfers
      supabase
        .from('transfers')
        .select('id, transferred_at, is_free, point_cost, player_in:players!player_in_id(id, name, position), player_out:players!player_out_id(id, name, position), profile:profiles!user_id(display_name)')
        .order('transferred_at', { ascending: false })
        .limit(30),
    ]).then(([draftRes, tradeRes, transferRes]) => {
      const activities: ActivityItem[] = []

      // Map draft picks
      for (const d of (draftRes.data ?? []) as unknown as Array<{
        id: number; user_id: string; round: number; pick_number: number; picked_at: string
        player: { id: number; name: string; position: string }
        profile: { display_name: string }
      }>) {
        activities.push({
          id: `draft-${d.id}`,
          type: 'draft',
          timestamp: d.picked_at,
          description: `${d.profile?.display_name} drafted (R${d.round} P${d.pick_number})`,
          players: d.player ? [d.player] : [],
        })
      }

      // Map trades
      for (const t of (tradeRes.data ?? []) as unknown as Array<{
        id: number; resolved_at: string
        proposer: { display_name: string }
        receiver: { display_name: string }
        trade_players: Array<{ player: { id: number; name: string; position: string }; from_user_id: string }>
      }>) {
        const playerNames = t.trade_players?.map((tp) => tp.player) ?? []
        activities.push({
          id: `trade-${t.id}`,
          type: 'trade',
          timestamp: t.resolved_at,
          description: `${t.proposer?.display_name} traded with ${t.receiver?.display_name}`,
          players: playerNames,
        })
      }

      // Map transfers
      for (const t of (transferRes.data ?? []) as unknown as Array<{
        id: number; transferred_at: string; is_free: boolean; point_cost: number
        player_in: { id: number; name: string; position: string }
        player_out: { id: number; name: string; position: string }
        profile: { display_name: string }
      }>) {
        const players = []
        if (t.player_in) players.push(t.player_in)
        if (t.player_out) players.push(t.player_out)
        activities.push({
          id: `transfer-${t.id}`,
          type: 'transfer',
          timestamp: t.transferred_at,
          description: `${t.profile?.display_name} transferred${t.is_free ? '' : ` (-${t.point_cost}pts)`}`,
          players,
        })
      }

      // Sort by timestamp descending
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setItems(activities)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>
  }

  const typeLabels: Record<string, { label: string; color: string }> = {
    draft: { label: 'DRAFT', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    trade: { label: 'TRADE', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
    transfer: { label: 'TRANSFER', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-1">
      {items.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">No activity yet.</p>
      ) : (
        items.map((item) => {
          const meta = typeLabels[item.type]
          return (
            <div key={item.id} className="rounded-md border bg-card px-3 py-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-bold', meta.color)}>
                    {meta.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
                  <span className="text-[10px] text-muted-foreground">{formatTime(item.timestamp)}</span>
                </div>
              </div>
              <p className="text-sm">{item.description}</p>
              {item.players.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {item.players.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => openPlayerStats(p.id)}
                      className="flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] hover:bg-accent"
                    >
                      <span className={cn('rounded px-0.5 text-[9px] font-bold', posColors[p.position])}>
                        {p.position}
                      </span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
