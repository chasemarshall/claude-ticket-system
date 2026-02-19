# Kin — Full UI Redesign Design Doc

**Date:** 2026-02-18
**Scope:** Full visual redesign of all screens
**Theme:** Catppuccin Mocha + flat design

---

## Goals

- Replace warm-brown dark theme with cool Catppuccin Mocha palette
- Eliminate all blur, gradients, and shadows (fully flat)
- Replace Inter with Syne (display) + Outfit (body)
- Redesign the home dashboard with clear three-zone hierarchy
- Replace emoji nav icons with clean SVG stroke icons
- Elevate ticket cards and form inputs to match the new aesthetic

---

## Color System

All values are exact Catppuccin Mocha spec.

| CSS Variable     | Hex       | Catppuccin Name | Usage                        |
|------------------|-----------|-----------------|------------------------------|
| `--bg`           | `#1e1e2e` | Base            | App background               |
| `--surface`      | `#181825` | Mantle          | Slightly darker surface      |
| `--crust`        | `#11111b` | Crust           | Deepest background layer     |
| `--card`         | `#313244` | Surface0        | Cards, inputs                |
| `--card-hover`   | `#45475a` | Surface1        | Hovered/active cards         |
| `--border`       | `#45475a` | Surface1        | All borders                  |
| `--border-light` | `#585b70` | Surface2        | Subtle dividers              |
| `--text-1`       | `#cdd6f4` | Text            | Primary text                 |
| `--text-2`       | `#a6adc8` | Subtext0        | Secondary text               |
| `--text-3`       | `#585b70` | Surface2        | Muted/tertiary               |
| `--accent`       | `#cba6f7` | Mauve           | Primary accent               |
| `--accent-dim`   | `rgba(203,166,247,0.12)` | —  | Accent backgrounds           |
| `--accent-border`| `rgba(203,166,247,0.35)` | —  | Accent borders               |
| `--blue`         | `#89b4fa` | Blue            | In-progress, info            |
| `--green`        | `#a6e3a1` | Green           | Open / success               |
| `--yellow`       | `#f9e2af` | Yellow          | Pending / warning            |
| `--red`          | `#f38ba8` | Red             | Error / high priority        |
| `--peach`        | `#fab387` | Peach           | Medium priority              |

**Flat rules (strictly enforced):**
- No `box-shadow` anywhere
- No `backdropFilter` or `WebkitBackdropFilter`
- No CSS gradients (linear or radial)
- Depth expressed solely through layered surface colors

---

## Typography

Replace `Inter` entirely.

| Role    | Font  | Weights | Notes                              |
|---------|-------|---------|------------------------------------|
| Display | Syne  | 400, 700 | Headings, app name, section labels |
| Body/UI | Outfit | 300, 400, 500, 600 | All body text, labels, buttons |

Both loaded via `next/font/google`.

- `--font-syne` variable for display
- `--font-outfit` variable for body
- Remove `--font-inter` entirely from layout

### Typography Scale

- App name (login): Syne 700 `64px`
- User greeting (home): Syne 700 `52px`
- Page titles (header): Syne 400 `22px`
- Section labels: Outfit 500 `11px`, uppercase, `2px` letter-spacing, `--text-3`
- Ticket title: Outfit 500 `15px`
- Body/meta: Outfit 300 `12–13px`, `--text-2`
- Buttons: Outfit 600 `14–16px`

---

## Component Designs

### Bottom Navigation

**Remove:** emoji icons, blur backdrop, warm background
**Replace with:**

- Background: `--surface` (`#181825`), `1px` top border in `--border`. No blur.
- SVG stroke icons (24px viewbox, 1.5px stroke, round linecap):
  - Home: house outline
  - Tickets: ticket/receipt outline
  - New: plus sign
  - Admin tickets: grid/list outline
  - Announcements: megaphone outline
- **Active tab:** icon fill + label visible in `--accent`
- **Inactive tab:** icon stroke in `--text-3`, no label (icon-only)
- **New button:** flat rectangle (not circle), `--accent` bg, `#1e1e2e` icon, `8px` radius

### Header

**Remove:** blur backdrop, warm tint
**Replace with:**

- Background: `--bg` (`#1e1e2e`), `1px` bottom border `--border`. Flat.
- Title: Syne 400 `22px`
- Back button: flat `--card` bg, `--border` border, `8px` radius, `20px` ← character
- Avatar button: flat circle, member `colorDim` bg, `colorBorder` 1px border

### Login Screen

- Background: `--bg`
- App name: "Kin" in Syne Bold `64px`, `--text-1`, centered. No icon/box.
- Subtitle: "Frazier Family" Outfit 300 `12px`, `--text-3`, uppercase, `4px` letter-spacing
- Family grid: unchanged layout (Chase full-width, pairs below)
- Member cards: `--card` bg, `1px --border`, `12px` radius
  - Color accent: `3px` left border strip in member's color (not a dim background)
  - Active state: `--card-hover` bg (no scale, no shadow)
  - Name: Outfit 500 `16px`, Role: Outfit 400 `10px`
- "Who's using?" label: Outfit 300 `11px`, `--text-3`, uppercase

### Home Screen — Three-Zone Layout

