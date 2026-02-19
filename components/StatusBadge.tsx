import { TicketStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: TicketStatus
}

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  open:          { label: 'Open',        color: 'var(--green)',  bg: 'var(--green-dim)'  },
  'in-progress': { label: 'In Progress', color: 'var(--blue)',   bg: 'var(--blue-dim)'   },
  pending:       { label: 'Pending',     color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
  closed:        { label: 'Closed',      color: 'var(--text-3)', bg: 'var(--surface)'    },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.open

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: 'var(--radius)',
        fontSize: '10px',
        fontWeight: 500,
        fontFamily: 'var(--font-mono)',
        color: config.color,
        background: config.bg,
        whiteSpace: 'nowrap',
        letterSpacing: '0.3px',
      }}
    >
      {config.label}
    </span>
  )
}
