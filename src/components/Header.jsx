import React from 'react';
import StatusIndicator from './StatusIndicator';

export default function Header({ status, onRefreshStatus, modelName, onNewChat, onOpenPrivacy }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon">
          <span>✨</span>
        </div>
        <div className="brand-text">
          <h1 className="brand-title">Valentine</h1>
          <p className="brand-subtitle">Your Personal AI Stylist</p>
        </div>
      </div>

      <div className="header-actions">
        <StatusIndicator
          status={status}
          onRefresh={onRefreshStatus}
          modelName={modelName}
        />

        <button
          type="button"
          className="header-btn privacy-toggle-btn"
          onClick={onOpenPrivacy}
          title="Privacy details"
          aria-label="View Privacy Details"
        >
          <span className="btn-icon">🔒</span>
          <span className="btn-label">Privacy</span>
        </button>

        <button
          type="button"
          className="header-btn new-chat-btn"
          onClick={onNewChat}
          title="Start a fresh conversation"
          aria-label="Start New Conversation"
        >
          <span className="btn-icon">✎</span>
          <span className="btn-label">New Style Chat</span>
        </button>
      </div>
    </header>
  );
}
