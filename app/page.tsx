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

  const [chase, ...rest] = FAMILY_MEMBERS
  const pairs: (typeof rest)[] = []
  for (let i = 0; i < rest.length; i += 2) {
    pairs.push(rest.slice(i, i + 2))
  }

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
            textTransform: 'lowercase',
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
            letterSpacing: '2px',
          }}
        >
          frazier family
        </p>
      </div>

      <div className="w-full" style={{ maxWidth: '340px' }}>
        <MemberCard member={chase} onClick={() => handleSelect(chase.name)} className="family-card mb-3" fullWidth />
        {pairs.map((pair, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 mb-3">
            {pair.map((member) => (
              <MemberCard
                key={member.name}
                member={member}
                onClick={() => handleSelect(member.name)}
                className="family-card"
              />
            ))}
          </div>
        ))}
      </div>

      <p
        style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-3)',
          marginTop: '16px',
          letterSpacing: '1px',
        }}
      >
        select user
      </p>
    </div>
  )
}

interface MemberCardProps {
  member: (typeof FAMILY_MEMBERS)[0]
  onClick: () => void
  className?: string
  fullWidth?: boolean
}

function MemberCard({ member, onClick, className, fullWidth }: MemberCardProps) {
  const initial = member.name.charAt(0).toUpperCase()

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-colors duration-150 ${className ?? ''}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: fullWidth ? '14px 16px' : '16px 12px',
        display: 'flex',
        flexDirection: fullWidth ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: fullWidth ? 'flex-start' : 'center',
        gap: fullWidth ? '14px' : '8px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius)',
          background: `color-mix(in srgb, ${member.color} 15%, transparent)`,
          border: `1px solid color-mix(in srgb, ${member.color} 30%, transparent)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          fontWeight: 700,
          color: member.color,
          flexShrink: 0,
        }}
      >
        {initial}
      </div>
      <div style={{ textAlign: fullWidth ? 'left' : 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-outfit)', color: 'var(--text-1)' }}>
          {member.name}
        </div>
        {member.isAdmin && (
          <div
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-3)',
              marginTop: '2px',
              letterSpacing: '0.5px',
            }}
          >
            admin
          </div>
        )}
      </div>
    </div>
  )
}
