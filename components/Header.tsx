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
          <button
            onClick={() => router.back()}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-2)',
              fontSize: '14px',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            &lt;-
          </button>
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

      <div className="flex items-center gap-2">
        {action}
        {showAvatar && member && (
          <button
            onClick={clearUser}
            title="Tap to log out"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius)',
              background: `color-mix(in srgb, ${member.color} 15%, transparent)`,
              border: `1px solid color-mix(in srgb, ${member.color} 30%, transparent)`,
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              color: member.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {member.name.charAt(0)}
          </button>
        )}
      </div>
    </header>
  )
}
