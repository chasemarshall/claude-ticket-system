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
            <div
              key={i}
              style={{
                height: '72px',
                background: 'var(--card)',
                borderRadius: '14px',
                opacity: 0.5,
              }}
            />
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
            <div style={{ fontSize: '40px', opacity: 0.3, marginBottom: '12px' }}>✅</div>
            <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.6 }}>
              No tickets from you yet.
              <br />
              Everything running smoothly!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
