import { useAuth } from '@/context/AuthContext'
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'
import MonthlySalesChart from '@/components/ecommerce/MonthlySalesChart'
import StatisticsChart from '@/components/ecommerce/StatisticsChart'
import MonthlyTarget from '@/components/ecommerce/MonthlyTarget'

export default function DashboardPage() {
  const { role, zones } = useAuth()

  if (!role) {
    return <div className="p-4">Chargement...</div>
  }

  if (role === 'Bishop') {
    return (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>
        <div className="col-span-12">
          <StatisticsChart />
        </div>
      </div>
    )
  }

  if (role === 'AssistingOverseer') {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <p className="text-lg font-medium">KPIs agrégés pour mes zones</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Zones: {zones.join(', ') || 'Aucune'}</p>
        </div>
        <StatisticsChart />
      </div>
    )
  }

  if (role === 'AreaPastor') {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <p className="text-lg font-medium">KPIs de ma zone</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Zone: {zones[0] || 'Non assignée'}</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <p className="text-lg font-medium">Statut des Bacenta Leaders</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Données à venir</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-lg font-medium">Qualité des données</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Membres sans contact, doublons, synchro</p>
      </div>
    </div>
  )
}