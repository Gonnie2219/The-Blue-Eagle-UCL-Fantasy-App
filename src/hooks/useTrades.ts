import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Trade, Profile, SquadPlayer } from '@/types'

export function useTrades() {
  const { user } = useAuth()
  const [incoming, setIncoming] = useState<Trade[]>([])
  const [outgoing, setOutgoing] = useState<Trade[]>([])
  const [allUsers, setAllUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const loadTrades = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [inRes, outRes, usersRes] = await Promise.all([
      supabase
        .from('trades')
        .select('*, proposer:profiles!proposer_id(*), receiver:profiles!receiver_id(*), trade_players(*, player:players(*, club:clubs(*)))')
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .order('proposed_at', { ascending: false }),
      supabase
        .from('trades')
        .select('*, proposer:profiles!proposer_id(*), receiver:profiles!receiver_id(*), trade_players(*, player:players(*, club:clubs(*)))')
        .eq('proposer_id', user.id)
        .order('proposed_at', { ascending: false }),
      supabase.from('profiles').select('*').neq('id', user.id),
    ])

    setIncoming(inRes.data ?? [])
    setOutgoing(outRes.data ?? [])
    setAllUsers(usersRes.data ?? [])
    setLoading(false)
  }, [user])

  const proposeTrade = useCallback(
    async (receiverId: string, myPlayerId: number, theirPlayerId: number) => {
      if (!user) return
      setSubmitting(true)

      // Pre-flight: verify both players are owned by expected users
      const [myCheck, theirCheck] = await Promise.all([
        supabase.from('squad_players').select('id').eq('user_id', user.id).eq('player_id', myPlayerId).single(),
        supabase.from('squad_players').select('id').eq('user_id', receiverId).eq('player_id', theirPlayerId).single(),
      ])

      if (myCheck.error || theirCheck.error) {
        setSubmitting(false)
        return
      }

      const { data: trade, error } = await supabase
        .from('trades')
        .insert({ proposer_id: user.id, receiver_id: receiverId })
        .select()
        .single()

      if (!error && trade) {
        await supabase.from('trade_players').insert([
          { trade_id: trade.id, player_id: myPlayerId, from_user_id: user.id, to_user_id: receiverId },
          { trade_id: trade.id, player_id: theirPlayerId, from_user_id: receiverId, to_user_id: user.id },
        ])
      }

      setSubmitting(false)
      loadTrades()
    },
    [user, loadTrades]
  )

  const respondToTrade = useCallback(
    async (tradeId: number, accept: boolean) => {
      if (!user) return
      setSubmitting(true)

      if (accept) {
        const { error } = await supabase.rpc('rpc_accept_trade', {
          p_trade_id: tradeId,
          p_user_id: user.id,
        })
        if (error) {
          console.error('Trade accept failed:', error.message)
        }
      } else {
        await supabase
          .from('trades')
          .update({ status: 'rejected', resolved_at: new Date().toISOString() })
          .eq('id', tradeId)
      }

      setSubmitting(false)
      loadTrades()
    },
    [user, loadTrades]
  )

  useEffect(() => {
    loadTrades()

    const channel = supabase
      .channel('trades-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trades' }, () => loadTrades())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [loadTrades])

  return { incoming, outgoing, allUsers, loading, submitting, proposeTrade, respondToTrade, reload: loadTrades }
}

export function useUserSquad(userId: string | null) {
  const [squad, setSquad] = useState<SquadPlayer[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) { setSquad([]); return }
    setLoading(true)
    const load = async () => {
      try {
        const { data } = await supabase
          .from('squad_players')
          .select('*, player:players(*, club:clubs(*))')
          .eq('user_id', userId)
        setSquad(data ?? [])
      } catch {
        setSquad([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  return { squad, loading }
}
