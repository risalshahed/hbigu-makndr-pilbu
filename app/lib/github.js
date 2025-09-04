// purpose: GitHub utility functions
// updates: uses Promise.all for multiple drafts push safely

export async function fetchMarkdownFromGitHub() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const path = process.env.GITHUB_FILE_PATH || 'content/hello.md';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!owner) throw new Error('GITHUB_OWNER is not set');
  if (!repo) throw new Error('GITHUB_REPO is not set');

  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) throw new Error('Failed to fetch markdown');
  return res.text();
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

  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/content/${file.fileName}`;
        const body = JSON.stringify({
          message: `Add ${file.fileName}`,
          content: Buffer.from(file.content).toString('base64'),
          branch,
        });

        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'GitHub API error');

        return { success: true, file: file.fileName, data };
      } catch (err) {
        return { success: false, file: file.fileName, error: err.message };
      }
    })
  );

  return results; // array with per-file success/failure
}











// export async function fetchMarkdownFromGitHub() {
//   const owner = process.env.GITHUB_OWNER;
//   const repo = process.env.GITHUB_REPO;
//   const path = process.env.GITHUB_FILE_PATH || 'content/hello.md';
//   const branch = process.env.GITHUB_BRANCH || 'main';

//   if (!owner) throw new Error('GITHUB_OWNER is not set');
//   if (!repo) throw new Error('GITHUB_REPO is not set');

//   const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;

//   console.log("Fetching from fetchMarkdownFromGitHub:", url);

//   const res = await fetch(
//     url,
//     {
//       next: {
//         revalidate: 60
//       }
//     }
//   )

//   if (!res.ok) throw new Error('Failed to fetch markdown')
//   return res.text()
// }

// export async function commitMarkdownFile() {
//   const token = process.env.GITHUB_TOKEN;
//   const owner = process.env.GITHUB_OWNER;
//   const repo = process.env.GITHUB_REPO;
//   const branch = process.env.GITHUB_BRANCH || 'main';

//   if (!token) throw new Error('GITHUB_TOKEN is not set');
//   if (!owner) throw new Error('GITHUB_OWNER is not set');
//   if (!repo) throw new Error('GITHUB_REPO is not set');

//   const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filename}`;
//   console.log("Fetching from:", url);

//   const res = await fetch(url, {
//     method: 'PUT',
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       message: `Add ${filename}`,
//       content: Buffer.from(content).toString('base64'),
//       branch
//     })
//   });

//   return res.json()
// }
