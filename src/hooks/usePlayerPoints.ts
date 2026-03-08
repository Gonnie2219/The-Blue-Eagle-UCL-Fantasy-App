import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

/** Fetches total season points for all players (cached per mount) */
export function usePlayerPoints() {
  const [pointsMap, setPointsMap] = useState<Map<number, number>>(new Map())

  useEffect(() => {
    supabase
      .from('player_scores')
      .select('player_id, total_points')
      .then(({ data }) => {
        const map = new Map<number, number>()
        for (const s of data ?? []) {
          map.set(s.player_id, (map.get(s.player_id) ?? 0) + s.total_points)
        }
        setPointsMap(map)
      })
  }, [])

  return pointsMap
}
