import { useState } from 'react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useMatchdayAdmin } from '@/hooks/useAdmin'
import { fetchUclFixtures } from '@/lib/footballData'

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-800',
  live: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
}

const matchStatusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  live: 'bg-green-100 text-green-800',
  finished: 'bg-gray-100 text-gray-800',
}

export function MatchdayManager() {
  const { matchdays, matches, clubs, loading, createMatchday, updateMatchdayStatus, addMatch, updateMatch } = useMatchdayAdmin()
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [kickoff, setKickoff] = useState('')
  const [expandedMd, setExpandedMd] = useState<number | null>(null)

  // Add match form state — reset when switching matchdays
  const [homeClub, setHomeClub] = useState<number>(0)
  const [awayClub, setAwayClub] = useState<number>(0)
  const [matchKickoff, setMatchKickoff] = useState('')
  const [dayLabel, setDayLabel] = useState('Tuesday')

  // Import fixtures state
  const [importMd, setImportMd] = useState('')
  const [importing, setImporting] = useState(false)
  const [importMsg, setImportMsg] = useState('')

  const toggleExpanded = (mdId: number) => {
    setExpandedMd(expandedMd === mdId ? null : mdId)
    setHomeClub(0)
    setAwayClub(0)
    setMatchKickoff('')
    setDayLabel('Tuesday')
  }

  const handleCreate = () => {
    if (!name || !kickoff) return
    createMatchday(name, kickoff)
    setShowCreate(false)
    setName('')
    setKickoff('')
  }

  const handleAddMatch = (mdId: number) => {
    if (!homeClub || !awayClub || !matchKickoff) return
    addMatch(mdId, homeClub, awayClub, matchKickoff, dayLabel)
    setHomeClub(0)
    setAwayClub(0)
    setMatchKickoff('')
  }

  const handleImport = async (mdId: number) => {
    const mdNum = parseInt(importMd)
    if (!mdNum) return
    setImporting(true)
    setImportMsg('')
    try {
      const result = await fetchUclFixtures(mdNum)
      let added = 0
      for (const m of result.matches) {
        await addMatch(mdId, m.homeClubId, m.awayClubId, m.kickoffAt, m.dayLabel)
        added++
      }
      const msg = `Imported ${added} matches.`
      const warn = result.unmapped.length > 0
        ? ` Unmapped teams: ${result.unmapped.join(', ')}`
        : ''
      setImportMsg(msg + warn)
    } catch (err) {
      setImportMsg(`Error: ${err}`)
    }
    setImporting(false)
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Matchdays</p>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
        >
          {showCreate ? 'Cancel' : 'New Matchday'}
        </button>
      </div>

      {showCreate && (
        <div className="space-y-2 rounded-lg border bg-card p-3">
          <input
            placeholder="Matchday name (e.g. Matchday 1)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="datetime-local"
            value={kickoff}
            onChange={(e) => setKickoff(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-[10px] text-muted-foreground">
            Auto-computes: lineup lock (30min before), trade deadline (12h before)
          </p>
          <button
            onClick={handleCreate}
            disabled={!name || !kickoff}
            className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            Create Matchday
          </button>
        </div>
      )}

      {matchdays.map((md) => {
        const mdMatches = matches.filter((m) => m.matchday_id === md.id)
        const isExpanded = expandedMd === md.id

        return (
          <div key={md.id} className="rounded-lg border bg-card">
            <button
              onClick={() => toggleExpanded(md.id)}
              className="flex w-full items-center justify-between p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{md.name}</span>
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', statusColors[md.status])}>
                  {md.status}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(new Date(md.first_kickoff), 'MMM d, HH:mm')}
              </span>
            </button>

            {isExpanded && (
              <div className="border-t px-3 pb-3 pt-2 space-y-3">
                {/* Timers */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                  <span>Lineup Lock: {md.lineup_lock_at ? format(new Date(md.lineup_lock_at), 'MMM d HH:mm') : '--'}</span>
                  <span>Trade Deadline: {md.trade_deadline_at ? format(new Date(md.trade_deadline_at), 'MMM d HH:mm') : '--'}</span>
                  <span>Waiver Ends: {md.waiver_draft_ends_at ? format(new Date(md.waiver_draft_ends_at), 'MMM d HH:mm') : '--'}</span>
                  <span>Lineup Opens: {md.lineup_window_opens_at ? format(new Date(md.lineup_window_opens_at), 'MMM d HH:mm') : '--'}</span>
                </div>

                {/* Status buttons */}
                <div className="flex gap-1">
                  {md.status === 'upcoming' && (
                    <button onClick={() => updateMatchdayStatus(md.id, 'live')} className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white">
                      Set Live
                    </button>
                  )}
                  {md.status === 'live' && (
                    <button onClick={() => updateMatchdayStatus(md.id, 'completed')} className="rounded-md bg-gray-500 px-3 py-1 text-xs font-medium text-white">
                      Complete (sets 48h/24h timers)
                    </button>
                  )}
                </div>

                {/* Matches list */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold">Matches ({mdMatches.length})</p>
                  {mdMatches.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-md border px-2 py-1.5 text-xs">
                      <span>{m.home_club?.short_name} vs {m.away_club?.short_name}</span>
                      <div className="flex items-center gap-2">
                        <span>{m.home_score}-{m.away_score}</span>
                        <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-semibold', matchStatusColors[m.status])}>
                          {m.status}
                        </span>
                        {m.status === 'scheduled' && (
                          <button onClick={() => updateMatch(m.id, { status: 'live' })} className="rounded bg-green-600 px-1.5 py-0.5 text-[9px] text-white">Live</button>
                        )}
                        {m.status === 'live' && (
                          <button onClick={() => updateMatch(m.id, { status: 'finished' })} className="rounded bg-gray-500 px-1.5 py-0.5 text-[9px] text-white">FT</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add match */}
                <div className="space-y-1.5 rounded-md border p-2">
                  <p className="text-xs font-semibold">Add Match</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <select value={homeClub} onChange={(e) => setHomeClub(Number(e.target.value))} className="rounded border px-2 py-1 text-xs">
                      <option value={0}>Home club</option>
                      {clubs.map((c) => <option key={c.id} value={c.id}>{c.short_name}</option>)}
                    </select>
                    <select value={awayClub} onChange={(e) => setAwayClub(Number(e.target.value))} className="rounded border px-2 py-1 text-xs">
                      <option value={0}>Away club</option>
                      {clubs.map((c) => <option key={c.id} value={c.id}>{c.short_name}</option>)}
                    </select>
                  </div>
                  <input type="datetime-local" value={matchKickoff} onChange={(e) => setMatchKickoff(e.target.value)} className="w-full rounded border px-2 py-1 text-xs" />
                  <div className="flex gap-1">
                    {['Tuesday', 'Wednesday'].map((d) => (
                      <button key={d} onClick={() => setDayLabel(d)} className={cn('flex-1 rounded py-1 text-xs font-medium', dayLabel === d ? 'bg-primary text-primary-foreground' : 'border')}>
                        {d}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => handleAddMatch(md.id)} disabled={!homeClub || !awayClub || !matchKickoff} className="w-full rounded bg-primary py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50">
                    Add Match
                  </button>
                </div>

                {/* Import from football-data.org */}
                <div className="space-y-1.5 rounded-md border p-2">
                  <p className="text-xs font-semibold">Import from football-data.org</p>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min={1}
                      placeholder="API matchday #"
                      value={importMd}
                      onChange={(e) => setImportMd(e.target.value)}
                      className="w-full rounded border px-2 py-1 text-xs"
                    />
                    <button
                      onClick={() => handleImport(md.id)}
                      disabled={importing || !importMd}
                      className="whitespace-nowrap rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
                    >
                      {importing ? 'Importing...' : 'Import'}
                    </button>
                  </div>
                  {importMsg && (
                    <p className={cn('text-[10px]', importMsg.startsWith('Error') ? 'text-red-600' : 'text-green-600')}>
                      {importMsg}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
