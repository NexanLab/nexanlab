'use client'

import { useState } from 'react'
import Link from 'next/link'

const aiTools = ['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Adobe Firefly', 'Leonardo AI', 'Ideogram']
const styles = ['Photorealistic', 'Digital Art', 'Oil Painting', 'Watercolor', 'Anime', 'Cinematic', '3D Render', 'Sketch', 'Pixel Art', 'Surrealism']
const moods = ['Dramatic', 'Peaceful', 'Mysterious', 'Energetic', 'Melancholic', 'Epic', 'Romantic', 'Dark', 'Vibrant', 'Minimalist']
const lightings = ['Golden Hour', 'Studio Lighting', 'Neon Lights', 'Moonlight', 'Dramatic Shadows', 'Soft Diffused', 'Backlit', 'Natural Daylight']
const cameras = ['Eye Level', 'Bird\'s Eye View', 'Low Angle', 'Close-up', 'Wide Angle', 'Macro', 'Aerial View', 'Portrait']

function PromptCard({ index, prompt, negative }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const colors = ['#7c3aed', '#f59e0b', '#10b981']
  const color = colors[index] || '#7c3aed'

  return (
    <div style={{
      background: '#0a0a0f', border: `1px solid ${color}30`,
      borderRadius: '16px', padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{
          fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px',
          color, padding: '3px 10px', borderRadius: '999px',
          background: `${color}15`, border: `1px solid ${color}30`,
        }}>
          Prompt {index + 1}
        </span>
        <button onClick={copy} style={{
          padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
          cursor: 'pointer', transition: 'all 0.2s ease',
          background: copied ? 'rgba(16,185,129,0.15)' : `${color}15`,
          border: copied ? '1px solid rgba(16,185,129,0.3)' : `1px solid ${color}30`,
          color: copied ? '#34d399' : color,
        }}>
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
      <p style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: '1.7', fontFamily: 'monospace' }}>
        {prompt}
      </p>
    </div>
  )
}

