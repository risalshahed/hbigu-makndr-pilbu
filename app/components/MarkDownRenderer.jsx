import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[ remarkGfm ]}
        rehypePlugins={[ rehypeSanitize ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}