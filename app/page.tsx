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
      <div className="text-center mb-10">
        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '64px',
            fontWeight: 700,
            color: 'var(--text-1)',
            lineHeight: 1,
            letterSpacing: '-1px',
          }}
        >
          Kin
        </h1>
        <p
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-outfit)',
            fontWeight: 300,
            color: 'var(--text-3)',
            marginTop: '8px',
            textTransform: 'uppercase',
            letterSpacing: '4px',
          }}
        >
          Frazier Family
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
          fontFamily: 'var(--font-outfit)',
          color: 'var(--text-3)',
          marginTop: '12px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        Who&apos;s using?
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
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-colors duration-150 ${className ?? ''}`}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${member.color}`,
        borderRadius: '10px',
        padding: fullWidth ? '16px 20px' : '16px 12px',
        display: 'flex',
        flexDirection: fullWidth ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: fullWidth ? 'flex-start' : 'center',
        gap: fullWidth ? '14px' : '0',
      }}
    >
      <div
        style={{
          width: fullWidth ? '48px' : '44px',
          height: fullWidth ? '48px' : '44px',
          borderRadius: '50%',
          background: member.colorDim,
          border: `1px solid ${member.colorBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          flexShrink: 0,
          marginBottom: fullWidth ? 0 : '10px',
        }}
      >
        {member.emoji}
      </div>
      <div style={{ textAlign: fullWidth ? 'left' : 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: 500, fontFamily: 'var(--font-outfit)', color: 'var(--text-1)' }}>
          {member.name}
        </div>
        <div
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-outfit)',
            color: member.isAdmin ? member.color : 'var(--text-3)',
            marginTop: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            fontWeight: member.isAdmin ? 600 : 400,
          }}
        >
          {member.isAdmin ? 'Admin' : 'Family'}
        </div>
      </div>
    </div>
  )
}
