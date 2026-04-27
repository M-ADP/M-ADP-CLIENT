import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as S from './style';

export default function MarkdownMessage({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <S.MarkdownParagraph>{children}</S.MarkdownParagraph>,
        ol: ({ children }) => <S.MarkdownOrderedList>{children}</S.MarkdownOrderedList>,
        ul: ({ children }) => <S.MarkdownUnorderedList>{children}</S.MarkdownUnorderedList>,
        blockquote: ({ children }) => <S.MarkdownBlockquote>{children}</S.MarkdownBlockquote>,
        a: ({ children, href }) => (
          <S.MarkdownLink href={href} target="_blank" rel="noreferrer noopener">
            {children}
          </S.MarkdownLink>
        ),
        code: ({ children, className }) => <code className={className}>{children}</code>,
        pre: ({ children }) => <S.CodeBlock>{children}</S.CodeBlock>,
        table: ({ children }) => (
          <S.MarkdownTableScroll>
            <S.MarkdownTable>{children}</S.MarkdownTable>
          </S.MarkdownTableScroll>
        ),
        th: ({ children }) => <S.MarkdownTableHeader>{children}</S.MarkdownTableHeader>,
        td: ({ children }) => <S.MarkdownTableCell>{children}</S.MarkdownTableCell>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
