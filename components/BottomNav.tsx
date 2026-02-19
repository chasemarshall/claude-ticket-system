'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'

const USER_TABS = [
  { href: '/home',        label: 'home'    },
  { href: '/tickets',     label: 'tickets' },
  { href: '/tickets/new', label: '+ new'   },
]

const ADMIN_TABS = [
  { href: '/home',                label: 'home'     },
  { href: '/admin',               label: 'tickets'  },
  { href: '/admin/announcements', label: 'announce' },
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
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 50,
      }}
    >
      <div className="flex items-center justify-around px-4 py-3">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const isNew = tab.label === '+ new'

          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 400,
                color: isNew ? 'var(--accent)' : isActive ? 'var(--text-1)' : 'var(--text-3)',
                textDecoration: 'none',
                padding: '4px 0',
                borderBottom: isActive && !isNew ? '1px solid var(--text-1)' : '1px solid transparent',
              }}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
