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
      className="list-item animate-entry cursor-pointer"
      style={{
        padding: '14px 0',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      {/* Left accent */}
      <div
        style={{
          width: '3px',
          height: '36px',
          background: PRIORITY_COLOR[ticket.priority],
          borderRadius: '2px',
          flexShrink: 0,
          marginTop: '2px',
        }}
      />

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
            marginBottom: '4px',
          }}
        >
          {ticket.title}
        </div>
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 400,
            color: 'var(--text-3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{category.name.toLowerCase()}</span>
          <span style={{ color: 'var(--border)' }}>/</span>
          {showAuthor && (
            <>
              <span>{ticket.author.toLowerCase()}</span>
              <span style={{ color: 'var(--border)' }}>/</span>
            </>
          )}
          <span>{timeAgo(ticket.created_at)}</span>
        </div>
      </div>

      {/* Status */}
      <div style={{ flexShrink: 0, paddingTop: '2px' }}>
        <StatusBadge status={ticket.status} />
      </div>
    </div>
  )
}
