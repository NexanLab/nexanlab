'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ColdEmailGenerator() {
  const [form, setForm] = useState({
    senderName: '',
    senderRole: '',
    recipientName: '',
    recipientCompany: '',
    purpose: '',
    tone: 'professional',
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function generateEmail() {
    if (!form.senderName || !form.recipientCompany || !form.purpose) {
      setError('Please fill in the required fields.')
      return
    }

    setLoading(true)
    setError('')
    setResult('')

    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResult(data.email)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function resetForm() {
    setForm({ senderName: '', senderRole: '', recipientName: '', recipientCompany: '', purpose: '', tone: 'professional' })
    setResult('')
    setError('')
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
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
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)',
            color: '#a78bfa', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>
            ✦ AI-Powered Tool
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            AI Cold Email Generator
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '18px', maxWidth: '500px', margin: '0 auto' }}>
            Generate personalized, high-converting cold emails in seconds using AI.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Form */}
          <div style={{
            background: '#13131a', border: '1px solid #2a2a3a',
            borderRadius: '20px', padding: '32px',
          }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>
              📝 Email Details
            </h2>

            {/* Sender Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Your Name <span style={{ color: '#7c3aed' }}>*</span>
              </label>
              <input
                type="text"
                value={form.senderName}
                onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                placeholder="John Doe"
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            {/* Sender Role */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Your Role / Company
              </label>
              <input
                type="text"
                value={form.senderRole}
                onChange={(e) => setForm({ ...form, senderRole: e.target.value })}
                placeholder="CEO at Acme Inc."
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            {/* Recipient Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Recipient Name
              </label>
              <input
                type="text"
                value={form.recipientName}
                onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                placeholder="Jane Smith"
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            {/* Recipient Company */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Recipient's Company <span style={{ color: '#7c3aed' }}>*</span>
              </label>
              <input
                type="text"
                value={form.recipientCompany}
                onChange={(e) => setForm({ ...form, recipientCompany: e.target.value })}
                placeholder="Google, Microsoft..."
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            {/* Purpose */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Email Purpose <span style={{ color: '#7c3aed' }}>*</span>
              </label>
              <textarea
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                placeholder="e.g. I want to offer my web development services and get a meeting..."
                rows={3}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px',
                  outline: 'none', resize: 'vertical', lineHeight: '1.5',
                }}
              />
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
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="confident">Confident</option>
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
              onClick={generateEmail}
              disabled={loading}
              style={{
                width: '100%', height: '48px',
                background: loading ? '#4c1d95' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 24px rgba(124,58,237,0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? '✦ Generating...' : '✦ Generate Email'}
            </button>
          </div>

          {/* Result */}
          <div style={{
            background: '#13131a', border: '1px solid #2a2a3a',
            borderRadius: '20px', padding: '32px',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>
                ✉️ Generated Email
              </h2>
              {result && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)',
                      border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(124,58,237,0.3)',
                      color: copied ? '#34d399' : '#a78bfa',
                    }}
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                  <button
                    onClick={resetForm}
                    style={{
                      padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                      cursor: 'pointer', background: 'transparent',
                      border: '1px solid #2a2a3a', color: '#8b8ba0',
                    }}
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  border: '3px solid #2a2a3a', borderTop: '3px solid #7c3aed',
                  animation: 'spin 1s linear infinite',
                }} />
                <p style={{ color: '#8b8ba0', fontSize: '14px' }}>AI is writing your email...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : result ? (
              <div style={{
                flex: 1, background: '#0a0a0f', borderRadius: '12px',
                padding: '20px', border: '1px solid #2a2a3a',
                overflowY: 'auto',
              }}>
                <pre style={{
                  color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7',
                  whiteSpace: 'pre-wrap', fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}>
                  {result}
                </pre>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '20px',
                  background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
                }}>
                  ✉️
                </div>
                <p style={{ color: '#8b8ba0', fontSize: '15px', textAlign: 'center' }}>
                  Fill in the details and click<br />
                  <span style={{ color: '#a78bfa', fontWeight: '600' }}>Generate Email</span> to get started.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {['Personalized opening', 'Clear value proposition', 'Strong call to action'].map((feature) => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#7c3aed', fontSize: '14px' }}>✓</span>
                      <span style={{ color: '#8b8ba0', fontSize: '13px' }}>{feature}</span>
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