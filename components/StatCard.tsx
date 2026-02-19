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
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '10px 16px',
        flexShrink: 0,
        minWidth: '72px',
      }}
    >
      <span
        style={{
          fontSize: '18px',
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
          fontSize: '10px',
          fontWeight: 400,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-3)',
          letterSpacing: '0.5px',
        }}
      >
        {label.toLowerCase()}
      </span>
    </div>
  )
}
