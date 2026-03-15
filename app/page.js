'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ── Data ──────────────────────────────────────────────────────────────────────

const categories = [
  { label: 'Tümü', icon: '✦' },
  { label: 'Yazı & İçerik', icon: '✍️' },
  { label: 'Görsel & Tasarım', icon: '🎨' },
  { label: 'Video', icon: '🎬' },
  { label: 'Kod', icon: '💻' },
  { label: 'Üretkenlik', icon: '🧠' },
  { label: 'Analitik', icon: '📊' },
  { label: 'Ses & Müzik', icon: '🎵' },
  { label: 'Sohbet Botları', icon: '💬' },
]

const featuredTools = [
  {
    id: 1,
    name: 'ChatGPT',
    category: 'Sohbet Botları',
    description: 'OpenAI tarafından geliştirilen güçlü dil modeli. Yazı, kod, analiz ve daha fazlası için.',
    rating: 4.9,
    reviews: 12400,
    badge: 'En Popüler',
    badgeColor: '#f59e0b',
    href: 'https://chat.openai.com',
    size: 'large',
    accentColor: '#10b981',
  },
  {
    id: 2,
    name: 'Midjourney',
    category: 'Görsel & Tasarım',
    description: 'Metinden nefes kesici görseller oluşturan yapay zeka sanat aracı.',
    rating: 4.8,
    reviews: 8900,
    badge: 'Editörün Seçimi',
    badgeColor: '#7c3aed',
    href: 'https://midjourney.com',
    size: 'large',
    accentColor: '#7c3aed',
  },
  {
    id: 3,
    name: 'GitHub Copilot',
    category: 'Kod',
    description: 'AI destekli kod tamamlama ve öneri aracı.',
    rating: 4.7,
    reviews: 6200,
    badge: 'Geliştirici',
    badgeColor: '#3b82f6',
    href: 'https://github.com/features/copilot',
    size: 'small',
    accentColor: '#3b82f6',
  },
  {
    id: 4,
    name: 'Notion AI',
    category: 'Üretkenlik',
    description: 'Notion içinde AI ile not alma ve proje yönetimi.',
    rating: 4.6,
    reviews: 4100,
    badge: 'Üretkenlik',
    badgeColor: '#10b981',
    href: 'https://notion.so',
    size: 'small',
    accentColor: '#10b981',
  },
  {
    id: 5,
    name: 'ElevenLabs',
    category: 'Ses & Müzik',
    description: 'Gerçekçi yapay zeka sesleri ve ses klonlama teknolojisi.',
    rating: 4.8,
    reviews: 3800,
    badge: 'Yeni',
    badgeColor: '#f59e0b',
    href: 'https://elevenlabs.io',
    size: 'small',
    accentColor: '#f59e0b',
  },
  {
    id: 6,
    name: 'Runway ML',
    category: 'Video',
    description: 'AI ile video oluşturma, düzenleme ve efekt ekleme platformu.',
    rating: 4.7,
    reviews: 5500,
    badge: 'Video AI',
    badgeColor: '#ec4899',
    href: 'https://runwayml.com',
    size: 'small',
    accentColor: '#ec4899',
  },
]

const trustSignals = [
  {
    icon: '✦',
    title: 'Küratörlü Seçim',
    description: 'Her araç ekibimiz tarafından test edilir ve kalite standartlarımızı karşılayanlar listeye alınır.',
  },
  {
    icon: '🛡',
    title: 'Tarafsız Değerlendirme',
    description: 'Sponsorlu içerik ve ücretli sıralamalar yok. Sadece gerçek kullanıcı deneyimleri.',
  },
  {
    icon: '🔄',
    title: 'Haftalık Güncelleme',
    description: 'AI dünyası hızla değişiyor. Dizinimizi her hafta yeni araçlar ve güncellemelerle tazeleriz.',
  },
]

// ── Star Rating ───────────────────────────────────────────────────────────────

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

// ── Tool Card ─────────────────────────────────────────────────────────────────

