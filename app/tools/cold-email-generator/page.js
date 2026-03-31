'use client'

import { useState } from 'react'
import ToolSeoSection from '@/app/components/ToolSeoSection'
import RateLimitError from '@/app/components/RateLimitError'
import { useScrollToResult } from '@/hooks/useScrollToResult'
import { useFormPersist } from '@/hooks/useFormPersist'

const GOALS = ['Book a meeting', 'Get a reply', 'Schedule a demo', 'Start a conversation', 'Generate a referral']
const LENGTHS = ['Short (50-80 words)', 'Medium (100-150 words)', 'Long (180-220 words)']
const TONES = ['Professional', 'Friendly', 'Confident', 'Casual', 'Formal']
const INDUSTRIES = ['Technology', 'Manufacturing', 'Finance', 'Healthcare', 'Retail', 'Energy', 'Real Estate', 'Education', 'Other']

function EmailCard({ label, subject, body, color, badge }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <div style={{
      background: '#0a0a0f', border: `1px solid ${color}30`,
      borderRadius: '16px', padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px',
            color, padding: '3px 10px', borderRadius: '999px',
            background: `${color}15`, border: `1px solid ${color}30`,
          }}>{label}</span>
          {badge && (
            <span style={{
              fontSize: '10px', fontWeight: '600', color: '#8b8ba0',
              padding: '2px 8px', borderRadius: '999px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a3a',
            }}>{badge}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <a href={mailtoLink} title="Open in email client" style={{
            padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
            cursor: 'pointer', textDecoration: 'none',
            background: `${color}10`, border: `1px solid ${color}20`, color,
          }}>✉ Open</a>
          <button onClick={copy} style={{
            padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
            cursor: 'pointer',
            background: copied ? 'rgba(16,185,129,0.15)' : `${color}10`,
            border: copied ? '1px solid rgba(16,185,129,0.3)' : `1px solid ${color}20`,
            color: copied ? '#34d399' : color,
          }}>{copied ? '✓' : '📋'}</button>
        </div>
      </div>

      <div style={{
        padding: '8px 12px', borderRadius: '8px',
        background: `${color}08`, border: `1px solid ${color}20`, marginBottom: '12px',
      }}>
        <span style={{ color: '#8b8ba0', fontSize: '11px', fontWeight: '600' }}>SUBJECT: </span>
        <span style={{ color: 'white', fontSize: '13px' }}>{subject}</span>
      </div>

      <pre style={{
        color: '#e2e8f0', fontSize: '13px', lineHeight: '1.7',
        whiteSpace: 'pre-wrap', fontFamily: "'Segoe UI', system-ui, sans-serif", margin: 0,
      }}>{body}</pre>
    </div>
  )
}

function Label({ children, required }) {
  return (
    <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
      {children} {required && <span style={{ color: '#7c3aed' }}>*</span>}
    </label>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        width: '100%', height: '44px', padding: '0 14px',
        background: '#0a0a0f', border: '1px solid #2a2a3a',
        borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
      }}
    />
  )
}

function ChipGroup({ options, value, onChange, color = '#7c3aed' }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} style={{
          padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
          cursor: 'pointer', transition: 'all 0.2s ease',
          border: value === opt ? `1px solid ${color}` : '1px solid #2a2a3a',
          background: value === opt ? `${color}20` : '#0a0a0f',
          color: value === opt ? color : '#8b8ba0',
        }}>{opt}</button>
      ))}
    </div>
  )
}

