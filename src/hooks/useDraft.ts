import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { DraftSession, DraftPick, Player, Profile } from '@/types'

export function useDraft() {
  const { user } = useAuth()
  const [session, setSession] = useState<DraftSession | null>(null)
  const [picks, setPicks] = useState<DraftPick[]>([])
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([])
  const [participants, setParticipants] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [picking, setPicking] = useState(false)

  const currentPickerIndex = session
    ? getSnakeIndex(session.current_pick, session.pick_order.length)
    : -1
  const currentPickerUserId = session?.pick_order[currentPickerIndex] ?? null
  const isMyTurn = currentPickerUserId === user?.id && session?.status === 'active'

  // Load active draft session
  const loadDraft = useCallback(async () => {
    setLoading(true)
    const { data: sessions } = await supabase
      .from('draft_sessions')
      .select('*')
      .in('status', ['active', 'pending'])
      .order('created_at', { ascending: false })
      .limit(1)

    const active = sessions?.[0] ?? null
    setSession(active)

    if (active) {
      const [picksRes, playersRes, profilesRes] = await Promise.all([
        supabase
          .from('draft_picks')
          .select('*, player:players(*), profile:profiles(display_name)')
          .eq('draft_session_id', active.id)
          .order('pick_number', { ascending: true }),
        supabase
          .from('players')
          .select('*, club:clubs(*)')
          .eq('is_available', true)
          .order('position')
          .order('name'),
        supabase
          .from('profiles')
          .select('*')
          .in('id', active.pick_order),
      ])

      const pickedPlayerIds = new Set(
        (picksRes.data ?? []).map((p) => p.player_id)
      )

      setPicks(picksRes.data ?? [])
      setAvailablePlayers(
        (playersRes.data ?? []).filter((p) => !pickedPlayerIds.has(p.id))
      )
      setParticipants(profilesRes.data ?? [])
    }

    setLoading(false)
  }, [])

  // Make a pick
  const makePick = useCallback(
    async (playerId: number) => {
      if (!session || !user || !isMyTurn) return

      setPicking(true)
      const { error } = await supabase.rpc('rpc_make_draft_pick', {
        p_session_id: session.id,
        p_user_id: user.id,
        p_player_id: playerId,
        p_round: session.current_round,
        p_pick_number: session.current_pick,
      })

      if (error) {
        console.error('Draft pick failed:', error.message)
      }

      setPicking(false)
    },
    [session, user, isMyTurn]
  )

  // Subscribe to realtime changes
  useEffect(() => {
    loadDraft()

    const channel = supabase
      .channel('draft-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'draft_picks' },
        () => loadDraft()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'draft_sessions' },
        () => loadDraft()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadDraft])

  return {
    session,
    picks,
    availablePlayers,
    participants,
    loading,
    picking,
    isMyTurn,
    currentPickerUserId,
    currentPickerIndex,
    makePick,
    reload: loadDraft,
  }
}

// Snake draft index: round 1 goes 0,1,2... round 2 goes ...2,1,0
function getSnakeIndex(pickNumber: number, totalPickers: number): number {
  if (totalPickers === 0) return -1
  const round = Math.floor(pickNumber / totalPickers)
  const posInRound = pickNumber % totalPickers
  return round % 2 === 0 ? posInRound : totalPickers - 1 - posInRound
}
