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
          background: '#0d0d1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Logo + isim */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div style={{
            width: '64px', height: '64px', background: '#7c3aed',
            borderRadius: '14px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '34px', color: 'white', fontWeight: 700,
          }}>
            N
          </div>
          <span style={{ fontSize: '28px', color: '#ffffff', fontWeight: 600 }}>
            NexanLab
          </span>
        </div>

        {/* Başlık */}
        <div style={{ fontSize: '60px', fontWeight: 700, lineHeight: 1.1, marginBottom: '24px' }}>
          <span style={{ color: '#ffffff' }}>Discover the Best </span>
          <span style={{ color: '#7c3aed' }}>AI Tools</span>
          <span style={{ color: '#ffffff' }}> in One Place</span>
        </div>

        {/* Alt yazı */}
        <div style={{ fontSize: '22px', color: '#94a3b8' }}>
          nexanlab.com
        </div>
      </div>
    ),
    { ...size }
  )
}