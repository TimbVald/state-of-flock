import { useAuth } from '@/context/AuthContext'

export default function AttendancePage() {
  const { role, zones } = useAuth()
  if (!role) return <div className="p-4">Chargement...</div>
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Attendance</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Zones: {zones.join(', ') || 'Aucune'}</p>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">Calendrier et graphiques à implémenter</div>
    </div>
  )
}