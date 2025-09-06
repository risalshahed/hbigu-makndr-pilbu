'use client'

import DraftsManager from '../components/DraftsManager'

export default function DraftsPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Drafts</h1>
      <DraftsManager />
    </div>
  )
}

// import { useState, useEffect } from 'react'
// import DraftForm from '../components/DraftForm'
// import DraftList from '../components/DraftList'

// export default function DraftsPage() {
//   const [drafts, setDrafts] = useState([])

//   useEffect(() => {
//     const saved = localStorage.getItem('drafts')
//     if (saved) setDrafts(JSON.parse(saved))
//   }, [])

//   useEffect(() => {
//     localStorage.setItem('drafts', JSON.stringify(drafts))
//   }, [drafts])

//   const addDraft = (draft) => setDrafts([...drafts, draft])
//   const updateDraft = (i, draft) =>
//     setDrafts(drafts.map((d, idx) => (idx === i ? draft : d)))
//   const deleteDraft = (i) => setDrafts(drafts.filter((_, idx) => idx !== i))

//   const publishAll = async () => {
//     const res = await fetch('/api/publish', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ drafts })
//     })
//     const data = await res.json()
//     console.log('Publish result:', data)
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Drafts</h1>
//       <DraftForm onAdd={addDraft} />
//       <DraftList drafts={drafts} onUpdate={updateDraft} onDelete={deleteDraft} />
//       {drafts.length > 0 && (
//         <button
//           onClick={publishAll}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Publish All
//         </button>
//       )}
//     </div>
//   )
// }