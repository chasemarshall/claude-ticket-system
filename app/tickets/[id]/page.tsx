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
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
  { value: 'closed', label: 'Closed' },
]

const PRIORITY_COLOR: Record<string, string> = {
  high: 'var(--rose)',
  medium: 'var(--accent)',
  low: 'var(--sage)',
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
            background: category.colorDim,
            border: '1px solid var(--border)',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '12px',
            color: 'var(--text-2)',
            marginBottom: '12px',
          }}
        >
          {category.emoji} {category.name}
        </div>

        <h1
          className="font-display"
          style={{ fontSize: '30px', fontWeight: 400, color: 'var(--text-1)', lineHeight: 1.2, marginBottom: '16px' }}
        >
          {ticket.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 items-center">
          <StatusBadge status={ticket.status} />
          <span
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              padding: '3px 10px',
              fontSize: '11px',
              color: 'var(--text-2)',
            }}
          >
            By {ticket.author}
          </span>
          <span
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              padding: '3px 10px',
              fontSize: '11px',
              color: 'var(--text-2)',
            }}
          >
            {formatDate(ticket.created_at)}
          </span>
          <span
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              padding: '3px 10px',
              fontSize: '11px',
              color: PRIORITY_COLOR[ticket.priority],
            }}
          >
            ⚡ {ticket.priority}
          </span>
        </div>
      </div>

      {/* Description */}
      {ticket.description && (
        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h4
            style={{
              fontSize: '11px',
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.7px',
              marginBottom: '10px',
            }}
          >
            Description
          </h4>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.65 }}>{ticket.description}</p>
        </div>
      )}

      {/* Admin: status controls */}
      {isAdmin && (
        <>
          <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
            <h4
              style={{
                fontSize: '11px',
                color: 'var(--text-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.7px',
                marginBottom: '12px',
              }}
            >
              Update Status
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => updateStatus(s.value)}
                  disabled={updating || ticket.status === s.value}
                  style={{
                    padding: '11px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: ticket.status === s.value ? 'default' : 'pointer',
                    fontFamily: 'var(--font-inter)',
                    transition: 'all 0.15s',
                    ...(ticket.status === s.value
                      ? {
                          background: 'var(--accent-dim)',
                          border: '1.5px solid var(--accent)',
                          color: 'var(--accent)',
                        }
                      : {
                          background: 'var(--card)',
                          border: '1.5px solid var(--border)',
                          color: 'var(--text-2)',
                        }),
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-5">
            <button
              onClick={deleteTicket}
              style={{
                width: '100%',
                background: 'var(--rose-dim)',
                border: '1.5px solid rgba(196,122,106,0.3)',
                borderRadius: '14px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--rose)',
                cursor: 'pointer',
                fontFamily: 'var(--font-inter)',
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
