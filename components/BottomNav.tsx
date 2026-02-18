'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'

const USER_TABS = [
  { href: '/home', label: 'Home', icon: '🏠' },
  { href: '/tickets', label: 'My Tickets', icon: '🎫' },
  { href: '/tickets/new', label: 'New', icon: '+', isAction: true },
]

const ADMIN_TABS = [
  { href: '/home', label: 'Home', icon: '🏠' },
  { href: '/admin', label: 'Tickets', icon: '⚙️' },
  { href: '/admin/announcements', label: 'Announce', icon: '📢' },
]

export default function BottomNav() {
  const { user, isAdmin } = useSession()
  const pathname = usePathname()

  if (!user) return null

  const tabs = isAdmin ? ADMIN_TABS : USER_TABS

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        background: 'rgba(10,9,7,0.97)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 50,
      }}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const isAction = 'isAction' in tab && tab.isAction

          if (isAction) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  padding: '8px 0',
                  flex: 1,
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 400,
                    color: '#0a0907',
                    lineHeight: 1,
                    boxShadow: '0 0 20px rgba(255,122,61,0.35)',
                    marginBottom: '2px',
                  }}
                >
                  {tab.icon}
                </div>
                <span style={{ fontSize: '9px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {tab.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                padding: '10px 0',
                flex: 1,
                textDecoration: 'none',
                opacity: isActive ? 1 : 0.45,
                transition: 'opacity 0.2s',
              }}
            >
              <span style={{ fontSize: '22px', lineHeight: 1 }}>{tab.icon}</span>
              <span
                style={{
                  fontSize: '9px',
                  color: isActive ? 'var(--accent)' : 'var(--text-3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'color 0.2s',
                }}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
