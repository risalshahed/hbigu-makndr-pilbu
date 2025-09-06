import { fetchMarkdownFromGitHub } from '../lib/github';
import PublishGrid from './PublishGrid';

export default async function PublishList() {
  const contents = await fetchMarkdownFromGitHub();

  // const [colCount, setColCount] = useState(3);

  return (
    <>
      <h1 className="text-4xl font-semibold py-12 text-center">
        Fetched Markdown Files
      </h1>
      <PublishGrid contents={contents} />
      
    </>
  )
}
