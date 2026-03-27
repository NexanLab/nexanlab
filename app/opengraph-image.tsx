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
        {/* Grid pattern background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(124,58,237,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          display: 'flex',
        }} />

        {/* Purple glow top right */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Amber glow bottom left */}
        <div style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
            <div style={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 800,
              color: 'white',
            }}>
              N
            </div>
            <span style={{ fontSize: 28, color: '#ffffff', fontWeight: 700 }}>
              Nexan<span style={{ color: '#7c3aed' }}>Lab</span>
            </span>
          </div>

          {/* Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 999,
            border: '1px solid rgba(124,58,237,0.4)',
            background: 'rgba(124,58,237,0.15)',
            color: '#a78bfa',
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 24,
            width: 'fit-content',
          }}>
            ✦ Free AI-Powered Tools
          </div>

          {/* Title */}
          <div style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <span style={{ color: '#ffffff' }}>Discover the Best</span>
            <span style={{ color: '#7c3aed' }}>AI Tools</span>
            <span style={{ color: '#ffffff' }}>in One Place</span>
          </div>

          {/* Description */}
          <div style={{
            fontSize: 22,
            color: '#8b8ba0',
            marginBottom: 40,
          }}>
            Cold Email • SEO Titles • Ad Copy • Code Review • and more
          </div>

          {/* URL pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#8b8ba0',
            fontSize: 18,
          }}>
            🌐 nexanlab.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}