import React from 'react';

export default function PrivacyNotice({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="privacy-modal-backdrop" onClick={onClose}>
      <div className="privacy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="privacy-modal-header">
          <div className="privacy-modal-title-group">
            <span className="privacy-shield-icon">🛡️</span>
            <h3>Privacy & Recommendation Principles</h3>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="privacy-modal-body">
          <div className="privacy-card-highlight">
            <h4>100% Local Processing</h4>
            <p>
              Valentine AI runs entirely on your local machine using <strong>Ollama</strong> and the <strong>Gemma 3 (1B)</strong> model. None of your messages, personal styling inquiries, or preferences are ever sent to cloud AI APIs, remote telemetry, or third-party servers.
            </p>
          </div>

          <div className="privacy-points-grid">
            <div className="privacy-point">
              <span className="point-icon">🚫</span>
              <div>
                <h5>No Affiliate Marketing</h5>
                <p>Valentine never includes affiliate links, tracking parameters, sponsored cards, or sponsored commissions.</p>
              </div>
            </div>

            <div className="privacy-point">
              <span className="point-icon">🏷️</span>
              <div>
                <h5>No Made-Up Prices or Invented Stores</h5>
                <p>Valentine focuses on styling formulas, color theory, silhouette balance, and pieces you already own—never fabricating live store inventory or fake prices.</p>
              </div>
            </div>

            <div className="privacy-point">
              <span className="point-icon">🔒</span>
              <div>
                <h5>Zero Account or Database Tracking</h5>
                <p>No user accounts, tracking cookies, or external databases are used. Your conversation remains in your browser tab and disappears when you refresh or click New Chat.</p>
              </div>
            </div>

            <div className="privacy-point">
              <span className="point-icon">🤝</span>
              <div>
                <h5>Inclusive, Non-Presumptive Advice</h5>
                <p>Valentine never assumes your gender, body type, budget, or aesthetics unless you choose to provide that context.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="privacy-modal-footer">
          <button type="button" className="primary-btn" onClick={onClose}>
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
