'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'

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

export default function NewAnnouncementPage() {
  const { user, isAdmin, loading } = useSession()
  const router = useRouter()
  const { showToast } = useToast()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pinned, setPinned] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/')
    if (!loading && !isAdmin) router.push('/home')
  }, [user, isAdmin, loading, router])

  if (loading || !user || !isAdmin) return null

  const handleSubmit = async () => {
    if (!title.trim()) { showToast('add a title', 'error'); return }

    setSubmitting(true)
    const { error } = await supabase.from('announcements').insert({
      title: title.trim(),
      content: content.trim(),
      pinned,
    })

    if (error) {
      showToast('failed to post', 'error')
      setSubmitting(false)
    } else {
      showToast('posted')
      router.push('/admin/announcements')
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
      <Header title="new post" showBack />

      <div className="px-5 pt-6">
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
            placeholder="what's the announcement?"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderBottomColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderBottomColor = 'var(--border)')}
          />
        </div>

        {/* Content */}
        <div style={{ marginBottom: '24px' }}>
          <p
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-3)',
              marginBottom: '4px',
            }}
          >
            # message
          </p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="details for the family..."
            rows={4}
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={(e) => (e.target.style.borderBottomColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderBottomColor = 'var(--border)')}
          />
        </div>

        {/* Pin toggle */}
        <div
          onClick={() => setPinned(!pinned)}
          className="cursor-pointer"
          style={{
            padding: '14px 0',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-1)',
              }}
            >
              pin this post
            </div>
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-outfit)',
                fontWeight: 300,
                color: 'var(--text-3)',
                marginTop: '2px',
              }}
            >
              pinned posts appear first
            </div>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: pinned ? 'var(--accent)' : 'var(--text-3)',
            }}
          >
            {pinned ? '[x]' : '[ ]'}
          </span>
        </div>

        {/* Submit */}
        <div
          onClick={!submitting ? handleSubmit : undefined}
          style={{
            padding: '14px 0',
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
            {submitting ? 'posting...' : 'post announcement ->'}
          </span>
        </div>
      </div>
    </div>
  )
}
