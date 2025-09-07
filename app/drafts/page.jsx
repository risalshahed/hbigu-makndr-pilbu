'use client'

import DraftsManager from '../components/DraftsManager'

export default function DraftsPage() {
  return (
    <div className="max-w-[768px] mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold">Drafts</h1>
      <DraftsManager />
    </div>
  )
}