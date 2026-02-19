import { Announcement } from '@/lib/types'
import { timeAgo } from '@/lib/utils'

interface AnnouncementCardProps {
  announcement: Announcement
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <div
      style={{
        padding: '14px 0',
        borderBottom: '1px solid var(--border)',
        borderLeft: `3px solid ${announcement.pinned ? 'var(--accent)' : 'transparent'}`,
        paddingLeft: announcement.pinned ? '14px' : '0',
      }}
    >
      {announcement.pinned && (
        <div
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 400,
            color: 'var(--accent)',
            marginBottom: '4px',
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
          marginBottom: '4px',
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
          WebkitLineClamp: 2,
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
          marginTop: '8px',
        }}
      >
        {timeAgo(announcement.created_at)}
      </div>
    </div>
  )
}
