"use client"
import React from 'react'

type Member = { id: string; name: string; contact?: string; status?: string }

export default function RosterTable({ members }: { members: Member[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.05]">
              <th className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Nom</th>
              <th className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Contact</th>
              <th className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {members.map((m) => (
              <tr key={m.id}>
                <td className="px-5 py-3 text-theme-sm text-gray-800 dark:text-white/90">{m.name}</td>
                <td className="px-5 py-3 text-theme-sm text-gray-500 dark:text-gray-400">{m.contact || '-'}</td>
                <td className="px-5 py-3 text-theme-sm text-gray-500 dark:text-gray-400">{m.status || 'actif'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}