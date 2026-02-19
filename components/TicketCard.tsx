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
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}
      onMouseDown={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--accent)'
      }}
      onMouseUp={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border)'
      }}
      onTouchStart={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--accent)'
      }}
      onTouchEnd={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border)'
      }}
    >
      {/* Category icon */}
      <div
        style={{
          width: '36px',
          height: '36px',
          flexShrink: 0,
          background: 'var(--surface)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
        }}
      >
        {category.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: 500,
            fontFamily: 'var(--font-outfit)',
            color: 'var(--text-1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {ticket.title}
        </div>
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-outfit)',
            fontWeight: 300,
            color: 'var(--text-3)',
            marginTop: '3px',
          }}
        >
          {showAuthor ? `${ticket.author} · ` : ''}
          {timeAgo(ticket.created_at)} · {category.name}
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
