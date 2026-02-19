# Kin UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fully replace the current warm-brown Inter-based dark theme with a flat Catppuccin Mocha design using Syne + Outfit typography.

**Architecture:** Pure visual/style changes only. No logic, no types, no Supabase queries touched. Every task is self-contained to one file or component. Changes flow foundation-first (globals → layout → shared components → pages).

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v3, Google Fonts (Syne + Outfit), CSS custom properties, inline styles.

**Design doc:** `docs/plans/2026-02-18-redesign-design.md`

---

## Flat Rules (enforce in every task)

- NO `box-shadow` anywhere
- NO `backdropFilter` or `WebkitBackdropFilter`
- NO CSS gradients
- NO `blur()`
- Depth = layered surface colors only (`--crust` → `--surface` → `--bg` → `--card` → `--card-hover`)

---

### Task 1: Replace CSS custom properties and global styles

**Files:**
- Modify: `app/globals.css`

**What to do:**

Replace the entire `:root` block and all global styles. The file should become:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Catppuccin Mocha */
  --bg: #1e1e2e;
  --surface: #181825;
  --crust: #11111b;
  --card: #313244;
  --card-hover: #45475a;
  --border: #45475a;
  --border-light: #585b70;
  --text-1: #cdd6f4;
  --text-2: #a6adc8;
  --text-3: #585b70;

  /* Accent — Mauve */
  --accent: #cba6f7;
  --accent-dim: rgba(203, 166, 247, 0.12);
  --accent-border: rgba(203, 166, 247, 0.35);

  /* Status colors */
  --green: #a6e3a1;
  --green-dim: rgba(166, 227, 161, 0.15);
  --blue: #89b4fa;
  --blue-dim: rgba(137, 180, 250, 0.15);
  --yellow: #f9e2af;
  --yellow-dim: rgba(249, 226, 175, 0.15);
  --red: #f38ba8;
  --red-dim: rgba(243, 139, 168, 0.15);
  --peach: #fab387;
  --peach-dim: rgba(250, 179, 135, 0.15);
}

html,
body {
  height: 100%;
  background: var(--bg);
  color: var(--text-1);
  font-family: var(--font-outfit), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
}

#__next,
main {
  height: 100dvh;
}

* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
*::-webkit-scrollbar {
  display: none;
}

* {
  -webkit-tap-highlight-color: transparent;
}

@layer utilities {
  .bg-app      { background: var(--bg); }
  .bg-card     { background: var(--card); }
  .bg-surface  { background: var(--surface); }
  .bg-accent   { background: var(--accent); }
  .text-1      { color: var(--text-1); }
  .text-2      { color: var(--text-2); }
  .text-3      { color: var(--text-3); }
  .text-accent { color: var(--accent); }
  .border-brand { border-color: var(--border); }
  .font-display { font-family: var(--font-syne), system-ui, sans-serif; }
  .safe-bottom  { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 80px); }
}

/* Staggered list entries */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-entry {
  animation: fadeSlideUp 200ms ease-out forwards;
}

.list-item:nth-child(1)  { animation-delay: 0ms; }
.list-item:nth-child(2)  { animation-delay: 40ms; }
.list-item:nth-child(3)  { animation-delay: 80ms; }
.list-item:nth-child(4)  { animation-delay: 120ms; }
.list-item:nth-child(5)  { animation-delay: 160ms; }
.list-item:nth-child(6)  { animation-delay: 200ms; }
.list-item:nth-child(7)  { animation-delay: 240ms; }
.list-item:nth-child(8)  { animation-delay: 280ms; }

/* Skeleton pulse */
@keyframes skeletonPulse {
  0%, 100% { background: var(--surface); }
  50%       { background: var(--card); }
}

.skeleton {
  animation: skeletonPulse 1.4s ease-in-out infinite;
  border-radius: 10px;
}

