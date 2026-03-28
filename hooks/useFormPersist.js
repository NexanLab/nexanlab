'use client'

import { useState, useEffect } from 'react'

export function useFormPersist(key, initialState) {
  const [form, setForm] = useState(initialState)
  const [hydrated, setHydrated] = useState(false)

  // Sayfa açılınca localStorage'dan oku
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Sadece initialState'de olan key'leri al, fazlasını alma
        const merged = {}
        Object.keys(initialState).forEach(k => {
          merged[k] = parsed[k] !== undefined ? parsed[k] : initialState[k]
        })
        setForm(merged)
      }
    } catch {
      // localStorage erişilemezse sessizce geç
    }
    setHydrated(true)
  }, [key])

  // Form değişince localStorage'a yaz
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(key, JSON.stringify(form))
    } catch {
      // localStorage dolu veya erişilemezse sessizce geç
    }
  }, [form, key, hydrated])

  // Formu sıfırla ve localStorage'ı temizle
  function resetForm() {
    setForm(initialState)
    try {
      localStorage.removeItem(key)
    } catch {}
  }

  return { form, setForm, resetForm, hydrated }
}