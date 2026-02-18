import { Ticket } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'
import { timeAgo } from '@/lib/utils'
import StatusBadge from './StatusBadge'

interface TicketCardProps {
  ticket: Ticket
  onClick: () => void
  showAuthor?: boolean
}

const PRIORITY_COLOR: Record<string, string> = {
  high: '#c47a6a',
  medium: '#d4a853',
  low: '#7fb069',
}

export default function TicketCard({ ticket, onClick, showAuthor }: TicketCardProps) {
  const category = CATEGORIES.find((c) => c.id === ticket.category) ?? CATEGORIES[5]

  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 cursor-pointer transition-all duration-200 active:opacity-80"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '14px',
      }}
    >
      {/* Category icon */}
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: category.colorDim,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          flexShrink: 0,
        }}
      >
        {category.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--text-1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {ticket.title}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '3px' }}>
          {showAuthor ? `${ticket.author} · ` : ''}
          {timeAgo(ticket.created_at)} · {category.name}
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <StatusBadge status={ticket.status} />
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: PRIORITY_COLOR[ticket.priority],
            opacity: 0.8,
          }}
          title={`${ticket.priority} priority`}
        />
      </div>
    </div>
  )
}
