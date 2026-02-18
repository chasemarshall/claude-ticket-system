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
        background: 'rgba(10,9,7,0.96)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
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
              borderRadius: '50%',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text-2)',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ←
          </button>
        )}
        <h2
          className="font-display"
          style={{ fontSize: '26px', fontWeight: 400, color: 'var(--text-1)', lineHeight: 1 }}
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
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: member.colorDim,
              border: `1.5px solid ${member.colorBorder}`,
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {member.emoji}
          </button>
        )}
      </div>
    </header>
  )
}
