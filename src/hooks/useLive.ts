import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Matchday, Match, PlayerScore, SquadPlayer, ManualSub } from '@/types'

export function useLive() {
  const { user } = useAuth()
  const [matchday, setMatchday] = useState<Matchday | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [scores, setScores] = useState<PlayerScore[]>([])
  const [squad, setSquad] = useState<SquadPlayer[]>([])
  const [manualSubs, setManualSubs] = useState<ManualSub[]>([])
  const [loading, setLoading] = useState(true)

  const loadLive = useCallback(async () => {
    if (!user) return
    setLoading(true)

    // Get current or most recent matchday (live first, then upcoming)
    const { data: matchdays } = await supabase
      .from('matchdays')
      .select('*')
      .in('status', ['live', 'upcoming'])
      .order('first_kickoff', { ascending: true })
      .limit(1)

    const md = matchdays?.[0] ?? null
    setMatchday(md)

    if (md) {
      const [matchesRes, scoresRes, squadRes, subsRes] = await Promise.all([
        supabase
          .from('matches')
          .select('*, home_club:clubs!home_club_id(*), away_club:clubs!away_club_id(*)')
          .eq('matchday_id', md.id)
          .order('kickoff_at', { ascending: true }),
        supabase
          .from('player_scores')
          .select('*, player:players(*, club:clubs(*))')
          .eq('matchday_id', md.id),
        supabase
          .from('squad_players')
          .select('*, player:players(*, club:clubs(*))')
          .eq('user_id', user.id),
        supabase
          .from('manual_subs')
          .select('*, player_out:players!player_out_id(*), player_in:players!player_in_id(*)')
          .eq('user_id', user.id)
          .eq('matchday_id', md.id),
      ])

      setMatches(matchesRes.data ?? [])
      setScores(scoresRes.data ?? [])
      setSquad(squadRes.data ?? [])
      setManualSubs(subsRes.data ?? [])
    }

    setLoading(false)
  }, [user])

  const makeManualSub = useCallback(
    async (playerOutId: number, playerInId: number) => {
      if (!user || !matchday) return
      await supabase.from('manual_subs').insert({
        user_id: user.id,
        matchday_id: matchday.id,
        player_out_id: playerOutId,
        player_in_id: playerInId,
      })
      loadLive()
    },
    [user, matchday, loadLive]
  )

  // Realtime subscriptions for live updates
  useEffect(() => {
    loadLive()

    const channel = supabase
      .channel('live-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => loadLive())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'player_scores' }, () => loadLive())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matchdays' }, () => loadLive())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [loadLive])

  return { matchday, matches, scores, squad, manualSubs, loading, makeManualSub, reload: loadLive }
}
