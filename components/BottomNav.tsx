'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'

/* SVG Icons */

function IconHome({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function IconTicket({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M8 6v12M2 10h2M2 14h2M20 10h2M20 14h2" />
    </svg>
  )
}

function IconPlus({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function IconList({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9h10M7 13h7" />
    </svg>
  )
}

function IconMegaphone({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 9.5V7a1 1 0 0 0-1.447-.894L5 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2l4.553 1.79" />
      <path d="M19 9.5c.667.5 1 1.167 1 2s-.333 1.5-1 2" />
      <path d="M7 16l1.5 4" />
    </svg>
  )
}

/* Nav config */

const USER_TABS = [
  { href: '/home',        label: 'Home',       Icon: IconHome,      isAction: false },
  { href: '/tickets',     label: 'My Tickets', Icon: IconTicket,    isAction: false },
  { href: '/tickets/new', label: 'New',        Icon: IconPlus,      isAction: true  },
]

const ADMIN_TABS = [
  { href: '/home',                   label: 'Home',     Icon: IconHome,      isAction: false },
  { href: '/admin',                  label: 'Tickets',  Icon: IconList,      isAction: false },
  { href: '/admin/announcements',    label: 'Announce', Icon: IconMegaphone, isAction: false },
]

/* Component */

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
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 50,
      }}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href

          if (tab.isAction) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  padding: '8px 0',
                  flex: 1,
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--bg)',
                  }}
                >
                  <tab.Icon size={20} />
                </div>
                <span
                  style={{
                    fontSize: '9px',
                    fontFamily: 'var(--font-outfit)',
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
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
                color: isActive ? 'var(--accent)' : 'var(--text-3)',
                transition: 'color 0.15s',
              }}
            >
              <tab.Icon size={22} />
              {isActive && (
                <span
                  style={{
                    fontSize: '9px',
                    fontFamily: 'var(--font-outfit)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: 500,
                    color: 'var(--accent)',
                  }}
                >
                  {tab.label}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
