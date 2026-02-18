import { TicketStatus } from '@/lib/types'

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bg: string; border: string }> = {
  open: {
    label: 'Open',
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.1)',
    border: 'rgba(74,222,128,0.22)',
  },
  'in-progress': {
    label: 'In Progress',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.1)',
    border: 'rgba(96,165,250,0.22)',
  },
  pending: {
    label: 'Pending',
    color: '#ff7a3d',
    bg: 'rgba(255,122,61,0.1)',
    border: 'rgba(255,122,61,0.22)',
  },
  closed: {
    label: 'Closed',
    color: '#54504a',
    bg: 'rgba(84,80,74,0.15)',
    border: 'rgba(84,80,74,0.22)',
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
