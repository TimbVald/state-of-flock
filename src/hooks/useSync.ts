"use client"
import { useEffect, useRef, useState } from 'react'

export function useSync(defaultMinutes = 15, onSync?: () => Promise<void> | void) {
  const [minutes, setMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('syncFrequency')
    return saved ? Number(saved) : defaultMinutes
  })
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    localStorage.setItem('syncFrequency', String(minutes))
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => {
      onSync && onSync()
    }, minutes * 60 * 1000)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [minutes, onSync])

  const syncNow = async () => {
    await onSync?.()
  }

  return { minutes, setMinutes, syncNow }
}