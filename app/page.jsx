import Head from "next/head";
import DraftsManager from "./components/DraftsManager";
import MarkdownViewer from "./components/MarkDownViewer";

export default function Home({ markdown, sourcePath }) {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Head>
        <title>Markdown Publisher — Demo</title>
      </Head>
      <main className="container mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">Markdown from GitHub</h1>
        <p className="text-sm text-gray-600 mt-1">
          Source: <span className="font-medium">{sourcePath || '—'}</span>
        </p>

        <div className="mt-4">
          <MarkdownViewer markdown={markdown} />
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold">Drafts</h2>
        <p className="text-sm text-gray-600">
          Create drafts below, they are persisted in localStorage. "Publish All" will commit them to the repo configured on the server.
        </p>

        <DraftsManager />
      </main>
    </div>
  );
}