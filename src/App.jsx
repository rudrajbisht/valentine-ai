import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import StyleSuggestions from './components/StyleSuggestions';
import PrivacyNotice from './components/PrivacyNotice';
import {
  checkOllamaConnection,
  sendChatMessage,
  DEFAULT_MODEL,
} from './services/ollama';

const INITIAL_GREETING = {
  id: 'greeting',
  role: 'assistant',
  content: `Hello! I'm **Valentine**, your personal fashion stylist. ✨

Whether you need help putting together an outfit for an upcoming event, pairing complementary colors, demystifying dress codes, or finding fresh ways to wear favorite pieces already in your closet, I'm here to inspire and guide you.

Feel free to tell me what you're dressing for, or pick an inspiration topic below!`,
  timestamp: 'Just now',
};

export default function App() {
  const [messages, setMessages] = useState([INITIAL_GREETING]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState({
    connected: false,
    loading: true,
    models: [],
    installedTarget: false,
  });

  const chatEndRef = useRef(null);

  // Poll or check Ollama connection on mount
  const verifyConnection = async () => {
    setOllamaStatus((prev) => ({ ...prev, loading: true }));
    const result = await checkOllamaConnection();
    setOllamaStatus({
      connected: result.connected,
      loading: false,
      models: result.models,
      installedTarget: result.installedTarget,
    });
  };

  useEffect(() => {
    verifyConnection();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, errorMessage]);

  const handleSendMessage = async (userText) => {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    setErrorMessage(null);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: timeString,
    };

    const newHistory = [...messages, newUserMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Send conversation history (excluding initial decorative greeting if desired, or include all)
      const apiMessages = newHistory
        .filter((m) => m.id !== 'greeting')
        .map((m) => ({ role: m.role, content: m.content }));

      // If user is just replying to greeting, pass the user message
      const messagesToSend = apiMessages.length > 0 ? apiMessages : [{ role: 'user', content: trimmed }];

      const responseText = await sendChatMessage(messagesToSend, DEFAULT_MODEL);

      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newAssistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: replyTime,
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
      // If successful, update status to connected
      setOllamaStatus((prev) => ({ ...prev, connected: true, installedTarget: true }));
    } catch (err) {
      console.error('Valentine chat error:', err);
      setErrorMessage(err.message || 'An error occurred while contacting Ollama.');
      // Update connection indicator if network failure
      if (err.message && err.message.includes('Unable to connect')) {
        setOllamaStatus((prev) => ({ ...prev, connected: false }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([INITIAL_GREETING]);
    setErrorMessage(null);
  };

  const isInitialState = messages.length <= 1;

  return (
    <div className="app-layout">
      {/* Chic Header */}
      <Header
        status={ollamaStatus}
        onRefreshStatus={verifyConnection}
        modelName={DEFAULT_MODEL}
        onNewChat={handleNewChat}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Main Stylist Stage */}
      <main className="chat-stage">
        <div className="chat-viewport">
          <div className="chat-messages-container">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="message-row message-valentine loading-row">
                <div className="message-avatar">
                  <div className="avatar-stylist">
                    <span>V</span>
                  </div>
                </div>
                <div className="message-bubble-wrapper">
                  <div className="message-sender-bar">
                    <span className="sender-name">Valentine</span>
                    <span className="stylist-badge">Curating Outfits...</span>
                  </div>
                  <div className="message-bubble typing-bubble">
                    <div className="typing-indicator">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                    <span className="typing-text">Valentine is crafting your style advice...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="chat-error-banner" role="alert">
                <div className="error-icon">⚠️</div>
                <div className="error-body">
                  <p className="error-title">Styling Service Notice</p>
                  <p className="error-desc">{errorMessage}</p>
                  <div className="error-actions">
                    <button
                      type="button"
                      className="error-retry-btn"
                      onClick={() => verifyConnection()}
                    >
                      Check Ollama Connection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Initial suggestions if user just started */}
            {isInitialState && !isLoading && (
              <StyleSuggestions
                onSelectPrompt={handleSendMessage}
                disabled={isLoading}
              />
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Floating / Pinned Bottom Input */}
        <footer className="chat-dock">
          <div className="dock-inner">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              disabled={false}
            />
            <div className="dock-footnote">
              <span className="privacy-pill-hint">
                🔒 Private & Local • Powered by <strong>{DEFAULT_MODEL}</strong> on Ollama • No external cloud APIs
              </span>
            </div>
          </div>
        </footer>
      </main>

      {/* Privacy & Transparency Modal */}
      <PrivacyNotice
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
