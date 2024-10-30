// components/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import "highlight.js/styles/github.css";

const components = {
  ul: (props) => <ul className="list-disc list-inside" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside" {...props} />,
  strong: (props) => <strong className="font-bold">{props.children}</strong>,
  p: (props) => <p className="inline-block">{props.children}</p>,
};

const MarkdownRenderer = ({ markdownText, className }) => {
  return (
    <ReactMarkdown
      className={className}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeSanitize]}
      components={components}
    >
      {markdownText}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
