export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD'

export interface Club {
  id: number
  name: string
  short_name: string
  logo_url: string | null
  ucl_stage: string
}

export interface Player {
  id: number
  ucl_id: string | null
  name: string
  position: PlayerPosition
  club_id: number
  is_available: boolean
  photo_url: string | null
  club?: Club
}

export interface SquadPlayer {
  id: number
  user_id: string
  player_id: number
  is_starter: boolean
  is_captain: boolean
  is_vice_captain: boolean
  squad_position: number | null
  player?: Player
}

export type DraftStatus = 'pending' | 'active' | 'paused' | 'completed'
export type DraftType = 'initial' | 'waiver'

export interface DraftSession {
  id: number
  matchday_id: number | null
  type: DraftType
  status: DraftStatus
  pick_order: string[]
  current_pick: number
  current_round: number
  is_snake: boolean
  pick_timeout_seconds: number
  started_at: string | null
  ends_at: string | null
}

export interface DraftPick {
  id: number
  draft_session_id: number
  user_id: string
  player_id: number
  round: number
  pick_number: number
  picked_at: string
  player?: Player
  profile?: { display_name: string }
}

export type TradeStatus = 'pending' | 'accepted' | 'rejected' | 'expired'

export interface TradePlayer {
  id: number
  trade_id: number
  player_id: number
  from_user_id: string
  to_user_id: string
  player?: Player
}

export interface Trade {
  id: number
  proposer_id: string
  receiver_id: string
  status: TradeStatus
  proposed_at: string
  resolved_at: string | null
  matchday_id: number | null
  proposer?: Profile
  receiver?: Profile
  trade_players?: TradePlayer[]
}

export interface Transfer {
  id: number
  user_id: string
  player_in_id: number
  player_out_id: number
  matchday_id: number | null
  is_free: boolean
  point_cost: number
  transferred_at: string
  player_in?: Player
  player_out?: Player
}

export interface Matchday {
  id: number
  name: string
  status: 'upcoming' | 'live' | 'completed'
  first_kickoff: string
  last_whistle: string | null
  lineup_lock_at: string | null
  waiver_draft_ends_at: string | null
  lineup_window_opens_at: string | null
  trade_deadline_at: string | null
}

export type MatchStatus = 'scheduled' | 'live' | 'finished'

export interface Match {
  id: number
  matchday_id: number
  home_club_id: number
  away_club_id: number
  kickoff_at: string
  home_score: number
  away_score: number
  status: MatchStatus
  match_day_label: string | null
  home_club?: Club
  away_club?: Club
}

export interface PlayerScore {
  id: number
  player_id: number
  matchday_id: number
  match_id: number
  minutes_played: number
  goals: number
  assists: number
  clean_sheet: boolean
  yellow_cards: number
  red_card: boolean
  penalties_won: number
  penalties_missed: number
  penalties_saved: number
  own_goals: number
  motm: boolean
  total_points: number
  is_manual_correction: boolean
  player?: Player
}

export interface ManualSub {
  id: number
  user_id: string
  matchday_id: number
  player_out_id: number
  player_in_id: number
  subbed_at: string
  player_out?: Player
  player_in?: Player
}

export interface Profile {
  id: string
  display_name: string
  is_admin: boolean
  total_points: number
  free_transfers: number
}
