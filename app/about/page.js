import Link from 'next/link'

export const metadata = {
  title: 'About',
  description: 'Learn about NexanLab — the curated AI tools directory.',
}

export default function AboutPage() {
  const stats = [
    { value: '10+', label: 'AI Tools' },
    { value: '8+', label: 'Categories' },
    { value: '2', label: 'AI-Powered Tools' },
    { value: '100%', label: 'Free to Use' },
  ]

  const values = [
    {
      icon: '✦',
      title: 'Curated, Not Exhaustive',
      description: 'We hand-pick every tool. Quality over quantity — only tools that genuinely help people make our list.',
    },
    {
      icon: '🛡',
      title: 'Always Unbiased',
      description: 'No paid rankings, no sponsored placements. Our recommendations are based purely on quality and usefulness.',
    },
    {
      icon: '🔄',
      title: 'Constantly Updated',
      description: 'The AI landscape evolves daily. We keep up so you don\'t have to.',
    },
    {
      icon: '🛠',
      title: 'Built for Doers',
      description: 'We build our own AI-powered tools to help you work smarter — not just list other people\'s tools.',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

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
          <Link href="/" style={{ color: '#8b8ba0', fontSize: '14px', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)',
            color: '#a78bfa', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>
            ✦ About NexanLab
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '900', color: 'white', marginBottom: '24px', letterSpacing: '-1px' }}>
            We Help You Find the<br />
            <span style={{ color: '#7c3aed' }}>Right AI Tools</span>
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '18px', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto' }}>
            NexanLab is a curated directory of the best AI tools — plus our own AI-powered tools to help you work faster and smarter.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
          marginBottom: '80px',
        }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{
              background: '#13131a', border: '1px solid #2a2a3a',
              borderRadius: '16px', padding: '28px 20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#7c3aed', marginBottom: '8px' }}>{value}</div>
              <div style={{ color: '#8b8ba0', fontSize: '13px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={{
          background: '#13131a', border: '1px solid #2a2a3a',
          borderRadius: '20px', padding: '40px', marginBottom: '40px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '4px', height: '20px', borderRadius: '999px', background: '#f59e0b' }} />
            <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Our Mission
            </span>
          </div>
          <p style={{ color: '#e2e8f0', fontSize: '17px', lineHeight: '1.8' }}>
            The AI tools space is overwhelming. New tools launch every day, and it's impossible to keep up. NexanLab exists to cut through the noise — we test, curate and organize the best AI tools so you can find what you need quickly and get back to work.
          </p>
        </div>

        {/* Values */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>
            What We Stand For
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {values.map(({ icon, title, description }) => (
              <div key={title} style={{
                background: '#13131a', border: '1px solid #2a2a3a',
                borderRadius: '16px', padding: '28px',
                transition: 'border-color 0.3s ease',
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a3a'}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', marginBottom: '16px',
                }}>
                  {icon}
                </div>
                <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.6' }}>{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.1), #13131a)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: '20px', padding: '48px', textAlign: 'center',
        }}>
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>
            Ready to Find Your Tools?
          </h2>
          <p style={{ color: '#8b8ba0', marginBottom: '32px', fontSize: '16px' }}>
            Browse our curated directory or try one of our AI-powered tools.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/tools" style={{
              padding: '12px 28px', background: '#7c3aed', color: 'white',
              borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
              boxShadow: '0 0 20px rgba(124,58,237,0.3)',
            }}>
              Browse Tools →
            </Link>
            <Link href="/tools/cold-email-generator" style={{
              padding: '12px 28px', background: 'transparent',
              border: '1px solid #2a2a3a', color: '#8b8ba0',
              borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
            }}>
              Try Cold Email Generator
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}