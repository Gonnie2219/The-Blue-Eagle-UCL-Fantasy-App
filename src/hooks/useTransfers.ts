import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Player, Profile } from '@/types'

export function useTransfers() {
  const { user } = useAuth()
  const [freeAgents, setFreeAgents] = useState<Player[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const loadFreeAgents = useCallback(async () => {
    if (!user) return
    setLoading(true)

    // Get all owned player IDs
    const { data: owned } = await supabase
      .from('squad_players')
      .select('player_id')

    const ownedIds = new Set((owned ?? []).map((o) => o.player_id))

    // Get all available players not owned by anyone
    const { data: players } = await supabase
      .from('players')
      .select('*, club:clubs(*)')
      .eq('is_available', true)
      .order('position')
      .order('name')

    setFreeAgents((players ?? []).filter((p) => !ownedIds.has(p.id)))

    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(prof)
    setLoading(false)
  }, [user])

  const makeTransfer = useCallback(
    async (playerInId: number, playerOutId: number) => {
      if (!user) return
      setSubmitting(true)

      const { error } = await supabase.rpc('rpc_make_transfer', {
        p_user_id: user.id,
        p_player_in_id: playerInId,
        p_player_out_id: playerOutId,
      })

      if (error) {
        console.error('Transfer failed:', error.message)
      }

      setSubmitting(false)
      loadFreeAgents()
    },
    [user, loadFreeAgents]
  )

  useEffect(() => { loadFreeAgents() }, [loadFreeAgents])

  return { freeAgents, profile, loading, submitting, makeTransfer, loadFreeAgents }
}
