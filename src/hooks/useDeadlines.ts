import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Matchday } from '@/types'

export function useDeadlines() {
  const [matchday, setMatchday] = useState<Matchday | null>(null)
  const [now, setNow] = useState(new Date())

  const load = useCallback(async () => {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    const { data } = await supabase
      .from('matchdays')
      .select('*')
      .gt('first_kickoff', sixHoursAgo)
      .order('first_kickoff', { ascending: true })
      .limit(1)
      .single()
    setMatchday(data)
  }, [])

  useEffect(() => { load() }, [load])

  // Tick every 30 seconds to keep deadline checks fresh
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(timer)
  }, [])

  const isTradeOpen = !matchday?.trade_deadline_at || now < new Date(matchday.trade_deadline_at)
  const isLineupLocked = !!matchday?.lineup_lock_at && now >= new Date(matchday.lineup_lock_at)
  const isTransferOpen = isTradeOpen // transfers share the trade deadline

  return { matchday, isTradeOpen, isLineupLocked, isTransferOpen, now }
}
