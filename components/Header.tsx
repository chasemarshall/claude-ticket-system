'use client'

import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { FAMILY_MEMBERS } from '@/lib/constants'

interface HeaderProps {
  title: string
  showBack?: boolean
  showAvatar?: boolean
  action?: React.ReactNode
}

export default function Header({ title, showBack, showAvatar, action }: HeaderProps) {
  const router = useRouter()
  const { user, clearUser } = useSession()
  const member = FAMILY_MEMBERS.find((m) => m.name === user)

  return (
    <header
      className="flex items-center justify-between px-5 sticky top-0 z-10"
      style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        paddingTop: 'calc(14px + env(safe-area-inset-top, 0px))',
        paddingBottom: '14px',
        flexShrink: 0,
      }}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <span
            onClick={() => router.back()}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              color: 'var(--text-3)',
              cursor: 'pointer',
            }}
          >
            &lt;-
          </span>
        )}
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-1)',
            lineHeight: 1,
            letterSpacing: '-0.5px',
          }}
        >
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {action}
        {showAvatar && member && (
          <span
            onClick={clearUser}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: 700,
              color: member.color,
              cursor: 'pointer',
            }}
            title="tap to log out"
          >
            {member.name.toLowerCase()}
          </span>
        )}
      </div>
    </header>
  )
}
