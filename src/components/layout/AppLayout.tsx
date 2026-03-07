import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-40 border-b bg-primary text-primary-foreground">
        <div className="mx-auto flex h-14 max-w-lg items-center px-4">
          <h1 className="text-lg font-bold tracking-tight">The Blue Eagle</h1>
          <span className="ml-2 text-sm opacity-80">| העיט הכחול</span>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
