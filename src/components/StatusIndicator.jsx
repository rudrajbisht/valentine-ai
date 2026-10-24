import React, { useState } from 'react';

export default function StatusIndicator({ status, onRefresh, modelName }) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="status-container">
      <button
        type="button"
        className={`status-pill ${status.connected ? 'status-online' : 'status-offline'}`}
        onClick={() => setShowHelp(!showHelp)}
        title="Click for connection status and details"
        aria-label="Toggle Ollama connection status details"
      >
        <span className="status-dot" />
        <span className="status-text">
          {status.loading
            ? 'Checking Ollama...'
            : status.connected
            ? `Ollama Online (${modelName})`
            : 'Ollama Offline'}
        </span>
      </button>

      {showHelp && (
        <div className="status-modal-backdrop" onClick={() => setShowHelp(false)}>
          <div className="status-modal" onClick={(e) => e.stopPropagation()}>
            <div className="status-modal-header">
              <h3>Local AI Engine Status</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowHelp(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="status-modal-body">
              <div className="status-row">
                <span className="label">Ollama Service:</span>
                <span className={`badge ${status.connected ? 'badge-success' : 'badge-danger'}`}>
                  {status.connected ? 'Running (localhost:11434)' : 'Not Reachable'}
                </span>
              </div>

              <div className="status-row">
                <span className="label">Active Model:</span>
                <span className="badge badge-neutral">{modelName}</span>
              </div>

              {status.connected && (
                <div className="status-row">
                  <span className="label">Model Installed:</span>
                  <span className={`badge ${status.installedTarget ? 'badge-success' : 'badge-warning'}`}>
                    {status.installedTarget ? 'Ready' : 'Not Found in Ollama'}
                  </span>
                </div>
              )}

              {!status.connected ? (
                <div className="troubleshoot-guide">
                  <p className="troubleshoot-title">How to start Ollama on your computer:</p>
                  <ol>
                    <li>Make sure the <strong>Ollama</strong> application is launched.</li>
                    <li>
                      Open <strong>PowerShell</strong> or <strong>Command Prompt</strong> and run:
                      <code>ollama run {modelName}</code>
                    </li>
                    <li>Wait for the model to download and load into memory.</li>
                    <li>Click <strong>Check Again</strong> below once started.</li>
                  </ol>
                </div>
              ) : !status.installedTarget ? (
                <div className="troubleshoot-guide">
                  <p className="troubleshoot-title">Model not downloaded yet:</p>
                  <p>Open your command prompt and run:</p>
                  <code>ollama pull {modelName}</code>
                </div>
              ) : (
                <p className="status-success-note">
                  ✨ Everything is configured properly! Your messages are processed locally by Gemma 3.
                </p>
              )}
            </div>

            <div className="status-modal-footer">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  onRefresh();
                }}
              >
                🔄 Check Again
              </button>
              <button
                type="button"
                className="primary-btn-sm"
                onClick={() => setShowHelp(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
