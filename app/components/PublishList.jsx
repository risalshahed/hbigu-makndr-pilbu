import { fetchMarkdownFromGitHub } from '../lib/github';
import PublishGrid from './PublishGrid';

export default async function PublishList() {
  const contents = await fetchMarkdownFromGitHub();

  return (
    <>
      <h1 className="text-2xl sm:text-4xl font-extrabold py-4 sm:py-12 text-center">
        Fetched Markdown Files
      </h1>
      <PublishGrid contents={contents} />
      
    </>
  )
}
