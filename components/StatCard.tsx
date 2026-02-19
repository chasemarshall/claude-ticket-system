interface StatCardProps {
  value: number
  label: string
  color: string
}

export default function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '999px',
        padding: '8px 16px',
        flexShrink: 0,
        minWidth: '72px',
      }}
    >
      <span
        style={{
          fontSize: '20px',
          fontWeight: 600,
          fontFamily: 'var(--font-outfit)',
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: '10px',
          fontWeight: 400,
          fontFamily: 'var(--font-outfit)',
          color: 'var(--text-2)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </span>
    </div>
  )
}
