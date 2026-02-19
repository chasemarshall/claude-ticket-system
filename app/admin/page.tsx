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
  { value: 'all',         label: 'all'         },
  { value: 'open',        label: 'open'        },
  { value: 'in-progress', label: 'in progress' },
  { value: 'pending',     label: 'pending'     },
  { value: 'closed',      label: 'closed'      },
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
      <Header title="all tickets" showAvatar />

      {/* Stats */}
      <div
        className="flex gap-6 px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <StatCard value={stats.open}       label="open"        color="var(--green)"  />
        <StatCard value={stats.inProgress} label="in progress" color="var(--blue)"   />
        <StatCard value={stats.pending}    label="pending"     color="var(--yellow)" />
        <StatCard value={stats.closed}     label="closed"      color="var(--text-3)" />
      </div>

      {/* Filters */}
      <div
        className="flex gap-4 px-5 py-3"
        style={{ borderBottom: '1px solid var(--border)', overflowX: 'auto' }}
      >
        {FILTERS.map((f) => (
          <span
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: filter === f.value ? 'var(--accent)' : 'var(--text-3)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderBottom: filter === f.value ? '1px solid var(--accent)' : '1px solid transparent',
              paddingBottom: '2px',
            }}
          >
            {f.label}
          </span>
        ))}
      </div>

      {/* Tickets */}
      <div className="px-5 pt-2">
        {dataLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '56px', marginBottom: '1px' }} />
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
          <div className="py-16">
            <p
              style={{
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-3)',
              }}
            >
              no {filter !== 'all' ? filter : ''} tickets
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
