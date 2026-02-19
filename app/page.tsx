'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { FAMILY_MEMBERS } from '@/lib/constants'

export default function LoginPage() {
  const { user, loading, setUser } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.push('/home')
  }, [user, loading, router])

  const handleSelect = (name: string) => {
    setUser(name)
    router.push('/home')
  }

  if (loading) return null

  return (
    <div
      className="flex flex-col items-center justify-center p-6"
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        paddingTop: 'calc(24px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="text-center mb-12">
        <h1
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '48px',
            fontWeight: 700,
            color: 'var(--text-1)',
            lineHeight: 1,
            letterSpacing: '-2px',
          }}
        >
          kin
        </h1>
        <p
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 400,
            color: 'var(--text-3)',
            marginTop: '8px',
          }}
        >
          frazier family
        </p>
      </div>

      <div className="w-full" style={{ maxWidth: '300px' }}>
        {FAMILY_MEMBERS.map((member, i) => (
          <div
            key={member.name}
            onClick={() => handleSelect(member.name)}
            className="family-card cursor-pointer"
            style={{
              padding: '12px 0',
              borderBottom: i < FAMILY_MEMBERS.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div className="flex items-center gap-3">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: member.color,
                  width: '20px',
                }}
              >
                {member.name.charAt(0).toLowerCase()}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'var(--text-1)',
                }}
              >
                {member.name.toLowerCase()}
              </span>
            </div>
            {member.isAdmin && (
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-3)',
                }}
              >
                admin
              </span>
            )}
          </div>
        ))}
      </div>

      <p
        style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-3)',
          marginTop: '24px',
        }}
      >
        select user
      </p>
    </div>
  )
}