**Zone 1: Hero Greeting (~140px, `--surface` bg)**
- Greeting label: "Good morning" / "Good afternoon" / "Good evening" — Outfit 300 `11px` uppercase `--text-3`
- Name: Syne Bold `52px`, `--text-1`
- Inline stat summary: `3 open · 1 in progress` — Outfit 300 `13px`, `--text-2`
- Bottom border: `1px --border`

**Zone 2: Stat Chips (horizontal scroll row)**
- Replace 2×2 grid with single horizontal scrollable row
- Each chip: `--card` bg, `1px --border`, `999px` radius, `8px 14px` padding
- Number: Outfit 600 `18px`, status color (green/blue/yellow/text-3)
- Label: Outfit 300 `11px`, `--text-2`
- No scroll indicator, `scrollbar-width: none`

**Zone 3: Content Feed**
- Section headers: Outfit 500 `11px` uppercase, `2px` letter-spacing, `--text-3`
- Announcements: full-width flat cards, `3px` left border in `--yellow`
- Recent tickets: redesigned TicketCard (see below)
- Admin CTA: moved to Zone 1 inline stat area; user submit CTA: flat `--accent` button below greeting

### Ticket Card

```
┌──────────────────────────────────────────────┐
│ [icon]  Title truncated here        [badge]  │
│         Author · time · category    [dot]    │
└──────────────────────────────────────────────┘
```

- Background: `--card`, `1px --border`, `10px` radius
- Category icon: `36×36` flat square, `--surface` bg, `6px` radius, `20px` emoji
- Status badge: flat chip, no border — colored bg at 15% opacity, colored text
  - Open: `--green` text, `rgba(166,227,161,0.15)` bg
  - In Progress: `--blue` text, `rgba(137,180,250,0.15)` bg
  - Pending: `--yellow` text, `rgba(249,226,175,0.15)` bg
  - Closed: `--text-3` text, `--surface` bg
- Priority dot: `6px` circle, top-right corner, `--red`/`--peach`/`--green`
- Active/pressed: border becomes `--accent` (no scale)

### Stat Card

- Replace with inline chip (see Zone 2 above)
- `StatCard` component updated to pill-chip style

### Announcement Card

- Full-width (not horizontal scroll cards)
- `--card` bg, `1px --border`, `10px` radius
- `3px` left border: `--yellow` if pinned, `--border-light` otherwise
- Pinned label: Outfit 600 `10px`, `--yellow`, uppercase
- Title: Outfit 500 `15px`, `--text-1`
- Body: Outfit 300 `13px`, `--text-2`, 3-line clamp
- Time: Outfit 300 `11px`, `--text-3`

### New Ticket Form

- Category grid: `3×2` flat tiles
  - Unselected: `--surface` bg, `1px --border`
  - Selected: `--card` bg + `3px` left `--accent` border + emoji/label in `--accent`
- Text inputs/textarea: `--card` bg, `1px --border`, `8px` radius
  - Focus: border → `--accent` (no glow)
  - Font: Outfit 300 `15px`, `--text-1`
  - Placeholder: `--text-3`
- Priority buttons: flat row
  - Selected: colored bg at 15% opacity + matching `1px` border + colored text
  - Unselected: `--card` bg + `--border`
- Submit button: full-width, `--accent` bg, `#1e1e2e` text, Outfit 600, `10px` radius
  - Disabled: `--card` bg, `--text-3` text

### Status Badge (standalone component)

Flat chips per ticket card spec above. Remove `border` entirely, use bg tint only.

---

## Animations

Flat does not mean static. Subtle, purposeful motion only:

- **Page load:** `opacity: 0 → 1` + `translateY(8px → 0)` over `200ms ease-out`. No scale.
- **Card press:** `border-color` transition to `--accent`, `150ms`. No scale transforms.
- **Button press:** `opacity: 0.85`, `150ms`. No scale.
- **Skeleton loaders:** `--surface` → `--card` pulse using CSS `@keyframes`, `1.4s infinite`.
- **Tab switch:** active label fades in `150ms`.
- **Staggered list:** ticket cards get `animation-delay: index * 40ms` on mount.

---

## Files to Change

| File | Change |
|------|--------|
| `app/globals.css` | Full rewrite — Mocha palette, flat rules, Syne/Outfit utilities |
| `app/layout.tsx` | Swap Inter → Syne + Outfit font imports |
| `components/BottomNav.tsx` | Swap emoji → SVG icons, new flat styles |
| `components/Header.tsx` | Remove blur, update colors/font |
| `components/TicketCard.tsx` | Full card redesign |
| `components/StatusBadge.tsx` | Flat chip style, no border |
| `components/AnnouncementCard.tsx` | Full-width, left-border style |
| `components/StatCard.tsx` | Pill-chip style |
| `app/page.tsx` (login) | Left border accent, remove color dim backgrounds |
| `app/home/page.tsx` | Three-zone layout, new greeting hero, stat chips row |
| `app/tickets/page.tsx` | Header + list style updates |
| `app/tickets/new/page.tsx` | Flat form inputs, category grid |
| `app/tickets/[id]/page.tsx` | Flat detail layout |
| `app/admin/page.tsx` | Flat filter chips, header |
| `app/admin/announcements/page.tsx` | Updated card style |
| `app/admin/announcements/new/page.tsx` | Flat form inputs |

---

## What Does NOT Change

- All TypeScript types, Supabase queries, real-time subscriptions
- Routing structure
- Session/auth logic
- All lib/ files (types, constants, supabase, utils)
- Admin vs user conditional logic
