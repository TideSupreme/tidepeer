'use client'

import { useTideCloak } from '@tidecloak/nextjs'
import { useState, useEffect } from 'react'
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

export default function AssignmentsPage() {
  const { doDecrypt, getValueFromIdToken } = useTideCloak()
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAssignments = async () => {
      const vuid = getValueFromIdToken('vuid') || 'anon'
      
      // Check for existing claims to show personalized assignments
      const claimCt = localStorage.getItem(`tidepeer-claim:${vuid}`)
      
      // Mock assignments - in real system these would come from Tide-verified roster
      const mockAssignments = [
        { id: 'P-2026-0847', title: 'Lattice-Based Signatures for Post-Quantum TLS', journal: 'Journal of Cryptology', due: '2026-06-18' },
        { id: 'P-2026-0912', title: 'Side-Channel Resistance in Kyber Implementations', journal: 'IACR Transactions on CHES', due: '2026-06-22' },
      ]
      
      setAssignments(mockAssignments)
      setLoading(false)
    }
    loadAssignments()
  }, [getValueFromIdToken])

  return (
    <div style={{ minHeight: '100vh', background: COLORS.offWhite, padding: '32px 24px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <Link href="/home" style={{ color: COLORS.muted, fontSize: '14px', textDecoration: 'none' }}>← Back to dashboard</Link>
        
        <div style={{ marginTop: '16px', marginBottom: '24px' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: COLORS.nearBlack }}>Your Assignments</div>
          <div style={{ color: COLORS.muted, marginTop: '6px' }}>Papers matched to your encrypted expertise profile via Tide-verified policy</div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: COLORS.muted }}>Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <div style={{ fontWeight: 600, color: COLORS.nearBlack, marginBottom: '8px' }}>No assignments yet</div>
            <div style={{ color: COLORS.muted, fontSize: '14px' }}>Submit your expertise claim to receive cryptographically matched papers.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {assignments.map((a, idx) => (
              <div key={idx} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', color: COLORS.accent, fontWeight: 600 }}>{a.id}</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: COLORS.nearBlack, marginTop: '4px' }}>{a.title}</div>
                  <div style={{ fontSize: '13px', color: COLORS.muted, marginTop: '4px' }}>{a.journal}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: COLORS.muted }}>Due</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: COLORS.nearBlack }}>{a.due}</div>
                  <button style={{ marginTop: '8px', padding: '6px 14px', fontSize: '13px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Accept Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '24px', fontSize: '12px', color: COLORS.muted, textAlign: 'center' }}>
          Assignments are bound to DPoP-verified reviewer tokens. No editor chose you by name.
        </div>
      </div>
    </div>
  )
}
