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
  { value: 'open',        label: 'open'        },
  { value: 'in-progress', label: 'in progress' },
  { value: 'pending',     label: 'pending'     },
  { value: 'closed',      label: 'closed'      },
]

const PRIORITY_COLOR: Record<string, string> = {
  high:   'var(--red)',
  medium: 'var(--peach)',
  low:    'var(--green)',
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
      showToast(`status -> ${status}`)
    }
    setUpdating(false)
  }

  const deleteTicket = async () => {
    const { error } = await supabase.from('tickets').delete().eq('id', ticket.id)
    if (!error) {
      showToast('ticket deleted')
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
      <Header title="ticket" showBack />

      {/* Title */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--text-1)',
            lineHeight: 1.3,
            letterSpacing: '-0.5px',
            marginBottom: '12px',
          }}
        >
          {ticket.title}
        </h1>

        {/* Meta */}
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <StatusBadge status={ticket.status} />
          <span style={{ color: 'var(--border)' }}>/</span>
          <span>{category.name.toLowerCase()}</span>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span>{ticket.author.toLowerCase()}</span>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span>{formatDate(ticket.created_at)}</span>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ color: PRIORITY_COLOR[ticket.priority] }}>{ticket.priority}</span>
        </div>
      </div>

      {/* Description */}
      {ticket.description && (
        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <p
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-3)',
              marginBottom: '8px',
            }}
          >
            # description
          </p>
          <p
            style={{
              fontSize: '14px',
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
            <p
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-3)',
                marginBottom: '12px',
              }}
            >
              # update status
            </p>
            <div className="flex gap-4 flex-wrap">
              {STATUSES.map((s) => {
                const isCurrent = ticket.status === s.value
                return (
                  <span
                    key={s.value}
                    onClick={() => !isCurrent && !updating && updateStatus(s.value)}
                    style={{
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      color: isCurrent ? 'var(--accent)' : 'var(--text-3)',
                      cursor: isCurrent ? 'default' : 'pointer',
                      borderBottom: isCurrent ? '1px solid var(--accent)' : '1px solid transparent',
                      paddingBottom: '2px',
                    }}
                  >
                    {s.label}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="px-5 py-5">
            <span
              onClick={deleteTicket}
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--red)',
                cursor: 'pointer',
              }}
            >
              delete ticket
            </span>
          </div>
        </>
      )}
    </div>
  )
}
