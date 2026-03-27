'use client'

import { useState } from 'react'
import Link from 'next/link'
import ToolSeoSection from '@/app/components/ToolSeoSection'

export default function SeoTitleGenerator() {
  const [form, setForm] = useState({
    keyword: '',
    pageType: 'Blog Post',
    tone: 'Professional',
    count: '5',
  })
  const [titles, setTitles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)

  async function generateTitles() {
    if (!form.keyword.trim()) {
      setError('Please enter a keyword.')
      return
    }

    setLoading(true)
    setError('')
    setTitles([])

    try {
      const response = await fetch('/api/generate-seo-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setTitles(data.titles)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  async function copyTitle(title, index) {
    await navigator.clipboard.writeText(title)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  async function copyAll() {
    await navigator.clipboard.writeText(titles.join('\n'))
    setCopiedIndex('all')
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  function getCharColor(len) {
    if (len < 40) return '#f59e0b'
    if (len <= 60) return '#10b981'
    return '#ef4444'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #8b8ba0; }
        select option { background: #13131a; color: white; }
      `}</style>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>

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
            AI SEO Title Generator
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '17px', maxWidth: '480px', margin: '0 auto' }}>
            Generate click-worthy, SEO-optimized title tags in seconds. Rank higher and get more clicks.
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: '#13131a', border: '1px solid #2a2a3a',
          borderRadius: '20px', padding: '32px', marginBottom: '24px',
        }}>
          <div className="seo-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {/* Keyword */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Main Keyword <span style={{ color: '#7c3aed' }}>*</span>
              </label>
              <input
                type="text"
                value={form.keyword}
                onChange={(e) => setForm({ ...form, keyword: e.target.value })}
                placeholder="e.g. best AI tools, cold email generator, SEO tips..."
                style={{
                  width: '100%', height: '48px', padding: '0 16px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '12px', color: 'white', fontSize: '15px', outline: 'none',
                }}
              />
            </div>

            {/* Page Type */}
            <div>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Page Type
              </label>
              <select
                value={form.pageType}
                onChange={(e) => setForm({ ...form, pageType: e.target.value })}
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                }}
              >
                <option>Blog Post</option>
                <option>Product Page</option>
                <option>Landing Page</option>
                <option>Category Page</option>
                <option>Homepage</option>
                <option>Service Page</option>
              </select>
            </div>

            {/* Tone */}
            <div>
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
                <option>Professional</option>
                <option>Casual</option>
                <option>Urgent</option>
                <option>Curious</option>
                <option>Authoritative</option>
              </select>
            </div>

            {/* Count */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Number of Titles: <span style={{ color: '#a78bfa', fontWeight: '700' }}>{form.count}</span>
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={form.count}
                onChange={(e) => setForm({ ...form, count: e.target.value })}
                style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b8ba0', fontSize: '11px', marginTop: '4px' }}>
                <span>3</span><span>10</span>
              </div>
            </div>
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
            onClick={generateTitles}
            disabled={loading}
            style={{
              width: '100%', height: '52px',
              background: loading ? '#4c1d95' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 24px rgba(124,58,237,0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? '✦ Generating...' : '✦ Generate SEO Titles'}
          </button>
        </div>

        {/* Results */}
        {loading && (
          <div style={{
            background: '#13131a', border: '1px solid #2a2a3a',
            borderRadius: '20px', padding: '48px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              border: '3px solid #2a2a3a', borderTop: '3px solid #7c3aed',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ color: '#8b8ba0', fontSize: '14px' }}>AI is generating your titles...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {titles.length > 0 && !loading && (
          <div style={{
            background: '#13131a', border: '1px solid #2a2a3a',
            borderRadius: '20px', padding: '32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>
                🎯 Generated Titles ({titles.length})
              </h2>
              <button
                onClick={copyAll}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  background: copiedIndex === 'all' ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)',
                  border: copiedIndex === 'all' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(124,58,237,0.3)',
                  color: copiedIndex === 'all' ? '#34d399' : '#a78bfa',
                }}
              >
                {copiedIndex === 'all' ? '✓ All Copied!' : '📋 Copy All'}
              </button>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '11px' }}>
              {[
                { color: '#f59e0b', label: 'Too short (<40)' },
                { color: '#10b981', label: 'Ideal (40-60)' },
                { color: '#ef4444', label: 'Too long (>60)' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                  <span style={{ color: '#8b8ba0' }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {titles.map((title, i) => {
                const len = title.length
                const color = getCharColor(len)
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                    padding: '16px 20px', borderRadius: '12px',
                    background: '#0a0a0f', border: `1px solid ${color}30`,
                    transition: 'all 0.2s ease',
                  }}>
                    <p style={{ color: 'white', fontSize: '14px', lineHeight: '1.5', flex: 1 }}>
                      {title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <span style={{
                        fontSize: '11px', fontWeight: '700', color,
                        padding: '3px 8px', borderRadius: '999px',
                        background: `${color}15`, border: `1px solid ${color}30`,
                      }}>
                        {len}
                      </span>
                      <button
                        onClick={() => copyTitle(title, i)}
                        style={{
                          padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '600',
                          cursor: 'pointer', transition: 'all 0.2s ease',
                          background: copiedIndex === i ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)',
                          border: copiedIndex === i ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(124,58,237,0.3)',
                          color: copiedIndex === i ? '#34d399' : '#a78bfa',
                        }}
                      >
                        {copiedIndex === i ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={generateTitles}
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
      </main>
      <ToolSeoSection tool="seo-title" />
    </div>
  )
}