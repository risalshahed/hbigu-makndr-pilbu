// purpose: GitHub utility functions
// updates: uses Promise.all for multiple drafts push safely

export async function fetchMarkdownFromGitHub() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  // const path = process.env.GITHUB_FILE_PATH || 'content/hello.md';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!owner) throw new Error('GITHUB_OWNER is not set');
  if (!repo) throw new Error('GITHUB_REPO is not set');

  // const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/content?ref=${branch}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error('Failed to fetch markdown');
  
  const files = await res.json(); // array of { name, download_url, ... }

  // Only .md files
  const mdFiles = files.filter(f => f.name.endsWith('.md'));

  const contents = await Promise.all(mdFiles.map(async f => {
    const r = await fetch(f.download_url);
    return { name: f.name, content: await r.text() };
  }));

  return contents;
}

// commit multiple markdown files in parallel with Promise.all
export async function commitMarkdownFiles(files) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token) throw new Error('GITHUB_TOKEN is not set');
  if (!owner) throw new Error('GITHUB_OWNER is not set');
  if (!repo) throw new Error('GITHUB_REPO is not set');

  /* const results = [];

  for (const file of files) {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/content/${file.fileName}`;

      // Step 1: check if file exists
      let sha = null;
      const existingRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (existingRes.ok) {
        const existingData = await existingRes.json();
        sha = existingData.sha;
      }

      // Step 2: commit create or update
      const body = JSON.stringify({
        message: sha ? `Update ${file.fileName}` : `Add ${file.fileName}`,
        content: Buffer.from(file.content).toString("base64"),
        branch,
        ...(sha ? { sha } : {}),
      });

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "GitHub API error");

      results.push({ success: true, file: file.fileName, data });
    } catch (err) {
      results.push({ success: false, file: file.fileName, error: err.message });
    }
  } */

  const results = await files.reduce(async (prevPromise, file) => {
    const acc = await prevPromise; // wait for previous
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/content/${file.fileName}`;

      // 🔍 Check if file exists
      let sha = null;
      const existingRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (existingRes.ok) {
        const existingData = await existingRes.json();
        sha = existingData.sha;
      }

      // 🔄 Commit create/update
      const body = JSON.stringify({
        message: sha ? `Update ${file.fileName}` : `Add ${file.fileName}`,
        content: Buffer.from(file.content).toString("base64"),
        branch,
        ...(sha ? { sha } : {}),
      });

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "GitHub API error");

      return [...acc, { success: true, file: file.fileName, data }];
    } catch (err) {
      return [...acc, { success: false, file: file.fileName, error: err.message }];
    }
  }, Promise.resolve([]));

  // console.log('results', results);

  return results;
}