'use client'

import Link from 'next/link'
import DraftsManager from '../components/DraftsManager'

export default function DraftsPage() {
  return (
    <div className="max-w-[768px] mx-auto space-y-6 p-6">
      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold">
          Drafts
        </h1>
        <Link href='/'>
          <button className='bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded'>
            Draft List
          </button>
        </Link>
      </div>
      <DraftsManager />
    </div>
  )
}