/* Login family card animation */
.family-card {
  opacity: 0;
  animation: fadeSlideUp 200ms ease-out forwards;
}
.family-card:nth-child(1) { animation-delay: 0ms; }
.family-card:nth-child(2) { animation-delay: 60ms; }
.family-card:nth-child(3) { animation-delay: 60ms; }
.family-card:nth-child(4) { animation-delay: 120ms; }
.family-card:nth-child(5) { animation-delay: 120ms; }
```

**Step 1:** Replace `app/globals.css` with the content above.

**Step 2:** Verify the app still builds without errors.

```bash
cd /Users/chasefrazier/Projects/web/new-ticket-system-claude && npx next build 2>&1 | tail -20
```

Expected: no errors (CSS changes alone don't break builds).

**Step 3:** Commit.

```bash
git add app/globals.css
git commit -m "style: replace color palette with Catppuccin Mocha, add flat animation utilities"
```

---

### Task 2: Swap fonts — Syne + Outfit replacing Inter

**Files:**
- Modify: `app/layout.tsx`

**What to do:**

Replace the Inter import with Syne + Outfit and thread both CSS variables into the HTML element.

```tsx
import type { Metadata, Viewport } from 'next'
import { Syne, Outfit } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/contexts/SessionContext'
import { ToastProvider } from '@/contexts/ToastContext'
import BottomNav from '@/components/BottomNav'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syne',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kin',
  description: 'Frazier Family Home Management',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable}`}>
      <body>
        <SessionProvider>
          <ToastProvider>
            <div
              style={{
                maxWidth: '430px',
                margin: '0 auto',
                height: '100dvh',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--bg)',
              }}
            >
              {children}
              <BottomNav />
            </div>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
```

**Step 1:** Replace `app/layout.tsx` with the content above.

**Step 2:** Verify build.

```bash
cd /Users/chasefrazier/Projects/web/new-ticket-system-claude && npx next build 2>&1 | tail -20
```

**Step 3:** Commit.

```bash
git add app/layout.tsx
git commit -m "style: swap Inter for Syne (display) + Outfit (body)"
```

---

### Task 3: Redesign StatusBadge component

**Files:**
- Modify: `components/StatusBadge.tsx`

**What to do:**

Flat colored chip — bg tint only, no border, Outfit font.

```tsx
import { TicketStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: TicketStatus
}

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  open:        { label: 'Open',        color: 'var(--green)',  bg: 'var(--green-dim)'  },
  'in-progress': { label: 'In Progress', color: 'var(--blue)',   bg: 'var(--blue-dim)'   },
  pending:     { label: 'Pending',     color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
  closed:      { label: 'Closed',      color: 'var(--text-3)', bg: 'var(--surface)'    },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.open

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 500,
        fontFamily: 'var(--font-outfit)',
        color: config.color,
        background: config.bg,
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  )
}
```

**Step 1:** Replace `components/StatusBadge.tsx` with the content above.

**Step 2:** Commit.

```bash
git add components/StatusBadge.tsx
git commit -m "style: flat Catppuccin StatusBadge, no border"
```

---

### Task 4: Redesign StatCard component

**Files:**
- Modify: `components/StatCard.tsx`

**What to do:**

Replace the 2×2 card with a compact pill-chip for the horizontal scroll row.

```tsx
interface StatCardProps {
  value: number
  label: string
  color: string
}

export default function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '999px',
        padding: '8px 16px',
        flexShrink: 0,
        minWidth: '72px',
      }}
    >
      <span
        style={{
          fontSize: '20px',
          fontWeight: 600,
          fontFamily: 'var(--font-outfit)',
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: '10px',
          fontWeight: 400,
          fontFamily: 'var(--font-outfit)',
          color: 'var(--text-2)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </span>
    </div>
  )
}
```

**Step 1:** Replace `components/StatCard.tsx` with the content above.

**Step 2:** Commit.

```bash
git add components/StatCard.tsx
git commit -m "style: StatCard as flat Catppuccin pill-chip"
```

---

### Task 5: Redesign AnnouncementCard component

**Files:**
- Modify: `components/AnnouncementCard.tsx`

**What to do:**

Full-width card with left border accent instead of horizontal scroll cards.

```tsx
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
```

**Step 1:** Replace `components/AnnouncementCard.tsx` with the content above.

**Step 2:** Commit.

```bash
git add components/AnnouncementCard.tsx
git commit -m "style: full-width AnnouncementCard with left border accent"
```

---

### Task 6: Redesign TicketCard component

**Files:**
- Modify: `components/TicketCard.tsx`

**What to do:**

Flat card with flat category icon square, new status badge usage, priority dot.