function ToolCard({ tool }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: '#13131a',
        border: `1px solid ${hovered ? tool.accentColor + '50' : '#2a2a3a'}`,
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 40px ${tool.accentColor}20` : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '180px',
      }}
    >
      {/* Top glow line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '24px',
        right: '24px',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${tool.accentColor}60, transparent)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />

      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '700',
              color: 'white',
              background: `${tool.accentColor}25`,
              border: `1px solid ${tool.accentColor}40`,
            }}>
              {tool.name.charAt(0)}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{tool.name}</div>
              <div style={{ color: '#8b8ba0', fontSize: '12px' }}>{tool.category}</div>
            </div>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            padding: '3px 10px',
            borderRadius: '999px',
            border: `1px solid ${tool.badgeColor}40`,
            background: `${tool.badgeColor}15`,
            color: tool.badgeColor,
            whiteSpace: 'nowrap',
          }}>
            {tool.badge}
          </span>
        </div>

        <p style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
          {tool.description}
        </p>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <StarRating rating={tool.rating} />
          <div style={{ color: '#8b8ba0', fontSize: '11px', marginTop: '2px' }}>
            {tool.reviews.toLocaleString('tr-TR')} değerlendirme
          </div>
        </div>
        <a
          href={tool.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '600',
            padding: '6px 12px',
            borderRadius: '8px',
            border: `1px solid ${tool.accentColor}40`,
            background: `${tool.accentColor}10`,
            color: tool.accentColor,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          İncele ↗
        </a>
      </div>
    </div>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────

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
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
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
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '800',
              color: 'white',
              boxShadow: '0 0 20px rgba(124,58,237,0.5)',
            }}>N</div>
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'white', letterSpacing: '-0.5px' }}>
              Nexan<span style={{ color: '#7c3aed' }}>Lab</span>
            </span>
          </Link>

          {/* Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {['Araçlar', 'Kategoriler', 'Blog', 'Hakkında'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#8b8ba0',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={(e) => { e.target.style.color = 'white'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={(e) => { e.target.style.color = '#8b8ba0'; e.target.style.background = 'transparent' }}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <a href="/arac-ekle" style={{
            padding: '8px 20px',
            background: '#7c3aed',
            color: 'white',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            boxShadow: '0 0 20px rgba(124,58,237,0.4)',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 0 30px rgba(124,58,237,0.7)'}
            onMouseLeave={(e) => e.target.style.boxShadow = '0 0 20px rgba(124,58,237,0.4)'}
          >
            Araç Ekle
          </a>
        </div>
      </div>
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [search, setSearch] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      overflow: 'hidden',
    }}>
      {/* Background orbs */}
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
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(124,58,237,0.05), transparent)',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', textAlign: 'center' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '999px',
          border: '1px solid rgba(124,58,237,0.3)',
          background: 'rgba(124,58,237,0.1)',
          color: '#a78bfa', fontSize: '12px', fontWeight: '600',
          marginBottom: '32px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.4s ease',
        }}>
          ✦ 500+ AI Aracı Küratörlü Dizin
        </div>

        {/* Headline */}
        <div style={{ marginBottom: '24px' }}>
          {['En İyi', 'AI Araçlarını', 'Keşfet'].map((word, i) => (
            <div key={word} style={{
              display: 'block',
              fontSize: 'clamp(48px, 8vw, 80px)',
              fontWeight: '900',
              lineHeight: '1.1',
              letterSpacing: '-2px',
              color: i === 1 ? '#7c3aed' : 'white',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(40px)',
              transition: `all 0.5s ease ${0.1 + i * 0.12}s`,
            }}>
              {word}
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <p style={{
          color: '#8b8ba0', fontSize: '18px', lineHeight: '1.7',
          maxWidth: '600px', margin: '0 auto 40px auto',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease 0.5s',
        }}>
          İş akışını hızlandıracak, yaratıcılığını artıracak ve verimliliğini zirveye taşıyacak AI araçlarını tek bir yerde bul.
        </p>

        {/* Search */}
        <div style={{
          display: 'flex', gap: '12px', maxWidth: '520px', margin: '0 auto 48px auto',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease 0.65s',
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8b8ba0', fontSize: '16px' }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Araç ara... (ChatGPT, Midjourney...)"
              style={{
                width: '100%', height: '48px', paddingLeft: '42px', paddingRight: '16px',
                background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '12px',
                color: 'white', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button style={{
            height: '48px', padding: '0 24px',
            background: '#7c3aed', color: 'white', border: 'none',
            borderRadius: '12px', fontSize: '14px', fontWeight: '600',
            cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: '0 0 20px rgba(124,58,237,0.4)',
          }}>
            Ara →
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px',
          opacity: visible ? 1 : 0,
          transition: 'all 0.5s ease 0.8s',
        }}>
          {[{ value: '500+', label: 'AI Aracı' }, { value: '50+', label: 'Kategori' }, { value: '10K+', label: 'Kullanıcı' }].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#8b8ba0' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        opacity: visible ? 1 : 0, transition: 'opacity 1s ease 1.2s',
      }}>
        <div style={{
          width: '20px', height: '32px', borderRadius: '999px',
          border: '1px solid #2a2a3a',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '6px',
        }}>
          <div style={{
            width: '4px', height: '8px', borderRadius: '999px',
            background: 'rgba(124,58,237,0.6)',
            animation: 'scrollBob 2s infinite ease-in-out',
          }} />
        </div>
      </div>
    </section>
  )
}

// ── Categories ────────────────────────────────────────────────────────────────

function CategoriesSection() {
  const [active, setActive] = useState('Tümü')

  return (
    <section style={{ padding: '16px 0', borderTop: '1px solid #2a2a3a', borderBottom: '1px solid #2a2a3a', background: '#0d0d14' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '999px',
                fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap',
                cursor: 'pointer', transition: 'all 0.2s ease',
                border: active === label ? '1px solid #7c3aed' : '1px solid #2a2a3a',
                background: active === label ? '#7c3aed' : '#13131a',
                color: active === label ? 'white' : '#8b8ba0',
                boxShadow: active === label ? '0 0 15px rgba(124,58,237,0.4)' : 'none',
              }}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Featured Tools ────────────────────────────────────────────────────────────

function FeaturedToolsSection() {
  return (
    <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '4px', height: '20px', borderRadius: '999px', background: '#7c3aed' }} />
            <span style={{ color: '#7c3aed', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Öne Çıkanlar
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', color: 'white', margin: 0 }}>
            Bu Hafta En Çok Kullanılanlar
          </h2>
        </div>
        <a href="/araclar" style={{ color: '#8b8ba0', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Tümünü Gör →
        </a>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {featuredTools.map((tool, i) => (
          <ToolCard key={tool.id} tool={tool} index={i} />
        ))}
      </div>
    </section>
  )
}

// ── Why NexanLab ──────────────────────────────────────────────────────────────

function WhySection() {
  return (
    <section style={{ padding: '80px 24px', background: '#0d0d14', borderTop: '1px solid #2a2a3a', borderBottom: '1px solid #2a2a3a', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
        opacity: 0.05, pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        {/* Left */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '4px', height: '20px', borderRadius: '999px', background: '#f59e0b' }} />
            <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Neden NexanLab?
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', color: 'white', marginBottom: '24px', lineHeight: '1.2' }}>
            AI Araçlarını Bulmak<br />
            <span style={{ color: '#7c3aed' }}>Artık Çok Kolay</span>
          </h2>
          <p style={{ color: '#8b8ba0', lineHeight: '1.7', marginBottom: '32px', fontSize: '15px' }}>
            Yüzlerce AI aracı arasında kaybolmak zorunda değilsin. NexanLab, ihtiyacına en uygun araçları bulman için tasarlandı. Küratörlü listeler, dürüst değerlendirmeler ve haftalık güncellemelerle her zaman en iyi seçeneklere ulaşırsın.
          </p>
          <a href="/araclar" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', background: '#7c3aed', color: 'white',
            borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
            boxShadow: '0 0 20px rgba(124,58,237,0.3)',
          }}>
            Araçları Keşfet →
          </a>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {trustSignals.map(({ icon, title, description }) => (
            <div key={title} style={{
              display: 'flex', gap: '16px', padding: '20px',
              borderRadius: '16px', background: '#13131a',
              border: '1px solid #2a2a3a',
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

// ── Newsletter ────────────────────────────────────────────────────────────────

function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        border: '1px solid rgba(124,58,237,0.3)',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.1), #13131a, rgba(245,158,11,0.05))',
        padding: '80px 40px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '400px', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), transparent)',
        }} />
        {/* Orb */}
        <div style={{
          position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
          opacity: 0.1, pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.1)',
            color: '#f59e0b', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>
            ✦ Haftalık AI Bülteni
          </div>

          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', color: 'white', marginBottom: '16px' }}>
            Yeni Araçları İlk Sen Öğren
          </h2>
          <p style={{ color: '#8b8ba0', maxWidth: '480px', margin: '0 auto 32px auto', lineHeight: '1.7' }}>
            Her hafta en iyi yeni AI araçlarını, ipuçlarını ve fırsatları doğrudan gelen kutuna gönderiyoruz. Spam yok, sadece değer.
          </p>

          {submitted ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
              color: '#34d399', fontWeight: '600',
            }}>
              ✦ Harika! Seni listeye ekledik.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', maxWidth: '420px', margin: '0 auto' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@adresin.com"
                style={{
                  flex: 1, height: '48px', padding: '0 16px',
                  background: '#0a0a0f', border: '1px solid #2a2a3a',
                  borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none',
                }}
              />
              <button
                onClick={() => email && setSubmitted(true)}
                style={{
                  height: '48px', padding: '0 24px',
                  background: '#7c3aed', color: 'white', border: 'none',
                  borderRadius: '12px', fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                }}
              >
                Abone Ol
              </button>
            </div>
          )}

          <p style={{ color: '#8b8ba0', fontSize: '12px', marginTop: '16px' }}>
            İstediğin zaman abonelikten çıkabilirsin. Gizliliğine saygı duyuyoruz.
          </p>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  const footerLinks = {
    Araçlar: [
      { label: 'Tüm Araçlar', href: '/araclar' },
      { label: 'Öne Çıkanlar', href: '/araclar?filter=featured' },
      { label: 'Yeni Eklenenler', href: '/araclar?filter=new' },
      { label: 'Ücretsiz Araçlar', href: '/araclar?filter=free' },
    ],
    Kategoriler: [
      { label: 'Yazı & İçerik', href: '/kategoriler/yazi' },
      { label: 'Görsel & Tasarım', href: '/kategoriler/gorsel' },
      { label: 'Video & Ses', href: '/kategoriler/video' },
      { label: 'Kod & Geliştirme', href: '/kategoriler/kod' },
    ],
    NexanLab: [
      { label: 'Hakkında', href: '/hakkinda' },
      { label: 'Blog', href: '/blog' },
      { label: 'Araç Ekle', href: '/arac-ekle' },
      { label: 'İletişim', href: '/iletisim' },
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
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
          {/* Brand */}
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
              En iyi AI araçlarını keşfet, karşılaştır ve iş akışını güçlendir. Her gün güncellenen küratörlü dizin.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['𝕏', '⌨', 'in', '✉'].map((icon, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: '#1e1e2a', border: '1px solid #2a2a3a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#8b8ba0', textDecoration: 'none', fontSize: '14px',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.color = '#8b8ba0' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 style={{ color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '16px' }}>{category}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} style={{ color: '#8b8ba0', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s ease' }}
                      onMouseEnter={(e) => e.target.style.color = 'white'}
                      onMouseLeave={(e) => e.target.style.color = '#8b8ba0'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ paddingTop: '24px', borderTop: '1px solid #2a2a3a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ color: '#8b8ba0', fontSize: '12px' }}>
            © {new Date().getFullYear()} NexanLab. Tüm hakları saklıdır.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Gizlilik Politikası', 'Kullanım Koşulları'].map((text) => (
              <a key={text} href="#" style={{ color: '#8b8ba0', fontSize: '12px', textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = '#8b8ba0'}
              >
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes scrollBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
        input::placeholder { color: #8b8ba0; }
      `}</style>
      <Header />
      <HeroSection />
      <CategoriesSection />
      <FeaturedToolsSection />
      <WhySection />
      <NewsletterSection />
      <Footer />
    </div>
  )
}