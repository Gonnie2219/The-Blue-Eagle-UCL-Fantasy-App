import { createContext, useContext, useState, type ReactNode } from 'react'

interface DraftPickAction {
  canPick: boolean
  picking: boolean
  onPick: (playerId: number) => void
}

interface PlayerStatsContextType {
  selectedPlayerId: number | null
  openPlayerStats: (playerId: number) => void
  close: () => void
  draftPick: DraftPickAction | null
  setDraftPick: (action: DraftPickAction | null) => void
}

const PlayerStatsContext = createContext<PlayerStatsContextType>({
  selectedPlayerId: null,
  openPlayerStats: () => {},
  close: () => {},
  draftPick: null,
  setDraftPick: () => {},
})

export function PlayerStatsProvider({ children }: { children: ReactNode }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [draftPick, setDraftPick] = useState<DraftPickAction | null>(null)

  return (
    <PlayerStatsContext.Provider
      value={{
        selectedPlayerId,
        openPlayerStats: setSelectedPlayerId,
        close: () => setSelectedPlayerId(null),
        draftPick,
        setDraftPick,
      }}
    >
      {children}
    </PlayerStatsContext.Provider>
  )
}

export const usePlayerStats = () => useContext(PlayerStatsContext)
