import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'NexanLab — Discover the Best AI Tools'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Purple glow */}
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Amber glow */}
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40, position: 'relative' }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: 'white',
          }}>
            N
          </div>
          <div style={{ fontSize: 28, color: '#ffffff', fontWeight: 700, display: 'flex' }}>
            NexanLab
          </div>
        </div>

        {/* Badge */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '8px 20px', borderRadius: 999,
          border: '1px solid rgba(124,58,237,0.5)',
          background: 'rgba(124,58,237,0.15)',
          color: '#a78bfa', fontSize: 18, fontWeight: 600,
          marginBottom: 28, position: 'relative',
        }}>
          ✦  Free AI-Powered Tools
        </div>

        {/* Title lines — ayrı div'ler, nested span yok */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 28, position: 'relative' }}>
          <div style={{ fontSize: 62, fontWeight: 900, color: '#ffffff', lineHeight: 1.1, display: 'flex' }}>
            Discover the Best
          </div>
          <div style={{ fontSize: 62, fontWeight: 900, color: '#7c3aed', lineHeight: 1.1, display: 'flex' }}>
            AI Tools
          </div>
          <div style={{ fontSize: 62, fontWeight: 900, color: '#ffffff', lineHeight: 1.1, display: 'flex' }}>
            in One Place
          </div>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 22, color: '#8b8ba0', marginBottom: 40, display: 'flex', position: 'relative' }}>
          Cold Email · SEO Titles · Ad Copy · Code Review · and more
        </div>

        {/* URL */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 24px', borderRadius: 999,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#8b8ba0', fontSize: 20, position: 'relative',
        }}>
          nexanlab.com
        </div>
      </div>
    ),
    { ...size }
  )
}