export default function ColdEmailGenerator() {
  const { form, setForm, resetForm } = useFormPersist('nexanlab-cold-email-v2', {
    // Sender
    senderName: '',
    senderRole: '',
    // Recipient
    recipientName: '',
    recipientCompany: '',
    recipientRole: '',
    industry: 'Technology',
    // Email context
    product: '',
    pain: '',
    socialProof: '',
    goal: 'Book a meeting',
    tone: 'Professional',
    length: 'Medium (100-150 words)',
  })

  const [variations, setVariations] = useState(null)
  const [followups, setFollowups] = useState(null)
  const [activeTab, setActiveTab] = useState('variations')
  const [loading, setLoading] = useState(false)
  const [followupLoading, setFollowupLoading] = useState(false)
  const [error, setError] = useState('')
  const [retryAfter, setRetryAfter] = useState(0)

  const { resultRef, scrollToResult } = useScrollToResult()

  async function generate() {
    if (!form.senderName || !form.recipientCompany || !form.product || !form.pain) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError('')
    setVariations(null)
    setFollowups(null)

    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, mode: 'variations' }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        if (data.retryAfter) setRetryAfter(data.retryAfter)
      } else {
        setVariations(data.variations)
        setActiveTab('variations')
        setTimeout(() => scrollToResult(), 100)
      }
    } catch { setError('Something went wrong. Please try again.') }
    setLoading(false)
  }

  async function generateFollowups() {
    if (!variations) return
    setFollowupLoading(true)
    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, mode: 'followup' }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        if (data.retryAfter) setRetryAfter(data.retryAfter)
      } else {
        setFollowups(data.followups)
        setActiveTab('followups')
      }
    } catch { setError('Something went wrong.') }
    setFollowupLoading(false)
  }

  function handleReset() {
    resetForm()
    setVariations(null)
    setFollowups(null)
    setError('')
    setRetryAfter(0)
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: '#0a0a0f', border: '1px solid #2a2a3a',
    borderRadius: '10px', color: 'white', fontSize: '14px',
    outline: 'none', resize: 'vertical', lineHeight: '1.5',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #8b8ba0; }
        select option { background: #13131a; color: white; }
        textarea { scrollbar-width: thin; scrollbar-color: #2a2a3a #0a0a0f; }
        textarea::-webkit-scrollbar { width: 6px; }
        textarea::-webkit-scrollbar-track { background: #0a0a0f; border-radius: 999px; }
        textarea::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 999px; }
        @media (max-width: 768px) {
          .tool-page-grid { grid-template-columns: 1fr !important; }
          .tool-form-sticky { position: static !important; }
        }
      `}</style>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)',
            color: '#a78bfa', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>✦ AI-Powered Tool</div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            AI Cold Email Generator
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '17px', maxWidth: '520px', margin: '0 auto' }}>
            Generate 3 high-converting email variations + follow-up sequences in seconds.
          </p>
        </div>

        <div className="tool-page-grid" style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '24px', alignItems: 'start' }}>

          {/* ── FORM ── */}
          <div className="tool-form-sticky" style={{
            background: '#13131a', border: '1px solid #2a2a3a',
            borderRadius: '20px', padding: '28px',
            position: 'sticky', top: '84px', alignSelf: 'start',
          }}>

            {/* Section: Sender */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '3px', height: '16px', borderRadius: '999px', background: '#7c3aed' }} />
                <span style={{ color: '#a78bfa', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  About You
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <Label required>Your Name</Label>
                  <Input value={form.senderName} onChange={e => setForm({ ...form, senderName: e.target.value })} placeholder="John Doe" />
                </div>
                <div>
                  <Label>Your Role</Label>
                  <Input value={form.senderRole} onChange={e => setForm({ ...form, senderRole: e.target.value })} placeholder="CEO / Sales Manager" />
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: '#2a2a3a', marginBottom: '20px' }} />

            {/* Section: Recipient */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '3px', height: '16px', borderRadius: '999px', background: '#f59e0b' }} />
                <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Recipient
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <Label>First Name</Label>
                  <Input value={form.recipientName} onChange={e => setForm({ ...form, recipientName: e.target.value })} placeholder="Jane" />
                </div>
                <div>
                  <Label required>Company</Label>
                  <Input value={form.recipientCompany} onChange={e => setForm({ ...form, recipientCompany: e.target.value })} placeholder="Acme Inc." />
                </div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Label>Their Role / Title</Label>
                <Input value={form.recipientRole} onChange={e => setForm({ ...form, recipientRole: e.target.value })} placeholder="Operations Manager, CTO, Procurement..." />
              </div>
              <div>
                <Label>Industry</Label>
                <ChipGroup options={INDUSTRIES} value={form.industry} onChange={v => setForm({ ...form, industry: v })} color="#f59e0b" />
              </div>
            </div>

            <div style={{ height: '1px', background: '#2a2a3a', marginBottom: '20px' }} />

            {/* Section: Email Context */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '3px', height: '16px', borderRadius: '999px', background: '#10b981' }} />
                <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Email Context
                </span>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <Label required>What you offer (product/service)</Label>
                <textarea
                  value={form.product}
                  onChange={e => setForm({ ...form, product: e.target.value })}
                  placeholder="e.g. Energy optimization software that reduces industrial gas consumption by 15-25%"
                  rows={2}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <Label required>Their pain point / problem</Label>
                <textarea
                  value={form.pain}
                  onChange={e => setForm({ ...form, pain: e.target.value })}
                  placeholder="e.g. High natural gas and coal costs eating into production margins"
                  rows={2}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <Label>Social proof / result (optional but powerful)</Label>
                <Input
                  value={form.socialProof}
                  onChange={e => setForm({ ...form, socialProof: e.target.value })}
                  placeholder="e.g. Helped 3 sugar factories cut energy costs by 22%"
                />
              </div>
            </div>

            <div style={{ height: '1px', background: '#2a2a3a', marginBottom: '20px' }} />

            {/* Section: Settings */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '3px', height: '16px', borderRadius: '999px', background: '#3b82f6' }} />
                <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Settings
                </span>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <Label>Goal</Label>
                <ChipGroup options={GOALS} value={form.goal} onChange={v => setForm({ ...form, goal: v })} color="#3b82f6" />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <Label>Tone</Label>
                <ChipGroup options={TONES} value={form.tone} onChange={v => setForm({ ...form, tone: v })} color="#7c3aed" />
              </div>

              <div>
                <Label>Email Length</Label>
                <ChipGroup options={LENGTHS} value={form.length} onChange={v => setForm({ ...form, length: v })} color="#ec4899" />
              </div>
            </div>

            {retryAfter > 0 && error ? (
              <RateLimitError retryAfter={retryAfter} onRetry={generate} />
            ) : error ? (
              <div style={{
                padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', fontSize: '13px',
              }}>{error}</div>
            ) : null}

            <button onClick={generate} disabled={loading} style={{
              width: '100%', height: '52px',
              background: loading ? '#4c1d95' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 24px rgba(124,58,237,0.4)',
              transition: 'all 0.2s ease',
            }}>
              {loading ? '✦ Generating...' : '✦ Generate 3 Variations'}
            </button>

            {variations && (
              <button onClick={handleReset} style={{
                width: '100%', height: '40px', marginTop: '10px',
                background: 'transparent', border: '1px solid #2a2a3a',
                borderRadius: '10px', color: '#8b8ba0', fontSize: '13px', cursor: 'pointer',
              }}>Reset</button>
            )}
          </div>

          {/* ── RESULTS ── */}
          <div ref={resultRef}>
            {loading && (
              <div style={{
                background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '60px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
              }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid #2a2a3a', borderTop: '3px solid #7c3aed', animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#8b8ba0', fontSize: '14px' }}>Writing 3 email variations...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {variations && !loading && (
              <div style={{ background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '28px' }}>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  <button onClick={() => setActiveTab('variations')} style={{
                    padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    background: activeTab === 'variations' ? '#7c3aed' : 'transparent',
                    border: activeTab === 'variations' ? '1px solid #7c3aed' : '1px solid #2a2a3a',
                    color: activeTab === 'variations' ? 'white' : '#8b8ba0',
                  }}>✉ Variations (3)</button>
                  <button
                    onClick={() => followups ? setActiveTab('followups') : generateFollowups()}
                    disabled={followupLoading}
                    style={{
                      padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
                      cursor: followupLoading ? 'not-allowed' : 'pointer',
                      background: activeTab === 'followups' ? '#f59e0b' : 'transparent',
                      border: activeTab === 'followups' ? '1px solid #f59e0b' : '1px solid #2a2a3a',
                      color: activeTab === 'followups' ? 'white' : '#8b8ba0',
                    }}>
                    {followupLoading ? '⟳ Generating...' : followups ? '🔁 Follow-ups (2)' : '+ Generate Follow-ups'}
                  </button>
                </div>

                {activeTab === 'variations' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {variations.map((v, i) => (
                      <EmailCard key={i} label={v.label} subject={v.subject} body={v.body} color={v.color} />
                    ))}
                    <button onClick={generate} style={{
                      width: '100%', height: '44px', background: 'transparent', border: '1px solid #2a2a3a',
                      borderRadius: '10px', color: '#8b8ba0', fontSize: '14px', cursor: 'pointer',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.color = 'white' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.color = '#8b8ba0' }}
                    >🔄 Regenerate</button>
                  </div>
                )}

                {activeTab === 'followups' && followups && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {followups.map((f, i) => (
                      <EmailCard key={i} label={`Follow-up ${i + 1}`} subject={f.subject} body={f.body} color="#f59e0b" badge={f.day} />
                    ))}
                    <button onClick={generateFollowups} style={{
                      width: '100%', height: '44px', background: 'transparent', border: '1px solid #2a2a3a',
                      borderRadius: '10px', color: '#8b8ba0', fontSize: '14px', cursor: 'pointer',
                    }}>🔄 Regenerate Follow-ups</button>
                  </div>
                )}
              </div>
            )}

            {!variations && !loading && (
              <div style={{
                background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '60px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center',
              }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '20px',
                  background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
                }}>✉️</div>
                <p style={{ color: '#8b8ba0', fontSize: '15px' }}>
                  Fill in the details and click<br />
                  <span style={{ color: '#a78bfa', fontWeight: '600' }}>Generate 3 Variations</span> to get started.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {[
                    'Problem, Value & Curiosity angles',
                    'Optimized for your goal & tone',
                    'Follow-up sequence included',
                  ].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#7c3aed', fontSize: '14px' }}>✓</span>
                      <span style={{ color: '#8b8ba0', fontSize: '13px' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <ToolSeoSection tool="cold-email" />
    </div>
  )
}