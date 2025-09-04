import MarkdownRenderer from "./components/MarkDownRenderer"
import { fetchMarkdownFromGitHub } from "./lib/github"

export default async function Home() {
  const content = await fetchMarkdownFromGitHub()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fetched Markdown</h1>
      <MarkdownRenderer content={content} />
    </div>
  )
}