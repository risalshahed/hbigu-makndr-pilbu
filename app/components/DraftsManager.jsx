'use client'

import { useEffect, useState } from 'react';
import DraftForm from './DraftForm';
import DraftList from './DraftList';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^-+|-+$/g, '') || 'draft'; // Fallback to 'draft' if empty
}

export default function DraftsManager() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  // Added state for publish results feedback
  const [publishResults, setPublishResults] = useState(null);

  // load drafts from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('drafts');
      if (raw) {
        console.log('Loading drafts from localStorage:', JSON.parse(raw));
        setDrafts(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to load drafts:', e);
    }
  }, []);

  // persist drafts
  useEffect(() => {
    try {
      console.log('Saving drafts to localStorage:', drafts);
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
    // Added validation for title and body
    if (!title.trim()) return alert('Please add a title');
    if (!body.trim()) return alert('Please add a body');

    const newDraft = {
      id: Date.now().toString(),
      title: title.trim(),
      body: body.trim(),
      // slug: slugify(title),
      // Modified to append timestamp to slug for uniqueness
      slug: `${slugify(title)}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      console.log('Updating draft:', newDraft);
      setDrafts(prev => prev.map(
        d => (
          d.id === editingId
          ?
          {
            ...d,
            title: newDraft.title,
            body: newDraft.body,
            slug: newDraft.slug
          }
          :
          d
        )
      ));
    } else {
      console.log('Adding new draft:', newDraft);
      setDrafts(prev => [
        newDraft, ...prev
      ]);
    }
    resetForm();
  }

  function handleEdit(id) {
    const d = drafts.find(x => x.id === id);
    if (!d) return;
    console.log('Editing draft:', d);
    setTitle(d.title);
    setBody(d.body);
    setEditingId(id);
  }
    
    
  function handleDelete(id) {
    if (!confirm('Delete this draft?')) return;
    console.log('Deleting draft with id:', id);
    setDrafts(prev => prev.filter(d => d.id !== id));
  }

  // Publish all drafts to GitHub
async function handlePublishAll() {
  if (drafts.length === 0) return alert('No drafts to publish');

  // Validation
  const invalidDraft = drafts.find(d => !d.title.trim() || !d.body.trim());
  if (invalidDraft) return alert('All drafts must have a title and body');

  setLoading(true);
  setPublishResults(null);

  try {
    console.log('Publishing drafts:', drafts);
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drafts }),
    });

    const json = await res.json();
    console.log('Publish API response:', json);

    // Instead of killing on !res.ok, always show results
    if (!res.ok) {
      // Rate limit explicit error
      if (res.status === 403 && json.message?.includes('rate limit')) {
        alert('GitHub API rate limit exceeded. Please try again later.');
      } else {
        alert('Some errors occurred while publishing drafts.');
      }
    }

    // ✅ Always set results, even if partial failure
    setPublishResults(json.results);

    // Show summary
    const successCount = json.results?.filter(r => r.success).length || 0;
    const failCount = json.results?.filter(r => !r.success).length || 0;

    alert(`Publish finished: ${successCount} success, ${failCount} failed.`);

    console.log('Publish results:', json.results);

    // Clear drafts only if all were successful
    if (failCount === 0) {
      setDrafts([]);
      localStorage.removeItem('drafts');
    }
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
      {/* Modified: Use DraftForm and pass editing draft */}
      <DraftForm
        onAdd={handleAdd}
        title={title}
        setTitle={setTitle}
        body={body}
        setBody={setBody}
        initialValues={editingId ? drafts.find(d => d.id === editingId) : null}
      />
      
      {/* Use DraftList */}
      <div className="mt-6">
        <h3 className="font-semibold">Drafts ({drafts.length})</h3>        
        <DraftList
          drafts={drafts} 
          onAdd={handleAdd} // Reuse handleAdd for updates
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
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

      {/* Added: Publish results feedback */}
      {publishResults && (
        <div className="mt-4 p-3 border rounded">
          <h3 className="font-semibold">Publish Results</h3>
          <ul className="mt-2 space-y-2">
            {publishResults.map((result, i) =>
              <li key={i} className={result.success ? 'text-green-600' : 'text-red-600'}>
                {result.file}: {result.success ? 'Published successfully' : `Failed - ${result.error}`}
              </li>
            )}
          </ul>
        </div>
      )}
    </section>
  );
}