import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useDraftAdmin } from '@/hooks/useAdmin'

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-orange-100 text-orange-800',
  completed: 'bg-gray-100 text-gray-800',
}

export function DraftManager() {
  const { sessions, users, loading, createDraft, updateStatus } = useDraftAdmin()
  const [showCreate, setShowCreate] = useState(false)
  const [draftType, setDraftType] = useState<'initial' | 'waiver'>('initial')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    )
  }

  const handleCreate = () => {
    if (selectedUsers.length < 2) return
    createDraft(draftType, selectedUsers)
    setShowCreate(false)
    setSelectedUsers([])
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Draft Sessions</p>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
        >
          {showCreate ? 'Cancel' : 'New Draft'}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="space-y-3 rounded-lg border bg-card p-3">
          <div>
            <p className="mb-1 text-xs font-semibold">Type</p>
            <div className="flex gap-2">
              {(['initial', 'waiver'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setDraftType(t)}
                  className={cn(
                    'flex-1 rounded-md py-1.5 text-xs font-medium',
                    draftType === t ? 'bg-primary text-primary-foreground' : 'border hover:bg-accent'
                  )}
                >
                  {t === 'initial' ? 'Initial Draft' : 'Waiver Draft'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold">Pick Order (tap to add in order)</p>
            <div className="flex flex-wrap gap-1">
              {users.map((u) => {
                const idx = selectedUsers.indexOf(u.id)
                return (
                  <button
                    key={u.id}
                    onClick={() => toggleUser(u.id)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                      idx >= 0 ? 'bg-primary text-primary-foreground' : 'border hover:bg-accent'
                    )}
                  >
                    {idx >= 0 && <span className="mr-1">{idx + 1}.</span>}
                    {u.display_name}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={selectedUsers.length < 2}
            className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            Create Draft ({selectedUsers.length} players)
          </button>
        </div>
      )}

      {/* Existing sessions */}
      <div className="space-y-2">
        {sessions.map((s) => (
          <div key={s.id} className="rounded-lg border bg-card p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {s.type === 'initial' ? 'Initial' : 'Waiver'} Draft #{s.id}
                </span>
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', statusColors[s.status])}>
                  {s.status}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                R{s.current_round} P{s.current_pick}
              </span>
            </div>

            <div className="flex gap-1">
              {s.status === 'pending' && (
                <button
                  onClick={() => updateStatus(s.id, 'active')}
                  className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white"
                >
                  Start
                </button>
              )}
              {s.status === 'active' && (
                <button
                  onClick={() => updateStatus(s.id, 'paused')}
                  className="rounded-md bg-orange-500 px-3 py-1 text-xs font-medium text-white"
                >
                  Pause
                </button>
              )}
              {s.status === 'paused' && (
                <button
                  onClick={() => updateStatus(s.id, 'active')}
                  className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white"
                >
                  Resume
                </button>
              )}
              {(s.status === 'active' || s.status === 'paused') && (
                <button
                  onClick={() => updateStatus(s.id, 'completed')}
                  className="rounded-md bg-gray-500 px-3 py-1 text-xs font-medium text-white"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
        {sessions.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">No draft sessions yet.</p>
        )}
      </div>
    </div>
  )
}
