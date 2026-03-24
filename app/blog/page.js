import Link from 'next/link'
import Header from '@/app/components/Header'

export const metadata = {
  title: 'Blog',
  description: 'AI tools tips, guides and news from NexanLab.',
}

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <Header />

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '20px',
          background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px', margin: '0 auto 32px auto',
        }}>
          ✍️
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '999px',
          border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.1)',
          color: '#f59e0b', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
        }}>
          🚀 Coming Soon
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', color: 'white', marginBottom: '20px', letterSpacing: '-1px' }}>
          The NexanLab Blog
        </h1>

        <p style={{ color: '#8b8ba0', fontSize: '18px', lineHeight: '1.7', marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px auto' }}>
          We're working on guides, tips and deep dives on AI tools. Check back soon!
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/tools" style={{
            padding: '12px 24px', background: '#7c3aed', color: 'white',
            borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
            boxShadow: '0 0 20px rgba(124,58,237,0.3)',
          }}>
            Browse AI Tools →
          </Link>
          <Link href="/" style={{
            padding: '12px 24px', background: 'transparent',
            border: '1px solid #2a2a3a', color: '#8b8ba0',
            borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
          }}>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}