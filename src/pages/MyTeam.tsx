import { SquadManager } from '@/components/squad/SquadManager'
import { DeadlineCountdown } from '@/components/layout/DeadlineCountdown'

export default function MyTeam() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">My Squad</h2>
      <DeadlineCountdown />
      <SquadManager />
    </div>
  )
}
