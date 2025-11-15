"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'

type Zone = { id: string; name: string }

export default function ZonesPage() {
  const { role } = useAuth()
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabaseBrowser.from('zones').select('id,name').order('name')
      setZones(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Zones</h1>
      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Chargement...</p>
      ) : zones.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Aucune zone disponible</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((z) => (
            <li key={z.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-800 dark:text-white/90 font-medium">{z.name}</p>
                  <p className="text-theme-xs text-gray-500 dark:text-gray-400">ID: {z.id}</p>
                </div>
                <Link href={`/zones/${z.id}`} className="rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 text-sm">Voir</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}