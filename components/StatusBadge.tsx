import { TicketStatus } from '@/lib/types'

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bg: string; border: string }> = {
  open: {
    label: 'Open',
    color: '#7fb069',
    bg: 'rgba(127,176,105,0.12)',
    border: 'rgba(127,176,105,0.25)',
  },
  'in-progress': {
    label: 'In Progress',
    color: '#6a94c4',
    bg: 'rgba(106,148,196,0.12)',
    border: 'rgba(106,148,196,0.25)',
  },
  pending: {
    label: 'Pending',
    color: '#d4a853',
    bg: 'rgba(212,168,83,0.12)',
    border: 'rgba(212,168,83,0.3)',
  },
  closed: {
    label: 'Closed',
    color: '#7a6245',
    bg: 'rgba(122,98,69,0.15)',
    border: 'rgba(122,98,69,0.2)',
  },
}

interface StatusBadgeProps {
  status: TicketStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 9px',
        borderRadius: '999px',
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  )
}
