'use client'

import { useCallback, type CSSProperties } from 'react'
import { useTideCloak } from '@tidecloak/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// TidePeer Design System
const COLORS = {
  primary: '#4338CA',      // Deep indigo
  accent: '#14B8A6',       // Teal
  nearBlack: '#111827',
  offWhite: '#F8FAFC',
  muted: '#64748B',
  cardBg: '#FFFFFF',
  border: '#E2E8F0',
}

const containerStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: COLORS.offWhite,
  margin: 0,
  padding: '24px',
}

const cardStyle: CSSProperties = {
  background: COLORS.cardBg,
  padding: '48px 40px',
  borderRadius: '16px',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
  textAlign: 'center',
  maxWidth: '480px',
  width: '100%',
  border: `1px solid ${COLORS.border}`,
}

const logoStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '32px',
}

const buttonStyle: CSSProperties = {
  marginTop: '8px',
  padding: '14px 32px',
  fontSize: '15px',
  fontWeight: 600,
  borderRadius: '10px',
  border: 'none',
  background: COLORS.primary,
  color: '#fff',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  width: '100%',
}

export default function LoginPage() {
  const { login, authenticated } = useTideCloak()
  const router = useRouter()

  const onLogin = useCallback(() => {
    login()
  }, [login])

  useEffect(() => {
    if (authenticated) {
      router.push('/home')
    }
  }, [authenticated])

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>
          <div style={{ 
            width: '48px', height: '48px', 
            background: COLORS.primary, 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 700,
          }}>
            TP
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: COLORS.nearBlack, letterSpacing: '-0.02em' }}>TidePeer</div>
            <div style={{ fontSize: '13px', color: COLORS.muted, marginTop: '-2px' }}>Verifiable • Anonymous • Fair</div>
          </div>
        </div>

        <h1 style={{ 
          margin: 0, 
          fontSize: '32px', 
          lineHeight: '1.2',
          color: COLORS.nearBlack,
          fontWeight: 700,
          letterSpacing: '-0.025em',
        }}>
          Peer review that<br />proves its own fairness
        </h1>
        
        <p style={{ 
          color: COLORS.muted, 
          marginTop: '16px',
          fontSize: '15px',
          lineHeight: '1.55',
        }}>
          Reviewers prove expertise and zero conflicts without revealing their identity.
          Assignments are generated so no editor can rig or later unmask them.
        </p>

        <button 
          onClick={onLogin} 
          style={buttonStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#3730A3' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.primary }}
        >
          Continue with Tide
        </button>

        <div style={{ marginTop: '24px', fontSize: '12px', color: COLORS.muted }}>
          Powered by TideCloak • End-to-end cryptographic proof
        </div>
      </div>
    </div>
  )
}
