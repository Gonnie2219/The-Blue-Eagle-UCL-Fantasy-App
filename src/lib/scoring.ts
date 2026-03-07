import type { PlayerPosition, PlayerScore } from '@/types'

// Points per goal by position
const GOAL_POINTS: Record<PlayerPosition, number> = {
  GK: 12,
  DEF: 10,
  MID: 9,
  FWD: 8,
}

export function calculatePoints(score: PlayerScore, position: PlayerPosition): number {
  let pts = 0

  // Appearance
  if (score.minutes_played > 0) pts += score.minutes_played >= 60 ? 2 : 1

  // Goals
  pts += score.goals * GOAL_POINTS[position]

  // Assists
  pts += score.assists * 5

  // Clean sheet (GK/DEF only)
  if (score.clean_sheet && (position === 'GK' || position === 'DEF')) pts += 5

  // Penalties
  pts += score.penalties_won * 3
  pts -= score.penalties_missed * 3
  pts += score.penalties_saved * 5

  // Cards
  pts -= score.yellow_cards * 1
  if (score.red_card) pts -= 3

  // Own goals
  pts -= score.own_goals * 3

  // Man of the Match
  if (score.motm) pts += 5

  return pts
}

// Scoring breakdown labels for display
export const SCORING_TABLE = [
  { label: 'Goal (FWD)', points: '+8' },
  { label: 'Goal (MID)', points: '+9' },
  { label: 'Goal (DEF)', points: '+10' },
  { label: 'Goal (GK)', points: '+12' },
  { label: 'Assist', points: '+5' },
  { label: 'Clean Sheet (DEF/GK)', points: '+5' },
  { label: 'Appearance (60+ min)', points: '+2' },
  { label: 'Appearance (<60 min)', points: '+1' },
  { label: 'Penalty Won', points: '+3' },
  { label: 'Penalty Saved', points: '+5' },
  { label: 'Penalty Missed', points: '-3' },
  { label: 'Man of the Match', points: '+5' },
  { label: 'Yellow Card', points: '-1' },
  { label: 'Red Card', points: '-3' },
  { label: 'Own Goal', points: '-3' },
  { label: 'Captain Bonus', points: 'x2' },
]
