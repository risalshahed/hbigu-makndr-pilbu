# Markdown Authoring & Publishing Platform

A modern **Next.js** app that allows authors to **create, edit, delete, and publish Markdown files** directly to GitHub. Drafts are persisted locally, and published files are committed to a GitHub repository safely using environment variables. The app also fetches and renders Markdown files from GitHub as sanitized HTML.

---

## 🚀 Live Demo

[Live Site URL](YOUR_LIVE_URL_HERE)

## 📂 GitHub Repository

[Repository Link](YOUR_GITHUB_REPO_URL_HERE)

---

## ⚙️ Technology Stack

- **Framework:** Next.js 15.5.2
- **Styling:** Tailwind CSS
- **Version Control:** Git + GitHub
- **Dependencies beyond Next.js & Tailwind:**
  - `react-markdown` – To render Markdown content as React components.
  - `rehype-raw` – To allow HTML inside Markdown files.
  - `rehype-sanitize` – To sanitize HTML and prevent XSS attacks.
  - `remark-gfm` – To support GitHub Flavored Markdown syntax (tables, strikethroughs, task lists).
  - `simple-git` – For handling Git operations locally if needed (committing/pushing programmatically).

> These dependencies are carefully chosen to safely handle Markdown content while providing a modern, interactive authoring experience.

---

## 📝 Features

### Draft Management

- Create, edit, and delete drafts.
- Drafts are persisted in `localStorage` across reloads.
- Each draft has a unique slug (timestamp + slugified title).

### Publishing

- “Publish All” feature commits multiple Markdown files to GitHub in parallel.
- Prevents duplicate titles both locally and on GitHub.
- Uses environment variables for GitHub authentication; secrets are **never exposed** to the client.

### Content Fetching

- Fetch Markdown files from GitHub repository.
- Render Markdown as sanitized HTML in a responsive grid layout.
- Supports sorting by **title** and **published date**.
- Adjustable grid columns for large screens (3, 4, or 5 columns).

### UI / UX

- Responsive and accessible design using Tailwind CSS.
- Interactive UI for managing drafts and viewing published content.
- Dropdowns for sorting and layout customization.

---

## 📦 Installation & Setup

1. Clone the repository:

```bash
git clone YOUR_GITHUB_REPO_URL_HERE
cd YOUR_PROJECT_FOLDER
```

### Install dependencies

```bash
npm install
# or
yarn
```

### Configure environment variables in .env.local

```bash
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repo-name
GITHUB_BRANCH=main
GITHUB_TOKEN=your_personal_access_token
```

#### Note: Keep .env.local secret. Do not commit it. Token is only used server-side.

### Run locally

```bash
npm run dev
# or
yarn dev
```
