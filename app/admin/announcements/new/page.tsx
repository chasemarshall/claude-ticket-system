'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '13px 16px',
  fontSize: '15px',
  fontFamily: 'var(--font-outfit)',
  fontWeight: 300,
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
    if (!title.trim()) { showToast('Please add a title', 'error'); return }

    setSubmitting(true)
    const { error } = await supabase.from('announcements').insert({
      title: title.trim(),
      content: content.trim(),
      pinned,
    })

    if (error) {
      showToast('Failed to post announcement', 'error')
      setSubmitting(false)
    } else {
      showToast('Announcement posted ✓')
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
      <Header title="New Post" showBack />

      <div className="flex flex-col gap-6 px-5 pt-6">
        {/* Title */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '10px',
            }}
          >
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's the announcement?"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Content */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '10px',
            }}
          >
            Message
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Details for the family..."
            rows={5}
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Pin toggle */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11px',
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '10px',
            }}
          >
            Options
          </label>
          <div
            onClick={() => setPinned(!pinned)}
            className="cursor-pointer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--card)',
              border: `1px solid ${pinned ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '8px',
              padding: '14px 16px',
              transition: 'border-color 0.15s',
            }}
          >
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '18px' }}>📌</span>
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontFamily: 'var(--font-outfit)',
                    color: 'var(--text-1)',
                    fontWeight: 500,
                  }}
                >
                  Pin this announcement
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
                  Pinned posts appear first
                </div>
              </div>
            </div>
            {/* Toggle */}
            <div
              style={{
                width: '44px',
                height: '26px',
                borderRadius: '13px',
                background: pinned ? 'var(--accent)' : 'var(--border)',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: pinned ? '21px' : '3px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'var(--text-1)',
                  transition: 'left 0.2s',
                }}
              />
            </div>
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
            borderRadius: '10px',
            padding: '15px',
            fontSize: '15px',
            fontWeight: 600,
            fontFamily: 'var(--font-outfit)',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {submitting ? 'Posting...' : 'Post Announcement'}
        </button>
      </div>
    </div>
  )
}
