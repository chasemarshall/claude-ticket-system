interface StatCardProps {
  value: number
  label: string
  color?: string
}

export default function StatCard({ value, label, color = 'var(--accent)' }: StatCardProps) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '16px',
      }}
    >
      <div
        className="font-display"
        style={{
          fontSize: '40px',
          fontWeight: 300,
          color,
          lineHeight: 1,
          marginBottom: '4px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '11px',
          color: 'var(--text-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </div>
    </div>
  )
}
