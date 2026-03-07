import { useState } from 'react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { useScoreAdmin } from '@/hooks/useAdmin'
import { calculatePoints } from '@/lib/scoring'

export function ScoreManager() {
  const { scores, matchdays, loading, updateScore, recalcPoints } = useScoreAdmin()
  const [selectedMd, setSelectedMd] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  const filtered = selectedMd ? scores.filter((s) => s.matchday_id === selectedMd) : scores

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>

  return (
    <div className="space-y-4">
      <p className="font-semibold">Score Corrections</p>

      {/* Matchday filter */}
      <div className="flex gap-1 overflow-x-auto">
        <button
          onClick={() => setSelectedMd(null)}
          className={cn('shrink-0 rounded-md px-3 py-1.5 text-xs font-medium', !selectedMd ? 'bg-primary text-primary-foreground' : 'border')}
        >
          All
        </button>
        {matchdays.map((md) => (
          <button
            key={md.id}
            onClick={() => setSelectedMd(md.id)}
            className={cn('shrink-0 rounded-md px-3 py-1.5 text-xs font-medium', selectedMd === md.id ? 'bg-primary text-primary-foreground' : 'border')}
          >
            {md.name}
          </button>
        ))}
      </div>

      {/* Scores list */}
      <div className="space-y-1">
        {filtered.map((score) => (
          <div key={score.id} className="rounded-lg border bg-card">
            <button
              onClick={() => setEditingId(editingId === score.id ? null : score.id)}
              className="flex w-full items-center justify-between px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[score.player?.position ?? ''])}>
                  {score.player?.position}
                </span>
                <span className="truncate text-sm">{score.player?.name}</span>
                {score.is_manual_correction && <span className="text-[9px] text-amber-600">edited</span>}
              </div>
              <span className="text-sm font-bold tabular-nums">{score.total_points} pts</span>
            </button>

            {editingId === score.id && (
              <div className="border-t px-3 pb-3 pt-2 space-y-2">
                <div className="grid grid-cols-3 gap-1.5">
                  <NumberField label="Goals" value={score.goals} onChange={(v) => updateScore(score.id, { goals: v })} />
                  <NumberField label="Assists" value={score.assists} onChange={(v) => updateScore(score.id, { assists: v })} />
                  <NumberField label="Minutes" value={score.minutes_played} onChange={(v) => updateScore(score.id, { minutes_played: v })} />
                  <NumberField label="Yellows" value={score.yellow_cards} onChange={(v) => updateScore(score.id, { yellow_cards: v })} />
                  <NumberField label="OG" value={score.own_goals} onChange={(v) => updateScore(score.id, { own_goals: v })} />
                  <NumberField label="Pen Won" value={score.penalties_won} onChange={(v) => updateScore(score.id, { penalties_won: v })} />
                  <NumberField label="Pen Miss" value={score.penalties_missed} onChange={(v) => updateScore(score.id, { penalties_missed: v })} />
                  <NumberField label="Pen Save" value={score.penalties_saved} onChange={(v) => updateScore(score.id, { penalties_saved: v })} />
                </div>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={score.clean_sheet} onChange={(e) => updateScore(score.id, { clean_sheet: e.target.checked })} />
                    Clean Sheet
                  </label>
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={score.red_card} onChange={(e) => updateScore(score.id, { red_card: e.target.checked })} />
                    Red Card
                  </label>
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={score.motm} onChange={(e) => updateScore(score.id, { motm: e.target.checked })} />
                    MotM
                  </label>
                </div>
                <button
                  onClick={() => {
                    if (score.player) {
                      const pts = calculatePoints(score, score.player.position)
                      recalcPoints(score.id, pts)
                    }
                  }}
                  className="w-full rounded-md bg-primary py-1.5 text-xs font-medium text-primary-foreground"
                >
                  Recalculate Points
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">No scores recorded yet.</p>
        )}
      </div>
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
