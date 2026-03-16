'use client'

import { useState } from 'react'
import Link from 'next/link'

const platforms = ['Facebook/Instagram', 'Google Ads', 'Twitter/X', 'LinkedIn', 'TikTok', 'YouTube']
const goals = ['Drive Sales', 'Generate Leads', 'Increase Awareness', 'Drive Traffic', 'App Installs', 'Event Signups']
const tones = ['Persuasive', 'Friendly', 'Urgent', 'Professional', 'Playful', 'Inspirational']

function CopyCard({ label, value, color = '#7c3aed', maxChars }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const charCount = value?.length || 0
  const isOver = maxChars && charCount > maxChars

  return (
    <div style={{
      background: '#0a0a0f', border: `1px solid ${color}30`,
      borderRadius: '12px', padding: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{
          fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px',
          color, padding: '3px 10px', borderRadius: '999px',
          background: `${color}15`, border: `1px solid ${color}30`,
        }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {maxChars && (
            <span style={{ fontSize: '11px', color: isOver ? '#ef4444' : '#8b8ba0' }}>
              {charCount}/{maxChars}
            </span>
          )}
          <button onClick={copy} style={{
            padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
            cursor: 'pointer', transition: 'all 0.2s ease',
            background: copied ? 'rgba(16,185,129,0.15)' : `${color}15`,
            border: copied ? '1px solid rgba(16,185,129,0.3)' : `1px solid ${color}30`,
            color: copied ? '#34d399' : color,
          }}>
            {copied ? '✓' : '📋'}
          </button>
        </div>
      </div>
      <p style={{ color: 'white', fontSize: '14px', lineHeight: '1.6' }}>{value}</p>
    </div>
  )
}

export default function AdCopyGenerator() {
  const [form, setForm] = useState({
    product: '',
    targetAudience: '',
    goal: 'Drive Sales',
    platform: 'Facebook/Instagram',
    tone: 'Persuasive',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    if (!form.product.trim()) {
      setError('Please describe your product or service.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/generate-ad-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResult(data.copy)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #8b8ba0; }
        select option { background: #13131a; color: white; }
      `}</style>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2a2a3a', padding: '0 24px',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '800', color: 'white',
            }}>N</div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
              Nexan<span style={{ color: '#7c3aed' }}>Lab</span>
            </span>
          </Link>
          <Link href="/tools" style={{ color: '#8b8ba0', fontSize: '14px', textDecoration: 'none' }}>
            ← Back to Tools
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)',
            color: '#a78bfa', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>
            ✦ AI-Powered Tool
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            AI Ad Copy Generator
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            Generate high-converting ad copy and headlines for any platform in seconds.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'start' }}>

          {/* Form */}
          <div style={{
            background: '#13131a', border: '1px solid #2a2a3a',
            borderRadius: '20px', padding: '32px',
            position: 'sticky', top: '84px',
          }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>
              📣 Campaign Details
            </h2>

            {/* Product */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Product / Service <span style={{ color: '#7c3aed' }}>*</span>
              </label>
              <textarea
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                placeholder="e.g. An AI-powered email tool that helps freelancers write cold emails faster..."
                rows={3}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px',
                  outline: 'none', resize: 'vertical', lineHeight: '1.5',
                }}
              />
            </div>

            {/* Target Audience */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Target Audience
              </label>
              <input
                type="text"
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                placeholder="e.g. Freelancers, small business owners, marketers..."
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            {/* Platform */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Platform
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {platforms.map((p) => (
                  <button key={p} onClick={() => setForm({ ...form, platform: p })} style={{
                    padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    border: form.platform === p ? '1px solid #7c3aed' : '1px solid #2a2a3a',
                    background: form.platform === p ? '#7c3aed' : '#0a0a0f',
                    color: form.platform === p ? 'white' : '#8b8ba0',
                  }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Campaign Goal
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {goals.map((g) => (
                  <button key={g} onClick={() => setForm({ ...form, goal: g })} style={{
                    padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    border: form.goal === g ? '1px solid #f59e0b' : '1px solid #2a2a3a',
                    background: form.goal === g ? 'rgba(245,158,11,0.15)' : '#0a0a0f',
                    color: form.goal === g ? '#f59e0b' : '#8b8ba0',
                  }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Tone
              </label>
              <select
                value={form.tone}
                onChange={(e) => setForm({ ...form, tone: e.target.value })}
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                }}
              >
                {tones.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', fontSize: '13px',
              }}>
                {error}
              </div>
            )}

            <button
              onClick={generate}
              disabled={loading}
              style={{
                width: '100%', height: '52px',
                background: loading ? '#4c1d95' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 24px rgba(124,58,237,0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? '✦ Generating...' : '✦ Generate Ad Copy'}
            </button>
          </div>

          {/* Results */}
          <div>
            {loading && (
              <div style={{
                background: '#13131a', border: '1px solid #2a2a3a',
                borderRadius: '20px', padding: '60px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  border: '3px solid #2a2a3a', borderTop: '3px solid #7c3aed',
                  animation: 'spin 1s linear infinite',
                }} />
                <p style={{ color: '#8b8ba0', fontSize: '14px' }}>Writing your ad copy...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {result && !loading && (
              <div style={{
                background: '#13131a', border: '1px solid #2a2a3a',
                borderRadius: '20px', padding: '32px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>
                    🎯 Your Ad Copy
                  </h2>
                  <span style={{
                    fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '999px',
                    background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                    color: '#a78bfa',
                  }}>
                    {form.platform}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result['PRIMARY HEADLINE'] && (
                    <CopyCard label="Primary Headline" value={result['PRIMARY HEADLINE']} color="#7c3aed" maxChars={40} />
                  )}
                  {result['SECONDARY HEADLINE'] && (
                    <CopyCard label="Secondary Headline" value={result['SECONDARY HEADLINE']} color="#7c3aed" maxChars={40} />
                  )}
                  {result['PRIMARY TEXT'] && (
                    <CopyCard label="Primary Text" value={result['PRIMARY TEXT']} color="#f59e0b" maxChars={125} />
                  )}
                  {result['DESCRIPTION'] && (
                    <CopyCard label="Description" value={result['DESCRIPTION']} color="#10b981" maxChars={30} />
                  )}
                  {result['CALL TO ACTION'] && (
                    <CopyCard label="Call to Action" value={result['CALL TO ACTION']} color="#ec4899" />
                  )}
                  {result['HOOK VARIATION 1'] && (
                    <CopyCard label="Hook Variation 1" value={result['HOOK VARIATION 1']} color="#3b82f6" maxChars={125} />
                  )}
                  {result['HOOK VARIATION 2'] && (
                    <CopyCard label="Hook Variation 2" value={result['HOOK VARIATION 2']} color="#3b82f6" maxChars={125} />
                  )}
                </div>

                <button
                  onClick={generate}
                  style={{
                    width: '100%', height: '44px', marginTop: '20px',
                    background: 'transparent', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: '#8b8ba0', fontSize: '14px',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.color = '#8b8ba0' }}
                >
                  🔄 Regenerate
                </button>
              </div>
            )}

            {!result && !loading && (
              <div style={{
                background: '#13131a', border: '1px solid #2a2a3a',
                borderRadius: '20px', padding: '60px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center',
              }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '20px',
                  background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
                }}>
                  📣
                </div>
                <p style={{ color: '#8b8ba0', fontSize: '15px' }}>
                  Fill in your campaign details and click<br />
                  <span style={{ color: '#a78bfa', fontWeight: '600' }}>Generate Ad Copy</span> to get started.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {['Headlines & descriptions', 'Platform-optimized copy', 'Multiple hook variations'].map((f) => (
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
    </div>
  )
}