```tsx
import { Ticket } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'
import { timeAgo } from '@/lib/utils'
import StatusBadge from './StatusBadge'

interface TicketCardProps {
  ticket: Ticket
  onClick: () => void
  showAuthor?: boolean
}

const PRIORITY_COLOR: Record<string, string> = {
  high:   'var(--red)',
  medium: 'var(--peach)',
  low:    'var(--green)',
}

export default function TicketCard({ ticket, onClick, showAuthor }: TicketCardProps) {
  const category = CATEGORIES.find((c) => c.id === ticket.category) ?? CATEGORIES[5]

  return (
    <div
      onClick={onClick}
      className="list-item animate-entry cursor-pointer transition-colors duration-150"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}
      onMouseDown={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--accent)'
      }}
      onMouseUp={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border)'
      }}
      onTouchStart={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--accent)'
      }}
      onTouchEnd={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border)'
      }}
    >
      {/* Category icon */}
      <div
        style={{
          width: '36px',
          height: '36px',
          flexShrink: 0,
          background: 'var(--surface)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
        }}
      >
        {category.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: 500,
            fontFamily: 'var(--font-outfit)',
            color: 'var(--text-1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {ticket.title}
        </div>
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-outfit)',
            fontWeight: 300,
            color: 'var(--text-3)',
            marginTop: '3px',
          }}
        >
          {showAuthor ? `${ticket.author} · ` : ''}
          {timeAgo(ticket.created_at)} · {category.name}
        </div>
      </div>

      {/* Right */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '6px',
          flexShrink: 0,
        }}
      >
        <StatusBadge status={ticket.status} />
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: PRIORITY_COLOR[ticket.priority],
          }}
          title={`${ticket.priority} priority`}
        />
      </div>
    </div>
  )
}
```

**Step 1:** Replace `components/TicketCard.tsx` with the content above.

**Step 2:** Commit.

```bash
git add components/TicketCard.tsx
git commit -m "style: flat Catppuccin TicketCard with accent border press state"
```

---

### Task 7: Redesign Header component

**Files:**
- Modify: `components/Header.tsx`

**What to do:**

Remove blur. Flat `--bg` background, `1px` bottom border, Syne font for title.

```tsx
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
              borderRadius: '8px',
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
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '22px',
            fontWeight: 400,
            color: 'var(--text-1)',
            lineHeight: 1,
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
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: member.colorDim,
              border: `1px solid ${member.colorBorder}`,
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
```

**Step 1:** Replace `components/Header.tsx` with the content above.

**Step 2:** Commit.

```bash
git add components/Header.tsx
git commit -m "style: flat Header, remove blur, Syne font"
```

---

### Task 8: Redesign BottomNav with SVG icons

**Files:**
- Modify: `components/BottomNav.tsx`

**What to do:**

Replace emoji icons with inline SVG stroke icons. Flat `--surface` background, no blur.

The SVG icons are defined as inline components. Each icon is a 24×24 viewBox with `stroke="currentColor"`, `strokeWidth="1.5"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `fill="none"`.

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'

/* ── SVG Icons ─────────────────────────────────────────────── */

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

/* ── Nav config ─────────────────────────────────────────────── */

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

/* ── Component ──────────────────────────────────────────────── */

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
```

**Step 1:** Replace `components/BottomNav.tsx` with the content above.

**Step 2:** Commit.

```bash
git add components/BottomNav.tsx
git commit -m "style: SVG stroke icons in BottomNav, flat Catppuccin surface, no blur"
```

---

### Task 9: Redesign Login page

**Files:**
- Modify: `app/page.tsx`

**What to do:**

Replace the emoji/icon box logo with just the Syne wordmark. Replace color-dim card backgrounds with `--card` + a `3px` left member-color border strip. No hover glow overlay.

```tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { FAMILY_MEMBERS } from '@/lib/constants'

export default function LoginPage() {
  const { user, loading, setUser } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.push('/home')
  }, [user, loading, router])

  const handleSelect = (name: string) => {
    setUser(name)
    router.push('/home')
  }

  if (loading) return null

  const [chase, ...rest] = FAMILY_MEMBERS
  const pairs: (typeof rest)[] = []
  for (let i = 0; i < rest.length; i += 2) {
    pairs.push(rest.slice(i, i + 2))
  }

  return (
    <div
      className="flex flex-col items-center justify-center p-6"
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        paddingTop: 'calc(24px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Wordmark */}
      <div className="text-center mb-10">
        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '64px',
            fontWeight: 700,
            color: 'var(--text-1)',
            lineHeight: 1,
            letterSpacing: '-1px',
          }}
        >
          Kin
        </h1>
        <p
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-outfit)',
            fontWeight: 300,
            color: 'var(--text-3)',
            marginTop: '8px',
            textTransform: 'uppercase',
            letterSpacing: '4px',
          }}
        >
          Frazier Family
        </p>
      </div>

      {/* Family grid */}
      <div className="w-full" style={{ maxWidth: '340px' }}>
        <MemberCard member={chase} onClick={() => handleSelect(chase.name)} className="family-card mb-3" fullWidth />
        {pairs.map((pair, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 mb-3">
            {pair.map((member) => (
              <MemberCard
                key={member.name}
                member={member}
                onClick={() => handleSelect(member.name)}
                className="family-card"
              />
            ))}
          </div>
        ))}
      </div>

      <p
        style={{
          fontSize: '11px',
          fontFamily: 'var(--font-outfit)',
          color: 'var(--text-3)',
          marginTop: '12px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        Who&apos;s using?
      </p>
    </div>
  )
}

interface MemberCardProps {
  member: (typeof FAMILY_MEMBERS)[0]
  onClick: () => void
  className?: string
  fullWidth?: boolean
}

function MemberCard({ member, onClick, className, fullWidth }: MemberCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-colors duration-150 ${className ?? ''}`}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${member.color}`,
        borderRadius: '10px',
        padding: fullWidth ? '16px 20px' : '16px 12px',
        display: 'flex',
        flexDirection: fullWidth ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: fullWidth ? 'flex-start' : 'center',
        gap: fullWidth ? '14px' : '0',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: fullWidth ? '48px' : '44px',
          height: fullWidth ? '48px' : '44px',
          borderRadius: '50%',
          background: member.colorDim,
          border: `1px solid ${member.colorBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          flexShrink: 0,
          marginBottom: fullWidth ? 0 : '10px',
        }}
      >
        {member.emoji}
      </div>

      {/* Name + role */}
      <div style={{ textAlign: fullWidth ? 'left' : 'center' }}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 500,
            fontFamily: 'var(--font-outfit)',
            color: 'var(--text-1)',
          }}
        >
          {member.name}
        </div>
        <div
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-outfit)',
            color: member.isAdmin ? member.color : 'var(--text-3)',
            marginTop: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            fontWeight: member.isAdmin ? 600 : 400,
          }}
        >
          {member.isAdmin ? 'Admin' : 'Family'}
        </div>
      </div>
    </div>
  )
}
```

**Step 1:** Replace `app/page.tsx` with the content above.

**Step 2:** Commit.

```bash
git add app/page.tsx
git commit -m "style: flat Catppuccin login page, Syne wordmark, left-border member cards"
```

---

### Task 10: Redesign Home page — three-zone layout

**Files:**
- Modify: `app/home/page.tsx`

**What to do:**

Replace the scattered layout with:
- Zone 1: `--surface` hero with Syne greeting + inline stat summary
- Zone 2: Horizontal stat chip row using `StatCard`
- Zone 3: Full-width announcement cards + ticket list

```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { supabase } from '@/lib/supabase'
import { Ticket, Announcement } from '@/lib/types'
import Header from '@/components/Header'
import TicketCard from '@/components/TicketCard'
import AnnouncementCard from '@/components/AnnouncementCard'
import StatCard from '@/components/StatCard'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function HomePage() {
  const { user, isAdmin, loading } = useSession()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const [ticketsRes, annsRes] = await Promise.all([
      supabase.from('tickets').select('*').order('created_at', { ascending: false }),
      supabase
        .from('announcements')
        .select('*')
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false }),
    ])
    if (ticketsRes.data) setTickets(ticketsRes.data)
    if (annsRes.data) setAnnouncements(annsRes.data)
    setDataLoading(false)
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/'); return }
    fetchData()
    const channel = supabase
      .channel('home-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, fetchData)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, loading, router, fetchData])

  if (loading || !user) return null

  const myTickets = tickets.filter((t) => t.author === user)
  const recentTickets = isAdmin ? tickets.slice(0, 5) : myTickets.slice(0, 5)

  const stats = {
    open:       tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in-progress').length,
    pending:    tickets.filter((t) => t.status === 'pending').length,
    closed:     tickets.filter((t) => t.status === 'closed').length,
  }

  const openCount   = isAdmin ? stats.open : myTickets.filter((t) => t.status === 'open').length
  const inProgCount = isAdmin ? stats.inProgress : myTickets.filter((t) => t.status === 'in-progress').length

  const inlineSummaryParts = []
  if (openCount > 0) inlineSummaryParts.push(`${openCount} open`)
  if (inProgCount > 0) inlineSummaryParts.push(`${inProgCount} in progress`)

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100dvh',
        overflowY: 'auto',
        background: 'var(--bg)',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Header title="Kin" showAvatar />

      {/* Zone 1: Hero greeting */}
      <div
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '20px 20px 18px',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-outfit)',
            fontWeight: 300,
            color: 'var(--text-3)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '4px',
          }}
        >
          {getGreeting()}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '52px',
            fontWeight: 700,
            color: 'var(--text-1)',
            lineHeight: 1,
            marginBottom: '8px',
          }}
        >
          {user}
        </h1>
        {inlineSummaryParts.length > 0 ? (
          <p
            style={{
              fontSize: '13px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 300,
              color: 'var(--text-2)',
            }}
          >
            {inlineSummaryParts.join(' · ')}
          </p>
        ) : (
          <p
            style={{
              fontSize: '13px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 300,
              color: 'var(--text-3)',
            }}
          >
            All clear
          </p>
        )}
      </div>

      {/* Zone 2: Stat chips row (admin only) */}
      {isAdmin && (
        <div
          className="flex gap-2 px-5 py-4"
          style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', flexShrink: 0 }}
        >
          <StatCard value={stats.open}       label="Open"        color="var(--green)"  />
          <StatCard value={stats.inProgress} label="In Progress" color="var(--blue)"   />
          <StatCard value={stats.pending}    label="Pending"     color="var(--yellow)" />
          <StatCard value={stats.closed}     label="Closed"      color="var(--text-3)" />
        </div>
      )}

      {/* User submit CTA */}
      {!isAdmin && (
        <div className="px-5 pt-4">
          <button
            onClick={() => router.push('/tickets/new')}
            style={{
              width: '100%',
              background: 'var(--accent)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 20px',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'var(--font-outfit)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Submit a Ticket</span>
            <span style={{ fontSize: '12px', fontWeight: 300, opacity: 0.7 }}>Report an issue →</span>
          </button>
        </div>
      )}

      {/* Zone 3: Announcements */}
      {announcements.length > 0 && (
        <div className="pt-5">
          <p
            className="px-5 mb-3"
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            Announcements
          </p>
          <div className="flex flex-col gap-2 px-5">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        </div>
      )}

      {/* Zone 3: Recent tickets */}
      <div className="pt-5 pb-2">
        <div className="flex items-center justify-between px-5 mb-3">
          <p
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            {isAdmin ? 'Recent Tickets' : 'My Tickets'}
          </p>
          <span
            onClick={() => router.push(isAdmin ? '/admin' : '/tickets')}
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-outfit)',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              cursor: 'pointer',
            }}
          >
            See all
          </span>
        </div>

        {dataLoading ? (
          <div className="flex flex-col gap-2 px-5">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton" style={{ height: '64px' }} />
            ))}
          </div>
        ) : recentTickets.length > 0 ? (
          <div className="flex flex-col gap-2 px-5">
            {recentTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                showAuthor={isAdmin}
                onClick={() => router.push(`/tickets/${ticket.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="px-5 text-center py-10">
            <p
              style={{
                fontSize: '13px',
                fontFamily: 'var(--font-outfit)',
                fontWeight: 300,
                color: 'var(--text-3)',
              }}
            >
              {isAdmin ? 'No tickets yet' : 'No tickets yet. Everything running smoothly!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 1:** Replace `app/home/page.tsx` with the content above.

**Step 2:** Commit.

```bash
git add app/home/page.tsx
git commit -m "style: Catppuccin home page with three-zone layout, Syne hero greeting"
```

---

### Task 11: Redesign My Tickets page

**Files:**
- Modify: `app/tickets/page.tsx`

**What to do:**

Update skeleton loaders to use `.skeleton` class. Clean up font references (the TicketCard already handles its own styling).

```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { supabase } from '@/lib/supabase'
import { Ticket } from '@/lib/types'
import Header from '@/components/Header'
import TicketCard from '@/components/TicketCard'

export default function MyTicketsPage() {
  const { user, loading } = useSession()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  const fetchTickets = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .eq('author', user)
      .order('created_at', { ascending: false })
    if (data) setTickets(data)
    setDataLoading(false)
  }, [user])

  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/'); return }
    fetchTickets()
    const channel = supabase
      .channel('my-tickets-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, fetchTickets)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, loading, router, fetchTickets])

  if (loading || !user) return null

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100dvh',
        overflowY: 'auto',
        background: 'var(--bg)',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Header title="My Tickets" showAvatar />

      <div className="flex flex-col gap-2 px-5 pt-5">
        {dataLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '64px' }} />
          ))
        ) : tickets.length > 0 ? (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => router.push(`/tickets/${ticket.id}`)}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <p
              style={{
                fontSize: '13px',
                fontFamily: 'var(--font-outfit)',
                fontWeight: 300,
                color: 'var(--text-3)',
                lineHeight: 1.6,
              }}
            >
              No tickets yet.
              <br />
              Everything running smoothly!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 1:** Replace `app/tickets/page.tsx` with the content above.

