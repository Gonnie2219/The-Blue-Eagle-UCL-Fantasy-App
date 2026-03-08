import { useDeadlines } from '@/hooks/useDeadlines'

function formatCountdown(target: string, now: Date): string {
  const diff = new Date(target).getTime() - now.getTime()
  if (diff <= 0) return 'Passed'
  const hours = Math.floor(diff / 3_600_000)
  const mins = Math.floor((diff % 3_600_000) / 60_000)
  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  return `${hours}h ${mins}m`
}

export function DeadlineCountdown() {
  const { matchday, now } = useDeadlines()

  if (!matchday) return null

  const deadlines = [
    { label: 'Trade Deadline', time: matchday.trade_deadline_at },
    { label: 'Lineup Lock', time: matchday.lineup_lock_at },
    { label: 'Kickoff', time: matchday.first_kickoff },
  ].filter((d) => d.time && new Date(d.time).getTime() > now.getTime())

  if (deadlines.length === 0) return null

  // Find deadlines less than 1 hour away
  const urgent = deadlines.filter(
    (d) => new Date(d.time!).getTime() - now.getTime() < 3_600_000
  )

  return (
    <div className="space-y-2">
      {urgent.length > 0 && (
        <div className="rounded-lg border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950 px-3 py-2 text-center">
          <p className="text-xs font-bold text-red-700 dark:text-red-400">
            {urgent.map((d) => `${d.label} in ${formatCountdown(d.time!, now)}`).join(' · ')}
          </p>
        </div>
      )}
      <div className="rounded-lg border bg-card p-3">
        <p className="mb-2 text-xs font-semibold text-muted-foreground">{matchday.name} — Deadlines</p>
        <div className="grid grid-cols-3 gap-2">
          {deadlines.map((d) => {
            const isUrgent = new Date(d.time!).getTime() - now.getTime() < 3_600_000
            return (
              <div key={d.label} className="text-center">
                <p className={`text-lg font-bold tabular-nums ${isUrgent ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-primary'}`}>
                  {formatCountdown(d.time!, now)}
                </p>
                <p className="text-[10px] text-muted-foreground">{d.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
