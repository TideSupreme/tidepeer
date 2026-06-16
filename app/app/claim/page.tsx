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

export default function ClaimPage() {
  const { doEncrypt, doDecrypt, getValueFromIdToken } = useTideCloak()
  const [domain, setDomain] = useState('')
  const [keywords, setKeywords] = useState('')
  const [papers, setPapers] = useState('')
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Must use "message" — only tag with selfencrypt/selfdecrypt roles configured
  const TAG = 'message'

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(''); setResult('')
    
    const claim = JSON.stringify({
      domain: domain.trim(),
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      recentPapers: papers.split('\n').map(p => p.trim()).filter(Boolean),
      timestamp: new Date().toISOString(),
    })

    try {
      const [ct] = await doEncrypt([{ data: claim, tags: [TAG] }])
      const vuid = getValueFromIdToken('vuid') || 'anon'
      localStorage.setItem(`tidepeer-claim:${vuid}`, ct)
      
      const [pt] = await doDecrypt([{ encrypted: ct, tags: [TAG] }])
      const parsed = JSON.parse(String(pt))
      
      setResult(`Claim sealed. Domain: ${parsed.domain}. Keywords: ${parsed.keywords.join(', ')}. Only you can decrypt this.`)
    } catch (err: any) {
      setError(err.message || 'Encryption failed')
    } finally {
      setBusy(false)
    }
  }, [domain, keywords, papers, doEncrypt, doDecrypt, getValueFromIdToken])

  return (
    <div style={{ minHeight: '100vh', background: COLORS.offWhite, padding: '32px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link href="/home" style={{ color: COLORS.muted, fontSize: '14px', textDecoration: 'none' }}>← Back to dashboard</Link>
        
        <div style={{ marginTop: '16px', marginBottom: '24px' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: COLORS.nearBlack }}>Claim Your Expertise</div>
          <div style={{ color: COLORS.muted, marginTop: '6px' }}>This information is encrypted with Tide. Only you can ever decrypt it.</div>
        </div>

        <form onSubmit={handleSubmit} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.nearBlack, marginBottom: '6px' }}>Primary Research Domain</label>
            <input 
              type="text" 
              value={domain} 
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g., Post-quantum cryptography"
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${COLORS.border}`, fontSize: '15px' }}
              required 
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.nearBlack, marginBottom: '6px' }}>Keywords (comma-separated)</label>
            <input 
              type="text" 
              value={keywords} 
              onChange={e => setKeywords(e.target.value)}
              placeholder="zero-knowledge, lattice-based crypto, side-channel attacks"
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${COLORS.border}`, fontSize: '15px' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.nearBlack, marginBottom: '6px' }}>Recent Papers (one per line)</label>
            <textarea 
              value={papers} 
              onChange={e => setPapers(e.target.value)}
              placeholder="Paper title or DOI"
              style={{ width: '100%', minHeight: '90px', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={busy || !domain.trim()}
            style={{ 
              width: '100%', padding: '14px', fontSize: '15px', fontWeight: 600,
              background: COLORS.primary, color: 'white', border: 'none', borderRadius: '10px',
              cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? 'Sealing claim with Tide...' : 'Submit Encrypted Expertise Claim'}
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

        <div style={{ marginTop: '20px', fontSize: '12px', color: COLORS.muted, textAlign: 'center' }}>
          Your claim is bound to your Tide identity. The journal sees only an opaque ciphertext.
        </div>
      </div>
    </div>
  )
}
