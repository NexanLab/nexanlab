'use client'

import { useState } from 'react'
import Link from 'next/link'

const languages = ['JavaScript', 'Python', 'TypeScript', 'React', 'Java', 'C++', 'Go', 'Rust', 'PHP', 'SQL']
const focusAreas = ['All', 'Bugs Only', 'Security Only', 'Performance Only', 'Readability Only']

function Section({ label, content, color = '#7c3aed' }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isEmpty = !content || content.toLowerCase().includes('no ') || content.toLowerCase().includes('looks good') || content.toLowerCase().includes('clean')

  return (
    <div style={{
      background: '#0a0a0f',
      border: `1px solid ${isEmpty ? '#2a2a3a' : color + '40'}`,
      borderRadius: '12px', padding: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{
          fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px',
          color: isEmpty ? '#8b8ba0' : color,
          padding: '3px 10px', borderRadius: '999px',
          background: isEmpty ? 'rgba(139,139,160,0.1)' : `${color}15`,
          border: `1px solid ${isEmpty ? '#2a2a3a' : color + '30'}`,
        }}>
          {label}
        </span>
        <button onClick={copy} style={{
          padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
          cursor: 'pointer',
          background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.1)',
          border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(124,58,237,0.2)',
          color: copied ? '#34d399' : '#a78bfa',
        }}>
          {copied ? '✓' : '📋'}
        </button>
      </div>
      <p style={{ color: isEmpty ? '#8b8ba0' : '#e2e8f0', fontSize: '13px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
        {content}
      </p>
    </div>
  )
}

export default function CodeReviewer() {
  const [form, setForm] = useState({
    code: '',
    language: 'JavaScript',
    focus: 'All',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [improvedCopied, setImprovedCopied] = useState(false)

  async function review() {
    if (!form.code.trim()) {
      setError('Please paste your code.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/generate-code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  async function copyImproved() {
    if (!result?.improved) return
    await navigator.clipboard.writeText(result.improved)
    setImprovedCopied(true)
    setTimeout(() => setImprovedCopied(false), 2000)
  }

  function getScoreColor(score) {
    const num = parseInt(score)
    if (num >= 8) return '#10b981'
    if (num >= 6) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea::placeholder { color: #8b8ba0; }
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

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.1)',
            color: '#60a5fa', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>
            ✦ AI-Powered Tool
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            AI Code Reviewer
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            Get instant AI feedback on your code — bugs, security issues, performance and readability.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Form */}
          <div className="tool-form-sticky" style={{
            background: '#13131a', border: '1px solid #2a2a3a',
            borderRadius: '20px', padding: '32px',
            position: 'sticky', top: '84px',
          }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>
              💻 Your Code
            </h2>

            {/* Language */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Language
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {languages.map((l) => (
                  <button key={l} onClick={() => setForm({ ...form, language: l })} style={{
                    padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    border: form.language === l ? '1px solid #3b82f6' : '1px solid #2a2a3a',
                    background: form.language === l ? 'rgba(59,130,246,0.2)' : '#0a0a0f',
                    color: form.language === l ? '#60a5fa' : '#8b8ba0',
                  }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Focus Area
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {focusAreas.map((f) => (
                  <button key={f} onClick={() => setForm({ ...form, focus: f })} style={{
                    padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    border: form.focus === f ? '1px solid #7c3aed' : '1px solid #2a2a3a',
                    background: form.focus === f ? 'rgba(124,58,237,0.15)' : '#0a0a0f',
                    color: form.focus === f ? '#a78bfa' : '#8b8ba0',
                  }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Paste Your Code <span style={{ color: '#3b82f6' }}>*</span>
              </label>
              <textarea
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="// Paste your code here..."
                rows={16}
                style={{
                  width: '100%', padding: '14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: '#e2e8f0', fontSize: '13px',
                  outline: 'none', resize: 'vertical', lineHeight: '1.6',
                  fontFamily: 'monospace',
                }}
              />
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
              onClick={review}
              disabled={loading}
              style={{
                width: '100%', height: '52px',
                background: loading ? '#1e3a5f' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 24px rgba(59,130,246,0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? '⟳ Reviewing...' : '🔍 Review My Code'}
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
                  border: '3px solid #2a2a3a', borderTop: '3px solid #3b82f6',
                  animation: 'spin 1s linear infinite',
                }} />
                <p style={{ color: '#8b8ba0', fontSize: '14px' }}>Analyzing your code...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {result && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Score Card */}
                <div className="score-card" style={{
                  background: '#13131a', border: '1px solid #2a2a3a',
                  borderRadius: '20px', padding: '28px',
                  display: 'flex', alignItems: 'center', gap: '24px',
                }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '20px',
                    background: `${getScoreColor(result.score)}15`,
                    border: `2px solid ${getScoreColor(result.score)}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: '24px', fontWeight: '900', color: getScoreColor(result.score) }}>
                      {result.score}
                    </span>
                  </div>
                  <div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                      Code Quality Score
                    </div>
                    <p style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.6' }}>
                      {result.summary}
                    </p>
                  </div>
                </div>

                {/* Review Sections */}
                <div style={{
                  background: '#13131a', border: '1px solid #2a2a3a',
                  borderRadius: '20px', padding: '28px',
                  display: 'flex', flexDirection: 'column', gap: '12px',
                }}>
                  <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                    📋 Review Details
                  </h2>
                  {result.bugs && <Section label="🐛 Bugs" content={result.bugs} color="#ef4444" />}
                  {result.security && <Section label="🔒 Security" content={result.security} color="#f59e0b" />}
                  {result.performance && <Section label="⚡ Performance" content={result.performance} color="#3b82f6" />}
                  {result.readability && <Section label="📖 Readability" content={result.readability} color="#10b981" />}
                </div>

                {/* Improved Code */}
                {result.improved && (
                  <div style={{
                    background: '#13131a', border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: '20px', padding: '28px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>
                        ✨ Improved Code
                      </h2>
                      <button onClick={copyImproved} style={{
                        padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                        cursor: 'pointer',
                        background: improvedCopied ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
                        border: improvedCopied ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(16,185,129,0.3)',
                        color: '#34d399',
                      }}>
                        {improvedCopied ? '✓ Copied!' : '📋 Copy Code'}
                      </button>
                    </div>
                    <pre style={{
                      background: '#0a0a0f', borderRadius: '10px', padding: '16px',
                      color: '#e2e8f0', fontSize: '13px', lineHeight: '1.6',
                      overflowX: 'auto', border: '1px solid #2a2a3a',
                      fontFamily: 'monospace', whiteSpace: 'pre-wrap',
                    }}>
                      {result.improved}
                    </pre>
                  </div>
                )}
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
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
                }}>
                  💻
                </div>
                <p style={{ color: '#8b8ba0', fontSize: '15px' }}>
                  Paste your code and click<br />
                  <span style={{ color: '#60a5fa', fontWeight: '600' }}>Review My Code</span> to get started.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {['Bug detection', 'Security analysis', 'Improved code version'].map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#3b82f6', fontSize: '14px' }}>✓</span>
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