'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase } from '@/lib/supabase'
import { Announcement } from '@/lib/types'
import { timeAgo } from '@/lib/utils'
import Header from '@/components/Header'
import Linkify from '@/components/Linkify'

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
      showToast(ann.pinned ? 'unpinned' : 'pinned')
    }
  }

  const deleteAnn = async (id: string) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (!error) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id))
      showToast('deleted')
    }
  }

  if (loading || !user || !isAdmin) return null

  const AddAction = (
    <span
      onClick={() => router.push('/admin/announcements/new')}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        color: 'var(--accent)',
        cursor: 'pointer',
      }}
    >
      + new
    </span>
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
      <Header title="announcements" showAvatar action={AddAction} />

      <div className="px-5 pt-4">
        {dataLoading ? (
          [1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ height: '80px', marginBottom: '1px' }} />
          ))
        ) : announcements.length > 0 ? (
          announcements.map((ann) => (
            <div
              key={ann.id}
              style={{
                padding: '14px 0',
                borderBottom: '1px solid var(--border)',
                borderLeft: ann.pinned ? '3px solid var(--accent)' : 'none',
                paddingLeft: ann.pinned ? '14px' : '0',
              }}
            >
              {ann.pinned && (
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent)',
                    marginBottom: '4px',
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
              {ann.content && (
                <div
                  style={{
                    fontSize: '13px',
                    fontFamily: 'var(--font-outfit)',
                    fontWeight: 300,
                    color: 'var(--text-2)',
                    lineHeight: 1.55,
                    marginBottom: '10px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  <Linkify>{ann.content}</Linkify>
                </div>
              )}
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
                <div className="flex gap-4">
                  <span
                    onClick={() => router.push(`/admin/announcements/${ann.id}`)}
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-2)',
                      cursor: 'pointer',
                    }}
                  >
                    edit
                  </span>
                  <span
                    onClick={() => togglePin(ann)}
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: ann.pinned ? 'var(--accent)' : 'var(--text-3)',
                      cursor: 'pointer',
                    }}
                  >
                    {ann.pinned ? 'unpin' : 'pin'}
                  </span>
                  <span
                    onClick={() => deleteAnn(ann.id)}
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--red)',
                      cursor: 'pointer',
                    }}
                  >
                    delete
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20">
            <p
              style={{
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-3)',
              }}
            >
              no announcements yet — tap + new to create one
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
