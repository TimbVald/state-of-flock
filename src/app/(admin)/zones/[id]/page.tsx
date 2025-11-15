"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'
import RosterTable from '@/components/roster/RosterTable'
import Calendar from '@/components/calendar/Calendar'

type Zone = { id: string; name: string }
type Member = { id: string; name: string; contact?: string; status?: string }

export default function ZoneDetailPage() {
  const params = useParams<{ id: string }>()
  const zoneId = params.id
  const [zone, setZone] = useState<Zone | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: z } = await supabaseBrowser.from('zones').select('id,name').eq('id', zoneId).limit(1)
      setZone(z?.[0] ?? null)
      const { data: ms } = await supabaseBrowser.from('members').select('id,name,contact,status').eq('zone_id', zoneId).order('name')
      setMembers(ms ?? [])
      setLoading(false)
    }
    load()
  }, [zoneId])

  if (loading) return <p className="text-sm text-gray-500 dark:text-gray-400">Chargement...</p>
  if (!zone) return <p className="text-sm text-gray-500 dark:text-gray-400">Zone introuvable</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{zone.name}</h1>
        <button className="rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-sm">Synchroniser maintenant</button>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">Roster des membres</p>
        <RosterTable members={members} />
      </div>
      <div className="space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">Calendrier de présence</p>
        <Calendar />
      </div>
    </div>
  )
}