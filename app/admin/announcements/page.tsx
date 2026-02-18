'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase } from '@/lib/supabase'
import { Announcement } from '@/lib/types'
import { timeAgo } from '@/lib/utils'
import Header from '@/components/Header'

export default function AnnouncementsPage() {
  const { user, isAdmin, loading } = useSession()
  const router = useRouter()
  const { showToast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  const fetchAnnouncements = useCallback(async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
    if (data) setAnnouncements(data)
    setDataLoading(false)
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/'); return }
    if (!isAdmin) { router.push('/home'); return }
    fetchAnnouncements()
  }, [user, isAdmin, loading, router, fetchAnnouncements])

  const togglePin = async (ann: Announcement) => {
    const { error } = await supabase
      .from('announcements')
      .update({ pinned: !ann.pinned })
      .eq('id', ann.id)
    if (!error) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === ann.id ? { ...a, pinned: !ann.pinned } : a))
      )
      showToast(ann.pinned ? 'Unpinned' : 'Pinned ✓')
    }
  }

  const deleteAnn = async (id: string) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (!error) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id))
      showToast('Deleted')
    }
  }

  if (loading || !user || !isAdmin) return null

  const AddButton = (
    <button
      onClick={() => router.push('/admin/announcements/new')}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        background: 'var(--accent-dim)',
        border: '1px solid var(--accent-border)',
        color: 'var(--accent)',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontWeight: 300,
      }}
    >
      +
    </button>
  )

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
      <Header title="Announcements" showAvatar action={AddButton} />

      <div className="flex flex-col gap-3 px-5 pt-5">
        {dataLoading ? (
          [1, 2].map((i) => (
            <div key={i} style={{ height: '100px', background: 'var(--card)', borderRadius: '14px', opacity: 0.5 }} />
          ))
        ) : announcements.length > 0 ? (
          announcements.map((ann) => (
            <div
              key={ann.id}
              style={{
                background: 'var(--card)',
                border: ann.pinned ? '1px solid var(--accent-border)' : '1px solid var(--border)',
                borderRadius: '14px',
                padding: '16px',
              }}
            >
              {ann.pinned && (
                <div
                  style={{
                    fontSize: '10px',
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  📌 Pinned
                </div>
              )}
              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-1)', marginBottom: '4px' }}>
                {ann.title}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-3)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden',
                  marginBottom: '12px',
                }}
              >
                {ann.content}
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{timeAgo(ann.created_at)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePin(ann)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      fontSize: '12px',
                      color: ann.pinned ? 'var(--accent)' : 'var(--text-2)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-outfit)',
                    }}
                  >
                    {ann.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    onClick={() => deleteAnn(ann.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'var(--rose-dim)',
                      border: '1px solid rgba(196,122,106,0.25)',
                      fontSize: '12px',
                      color: 'var(--rose)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-outfit)',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div style={{ fontSize: '40px', opacity: 0.3, marginBottom: '12px' }}>📢</div>
            <p style={{ fontSize: '14px', color: 'var(--text-3)' }}>
              No announcements yet.
              <br />
              Tap + to create one.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
