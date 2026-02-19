import { TicketStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: TicketStatus
}

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  open:        { label: 'Open',        color: 'var(--green)',  bg: 'var(--green-dim)'  },
  'in-progress': { label: 'In Progress', color: 'var(--blue)',   bg: 'var(--blue-dim)'   },
  pending:     { label: 'Pending',     color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
  closed:      { label: 'Closed',      color: 'var(--text-3)', bg: 'var(--surface)'    },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.open

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 500,
        fontFamily: 'var(--font-outfit)',
        color: config.color,
        background: config.bg,
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  )
}
