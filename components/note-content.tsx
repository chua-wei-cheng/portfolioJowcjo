"use client"

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { useTheme } from 'next-themes'

type ContentBlock = {
  type: 'text' | 'code'
  content: string
  language?: string
}

type NoteContentProps = {
  content: ContentBlock[] | string
}

export default function NoteContent({ content }: NoteContentProps) {
  const { theme } = useTheme()

  const renderContent = (contentBlocks: ContentBlock[] | string) => {
    if (typeof contentBlocks === 'string') {
      return contentBlocks
    }

    return contentBlocks.map((block, index) => {
      if (block.type === 'text') {
        return block.content
      } else if (block.type === 'code') {
        return `\`\`\`${block.language || ''}\n${block.content}\n\`\`\``
      }
      return ''
    }).join('\n\n')
  }

  const markdownContent = renderContent(content)

  return (
    <ReactMarkdown
      components={{
        code: ({ node, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : ''
          const isCodeBlock = className?.includes('language-')

          if (!isCodeBlock) {
            return (
              <code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm" {...props}>
                {children}
              </code>
            )
          }

          return (
            <pre className={`p-4 rounded-md overflow-x-auto ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
              <code className={`language-${language} ${getLanguageClass(language)}`} {...props}>
                {String(children).replace(/\n$/, '')}
              </code>
            </pre>
          )
        },
        h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
        p: ({ children }) => <p className="mb-4">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
        li: ({ children }) => <li className="mb-2">{children}</li>,
        a: ({ href, children }) => (
          <a href={href} className="text-blue-500 hover:text-blue-600 transition-colors">
            {children}
          </a>
        ),
      }}
    >
      {markdownContent}
    </ReactMarkdown>
  )
}

function getLanguageClass(language: string): string {
  // Add more language-specific classes as needed
  switch (language) {
    case 'javascript':
    case 'js':
      return 'text-yellow-400'
    case 'typescript':
    case 'ts':
      return 'text-blue-400'
    case 'python':
      return 'text-green-400'
    case 'html':
      return 'text-red-400'
    case 'css':
      return 'text-pink-400'
    default:
      return 'text-gray-400'
  }
}