**Step 2:** Commit.

```bash
git add app/tickets/page.tsx
git commit -m "style: Catppuccin My Tickets page, skeleton loaders"
```

---

### Task 12: Redesign New Ticket form

**Files:**
- Modify: `app/tickets/new/page.tsx`

**What to do:**

Flat category tiles with left-border selection, flat inputs, flat priority buttons, flat submit.

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/constants'
import { TicketCategory, TicketPriority } from '@/lib/types'
import Header from '@/components/Header'

const PRIORITIES: { value: TicketPriority; label: string; color: string }[] = [
  { value: 'low',    label: 'Low',    color: 'var(--green)' },
  { value: 'medium', label: 'Medium', color: 'var(--peach)' },
  { value: 'high',   label: 'High',   color: 'var(--red)'   },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '13px 16px',
  fontSize: '15px',
  fontFamily: 'var(--font-outfit)',
  fontWeight: 300,
  color: 'var(--text-1)',
  outline: 'none',
}

export default function NewTicketPage() {
  const { user, loading } = useSession()
  const router = useRouter()
  const { showToast } = useToast()
  const [category, setCategory] = useState<TicketCategory | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/')
  }, [user, loading, router])

  if (loading || !user) return null

  const handleSubmit = async () => {
    if (!category) { showToast('Please select a category', 'error'); return }
    if (!title.trim()) { showToast('Please add a title', 'error'); return }
    setSubmitting(true)
    const { error } = await supabase.from('tickets').insert({
      title: title.trim(),
      description: description.trim() || null,
      category,
      priority,
      status: 'open',
      author: user,
    })
    if (error) {
      showToast(error.message || 'Failed to submit ticket', 'error')
      setSubmitting(false)
    } else {
      showToast('Ticket submitted ✓')
      router.push('/tickets')
    }
  }

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100dvh',
        overflowY: 'auto',
        background: 'var(--bg)',
        paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Header title="New Ticket" showBack />

      <div className="flex flex-col gap-6 px-5 pt-6">
        {/* Category */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '10px',
            }}
          >
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const selected = category === cat.id
              return (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className="cursor-pointer transition-colors duration-150"
                  style={{
                    background: selected ? 'var(--card)' : 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderLeft: `3px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    padding: '12px 8px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '5px' }}>{cat.emoji}</div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-outfit)',
                      fontWeight: 500,
                      color: selected ? 'var(--accent)' : 'var(--text-2)',
                    }}
                  >
                    {cat.name}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '10px',
            }}
          >
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of the issue..."
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Description */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '10px',
            }}
          >
            Details{' '}
            <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>
              (optional)
            </span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? When did it start?"
            rows={4}
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Priority */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '10px',
            }}
          >
            Priority
          </label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => {
              const selected = priority === p.value
              return (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    borderRadius: '8px',
                    background: selected ? `color-mix(in srgb, ${p.color} 15%, transparent)` : 'var(--card)',
                    border: `1px solid ${selected ? p.color : 'var(--border)'}`,
                    color: selected ? p.color : 'var(--text-2)',
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-outfit)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%',
            background: submitting ? 'var(--card)' : 'var(--accent)',
            color: submitting ? 'var(--text-3)' : 'var(--bg)',
            border: 'none',
            borderRadius: '10px',
            padding: '15px',
            fontSize: '15px',
            fontWeight: 600,
            fontFamily: 'var(--font-outfit)',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {submitting ? 'Submitting…' : 'Submit Ticket'}
        </button>
      </div>
    </div>
  )
}
```

**Step 1:** Replace `app/tickets/new/page.tsx` with the content above.

**Step 2:** Commit.

```bash
git add app/tickets/new/page.tsx
git commit -m "style: flat Catppuccin new ticket form"
```

---

### Task 13: Redesign Ticket Detail page

**Files:**
- Modify: `app/tickets/[id]/page.tsx`

**What to do:**

Clean up meta badges to use flat Catppuccin styling. Flat status buttons, flat delete button, Outfit/Syne fonts.

```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase } from '@/lib/supabase'
import { Ticket, TicketStatus } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import Header from '@/components/Header'
import StatusBadge from '@/components/StatusBadge'

const STATUSES: { value: TicketStatus; label: string }[] = [
  { value: 'open',        label: 'Open'        },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'pending',     label: 'Pending'     },
  { value: 'closed',      label: 'Closed'      },
]

const PRIORITY_COLOR: Record<string, string> = {
  high:   'var(--red)',
  medium: 'var(--peach)',
  low:    'var(--green)',
}

const sectionLabel: React.CSSProperties = {
  fontSize: '11px',
  fontFamily: 'var(--font-outfit)',
  fontWeight: 500,
  color: 'var(--text-3)',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginBottom: '12px',
}

export default function TicketDetailPage() {
  const { user, isAdmin, loading } = useSession()
  const router = useRouter()
  const params = useParams()
  const { showToast } = useToast()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [updating, setUpdating] = useState(false)

  const fetchTicket = useCallback(async () => {
    const { data } = await supabase.from('tickets').select('*').eq('id', params.id).single()
    if (data) setTicket(data)
  }, [params.id])

  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/'); return }
    fetchTicket()
  }, [user, loading, router, fetchTicket])

  if (loading || !user || !ticket) return null

  const category = CATEGORIES.find((c) => c.id === ticket.category) ?? CATEGORIES[5]

  const updateStatus = async (status: TicketStatus) => {
    setUpdating(true)
    const { error } = await supabase
      .from('tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', ticket.id)
    if (!error) {
      setTicket({ ...ticket, status })
      showToast(`Status → ${status}`)
    }
    setUpdating(false)
  }

  const deleteTicket = async () => {
    const { error } = await supabase.from('tickets').delete().eq('id', ticket.id)
    if (!error) {
      showToast('Ticket deleted')
      router.back()
    }
  }

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100dvh',
        overflowY: 'auto',
        background: 'var(--bg)',
        paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Header title="Ticket" showBack />

      {/* Hero */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
        {/* Category badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            fontFamily: 'var(--font-outfit)',
            color: 'var(--text-2)',
            marginBottom: '14px',
          }}
        >
          {category.emoji} {category.name}
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-1)',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}
        >
          {ticket.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap gap-2 items-center">
          <StatusBadge status={ticket.status} />
          {[
            `By ${ticket.author}`,
            formatDate(ticket.created_at),
          ].map((label) => (
            <span
              key={label}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-outfit)',
                color: 'var(--text-2)',
              }}
            >
              {label}
            </span>
          ))}
          <span
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '3px 10px',
              fontSize: '11px',
              fontFamily: 'var(--font-outfit)',
              color: PRIORITY_COLOR[ticket.priority],
            }}
          >
            {ticket.priority} priority
          </span>
        </div>
      </div>

      {/* Description */}
      {ticket.description && (
        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <p style={sectionLabel}>Description</p>
          <p
            style={{
              fontSize: '15px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 300,
              color: 'var(--text-2)',
              lineHeight: 1.65,
            }}
          >
            {ticket.description}
          </p>
        </div>
      )}

      {/* Admin: status controls */}
      {isAdmin && (
        <>
          <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
            <p style={sectionLabel}>Update Status</p>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((s) => {
                const isCurrentStatus = ticket.status === s.value
                return (
                  <button
                    key={s.value}
                    onClick={() => updateStatus(s.value)}
                    disabled={updating || isCurrentStatus}
                    style={{
                      padding: '11px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 500,
                      fontFamily: 'var(--font-outfit)',
                      cursor: isCurrentStatus ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                      ...(isCurrentStatus
                        ? { background: 'var(--accent-dim)', border: '1px solid var(--accent)', color: 'var(--accent)' }
                        : { background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-2)' }),
                    }}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="px-5 py-5">
            <button
              onClick={deleteTicket}
              style={{
                width: '100%',
                background: 'var(--red-dim)',
                border: '1px solid rgba(243,139,168,0.3)',
                borderRadius: '10px',
                padding: '13px',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'var(--font-outfit)',
                color: 'var(--red)',
                cursor: 'pointer',
              }}
            >
              Delete Ticket
            </button>
          </div>
        </>
      )}
    </div>
  )
}
```

**Step 1:** Replace `app/tickets/[id]/page.tsx` with the content above.

**Step 2:** Commit.

```bash
git add "app/tickets/[id]/page.tsx"
git commit -m "style: flat Catppuccin ticket detail page"
```

---

### Task 14: Redesign Admin Tickets page

**Files:**
- Modify: `app/admin/page.tsx`

**What to do:**

Update filter pill buttons and stat grid to use `StatCard` chips. Update skeleton to use `.skeleton` class.

```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { supabase } from '@/lib/supabase'
import { Ticket } from '@/lib/types'
import Header from '@/components/Header'
import TicketCard from '@/components/TicketCard'
import StatCard from '@/components/StatCard'

const FILTERS = [
  { value: 'all',         label: 'All'         },
  { value: 'open',        label: 'Open'        },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'pending',     label: 'Pending'     },
  { value: 'closed',      label: 'Closed'      },
]

export default function AdminPage() {
  const { user, isAdmin, loading } = useSession()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filter, setFilter] = useState('all')
  const [dataLoading, setDataLoading] = useState(true)

  const fetchTickets = useCallback(async () => {
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setTickets(data)
    setDataLoading(false)
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/'); return }
    if (!isAdmin) { router.push('/home'); return }
    fetchTickets()
    const channel = supabase
      .channel('admin-tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, fetchTickets)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, isAdmin, loading, router, fetchTickets])

  if (loading || !user || !isAdmin) return null

  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter)
  const stats = {
    open:       tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in-progress').length,
    pending:    tickets.filter((t) => t.status === 'pending').length,
    closed:     tickets.filter((t) => t.status === 'closed').length,
  }

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100dvh',
        overflowY: 'auto',
        background: 'var(--bg)',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Header title="All Tickets" showAvatar />

      {/* Stat chips */}
      <div
        className="flex gap-2 px-5 pt-4"
        style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', flexShrink: 0 }}
      >
        <StatCard value={stats.open}       label="Open"        color="var(--green)"  />
        <StatCard value={stats.inProgress} label="In Progress" color="var(--blue)"   />
        <StatCard value={stats.pending}    label="Pending"     color="var(--yellow)" />
        <StatCard value={stats.closed}     label="Closed"      color="var(--text-3)" />
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-2 px-5 pt-4"
        style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', flexShrink: 0 }}
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
              ...(filter === f.value
                ? { background: 'var(--accent)', border: '1px solid var(--accent)', color: 'var(--bg)' }
                : { background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-2)' }),
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      <div className="flex flex-col gap-2 px-5 pt-4">
        {dataLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '64px' }} />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              showAuthor
              onClick={() => router.push(`/tickets/${ticket.id}`)}
            />
          ))
        ) : (
          <div className="text-center py-16">
            <p
              style={{
                fontSize: '13px',
                fontFamily: 'var(--font-outfit)',
                fontWeight: 300,
                color: 'var(--text-3)',
              }}
            >
              No {filter !== 'all' ? filter : ''} tickets
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 1:** Replace `app/admin/page.tsx` with the content above.

**Step 2:** Commit.

```bash
git add app/admin/page.tsx
git commit -m "style: flat Catppuccin admin page, stat chips, filter pills"
```

---

### Task 15: Redesign Admin Announcements pages

**Files:**
- Modify: `app/admin/announcements/page.tsx`
- Modify: `app/admin/announcements/new/page.tsx`

**What to do:**

Read both files first, then apply the same Catppuccin flat treatment: replace any Inter font references, warm colors, blurs, or box-shadows. Use the same input style from Task 12 and the same AnnouncementCard from Task 5.

**Step 1:** Read both files.

```bash
cat /Users/chasefrazier/Projects/web/new-ticket-system-claude/app/admin/announcements/page.tsx
cat /Users/chasefrazier/Projects/web/new-ticket-system-claude/app/admin/announcements/new/page.tsx
```

**Step 2:** Apply Catppuccin flat styling:
- Any `backdropFilter` → remove
- Any `box-shadow` → remove
- Any `#0a0907` or warm-tinted hex → replace with Mocha equivalents
- Font families `var(--font-inter)` → `var(--font-outfit)`
- Skeleton divs → add `className="skeleton"`
- Input/textarea/button styles → match the pattern from Task 12

**Step 3:** Commit.

```bash
git add app/admin/announcements/page.tsx app/admin/announcements/new/page.tsx
git commit -m "style: flat Catppuccin admin announcements pages"
```

---

### Task 16: Final check and deploy

**Step 1:** Run a full build to confirm no TypeScript or build errors.

```bash
cd /Users/chasefrazier/Projects/web/new-ticket-system-claude && npx next build 2>&1
```

Expected: `✓ Compiled successfully`

**Step 2:** Start dev server and visually verify each screen.

```bash
cd /Users/chasefrazier/Projects/web/new-ticket-system-claude && npx next dev
```

Checklist:
- [ ] Login: Syne wordmark, left-border member cards, no warm tint
- [ ] Home: `--surface` hero zone, Syne name, stat chips row
- [ ] Bottom nav: SVG icons, flat `--surface` bar, no blur
- [ ] Ticket cards: flat, accent border on press
- [ ] New ticket form: left-border category selection
- [ ] Admin: stat chips + filter pills
- [ ] Ticket detail: flat meta badges, flat status buttons
- [ ] No box-shadow, no backdrop-filter, no gradients anywhere

**Step 3:** If all looks good, push to trigger Vercel deploy.

```bash
git push
```