export default function ImagePromptGenerator() {
  const [form, setForm] = useState({
    subject: '',
    style: 'Photorealistic',
    mood: 'Dramatic',
    lighting: 'Golden Hour',
    camera: 'Eye Level',
    extraDetails: '',
    aiTool: 'Midjourney',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [negCopied, setNegCopied] = useState(false)

  async function generate() {
    if (!form.subject.trim()) {
      setError('Please describe your subject.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/generate-image-prompt', {
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

  async function copyNegative() {
    if (!result?.negative) return
    await navigator.clipboard.writeText(result.negative)
    setNegCopied(true)
    setTimeout(() => setNegCopied(false), 2000)
  }

  function SelectGrid({ options, value, onChange, color = '#7c3aed' }) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {options.map((opt) => (
          <button key={opt} onClick={() => onChange(opt)} style={{
            padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
            cursor: 'pointer', transition: 'all 0.2s ease',
            border: value === opt ? `1px solid ${color}` : '1px solid #2a2a3a',
            background: value === opt ? `${color}20` : '#0a0a0f',
            color: value === opt ? color : '#8b8ba0',
          }}>
            {opt}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #8b8ba0; }
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
            AI Image Prompt Generator
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            Generate stunning prompts for Midjourney, DALL-E, Stable Diffusion and more in seconds.
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
              🎨 Image Details
            </h2>

            {/* AI Tool */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                AI Tool
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {aiTools.map((t) => (
                  <button key={t} onClick={() => setForm({ ...form, aiTool: t })} style={{
                    padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    border: form.aiTool === t ? '1px solid #7c3aed' : '1px solid #2a2a3a',
                    background: form.aiTool === t ? '#7c3aed' : '#0a0a0f',
                    color: form.aiTool === t ? 'white' : '#8b8ba0',
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Subject <span style={{ color: '#7c3aed' }}>*</span>
              </label>
              <textarea
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. A lone astronaut standing on Mars, looking at Earth in the distance..."
                rows={3}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px',
                  outline: 'none', resize: 'vertical', lineHeight: '1.5',
                }}
              />
            </div>

            {/* Style */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Art Style</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {styles.map((s) => (
                  <button key={s} onClick={() => setForm({ ...form, style: s })} style={{
                    padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    border: form.style === s ? '1px solid #ec4899' : '1px solid #2a2a3a',
                    background: form.style === s ? 'rgba(236,72,153,0.15)' : '#0a0a0f',
                    color: form.style === s ? '#ec4899' : '#8b8ba0',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Mood</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {moods.map((m) => (
                  <button key={m} onClick={() => setForm({ ...form, mood: m })} style={{
                    padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    border: form.mood === m ? '1px solid #f59e0b' : '1px solid #2a2a3a',
                    background: form.mood === m ? 'rgba(245,158,11,0.15)' : '#0a0a0f',
                    color: form.mood === m ? '#f59e0b' : '#8b8ba0',
                  }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Lighting</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {lightings.map((l) => (
                  <button key={l} onClick={() => setForm({ ...form, lighting: l })} style={{
                    padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    border: form.lighting === l ? '1px solid #10b981' : '1px solid #2a2a3a',
                    background: form.lighting === l ? 'rgba(16,185,129,0.15)' : '#0a0a0f',
                    color: form.lighting === l ? '#10b981' : '#8b8ba0',
                  }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Camera */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Camera Angle</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {cameras.map((c) => (
                  <button key={c} onClick={() => setForm({ ...form, camera: c })} style={{
                    padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    border: form.camera === c ? '1px solid #3b82f6' : '1px solid #2a2a3a',
                    background: form.camera === c ? 'rgba(59,130,246,0.15)' : '#0a0a0f',
                    color: form.camera === c ? '#3b82f6' : '#8b8ba0',
                  }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra Details */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Extra Details
              </label>
              <input
                type="text"
                value={form.extraDetails}
                onChange={(e) => setForm({ ...form, extraDetails: e.target.value })}
                placeholder="e.g. rain, fog, cherry blossoms, cyberpunk city..."
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
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
              {loading ? '✦ Generating...' : '✦ Generate Prompts'}
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
                <p style={{ color: '#8b8ba0', fontSize: '14px' }}>Crafting your image prompts...</p>
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
                    🎨 Your Image Prompts
                  </h2>
                  <span style={{
                    fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '999px',
                    background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                    color: '#a78bfa',
                  }}>
                    {form.aiTool}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
                  {result.prompts.map((prompt, i) => (
                    <PromptCard key={i} index={i} prompt={prompt} />
                  ))}
                </div>

                {result.negative && (
                  <div style={{
                    background: '#0a0a0f', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '12px', padding: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px',
                        color: '#ef4444', padding: '3px 10px', borderRadius: '999px',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                      }}>
                        Negative Prompt
                      </span>
                      <button onClick={copyNegative} style={{
                        padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                        cursor: 'pointer',
                        background: negCopied ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)',
                        border: negCopied ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.2)',
                        color: negCopied ? '#34d399' : '#ef4444',
                      }}>
                        {negCopied ? '✓' : '📋'}
                      </button>
                    </div>
                    <p style={{ color: '#8b8ba0', fontSize: '12px', lineHeight: '1.6', fontFamily: 'monospace' }}>
                      {result.negative}
                    </p>
                  </div>
                )}

                <button
                  onClick={generate}
                  style={{
                    width: '100%', height: '44px', marginTop: '16px',
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
                  🎨
                </div>
                <p style={{ color: '#8b8ba0', fontSize: '15px' }}>
                  Describe your image and click<br />
                  <span style={{ color: '#a78bfa', fontWeight: '600' }}>Generate Prompts</span> to get started.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {['3 unique prompt variations', 'Optimized for your AI tool', 'Negative prompt included'].map((f) => (
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