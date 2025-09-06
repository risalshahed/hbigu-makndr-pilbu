'use client'

export default function DraftList({ drafts, onAdd, onDelete, onEdit }) {
  return (
    <div className="space-y-4">
      {
        drafts.length === 0 && <div className="text-sm text-gray-500">No drafts yet.</div>
      }
      {
        drafts.map((draft, i) =>
          <div key={draft.id || i} className="border rounded p-3 space-y-2">
            <input
              className="w-full border rounded p-2"
              value={draft.title}
              onChange={e => onAdd(i, { ...draft, title: e.target.value })}
            />
            <textarea
              className="w-full border rounded p-2"
              value={draft.body}
              onChange={e => onAdd(i, { ...draft, body: e.target.value })}
            />
            <div className="flex gap-2">
              {/* Edit button */}
              <button
                onClick={() => {
                  console.log('Editing draft with id:', draft.id);
                  onEdit(draft.id);
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              {/* Delete Button */}
              <button
                onClick={() => {
                  console.log('Deleting draft with id:', draft.id);
                  onDelete(draft.id);
                }}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )
      }
    </div>
  );
}