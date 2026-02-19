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
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: '13px 16px',
  fontSize: '14px',
  fontFamily: 'var(--font-outfit)',
  fontWeight: 400,
  color: 'var(--text-1)',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  fontFamily: 'var(--font-mono)',
  fontWeight: 400,
  color: 'var(--text-3)',
  letterSpacing: '1px',
  marginBottom: '10px',
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
    if (!category) { showToast('Please select a category', 'error'); return }
    if (!title.trim()) { showToast('Please add a title', 'error'); return }
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
      showToast(error.message || 'Failed to submit ticket', 'error')
      setSubmitting(false)
    } else {
      showToast('Ticket submitted')
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

      <div className="flex flex-col gap-6 px-5 pt-6">
        {/* Category */}
        <div>
          <label style={labelStyle}>category</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const selected = category === cat.id
              return (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className="cursor-pointer transition-colors duration-150"
                  style={{
                    background: selected ? 'var(--card)' : 'var(--surface)',
                    border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    padding: '12px 8px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: selected ? 700 : 400,
                      color: selected ? 'var(--accent)' : 'var(--text-2)',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {cat.name.toLowerCase()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label style={labelStyle}>title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of the issue..."
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>
            details <span style={{ color: 'var(--text-3)' }}>(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? When did it start?"
            rows={4}
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Priority */}
        <div>
          <label style={labelStyle}>priority</label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => {
              const selected = priority === p.value
              return (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    borderRadius: 'var(--radius)',
                    background: selected ? `color-mix(in srgb, ${p.color} 15%, transparent)` : 'var(--surface)',
                    border: `1px solid ${selected ? p.color : 'var(--border)'}`,
                    color: selected ? p.color : 'var(--text-2)',
                    fontSize: '12px',
                    fontWeight: 400,
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    letterSpacing: '0.3px',
                  }}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%',
            background: submitting ? 'var(--card)' : 'var(--accent)',
            color: submitting ? 'var(--text-3)' : 'var(--bg)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '14px',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            letterSpacing: '0.3px',
          }}
        >
          {submitting ? 'submitting...' : 'submit ticket'}
        </button>
      </div>
    </div>
  )
}
