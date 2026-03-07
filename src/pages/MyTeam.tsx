import { useAuth } from '@/contexts/AuthContext'
import { SquadManager } from '@/components/squad/SquadManager'

export default function MyTeam() {
  const { user, signOut } = useAuth()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Squad</h2>
        <button
          onClick={signOut}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {user?.email}
        </button>
      </div>
      <SquadManager />
    </div>
  )
}
