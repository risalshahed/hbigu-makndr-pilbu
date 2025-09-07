// purpose: GitHub utility functions
// updates: uses Promise.all for multiple drafts push safely

export async function fetchMarkdownFromGitHub() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;

  if (!owner) throw new Error('GITHUB_OWNER is not set');
  if (!repo) throw new Error('GITHUB_REPO is not set');

  // const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/content?ref=${branch}`;

  // const res = await fetch(url);

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  // if (!res.ok) throw new Error('Failed to fetch markdown');

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch markdown: ${res.status} ${errText}`);
  }
  
  const files = await res.json();

  // Only .md files
  const mdFiles = files.filter(f => f.name.endsWith('.md'));

  const contents = await Promise.all(mdFiles.map(async f => {
    const r = await fetch(f.download_url);
    const text = await r.text();

    // Get last modified from commits API
    const commitRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?path=content/${f.name}&per_page=1`
    );
    let lastModified = null;
    if (commitRes.ok) {
      const commits = await commitRes.json();
      if (commits.length > 0) {
        lastModified = commits[0].commit.author.date;
      }
    }

    return {
      name: f.name,
      content: text,
      lastModified: lastModified || new Date().toISOString()
    };
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

  const results = await files.reduce(async (prevPromise, file) => {
    const acc = await prevPromise;
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

      return [{ success: true, file: file.fileName, data }, ...acc];
    } catch (err) {
      return [{ success: false, file: file.fileName, error: err.message }, ...acc];
    }
  }, Promise.resolve([]));

  return results;
}