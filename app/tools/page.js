'use client'

export const metadata = {
  title: 'Discover AI Tools',
  description: 'Browse 500+ curated AI tools for writing, design, video, code and productivity.',
  alternates: { canonical: '/tools' },
}

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const categories = [
  'All',
  'Chatbots',
  'Writing & Content',
  'Image & Design',
  'Video',
  'Code',
  'Productivity',
  'Audio & Music',
]

export default function ToolsPage() {
  const [tools, setTools] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTools()
  }, [])

  useEffect(() => {
    let result = tools

    if (activeCategory !== 'All') {
      result = result.filter(t => t.category === activeCategory)
    }

    if (search.trim()) {
      result = result.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFiltered(result)
  }, [activeCategory, search, tools])

  async function fetchTools() {
    const { data } = await supabase
      .from('tools')
      .select('*')
      .order('rating', { ascending: false })
    if (data) {
      setTools(data)
      setFiltered(data)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #8b8ba0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
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
          <Link href="/" style={{ color: '#8b8ba0', fontSize: '14px', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)',
            color: '#a78bfa', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>
            ✦ {tools.length}+ AI Tools
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            Discover AI Tools
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '18px', maxWidth: '500px', margin: '0 auto' }}>
            Find the best AI tools to supercharge your workflow.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '560px', margin: '0 auto 40px auto' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#8b8ba0' }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            style={{
              width: '100%', height: '52px', paddingLeft: '46px', paddingRight: '16px',
              background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '14px',
              color: 'white', fontSize: '15px', outline: 'none',
            }}
          />
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '48px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px', borderRadius: '999px',
                fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: activeCategory === cat ? '1px solid #7c3aed' : '1px solid #2a2a3a',
                background: activeCategory === cat ? '#7c3aed' : '#13131a',
                color: activeCategory === cat ? 'white' : '#8b8ba0',
                boxShadow: activeCategory === cat ? '0 0 15px rgba(124,58,237,0.4)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ color: '#8b8ba0', fontSize: '14px', marginBottom: '24px' }}>
          {filtered.length} tools found
          {activeCategory !== 'All' && <span style={{ color: '#a78bfa', marginLeft: '8px' }}>in {activeCategory}</span>}
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#8b8ba0' }}>
            Loading tools...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ color: '#8b8ba0', fontSize: '18px' }}>No tools found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function ToolCard({ tool }) {
  const [hovered, setHovered] = useState(false)

  const accentColor = tool.accent_color || '#7c3aed'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: '#13131a',
        border: `1px solid ${hovered ? accentColor + '50' : '#2a2a3a'}`,
        borderRadius: '16px', padding: '24px',
        cursor: 'pointer', transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 40px ${accentColor}20` : 'none',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        minHeight: '180px',
      }}
    >
      {/* Top glow */}
      <div style={{
        position: 'absolute', top: 0, left: '24px', right: '24px', height: '1px',
        background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease',
      }} />

      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            {tool.badge && (
              <span style={{
                fontSize: '11px', fontWeight: '600', padding: '3px 10px',
                borderRadius: '999px', whiteSpace: 'nowrap',
                border: `1px solid ${accentColor}40`,
                background: `${accentColor}15`, color: accentColor,
              }}>
                {tool.badge}
              </span>
            )}
            {tool.is_free && (
              <span style={{
                fontSize: '10px', fontWeight: '600', padding: '2px 8px',
                borderRadius: '999px',
                border: '1px solid rgba(16,185,129,0.4)',
                background: 'rgba(16,185,129,0.1)', color: '#34d399',
              }}>
                Free
              </span>
            )}
          </div>
        </div>

        <p style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
          {tool.description}
        </p>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '2px' }}>
            {[1,2,3,4,5].map((i) => (
              <span key={i} style={{ fontSize: '11px', color: i <= Math.round(tool.rating) ? '#f59e0b' : '#2a2a3a' }}>★</span>
            ))}
            <span style={{ fontSize: '11px', color: '#8b8ba0', marginLeft: '4px' }}>{tool.rating}</span>
          </div>
          <div style={{ color: '#8b8ba0', fontSize: '11px' }}>
            {tool.review_count?.toLocaleString()} reviews
          </div>
        </div>
        <a
          href={tool.url.startsWith('http') ? tool.url : tool.url}
          target={tool.url.startsWith('http') ? '_blank' : '_self'}
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: '600', padding: '6px 14px',
            borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s ease',
            border: `1px solid ${accentColor}40`,
            background: `${accentColor}10`, color: accentColor,
          }}
        >
          {tool.url.startsWith('http') ? 'Visit ↗' : 'Try it →'}
        </a>
      </div>
    </div>
  )
}