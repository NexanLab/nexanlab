'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'

export default function SubmitToolPage() {
  const [form, setForm] = useState({
    toolName: '',
    toolUrl: '',
    category: '',
    description: '',
    submitterEmail: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    'Chatbots',
    'Writing & Content',
    'Image & Design',
    'Video',
    'Code',
    'Productivity',
    'Audio & Music',
    'Analytics',
  ]

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Formspree veya benzeri bir servis kullanabilirsin
      // Şimdilik sadece success gösteriyoruz
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
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

      <Header />

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '80px 24px' }}>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)',
            color: '#a78bfa', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>
            ✦ Submit a Tool
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            Submit an AI Tool
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '17px', lineHeight: '1.7' }}>
            Know a great AI tool we're missing? Tell us about it and we'll review it for inclusion.
          </p>
        </div>

        {success ? (
          <div style={{
            background: '#13131a', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '20px', padding: '60px 40px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              Thanks for the submission!
            </h2>
            <p style={{ color: '#8b8ba0', fontSize: '15px', lineHeight: '1.7' }}>
              We'll review your tool and get back to you within a few days.
            </p>
          </div>
        ) : (
          <div style={{
            background: '#13131a', border: '1px solid #2a2a3a',
            borderRadius: '20px', padding: '40px',
          }}>
            <form onSubmit={handleSubmit}>

              {error && (
                <div style={{
                  padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171', fontSize: '13px',
                }}>
                  {error}
                </div>
              )}

              {/* Tool Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  Tool Name <span style={{ color: '#7c3aed' }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.toolName}
                  onChange={(e) => setForm({ ...form, toolName: e.target.value })}
                  placeholder="e.g. ChatGPT, Midjourney..."
                  required
                  style={{
                    width: '100%', height: '44px', padding: '0 14px',
                    background: '#0a0a0f', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                  }}
                />
              </div>

              {/* Tool URL */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  Tool URL <span style={{ color: '#7c3aed' }}>*</span>
                </label>
                <input
                  type="url"
                  value={form.toolUrl}
                  onChange={(e) => setForm({ ...form, toolUrl: e.target.value })}
                  placeholder="https://..."
                  required
                  style={{
                    width: '100%', height: '44px', padding: '0 14px',
                    background: '#0a0a0f', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                  }}
                />
              </div>

              {/* Category */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  Category <span style={{ color: '#7c3aed' }}>*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  style={{
                    width: '100%', height: '44px', padding: '0 14px',
                    background: '#0a0a0f', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: form.category ? 'white' : '#8b8ba0',
                    fontSize: '14px', outline: 'none',
                  }}
                >
                  <option value="" disabled>Select a category...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  Short Description <span style={{ color: '#7c3aed' }}>*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this tool do? Who is it for?"
                  required
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: '#0a0a0f', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: 'white', fontSize: '14px',
                    outline: 'none', resize: 'vertical', lineHeight: '1.5',
                  }}
                />
              </div>

              {/* Submitter Email */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  Your Email <span style={{ color: '#8b8ba0', fontWeight: '400' }}>(optional)</span>
                </label>
                <input
                  type="email"
                  value={form.submitterEmail}
                  onChange={(e) => setForm({ ...form, submitterEmail: e.target.value })}
                  placeholder="you@example.com"
                  style={{
                    width: '100%', height: '44px', padding: '0 14px',
                    background: '#0a0a0f', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                  }}
                />
                <p style={{ color: '#8b8ba0', fontSize: '12px', marginTop: '6px' }}>
                  We'll notify you when your tool gets listed.
                </p>
              </div>

              <button
                type="submit"
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
                {loading ? 'Submitting...' : '✦ Submit Tool'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}