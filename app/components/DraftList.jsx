'use client'

export default function DraftList({ drafts, onAdd, onDelete, onEdit }) {
  return (
    <div className="space-y-4">
      {drafts.length === 0 && (
        <div className="text-sm text-gray-500">No drafts yet.</div>
      )}

      {drafts.map((draft, i) => (
        <div key={draft.id || i} className="boxShadow rounded p-3 space-y-2">
          {/* Title display (h3) */}
          <h3
            className="text-lg font-semibold cursor-text"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onAdd(i, { ...draft, title: e.currentTarget.textContent })
            }
          >
            {draft.title}
          </h3>

          {/* Body display (p) */}
          <p
            className="text-gray-700 cursor-text"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onAdd(i, { ...draft, body: e.currentTarget.textContent })
            }
          >
            {draft.body}
          </p>

          <div className="flex gap-2">
            {/* Edit button */}
            <button
              onClick={() => {
                onEdit(draft.id);
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Edit
            </button>

            {/* Delete Button */}
            <button
              onClick={() => {
                onDelete(draft.id);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}