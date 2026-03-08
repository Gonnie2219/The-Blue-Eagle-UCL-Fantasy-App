import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useUserSquad } from '@/contexts/UserSquadContext'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

export function LeagueStandings() {
  const { user } = useAuth()
  const { openUserSquad } = useUserSquad()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .order('total_points', { ascending: false })
      .then(({ data }) => {
        setProfiles(data ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-1.5">
      {profiles.map((p, i) => {
        const rank = i + 1
        const isMe = p.id === user?.id
        return (
          <button
            key={p.id}
            onClick={() => openUserSquad(p.id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left hover:bg-accent/50',
              isMe ? 'border-primary bg-primary/5' : 'bg-card'
            )}
          >
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                rank === 1 && 'bg-yellow-400 text-yellow-900',
                rank === 2 && 'bg-gray-300 text-gray-700',
                rank === 3 && 'bg-amber-600 text-amber-100',
                rank > 3 && 'bg-muted text-muted-foreground'
              )}
            >
              {rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className={cn('truncate text-sm font-medium', isMe && 'text-primary')}>
                {p.display_name}
                {isMe && <span className="ml-1 text-xs opacity-70">(you)</span>}
              </p>
            </div>
            <span className="text-lg font-bold text-primary">{p.total_points}</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </button>
        )
      })}

      {profiles.length === 0 && (
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-muted-foreground">No players yet.</p>
        </div>
      )}
    </div>
  )
}
