import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Users, ShoppingCart, ArrowLeftRight, Radio, Trophy, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

const navItems = [
  { to: '/', label: 'My Team', icon: Users },
  { to: '/draft', label: 'Draft', icon: ShoppingCart },
  { to: '/trades', label: 'Trades', icon: ArrowLeftRight },
  { to: '/live', label: 'Live', icon: Radio },
  { to: '/leaderboard', label: 'League', icon: Trophy },
]

const adminItem = { to: '/admin', label: 'Admin', icon: Shield }

export function BottomNav() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [pendingTrades, setPendingTrades] = useState(0)

  useEffect(() => {
    if (!user) { setIsAdmin(false); setPendingTrades(0); return }
    supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setIsAdmin(data?.is_admin ?? false))

    // Check pending incoming trades
    supabase
      .from('trades')
      .select('id', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('status', 'pending')
      .then(({ count }) => setPendingTrades(count ?? 0))

    // Subscribe to trade changes
    const channel = supabase
      .channel('trade-badges')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trades' }, () => {
        supabase
          .from('trades')
          .select('id', { count: 'exact', head: true })
          .eq('receiver_id', user!.id)
          .eq('status', 'pending')
          .then(({ count }) => setPendingTrades(count ?? 0))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  const items = isAdmin ? [...navItems, adminItem] : navItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card" aria-label="Main navigation">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'relative flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors',
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            <span>{item.label}</span>
            {item.to === '/trades' && pendingTrades > 0 && (
              <span className="absolute top-1 right-1/4 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                {pendingTrades}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
