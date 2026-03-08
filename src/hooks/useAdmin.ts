import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Profile, DraftSession, Matchday, Match, Player, Club, PlayerScore } from '@/types'

export function useAdmin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        setIsAdmin(data?.is_admin ?? false)
      } catch {
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  return { isAdmin, loading }
}

// ---- Draft Management ----
export function useDraftAdmin() {
  const [sessions, setSessions] = useState<DraftSession[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [sessRes, usersRes] = await Promise.all([
      supabase.from('draft_sessions').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('display_name'),
    ])
    setSessions(sessRes.data ?? [])
    setUsers(usersRes.data ?? [])
    setLoading(false)
  }, [])

  const createDraft = useCallback(async (type: 'initial' | 'waiver', pickOrder: string[], matchdayId?: number, name?: string) => {
    await supabase.from('draft_sessions').insert({
      type,
      pick_order: pickOrder,
      matchday_id: matchdayId || null,
      status: 'pending',
      name: name?.trim() || null,
    })
    load()
  }, [load])

  const updateStatus = useCallback(async (id: number, status: DraftSession['status']) => {
    const updates: Record<string, unknown> = { status }
    if (status === 'active') updates.started_at = new Date().toISOString()
    await supabase.from('draft_sessions').update(updates).eq('id', id)
    load()
  }, [load])

  const renameDraft = useCallback(async (id: number, name: string) => {
    await supabase.from('draft_sessions').update({ name: name.trim() || null }).eq('id', id)
    load()
  }, [load])

  const deleteDraft = useCallback(async (id: number) => {
    await supabase.from('draft_picks').delete().eq('draft_session_id', id)
    await supabase.from('draft_sessions').delete().eq('id', id)
    load()
  }, [load])

  useEffect(() => { load() }, [load])
  return { sessions, users, loading, createDraft, updateStatus, renameDraft, deleteDraft, reload: load }
}

// ---- Matchday Management ----
export function useMatchdayAdmin() {
  const [matchdays, setMatchdays] = useState<Matchday[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [mdRes, matchRes, clubRes] = await Promise.all([
      supabase.from('matchdays').select('*').order('first_kickoff', { ascending: true }),
      supabase.from('matches').select('*, home_club:clubs!home_club_id(*), away_club:clubs!away_club_id(*)').order('kickoff_at'),
      supabase.from('clubs').select('*').order('name'),
    ])
    setMatchdays(mdRes.data ?? [])
    setMatches(matchRes.data ?? [])
    setClubs(clubRes.data ?? [])
    setLoading(false)
  }, [])

  const createMatchday = useCallback(async (name: string, firstKickoff: string) => {
    const kickoff = new Date(firstKickoff)
    const lockAt = new Date(kickoff.getTime() - 30 * 60 * 1000)
    const tradeDeadline = new Date(kickoff.getTime() - 12 * 60 * 60 * 1000)
    await supabase.from('matchdays').insert({
      name,
      first_kickoff: kickoff.toISOString(),
      lineup_lock_at: lockAt.toISOString(),
      trade_deadline_at: tradeDeadline.toISOString(),
    })
    load()
  }, [load])

  const updateMatchdayStatus = useCallback(async (id: number, status: Matchday['status']) => {
    const updates: Record<string, unknown> = { status }
    if (status === 'completed') {
      const now = new Date()
      updates.last_whistle = now.toISOString()
      updates.waiver_draft_ends_at = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString()
      updates.lineup_window_opens_at = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    }
    // Snapshot all squads when matchday goes live
    if (status === 'live') {
      const { data: allSquads } = await supabase
        .from('squad_players')
        .select('user_id, player_id, is_starter, is_captain, is_vice_captain')
      if (allSquads && allSquads.length > 0) {
        await supabase.from('squad_snapshots').upsert(
          allSquads.map((sp) => ({
            matchday_id: id,
            user_id: sp.user_id,
            player_id: sp.player_id,
            is_starter: sp.is_starter,
            is_captain: sp.is_captain,
            is_vice_captain: sp.is_vice_captain,
          })),
          { onConflict: 'matchday_id,user_id,player_id' }
        )
      }
    }
    await supabase.from('matchdays').update(updates).eq('id', id)
    load()
  }, [load])

  const addMatch = useCallback(async (matchdayId: number, homeClubId: number, awayClubId: number, kickoffAt: string, dayLabel: string) => {
    await supabase.from('matches').insert({
      matchday_id: matchdayId,
      home_club_id: homeClubId,
      away_club_id: awayClubId,
      kickoff_at: kickoffAt,
      match_day_label: dayLabel,
    })
    load()
  }, [load])

  const updateMatch = useCallback(async (id: number, updates: Partial<Match>) => {
    await supabase.from('matches').update(updates).eq('id', id)
    load()
  }, [load])

  useEffect(() => { load() }, [load])
  return { matchdays, matches, clubs, loading, createMatchday, updateMatchdayStatus, addMatch, updateMatch, reload: load }
}

