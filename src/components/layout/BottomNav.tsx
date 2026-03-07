import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Users, ShoppingCart, ArrowLeftRight, Radio, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

const navItems = [
  { to: '/', label: 'My Team', icon: Users },
  { to: '/draft', label: 'Draft', icon: ShoppingCart },
  { to: '/trades', label: 'Trades', icon: ArrowLeftRight },
  { to: '/live', label: 'Live', icon: Radio },
]

const adminItem = { to: '/admin', label: 'Admin', icon: Shield }

export function BottomNav() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user) { setIsAdmin(false); return }
    supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setIsAdmin(data?.is_admin ?? false))
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
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors',
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
