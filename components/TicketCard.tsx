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
  high:   'var(--red)',
  medium: 'var(--peach)',
  low:    'var(--green)',
}

export default function TicketCard({ ticket, onClick, showAuthor }: TicketCardProps) {
  const category = CATEGORIES.find((c) => c.id === ticket.category) ?? CATEGORIES[5]

  return (
    <div
      onClick={onClick}
      className="list-item animate-entry cursor-pointer transition-colors duration-150"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}
      onMouseDown={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
      onMouseUp={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
      onTouchStart={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
      onTouchEnd={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'var(--font-outfit)',
            color: 'var(--text-1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '6px',
          }}
        >
          {ticket.title}
        </div>
        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-3)',
              background: 'var(--card)',
              padding: '2px 6px',
              borderRadius: 'var(--radius)',
              letterSpacing: '0.5px',
            }}
          >
            {category.name.toLowerCase()}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 300,
              color: 'var(--text-3)',
            }}
          >
            {showAuthor ? `${ticket.author.toLowerCase()} · ` : ''}
            {timeAgo(ticket.created_at)}
          </span>
        </div>
      </div>

      {/* Right */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '6px',
          flexShrink: 0,
        }}
      >
        <StatusBadge status={ticket.status} />
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: PRIORITY_COLOR[ticket.priority],
          }}
          title={`${ticket.priority} priority`}
        />
      </div>
    </div>
  )
}
