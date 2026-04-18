'use client'

import { useState, useEffect } from 'react'

export default function RateLimitError({ retryAfter = 10, onRetry }) {
  const [seconds, setSeconds] = useState(retryAfter)

  useEffect(() => {
    setSeconds(retryAfter)
  }, [retryAfter])

  useEffect(() => {
    if (seconds <= 0) return

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [retryAfter])

  return (
    <div style={{
      padding: '16px', borderRadius: '12px', marginBottom: '16px',
      background: 'rgba(245,158,11,0.08)',
      border: '1px solid rgba(245,158,11,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '18px' }}>⚡</span>
        <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '600' }}>
          Too many requests
        </span>
      </div>
      <p style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
        You're generating too fast. Please wait before trying again.
      </p>

      {seconds > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Progress bar */}
          <div style={{
            flex: 1, height: '4px', borderRadius: '999px',
            background: 'rgba(245,158,11,0.15)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: '999px',
              background: '#f59e0b',
              width: `${(seconds / retryAfter) * 100}%`,
              transition: 'width 1s linear',
            }} />
          </div>
          <span style={{
            color: '#f59e0b', fontSize: '13px', fontWeight: '700',
            minWidth: '24px', textAlign: 'right',
          }}>
            {seconds}s
          </span>
        </div>
      ) : (
        <button
          onClick={onRetry}
          style={{
            padding: '8px 16px', borderRadius: '8px',
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.3)',
            color: '#f59e0b', fontSize: '13px', fontWeight: '600',
            cursor: 'pointer', transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245,158,11,0.25)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245,158,11,0.15)'}
        >
          Try Again →
        </button>
      )}
    </div>
  )
}