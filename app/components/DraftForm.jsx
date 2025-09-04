'use client'

import { useState } from 'react'

export default function DraftForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !body) return;
    onAdd({ title, body });
    setTitle('');
    setBody('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="w-full border rounded p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border rounded p-2"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add Draft
      </button>
    </form>
  );
}