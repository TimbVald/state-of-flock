import { useAuth } from '@/context/AuthContext'
import { useSync } from '@/hooks/useSync'

export default function AdminSettingsPage() {
  const { role } = useAuth()
  if (!role) return <div className="p-4">Chargement...</div>
  if (role !== 'Bishop' && role !== 'DataClerk') return <div className="p-4">Accès refusé</div>
  const { minutes, setMinutes, syncNow } = useSync(15, async () => {
    /* TODO: brancher la synchro réelle (fetch Supabase) */
  })
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Paramètres de l’application</h1>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Fréquence de synchronisation</p>
        <div className="flex items-center gap-3">
          <input onInput={(e) => setMinutes(Number((e.target as HTMLInputElement).value))} type="range" min={5} max={60} step={5} value={minutes} />
          <span className="text-sm text-gray-700 dark:text-gray-300">{minutes} min</span>
        </div>
        <div className="flex gap-3">
          <button onClick={syncNow} className="rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-sm">Synchroniser maintenant</button>
        </div>
      </div>
    </div>
  )
}