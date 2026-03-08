import { createContext, useContext, useState, type ReactNode } from 'react'

interface PlayerStatsContextType {
  selectedPlayerId: number | null
  openPlayerStats: (playerId: number) => void
  close: () => void
}

const PlayerStatsContext = createContext<PlayerStatsContextType>({
  selectedPlayerId: null,
  openPlayerStats: () => {},
  close: () => {},
})

export function PlayerStatsProvider({ children }: { children: ReactNode }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)

  return (
    <PlayerStatsContext.Provider
      value={{
        selectedPlayerId,
        openPlayerStats: setSelectedPlayerId,
        close: () => setSelectedPlayerId(null),
      }}
    >
      {children}
    </PlayerStatsContext.Provider>
  )
}

export const usePlayerStats = () => useContext(PlayerStatsContext)
