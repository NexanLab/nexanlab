'use client'

import { useState } from 'react'
import Link from 'next/link'
import ToolSeoSection from '@/app/components/ToolSeoSection'
import { useScrollToResult } from '@/hooks/useScrollToResult'
import RateLimitError from '@/app/components/RateLimitError'

const languages = ['JavaScript', 'Python', 'TypeScript', 'PHP', 'Java', 'Go', 'Ruby', 'Rust']
const availableFlags = ['g (global)', 'i (case insensitive)', 'm (multiline)', 's (dotAll)', 'x (extended)']

export default function RegexGenerator() {
  const [form, setForm] = useState({
    description: '',
    language: 'JavaScript',
    examples: '',
    flags: [],
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [regexCopied, setRegexCopied] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [testInput, setTestInput] = useState('')
  const [testResult, setTestResult] = useState(null)
  const { resultRef, scrollToResult } = useScrollToResult()
  const [retryAfter, setRetryAfter] = useState(0)

  async function generate() {
    if (!form.description.trim()) {
      setError('Please describe what you want to match.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    setTestResult(null)

    try {
      const response = await fetch('/api/generate-regex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        if (data.retryAfter) setRetryAfter(data.retryAfter)
      } else {
        setResult(data)
        setTimeout(() => scrollToResult(), 100)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  function toggleFlag(flag) {
    const flagChar = flag.split(' ')[0]
    setForm(prev => ({
      ...prev,
      flags: prev.flags.includes(flagChar)
        ? prev.flags.filter(f => f !== flagChar)
        : [...prev.flags, flagChar],
    }))
  }

  function testRegex() {
    if (!result?.regex || !testInput) return
    try {
      const flagStr = result.flags === 'none' ? '' : (result.flags || '')
      const regex = new RegExp(result.regex, flagStr)
      const matches = testInput.match(regex)
      setTestResult({ matches, isMatch: !!matches })
    } catch {
      setTestResult({ error: 'Invalid regex pattern' })
    }
  }

  async function copyRegex() {
    const flagStr = result.flags === 'none' ? '' : (result.flags || '')
    const full = `/${result.regex}/${flagStr}`
    await navigator.clipboard.writeText(full)
    setRegexCopied(true)
    setTimeout(() => setRegexCopied(false), 2000)
  }

  async function copyCode() {
    await navigator.clipboard.writeText(result.jsExample)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #8b8ba0; }
      `}</style>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)',
            color: '#34d399', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>
            ✦ AI-Powered Tool
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            AI Regex Generator
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            Describe what you want to match in plain English — get a working regex instantly.
          </p>
        </div>

        <div className="tool-page-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'start' }}>

          {/* Form */}
          <div className="tool-form-sticky" style={{
            background: '#13131a', border: '1px solid #2a2a3a',
            borderRadius: '20px', padding: '32px',
            position: 'sticky', top: '84px',
          }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>
              🔍 Regex Details
            </h2>

            {/* Description */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Describe What to Match <span style={{ color: '#10b981' }}>*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Match a valid email address, Match a US phone number, Extract all URLs from text..."
                rows={3}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px',
                  outline: 'none', resize: 'vertical', lineHeight: '1.5',
                }}
              />
            </div>

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
                    border: form.language === l ? '1px solid #10b981' : '1px solid #2a2a3a',
                    background: form.language === l ? 'rgba(16,185,129,0.15)' : '#0a0a0f',
                    color: form.language === l ? '#34d399' : '#8b8ba0',
                  }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Examples */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Examples to Match <span style={{ color: '#8b8ba0', fontWeight: '400' }}>(optional)</span>
              </label>
              <input
                type="text"
                value={form.examples}
                onChange={(e) => setForm({ ...form, examples: e.target.value })}
                placeholder="e.g. user@example.com, test@mail.org"
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            {/* Flags */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Flags
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {availableFlags.map((flag) => {
                  const flagChar = flag.split(' ')[0]
                  const isSelected = form.flags.includes(flagChar)
                  return (
                    <button key={flag} onClick={() => toggleFlag(flag)} style={{
                      padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      border: isSelected ? '1px solid #f59e0b' : '1px solid #2a2a3a',
                      background: isSelected ? 'rgba(245,158,11,0.15)' : '#0a0a0f',
                      color: isSelected ? '#f59e0b' : '#8b8ba0',
                      fontFamily: 'monospace',
                    }}>
                      {flag}
                    </button>
                  )
                })}
              </div>
            </div>

            {error && retryAfter > 0 ? (
              <RateLimitError retryAfter={retryAfter} onRetry={generateEmail} />
            ) : error ? (
              <div style={{
                padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', fontSize: '13px',
              }}>
                {error}
              </div>
            ) : null}

            <button
              onClick={generate}
              disabled={loading}
              style={{
                width: '100%', height: '52px',
                background: loading ? '#064e3b' : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 24px rgba(16,185,129,0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? '⟳ Generating...' : '⚡ Generate Regex'}
            </button>
          </div>

          {/* Results */}
          <div ref={resultRef}>
            {loading && (
              <div style={{
                background: '#13131a', border: '1px solid #2a2a3a',
                borderRadius: '20px', padding: '60px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  border: '3px solid #2a2a3a', borderTop: '3px solid #10b981',
                  animation: 'spin 1s linear infinite',
                }} />
                <p style={{ color: '#8b8ba0', fontSize: '14px' }}>Building your regex...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {result && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Regex Pattern */}
                <div style={{
                  background: '#13131a', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: '20px', padding: '28px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>
                      ⚡ Your Regex
                    </h2>
                    <button onClick={copyRegex} style={{
                      padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                      cursor: 'pointer',
                      background: regexCopied ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      color: '#34d399',
                    }}>
                      {regexCopied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>

                  <div style={{
                    background: '#0a0a0f', borderRadius: '12px', padding: '20px',
                    border: '1px solid rgba(16,185,129,0.2)', marginBottom: '16px',
                  }}>
                    <code style={{
                      color: '#34d399', fontSize: '18px', fontFamily: 'monospace', fontWeight: '600',
                      wordBreak: 'break-all',
                    }}>
                      /{result.regex}/{result.flags === 'none' ? '' : result.flags}
                    </code>
                  </div>

                  {/* Live Tester */}
                  <div>
                    <label style={{ display: 'block', color: '#8b8ba0', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                      🧪 Live Tester
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={testInput}
                        onChange={(e) => { setTestInput(e.target.value); setTestResult(null) }}
                        placeholder="Type something to test..."
                        style={{
                          flex: 1, height: '40px', padding: '0 12px',
                          background: '#0a0a0f', border: '1px solid #2a2a3a',
                          borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none',
                        }}
                      />
                      <button onClick={testRegex} style={{
                        padding: '0 16px', height: '40px', borderRadius: '8px',
                        background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                        color: '#34d399', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                      }}>
                        Test
                      </button>
                    </div>
                    {testResult && (
                      <div style={{
                        marginTop: '8px', padding: '10px 14px', borderRadius: '8px',
                        background: testResult.error ? 'rgba(239,68,68,0.1)' : testResult.isMatch ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        border: `1px solid ${testResult.error ? 'rgba(239,68,68,0.3)' : testResult.isMatch ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        color: testResult.error ? '#f87171' : testResult.isMatch ? '#34d399' : '#f87171',
                        fontSize: '13px',
                      }}>
                        {testResult.error
                          ? `❌ ${testResult.error}`
                          : testResult.isMatch
                          ? `✅ Match found: ${JSON.stringify(testResult.matches)}`
                          : '❌ No match'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Explanation */}
                {result.explanation && (
                  <div style={{
                    background: '#13131a', border: '1px solid #2a2a3a',
                    borderRadius: '20px', padding: '28px',
                  }}>
                    <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                      📖 Explanation
                    </h2>
                    <p style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                      {result.explanation}
                    </p>
                  </div>
                )}

                {/* Test Cases */}
                {result.testCases && result.testCases.length > 0 && (
                  <div style={{
                    background: '#13131a', border: '1px solid #2a2a3a',
                    borderRadius: '20px', padding: '28px',
                  }}>
                    <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                      🧪 Test Cases
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {result.testCases.map((tc, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 14px', borderRadius: '8px',
                          background: '#0a0a0f',
                          border: `1px solid ${tc.type === 'match' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                        }}>
                          <span style={{ fontSize: '14px' }}>{tc.type === 'match' ? '✅' : '❌'}</span>
                          <code style={{
                            color: tc.type === 'match' ? '#34d399' : '#f87171',
                            fontSize: '13px', fontFamily: 'monospace',
                          }}>
                            {tc.value}
                          </code>
                          <span style={{ color: '#8b8ba0', fontSize: '11px', marginLeft: 'auto' }}>
                            {tc.type === 'match' ? 'should match' : 'should not match'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* JS Example */}
                {result.jsExample && (
                  <div style={{
                    background: '#13131a', border: '1px solid #2a2a3a',
                    borderRadius: '20px', padding: '28px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>
                        💻 Code Example
                      </h2>
                      <button onClick={copyCode} style={{
                        padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                        cursor: 'pointer',
                        background: codeCopied ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)',
                        border: codeCopied ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(124,58,237,0.3)',
                        color: codeCopied ? '#34d399' : '#a78bfa',
                      }}>
                        {codeCopied ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                    <pre style={{
                      background: '#0a0a0f', borderRadius: '10px', padding: '16px',
                      color: '#e2e8f0', fontSize: '13px', lineHeight: '1.6',
                      overflowX: 'auto', border: '1px solid #2a2a3a',
                      fontFamily: 'monospace', whiteSpace: 'pre-wrap',
                    }}>
                      {result.jsExample}
                    </pre>
                  </div>
                )}

                <button
                  onClick={generate}
                  style={{
                    width: '100%', height: '44px',
                    background: 'transparent', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: '#8b8ba0', fontSize: '14px',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)'; e.currentTarget.style.color = 'white' }}
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
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
                }}>
                  ⚡
                </div>
                <p style={{ color: '#8b8ba0', fontSize: '15px' }}>
                  Describe what you want to match and click<br />
                  <span style={{ color: '#34d399', fontWeight: '600' }}>Generate Regex</span> to get started.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {['Plain English to regex', 'Step-by-step explanation', 'Live tester included'].map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#10b981', fontSize: '14px' }}>✓</span>
                      <span style={{ color: '#8b8ba0', fontSize: '13px' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <ToolSeoSection tool="regex" />
    </div>
  )
}