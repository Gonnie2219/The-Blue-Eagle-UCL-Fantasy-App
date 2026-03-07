import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import Login from '@/pages/Login'
import MyTeam from '@/pages/MyTeam'
import Draft from '@/pages/Draft'
import Trades from '@/pages/Trades'
import Live from '@/pages/Live'
import Admin from '@/pages/Admin'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<MyTeam />} />
        <Route path="/draft" element={<Draft />} />
        <Route path="/trades" element={<Trades />} />
        <Route path="/live" element={<Live />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
