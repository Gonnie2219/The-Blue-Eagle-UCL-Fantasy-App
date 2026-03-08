import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useLive } from '@/hooks/useLive'
import { supabase } from '@/lib/supabase'
import { LiveMatch } from '@/components/live/LiveMatch'
import { LiveScoreboard } from '@/components/live/LiveScoreboard'
import { ManualSubs } from '@/components/live/ManualSubs'
import { PredictedLineup } from '@/components/live/PredictedLineup'
import { HeadToHead } from '@/components/live/HeadToHead'
import { SCORING_TABLE } from '@/lib/scoring'
import type { Player } from '@/types'

type Tab = 'matches' | 'points' | 'h2h' | 'subs' | 'lineups' | 'scoring'

export default function Live() {
  const { matchday, matches, scores, squad, manualSubs, loading, makeManualSub } = useLive()
  const [tab, setTab] = useState<Tab>('matches')
  const [allPlayers, setAllPlayers] = useState<Player[]>([])

  // Load all players for predicted lineups
  useEffect(() => {
    if (tab === 'lineups') {
      supabase
        .from('players')
        .select('*, club:clubs(*)')
        .eq('is_available', true)
        .then(({ data }) => setAllPlayers(data ?? []))
    }
  }, [tab])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'matches', label: 'Matches' },
    { id: 'points', label: 'Points' },
    { id: 'h2h', label: 'H2H' },
    { id: 'subs', label: 'Subs' },
    { id: 'lineups', label: 'Lineups' },
    { id: 'scoring', label: 'Rules' },
  ]

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Live Matchday</h2>
        <div className="py-8 text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Live Matchday</h2>
        {matchday && (
          <span className="text-sm font-medium text-primary">{matchday.name}</span>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 rounded-lg px-1 py-2 text-xs font-medium transition-colors',
              tab === t.id
                ? 'bg-primary text-primary-foreground'
                : 'border text-muted-foreground hover:bg-accent'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {!matchday ? (
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-lg font-semibold text-muted-foreground">No Upcoming Matchday</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Matches will appear here when a matchday is scheduled.
          </p>
        </div>
      ) : (
        <>
          {tab === 'matches' && (
            <div className="space-y-2">
              {matches.length === 0 ? (
                <div className="rounded-lg border bg-card p-6 text-center">
                  <p className="text-muted-foreground">No matches scheduled yet.</p>
                </div>
              ) : (
                matches.map((match) => <LiveMatch key={match.id} match={match} />)
              )}
            </div>
          )}

          {tab === 'points' && (
            <LiveScoreboard squad={squad} scores={scores} />
          )}

          {tab === 'h2h' && matchday && (
            <HeadToHead matchdayId={matchday.id} scores={scores} />
          )}

          {tab === 'subs' && (
            <ManualSubs
              squad={squad}
              matches={matches}
              manualSubs={manualSubs}
              onSub={makeManualSub}
            />
          )}

          {tab === 'lineups' && (
            <div className="space-y-3">
              {matches.filter((m) => m.status === 'scheduled').length === 0 ? (
                <div className="rounded-lg border bg-card p-6 text-center">
                  <p className="text-muted-foreground">No upcoming matches for lineup predictions.</p>
                </div>
              ) : (
                matches
                  .filter((m) => m.status === 'scheduled')
                  .map((match) => (
                    <PredictedLineup key={match.id} match={match} players={allPlayers} />
                  ))
              )}
            </div>
          )}

          {tab === 'scoring' && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 font-semibold">Scoring System</h3>
              <div className="space-y-1">
                {SCORING_TABLE.map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium">{row.points}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
