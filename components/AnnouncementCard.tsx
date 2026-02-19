import { Announcement } from '@/lib/types'
import { timeAgo } from '@/lib/utils'

interface AnnouncementCardProps {
  announcement: Announcement
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${announcement.pinned ? 'var(--yellow)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
      }}
    >
      {announcement.pinned && (
        <div
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 400,
            color: 'var(--yellow)',
            letterSpacing: '0.5px',
            marginBottom: '6px',
          }}
        >
          pinned
        </div>
      )}
      <h4
        style={{
          fontSize: '14px',
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
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-3)',
          marginTop: '10px',
        }}
      >
        {timeAgo(announcement.created_at)}
      </div>
    </div>
  )
}
