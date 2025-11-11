/**
 * Standalone AI Chatbot Widget
 * Version: 1.0.0
 * 
 * Easy integration: Just add this script to your website
 * <script src="chatbot.js" data-config="config.json"></script>
 * 
 * Or configure inline:
 * <script src="chatbot.js" 
 *   data-api-url="https://your-api.com/chat"
 *   data-primary-color="#2ee8c2"
 *   data-company-name="Your Company"
 * ></script>
 */

(function() {
  'use strict';

  // Default configuration
  const defaultConfig = {
    apiUrl: 'https://3000-irvo1u0aih222qf3n5e3g-1f25e7df.manusvm.computer/api/chatbot/chat',
    primaryColor: '#2ee8c2',
    secondaryColor: '#1661a0',
    companyName: 'Chatbots-IA',
    welcomeMessage: 'Hi! How can I help you today?',
    placeholder: 'Type your message...',
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    logo: null, // URL to company logo
    emailButton: true,
    whatsappButton: true,
    emailAddress: 'contact@chatbots-ia.com',
    whatsappNumber: '+31612345678',
    buttonSize: '60px',
    chatHeight: '450px',
    chatWidth: '380px',
    zIndex: 9999
  };

  // Get script tag and read data attributes
  const scriptTag = document.currentScript;
  const configFile = scriptTag?.getAttribute('data-config');
  
  // Parse inline configuration from data attributes
  const inlineConfig = {};
  if (scriptTag) {
    const attrs = scriptTag.attributes;
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      if (attr.name.startsWith('data-') && attr.name !== 'data-config') {
        const key = attr.name.replace('data-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        inlineConfig[key] = attr.value;
      }
    }
  }

  let config = { ...defaultConfig, ...inlineConfig };

  // Load configuration from JSON file if specified
  if (configFile) {
    fetch(configFile)
      .then(res => res.json())
      .then(jsonConfig => {
        config = { ...config, ...jsonConfig };
        initChatbot();
      })
      .catch(err => {
        console.warn('Failed to load chatbot config file, using defaults:', err);
        initChatbot();
      });
  } else {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
      initChatbot();
    }
  }

  function initChatbot() {
    // Inject CSS
    injectStyles();
    
    // Create chatbot HTML
    const chatbotHTML = createChatbotHTML();
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    // Attach event listeners
    attachEventListeners();
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .chatbot-container {
        position: fixed;
        ${getPositionStyles()}
        z-index: ${config.zIndex};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .chatbot-button {
        width: ${config.buttonSize};
        height: ${config.buttonSize};
        border-radius: 50%;
        background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 0 ${config.primaryColor};
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
        position: relative;
      }

      .chatbot-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      }

      .chatbot-button svg {
        width: 30px;
        height: 30px;
        fill: white;
      }

      .chatbot-button-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ff4444;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        animation: bounce 1s infinite;
      }

      @keyframes pulse {
        0%, 100% {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 0 ${config.primaryColor};
        }
        50% {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 10px rgba(46,232,194,0);
        }
      }

      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }

      .chatbot-window {
        width: ${config.chatWidth};
        height: ${config.chatHeight};
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        display: none;
        flex-direction: column;
        overflow: hidden;
        margin-bottom: 10px;
      }

      .chatbot-window.open {
        display: flex;
      }

      .chatbot-header {
        background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .chatbot-header-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .chatbot-logo {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .chatbot-logo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .chatbot-header-text h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .chatbot-header-text p {
        margin: 0;
        font-size: 12px;
        opacity: 0.9;
      }

      .chatbot-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.9;
        transition: opacity 0.2s;
      }

      .chatbot-close:hover {
        opacity: 1;
      }

      .chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: #f8f9fa;
      }

      .chatbot-message {
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
      }

      .chatbot-message.bot {
        align-items: flex-start;
      }

      .chatbot-message.user {
        align-items: flex-end;
      }

      .chatbot-message-content {
        max-width: 80%;
        padding: 10px 14px;
        border-radius: 12px;
        word-wrap: break-word;
      }

      .chatbot-message.bot .chatbot-message-content {
        background: white;
        color: #333;
        border-bottom-left-radius: 4px;
      }

      .chatbot-message.user .chatbot-message-content {
        background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);
        color: white;
        border-bottom-right-radius: 4px;
      }

      .chatbot-typing {
        display: flex;
        gap: 4px;
        padding: 10px 14px;
        background: white;
        border-radius: 12px;
        width: fit-content;
      }

      .chatbot-typing span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${config.primaryColor};
        animation: typing 1.4s infinite;
      }

      .chatbot-typing span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .chatbot-typing span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }

      .chatbot-actions {
        padding: 12px 16px;
        background: white;
        border-top: 1px solid #e0e0e0;
        display: flex;
        gap: 8px;
      }

      .chatbot-action-btn {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid ${config.primaryColor};
        background: white;
        color: ${config.primaryColor};
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .chatbot-action-btn:hover {
        background: ${config.primaryColor};
        color: white;
      }

      .chatbot-input-area {
        padding: 16px;
        background: white;
        border-top: 1px solid #e0e0e0;
        display: flex;
        gap: 8px;
      }

      .chatbot-input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }

      .chatbot-input:focus {
        border-color: ${config.primaryColor};
      }

      .chatbot-send {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      }

      .chatbot-send:hover {
        transform: scale(1.05);
      }

      .chatbot-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }

  function getPositionStyles() {
    const positions = {
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;'
    };
    return positions[config.position] || positions['bottom-right'];
  }

  function createChatbotHTML() {
    const logoHTML = config.logo 
      ? `<img src="${config.logo}" alt="${config.companyName}">`
      : `<svg viewBox="0 0 24 24" fill="${config.primaryColor}"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`;

    return `
      <div class="chatbot-container">
        <div class="chatbot-window" id="chatbot-window">
          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <div class="chatbot-logo">${logoHTML}</div>
              <div class="chatbot-header-text">
                <h3>${config.companyName}</h3>
                <p>Online now</p>
              </div>
            </div>
            <button class="chatbot-close" id="chatbot-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="chatbot-messages" id="chatbot-messages">
            <div class="chatbot-message bot">
              <div class="chatbot-message-content">${config.welcomeMessage}</div>
            </div>
          </div>

          ${config.emailButton || config.whatsappButton ? `
          <div class="chatbot-actions">
            ${config.emailButton ? `
            <button class="chatbot-action-btn" id="chatbot-email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email
            </button>
            ` : ''}
            ${config.whatsappButton ? `
            <button class="chatbot-action-btn" id="chatbot-whatsapp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </button>
            ` : ''}
          </div>
          ` : ''}

          <div class="chatbot-input-area">
            <input 
              type="text" 
              class="chatbot-input" 
              id="chatbot-input" 
              placeholder="${config.placeholder}"
            />
            <button class="chatbot-send" id="chatbot-send">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>

        <button class="chatbot-button" id="chatbot-toggle">
          <svg viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
          <span class="chatbot-button-badge">✨</span>
        </button>
      </div>
    `;
  }

  function attachEventListeners() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const window = document.getElementById('chatbot-window');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const emailBtn = document.getElementById('chatbot-email');
    const whatsappBtn = document.getElementById('chatbot-whatsapp');

    toggleBtn?.addEventListener('click', () => {
      window?.classList.toggle('open');
    });

    closeBtn?.addEventListener('click', () => {
      window?.classList.remove('open');
    });

    sendBtn?.addEventListener('click', sendMessage);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    emailBtn?.addEventListener('click', () => {
      window.location.href = `mailto:${config.emailAddress}`;
    });

    whatsappBtn?.addEventListener('click', () => {
      window.open(`https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank');
    });
  }

  function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input?.value.trim();
    
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    showTyping();

    // Send to API
    fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
      hideTyping();
      addMessage(data.response || data.message || 'Sorry, I could not understand that.', 'bot');
    })
    .catch(err => {
      hideTyping();
      addMessage('Sorry, something went wrong. Please try again later.', 'bot');
      console.error('Chatbot API error:', err);
    });
  }

  function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    messageDiv.innerHTML = `<div class="chatbot-message-content">${escapeHtml(text)}</div>`;
    messagesContainer?.appendChild(messageDiv);
    messagesContainer?.scrollTo(0, messagesContainer.scrollHeight);
  }

  function showTyping() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot';
    typingDiv.id = 'chatbot-typing';
    typingDiv.innerHTML = `
      <div class="chatbot-typing">
        <span></span><span></span><span></span>
      </div>
    `;
    messagesContainer?.appendChild(typingDiv);
    messagesContainer?.scrollTo(0, messagesContainer.scrollHeight);
  }

  function hideTyping() {
    document.getElementById('chatbot-typing')?.remove();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

})();
