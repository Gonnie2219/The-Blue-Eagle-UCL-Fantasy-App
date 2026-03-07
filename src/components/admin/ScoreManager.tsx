import { useState } from 'react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { useScoreAdmin } from '@/hooks/useAdmin'
import { calculatePoints } from '@/lib/scoring'
import { fetchUefaMatchStats } from '@/lib/fetchMatchStats'
import type { PlayerScore } from '@/types'

export function ScoreManager() {
  const { scores, matchdays, matches, loading, updateScore, recalcPoints, generateScoresForMatch, reload } = useScoreAdmin()
  const [selectedMd, setSelectedMd] = useState<number | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [generating, setGenerating] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [fetchMsg, setFetchMsg] = useState('')

  const mdMatches = selectedMd ? matches.filter((m) => m.matchday_id === selectedMd) : []
  const matchScores = selectedMatch
    ? scores.filter((s) => s.match_id === selectedMatch)
    : selectedMd
      ? scores.filter((s) => s.matchday_id === selectedMd)
      : []

  const handleGenerate = async (matchId: number) => {
    const match = matches.find((m) => m.id === matchId)
    if (!match) return
    setGenerating(true)
    await generateScoresForMatch(matchId, match.matchday_id, match.home_club_id, match.away_club_id)
    setGenerating(false)
  }

  const handleFetchUefa = async (matchId: number) => {
    const match = matches.find((m) => m.id === matchId)
    if (!match) return
    setFetching(true)
    setFetchMsg('')
    const result = await fetchUefaMatchStats(
      matchId,
      match.matchday_id,
      match.home_club_id,
      match.away_club_id,
      match.home_club?.short_name ?? '',
      match.away_club?.short_name ?? '',
      match.kickoff_at
    )
    setFetchMsg(result.message)
    setFetching(false)
    if (result.success) reload()
  }

  const handleRecalcAll = async () => {
    for (const score of matchScores) {
      if (score.player) {
        const pts = calculatePoints(score, score.player.position)
        if (pts !== score.total_points) {
          await recalcPoints(score.id, pts)
        }
      }
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>

  return (
    <div className="space-y-4">
      <p className="font-semibold">Match Scores</p>

      {/* Step 1: Pick matchday */}
      <div className="flex gap-1 overflow-x-auto">
        {matchdays.map((md) => (
          <button
            key={md.id}
            onClick={() => { setSelectedMd(md.id); setSelectedMatch(null) }}
            className={cn('shrink-0 rounded-md px-3 py-1.5 text-xs font-medium', selectedMd === md.id ? 'bg-primary text-primary-foreground' : 'border')}
          >
            {md.name}
          </button>
        ))}
      </div>

      {/* Step 2: Pick match */}
      {selectedMd && (
        <div className="space-y-1">
          {mdMatches.map((m) => {
            const matchScoreCount = scores.filter((s) => s.match_id === m.id).length
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMatch(selectedMatch === m.id ? null : m.id)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm',
                  selectedMatch === m.id ? 'border-primary bg-primary/5' : 'bg-card'
                )}
              >
                <span>{m.home_club?.short_name} vs {m.away_club?.short_name}</span>
                <span className="text-xs text-muted-foreground">
                  {matchScoreCount > 0 ? `${matchScoreCount} scores` : 'No scores'}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Action buttons */}
      {selectedMatch && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleGenerate(selectedMatch)}
              disabled={generating}
              className="flex-1 rounded-md bg-green-600 py-2 text-xs font-medium text-white disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Scores'}
            </button>
            <button
              onClick={() => handleFetchUefa(selectedMatch)}
              disabled={fetching}
              className="flex-1 rounded-md bg-blue-600 py-2 text-xs font-medium text-white disabled:opacity-50"
            >
              {fetching ? 'Fetching...' : 'Fetch from UEFA'}
            </button>
            <button
              onClick={handleRecalcAll}
              className="flex-1 rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground"
            >
              Recalc All
            </button>
          </div>
          {fetchMsg && (
            <p className="rounded-md bg-muted px-3 py-2 text-xs">{fetchMsg}</p>
          )}
        </div>
      )}

      {/* Player scores for selected match */}
      {selectedMatch && matchScores.length > 0 && (
        <div className="space-y-1">
          {matchScores
            .sort((a, b) => {
              const posA = a.player?.position ?? ''
              const posB = b.player?.position ?? ''
              const order = { GK: 0, DEF: 1, MID: 2, FWD: 3 } as Record<string, number>
              return (order[posA] ?? 4) - (order[posB] ?? 4)
            })
            .map((score) => (
              <ScoreRow
                key={score.id}
                score={score}
                isEditing={editingId === score.id}
                onToggle={() => setEditingId(editingId === score.id ? null : score.id)}
                onUpdate={updateScore}
                onRecalc={recalcPoints}
              />
            ))}
        </div>
      )}

      {selectedMatch && matchScores.length === 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No scores yet. Click "Generate Player Scores" to create entries.
        </p>
      )}

      {!selectedMd && (
        <p className="py-4 text-center text-sm text-muted-foreground">Select a matchday to manage scores.</p>
      )}
    </div>
  )
}

function ScoreRow({
  score,
  isEditing,
  onToggle,
  onUpdate,
  onRecalc,
}: {
  score: PlayerScore
  isEditing: boolean
  onToggle: () => void
  onUpdate: (id: number, updates: Partial<PlayerScore>) => void
  onRecalc: (id: number, pts: number) => void
}) {
  return (
    <div className="rounded-lg border bg-card">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[score.player?.position ?? ''])}>
            {score.player?.position}
          </span>
          <span className="truncate text-sm">{score.player?.name}</span>
          <span className="text-[10px] text-muted-foreground">{score.player?.club?.short_name}</span>
        </div>
        <div className="flex items-center gap-2">
          {score.minutes_played > 0 && (
            <span className="text-[10px] text-muted-foreground">{score.minutes_played}'</span>
          )}
          {score.goals > 0 && <span className="text-[10px] text-green-600">{score.goals}G</span>}
          {score.assists > 0 && <span className="text-[10px] text-blue-600">{score.assists}A</span>}
          <span className="text-sm font-bold tabular-nums">{score.total_points}</span>
        </div>
      </button>

      {isEditing && (
        <div className="border-t px-3 pb-3 pt-2 space-y-2">
          <div className="grid grid-cols-3 gap-1.5">
            <NumberField label="Minutes" value={score.minutes_played} onChange={(v) => onUpdate(score.id, { minutes_played: v })} />
            <NumberField label="Goals" value={score.goals} onChange={(v) => onUpdate(score.id, { goals: v })} />
            <NumberField label="Assists" value={score.assists} onChange={(v) => onUpdate(score.id, { assists: v })} />
            <NumberField label="Yellows" value={score.yellow_cards} onChange={(v) => onUpdate(score.id, { yellow_cards: v })} />
            <NumberField label="OG" value={score.own_goals} onChange={(v) => onUpdate(score.id, { own_goals: v })} />
            <NumberField label="Pen Won" value={score.penalties_won} onChange={(v) => onUpdate(score.id, { penalties_won: v })} />
            <NumberField label="Pen Miss" value={score.penalties_missed} onChange={(v) => onUpdate(score.id, { penalties_missed: v })} />
            <NumberField label="Pen Save" value={score.penalties_saved} onChange={(v) => onUpdate(score.id, { penalties_saved: v })} />
          </div>
          <div className="flex gap-2">
            <label className="flex items-center gap-1 text-xs">
              <input type="checkbox" checked={score.clean_sheet} onChange={(e) => onUpdate(score.id, { clean_sheet: e.target.checked })} />
              Clean Sheet
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input type="checkbox" checked={score.red_card} onChange={(e) => onUpdate(score.id, { red_card: e.target.checked })} />
              Red Card
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input type="checkbox" checked={score.motm} onChange={(e) => onUpdate(score.id, { motm: e.target.checked })} />
              MotM
            </label>
          </div>
          <button
            onClick={() => {
              if (score.player) {
                const pts = calculatePoints(score, score.player.position)
                onRecalc(score.id, pts)
              }
            }}
            className="w-full rounded-md bg-primary py-1.5 text-xs font-medium text-primary-foreground"
          >
            Recalculate ({score.player ? calculatePoints(score, score.player.position) : 0} pts)
          </button>
        </div>
      )}
    </div>
  )
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded border px-2 py-1 text-xs"
      />
    </div>
  )
}
