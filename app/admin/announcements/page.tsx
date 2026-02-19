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
      showToast(ann.pinned ? 'Unpinned' : 'Pinned')
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
        borderRadius: 'var(--radius)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--accent)',
        fontSize: '16px',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
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
      <Header title="announcements" showAvatar action={AddButton} />

      <div className="flex flex-col gap-3 px-5 pt-5">
        {dataLoading ? (
          [1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ height: '100px' }} />
          ))
        ) : announcements.length > 0 ? (
          announcements.map((ann) => (
            <div
              key={ann.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${ann.pinned ? 'var(--yellow)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: '16px',
              }}
            >
              {ann.pinned && (
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--yellow)',
                    letterSpacing: '0.5px',
                    fontWeight: 400,
                    marginBottom: '6px',
                  }}
                >
                  pinned
                </div>
              )}
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-outfit)',
                  color: 'var(--text-1)',
                  marginBottom: '4px',
                }}
              >
                {ann.title}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontFamily: 'var(--font-outfit)',
                  fontWeight: 300,
                  color: 'var(--text-2)',
                  lineHeight: 1.55,
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
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-3)',
                  }}
                >
                  {timeAgo(ann.created_at)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePin(ann)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius)',
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: ann.pinned ? 'var(--accent)' : 'var(--text-2)',
                      cursor: 'pointer',
                    }}
                  >
                    {ann.pinned ? 'unpin' : 'pin'}
                  </button>
                  <button
                    onClick={() => deleteAnn(ann.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius)',
                      background: 'var(--red-dim)',
                      border: '1px solid rgba(243,139,168,0.25)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--red)',
                      cursor: 'pointer',
                    }}
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p
              style={{
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 400,
                color: 'var(--text-3)',
              }}
            >
              no announcements yet — tap + to create one
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
