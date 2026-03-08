import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { SquadPlayer, Profile } from '@/types'

export function useSquad() {
  const { user } = useAuth()
  const [squad, setSquad] = useState<SquadPlayer[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const starters = squad.filter((s) => s.is_starter)
  const bench = squad.filter((s) => !s.is_starter)
  const captain = squad.find((s) => s.is_captain) ?? null
  const viceCaptain = squad.find((s) => s.is_vice_captain) ?? null

  const loadSquad = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [squadRes, profileRes] = await Promise.all([
      supabase
        .from('squad_players')
        .select('*, player:players(*, club:clubs(*))')
        .eq('user_id', user.id)
        .order('is_starter', { ascending: false }),
      supabase.from('profiles').select('*').eq('id', user.id).single(),
    ])

    setSquad(squadRes.data ?? [])
    setProfile(profileRes.data)
    setLoading(false)
  }, [user])

  const toggleStarter = useCallback(
    async (squadPlayerId: number, isStarter: boolean) => {
      await supabase
        .from('squad_players')
        .update({ is_starter: isStarter })
        .eq('id', squadPlayerId)
      loadSquad()
    },
    [loadSquad]
  )

  const setCaptain = useCallback(
    async (squadPlayerId: number) => {
      if (!user) return
      await supabase.rpc('rpc_set_captain', {
        p_user_id: user.id,
        p_squad_player_id: squadPlayerId,
      })
      loadSquad()
    },
    [user, loadSquad]
  )

  const setViceCaptain = useCallback(
    async (squadPlayerId: number) => {
      if (!user) return
      await supabase.rpc('rpc_set_vice_captain', {
        p_user_id: user.id,
        p_squad_player_id: squadPlayerId,
      })
      loadSquad()
    },
    [user, loadSquad]
  )

  const unsetCaptain = useCallback(
    async (squadPlayerId: number) => {
      await supabase.from('squad_players').update({ is_captain: false }).eq('id', squadPlayerId)
      loadSquad()
    },
    [loadSquad]
  )

  const unsetViceCaptain = useCallback(
    async (squadPlayerId: number) => {
      await supabase.from('squad_players').update({ is_vice_captain: false }).eq('id', squadPlayerId)
      loadSquad()
    },
    [loadSquad]
  )

  useEffect(() => {
    loadSquad()
  }, [loadSquad])

  return {
    squad,
    starters,
    bench,
    captain,
    viceCaptain,
    profile,
    loading,
    toggleStarter,
    setCaptain,
    setViceCaptain,
    unsetCaptain,
    unsetViceCaptain,
    reload: loadSquad,
  }
}

// Validate formation: 1 GK, 3-5 DEF, 3-5 MID, 1-3 FWD
export function validateFormation(starters: SquadPlayer[]): string | null {
  const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 }
  for (const s of starters) {
    if (s.player) counts[s.player.position]++
  }

  if (counts.GK !== 1) return 'Must have exactly 1 GK'
  if (counts.DEF < 3 || counts.DEF > 5) return 'Must have 3-5 DEF'
  if (counts.MID < 3 || counts.MID > 5) return 'Must have 3-5 MID'
  if (counts.FWD < 1 || counts.FWD > 3) return 'Must have 1-3 FWD'
  if (starters.length !== 11) return 'Must have exactly 11 starters'
  return null
}
