'use client'
import { useEffect, useState } from 'react'

/**
 * Retorna true somente após o Zustand ter hidratado o estado do localStorage.
 * Evita logout falso no primeiro render do Next.js (SSR retorna user=null).
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])
  return hydrated
}
