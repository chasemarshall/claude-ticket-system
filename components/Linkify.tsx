import React from 'react'

const URL_REGEX = /(https?:\/\/[^\s<]+)/g

interface LinkifyProps {
  children: string
  style?: React.CSSProperties
}

export default function Linkify({ children, style }: LinkifyProps) {
  const parts = children.split(URL_REGEX)

  return (
    <span style={style}>
      {parts.map((part, i) =>
        URL_REGEX.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent)',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </span>
  )
}
