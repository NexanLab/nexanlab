'use client'

import Link from 'next/link'

export default function Header({ backHref = '/', backLabel = '← Back to Home' }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #2a2a3a', padding: '0 24px',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none',
        }}>
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

        {/* Back link */}
        <Link href={backHref} style={{
          color: '#8b8ba0', fontSize: '14px', textDecoration: 'none',
          transition: 'color 0.2s ease',
        }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#8b8ba0'}
        >
          {backLabel}
        </Link>
      </div>
    </header>
  )
}