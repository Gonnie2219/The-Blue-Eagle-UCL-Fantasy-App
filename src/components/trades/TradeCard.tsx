import { ArrowRightLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { formatDistanceToNow } from 'date-fns'
import type { Trade } from '@/types'

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-800',
}

interface TradeCardProps {
  trade: Trade
  currentUserId: string
  onAccept?: () => void
  onReject?: () => void
  submitting?: boolean
}

export function TradeCard({ trade, currentUserId, onAccept, onReject, submitting }: TradeCardProps) {
  const isIncoming = trade.receiver_id === currentUserId
  const otherUser = isIncoming ? trade.proposer : trade.receiver
  const giving = (trade.trade_players ?? []).filter((tp) => tp.from_user_id === currentUserId)
  const receiving = (trade.trade_players ?? []).filter((tp) => tp.to_user_id === currentUserId)

  return (
    <div className="rounded-lg border bg-card p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {isIncoming ? 'From' : 'To'}: <span className="text-primary">{otherUser?.display_name}</span>
        </p>
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', statusColors[trade.status])}>
          {trade.status}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* You give */}
        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase">You give</p>
          {giving.map((tp) => (
            <div key={tp.id} className="flex items-center gap-1">
              <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[tp.player?.position ?? ''])}>
                {tp.player?.position}
              </span>
              <span className="text-xs truncate">{tp.player?.name}</span>
            </div>
          ))}
        </div>

        <ArrowRightLeft className="h-4 w-4 shrink-0 text-muted-foreground" />

        {/* You receive */}
        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase">You get</p>
          {receiving.map((tp) => (
            <div key={tp.id} className="flex items-center gap-1">
              <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[tp.player?.position ?? ''])}>
                {tp.player?.position}
              </span>
              <span className="text-xs truncate">{tp.player?.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {formatDistanceToNow(new Date(trade.proposed_at), { addSuffix: true })}
        </span>

        {isIncoming && trade.status === 'pending' && (
          <div className="flex gap-1">
            <button
              onClick={onReject}
              disabled={submitting}
              className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-accent disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={onAccept}
              disabled={submitting}
              className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
