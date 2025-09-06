'use client'

import { useEffect, useState } from 'react'

export default function DraftForm({ onAdd, initialValues, title, setTitle, body, setBody }) {

  // Populate form with initial values for editing
  useEffect(() => {
    if (initialValues) {
      console.log('Populating form with initial values:', initialValues);
      setTitle(initialValues.title || '');
      setBody(initialValues.body || '');
    } else {
      setTitle('');
      setBody('');
    }
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trim values before validation
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    // if (!title || !body) return alert('Please add a title and body');
    if (!trimmedTitle) {
      console.log('Validation failed: Title is empty');
      return alert('Please add a title');
    }
    if (!trimmedBody) {
      console.log('Validation failed: Body is empty');
      return alert('Please add a body');
    }
    console.log('Submitting draft:', { title: trimmedTitle, body: trimmedBody });
    onAdd({
      title: trimmedTitle,
      body: trimmedBody
    });
    setTitle('');
    setBody('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="w-full border rounded p-2"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border rounded p-2"
        placeholder="Body"
        value={body}
        onChange={e => setBody(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add Draft
      </button>
    </form>
  );
}