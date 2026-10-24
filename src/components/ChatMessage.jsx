import React, { useState } from 'react';

/**
 * Lightweight, safe parser for styling responses into structured HTML.
 * Renders paragraphs, bold highlights, bullet lists, numbered lists, and quotes.
 */
function renderFormattedContent(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = null;
  let listType = null; // 'ul' or 'ol'

  const flushList = () => {
    if (currentList && currentList.length > 0) {
      if (listType === 'ul') {
        elements.push(
          <ul key={`list-${elements.length}`} className="chat-bullet-list">
            {currentList.map((item, idx) => (
              <li key={idx}>{parseInlineFormatting(item)}</li>
            ))}
          </ul>
        );
      } else if (listType === 'ol') {
        elements.push(
          <ol key={`list-${elements.length}`} className="chat-number-list">
            {currentList.map((item, idx) => (
              <li key={idx}>{parseInlineFormatting(item)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
      listType = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line separates paragraphs and flushes lists
    if (!trimmed) {
      flushList();
      return;
    }

    // Bullet point: '-', '*', '•'
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
        currentList = [];
      }
      currentList.push(bulletMatch[1]);
      return;
    }

    // Numbered list: '1. ', '2. '
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
        currentList = [];
      }
      currentList.push(numberMatch[2]);
      return;
    }

    // Headers: '### ' or '## '
    const headerMatch = trimmed.match(/^#{1,4}\s+(.*)$/);
    if (headerMatch) {
      flushList();
      elements.push(
        <h4 key={`header-${index}`} className="chat-content-header">
          {parseInlineFormatting(headerMatch[1])}
        </h4>
      );
      return;
    }

    // Blockquote: '> '
    const quoteMatch = trimmed.match(/^>\s*(.*)$/);
    if (quoteMatch) {
      flushList();
      elements.push(
        <blockquote key={`quote-${index}`} className="chat-content-quote">
          {parseInlineFormatting(quoteMatch[1])}
        </blockquote>
      );
      return;
    }

    // Regular paragraph line
    flushList();
    elements.push(
      <p key={`p-${index}`} className="chat-content-paragraph">
        {parseInlineFormatting(line)}
      </p>
    );
  });

  flushList();
  return elements;
}

/**
 * Parse bold (**text**), code (`code`), and italics (*text*) inline.
 */
function parseInlineFormatting(str) {
  if (!str) return '';

  // Split tokens by markdown markers: bold (**...**), code (`...`)
  const parts = [];
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`b-${match.index}`} className="font-semibold text-accent">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={`c-${match.index}`} className="inline-code">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts;
}

export default function ChatMessage({ message }) {
  const isValentine = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`message-row ${isValentine ? 'message-valentine' : 'message-user'}`}>
      <div className="message-avatar" aria-hidden="true">
        {isValentine ? (
          <div className="avatar-stylist">
            <span>V</span>
          </div>
        ) : (
          <div className="avatar-user">
            <span>You</span>
          </div>
        )}
      </div>

      <div className="message-bubble-wrapper">
        <div className="message-sender-bar">
          <span className="sender-name">
            {isValentine ? 'Valentine' : 'You'}
          </span>
          {isValentine && (
            <span className="stylist-badge">Fashion Stylist</span>
          )}
          {message.timestamp && (
            <span className="message-time">{message.timestamp}</span>
          )}
        </div>

        <div className="message-bubble">
          {renderFormattedContent(message.content)}
        </div>

        {isValentine && message.content && (
          <div className="message-actions">
            <button
              type="button"
              className="copy-btn"
              onClick={handleCopy}
              title="Copy response"
            >
              {copied ? '✓ Copied' : '📋 Copy advice'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
