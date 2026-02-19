import { TicketStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: TicketStatus
}

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string }> = {
  open:          { label: 'open',        color: 'var(--green)'  },
  'in-progress': { label: 'in progress', color: 'var(--blue)'   },
  pending:       { label: 'pending',     color: 'var(--yellow)' },
  closed:        { label: 'closed',      color: 'var(--text-3)' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.open

  return (
    <span
      style={{
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 400,
        color: config.color,
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  )
}
