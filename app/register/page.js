'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input::placeholder { color: #8b8ba0; }`}</style>

      {/* Background orb */}
      <div style={{
        position: 'fixed', top: '-160px', right: '-160px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
        opacity: 0.07, pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none', marginBottom: '40px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: '800', color: 'white',
            boxShadow: '0 0 20px rgba(124,58,237,0.5)',
          }}>N</div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
            Nexan<span style={{ color: '#7c3aed' }}>Lab</span>
          </span>
        </Link>

        {/* Card */}
        <div style={{
          background: '#13131a', border: '1px solid #2a2a3a',
          borderRadius: '20px', padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
            Create an Account
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>
            Free forever. No credit card required.
          </p>

          {success ? (
            <div style={{
              padding: '20px', borderRadius: '12px',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
              <p style={{ color: '#34d399', fontWeight: '600', marginBottom: '8px' }}>Account created!</p>
              <p style={{ color: '#8b8ba0', fontSize: '13px' }}>We sent a confirmation link to your email address.</p>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
              {error && (
                <div style={{
                  padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171', fontSize: '13px',
                }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%', height: '44px', padding: '0 16px',
                    background: '#0a0a0f', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  style={{
                    width: '100%', height: '44px', padding: '0 16px',
                    background: '#0a0a0f', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', height: '44px',
                  background: loading ? '#4c1d95' : '#7c3aed',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 20px rgba(124,58,237,0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          <p style={{ color: '#8b8ba0', fontSize: '13px', textAlign: 'center', marginTop: '24px' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: '500' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}