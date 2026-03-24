'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import Header from '@/app/components/Header'

const categoryIcons = {
  'Chatbots': '💬',
  'Writing & Content': '✍️',
  'Image & Design': '🎨',
  'Video': '🎬',
  'Code': '💻',
  'Productivity': '🧠',
  'Audio & Music': '🎵',
  'Analytics': '📊',
}

const categoryColors = {
  'Chatbots': '#10b981',
  'Writing & Content': '#7c3aed',
  'Image & Design': '#ec4899',
  'Video': '#f59e0b',
  'Code': '#3b82f6',
  'Productivity': '#8b5cf6',
  'Audio & Music': '#06b6d4',
  'Analytics': '#f97316',
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('tools').select('category')

      if (data) {
        const counts = {}
        data.forEach(({ category }) => {
          if (category) counts[category] = (counts[category] || 0) + 1
        })
        const list = Object.entries(counts).map(([name, count]) => ({ name, count }))
        setCategories(list.sort((a, b) => b.count - a.count))
      }
      setLoading(false)
    }
    fetchCategories()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <Header />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)',
            color: '#a78bfa', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>
            ✦ {categories.length} Categories
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            Browse by Category
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '18px', maxWidth: '480px', margin: '0 auto' }}>
            Find the perfect AI tool for your specific needs.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#8b8ba0' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {categories.map(({ name, count }) => {
              const color = categoryColors[name] || '#7c3aed'
              const icon = categoryIcons[name] || '🛠'
              return (
                <Link
                  key={name}
                  href={`/tools?category=${encodeURIComponent(name)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: '#13131a', border: `1px solid ${color}30`,
                    borderRadius: '16px', padding: '28px',
                    transition: 'all 0.2s ease', cursor: 'pointer',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = `0 20px 40px ${color}20`
                      e.currentTarget.style.borderColor = `${color}60`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.borderColor = `${color}30`
                    }}
                  >
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '14px',
                      background: `${color}20`, border: `1px solid ${color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px', marginBottom: '16px',
                    }}>
                      {icon}
                    </div>
                    <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{name}</h3>
                    <p style={{ color: '#8b8ba0', fontSize: '13px' }}>
                      {count} {count === 1 ? 'tool' : 'tools'} available
                    </p>
                    <div style={{
                      marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px',
                      fontSize: '12px', fontWeight: '600', color,
                    }}>
                      Browse tools →
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}