'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

const trustSignals = [
  {
    icon: '✦',
    title: 'Curated Selection',
    description: 'Every tool is tested by our team and only those meeting our quality standards make the list.',
  },
  {
    icon: '🛡',
    title: 'Unbiased Reviews',
    description: 'No sponsored content or paid rankings. Only real user experiences.',
  },
  {
    icon: '🔄',
    title: 'Weekly Updates',
    description: 'The AI world moves fast. We refresh our directory every week with new tools and updates.',
  },
]

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ fontSize: '11px', color: i <= Math.round(rating) ? '#f59e0b' : '#2a2a3a' }}>★</span>
      ))}
      <span style={{ fontSize: '11px', color: '#8b8ba0', marginLeft: '4px' }}>{rating}</span>
    </div>
  )
}

const colorMap = {
  amber: '#f59e0b', violet: '#7c3aed', blue: '#3b82f6',
  green: '#10b981', pink: '#ec4899', red: '#ef4444',
}
function resolveColor(raw) { return colorMap[raw] || raw || '#7c3aed' }

function ToolCard({ tool }) {
  const [hovered, setHovered] = useState(false)
  const accentColor = resolveColor(tool.accent_color || tool.accentColor)
  const badgeColor = resolveColor(tool.badge_color || tool.badgeColor)
  const href = tool.url || tool.href || '#'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', background: '#13131a',
        border: `1px solid ${hovered ? accentColor + '50' : '#2a2a3a'}`,
        borderRadius: '16px', padding: '24px', cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 40px ${accentColor}20` : 'none',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        minHeight: '180px',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: '24px', right: '24px', height: '1px',
        background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease',
      }} />
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '700', color: 'white',
              background: `${accentColor}25`, border: `1px solid ${accentColor}40`,
            }}>
              {tool.name.charAt(0)}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{tool.name}</div>
              <div style={{ color: '#8b8ba0', fontSize: '12px' }}>{tool.category}</div>
            </div>
          </div>
          {tool.badge && (
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '3px 10px',
              borderRadius: '999px', whiteSpace: 'nowrap',
              border: `1px solid ${badgeColor}40`,
              background: `${badgeColor}15`, color: badgeColor,
            }}>{tool.badge}</span>
          )}
        </div>
        <p style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
          {tool.description}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <StarRating rating={tool.rating} />
          <div style={{ color: '#8b8ba0', fontSize: '11px', marginTop: '2px' }}>
            {(tool.review_count || tool.reviews || 0).toLocaleString()} reviews
          </div>
        </div>
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : '_self'}
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: '600', padding: '6px 12px',
            borderRadius: '8px', border: `1px solid ${accentColor}40`,
            background: `${accentColor}10`, color: accentColor,
            textDecoration: 'none', transition: 'all 0.2s ease',
          }}
        >
          {href.startsWith('http') ? 'Visit ↗' : 'Try it →'}
        </a>
      </div>
    </div>
  )
}

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(10,10,15,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid #2a2a3a' : '1px solid transparent',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '800', color: 'white',
              boxShadow: '0 0 20px rgba(124,58,237,0.5)',
            }}>N</div>
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'white', letterSpacing: '-0.5px' }}>
              Nexan<span style={{ color: '#7c3aed' }}>Lab</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="home-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[
              { label: 'Tools', href: '/tools' },
              { label: 'Categories', href: '/categories' },
              { label: 'Blog', href: '/blog' },
              { label: 'About', href: '/about' },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{
                padding: '8px 16px', fontSize: '14px', fontWeight: '500',
                color: '#8b8ba0', textDecoration: 'none', borderRadius: '8px',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={(e) => { e.target.style.color = 'white'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={(e) => { e.target.style.color = '#8b8ba0'; e.target.style.background = 'transparent' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link href="/tools" className="home-header-cta" style={{
            padding: '8px 20px', background: '#7c3aed', color: 'white',
            borderRadius: '10px', fontSize: '14px', fontWeight: '600',
            textDecoration: 'none', boxShadow: '0 0 20px rgba(124,58,237,0.4)',
          }}>
            Explore Tools
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="home-mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', // CSS'de override edilecek
              background: 'transparent', border: '1px solid #2a2a3a',
              borderRadius: '8px', padding: '8px 12px',
              color: 'white', fontSize: '18px', cursor: 'pointer',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid #2a2a3a',
            padding: '16px 0',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            {[
              { label: 'Tools', href: '/tools' },
              { label: 'Categories', href: '/categories' },
              { label: 'Blog', href: '/blog' },
              { label: 'About', href: '/about' },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '12px 16px', fontSize: '15px', fontWeight: '500',
                  color: '#e2e8f0', textDecoration: 'none', borderRadius: '8px',
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/tools"
              onClick={() => setMenuOpen(false)}
              style={{
                margin: '8px 16px 0 16px', padding: '12px 20px',
                background: '#7c3aed', color: 'white',
                borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                textDecoration: 'none', textAlign: 'center',
              }}
            >
              Explore Tools
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

function HeroSection({ featuredTools }) {
  const [search, setSearch] = useState('')
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/tools?search=${encodeURIComponent(search.trim())}`)
    } else {
      router.push('/tools')
    }
  }

  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px', overflow: 'hidden',
    }}>
      {/* BG orbs */}
      <div style={{
        position: 'absolute', top: '-160px', right: '-160px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
        opacity: 0.07, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)',
        opacity: 0.06, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', textAlign: 'center', width: '100%' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '999px',
          border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)',
          color: '#a78bfa', fontSize: '12px', fontWeight: '600', marginBottom: '32px',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.4s ease',
        }}>
          ✦ {featuredTools.length}+ AI Tools Curated
        </div>

        <div style={{ marginBottom: '24px' }}>
          {['Discover the', 'Best AI Tools', 'in One Place'].map((word, i) => (
            <div key={word} style={{
              display: 'block',
              fontSize: 'clamp(36px, 8vw, 80px)',
              fontWeight: '900', lineHeight: '1.1', letterSpacing: '-2px',
              color: i === 1 ? '#7c3aed' : 'white',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(40px)',
              transition: `all 0.5s ease ${0.1 + i * 0.12}s`,
            }}>
              {word}
            </div>
          ))}
        </div>

        <p style={{
          color: '#8b8ba0', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: '1.7',
          maxWidth: '600px', margin: '0 auto 40px auto',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease 0.5s',
        }}>
          Find the AI tools that will supercharge your workflow, boost creativity, and maximize productivity.
        </p>

        <form onSubmit={handleSearch} className="hero-search-form" style={{
          display: 'flex', gap: '12px', maxWidth: '520px', margin: '0 auto 48px auto',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease 0.65s',
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8b8ba0', fontSize: '16px' }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search AI tools..."
              style={{
                width: '100%', height: '48px', paddingLeft: '42px', paddingRight: '16px',
                background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '12px',
                color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <button type="submit" style={{
            height: '48px', padding: '0 24px',
            background: '#7c3aed', color: 'white', border: 'none',
            borderRadius: '12px', fontSize: '14px', fontWeight: '600',
            cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: '0 0 20px rgba(124,58,237,0.4)',
          }}>
            Search →
          </button>
        </form>

        <div className="hero-stats" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px',
          opacity: visible ? 1 : 0, transition: 'all 0.5s ease 0.8s',
        }}>
          {[
            { value: `${featuredTools.length}+`, label: 'AI Tools' },
            { value: '8+', label: 'Categories' },
            { value: '10K+', label: 'Users' },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '800', color: 'white' }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#8b8ba0' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        opacity: visible ? 1 : 0, transition: 'opacity 1s ease 1.2s',
      }}>
        <div style={{
          width: '20px', height: '32px', borderRadius: '999px', border: '1px solid #2a2a3a',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '6px',
        }}>
          <div style={{
            width: '4px', height: '8px', borderRadius: '999px',
            background: 'rgba(124,58,237,0.6)', animation: 'scrollBob 2s infinite ease-in-out',
          }} />
        </div>
      </div>
    </section>
  )
}

