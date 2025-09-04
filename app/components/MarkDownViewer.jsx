import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

export default function MarkdownViewer({ markdown }) {
  return (
    <article className="prose max-w-none prose-a:text-blue-600">
      <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{markdown}</ReactMarkdown>
    </article>
  );
}