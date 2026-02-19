interface StatCardProps {
  value: number
  label: string
  color: string
}

export default function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '6px',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: '20px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 400,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-3)',
        }}
      >
        {label.toLowerCase()}
      </span>
    </div>
  )
}
