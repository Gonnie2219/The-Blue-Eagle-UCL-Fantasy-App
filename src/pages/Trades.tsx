import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useTrades } from '@/hooks/useTrades'
import { TradeCard } from '@/components/trades/TradeCard'
import { NewTradeForm } from '@/components/trades/NewTradeForm'
import { TransferPanel } from '@/components/trades/TransferPanel'

type Tab = 'incoming' | 'outgoing' | 'new' | 'transfers'

export default function Trades() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('incoming')
  const { incoming, outgoing, allUsers, loading, submitting, proposeTrade, respondToTrade } = useTrades()

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'incoming', label: 'Incoming', count: incoming.length },
    { id: 'outgoing', label: 'Outgoing', count: outgoing.length },
    { id: 'new', label: 'New Trade' },
    { id: 'transfers', label: 'Transfers' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Trade Market</h2>

      {/* Tab bar */}
      <div className="flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors',
              tab === t.id
                ? 'bg-primary text-primary-foreground'
                : 'border text-muted-foreground hover:bg-accent'
            )}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={cn(
                'ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px]',
                tab === t.id ? 'bg-primary-foreground/20' : 'bg-primary/10 text-primary'
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {loading ? (
        <div className="py-8 text-center text-muted-foreground">Loading...</div>
      ) : (
        <>
          {tab === 'incoming' && (
            <div className="space-y-2">
              {incoming.length === 0 ? (
                <div className="rounded-lg border bg-card p-6 text-center">
                  <p className="text-muted-foreground">No incoming trade proposals.</p>
                </div>
              ) : (
                incoming.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    currentUserId={user!.id}
                    onAccept={() => respondToTrade(trade.id, true)}
                    onReject={() => respondToTrade(trade.id, false)}
                    submitting={submitting}
                  />
                ))
              )}
            </div>
          )}

          {tab === 'outgoing' && (
            <div className="space-y-2">
              {outgoing.length === 0 ? (
                <div className="rounded-lg border bg-card p-6 text-center">
                  <p className="text-muted-foreground">No outgoing trade proposals.</p>
                </div>
              ) : (
                outgoing.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    currentUserId={user!.id}
                  />
                ))
              )}
            </div>
          )}

          {tab === 'new' && (
            <NewTradeForm
              users={allUsers}
              onPropose={proposeTrade}
              submitting={submitting}
            />
          )}

          {tab === 'transfers' && <TransferPanel />}
        </>
      )}
    </div>
  )
}
