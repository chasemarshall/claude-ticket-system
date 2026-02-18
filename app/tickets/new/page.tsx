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
  { value: 'low', label: 'Low', color: '#4ade80' },
  { value: 'medium', label: 'Medium', color: '#fbbf24' },
  { value: 'high', label: 'High', color: '#f87171' },
]

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
      showToast('Failed to submit ticket', 'error')
      setSubmitting(false)
    } else {
      showToast('Ticket submitted ✓')
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
      <Header title="New Ticket" showBack />

      <div className="flex flex-col gap-6 px-5 pt-6">
        {/* Category */}
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: '10px' }}>
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className="cursor-pointer transition-all duration-150 active:scale-95"
                style={{
                  background: category === cat.id ? cat.colorDim : 'var(--card)',
                  border: `1.5px solid ${category === cat.id ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  padding: '14px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{cat.emoji}</div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: category === cat.id ? 'var(--accent)' : 'var(--text-2)',
                  }}
                >
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: '10px' }}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of the issue..."
            style={{
              width: '100%',
              background: 'var(--card)',
              border: '1.5px solid var(--border)',
              borderRadius: '10px',
              padding: '14px 16px',
              fontSize: '15px',
              color: 'var(--text-1)',
              outline: 'none',
              fontFamily: 'var(--font-dm-sans)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-border)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: '10px' }}>
            Details <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? When did it start?"
            rows={4}
            style={{
              width: '100%',
              background: 'var(--card)',
              border: '1.5px solid var(--border)',
              borderRadius: '10px',
              padding: '14px 16px',
              fontSize: '15px',
              color: 'var(--text-1)',
              outline: 'none',
              fontFamily: 'var(--font-dm-sans)',
              resize: 'none',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-border)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Priority */}
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: '10px' }}>
            Priority
          </label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                onClick={() => setPriority(p.value)}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  borderRadius: '10px',
                  background: priority === p.value ? `${p.color}20` : 'var(--card)',
                  border: `1.5px solid ${priority === p.value ? p.color : 'var(--border)'}`,
                  color: priority === p.value ? p.color : 'var(--text-2)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-dm-sans)',
                  transition: 'all 0.15s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%',
            background: submitting ? 'var(--border)' : 'var(--accent)',
            color: '#0f0e1a',
            border: 'none',
            borderRadius: '14px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-dm-sans)',
            transition: 'all 0.2s',
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </div>
    </div>
  )
}
