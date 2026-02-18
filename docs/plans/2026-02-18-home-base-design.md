# Home Base — Family Ticket System Design
**Date:** 2026-02-18
**Status:** Approved

## Overview

A mobile-focused web app for the Frazier family to report and track home issues (smart home, Hello Fresh deliveries, Water HQ shower tracker, etc.) with an admin announcements board managed by Chase.

**Family members:** Chase (Admin), Mom, Dad, Livia, A.J.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Database | Supabase (PostgreSQL + real-time) |
| Styling | Tailwind CSS + shadcn/ui |
| Deployment | Vercel (auto-deploy on git push) |
| Session | localStorage (name stored client-side) |

---

## Architecture

**Auth approach:** No real authentication. User selects their name from a picker on first load. Name is stored in `localStorage` as the session. Chase's name = admin access.

**Real-time:** Supabase `channel.on('postgres_changes', ...)` subscriptions keep tickets and announcements live without page refresh.

**Routing (App Router):**
```
app/
  page.tsx                    → Name picker (login)
  layout.tsx                  → Root layout + BottomNav
  home/page.tsx               → Dashboard (admin or user view)
  tickets/
    new/page.tsx              → New ticket form
    [id]/page.tsx             → Ticket detail
  admin/
    page.tsx                  → Admin ticket management
    announcements/
      page.tsx                → Manage announcements list
      new/page.tsx            → New announcement form
```

---

## Data Model

### `tickets` table
```sql
CREATE TABLE tickets (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  description text,
  category    text NOT NULL,  -- 'smart-home' | 'hello-fresh' | 'water-hq' | 'grocery' | 'maintenance' | 'other'
  priority    text NOT NULL DEFAULT 'medium',  -- 'low' | 'medium' | 'high'
  status      text NOT NULL DEFAULT 'open',    -- 'open' | 'in-progress' | 'pending' | 'closed'
  author      text NOT NULL,  -- family member name
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
```

### `announcements` table
```sql
CREATE TABLE announcements (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title      text NOT NULL,
  content    text NOT NULL,
  pinned     boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

---

## UI Screens

### 1. Name Picker (`/`)
- Grid of 5 family member cards (Chase, Mom, Dad, Livia, A.J.)
- Chase's card has an "Admin" badge
- Tap to set session and redirect to `/home`

### 2. User Home (`/home`)
- Prominent "Submit a Ticket" CTA button
- Horizontally scrollable pinned announcements
- Recent tickets list (own tickets only)
- Bottom nav: Home | My Tickets | New Ticket

### 3. Admin Home (`/home` — admin view)
- Stats row: open / in-progress / pending / closed counts
- Link to all tickets + announcements management
- Bottom nav: Home | Tickets | Announcements

### 4. New Ticket (`/tickets/new`)
- Category grid picker with emoji icons
- Title input, description textarea
- Priority selector (Low / Medium / High)
- Submit button

### 5. Ticket Detail (`/tickets/[id]`)
- Category badge, title, meta (author, date, priority)
- Description
- **Admin only:** Status changer buttons + Delete ticket
- **User:** Read-only view of status

### 6. Admin Ticket Management (`/admin`)
- Filter tabs: All / Open / In-Progress / Pending / Closed
- Full ticket list with status badges

### 7. Announcements Management (`/admin/announcements`)
- List of announcements with pin/unpin and delete actions
- "+" button to create new

### 8. New Announcement (`/admin/announcements/new`)
- Title + content inputs
- Pin toggle
- Post button

---

## Visual Design

**Aesthetic:** Warm, dark "home" feel — cozy and inviting, not clinical.

- **Background:** Deep brown-black (`#1A1208`)
- **Cards:** Warm dark surface (`#2C1F0F`) with amber borders
- **Accent:** Golden amber (`#D4A853`)
- **Typography:** `Cormorant Garamond` (display/headings) + `Outfit` (body)
- **Layout:** Mobile-first, max-width 430px, centered on desktop
- **Nav:** Fixed bottom navigation bar
- **Effects:** Subtle grain texture overlay, glassmorphism bottom nav

**Status colors:**
- Open → Green (`#7FB069`)
- In Progress → Blue (`#6A94C4`)
- Pending → Amber (`#D4A853`)
- Closed → Muted gray

**Ticket categories:**
- 🏠 Smart Home
- 🥗 Hello Fresh
- 🚿 Water HQ
- 🛒 Grocery
- 🔧 Maintenance
- 📋 Other

---

## Key Components

- `NamePicker` — login screen
- `BottomNav` — role-aware navigation
- `TicketCard` — ticket list item with status badge
- `CategoryGrid` — emoji category picker
- `AnnouncementCard` — pinned/regular announcement display
- `StatusBadge` — colored status pill
- `StatCard` — admin dashboard stat display
