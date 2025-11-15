import { useAuth } from '@/context/AuthContext'

export default function AdminSettingsPage() {
  const { role } = useAuth()
  if (!role) return <div className="p-4">Chargement...</div>
  if (role !== 'Bishop' && role !== 'DataClerk') return <div className="p-4">Accès refusé</div>
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Paramètres de l’application</h1>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">Configuration et synchro</div>
    </div>
  )
}