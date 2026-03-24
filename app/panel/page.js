'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
    }
    init()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>
        <p style={{ color: '#8b8ba0' }}>Loading...</p>
      </div>
    )
  }

  const tools = [
    { label: 'Cold Email Generator', desc: 'Generate personalized cold emails', icon: '✉️', href: '/tools/cold-email-generator' },
    { label: 'SEO Title Generator', desc: 'Generate click-worthy SEO titles', icon: '🔍', href: '/tools/ai-seo-title-generator' },
    { label: 'Ad Copy Generator', desc: 'Generate high-converting ad copy', icon: '📣', href: '/tools/ai-ad-copy-generator' },
    { label: 'Product Description', desc: 'Generate compelling product descriptions', icon: '🛍️', href: '/tools/ai-product-description-generator' },
    { label: 'Code Reviewer', desc: 'Get instant AI feedback on your code', icon: '💻', href: '/tools/ai-code-reviewer' },
    { label: 'Image Prompt Generator', desc: 'Generate prompts for AI image tools', icon: '🎨', href: '/tools/ai-image-prompt-generator' },
    { label: 'Regex Generator', desc: 'Generate regex patterns in plain English', icon: '⚡', href: '/tools/ai-regex-generator' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .panel-sidebar { position: static !important; width: 100% !important; height: auto !important; border-right: none !important; border-bottom: 1px solid #2a2a3a !important; padding: 16px 20px !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important; }
          .panel-sidebar-nav { flex-direction: row !important; flex: 0 !important; gap: 4px !important; }
          .panel-sidebar-user { display: none !important; }
          .panel-main { margin-left: 0 !important; padding: 24px 16px !important; }
          .panel-tools-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Sidebar */}
      <div className="panel-sidebar" style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: '240px',
        background: '#0d0d14', borderRight: '1px solid #2a2a3a',
        display: 'flex', flexDirection: 'column', padding: '24px 16px',
        zIndex: 40,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '40px', padding: '0 8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '800', color: 'white',
          }}>N</div>
          <span style={{ fontSize: '17px', fontWeight: '700', color: 'white' }}>
            Nexan<span style={{ color: '#7c3aed' }}>Lab</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="panel-sidebar-nav" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { icon: '⊞', label: 'Dashboard', href: '/panel', active: true },
            { icon: '🛠', label: 'Tools', href: '/tools' },
          ].map((item) => (
            <Link key={item.label} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px',
              textDecoration: 'none', fontSize: '14px', fontWeight: '500',
              background: item.active ? 'rgba(124,58,237,0.15)' : 'transparent',
              color: item.active ? '#a78bfa' : '#8b8ba0',
              border: item.active ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent',
            }}>
              <span>{item.icon}</span>
              <span style={{ display: 'inline' }}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="panel-sidebar-user" style={{ borderTop: '1px solid #2a2a3a', paddingTop: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: '#13131a', marginBottom: '8px' }}>
            <p style={{ color: 'white', fontSize: '13px', fontWeight: '500', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </p>
            <p style={{ color: '#8b8ba0', fontSize: '11px' }}>Free Plan</p>
          </div>
          <button onClick={signOut} style={{
            width: '100%', padding: '10px 12px',
            background: 'transparent', border: '1px solid #2a2a3a',
            borderRadius: '10px', color: '#8b8ba0', fontSize: '13px',
            cursor: 'pointer', textAlign: 'left',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.color = '#8b8ba0' }}
          >
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <main className="panel-main" style={{ marginLeft: '240px', padding: '40px' }}>
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              Welcome back 👋
            </h1>
            <p style={{ color: '#8b8ba0', fontSize: '15px' }}>
              Here's an overview of your NexanLab tools.
            </p>
          </div>
          {/* Mobile sign out */}
          <button onClick={signOut} style={{
            display: 'none',
            padding: '8px 16px', background: 'transparent',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', color: '#f87171', fontSize: '13px', cursor: 'pointer',
          }} className="panel-mobile-signout">
            🚪 Sign Out
          </button>
        </div>

        <div style={{ background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
            Your AI Tools
          </h2>
          <div className="panel-tools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {tools.map((action) => (
              <Link key={action.label} href={action.href} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px', borderRadius: '12px',
                background: '#0d0d14', border: '1px solid #2a2a3a',
                textDecoration: 'none', transition: 'all 0.2s ease',
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a3a'}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                  flexShrink: 0,
                }}>
                  {action.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: 'white', fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                    {action.label}
                  </div>
                  <div style={{ color: '#8b8ba0', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}