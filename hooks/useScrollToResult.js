'use client'

import { useRef, useCallback } from 'react'

export function useScrollToResult() {
  const resultRef = useRef(null)

  const scrollToResult = useCallback(() => {
    if (resultRef.current) {
      const yOffset = -80 // header yüksekliği kadar boşluk bırak
      const y = resultRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  return { resultRef, scrollToResult }
}