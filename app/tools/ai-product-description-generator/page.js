'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ToolSeoSection from '@/app/components/ToolSeoSection'
import { useScrollToResult } from '@/hooks/useScrollToResult'
import RateLimitError from '@/app/components/RateLimitError'
import { useFormPersist } from '@/hooks/useFormPersist'

const platforms = ['General', 'Shopify', 'Amazon', 'Etsy', 'WooCommerce', 'eBay']
const tones = ['Professional', 'Friendly', 'Luxury', 'Playful', 'Minimalist', 'Urgent']
const lengths = ['Short (50-80 words)', 'Medium (100-150 words)', 'Long (200-250 words)']

function CopyBlock({ label, value, color = '#7c3aed', onRegenerate }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      background: '#0a0a0f', border: `1px solid ${color}30`,
      borderRadius: '12px', padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{
          fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px',
          color, padding: '3px 10px', borderRadius: '999px',
          background: `${color}15`, border: `1px solid ${color}30`,
        }}>
          {label}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {onRegenerate && (
            <button onClick={onRegenerate} style={{
              padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.2s ease',
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
              color: '#f59e0b',
            }}>
              🔄 Redo
            </button>
          )}
          <button onClick={copy} style={{
            padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
            cursor: 'pointer', transition: 'all 0.2s ease',
            background: copied ? 'rgba(16,185,129,0.15)' : `${color}15`,
            border: copied ? '1px solid rgba(16,185,129,0.3)' : `1px solid ${color}30`,
            color: copied ? '#34d399' : color,
          }}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>
      <p style={{ color: 'white', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{value}</p>
    </div>
  )
}

