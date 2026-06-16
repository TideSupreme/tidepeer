'use client'

import { useTideCloak } from '@tidecloak/nextjs'
import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import tcConfig from "../../tidecloak.json"

// TidePeer Design System
const COLORS = {
  primary: '#4338CA',
  accent: '#14B8A6',
  nearBlack: '#111827',
  offWhite: '#F8FAFC',
  muted: '#64748B',
  cardBg: '#FFFFFF',
  border: '#E2E8F0',
}

export default function HomePage() {
  const { logout, getValueFromIdToken, hasRealmRole, token, doEncrypt, doDecrypt } = useTideCloak()

  const [username, setUsername] = useState("")
  const [hasDefaultRole, setHasDefaultRole] = useState(false)

  // Encrypted expertise profile (core Tide flow)
  // Must use "message" tag — the only one granted selfencrypt/selfdecrypt roles in realm.json
  const TAG = "message"
  const [expertise, setExpertise] = useState("")
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState("")
  const [cryptoErr, setCryptoErr] = useState("")

  const storageKey = () => `tidepeer-profile:${getValueFromIdToken("vuid")}`

  useEffect(() => {
    if (token) {
      const name = getValueFromIdToken("preferred_username")
      const defaultRole = hasRealmRole(`default-roles-${tcConfig["realm"]}`)
      setUsername(name || "Reviewer")

      const stored = typeof window !== "undefined" ? localStorage.getItem(storageKey()) : null
      if (stored) {
        doDecrypt([{ encrypted: stored, tags: [TAG] }])
          .then((res) => setExpertise(String(res[0])))
          .catch(() => {})
      }
    }
  }, [token])

  const onLogout = useCallback(() => {
    logout()
  }, [logout])

  const onSaveProfile = useCallback(async () => {
    setBusy(true); setCryptoErr(""); setStatus("")
    try {
      const [ct] = await doEncrypt([{ data: expertise, tags: [TAG] }])
      if (typeof window !== "undefined") localStorage.setItem(storageKey(), ct)
      const [pt] = await doDecrypt([{ encrypted: ct, tags: [TAG] }])
      setExpertise(String(pt))
      setStatus("Expertise profile sealed — only you can read it.")
    } catch (err: any) {
      setCryptoErr(err.message || "Failed to seal profile")
    } finally {
      setBusy(false)
    }
  }, [expertise, doEncrypt, doDecrypt])

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1100px', width: '100%', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', 
              background: COLORS.primary, borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '18px', fontWeight: 700 
            }}>TP</div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: COLORS.nearBlack }}>TidePeer</div>
              <div style={{ fontSize: '12px', color: COLORS.muted }}>Verifiable Anonymous Peer Review</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.nearBlack }}>{username}</div>
              <div style={{ fontSize: '12px', color: COLORS.muted }}>Authenticated via Tide</div>
            </div>
            <button onClick={onLogout} style={{ ...buttonStyle, padding: '8px 16px', fontSize: '13px' }}>
              Sign out
            </button>
          </div>
        </div>

        {/* Value banner */}
        <div style={{ 
          background: 'linear-gradient(135deg, #4338CA 0%, #3730A3 100%)',
          borderRadius: '16px',
          padding: '24px 32px',
          color: 'white',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>Your identity stays hidden. Your fairness is provable.</div>
            <div style={{ fontSize: '14px', opacity: 0.85, marginTop: '4px' }}>Every claim you make is encrypted so the journal can never read it — yet the assignment process can still verify it.</div>
          </div>
          <div style={{ fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '999px' }}>
            TideCloak • DPoP-bound
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.muted, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Start here</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <Link href="/claim" style={{ textDecoration: 'none' }}>
              <div style={featureCard}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📜</div>
                <div style={{ fontWeight: 600, color: COLORS.nearBlack, marginBottom: '4px' }}>Claim Expertise</div>
                <div style={{ fontSize: '13px', color: COLORS.muted }}>Submit encrypted proof of domain knowledge</div>
              </div>
            </Link>
            <Link href="/conflicts" style={{ textDecoration: 'none' }}>
              <div style={featureCard}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
                <div style={{ fontWeight: 600, color: COLORS.nearBlack, marginBottom: '4px' }}>Declare Conflicts</div>
                <div style={{ fontSize: '13px', color: COLORS.muted }}>Register conflicts anonymously — journal never sees names</div>
              </div>
            </Link>
            <Link href="/assignments" style={{ textDecoration: 'none' }}>
              <div style={featureCard}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
                <div style={{ fontWeight: 600, color: COLORS.nearBlack, marginBottom: '4px' }}>My Assignments</div>
                <div style={{ fontSize: '13px', color: COLORS.muted }}>View papers assigned under cryptographic policy</div>
              </div>
            </Link>
            <Link href="/audit" style={{ textDecoration: 'none' }}>
              <div style={featureCard}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
                <div style={{ fontWeight: 600, color: COLORS.nearBlack, marginBottom: '4px' }}>Public Audit Trail</div>
                <div style={{ fontSize: '13px', color: COLORS.muted }}>Anyone can verify assignment fairness</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Encrypted profile (Tide primitive demo) */}
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ fontWeight: 600, color: COLORS.nearBlack }}>Your Encrypted Expertise Profile</div>
            <div style={{ fontSize: '11px', background: '#ECFDF5', color: '#0F766E', padding: '2px 8px', borderRadius: '999px' }}>Tide sealed</div>
          </div>
          <p style={{ fontSize: '13px', color: COLORS.muted, marginBottom: '12px' }}>
            This data is encrypted with your Tide identity. The journal server cannot read it — ever. Only you can decrypt it.
          </p>
          
          <textarea
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            placeholder="e.g., Quantum cryptography, post-quantum signatures, zero-knowledge protocols..."
            style={{ 
              width: '100%', minHeight: '90px', padding: '12px', 
              borderRadius: '10px', border: `1px solid ${COLORS.border}`,
              fontSize: '14px', fontFamily: 'inherit', resize: 'vertical',
            }}
          />
          
          <button 
            onClick={onSaveProfile} 
            style={{ ...buttonStyle, marginTop: '12px', padding: '10px 20px', fontSize: '14px' }} 
            disabled={busy || !expertise.trim()}
          >
            {busy ? 'Sealing with Tide...' : 'Seal Expertise Claim'}
          </button>
          
          {status && <div style={{ color: '#0F766E', fontSize: '13px', marginTop: '8px' }}>✓ {status}</div>}
          {cryptoErr && <div style={{ color: '#DC2626', fontSize: '13px', marginTop: '8px' }}>{cryptoErr}</div>}
        </div>
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: COLORS.offWhite,
  margin: 0,
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 18px',
  fontSize: '14px',
  fontWeight: 600,
  borderRadius: '10px',
  border: 'none',
  background: COLORS.primary,
  color: '#fff',
  cursor: 'pointer',
}

const featureCard: React.CSSProperties = {
  background: COLORS.cardBg,
  border: `1px solid ${COLORS.border}`,
  borderRadius: '14px',
  padding: '20px',
  cursor: 'pointer',
  transition: 'all 0.1s ease',
  height: '100%',
}
