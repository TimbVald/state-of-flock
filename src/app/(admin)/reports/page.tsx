import { useAuth } from '@/context/AuthContext'

export default function ReportsPage() {
  const { role } = useAuth()
  if (!role) return <div className="p-4">Chargement...</div>
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Reports</h1>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">Export CSV/Excel à implémenter</div>
    </div>
  )
}