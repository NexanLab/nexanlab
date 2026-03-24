'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  const contactCards = [
    {
      icon: '✉️',
      title: 'Email Us',
      description: 'For general inquiries and partnerships.',
      action: 'hello@nexanlab.com',
      href: 'mailto:hello@nexanlab.com',
    },
    {
      icon: '🐛',
      title: 'Report a Bug',
      description: 'Found something broken? Let us know.',
      action: 'Send a bug report',
      href: '#form',
    },
    {
      icon: '🛠',
      title: 'Submit a Tool',
      description: 'Know a great AI tool we should list?',
      action: 'Submit it here',
      href: '/submit',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #8b8ba0; }
      `}</style>

      <Header />

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)',
            color: '#a78bfa', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>
            ✦ Get in Touch
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            Contact Us
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '17px', lineHeight: '1.7' }}>
            Have a question, feedback, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '48px' }}>
          {contactCards.map(({ icon, title, description, action, href }) => (
            <a
              key={title}
              href={href}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: '#13131a', border: '1px solid #2a2a3a',
                borderRadius: '16px', padding: '24px', height: '100%',
                transition: 'all 0.2s ease', cursor: 'pointer',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2a2a3a'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
                <h3 style={{ color: 'white', fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>{title}</h3>
                <p style={{ color: '#8b8ba0', fontSize: '12px', lineHeight: '1.6', marginBottom: '12px' }}>{description}</p>
                <span style={{ color: '#a78bfa', fontSize: '12px', fontWeight: '600' }}>{action} →</span>
              </div>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div id="form" style={{
          background: '#13131a', border: '1px solid #2a2a3a',
          borderRadius: '20px', padding: '40px',
        }}>
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
            Send a Message
          </h2>

          {success ? (
            <div style={{
              padding: '32px', borderRadius: '12px', textAlign: 'center',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
              <p style={{ color: '#34d399', fontWeight: '600', fontSize: '16px', marginBottom: '8px' }}>Message sent!</p>
              <p style={{ color: '#8b8ba0', fontSize: '14px' }}>We'll get back to you as soon as possible.</p>
            </div>
          ) : (
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    Name <span style={{ color: '#7c3aed' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    style={{
                      width: '100%', height: '44px', padding: '0 14px',
                      background: '#0a0a0f', border: '1px solid #2a2a3a',
                      borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    Email <span style={{ color: '#7c3aed' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                    style={{
                      width: '100%', height: '44px', padding: '0 14px',
                      background: '#0a0a0f', border: '1px solid #2a2a3a',
                      borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  Subject <span style={{ color: '#7c3aed' }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="How can we help?"
                  required
                  style={{
                    width: '100%', height: '44px', padding: '0 14px',
                    background: '#0a0a0f', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  Message <span style={{ color: '#7c3aed' }}>*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us more..."
                  required
                  rows={5}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: '#0a0a0f', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: 'white', fontSize: '14px',
                    outline: 'none', resize: 'vertical', lineHeight: '1.5',
                  }}
                />
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
                {loading ? 'Sending...' : '✦ Send Message'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}