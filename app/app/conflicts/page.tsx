'use client'

import { useTideCloak } from '@tidecloak/nextjs'
import { useState, useCallback } from 'react'
import Link from 'next/link'

const COLORS = {
  primary: '#4338CA',
  accent: '#14B8A6',
  nearBlack: '#111827',
  offWhite: '#F8FAFC',
  muted: '#64748B',
  cardBg: '#FFFFFF',
  border: '#E2E8F0',
}

export default function ConflictsPage() {
  const { doEncrypt, doDecrypt, getValueFromIdToken } = useTideCloak()
  const [authors, setAuthors] = useState('')
  const [institutions, setInstitutions] = useState('')
  const [reason, setReason] = useState('')
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Must use "message" — only tag with selfencrypt/selfdecrypt roles configured
  const TAG = 'message'

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(''); setResult('')

    const declaration = JSON.stringify({
      conflictedAuthors: authors.split(',').map(a => a.trim()).filter(Boolean),
      conflictedInstitutions: institutions.split(',').map(i => i.trim()).filter(Boolean),
      reason: reason.trim(),
      declaredAt: new Date().toISOString(),
    })

    try {
      const [ct] = await doEncrypt([{ data: declaration, tags: [TAG] }])
      const vuid = getValueFromIdToken('vuid') || 'anon'
      localStorage.setItem(`tidepeer-conflicts:${vuid}`, ct)

      const [pt] = await doDecrypt([{ encrypted: ct, tags: [TAG] }])
      const parsed = JSON.parse(String(pt))
      setResult(`Declaration sealed. Conflicted: ${parsed.conflictedAuthors.join(', ') || 'N/A'}. Reason recorded. Only you can read this.`)
    } catch (err: any) {
      setError(err.message || 'Failed to seal declaration')
    } finally {
      setBusy(false)
    }
  }, [authors, institutions, reason, doEncrypt, doDecrypt, getValueFromIdToken])

  return (
    <div style={{ minHeight: '100vh', background: COLORS.offWhite, padding: '32px 24px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <Link href="/home" style={{ color: COLORS.muted, fontSize: '14px', textDecoration: 'none' }}>← Back to dashboard</Link>
        
        <div style={{ marginTop: '16px', marginBottom: '24px' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: COLORS.nearBlack }}>Declare Conflicts</div>
          <div style={{ color: COLORS.muted, marginTop: '6px' }}>Your conflicts are encrypted. No editor can trace this back to you.</div>
        </div>

        <form onSubmit={handleSubmit} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.nearBlack, marginBottom: '6px' }}>Conflicted Authors</label>
            <input 
              type="text" 
              value={authors} 
              onChange={e => setAuthors(e.target.value)}
              placeholder="Dr. Elena Voss, Prof. Marcus Hale"
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${COLORS.border}`, fontSize: '15px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.nearBlack, marginBottom: '6px' }}>Conflicted Institutions</label>
            <input 
              type="text" 
              value={institutions} 
              onChange={e => setInstitutions(e.target.value)}
              placeholder="Stanford Quantum Lab, MIT Cryptography Group"
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${COLORS.border}`, fontSize: '15px' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.nearBlack, marginBottom: '6px' }}>Reason for Conflict</label>
            <textarea 
              value={reason} 
              onChange={e => setReason(e.target.value)}
              placeholder="Co-authored papers in the last 3 years / Current collaboration / Personal relationship"
              style={{ width: '100%', minHeight: '80px', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit' }}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={busy || !reason.trim()}
            style={{ 
              width: '100%', padding: '14px', fontSize: '15px', fontWeight: 600,
              background: COLORS.primary, color: 'white', border: 'none', borderRadius: '10px',
              cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? 'Encrypting declaration...' : 'Submit Encrypted Conflict Declaration'}
          </button>

          {result && (
            <div style={{ marginTop: '16px', padding: '14px', background: '#ECFDF5', borderRadius: '10px', color: '#0F766E', fontSize: '14px' }}>
              ✓ {result}
            </div>
          )}
          {error && (
            <div style={{ marginTop: '16px', padding: '14px', background: '#FEF2F2', borderRadius: '10px', color: '#DC2626', fontSize: '14px' }}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
