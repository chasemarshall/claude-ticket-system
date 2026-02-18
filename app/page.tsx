'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { FAMILY_MEMBERS } from '@/lib/constants'

export default function LoginPage() {
  const { user, loading, setUser } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/home')
    }
  }, [user, loading, router])

  const handleSelect = (name: string) => {
    setUser(name)
    router.push('/home')
  }

  if (loading) return null

  const [chase, ...rest] = FAMILY_MEMBERS
  const pairs = []
  for (let i = 0; i < rest.length; i += 2) {
    pairs.push(rest.slice(i, i + 2))
  }

  return (
    <div
      className="flex flex-col items-center justify-center p-6 animate-fadeIn"
      style={{
        minHeight: '100dvh',
        background: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,168,83,0.09) 0%, transparent 60%), var(--bg)`,
        paddingTop: 'calc(24px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Logo */}
      <div className="text-center mb-10">
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            margin: '0 auto 20px',
            boxShadow: '0 0 40px rgba(212,168,83,0.12)',
          }}
        >
          🏠
        </div>
        <h1
          className="font-display"
          style={{ fontSize: '48px', fontWeight: 300, color: 'var(--text-1)', lineHeight: 1, letterSpacing: '-0.5px' }}
        >
          Home Base
        </h1>
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-3)',
            marginTop: '8px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Frazier Family
        </p>
      </div>

      {/* Family grid */}
      <div className="w-full" style={{ maxWidth: '340px' }}>
        {/* Chase - full width (admin) */}
        <MemberCard member={chase} onClick={() => handleSelect(chase.name)} className="family-card mb-3" fullWidth />

        {/* Rest in 2-column pairs */}
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

      <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
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
      className={`cursor-pointer transition-all duration-200 active:scale-95 animate-slideUp opacity-0 ${className ?? ''}`}
      style={{
        background: 'var(--card)',
        border: `1px solid var(--border)`,
        borderRadius: '16px',
        padding: fullWidth ? '18px 20px' : '18px 12px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: fullWidth ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: fullWidth ? 'flex-start' : 'center',
        gap: fullWidth ? '16px' : '0',
        animationFillMode: 'forwards',
      }}
    >
      {/* Subtle hover glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: member.color,
          opacity: 0,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
        }}
      />

      {/* Avatar */}
      <div
        style={{
          width: fullWidth ? '52px' : '48px',
          height: fullWidth ? '52px' : '48px',
          borderRadius: '50%',
          background: member.colorDim,
          border: `1.5px solid ${member.colorBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          flexShrink: 0,
          marginBottom: fullWidth ? 0 : '10px',
        }}
      >
        {member.emoji}
      </div>

      {/* Name + role */}
      <div style={{ textAlign: fullWidth ? 'left' : 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-1)' }}>{member.name}</div>
        <div
          style={{
            fontSize: '10px',
            color: member.isAdmin ? member.color : 'var(--text-3)',
            marginTop: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            fontWeight: member.isAdmin ? 600 : 400,
          }}
        >
          {member.isAdmin ? '✦ Admin' : 'Family'}
        </div>
      </div>
    </div>
  )
}
