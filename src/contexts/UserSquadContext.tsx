import { createContext, useContext, useState, type ReactNode } from 'react'

interface UserSquadContextType {
  selectedUserId: string | null
  openUserSquad: (userId: string) => void
  close: () => void
}

const UserSquadContext = createContext<UserSquadContextType>({
  selectedUserId: null,
  openUserSquad: () => {},
  close: () => {},
})

export function UserSquadProvider({ children }: { children: ReactNode }) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  return (
    <UserSquadContext.Provider
      value={{
        selectedUserId,
        openUserSquad: setSelectedUserId,
        close: () => setSelectedUserId(null),
      }}
    >
      {children}
    </UserSquadContext.Provider>
  )
}

export const useUserSquad = () => useContext(UserSquadContext)
