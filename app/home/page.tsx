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
  const recentTickets = isAdmin ? tickets.slice(0, 3) : myTickets.slice(0, 3)

  const stats = {
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in-progress').length,
    pending: tickets.filter((t) => t.status === 'pending').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
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
      <Header title="Kin" showAvatar />

      {/* Welcome */}
      <div className="px-5 pt-6 pb-2">
        <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
          Good to see you
        </p>
        <h1 className="font-display" style={{ fontSize: '38px', fontWeight: 300, color: 'var(--text-1)', lineHeight: 1 }}>
          {user}
        </h1>
      </div>

      {/* Admin: stats */}
      {isAdmin && (
        <div className="grid grid-cols-2 gap-3 px-5 pt-5">
          <StatCard value={stats.open} label="Open" color="var(--sage)" />
          <StatCard value={stats.inProgress} label="In Progress" color="var(--sky)" />
          <StatCard value={stats.pending} label="Pending" color="var(--accent)" />
          <StatCard value={stats.closed} label="Closed" color="var(--text-3)" />
        </div>
      )}

      {/* User: CTA */}
      {!isAdmin && (
        <div className="px-5 pt-5">
          <div
            onClick={() => router.push('/tickets/new')}
            className="cursor-pointer active:opacity-85 active:scale-99 transition-all duration-150"
            style={{
              background: 'var(--accent)',
              borderRadius: '16px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '17px', fontWeight: 600, color: '#0a0907' }}>Submit a Ticket</div>
              <div style={{ fontSize: '12px', color: 'rgba(10,9,7,0.6)', marginTop: '2px' }}>
                Report an issue to Chase
              </div>
            </div>
            <span style={{ fontSize: '28px' }}>🎫</span>
          </div>
        </div>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="pt-6">
          <div className="flex items-center justify-between px-5 mb-3">
            <h3
              className="font-display"
              style={{ fontSize: '22px', fontWeight: 400, color: 'var(--text-1)' }}
            >
              Announcements
            </h3>
          </div>
          <div
            className="flex gap-3 px-5"
            style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
          >
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        </div>
      )}

      {/* Recent tickets */}
      <div className="pt-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h3 className="font-display" style={{ fontSize: '22px', fontWeight: 400, color: 'var(--text-1)' }}>
            {isAdmin ? 'Recent Tickets' : 'My Tickets'}
          </h3>
          <span
            onClick={() => router.push(isAdmin ? '/admin' : '/tickets')}
            className="cursor-pointer"
            style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            See all
          </span>
        </div>

        {dataLoading ? (
          <div className="px-5">
            {[1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: '72px',
                  background: 'var(--card)',
                  borderRadius: '14px',
                  marginBottom: '10px',
                  opacity: 0.5,
                }}
              />
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
            <div style={{ fontSize: '36px', opacity: 0.3, marginBottom: '10px' }}>✅</div>
            <p style={{ fontSize: '14px', color: 'var(--text-3)' }}>
              {isAdmin ? 'No tickets yet' : 'No tickets from you yet.\nEverything running smoothly!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