function FeaturedToolsSection({ tools }) {
  return (
    <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '4px', height: '20px', borderRadius: '999px', background: '#7c3aed' }} />
            <span style={{ color: '#7c3aed', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Featured
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 36px)', fontWeight: '800', color: 'white', margin: 0 }}>
            Top Rated This Week
          </h2>
        </div>
        <Link href="/tools" style={{ color: '#8b8ba0', fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          View All →
        </Link>
      </div>

      <div className="tool-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  )
}

function NewToolsSection({ tools }) {
  if (!tools.length) return null
  return (
    <section style={{ padding: '0 24px 80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '4px', height: '20px', borderRadius: '999px', background: '#10b981' }} />
            <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              New
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 36px)', fontWeight: '800', color: 'white', margin: 0 }}>
            Recently Added
          </h2>
        </div>
        <Link href="/tools?filter=new" style={{ color: '#8b8ba0', fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          View All →
        </Link>
      </div>
      <div className="tool-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section style={{ padding: '80px 24px', background: '#0d0d14', borderTop: '1px solid #2a2a3a', borderBottom: '1px solid #2a2a3a', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
        opacity: 0.05, pointerEvents: 'none',
      }} />
      <div className="why-grid" style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '4px', height: '20px', borderRadius: '999px', background: '#f59e0b' }} />
            <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Why NexanLab?
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: '800', color: 'white', marginBottom: '24px', lineHeight: '1.2' }}>
            Finding AI Tools<br />
            <span style={{ color: '#7c3aed' }}>Just Got Easier</span>
          </h2>
          <p style={{ color: '#8b8ba0', lineHeight: '1.7', marginBottom: '32px', fontSize: '15px' }}>
            Stop drowning in hundreds of AI tools. NexanLab is designed to help you find the right tools for your needs. Curated lists, honest reviews, and weekly updates so you always have access to the best options.
          </p>
          <Link href="/tools" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', background: '#7c3aed', color: 'white',
            borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
            boxShadow: '0 0 20px rgba(124,58,237,0.3)',
          }}>
            Explore Tools →
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {trustSignals.map(({ icon, title, description }) => (
            <div key={title} style={{
              display: 'flex', gap: '16px', padding: '20px',
              borderRadius: '16px', background: '#13131a', border: '1px solid #2a2a3a',
              transition: 'border-color 0.3s ease',
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a3a'}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', flexShrink: 0,
              }}>
                {icon}
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>{title}</div>
                <div style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.6' }}>{description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{
        position: 'relative', borderRadius: '24px',
        border: '1px solid rgba(124,58,237,0.3)',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.1), #13131a, rgba(245,158,11,0.05))',
        padding: '60px 24px', textAlign: 'center', overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.1)',
            color: '#f59e0b', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>
            ✦ Weekly AI Newsletter
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: '800', color: 'white', marginBottom: '16px' }}>
            Be the First to Know
          </h2>
          <p style={{ color: '#8b8ba0', maxWidth: '480px', margin: '0 auto 32px auto', lineHeight: '1.7' }}>
            Every week we send the best new AI tools, tips and opportunities directly to your inbox. No spam, just value.
          </p>
          {submitted ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
              color: '#34d399', fontWeight: '600',
            }}>
              ✦ You're in! Welcome aboard.
            </div>
          ) : (
            <div className="newsletter-form" style={{ display: 'flex', gap: '12px', maxWidth: '420px', margin: '0 auto' }}>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  flex: 1, height: '48px', padding: '0 16px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none',
                  minWidth: 0,
                }}
              />
              <button onClick={() => email && setSubmitted(true)} style={{
                height: '48px', padding: '0 24px', background: '#7c3aed', color: 'white',
                border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600',
                cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 0 20px rgba(124,58,237,0.4)',
              }}>
                Subscribe
              </button>
            </div>
          )}
          <p style={{ color: '#8b8ba0', fontSize: '12px', marginTop: '16px' }}>
            Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const footerLinks = {
    Tools: [
      { label: 'All Tools', href: '/tools' },
      { label: 'Featured', href: '/tools?filter=featured' },
      { label: 'New', href: '/tools?filter=new' },
      { label: 'Free Tools', href: '/tools?filter=free' },
    ],
    Categories: [
      { label: 'Writing & Content', href: '/tools?category=Writing+%26+Content' },
      { label: 'Image & Design', href: '/tools?category=Image+%26+Design' },
      { label: 'Video', href: '/tools?category=Video' },
      { label: 'Code', href: '/tools?category=Code' },
    ],
    NexanLab: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Submit a Tool', href: '/submit' },
      { label: 'Contact', href: '/contact' },
    ],
  }

  return (
    <footer style={{ background: '#0a0a0f', borderTop: '1px solid #2a2a3a', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent)',
      }} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: '800', color: 'white',
              }}>N</div>
              <span style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
                Nexan<span style={{ color: '#7c3aed' }}>Lab</span>
              </span>
            </Link>
            <p style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.7', maxWidth: '260px', marginBottom: '24px' }}>
              Free AI-powered tools to help you write, build, and create faster.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 style={{ color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '16px' }}>{category}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} style={{ color: '#8b8ba0', fontSize: '13px', textDecoration: 'none' }}
                      onMouseEnter={(e) => e.target.style.color = 'white'}
                      onMouseLeave={(e) => e.target.style.color = '#8b8ba0'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom" style={{ paddingTop: '24px', borderTop: '1px solid #2a2a3a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ color: '#8b8ba0', fontSize: '12px' }}>
            © {new Date().getFullYear()} NexanLab. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ color: '#8b8ba0', fontSize: '12px', textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = '#8b8ba0'}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  const [featuredTools, setFeaturedTools] = useState([])
  const [newTools, setNewTools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTools() {
      const { data: featured } = await supabase
        .from('tools').select('*').eq('is_featured', true)
        .order('rating', { ascending: false }).limit(6)
      const { data: newest } = await supabase
        .from('tools').select('*').order('created_at', { ascending: false }).limit(3)
      if (featured) setFeaturedTools(featured)
      if (newest) setNewTools(newest)
      setLoading(false)
    }
    fetchTools()
  }, [])

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes scrollBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
        input::placeholder { color: #8b8ba0; }
        @media (max-width: 768px) {
          .home-mobile-menu-btn { display: block !important; }
        }
      `}</style>
      <Header />
      <HeroSection featuredTools={featuredTools} />
      {!loading && <FeaturedToolsSection tools={featuredTools} />}
      {!loading && <NewToolsSection tools={newTools} />}
      <WhySection />
      <NewsletterSection />
      <Footer />
    </div>
  )
}