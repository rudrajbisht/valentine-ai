import React, { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSendMessage, isLoading, disabled }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading || disabled) return;

    onSendMessage(trimmed);
    setInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter (unless Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Valentine: e.g., 'What can I pair with olive linen pants for a casual dinner?'"
          rows={1}
          disabled={isLoading || disabled}
          className="chat-textarea"
          aria-label="Ask your fashion stylist"
        />

        <div className="input-controls">
          <span className="input-shortcut-hint">
            Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for newline
          </span>

          <button
            type="submit"
            disabled={!input.trim() || isLoading || disabled}
            className={`send-btn ${input.trim() && !isLoading ? 'send-btn-active' : ''}`}
            aria-label="Send message"
          >
            {isLoading ? (
              <span className="button-spinner" />
            ) : (
              <span className="send-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
