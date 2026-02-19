import { Announcement } from '@/lib/types'
import { timeAgo } from '@/lib/utils'

interface AnnouncementCardProps {
  announcement: Announcement
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${announcement.pinned ? 'var(--yellow)' : 'var(--border-light)'}`,
        borderRadius: '10px',
        padding: '14px 16px',
      }}
    >
      {announcement.pinned && (
        <div
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-outfit)',
            fontWeight: 600,
            color: 'var(--yellow)',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            marginBottom: '6px',
          }}
        >
          Pinned
        </div>
      )}
      <h4
        style={{
          fontSize: '15px',
          fontWeight: 500,
          fontFamily: 'var(--font-outfit)',
          color: 'var(--text-1)',
          lineHeight: 1.3,
          marginBottom: '6px',
        }}
      >
        {announcement.title}
      </h4>
      <p
        style={{
          fontSize: '13px',
          fontFamily: 'var(--font-outfit)',
          fontWeight: 300,
          color: 'var(--text-2)',
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}
      >
        {announcement.content}
      </p>
      <div
        style={{
          fontSize: '11px',
          fontFamily: 'var(--font-outfit)',
          color: 'var(--text-3)',
          marginTop: '10px',
        }}
      >
        {timeAgo(announcement.created_at)}
      </div>
    </div>
  )
}
