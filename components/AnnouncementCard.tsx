import { Announcement } from '@/lib/types'
import { timeAgo } from '@/lib/utils'

interface AnnouncementCardProps {
  announcement: Announcement
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <div
      style={{
        minWidth: '240px',
        maxWidth: '260px',
        background: announcement.pinned
          ? 'linear-gradient(135deg, var(--card) 0%, rgba(212,168,83,0.07) 100%)'
          : 'var(--card)',
        border: announcement.pinned ? '1px solid var(--accent-border)' : '1px solid var(--border)',
        borderRadius: '14px',
        padding: '16px',
        flexShrink: 0,
      }}
    >
      {announcement.pinned && (
        <div
          style={{
            fontSize: '10px',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          📌 Pinned
        </div>
      )}
      <h4
        style={{
          fontSize: '15px',
          fontWeight: 500,
          color: 'var(--text-1)',
          lineHeight: 1.3,
          marginBottom: '6px',
        }}
      >
        {announcement.title}
      </h4>
      <p
        style={{
          fontSize: '12px',
          color: 'var(--text-3)',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}
      >
        {announcement.content}
      </p>
      <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '10px' }}>
        {timeAgo(announcement.created_at)}
      </div>
    </div>
  )
}