function SeoScore({ result }) {
  if (!result?.full && !result?.title) return null

  const fullText = [result.title, result.short, result.full, ...(result.bullets || [])].join(' ')
  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length
  const titleLen = result.title?.length || 0
  const shortLen = result.short?.length || 0

  const scores = [
    {
      label: 'Title Length',
      pass: titleLen >= 30 && titleLen <= 80,
      hint: `${titleLen}/80 chars — ideal is 30-80`,
    },
    {
      label: 'Meta Hook',
      pass: shortLen >= 80 && shortLen <= 160,
      hint: `${shortLen}/160 chars — ideal is 80-160`,
    },
    {
      label: 'Word Count',
      pass: wordCount >= 50,
      hint: `${wordCount} words — minimum 50 for SEO`,
    },
    {
      label: 'Bullet Points',
      pass: result.bullets?.length >= 3,
      hint: result.bullets?.length ? `${result.bullets.length} bullets` : 'No bullets found',
    },
    {
      label: 'Keyword Present',
      pass: result.full?.toLowerCase().includes(result.title?.split(' ')[0]?.toLowerCase()),
      hint: 'Product name keyword in description',
    },
  ]

  const passed = scores.filter(s => s.pass).length
  const pct = Math.round((passed / scores.length) * 100)
  const color = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{
      background: '#0a0a0f', border: `1px solid ${color}30`,
      borderRadius: '12px', padding: '20px', marginTop: '4px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{
          fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px',
          color, padding: '3px 10px', borderRadius: '999px',
          background: `${color}15`, border: `1px solid ${color}30`,
        }}>
          SEO Score
        </span>
        <span style={{ fontSize: '22px', fontWeight: '900', color }}>{pct}%</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {scores.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: s.pass ? '#10b981' : '#ef4444' }}>
              {s.pass ? '✓' : '✗'}
            </span>
            <span style={{ fontSize: '12px', color: 'white', minWidth: '110px' }}>{s.label}</span>
            <span style={{ fontSize: '11px', color: '#4b5563' }}>{s.hint}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProductDescriptionGenerator() {
  const { form, setForm, resetForm } = useFormPersist('nexanlab-product-desc', {
    productName: '',
    keyFeatures: '',
    targetAudience: '',
    platform: 'General',
    tone: 'Professional',
    length: 'Medium (100-150 words)',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { resultRef, scrollToResult } = useScrollToResult() 
  const [retryAfter, setRetryAfter] = useState(0)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('nexanlab-product-desc-history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  function parseRaw(text) {
    const parsed = {}
    const titleMatch = text.match(/TITLE:\s*(.+)/i)
    const shortMatch = text.match(/SHORT DESCRIPTION:\s*(.+)/i)
    const fullMatch = text.match(/FULL DESCRIPTION:\s*([\s\S]+?)(?=BULLET POINTS:|$)/i)
    const bulletsMatch = text.match(/BULLET POINTS:\s*([\s\S]+?)$/i)

    if (titleMatch) parsed.title = titleMatch[1].trim()
    if (shortMatch) parsed.short = shortMatch[1].trim()
    if (fullMatch) parsed.full = fullMatch[1].trim()
    if (bulletsMatch) {
      const bulletLines = bulletsMatch[1].trim().split('\n').filter(l => l.trim())
      parsed.bullets = bulletLines
    }
    return parsed
  }

  async function generate() {
    if (!form.productName.trim()) {
      setError('Please enter a product name.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/generate-product-desc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Something went wrong.')
        if (data.retryAfter) setRetryAfter(data.retryAfter)
        setLoading(false)
        return
      }

      // Streaming: token token oku
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let raw = ''

      setLoading(false) // spinner'ı kapat, stream başlasın
      setResult({}) // boş result göster, animasyonlu dolacak

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        raw += decoder.decode(value, { stream: true })

        // Her chunk'ta parse et ve anlık güncelle
        const parsed = parseRaw(raw)
        setResult(parsed)
      }

      setTimeout(() => scrollToResult(), 100)
      // Geçmişe kaydet
      setHistory(prev => {
        const newEntry = {
          id: Date.now(),
          productName: form.productName,
          platform: form.platform,
          result: parseRaw(raw),
          date: new Date().toLocaleDateString('tr-TR'),
        }
        const updated = [newEntry, ...prev].slice(0, 10)
        localStorage.setItem('nexanlab-product-desc-history', JSON.stringify(updated))
        return updated
      })
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function regenerateSection(section) {
    try {
      const response = await fetch('/api/generate-product-desc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, onlySection: section }),
      })

      if (!response.ok) return

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let raw = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        raw += decoder.decode(value, { stream: true })
        const parsed = parseRaw(raw)
        setResult(prev => ({ ...prev, ...parsed }))
      }
    } catch {
      // sessizce geç
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #8b8ba0; }
        select option { background: #13131a; color: white; }
      `}</style>

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
            AI Product Description Generator
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            Generate compelling product descriptions that convert browsers into buyers — for any platform.
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
              🛍️ Product Details
            </h2>

            {/* Product Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                <span>Product Name <span style={{ color: '#7c3aed' }}>*</span></span>
                <span style={{ color: form.productName.length >= 200 ? '#ef4444' : form.productName.length > 160 ? '#f59e0b' : '#4b5563' }}>
                  {form.productName.length}/200
                </span>
              </label>
              <input
                maxLength={200}
                type="text"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            {/* Key Features */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                <span>Key Features</span>
                <span style={{ color: form.keyFeatures.length >= 1000 ? '#ef4444' : form.keyFeatures.length > 800 ? '#f59e0b' : '#4b5563' }}>
                  {form.keyFeatures.length}/1000
                </span>
              </label>
              <textarea
                maxLength={1000}
                value={form.keyFeatures}
                onChange={(e) => setForm({ ...form, keyFeatures: e.target.value })}
                placeholder="e.g. 40hr battery, foldable design, Bluetooth 5.0, premium sound quality..."
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
              <label style={{ display: 'flex', justifyContent: 'space-between', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Target Audience
                <span style={{ color: form.targetAudience.length >= 200 ? '#ef4444' : form.targetAudience.length > 160 ? '#f59e0b' : '#4b5563' }}>
                  {form.targetAudience.length}/200
                </span>
              </label>
              <input
                maxLength={200}
                type="text"
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                placeholder="e.g. Remote workers, music lovers, commuters..."
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

            {/* Tone */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Tone
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tones.map((t) => (
                  <button key={t} onClick={() => setForm({ ...form, tone: t })} style={{
                    padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    border: form.tone === t ? '1px solid #f59e0b' : '1px solid #2a2a3a',
                    background: form.tone === t ? 'rgba(245,158,11,0.15)' : '#0a0a0f',
                    color: form.tone === t ? '#f59e0b' : '#8b8ba0',
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Description Length
              </label>
              <select
                value={form.length}
                onChange={(e) => setForm({ ...form, length: e.target.value })}
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                }}
              >
                {lengths.map(l => <option key={l}>{l}</option>)}
              </select>
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
                background: loading ? '#4c1d95' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 24px rgba(124,58,237,0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? '✦ Generating...' : '✦ Generate Description'}
            </button>
            {history.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <button
                  onClick={() => setShowHistory(h => !h)}
                  style={{
                    width: '100%', height: '40px',
                    background: 'transparent', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: '#8b8ba0', fontSize: '13px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                  }}
                >
                  🕓 {showHistory ? 'Hide' : 'Show'} History ({history.length})
                </button>

                {showHistory && (
                  <div style={{
                    marginTop: '8px', background: '#0a0a0f',
                    border: '1px solid #2a2a3a', borderRadius: '12px',
                    overflow: 'hidden',
                  }}>
                    {history.map((entry, i) => (
                      <div
                        key={entry.id}
                        onClick={() => { setResult(entry.result); setShowHistory(false); setTimeout(() => scrollToResult(), 100) }}
                        style={{
                          padding: '12px 16px', cursor: 'pointer',
                          borderBottom: i < history.length - 1 ? '1px solid #2a2a3a' : 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#13131a'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
                            {entry.productName}
                          </span>
                          <span style={{ color: '#4b5563', fontSize: '11px' }}>{entry.date}</span>
                        </div>
                        <span style={{
                          fontSize: '11px', color: '#7c3aed', marginTop: '4px', display: 'block'
                        }}>
                          {entry.platform}
                        </span>
                      </div>
                    ))}
                    <button
                      onClick={() => { setHistory([]); localStorage.removeItem('nexanlab-product-desc-history') }}
                      style={{
                        width: '100%', padding: '10px', background: 'transparent',
                        border: 'none', borderTop: '1px solid #2a2a3a',
                        color: '#ef4444', fontSize: '12px', cursor: 'pointer',
                      }}
                    >
                      🗑 Clear History
                    </button>
                  </div>
                )}
              </div>
            )}
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
                  border: '3px solid #2a2a3a', borderTop: '3px solid #7c3aed',
                  animation: 'spin 1s linear infinite',
                }} />
                <p style={{ color: '#8b8ba0', fontSize: '14px' }}>Writing your product description...</p>
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
                    🛍️ Your Product Description
                  </h2>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => setShowPreview(p => !p)}
                      style={{
                        padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        background: showPreview ? 'rgba(16,185,129,0.15)' : 'transparent',
                        border: showPreview ? '1px solid rgba(16,185,129,0.3)' : '1px solid #2a2a3a',
                        color: showPreview ? '#10b981' : '#8b8ba0',
                      }}
                    >
                      {showPreview ? '✓ Preview On' : '👁 Preview'}
                    </button>
                    <span style={{
                      fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '999px',
                      background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                      color: '#a78bfa',
                    }}>
                      {form.platform}
                    </span>
                  </div>
                </div>
                {showPreview && (
                  <div style={{
                    marginBottom: '16px', borderRadius: '12px', overflow: 'hidden',
                    border: '1px solid #2a2a3a',
                  }}>
                    {/* Amazon Preview */}
                    {form.platform === 'Amazon' && (
                      <div style={{ background: '#fff', padding: '20px', color: '#0f1111' }}>
                        <div style={{ fontSize: '13px', color: '#007185', marginBottom: '4px' }}>Amazon Product Listing Preview</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', lineHeight: '1.4' }}>{result.title}</div>
                        <div style={{ fontSize: '13px', color: '#565959', marginBottom: '12px' }}>{result.short}</div>
                        <ul style={{ paddingLeft: '18px', margin: 0 }}>
                          {result.bullets?.map((b, i) => (
                            <li key={i} style={{ fontSize: '13px', marginBottom: '4px', color: '#0f1111' }}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Etsy Preview */}
                    {form.platform === 'Etsy' && (
                      <div style={{ background: '#fdf9f0', padding: '20px' }}>
                        <div style={{ fontSize: '12px', color: '#f1641e', fontWeight: '600', marginBottom: '6px' }}>Etsy Listing Preview</div>
                        <div style={{ fontSize: '17px', fontWeight: '700', color: '#222', marginBottom: '6px' }}>{result.title}</div>
                        <div style={{ fontSize: '13px', color: '#595959', marginBottom: '10px', fontStyle: 'italic' }}>{result.short}</div>
                        <div style={{ fontSize: '13px', color: '#222', lineHeight: '1.7' }}>{result.full}</div>
                      </div>
                    )}

                    {/* Shopify Preview */}
                    {form.platform === 'Shopify' && (
                      <div style={{ background: '#f6f6f7', padding: '20px' }}>
                        <div style={{ fontSize: '12px', color: '#008060', fontWeight: '600', marginBottom: '6px' }}>Shopify Product Page Preview</div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#121212', marginBottom: '6px' }}>{result.title}</div>
                        <div style={{ fontSize: '14px', color: '#6d7175', marginBottom: '10px' }}>{result.short}</div>
                        <div style={{ fontSize: '14px', color: '#121212', lineHeight: '1.7', marginBottom: '10px' }}>{result.full}</div>
                        <ul style={{ paddingLeft: '18px', margin: 0 }}>
                          {result.bullets?.map((b, i) => (
                            <li key={i} style={{ fontSize: '13px', marginBottom: '4px', color: '#121212' }}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* General / Diğerleri */}
                    {!['Amazon', 'Etsy', 'Shopify'].includes(form.platform) && (
                      <div style={{ background: '#13131a', padding: '20px' }}>
                        <div style={{ fontSize: '12px', color: '#a78bfa', fontWeight: '600', marginBottom: '6px' }}>{form.platform} Preview</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>{result.title}</div>
                        <div style={{ fontSize: '13px', color: '#8b8ba0', marginBottom: '10px' }}>{result.short}</div>
                        <div style={{ fontSize: '14px', color: '#d1d5db', lineHeight: '1.7' }}>{result.full}</div>
                      </div>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.title && <CopyBlock label="Product Title" value={result.title} color="#7c3aed" onRegenerate={() => regenerateSection('title')} />}
                  {result.short && <CopyBlock label="Short Description" value={result.short} color="#f59e0b" onRegenerate={() => regenerateSection('short')} />}
                  {result.full && <CopyBlock label="Full Description" value={result.full} color="#10b981" onRegenerate={() => regenerateSection('full')} />}
                  {result.bullets && result.bullets.length > 0 && (
                    <CopyBlock label="Bullet Points" value={result.bullets.join('\n')} color="#ec4899" onRegenerate={() => regenerateSection('bullets')} />
                  )}
                </div>
                <SeoScore result={result} />
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button
                    onClick={() => {
                      const content = [
                        result.title && `TITLE:\n${result.title}`,
                        result.short && `\nSHORT DESCRIPTION:\n${result.short}`,
                        result.full && `\nFULL DESCRIPTION:\n${result.full}`,
                        result.bullets?.length && `\nBULLET POINTS:\n${result.bullets.join('\n')}`,
                      ].filter(Boolean).join('\n')
                      const blob = new Blob([content], { type: 'text/plain' })
                      const a = document.createElement('a')
                      a.href = URL.createObjectURL(blob)
                      a.download = `${form.productName.slice(0, 40).replace(/\s+/g, '-')}-description.txt`
                      a.click()
                    }}
                    style={{
                      flex: 1, height: '40px', background: 'transparent',
                      border: '1px solid #2a2a3a', borderRadius: '10px',
                      color: '#8b8ba0', fontSize: '13px', cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)'; e.currentTarget.style.color = '#10b981' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.color = '#8b8ba0' }}
                  >
                    📄 Export .txt
                  </button>

                  <button
                    onClick={() => {
                      const rows = [
                        ['Section', 'Content'],
                        ['Title', result.title || ''],
                        ['Short Description', result.short || ''],
                        ['Full Description', result.full || ''],
                        ...(result.bullets || []).map((b, i) => [`Bullet ${i + 1}`, b]),
                      ]
                      const csv = rows.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
                      const blob = new Blob([csv], { type: 'text/csv' })
                      const a = document.createElement('a')
                      a.href = URL.createObjectURL(blob)
                      a.download = `${form.productName.slice(0, 40).replace(/\s+/g, '-')}-description.csv`
                      a.click()
                    }}
                    style={{
                      flex: 1, height: '40px', background: 'transparent',
                      border: '1px solid #2a2a3a', borderRadius: '10px',
                      color: '#8b8ba0', fontSize: '13px', cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = '#818cf8' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.color = '#8b8ba0' }}
                  >
                    📊 Export .csv
                  </button>
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
                  🛍️
                </div>
                <p style={{ color: '#8b8ba0', fontSize: '15px' }}>
                  Fill in your product details and click<br />
                  <span style={{ color: '#a78bfa', fontWeight: '600' }}>Generate Description</span> to get started.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {['SEO-optimized title', 'Compelling full description', 'Ready-to-use bullet points'].map((f) => (
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
      <ToolSeoSection tool="product-desc" />
    </div>
  )
}