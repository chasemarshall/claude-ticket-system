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
