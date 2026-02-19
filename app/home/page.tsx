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
