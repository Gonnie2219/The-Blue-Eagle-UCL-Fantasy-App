import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { useAuth } from '@/contexts/AuthContext'

export function AppLayout() {
  const { user, profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-40 border-b bg-primary text-primary-foreground">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center">
            <h1 className="text-lg font-bold tracking-tight">The Blue Eagle</h1>
            <span className="ml-2 text-sm opacity-80">| העיט הכחול</span>
          </div>
          {user && (
            <div className="flex items-center gap-2 text-right">
              <div className="leading-tight">
                <p className="text-xs font-bold">{profile?.display_name ?? ''}</p>
                <p className="text-[10px] opacity-70">{user.email}</p>
              </div>
              <button
                onClick={signOut}
                className="rounded border border-primary-foreground/30 px-2 py-0.5 text-[10px] opacity-80 hover:opacity-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
