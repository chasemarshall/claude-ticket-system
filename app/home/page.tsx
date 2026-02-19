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
  if (h < 12) return 'good morning'
  if (h < 17) return 'good afternoon'
  return 'good evening'
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
      <Header title="kin" showAvatar />

      {/* Greeting */}
      <div className="px-5 pt-8 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <p
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 400,
            color: 'var(--text-3)',
            marginBottom: '4px',
          }}
        >
          {getGreeting()}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '36px',
            fontWeight: 700,
            color: 'var(--text-1)',
            lineHeight: 1,
            letterSpacing: '-1px',
            marginBottom: '8px',
          }}
        >
          {user.toLowerCase()}
        </h1>
        <p
          style={{
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 400,
            color: inlineSummaryParts.length > 0 ? 'var(--text-2)' : 'var(--text-3)',
          }}
        >
          {inlineSummaryParts.length > 0 ? inlineSummaryParts.join(' / ') : 'all clear'}
        </p>
      </div>

      {/* Stats row (admin only) */}
      {isAdmin && (
        <div
          className="flex gap-6 px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <StatCard value={stats.open}       label="open"        color="var(--green)"  />
          <StatCard value={stats.inProgress} label="in progress" color="var(--blue)"   />
          <StatCard value={stats.pending}    label="pending"     color="var(--yellow)" />
          <StatCard value={stats.closed}     label="closed"      color="var(--text-3)" />
        </div>
      )}

      {/* User submit CTA */}
      {!isAdmin && (
        <div
          onClick={() => router.push('/tickets/new')}
          className="px-5 py-4 cursor-pointer"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <span
              style={{
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent)',
              }}
            >
              submit a ticket
            </span>
            <span
              style={{
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-3)',
              }}
            >
              -&gt;
            </span>
          </div>
        </div>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="px-5 pt-6">
          <p
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-3)',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}
          >
            # announcements
          </p>
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      )}

      {/* Recent tickets */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <p
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-3)',
              letterSpacing: '1px',
            }}
          >
            # {isAdmin ? 'recent tickets' : 'my tickets'}
          </p>
          <span
            onClick={() => router.push(isAdmin ? '/admin' : '/tickets')}
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent)',
              cursor: 'pointer',
            }}
          >
            see all -&gt;
          </span>
        </div>

        {dataLoading ? (
          <div className="flex flex-col gap-0">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton" style={{ height: '56px', marginBottom: '1px' }} />
            ))}
          </div>
        ) : recentTickets.length > 0 ? (
          <div>
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
          <div className="py-10">
            <p
              style={{
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-3)',
              }}
            >
              {isAdmin ? 'no tickets yet' : 'no tickets yet — all clear'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
