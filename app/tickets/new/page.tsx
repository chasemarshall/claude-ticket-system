'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/constants'
import { TicketCategory, TicketPriority } from '@/lib/types'
import Header from '@/components/Header'

const PRIORITIES: { value: TicketPriority; label: string; color: string }[] = [
  { value: 'low',    label: 'low',    color: 'var(--green)' },
  { value: 'medium', label: 'medium', color: 'var(--peach)' },
  { value: 'high',   label: 'high',   color: 'var(--red)'   },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--border)',
  padding: '12px 0',
  fontSize: '14px',
  fontFamily: 'var(--font-outfit)',
  fontWeight: 400,
  color: 'var(--text-1)',
  outline: 'none',
}

export default function NewTicketPage() {
  const { user, loading } = useSession()
  const router = useRouter()
  const { showToast } = useToast()
  const [category, setCategory] = useState<TicketCategory | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/')
  }, [user, loading, router])

  if (loading || !user) return null

  const handleSubmit = async () => {
    if (!category) { showToast('select a category', 'error'); return }
    if (!title.trim()) { showToast('add a title', 'error'); return }
    setSubmitting(true)
    const { error } = await supabase.from('tickets').insert({
      title: title.trim(),
      description: description.trim() || null,
      category,
      priority,
      status: 'open',
      author: user,
    })
    if (error) {
      showToast(error.message || 'failed to submit', 'error')
      setSubmitting(false)
    } else {
      showToast('ticket submitted')
      router.push('/tickets')
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
      <Header title="new ticket" showBack />

      <div className="px-5 pt-6">
        {/* Category */}
        <div style={{ marginBottom: '28px' }}>
          <p
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-3)',
              marginBottom: '12px',
            }}
          >
            # category
          </p>
          <div className="flex gap-3 flex-wrap">
            {CATEGORIES.map((cat) => {
              const selected = category === cat.id
              return (
                <span
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className="cursor-pointer"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: selected ? 'var(--accent)' : 'var(--text-3)',
                    borderBottom: selected ? '1px solid var(--accent)' : '1px solid transparent',
                    paddingBottom: '2px',
                  }}
                >
                  {cat.name.toLowerCase()}
                </span>
              )
            })}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '24px' }}>
          <p
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-3)',
              marginBottom: '4px',
            }}
          >
            # title
          </p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="brief description..."
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderBottomColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderBottomColor = 'var(--border)')}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '24px' }}>
          <p
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-3)',
              marginBottom: '4px',
            }}
          >
            # details <span style={{ color: 'var(--text-3)' }}>(optional)</span>
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="what happened? when did it start?"
            rows={3}
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={(e) => (e.target.style.borderBottomColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderBottomColor = 'var(--border)')}
          />
        </div>

        {/* Priority */}
        <div style={{ marginBottom: '32px' }}>
          <p
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-3)',
              marginBottom: '12px',
            }}
          >
            # priority
          </p>
          <div className="flex gap-4">
            {PRIORITIES.map((p) => {
              const selected = priority === p.value
              return (
                <span
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className="cursor-pointer"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: selected ? p.color : 'var(--text-3)',
                    borderBottom: selected ? `1px solid ${p.color}` : '1px solid transparent',
                    paddingBottom: '2px',
                  }}
                >
                  {p.label}
                </span>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        <div
          onClick={!submitting ? handleSubmit : undefined}
          style={{
            padding: '14px 0',
            borderTop: '1px solid var(--border)',
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: submitting ? 'var(--text-3)' : 'var(--accent)',
            }}
          >
            {submitting ? 'submitting...' : 'submit ticket ->'}
          </span>
        </div>
      </div>
    </div>
  )
}
