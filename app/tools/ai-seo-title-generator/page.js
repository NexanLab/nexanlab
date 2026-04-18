'use client'

import { useState, useEffect, useRef } from 'react'
import ToolSeoSection from '@/app/components/ToolSeoSection'
import { useScrollToResult } from '@/hooks/useScrollToResult'
import RateLimitError from '@/app/components/RateLimitError'
import { useFormPersist } from '@/hooks/useFormPersist'

// ─────────────────────────────────────────────
// HISTORY HOOK — localStorage, max 20 session
// ─────────────────────────────────────────────
const HISTORY_KEY = 'nexanlab-seo-title-history'
const HISTORY_MAX = 20

function useHistory() {
  const [history, setHistory] = useState([])

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (raw) setHistory(JSON.parse(raw))
    } catch {}
  }, [])

  function saveSession(keyword, titles, mode) {
    if (!titles?.length || !keyword?.trim()) return
    const entry = {
      id: Date.now(),
      keyword: keyword.trim(),
      titles,
      mode,
      date: new Date().toISOString(),
    }
    setHistory(prev => {
      const filtered = prev.filter(h => h.keyword !== keyword.trim()) // remove duplicate keyword
      const updated = [entry, ...filtered].slice(0, HISTORY_MAX)
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  function deleteEntry(id) {
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id)
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  function clearAll() {
    setHistory([])
    try { localStorage.removeItem(HISTORY_KEY) } catch {}
  }

  return { history, saveSession, deleteEntry, clearAll }
}

// ─────────────────────────────────────────────
// HISTORY PANEL component
// ─────────────────────────────────────────────
function HistoryPanel({ history, onLoad, onDelete, onClear }) {
  const [open, setOpen] = useState(false)

  if (!history.length) return null

  function formatDate(iso) {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now - d
    const diffMin = Math.floor(diffMs / 60000)
    const diffHr = Math.floor(diffMs / 3600000)
    const diffDay = Math.floor(diffMs / 86400000)
    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHr < 24) return `${diffHr}h ago`
    if (diffDay === 1) return 'Yesterday'
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div style={{ marginBottom: '24px', borderRadius: '16px', background: '#13131a', border: '1px solid #2a2a3a', overflow: 'hidden' }}>
      {/* Toggle header */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px' }}>🕐</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>History</span>
          <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}>
            {history.length}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#8b8ba0' }}>{open ? '▲ Hide' : '▼ Show'}</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #2a2a3a' }}>
          {/* Clear all */}
          <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #1a1a28' }}>
            <button
              onClick={onClear}
              style={{ fontSize: '11px', color: '#8b8ba0', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 8px', borderRadius: '6px' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = '#8b8ba0'}
            >
              🗑 Clear all
            </button>
          </div>

          {/* Entries */}
          <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {history.map(entry => {
              const scores = entry.titles.map(t => scoreTitle(t, entry.keyword).total)
              const best = scores.length ? Math.max(...scores) : 0
              return (
                <div
                  key={entry.id}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: '#0a0a0f', border: '1px solid #2a2a3a', transition: 'border-color 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a3a'}
                >
                  {/* Keyword + meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span style={{ color: 'white', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entry.keyword}
                      </span>
                      {entry.mode === 'competitor' && (
                        <span style={{ fontSize: '9px', fontWeight: '600', padding: '1px 5px', borderRadius: '4px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)', flexShrink: 0 }}>
                          🏆 Competitor
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#8b8ba0' }}>{entry.titles.length} titles</span>
                      <span style={{ fontSize: '10px', color: '#8b8ba0' }}>·</span>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: getScoreColor(best) }}>Best: {best}</span>
                      <span style={{ fontSize: '10px', color: '#8b8ba0' }}>·</span>
                      <span style={{ fontSize: '11px', color: '#8b8ba0' }}>{formatDate(entry.date)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                    <button
                      onClick={() => onLoad(entry)}
                      style={{ padding: '5px 12px', borderRadius: '7px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.22)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.12)'}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      style={{ padding: '5px 8px', borderRadius: '7px', fontSize: '11px', cursor: 'pointer', background: 'transparent', border: '1px solid #2a2a3a', color: '#8b8ba0', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#f87171' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.color = '#8b8ba0' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// PIXEL MEASUREMENT
// ─────────────────────────────────────────────
function measureTextWidth(text, font = '20px Arial') {
  if (typeof window === 'undefined') return 0
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = font
  return ctx.measureText(text).width
}

const GOOGLE_TITLE_FONT = 'bold 20px Arial'
const GOOGLE_TITLE_MAX_PX = 600
const GOOGLE_TITLE_MAX_PX_MOBILE = 360

function getTitleStatus(title) {
  const px = measureTextWidth(title, GOOGLE_TITLE_FONT)
  if (px > GOOGLE_TITLE_MAX_PX) return { status: 'over', color: '#ef4444', label: 'Too long', px: Math.round(px) }
  if (px < 300) return { status: 'short', color: '#f59e0b', label: 'Too short', px: Math.round(px) }
  return { status: 'ideal', color: '#10b981', label: 'Ideal', px: Math.round(px) }
}

function truncateToPixels(text, maxPx, font) {
  if (typeof window === 'undefined') return text
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = font
  const ellipsis = '...'
  const ellipsisWidth = ctx.measureText(ellipsis).width
  if (ctx.measureText(text).width <= maxPx) return text
  let truncated = ''
  for (let i = 0; i < text.length; i++) {
    const test = text.slice(0, i + 1)
    if (ctx.measureText(test).width + ellipsisWidth > maxPx) return truncated + ellipsis
    truncated = test
  }
  return truncated + ellipsis
}

// ─────────────────────────────────────────────
// META DESCRIPTION HELPERS
// 155-160 char ideal, Google description karakter sayar (px değil)
// ─────────────────────────────────────────────
const DESC_MIN = 120
const DESC_MAX = 160

function getDescStatus(desc) {
  const len = desc.length
  if (len > DESC_MAX) return { status: 'over', color: '#ef4444', label: 'Too long' }
  if (len < DESC_MIN) return { status: 'short', color: '#f59e0b', label: 'Too short' }
  return { status: 'ideal', color: '#10b981', label: 'Ideal' }
}

// ─────────────────────────────────────────────
// TITLE SCORING ENGINE
// ─────────────────────────────────────────────
const POWER_WORDS = [
  'ultimate', 'best', 'top', 'proven', 'secret', 'free', 'new', 'easy', 'fast',
  'simple', 'complete', 'essential', 'expert', 'advanced', 'powerful', 'effective',
  'amazing', 'incredible', 'guaranteed', 'definitive', 'comprehensive', 'step-by-step',
  'beginner', 'professional', 'official', 'exclusive', 'instant', 'quick', 'smart',
]
const QUESTION_WORDS = ['how', 'what', 'why', 'when', 'where', 'which', 'who', 'is', 'are', 'can', 'does', 'do', 'will']

function scoreTitle(title, keyword) {
  const lower = title.toLowerCase()
  const words = lower.split(/\s+/)
  const kwLower = keyword.toLowerCase().trim()
  const hasKeyword = kwLower.length > 0 && lower.includes(kwLower)
  const foundPowerWords = POWER_WORDS.filter(pw => lower.includes(pw))
  const hasPowerWord = foundPowerWords.length > 0
  const hasNumber = /\d+/.test(title)
  const isQuestion = QUESTION_WORDS.includes(words[0]) || title.endsWith('?')
  const px = measureTextWidth(title, GOOGLE_TITLE_FONT)
  let lengthScore = 0
  if (px >= 300 && px <= 600) lengthScore = 20
  else if (px >= 200 && px < 300) lengthScore = 10
  else if (px > 600 && px <= 680) lengthScore = 8
  else if (px < 200) lengthScore = 5

  return {
    total: (hasKeyword ? 25 : 0) + (hasPowerWord ? 20 : 0) + (hasNumber ? 20 : 0) + (isQuestion ? 15 : 0) + lengthScore,
    criteria: [
      { id: 'keyword', label: 'Keyword', description: hasKeyword ? `"${kwLower}" found` : kwLower ? `"${kwLower}" missing` : 'No keyword', passed: hasKeyword, score: hasKeyword ? 25 : 0, max: 25, tip: 'Include your main keyword naturally near the beginning.' },
      { id: 'power', label: 'Power Word', description: hasPowerWord ? `"${foundPowerWords[0]}"` : 'None found', passed: hasPowerWord, score: hasPowerWord ? 20 : 0, max: 20, tip: 'Words like "best", "ultimate", "proven" boost click-through rates.' },
      { id: 'number', label: 'Number', description: hasNumber ? 'Contains a number' : 'No number', passed: hasNumber, score: hasNumber ? 20 : 0, max: 20, tip: 'Titles with numbers get ~36% more clicks on average.' },
      { id: 'question', label: 'Question', description: isQuestion ? 'Question format' : 'Not a question', passed: isQuestion, score: isQuestion ? 15 : 0, max: 15, tip: '"How to" and "What is" titles rank well for featured snippets.' },
      { id: 'length', label: 'Length', description: `${Math.round(px)}px / 600px`, passed: lengthScore >= 20, score: lengthScore, max: 20, tip: 'Google shows titles up to ~600px wide. Ideal range: 300–600px.' },
    ],
  }
}

function getScoreColor(score) {
  if (score >= 80) return '#10b981'
  if (score >= 55) return '#f59e0b'
  return '#ef4444'
}
function getScoreLabel(score) {
  if (score >= 80) return 'Strong'
  if (score >= 55) return 'Average'
  return 'Weak'
}

// ─────────────────────────────────────────────
// SCORE PANEL
// ─────────────────────────────────────────────
function ScorePanel({ scoring }) {
  const [activeTip, setActiveTip] = useState(null)
  return (
    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1e1e2e' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ color: '#8b8ba0', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SEO Score Breakdown</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '80px', height: '4px', borderRadius: '999px', background: '#2a2a3a', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '999px', width: `${scoring.total}%`, background: getScoreColor(scoring.total), transition: 'width 0.6s ease' }} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '800', color: getScoreColor(scoring.total) }}>{scoring.total}/100</span>
          <span style={{ fontSize: '10px', fontWeight: '600', color: getScoreColor(scoring.total), padding: '1px 6px', borderRadius: '4px', background: getScoreColor(scoring.total) + '15' }}>{getScoreLabel(scoring.total)}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {scoring.criteria.map((c) => (
          <button key={c.id} onClick={() => setActiveTip(activeTip === c.id ? null : c.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '999px', cursor: 'pointer', border: `1px solid ${c.passed ? '#10b98130' : '#ef444430'}`, background: c.passed ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', transition: 'opacity 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <span style={{ fontSize: '10px', color: c.passed ? '#34d399' : '#f87171' }}>{c.passed ? '✓' : '✗'}</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: c.passed ? '#34d399' : '#f87171' }}>{c.label}</span>
            <span style={{ fontSize: '10px', color: '#8b8ba0' }}>· {c.description}</span>
            <span style={{ fontSize: '10px', fontWeight: '700', color: c.passed ? '#34d399' : '#f87171', marginLeft: '2px' }}>+{c.score}</span>
          </button>
        ))}
      </div>
      {activeTip && (
        <div style={{ marginTop: '8px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', fontSize: '12px', color: '#a78bfa', lineHeight: '1.5' }}>
          💡 {scoring.criteria.find(c => c.id === activeTip)?.tip}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// META DESCRIPTION PANEL
// Her title kartı içinde — API ile üretilir, düzenlenebilir
// ─────────────────────────────────────────────
function MetaDescriptionPanel({ title, keyword, pageUrl, onDescChange }) {
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus()
  }, [isEditing])

  // Notify parent (TitleCard) whenever desc changes so SERP preview is always up to date
  useEffect(() => { onDescChange?.(desc) }, [desc])

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-meta-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, keyword, pageUrl }),
      })
      const data = await res.json()
      if (data.description) setDesc(data.description)
    } catch {}
    setLoading(false)
  }

  async function copy() {
    if (!desc) return
    await navigator.clipboard.writeText(desc)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const descStatus = desc ? getDescStatus(desc) : null
  const charCount = desc.length

  return (
    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1e1e2e' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: '#8b8ba0', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Meta Description
        </span>
        {!desc && (
          <button onClick={generate} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', transition: 'all 0.15s ease' }}
            onMouseEnter={e => !loading && (e.currentTarget.style.background = 'rgba(124,58,237,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.12)')}
          >
            {loading
              ? <><span style={{ display: 'inline-block', width: '10px', height: '10px', border: '2px solid #a78bfa40', borderTop: '2px solid #a78bfa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Generating...</>
              : <>✦ Generate Description</>
            }
          </button>
        )}
        {desc && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {descStatus && (
              <span style={{ fontSize: '10px', fontWeight: '700', color: descStatus.color, padding: '2px 7px', borderRadius: '999px', background: descStatus.color + '12', border: `1px solid ${descStatus.color}28` }}>
                {charCount}/{DESC_MAX} · {descStatus.label}
              </span>
            )}
            <button onClick={() => { setIsEditing(v => !v) }} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: isEditing ? 'rgba(124,58,237,0.15)' : '#13131a', border: '1px solid #2a2a3a', color: isEditing ? '#a78bfa' : '#8b8ba0' }}>
              {isEditing ? 'Done' : '✏ Edit'}
            </button>
            <button onClick={copy} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: copied ? 'rgba(16,185,129,0.12)' : '#13131a', border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid #2a2a3a', color: copied ? '#34d399' : '#8b8ba0' }}>
              {copied ? '✓' : '📋'}
            </button>
            <button onClick={generate} disabled={loading} title="Regenerate" style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', background: '#13131a', border: '1px solid #2a2a3a', color: '#8b8ba0' }}>
              🔄
            </button>
          </div>
        )}
      </div>

      {desc && (
        <>
          {isEditing ? (
            <div style={{ position: 'relative' }}>
              <textarea
                ref={inputRef}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '10px 12px', background: '#13131a', border: `1px solid ${descStatus?.color || '#2a2a3a'}40`, borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none', resize: 'none', lineHeight: '1.6', fontFamily: 'inherit' }}
              />
              {/* Live char bar */}
              <div style={{ marginTop: '4px' }}>
                <div style={{ height: '2px', borderRadius: '999px', background: '#2a2a3a', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '999px', width: `${Math.min((charCount / DESC_MAX) * 100, 100)}%`, background: descStatus?.color || '#8b8ba0', transition: 'width 0.2s ease, background 0.2s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                  <span style={{ fontSize: '10px', color: '#8b8ba0' }}>{DESC_MIN} min ideal</span>
                  <span style={{ fontSize: '10px', fontWeight: '600', color: descStatus?.color || '#8b8ba0' }}>{charCount} / {DESC_MAX}</span>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.6', cursor: 'text' }} onClick={() => setIsEditing(true)}>
              {desc}
            </p>
          )}
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// SERP PREVIEW MODAL — title + description birlikte göster
// ─────────────────────────────────────────────
function SerpPreviewModal({ title, description, url, onClose }) {
  const [isMobile, setIsMobile] = useState(false)
  const [animIn, setAnimIn] = useState(false)
  useEffect(() => {
    setTimeout(() => setAnimIn(true), 10)
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const maxPx = isMobile ? GOOGLE_TITLE_MAX_PX_MOBILE : GOOGLE_TITLE_MAX_PX
  const font = isMobile ? 'bold 18px Arial' : GOOGLE_TITLE_FONT
  const displayTitle = truncateToPixels(title, maxPx, font)
  const titleStatus = getTitleStatus(title)
  const px = measureTextWidth(title, GOOGLE_TITLE_FONT)
  const pxPercent = Math.min((px / GOOGLE_TITLE_MAX_PX) * 100, 100)
  const displayUrl = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'www.yourwebsite.com › page'
  const displayDesc = description || 'This is how your meta description will appear in Google search results. Make it compelling and around 150–160 characters for best results.'

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', opacity: animIn ? 1 : 0, transition: 'opacity 0.2s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '720px', background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '20px', overflow: 'hidden', transform: animIn ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)', transition: 'transform 0.25s ease' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #2a2a3a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '4px 12px', borderRadius: '999px', background: 'rgba(66,133,244,0.15)', border: '1px solid rgba(66,133,244,0.3)', color: '#4285f4', fontSize: '12px', fontWeight: '700' }}>Google SERP Preview</div>
            <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a3a' }}>
              {[{ label: '🖥 Desktop', val: false }, { label: '📱 Mobile', val: true }].map(({ label, val }) => (
                <button key={label} onClick={() => setIsMobile(val)} style={{ padding: '5px 14px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', border: 'none', background: isMobile === val ? '#7c3aed' : '#0a0a0f', color: isMobile === val ? 'white' : '#8b8ba0' }}>{label}</button>
              ))}
            </div>
          </div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0a0a0f', border: '1px solid #2a2a3a', color: '#8b8ba0', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Google preview */}
        <div style={{ padding: '24px', background: '#f8f9fa' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: isMobile ? '16px' : '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.12)', maxWidth: isMobile ? '400px' : '100%', margin: isMobile ? '0 auto' : '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#f1f3f4', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>🌐</div>
              <div>
                <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#202124', fontFamily: 'Arial, sans-serif' }}>{displayUrl.split('›')[0].trim()}</div>
                <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#4d5156', fontFamily: 'Arial, sans-serif' }}>{displayUrl}</div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#5f6368', fontSize: '18px' }}>⋮</div>
            </div>
            <div style={{ fontSize: isMobile ? '18px' : '20px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1a0dab', lineHeight: '1.3', marginBottom: '4px' }}>{displayTitle}</div>
            <div style={{ fontSize: isMobile ? '13px' : '14px', color: '#4d5156', fontFamily: 'Arial, sans-serif', lineHeight: '1.58', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {displayDesc}
            </div>
          </div>
          {description && (
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.2)' }}>
                ✓ Showing your generated meta description
              </span>
            </div>
          )}
        </div>

        {/* Pixel meter */}
        <div style={{ padding: '16px 24px 20px', borderTop: '1px solid #2a2a3a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#8b8ba0', fontSize: '12px' }}>Title pixel width:</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: titleStatus.color, padding: '2px 8px', borderRadius: '999px', background: titleStatus.color + '15', border: `1px solid ${titleStatus.color}30` }}>{titleStatus.px}px / 600px</span>
              <span style={{ fontSize: '11px', fontWeight: '600', color: titleStatus.color }}>{titleStatus.label}</span>
            </div>
            <span style={{ color: '#8b8ba0', fontSize: '11px' }}>{title.length} chars</span>
          </div>
          <div style={{ height: '6px', borderRadius: '999px', background: '#2a2a3a', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '999px', width: `${pxPercent}%`, background: titleStatus.status === 'over' ? 'linear-gradient(90deg, #10b981, #ef4444)' : titleStatus.status === 'short' ? '#f59e0b' : '#10b981', transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '10px', color: '#8b8ba0' }}>0px</span>
            <span style={{ fontSize: '10px', color: '#8b8ba0' }}>300px (min ideal)</span>
            <span style={{ fontSize: '10px', color: '#8b8ba0' }}>600px (max)</span>
          </div>
          {titleStatus.status === 'over' && (
            <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '12px' }}>
              ⚠ Google will truncate this title. The preview above shows what users will see.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// INLINE SERP
// ─────────────────────────────────────────────
function InlineSerp({ title, description, url }) {
  const displayUrl = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'www.yourwebsite.com'
  const displayTitle = truncateToPixels(title, GOOGLE_TITLE_MAX_PX, GOOGLE_TITLE_FONT)
  const isTruncated = displayTitle !== title
  const displayDesc = description || 'Your meta description will appear here once generated...'
  return (
    <div style={{ background: 'white', borderRadius: '8px', padding: '10px 14px', border: '1px solid #e0e0e0', marginTop: '10px' }}>
      <div style={{ fontSize: '11px', color: '#4d5156', fontFamily: 'Arial, sans-serif', marginBottom: '3px' }}>🌐 {displayUrl}</div>
      <div style={{ fontSize: '16px', color: '#1a0dab', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', lineHeight: '1.3', marginBottom: '3px' }}>
        {displayTitle}
        {isTruncated && <span style={{ color: '#ef4444', fontSize: '10px', marginLeft: '6px', fontFamily: 'system-ui' }}>truncated</span>}
      </div>
      <div style={{ fontSize: '12px', color: '#4d5156', fontFamily: 'Arial, sans-serif', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontStyle: description ? 'normal' : 'italic', opacity: description ? 1 : 0.5 }}>
        {displayDesc}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// TITLE CARD — inline edit + meta description
// ─────────────────────────────────────────────
function TitleCard({ title: initialTitle, keyword, index, copiedIndex, onCopy, onPreview, previewUrl, showInlineSerp }) {
  // Inline edit state
  const [title, setTitle] = useState(initialTitle)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(initialTitle)
  const editRef = useRef(null)

  // Panel state
  const [showScore, setShowScore] = useState(false)
  const [showMeta, setShowMeta] = useState(false)
  const [metaDesc, setMetaDesc] = useState('') // lifted up so SERP preview can access it

  // Computed
  const status = getTitleStatus(title)
  const px = measureTextWidth(title, GOOGLE_TITLE_FONT)
  const pxPercent = Math.min((px / GOOGLE_TITLE_MAX_PX) * 100, 100)
  const scoring = scoreTitle(title, keyword)

  // Edit mode
  function startEdit() {
    setEditValue(title)
    setIsEditing(true)
    setTimeout(() => editRef.current?.focus(), 10)
  }
  function commitEdit() {
    if (editValue.trim()) setTitle(editValue.trim())
    setIsEditing(false)
  }
  function cancelEdit() {
    setEditValue(title)
    setIsEditing(false)
  }

  // Live status while editing
  const editStatus = getTitleStatus(editValue)
  const editPx = measureTextWidth(editValue, GOOGLE_TITLE_FONT)
  const editPxPercent = Math.min((editPx / GOOGLE_TITLE_MAX_PX) * 100, 100)
  const editScoring = scoreTitle(editValue, keyword)

  return (
    <div style={{ padding: '16px 20px', borderRadius: '14px', background: '#0a0a0f', border: `1px solid ${isEditing ? '#7c3aed50' : status.color + '20'}`, transition: 'border-color 0.2s ease' }}
      onMouseEnter={e => { if (!isEditing) e.currentTarget.style.borderColor = status.color + '50' }}
      onMouseLeave={e => { if (!isEditing) e.currentTarget.style.borderColor = status.color + '20' }}
    >
      {/* Row: index + title + actions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Index */}
        <div style={{ width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0, background: '#13131a', border: '1px solid #2a2a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#8b8ba0', marginTop: isEditing ? '10px' : '2px' }}>{index + 1}</div>

        {/* Title — normal or edit mode */}
        {isEditing ? (
          <div style={{ flex: 1 }}>
            <input
              ref={editRef}
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') cancelEdit() }}
              style={{ width: '100%', padding: '6px 10px', background: '#13131a', border: `1px solid ${editStatus.color}60`, borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none', lineHeight: '1.5' }}
            />
            {/* Live pixel bar while editing */}
            <div style={{ marginTop: '6px' }}>
              <div style={{ height: '2px', borderRadius: '999px', background: '#2a2a3a', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '999px', width: `${editPxPercent}%`, background: editStatus.status === 'over' ? 'linear-gradient(90deg, #10b981 60%, #ef4444)' : editStatus.color, transition: 'width 0.1s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                <span style={{ fontSize: '10px', color: editStatus.color, fontWeight: '600' }}>{editStatus.label} · {Math.round(editPx)}px</span>
                <span style={{ fontSize: '10px', color: getScoreColor(editScoring.total), fontWeight: '700' }}>Score: {editScoring.total}/100</span>
              </div>
            </div>
            {/* Edit actions */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              <button onClick={commitEdit} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', background: '#10b981', border: 'none', color: 'white' }}>Save ↵</button>
              <button onClick={cancelEdit} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: 'transparent', border: '1px solid #2a2a3a', color: '#8b8ba0' }}>Cancel</button>
              <span style={{ fontSize: '10px', color: '#8b8ba0', alignSelf: 'center', marginLeft: '2px' }}>ESC to cancel · Enter to save</span>
            </div>
          </div>
        ) : (
          <p
            onClick={startEdit}
            title="Click to edit"
            style={{ color: 'white', fontSize: '14px', lineHeight: '1.5', flex: 1, cursor: 'text' }}
          >
            {title}
          </p>
        )}

        {/* Action buttons — hide during edit */}
        {!isEditing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
            {/* Score badge */}
            <button onClick={() => setShowScore(v => !v)} title="SEO score breakdown" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '999px', cursor: 'pointer', background: getScoreColor(scoring.total) + '15', border: `1px solid ${getScoreColor(scoring.total)}30`, transition: 'opacity 0.15s ease' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getScoreColor(scoring.total) }} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: getScoreColor(scoring.total) }}>{scoring.total}</span>
              <span style={{ fontSize: '9px', color: '#8b8ba0' }}>{showScore ? '▲' : '▼'}</span>
            </button>
            {/* Pixel badge */}
            <span style={{ fontSize: '11px', fontWeight: '700', color: status.color, padding: '3px 8px', borderRadius: '999px', background: `${status.color}15`, border: `1px solid ${status.color}30`, whiteSpace: 'nowrap' }}>{Math.round(px)}px</span>
            {/* Edit button */}
            <button onClick={startEdit} title="Edit title" style={{ padding: '5px 8px', borderRadius: '7px', fontSize: '11px', cursor: 'pointer', background: '#13131a', border: '1px solid #2a2a3a', color: '#8b8ba0', transition: 'all 0.15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.color = '#a78bfa' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.color = '#8b8ba0' }}
            >✏</button>
            {/* SERP Preview */}
            <button onClick={() => onPreview(title, metaDesc)} title="Google SERP Preview" style={{ padding: '5px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: 'rgba(66,133,244,0.1)', border: '1px solid rgba(66,133,244,0.25)', color: '#4285f4' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(66,133,244,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(66,133,244,0.1)'}
            >🔍</button>
            {/* Copy */}
            <button onClick={() => onCopy(title, index)} style={{ padding: '5px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: copiedIndex === index ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)', border: copiedIndex === index ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(124,58,237,0.3)', color: copiedIndex === index ? '#34d399' : '#a78bfa' }}>
              {copiedIndex === index ? '✓' : '📋'}
            </button>
          </div>
        )}
      </div>

      {/* Pixel bar — hide during edit (shown inline above) */}
      {!isEditing && (
        <div style={{ marginTop: '10px', paddingLeft: '36px' }}>
          <div style={{ height: '3px', borderRadius: '999px', background: '#2a2a3a', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '999px', width: `${pxPercent}%`, background: status.status === 'over' ? 'linear-gradient(90deg, #10b981 60%, #ef4444)' : status.color, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
            <span style={{ fontSize: '10px', color: status.color, fontWeight: '600' }}>{status.label}</span>
            <span style={{ fontSize: '10px', color: '#8b8ba0' }}>{title.length} chars</span>
          </div>
        </div>
      )}

      {/* Expandable panels */}
      <div style={{ paddingLeft: '36px' }}>
        {showScore && <ScorePanel scoring={scoring} />}

        {/* Meta description toggle button */}
        {!isEditing && (
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={() => setShowMeta(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: showMeta ? 'rgba(124,58,237,0.1)' : 'transparent', border: showMeta ? '1px solid rgba(124,58,237,0.25)' : '1px solid transparent', color: showMeta ? '#a78bfa' : '#8b8ba0', transition: 'all 0.15s ease' }}
            >
              <span>{showMeta ? '▲' : '▼'}</span>
              <span>Meta Description</span>
              {metaDesc && <span style={{ fontSize: '9px', background: '#10b98120', color: '#34d399', padding: '1px 5px', borderRadius: '4px', border: '1px solid #10b98130' }}>✓ Generated</span>}
            </button>
          </div>
        )}

        {showMeta && !isEditing && (
          <MetaDescriptionPanel
            title={title}
            keyword={keyword}
            pageUrl={previewUrl}
            onDescChange={setMetaDesc}
          />
        )}

        {showInlineSerp && !isEditing && (
          <InlineSerp title={title} description={metaDesc} url={previewUrl} />
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// COMPETITOR PANEL
// ─────────────────────────────────────────────
function CompetitorPanel({ titles }) {
  const [open, setOpen] = useState(false)
  if (!titles?.length) return null
  return (
    <div style={{ marginBottom: '16px', borderRadius: '14px', background: '#0a0a0f', border: '1px solid rgba(245,158,11,0.2)', overflow: 'hidden' }}>
      <button onClick={() => setOpen(v => !v)} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🏆</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#f59e0b' }}>Current Google Top {titles.length} — Titles Your AI Beat</span>
        </div>
        <span style={{ fontSize: '11px', color: '#8b8ba0' }}>{open ? '▲ Hide' : '▼ Show'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {titles.map((t, i) => {
              const st = getTitleStatus(t)
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', background: '#13131a', border: '1px solid #2a2a3a' }}>
                  <span style={{ fontSize: '10px', color: '#8b8ba0', fontWeight: '700', minWidth: '16px' }}>#{i + 1}</span>
                  <span style={{ fontSize: '13px', color: '#8b8ba0', flex: 1 }}>{t}</span>
                  <span style={{ fontSize: '10px', color: st.color, padding: '1px 6px', borderRadius: '999px', background: st.color + '10', border: `1px solid ${st.color}20`, whiteSpace: 'nowrap' }}>{st.px}px</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// RESULTS BLOCK
// ─────────────────────────────────────────────
function ResultsBlock({ titles, keyword, competitorTitles, previewUrl, resultRef }) {
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [showInlineSerps, setShowInlineSerps] = useState(false)
  const [previewData, setPreviewData] = useState(null) // {title, description}

  async function copyTitle(title, index) {
    await navigator.clipboard.writeText(title)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }
  async function copyAll() {
    await navigator.clipboard.writeText(titles.join('\n'))
    setCopiedIndex('all')
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const titleStats = titles.map(t => getTitleStatus(t))
  const scores = titles.map(t => scoreTitle(t, keyword).total)
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const bestScore = scores.length ? Math.max(...scores) : 0
  const idealCount = titleStats.filter(s => s.status === 'ideal').length
  const overCount = titleStats.filter(s => s.status === 'over').length
  const shortCount = titleStats.filter(s => s.status === 'short').length

  return (
    <>
      {previewData && (
        <SerpPreviewModal
          title={previewData.title}
          description={previewData.description}
          url={previewUrl}
          onClose={() => setPreviewData(null)}
        />
      )}
      <div ref={resultRef} style={{ background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>🎯 {titles.length} Titles for "{keyword}"</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '999px', background: getScoreColor(avgScore) + '10', border: `1px solid ${getScoreColor(avgScore)}25` }}>
                <span style={{ fontSize: '11px', color: '#8b8ba0' }}>Avg:</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: getScoreColor(avgScore) }}>{avgScore}/100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '999px', background: getScoreColor(bestScore) + '10', border: `1px solid ${getScoreColor(bestScore)}25` }}>
                <span style={{ fontSize: '11px', color: '#8b8ba0' }}>Best:</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: getScoreColor(bestScore) }}>{bestScore}/100</span>
              </div>
              {idealCount > 0 && <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>✓ {idealCount} ideal</span>}
              {shortCount > 0 && <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b' }}>↑ {shortCount} short</span>}
              {overCount > 0 && <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>✕ {overCount} truncated</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => setShowInlineSerps(v => !v)} style={{ padding: '7px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: showInlineSerps ? 'rgba(66,133,244,0.2)' : 'rgba(66,133,244,0.1)', border: showInlineSerps ? '1px solid rgba(66,133,244,0.4)' : '1px solid rgba(66,133,244,0.25)', color: '#4285f4' }}>
              {showInlineSerps ? '🔍 Hide' : '🔍 Previews'}
            </button>
            <button onClick={copyAll} style={{ padding: '7px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: copiedIndex === 'all' ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)', border: copiedIndex === 'all' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(124,58,237,0.3)', color: copiedIndex === 'all' ? '#34d399' : '#a78bfa' }}>
              {copiedIndex === 'all' ? '✓ Copied' : '📋 Copy All'}
            </button>
          </div>
        </div>

        <CompetitorPanel titles={competitorTitles} />

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
          {[{ color: '#f59e0b', label: 'Too short' }, { color: '#10b981', label: 'Ideal' }, { color: '#ef4444', label: 'Truncated' }].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color }} />
              <span style={{ color: '#8b8ba0', fontSize: '11px' }}>{label}</span>
            </div>
          ))}
          <span style={{ color: '#8b8ba0', fontSize: '11px', marginLeft: 'auto' }}>Click title text to edit · Score → breakdown</span>
        </div>

        {/* Title list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {titles.map((title, i) => (
            <TitleCard
              key={`${title}-${i}`}
              title={title}
              keyword={keyword}
              index={i}
              copiedIndex={copiedIndex}
              onCopy={copyTitle}
              onPreview={(t, d) => setPreviewData({ title: t, description: d })}
              previewUrl={previewUrl}
              showInlineSerp={showInlineSerps}
            />
          ))}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────
// ANA SAYFA
// ─────────────────────────────────────────────
export default function SeoTitleGenerator() {
  const { form, setForm } = useFormPersist('nexanlab-seo-title', {
    keyword: '',
    pageType: 'Blog Post',
    tone: 'Professional',
    count: '5',
  })

  const { history, saveSession, deleteEntry, clearAll } = useHistory()

  const [tab, setTab] = useState('single')
  const [mode, setMode] = useState('normal')
  const [titles, setTitles] = useState([])
  const [competitorTitles, setCompetitorTitles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [retryAfter, setRetryAfter] = useState(0)
  const [previewUrl, setPreviewUrl] = useState('')
  const { resultRef, scrollToResult } = useScrollToResult()

  const [bulkKeywords, setBulkKeywords] = useState('')
  const [bulkCountPerKeyword, setBulkCountPerKeyword] = useState('3')
  const [bulkResults, setBulkResults] = useState([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkError, setBulkError] = useState('')
  const [bulkWithCompetitors, setBulkWithCompetitors] = useState(false)
  const { resultRef: bulkResultRef, scrollToResult: scrollToBulk } = useScrollToResult()

  async function generate() {
    if (!form.keyword.trim()) { setError('Please enter a keyword.'); return }
    setLoading(true); setError(''); setTitles([]); setCompetitorTitles([])
    try {
      const res = await fetch('/api/generate-seo-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, mode }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); if (data.retryAfter) setRetryAfter(data.retryAfter) }
      else {
        setTitles(data.titles)
        setCompetitorTitles(data.competitorTitles || [])
        saveSession(form.keyword, data.titles, mode)
        setTimeout(() => scrollToResult(), 100)
      }
    } catch { setError('Something went wrong. Please try again.') }
    setLoading(false)
  }

  async function generateBulk() {
    const kwList = bulkKeywords.split('\n').map(k => k.trim()).filter(Boolean)
    if (!kwList.length) { setBulkError('Please enter at least one keyword.'); return }
    if (kwList.length > 10) { setBulkError('Maximum 10 keywords allowed.'); return }
    setBulkLoading(true); setBulkError(''); setBulkResults([])
    try {
      const res = await fetch('/api/generate-seo-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'bulk', keywords: kwList, pageType: form.pageType, tone: form.tone, countPerKeyword: parseInt(bulkCountPerKeyword), withCompetitors: bulkWithCompetitors }),
      })
      const data = await res.json()
      if (data.error) setBulkError(data.error)
      else { setBulkResults(data.bulk || []); setTimeout(() => scrollToBulk(), 100) }
    } catch { setBulkError('Something went wrong. Please try again.') }
    setBulkLoading(false)
  }

  async function copyAllBulk() {
    const text = bulkResults.map(r => `${r.keyword}:\n${r.titles.join('\n')}`).join('\n\n')
    await navigator.clipboard.writeText(text)
  }

  function loadFromHistory(entry) {
    setForm(prev => ({ ...prev, keyword: entry.keyword }))
    setTitles(entry.titles)
    setCompetitorTitles([])
    setMode(entry.mode || 'normal')
    setTab('single')
    setTimeout(() => scrollToResult(), 100)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #8b8ba0; }
        select option { background: #13131a; color: white; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .seo-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)', color: '#a78bfa', fontSize: '12px', fontWeight: '600', marginBottom: '24px' }}>✦ AI-Powered Tool</div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>AI SEO Title Generator</h1>
          <p style={{ color: '#8b8ba0', fontSize: '17px', maxWidth: '480px', margin: '0 auto' }}>Generate click-worthy, SEO-optimized title tags in seconds. Rank higher and get more clicks.</p>
        </div>

        {/* Single / Bulk tab */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#13131a', padding: '4px', borderRadius: '12px', border: '1px solid #2a2a3a' }}>
          {[{ val: 'single', label: '🎯 Single Keyword' }, { val: 'bulk', label: '📦 Bulk Mode', badge: 'up to 10' }].map(({ val, label, badge }) => (
            <button key={val} onClick={() => setTab(val)} style={{ flex: 1, padding: '10px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', background: tab === val ? '#7c3aed' : 'transparent', color: tab === val ? 'white' : '#8b8ba0', boxShadow: tab === val ? '0 0 16px rgba(124,58,237,0.3)' : 'none', transition: 'all 0.2s ease' }}>
              {label}{badge && tab !== val && <span style={{ marginLeft: '6px', fontSize: '10px', color: '#8b8ba0', background: '#2a2a3a', padding: '1px 6px', borderRadius: '999px' }}>{badge}</span>}
            </button>
          ))}
        </div>

        {/* History panel — only in single tab */}
        {tab === 'single' && (
          <HistoryPanel
            history={history}
            onLoad={loadFromHistory}
            onDelete={deleteEntry}
            onClear={clearAll}
          />
        )}

        {/* ── SINGLE MODE ── */}
        {tab === 'single' && (
          <div style={{ background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
            {/* Normal / Competitor toggle */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#0a0a0f', padding: '4px', borderRadius: '10px', border: '1px solid #2a2a3a' }}>
              <button onClick={() => setMode('normal')} style={{ flex: 1, padding: '8px', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none', background: mode === 'normal' ? '#2a2a3a' : 'transparent', color: mode === 'normal' ? 'white' : '#8b8ba0' }}>✦ Standard Mode</button>
              <button onClick={() => setMode('competitor')} style={{ flex: 1, padding: '8px', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none', background: mode === 'competitor' ? 'rgba(245,158,11,0.2)' : 'transparent', color: mode === 'competitor' ? '#f59e0b' : '#8b8ba0' }}>
                🏆 Competitor Analysis <span style={{ fontSize: '10px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '1px 5px', borderRadius: '4px' }}>Google data</span>
              </button>
            </div>

            {mode === 'competitor' && (
              <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <p style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>🏆 Competitor Analysis Mode</p>
                <p style={{ color: '#8b8ba0', fontSize: '12px', lineHeight: '1.5' }}>We'll fetch the current top 10 Google results and generate titles specifically designed to outrank them.</p>
              </div>
            )}

            <div className="seo-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Main Keyword <span style={{ color: '#7c3aed' }}>*</span></label>
                <input type="text" value={form.keyword} onChange={e => setForm({ ...form, keyword: e.target.value })} onKeyDown={e => e.key === 'Enter' && generate()} placeholder="e.g. best AI tools, cold email generator, SEO tips..."
                  style={{ width: '100%', height: '48px', padding: '0 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '12px', color: 'white', fontSize: '15px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                  onBlur={e => e.target.style.borderColor = '#2a2a3a'}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Page URL <span style={{ color: '#8b8ba0', fontWeight: '400' }}>(optional — for SERP preview)</span></label>
                <input type="text" value={previewUrl} onChange={e => setPreviewUrl(e.target.value)} placeholder="https://www.yoursite.com/your-page"
                  style={{ width: '100%', height: '44px', padding: '0 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(66,133,244,0.4)'}
                  onBlur={e => e.target.style.borderColor = '#2a2a3a'}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Page Type</label>
                <select value={form.pageType} onChange={e => setForm({ ...form, pageType: e.target.value })} style={{ width: '100%', height: '44px', padding: '0 14px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none' }}>
                  <option>Blog Post</option><option>Product Page</option><option>Landing Page</option><option>Category Page</option><option>Homepage</option><option>Service Page</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Tone</label>
                <select value={form.tone} onChange={e => setForm({ ...form, tone: e.target.value })} style={{ width: '100%', height: '44px', padding: '0 14px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none' }}>
                  <option>Professional</option><option>Casual</option><option>Urgent</option><option>Curious</option><option>Authoritative</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Number of Titles: <span style={{ color: '#a78bfa', fontWeight: '700' }}>{form.count}</span></label>
                <input type="range" min="3" max="10" value={form.count} onChange={e => setForm({ ...form, count: e.target.value })} style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b8ba0', fontSize: '11px', marginTop: '4px' }}><span>3</span><span>10</span></div>
              </div>
            </div>

            {error && retryAfter > 0 ? <RateLimitError retryAfter={retryAfter} onRetry={generate} /> : error ? <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '13px' }}>{error}</div> : null}

            <button onClick={generate} disabled={loading} style={{ width: '100%', height: '52px', background: loading ? '#4c1d95' : mode === 'competitor' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 0 24px rgba(124,58,237,0.4)', transition: 'all 0.2s ease' }}>
              {loading ? (mode === 'competitor' ? '🔍 Fetching Google data...' : '✦ Generating...') : mode === 'competitor' ? '🏆 Analyze & Generate' : '✦ Generate SEO Titles'}
            </button>
          </div>
        )}

        {tab === 'single' && loading && (
          <div ref={resultRef} style={{ background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid #2a2a3a', borderTop: `3px solid ${mode === 'competitor' ? '#f59e0b' : '#7c3aed'}`, animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#8b8ba0', fontSize: '14px' }}>{mode === 'competitor' ? 'Fetching Google results & generating...' : 'AI is generating your titles...'}</p>
          </div>
        )}

        {tab === 'single' && !loading && titles.length > 0 && (
          <ResultsBlock titles={titles} keyword={form.keyword} competitorTitles={competitorTitles} previewUrl={previewUrl} resultRef={resultRef} />
        )}

        {/* ── BULK MODE ── */}
        {tab === 'bulk' && (
          <div style={{ background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <p style={{ color: '#a78bfa', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>📦 Bulk Mode</p>
              <p style={{ color: '#8b8ba0', fontSize: '12px', lineHeight: '1.5' }}>Enter up to 10 keywords, one per line. Generate titles for all of them at once.</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Keywords <span style={{ color: '#7c3aed' }}>*</span> <span style={{ color: '#8b8ba0', fontWeight: '400' }}>— one per line, max 10</span>
              </label>
              <textarea value={bulkKeywords} onChange={e => setBulkKeywords(e.target.value)} placeholder={'best AI writing tools\ncold email software\nSEO title generator'} rows={6}
                style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', resize: 'vertical', lineHeight: '1.6', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                onBlur={e => e.target.style.borderColor = '#2a2a3a'}
              />
              <span style={{ fontSize: '11px', color: '#8b8ba0' }}>{bulkKeywords.split('\n').filter(k => k.trim()).length} / 10 keywords</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Page Type</label>
                <select value={form.pageType} onChange={e => setForm({ ...form, pageType: e.target.value })} style={{ width: '100%', height: '44px', padding: '0 14px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none' }}>
                  <option>Blog Post</option><option>Product Page</option><option>Landing Page</option><option>Category Page</option><option>Homepage</option><option>Service Page</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Titles per keyword: <span style={{ color: '#a78bfa', fontWeight: '700' }}>{bulkCountPerKeyword}</span></label>
                <input type="range" min="1" max="5" value={bulkCountPerKeyword} onChange={e => setBulkCountPerKeyword(e.target.value)} style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer', marginTop: '8px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b8ba0', fontSize: '11px', marginTop: '4px' }}><span>1</span><span>5</span></div>
              </div>
            </div>
            <button onClick={() => setBulkWithCompetitors(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', width: '100%', marginBottom: '20px', background: bulkWithCompetitors ? 'rgba(245,158,11,0.1)' : '#0a0a0f', border: bulkWithCompetitors ? '1px solid rgba(245,158,11,0.3)' : '1px solid #2a2a3a' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${bulkWithCompetitors ? '#f59e0b' : '#2a2a3a'}`, background: bulkWithCompetitors ? '#f59e0b' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {bulkWithCompetitors && <span style={{ color: 'black', fontSize: '11px', fontWeight: '800' }}>✓</span>}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: bulkWithCompetitors ? '#f59e0b' : 'white' }}>🏆 Include Competitor Analysis</div>
                <div style={{ fontSize: '11px', color: '#8b8ba0', marginTop: '1px' }}>Uses Serper API credits for each keyword</div>
              </div>
            </button>
            {bulkError && <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '13px' }}>{bulkError}</div>}
            <button onClick={generateBulk} disabled={bulkLoading} style={{ width: '100%', height: '52px', background: bulkLoading ? '#4c1d95' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: bulkLoading ? 'not-allowed' : 'pointer', boxShadow: bulkLoading ? 'none' : '0 0 24px rgba(124,58,237,0.4)', transition: 'all 0.2s ease' }}>
              {bulkLoading ? '✦ Generating...' : '✦ Generate Titles for All Keywords'}
            </button>
          </div>
        )}

        {tab === 'bulk' && bulkLoading && (
          <div ref={bulkResultRef} style={{ background: '#13131a', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid #2a2a3a', borderTop: '3px solid #7c3aed', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#8b8ba0', fontSize: '14px' }}>Generating titles for all keywords...</p>
          </div>
        )}

        {tab === 'bulk' && !bulkLoading && bulkResults.length > 0 && (
          <div ref={bulkResultRef}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>📦 Bulk Results — {bulkResults.length} Keywords</h2>
              <button onClick={copyAllBulk} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>📋 Copy All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bulkResults.map((group, gi) => (
                <ResultsBlock key={gi} titles={group.titles} keyword={group.keyword} competitorTitles={[]} previewUrl={previewUrl} resultRef={null} />
              ))}
            </div>
          </div>
        )}

      </main>
      <ToolSeoSection tool="seo-title" />
    </div>
  )
}