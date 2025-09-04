'use client'

import { useEffect, useState } from 'react';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function DraftsManager() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // load drafts from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('drafts');
      if (raw) setDrafts(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load drafts', e);
    }
  }, []);

  // persist drafts
  useEffect(() => {
    try {
      localStorage.setItem('drafts', JSON.stringify(drafts));
    } catch (e) {
      console.error('Failed to save drafts', e);
    }
  }, [drafts]);
  
  
  function resetForm() {
    setTitle('');
    setBody('');
    setEditingId(null);
  } 
  
  function handleAdd() {
    if (!title.trim()) return alert('Please add a title');
    const newDraft = {
      id: Date.now().toString(),
      title: title.trim(),
      body: body,
      slug: slugify(title),
      createdAt: new Date().toISOString(),
    };
    if (editingId) {
      setDrafts(prev => prev.map(
        d => (
          d.id === editingId
          ?
          {
            ...d, title: newDraft.title, body: newDraft.body, slug: newDraft.slug
          }
          :
          d
        )
      ));
    } else {
      setDrafts(prev => [
        newDraft, ...prev
      ]);
    }
    resetForm();
  }

  function handleEdit(id) {
    const d = drafts.find(x => x.id === id);
    if (!d) return;
    setTitle(d.title);
    setBody(d.body);
    setEditingId(id);
  }
    
    
  function handleDelete(id) {
    if (!confirm('Delete this draft?')) return;
    setDrafts(prev => prev.filter((d) => d.id !== id));
  }
    
    
  // Publish all drafts to GitHub
  async function handlePublishAll() {
    if (drafts.length === 0) return alert('No drafts to publish');
    setLoading(true);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drafts }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Publish failed');
      alert('Published ' + (json.results?.length || 0) + ' files. Check repository.');
      setDrafts([]); // clear drafts after success
      localStorage.removeItem('drafts');
    } catch (err) {
      console.error(err);
      alert('Publish failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">
        Write a draft
      </h2>
      <div className="mt-3 grid gap-2">
        <input
          aria-label="Title"
          className="border rounded px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e)=> setTitle(e.target.value)}
        />
        <textarea
          aria-label="Body"
          className="border rounded px-3 py-2 h-36"
          placeholder="Markdown body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleAdd}
          >
            {editingId ? 'Save' : 'Add Draft'}
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={resetForm}>
            Clear
          </button>
        </div>
      </div>
      
      {/* Draft list */}
      <div className="mt-6">
        <h3 className="font-semibold">Drafts ({drafts.length})</h3>
        <div className="mt-3 space-y-3">
          {
            drafts.length === 0 && <div className="text-sm text-gray-500">No drafts yet.</div>
          }
          {
            drafts.map(d =>
              <div key={d.id} className="border rounded p-3 flex justify-between items-start">
                <div className="max-w-[70%]">
                  <div className="font-medium">{d.title}</div>
                  <div className="text-xs text-gray-600 truncate">{d.slug} • {new Date(d.createdAt).toLocaleString()}</div>
                  <div className="mt-2 text-sm text-gray-800 line-clamp-3 whitespace-pre-wrap">{d.body}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="text-sm text-blue-600"
                    onClick={() => handleEdit(d.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-red-600"
                    onClick={() => handleDelete(d.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          }
        </div>
        
        {/* Publish All button */}
        <div className="mt-4">
          <button
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
            onClick={handlePublishAll}
          >
            {loading ? 'Publishing...' : 'Publish All'}
          </button>
        </div>
      </div>
    </section>
  );
}