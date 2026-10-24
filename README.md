# Valentine AI — Your Personal Fashion Stylist ✨

> A private, chic, personal fashion stylist powered locally by Google's **Gemma 3 (1B)** model via **Ollama**.

Valentine helps you assemble thoughtful outfits, coordinate colors and silhouettes, understand dress codes, elevate your wardrobe confidence, and make creative use of garments you already own—all with **100% on-device privacy**.

---

## ✨ Features

- **Personalized Outfit Guidance**: Get suggestions for weddings, interviews, date nights, business meetings, and casual outings.
- **Color & Texture Coordination**: Learn how to balance hues, contrast, footwear, and accessory pairings.
- **Dress Code Demystification**: Understand what *smart casual*, *business casual*, *cocktail*, or *black tie* really mean.
- **Closet Optimization**: Restyle items already in your closet into versatile capsule wardrobes.
- **Local & Private AI**: Runs entirely on your own machine using [Ollama](https://ollama.com) and `gemma3:1b`. No messages leave your computer.
- **Inclusive & Respectful**: Style advice with zero assumptions about gender, body type, budget, or lifestyle.
- **No Affiliate / Commercial Clutter**: Zero affiliate links, zero tracking, and zero fake inventory links.
- **Modern Responsive Design**: Chic boutique-inspired design that looks great on desktop and mobile.

---

## 🛠️ Prerequisites

Before running Valentine AI, make sure you have the following installed on your computer:

1. **Node.js** (v18 or newer):
   - Download the LTS installer from [https://nodejs.org](https://nodejs.org).
   - Verify installation in your terminal:
     ```powershell
     node -v
     npm -v
     ```
2. **Ollama**:
   - Download and install from [https://ollama.com](https://ollama.com).
   - In PowerShell or Command Prompt, download and verify the Gemma 3 (1B) model:
     ```powershell
     ollama run gemma3:1b
     ```
   - Keep Ollama running in the background (you can verify it is running by checking `http://localhost:11434` in your browser).

---

## 🚀 Getting Started

### 1. Clone or Open the Project
Open a terminal in the project directory:
```powershell
cd c:\Users\Admin\OneDrive\Desktop\Valentine-Gemma
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Start the Development Server
```powershell
npm run dev
```

The Vite dev server will start (typically at `http://localhost:5173`). Open that URL in your browser to meet Valentine!

---

## ⚙️ How It Works with Ollama

Valentine AI communicates with Ollama's local chat API:
- Endpoint: `http://localhost:11434/api/chat`
- Model: `gemma3:1b`

### Zero-CORS Vite Proxy
Modern browsers block requests from `http://localhost:5173` to `http://localhost:11434` due to Cross-Origin Resource Sharing (CORS). Valentine AI includes a built-in proxy in `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:11434',
      changeOrigin: true
    }
  }
}
```
This means your browser makes requests to `/api/chat` on the local Vite dev server, which cleanly forwards them to Ollama with zero CORS configuration required!

---

## 🔒 Privacy & Safety Guarantee

- **No Cloud AI APIs**: Your styling conversations are never sent to OpenAI, Anthropic, Google Cloud, or third-party servers.
- **No Affiliate Tracking**: No sponsored affiliate links, referral cookies, or product placement.
- **No Data Storage**: The application has no external database, analytics trackers, or user logins. Chat history lives only in your browser tab during your session.

---

## ⚠️ Known Limitations

1. **Local Model Capabilities**: Gemma 3 (1B) is a compact, fast local model. While it excels at creative ideas, color theory, and conversational fashion advice, it may occasionally need follow-up clarification on highly complex or nuanced requests.
2. **Offline Hardware Speed**: Model response time depends on your computer's CPU/GPU performance.
3. **No Live Inventory**: Valentine cannot check whether a specific retailer currently has a shirt in stock; it provides timeless garment formulas and styling strategies rather than live shopping feeds.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
