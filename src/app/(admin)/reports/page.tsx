import { useAuth } from '@/context/AuthContext'
import { downloadCSV, downloadXLSX } from '@/lib/export'
import { useState } from 'react'

export default function ReportsPage() {
  const { role } = useAuth()
  const [sample, setSample] = useState([
    { name: 'John Doe', zone: 'Zone A', present: 24, absent: 6 },
    { name: 'Jane Roe', zone: 'Zone B', present: 20, absent: 10 },
  ])
  if (!role) return <div className="p-4">Chargement...</div>
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Reports</h1>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Export des données</p>
        <div className="flex gap-3">
          <button onClick={() => downloadCSV('members', sample)} className="rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-sm">Exporter CSV</button>
          <button onClick={() => downloadXLSX('members', sample)} className="rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-sm">Exporter Excel</button>
        </div>
      </div>
    </div>
  )
}