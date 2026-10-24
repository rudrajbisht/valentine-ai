import React from 'react';

const SUGGESTIONS = [
  {
    icon: '✨',
    title: 'Smart-Casual Styling',
    prompt: 'What does "smart-casual" mean for an evening dinner, and what outfit formula works best?',
  },
  {
    icon: '🎨',
    title: 'Color Coordination',
    prompt: 'What colors and shoe shades pair harmoniously with olive green pants?',
  },
  {
    icon: '🧥',
    title: 'Capsule Wardrobe',
    prompt: 'How can I build a versatile 10-piece capsule wardrobe using staple pieces I already own?',
  },
  {
    icon: '👟',
    title: 'Footwear & Silhouettes',
    prompt: 'How can I style clean white sneakers with tailored trousers without looking overly sporty?',
  },
  {
    icon: '☀️',
    title: 'Seasonal Transition',
    prompt: 'How can I easily transition lightweight summer dresses or shirts into cozy fall outfits?',
  },
  {
    icon: '🪄',
    title: 'Restyle Your Closet',
    prompt: 'I have a classic navy blazer and white button-down. Give me 3 distinct outfits for different settings.',
  },
];

export default function StyleSuggestions({ onSelectPrompt, disabled }) {
  return (
    <div className="suggestions-section">
      <div className="suggestions-header">
        <span className="suggestions-sparkle">✦</span>
        <h3 className="suggestions-title">Inspiration & Common Style Inquiries</h3>
      </div>
      <div className="suggestions-grid">
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className="suggestion-card"
            onClick={() => onSelectPrompt(item.prompt)}
            disabled={disabled}
          >
            <div className="card-top">
              <span className="card-icon">{item.icon}</span>
              <span className="card-title">{item.title}</span>
            </div>
            <p className="card-prompt">"{item.prompt}"</p>
          </button>
        ))}
      </div>
    </div>
  );
}
