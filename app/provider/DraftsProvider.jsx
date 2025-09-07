'use client'

import { useEffect, useState } from 'react'
import { slugify } from '../utils/slugify';
import { DraftsContext } from '../context';

export default function DraftsProvider({ children }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [publishResults, setPublishResults] = useState(null);
  const [colCount, setColCount] = useState(3);

  // load drafts from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('drafts');
      if (raw) {
        setDrafts(JSON.parse(raw));
      }
    } catch (e) {
    }
  }, []);

  // persist drafts
  useEffect(() => {
    try {
      localStorage.setItem('drafts', JSON.stringify(drafts));
    } catch (e) {
    }
  }, [drafts]);
  
  
  function resetForm() {
    setTitle('');
    setBody('');
    setEditingId(null);
  }

  async function titleExistsInGitHub(title) {
    const slug = slugify(title); // same slug logic as commit
    const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER;
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const branch = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main';
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/content/${slug}.md?ref=${branch}`;
  
    try {
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  }

  async function handleAdd() {
    if (!title.trim()) return alert('Please add a title');
    if (!body.trim()) return alert('Please add a body');

    if (drafts.some(d => d.title.trim().toLowerCase() === title.trim().toLowerCase())) {
      return alert('Draft with this title already exists locally.');
    }

    // Check if title already published on GitHub
    const existsInGitHub = await titleExistsInGitHub(title);

    if (existsInGitHub) {
      return alert('Draft with this title already published on GitHub.');
    }

    const newDraft = {
      id: Date.now().toString(),
      title: title.trim(),
      body: body.trim(),
      slug: `${slugify(title)}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
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
    setDrafts(prev => prev.filter(d => d.id !== id));
  }

  // Publish all drafts to GitHub
  async function handlePublishAll() {
    if (drafts.length === 0) return alert('No drafts to publish');

    const invalidDraft = drafts.find(d => !d.title.trim() || !d.body.trim());
    if (invalidDraft) return alert('All drafts must have a title and body');

    setLoading(true);
    setPublishResults(null);

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drafts }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 403 && json.message?.includes('rate limit')) {
          alert('GitHub API rate limit exceeded. Please try again later.');
        } else {
          alert('Some errors occurred while publishing drafts.');
        }
      }

      setPublishResults(json.results);

      const successCount = json.results?.filter(r => r.success).length || 0;
      const failCount = json.results?.filter(r => !r.success).length || 0;

      alert(`Publish finished: ${successCount} success, ${failCount} failed.`);

      if (failCount === 0) {
        setDrafts([]);
        localStorage.removeItem('drafts');
      }
    } catch (err) {
      alert('Publish failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DraftsContext.Provider value={{
      title,
      setTitle,
      body,
      setBody,
      drafts,
      setDrafts,
      editingId,
      setEditingId,
      loading,
      setLoading,
      publishResults,
      setPublishResults,
      handleAdd,
      handleEdit,
      handleDelete,
      handlePublishAll,
      titleExistsInGitHub,
      colCount,
      setColCount
      }}
    >
      {children}
    </DraftsContext.Provider>
  )
}
