import { useEffect, useState } from 'react'
import { Crown, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { PlayerScore } from '@/types'

interface Profile {
  id: string
  display_name: string
}

interface SquadEntry {
  player_id: number
  is_starter: boolean
  is_captain: boolean
  is_vice_captain: boolean
  player?: { name: string; position: string }
}

interface HeadToHeadProps {
  scores: PlayerScore[]
}

export function HeadToHead({ scores }: HeadToHeadProps) {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [opponentId, setOpponentId] = useState<string | null>(null)
  const [mySquad, setMySquad] = useState<SquadEntry[]>([])
  const [oppSquad, setOppSquad] = useState<SquadEntry[]>([])

  const scoreMap = new Map(scores.map((s) => [s.player_id, s.total_points]))

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, display_name')
      .then(({ data }) => setProfiles((data ?? []).filter((p) => p.id !== user?.id)))
  }, [user])

  useEffect(() => {
    if (!user) return
    supabase
      .from('squad_players')
      .select('player_id, is_starter, is_captain, is_vice_captain, player:players(name, position)')
      .eq('user_id', user.id)
      .then(({ data }) => setMySquad((data ?? []) as unknown as SquadEntry[]))
  }, [user])

  useEffect(() => {
    if (!opponentId) { setOppSquad([]); return }
    supabase
      .from('squad_players')
      .select('player_id, is_starter, is_captain, is_vice_captain, player:players(name, position)')
      .eq('user_id', opponentId)
      .then(({ data }) => setOppSquad((data ?? []) as unknown as SquadEntry[]))
  }, [opponentId])

  const calcPoints = (squad: SquadEntry[]): number => {
    const starters = squad.filter((s) => s.is_starter)
    const captain = starters.find((s) => s.is_captain)
    const captainPts = captain ? (scoreMap.get(captain.player_id) ?? 0) : 0
    const captainDNP = captainPts === 0

    return starters.reduce((sum, sp) => {
      let pts = scoreMap.get(sp.player_id) ?? 0
      if (sp.is_captain && !captainDNP) pts *= 2
      if (sp.is_vice_captain && captainDNP) pts *= 2
      return sum + pts
    }, 0)
  }

  const myPoints = calcPoints(mySquad)
  const oppPoints = calcPoints(oppSquad)
  const oppName = profiles.find((p) => p.id === opponentId)?.display_name ?? ''

  return (
    <div className="space-y-3">
      {/* Opponent selector */}
      <div className="flex gap-1 overflow-x-auto">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => setOpponentId(p.id)}
            className={cn(
              'whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium',
              opponentId === p.id
                ? 'bg-primary text-primary-foreground'
                : 'border hover:bg-accent'
            )}
          >
            {p.display_name}
          </button>
        ))}
      </div>

      {opponentId && (
        <>
          {/* Score comparison */}
          <div className="grid grid-cols-3 items-center rounded-lg border bg-card p-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{myPoints}</p>
              <p className="text-xs text-muted-foreground">You</p>
            </div>
            <p className="text-center text-sm font-bold text-muted-foreground">vs</p>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{oppPoints}</p>
              <p className="truncate text-xs text-muted-foreground">{oppName}</p>
            </div>
          </div>

          {/* Side-by-side starters */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Your XI', squad: mySquad },
              { label: `${oppName}'s XI`, squad: oppSquad },
            ].map(({ label, squad }) => {
              const starters = squad.filter((s) => s.is_starter)
              const cap = starters.find((s) => s.is_captain)
              const capPts = cap ? (scoreMap.get(cap.player_id) ?? 0) : 0
              const capDNP = capPts === 0

              return (
                <div key={label}>
                  <p className="mb-1 text-[10px] font-semibold text-muted-foreground uppercase">{label}</p>
                  <div className="space-y-0.5">
                    {starters.map((sp) => {
                      let pts = scoreMap.get(sp.player_id) ?? 0
                      const isX2 = (sp.is_captain && !capDNP) || (sp.is_vice_captain && capDNP)
                      if (isX2) pts *= 2
                      return (
                        <div key={sp.player_id} className="flex items-center justify-between rounded border px-1.5 py-1 text-[11px]">
                          <div className="flex items-center gap-1 min-w-0">
                            <span className={cn('rounded px-0.5 text-[9px] font-bold', posColors[sp.player?.position ?? ''])}>
                              {sp.player?.position}
                            </span>
                            {sp.is_captain && <Crown className="h-2.5 w-2.5 text-primary shrink-0" />}
                            {sp.is_vice_captain && <Star className="h-2.5 w-2.5 text-primary shrink-0" />}
                            <span className="truncate">{sp.player?.name}</span>
                          </div>
                          <span className={cn('font-bold', isX2 ? 'text-primary' : 'text-foreground')}>
                            {pts}{isX2 && <span className="text-[8px]">x2</span>}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
