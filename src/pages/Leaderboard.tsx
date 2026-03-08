import { useState, lazy, Suspense } from 'react'
import { cn } from '@/lib/utils'
import { LeagueStandings } from '@/components/league/LeagueStandings'

const History = lazy(() => import('./History'))
const Stats = lazy(() => import('./Stats'))

type Tab = 'standings' | 'history' | 'stats'

export default function Leaderboard() {
  const [tab, setTab] = useState<Tab>('standings')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'standings', label: 'Standings' },
    { id: 'history', label: 'History' },
    { id: 'stats', label: 'Stats' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">League</h2>

      <div className="flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 rounded-lg py-2 text-xs font-medium transition-colors',
              tab === t.id
                ? 'bg-primary text-primary-foreground'
                : 'border text-muted-foreground hover:bg-accent'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading...</div>}>
        {tab === 'standings' && <LeagueStandings />}
        {tab === 'history' && <History />}
        {tab === 'stats' && <Stats />}
      </Suspense>
    </div>
  )
}