// ---- Score Management ----
export function useScoreAdmin() {
  const [scores, setScores] = useState<PlayerScore[]>([])
  const [matchdays, setMatchdays] = useState<Matchday[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [scoresRes, mdRes, matchRes] = await Promise.all([
      supabase.from('player_scores').select('*, player:players(*, club:clubs(*))').order('total_points', { ascending: false }),
      supabase.from('matchdays').select('*').order('first_kickoff', { ascending: true }),
      supabase.from('matches').select('*, home_club:clubs!home_club_id(*), away_club:clubs!away_club_id(*)').order('kickoff_at'),
    ])
    setScores(scoresRes.data ?? [])
    setMatchdays(mdRes.data ?? [])
    setMatches(matchRes.data ?? [])
    setLoading(false)
  }, [])

  const updateScore = useCallback(async (id: number, updates: Partial<PlayerScore>) => {
    await supabase.from('player_scores').update({ ...updates, is_manual_correction: true }).eq('id', id)
    load()
  }, [load])

  const recalcPoints = useCallback(async (scoreId: number, totalPoints: number) => {
    await supabase.from('player_scores').update({ total_points: totalPoints, is_manual_correction: true }).eq('id', scoreId)
    load()
  }, [load])

  const generateScoresForMatch = useCallback(async (matchId: number, matchdayId: number, homeClubId: number, awayClubId: number) => {
    // Get all players from both clubs
    const { data: players } = await supabase
      .from('players')
      .select('id')
      .in('club_id', [homeClubId, awayClubId])
      .eq('is_available', true)

    if (!players?.length) return

    // Check which players already have scores for this match
    const { data: existing } = await supabase
      .from('player_scores')
      .select('player_id')
      .eq('match_id', matchId)

    const existingIds = new Set((existing ?? []).map((e) => e.player_id))
    const newPlayers = players.filter((p) => !existingIds.has(p.id))

    if (newPlayers.length === 0) return

    await supabase.from('player_scores').insert(
      newPlayers.map((p) => ({
        player_id: p.id,
        matchday_id: matchdayId,
        match_id: matchId,
      }))
    )
    load()
  }, [load])

  useEffect(() => { load() }, [load])
  return { scores, matchdays, matches, loading, updateScore, recalcPoints, generateScoresForMatch, reload: load }
}

// ---- Player/Club Management ----
export function usePlayerAdmin() {
  const [players, setPlayers] = useState<Player[]>([])
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [pRes, cRes] = await Promise.all([
      supabase.from('players').select('*, club:clubs(*)').order('name'),
      supabase.from('clubs').select('*').order('name'),
    ])
    setPlayers(pRes.data ?? [])
    setClubs(cRes.data ?? [])
    setLoading(false)
  }, [])

  const addClub = useCallback(async (name: string, shortName: string) => {
    await supabase.from('clubs').insert({ name, short_name: shortName })
    load()
  }, [load])

  const addPlayer = useCallback(async (name: string, position: string, clubId: number) => {
    await supabase.from('players').insert({ name, position, club_id: clubId })
    load()
  }, [load])

  const toggleAvailability = useCallback(async (id: number, available: boolean) => {
    await supabase.from('players').update({ is_available: available }).eq('id', id)
    load()
  }, [load])

  useEffect(() => { load() }, [load])
  return { players, clubs, loading, addClub, addPlayer, toggleAvailability, reload: load }
}
