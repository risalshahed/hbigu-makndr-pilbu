'use client'

export default function DraftList({ drafts, onUpdate, onDelete }) {
  return (
    <div className="space-y-4">
      {drafts.map((draft, i) => (
        <div key={i} className="border rounded p-3 space-y-2">
          <input
            className="w-full border rounded p-2"
            value={draft.title}
            onChange={e => onUpdate(i, { ...draft, title: e.target.value })}
          />
          <textarea
            className="w-full border rounded p-2"
            value={draft.body}
            onChange={e => onUpdate(i, { ...draft, body: e.target.value })}
          />
          <button
            onClick={() => onDelete(i)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}