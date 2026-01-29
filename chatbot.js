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
    apiUrl: 'https://ai-chatbot-widget-eight.vercel.app/api/chat',
    clientId: 'default', // Client identifier for multi-tenant support
    primaryColor: '#2a3439',
    secondaryColor: '#8eb564',
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
    zIndex: 9999,
    conversationStarters: [], // Quick start questions
    showLanguageSelector: false, // Enable EN/NL switcher
    languages: ['nl', 'en'], // Available languages
    defaultLanguage: 'nl',
    proactiveTrigger: true, // Show proactive messages
    socialProof: false, // Show social proof notifications
    calendlyUrl: null, // Calendly booking URL
    enableSound: true, // Sound notifications
    enableSessionPersistence: true, // Remember conversations
    enableAnalytics: true, // Track events
    enableTypingDelay: true, // Natural typing simulation
    businessHours: null, // {start: '09:00', end: '17:00', days: [1,2,3,4,5], timezone: 'Europe/Amsterdam'}
    showRating: true, // Conversation rating widget
    detectReturningUsers: true, // Greet returning visitors
    pageSpecificTriggers: {}, // URL-specific proactive messages
    // i18n messages - all user-facing text
    messages: {
      nl: {
        welcomeBack: 'Welkom terug! Hoe kan ik je vandaag helpen? 👋',
        businessHoursOnline: 'Online now',
        businessHoursOffline: 'Offline - Reageren binnen 24u',
        languageChanged: 'Taal gewijzigd naar',
        errorGeneric: 'Sorry, er ging iets mis. Probeer het later opnieuw.',
        errorNoResponse: 'Sorry, ik kon dat niet begrijpen.',
        errorConnection: '❌ Kan geen verbinding maken. Probeer het later opnieuw.',
        retryAttempt: '⚠️ Verbinding probleem. Nieuwe poging...',
        emailSubject: 'Contacto via Chatbot',
        whatsappMessage: 'Olá! Tenho uma pergunta sobre duurzaam bouwen.',
        proactiveTriggers: [
          'Heb je een vraag? Ik help je graag! 💬',
          'Wacht! Heb je nog vragen? 🤔',
          'Zie je iets interessants? Vraag het me! 💡'
        ],
        socialProof: [
          '💬 Jan uit Utrecht kreeg net een offerte',
          '✅ 15 mensen gebruikten deze week de chatbot',
          '⭐ Gemiddelde beoordeling: 4.8/5',
          '🏡 Wij bouwden 23 passieve huizen in 2024'
        ]
      },
      en: {
        welcomeBack: 'Welcome back! How can I help you today? 👋',
        businessHoursOnline: 'Online now',
        businessHoursOffline: 'Offline - Reply within 24h',
        languageChanged: 'Language changed to',
        errorGeneric: 'Sorry, something went wrong. Please try again later.',
        errorNoResponse: 'Sorry, I could not understand that.',
        errorConnection: '❌ Could not connect. Please try again later.',
        retryAttempt: '⚠️ Connection issue. Retrying...',
        emailSubject: 'Contact via Chatbot',
        whatsappMessage: 'Hi! I have a question about sustainable construction.',
        proactiveTriggers: [
          'Have a question? I\'m here to help! 💬',
          'Wait! Any questions? 🤔',
          'See something interesting? Ask me! 💡'
        ],
        socialProof: [
          '💬 John from Utrecht just got a quote',
          '✅ 15 people used the chatbot this week',
          '⭐ Average rating: 4.8/5',
          '🏡 We built 23 passive houses in 2024'
        ]
      }
    }
  };

  // Thread ID storage for conversation continuity
  let currentThreadId = null;

  // Current language
  let currentLanguage = null;

  // Chat history for conversation summary
  let chatHistory = [];

  // Session tracking
  let sessionStartTime = Date.now();
  let pageViewCount = 0;
  let scrollDepth = 0;
  let timeOnPage = 0;
  let interactionCount = 0;
  let unreadCount = 0;
  let isReturningUser = false;
  let lastVisit = null;

  // Analytics tracking
  const analytics = {
    events: [],
    track: function(eventName, data = {}) {
      const event = {
        event: eventName,
        timestamp: new Date().toISOString(),
        clientId: config.clientId,
        sessionId: getSessionId(),
        ...data
      };
      this.events.push(event);

      // Send to Google Analytics if available
      if (config.enableAnalytics && window.gtag) {
        window.gtag('event', eventName, data);
      }

      // Send to custom analytics endpoint if configured
      if (config.analyticsUrl) {
        navigator.sendBeacon(config.analyticsUrl, JSON.stringify(event));
      }

      console.log('📊 Analytics:', eventName, data);
    }
  };

  // Helper function to get localized messages
  function getMessage(key, lang = null) {
    const language = lang || currentLanguage || config.defaultLanguage;
    if (config.messages && config.messages[language] && config.messages[language][key]) {
      return config.messages[language][key];
    }
    // Fallback to default language
    if (config.messages && config.messages[config.defaultLanguage] && config.messages[config.defaultLanguage][key]) {
      return config.messages[config.defaultLanguage][key];
    }
    return '';
  }

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
        min-width: 20px;
        height: 20px;
        padding: 0 6px;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        animation: bounce 1s infinite;
      }

      .chatbot-button-badge.show {
        display: flex;
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
        background: ${config.headerColor || `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)`};
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
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: ${config.headerColor || config.primaryColor};
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 6px;
      }

      .chatbot-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
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
        background: #dcdcdc;
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
        color: #2a3439;
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
        background: ${config.primaryColor};
        color: white;
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
        background: ${config.secondaryColor};
        color: white;
        border-color: ${config.secondaryColor};
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

      /* Conversation Starters */
      .chatbot-starters {
        padding: 12px 16px;
        background: white;
        border-top: 1px solid #e0e0e0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .chatbot-starter-btn {
        padding: 8px 12px;
        border: 1px solid ${config.primaryColor};
        background: ${config.primaryColor};
        color: white;
        border-radius: 16px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s;
        flex: 0 0 auto;
      }

      .chatbot-starter-btn:hover {
        background: ${config.secondaryColor};
        color: white;
        border-color: ${config.secondaryColor};
      }

      /* Contact Form */
      .chatbot-contact-form {
        padding: 16px;
        background: white;
        display: none;
        flex-direction: column;
        gap: 12px;
      }

      .chatbot-contact-form.show {
        display: flex;
      }

      .chatbot-contact-form h4 {
        margin: 0 0 8px 0;
        color: #8eb564;
        font-size: 16px;
      }

      .chatbot-contact-form p {
        margin: 0 0 12px 0;
        color: #2a3439;
        font-size: 14px;
      }

      .chatbot-form-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .chatbot-form-group label {
        font-size: 12px;
        color: #2a3439;
        font-weight: 500;
      }

      .chatbot-form-group input,
      .chatbot-form-group textarea {
        padding: 10px;
        border: 1px solid #dcdcdc;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s;
        background: #dcdcdc;
        color: #2a3439;
      }

      .chatbot-form-group input:focus,
      .chatbot-form-group textarea:focus {
        border-color: #8eb564;
      }

      .chatbot-form-group textarea {
        resize: vertical;
        min-height: 60px;
      }

      .chatbot-form-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }

      .chatbot-form-btn {
        flex: 1;
        padding: 10px 16px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .chatbot-form-btn-primary {
        background: #8eb564;
        color: white;
      }

      .chatbot-form-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        background: #7aa050;
      }

      .chatbot-form-btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .chatbot-form-btn-secondary {
        background: #2a3439;
        color: white;
        border: 1px solid #2a3439;
      }

      .chatbot-form-btn-secondary:hover {
        background: #3a4449;
      }

      .chatbot-form-error {
        color: #dc3545;
        font-size: 12px;
        margin-top: 4px;
      }

      .chatbot-form-success {
        color: #28a745;
        font-size: 14px;
        text-align: center;
        padding: 12px;
        background: #d4edda;
        border-radius: 8px;
      }

      /* Quick Reply Buttons */
      .chatbot-quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 8px;
      }

      .chatbot-quick-reply {
        padding: 6px 12px;
        background: ${config.primaryColor};
        border: 1px solid ${config.primaryColor};
        color: white;
        border-radius: 12px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s;
      }

      .chatbot-quick-reply:hover {
        background: ${config.secondaryColor};
        color: white;
        border-color: ${config.secondaryColor};
      }

      /* Language Selector */
      .chatbot-language-selector {
        display: flex;
        gap: 4px;
        margin-left: auto;
      }

      .chatbot-lang-btn {
        padding: 4px 8px;
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        transition: all 0.2s;
      }

      .chatbot-lang-btn:hover,
      .chatbot-lang-btn.active {
        background: white;
        color: ${config.primaryColor};
      }

      /* Social Proof Notification */
      .chatbot-social-proof {
        position: fixed;
        bottom: 100px;
        ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        background: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 280px;
        animation: slideIn 0.3s ease;
        z-index: ${config.zIndex - 1};
      }

      @keyframes slideIn {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .chatbot-social-proof-close {
        position: absolute;
        top: 4px;
        right: 4px;
        background: none;
        border: none;
        cursor: pointer;
        color: #999;
        font-size: 16px;
      }

      /* Markdown formatting */
      .chatbot-message-content strong {
        font-weight: 600;
      }

      .chatbot-message-content em {
        font-style: italic;
      }

      .chatbot-message-content a {
        color: ${config.primaryColor};
        text-decoration: underline;
      }

      .chatbot-message-content ul,
      .chatbot-message-content ol {
        margin: 8px 0;
        padding-left: 20px;
      }

      .chatbot-message-content li {
        margin: 4px 0;
      }

      /* Proactive message */
      .chatbot-proactive {
        position: fixed;
        bottom: ${parseInt(config.buttonSize) + 30}px;
        ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        background: white;
        padding: 12px 16px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 250px;
        animation: bounce 1s infinite;
        cursor: pointer;
        z-index: ${config.zIndex - 1};
      }

      .chatbot-proactive::after {
        content: '';
        position: absolute;
        bottom: -8px;
        ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid white;
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
            ${config.showLanguageSelector ? `
            <div class="chatbot-language-selector">
              ${config.languages.map(lang => `
                <button class="chatbot-lang-btn ${lang === config.defaultLanguage ? 'active' : ''}"
                        data-lang="${lang}"
                        id="chatbot-lang-${lang}">
                  ${lang.toUpperCase()}
                </button>
              `).join('')}
            </div>
            ` : ''}
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

          <div class="chatbot-starters" id="chatbot-starters" style="display: none;">
            <!-- Conversation starters will be rendered dynamically based on language -->
          </div>

          <div class="chatbot-contact-form" id="chatbot-contact-form">
            <h4>Plan een gesprek</h4>
            <p>Laat je gegevens achter en we nemen zo snel mogelijk contact met je op.</p>
            <form id="chatbot-contact-form-element">
              <div class="chatbot-form-group">
                <label for="chatbot-contact-name">Naam *</label>
                <input type="text" id="chatbot-contact-name" name="name" required placeholder="Je naam">
              </div>
              <div class="chatbot-form-group">
                <label for="chatbot-contact-email">Email *</label>
                <input type="email" id="chatbot-contact-email" name="email" required placeholder="je@email.nl">
              </div>
              <div class="chatbot-form-group">
                <label for="chatbot-contact-phone">Telefoon</label>
                <input type="tel" id="chatbot-contact-phone" name="phone" placeholder="+31 6 1234 5678">
              </div>
              <div class="chatbot-form-group">
                <label for="chatbot-contact-message">Bericht (optioneel)</label>
                <textarea id="chatbot-contact-message" name="message" placeholder="Vertel ons waar je aan denkt..."></textarea>
              </div>
              <div class="chatbot-form-actions">
                <button type="button" class="chatbot-form-btn chatbot-form-btn-secondary" id="chatbot-contact-cancel">
                  Annuleren
                </button>
                <button type="submit" class="chatbot-form-btn chatbot-form-btn-primary" id="chatbot-contact-submit">
                  Verstuur
                </button>
              </div>
            </form>
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
      if (window?.classList.contains('open')) {
        removeProactiveMessage();
      }
    });

    closeBtn?.addEventListener('click', () => {
      window?.classList.remove('open');
    });

    sendBtn?.addEventListener('click', sendMessage);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    emailBtn?.addEventListener('click', () => {
      const subject = getMessage('emailSubject');
      const emailLink = `mailto:${config.emailAddress}?subject=${encodeURIComponent(subject)}`;
      const a = document.createElement('a');
      a.href = emailLink;
      a.target = '_self';
      a.click();
    });

    whatsappBtn?.addEventListener('click', () => {
      const phoneNumber = config.whatsappNumber.replace(/[^0-9]/g, '');
      const message = getMessage('whatsappMessage');
      const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      const a = document.createElement('a');
      a.href = whatsappLink;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
    });

    // Language selector
    if (config.showLanguageSelector) {
      config.languages.forEach(lang => {
        const langBtn = document.getElementById(`chatbot-lang-${lang}`);
        langBtn?.addEventListener('click', () => switchLanguage(lang));
      });
    }

    // Initialize language
    currentLanguage = config.defaultLanguage;

    // Global function for conversation starters (must be defined before updateConversationStarters)
    window.chatbotSendStarter = function(text) {
      // Check if this is a contact request (e.g., "Plan een gesprek", "Schedule a call")
      const isContactRequest = text.toLowerCase().includes('plan') ||
                               text.toLowerCase().includes('schedule') ||
                               text.toLowerCase().includes('gesprek') ||
                               text.toLowerCase().includes('call');

      if (isContactRequest) {
        // Show contact form directly
        showContactForm();
        // Hide starters
        const starters = document.getElementById('chatbot-starters');
        if (starters) starters.style.display = 'none';
      } else {
        // Send as regular message
        const input = document.getElementById('chatbot-input');
        if (input) {
          input.value = text;
          sendMessage();
          // Hide starters after first use
          const starters = document.getElementById('chatbot-starters');
          if (starters) starters.style.display = 'none';
        }
      }
    };

    // Initialize conversation starters with default language
    updateConversationStarters();

    // Setup proactive triggers
    if (config.proactiveTrigger) {
      setupProactiveTriggers();
    }

    // Setup social proof
    if (config.socialProof) {
      setupSocialProof();
    }

    // Global function for quick replies
    window.chatbotSendQuickReply = function(text) {
      document.getElementById('chatbot-input').value = text;
      sendMessage();
    };

    // Contact form event listeners
    const contactFormElement = document.getElementById('chatbot-contact-form-element');
    const contactCancelBtn = document.getElementById('chatbot-contact-cancel');

    if (contactFormElement) {
      contactFormElement.addEventListener('submit', submitContactForm);
    }

    if (contactCancelBtn) {
      contactCancelBtn.addEventListener('click', () => {
        hideContactForm();
        addMessage(
          currentLanguage === 'en'
            ? 'No problem! How else can I help you today?'
            : 'Geen probleem! Hoe kan ik je anders helpen?',
          'bot'
        );
      });
    }
  }

  function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input?.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Store in chat history
    chatHistory.push({ role: 'user', content: message });

    // Show typing indicator
    showTyping();

    // Send to API with clientId and threadId for multi-tenant support
    // Language preference is sent as metadata, NOT forced instruction
    // The OpenAI Assistant handles language detection and switching
    fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        clientId: config.clientId,
        threadId: currentThreadId,
        language: currentLanguage // Preference only, not forced
      })
    })
    .then(res => res.json())
    .then(data => {
      hideTyping();

      // Store thread ID for conversation continuity
      if (data.threadId) {
        currentThreadId = data.threadId;
      }

      const botResponse = data.response || data.message || getMessage('errorNoResponse');

      // Store in chat history
      chatHistory.push({ role: 'assistant', content: botResponse });

      addMessage(botResponse, 'bot');
    })
    .catch(err => {
      hideTyping();
      addMessage(getMessage('errorGeneric'), 'bot');
      console.error('Chatbot API error:', err);
    });
  }

  function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;

    // Check for quick reply buttons syntax [BUTTONS: Option 1 | Option 2]
    const buttonMatch = text.match(/\[BUTTONS:\s*(.*?)\]/);
    let messageText = text;
    let buttons = null;

    if (buttonMatch && sender === 'bot') {
      buttons = buttonMatch[1].split('|').map(b => b.trim());
      messageText = text.replace(/\[BUTTONS:\s*.*?\]/, '').trim();
    }

    // Parse markdown for bot messages
    const formattedText = sender === 'bot' ? parseMarkdown(messageText) : escapeHtml(messageText);

    let html = `<div class="chatbot-message-content">${formattedText}</div>`;

    // Add quick reply buttons if present
    if (buttons && buttons.length > 0) {
      html += '<div class="chatbot-quick-replies">';
      buttons.forEach(btn => {
        html += `<button class="chatbot-quick-reply" onclick="window.chatbotSendQuickReply('${btn.replace(/'/g, "\\'")}')">
          ${escapeHtml(btn)}
        </button>`;
      });
      html += '</div>';
    }

    messageDiv.innerHTML = html;
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

  // Parse markdown formatting
  function parseMarkdown(text) {
    let html = escapeHtml(text);

    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Links [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Unordered lists
    html = html.replace(/^\- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    return html;
  }

  // Update conversation starters based on current language
  function updateConversationStarters() {
    const starters = getMessage('conversationStarters') || [];
    const startersContainer = document.getElementById('chatbot-starters');

    if (!startersContainer) return;
    if (starters.length === 0) return;

    // Clear existing buttons
    startersContainer.innerHTML = '';

    // Add new buttons based on current language
    starters.forEach(starter => {
      const button = document.createElement('button');
      button.className = 'chatbot-starter-btn';
      button.textContent = starter;
      button.onclick = () => {
        window.chatbotSendStarter(starter);
      };
      startersContainer.appendChild(button);
    });

    // Show the container
    startersContainer.style.display = 'flex';
  }

  // Switch language
  function switchLanguage(lang) {
    currentLanguage = lang;

    // Update button states
    config.languages.forEach(l => {
      const btn = document.getElementById(`chatbot-lang-${l}`);
      if (btn) {
        if (l === lang) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    });

    // Update conversation starters with new language
    updateConversationStarters();

    // Add system message
    const langNames = { 'nl': 'Nederlands', 'en': 'English' };
    const msg = `${getMessage('languageChanged', lang)} ${langNames[lang]}`;

    addMessage(msg, 'bot');
  }

  // Setup proactive chat triggers
  function setupProactiveTriggers() {
    let triggered = false;
    const triggers = getMessage('proactiveTriggers') || [];

    // Trigger after 30 seconds on page
    setTimeout(() => {
      if (!triggered && !document.getElementById('chatbot-window')?.classList.contains('open') && triggers[0]) {
        showProactiveMessage(triggers[0]);
        triggered = true;
      }
    }, 30000);

    // Exit intent (mouse leaving viewport)
    document.addEventListener('mouseleave', (e) => {
      if (!triggered && e.clientY < 10 && !document.getElementById('chatbot-window')?.classList.contains('open') && triggers[1]) {
        showProactiveMessage(triggers[1]);
        triggered = true;
      }
    });

    // After scrolling 50%
    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (!scrollTriggered && scrollPercent > 50 && !document.getElementById('chatbot-window')?.classList.contains('open') && triggers[2]) {
        showProactiveMessage(triggers[2]);
        scrollTriggered = true;
      }
    });
  }

  function showProactiveMessage(message) {
    const existing = document.getElementById('chatbot-proactive-msg');
    if (existing) return;

    const proactiveDiv = document.createElement('div');
    proactiveDiv.id = 'chatbot-proactive-msg';
    proactiveDiv.className = 'chatbot-proactive';
    proactiveDiv.textContent = message;
    proactiveDiv.onclick = () => {
      document.getElementById('chatbot-window')?.classList.add('open');
      removeProactiveMessage();
    };

    document.body.appendChild(proactiveDiv);

    // Auto-remove after 10 seconds
    setTimeout(removeProactiveMessage, 10000);
  }

  function removeProactiveMessage() {
    const msg = document.getElementById('chatbot-proactive-msg');
    if (msg) msg.remove();
  }

  // Setup social proof notifications
  function setupSocialProof() {
    const messages = getMessage('socialProof') || [];
    if (messages.length === 0) return;

    let currentIndex = 0;

    setInterval(() => {
      if (!document.getElementById('chatbot-window')?.classList.contains('open')) {
        showSocialProof(messages[currentIndex]);
        currentIndex = (currentIndex + 1) % messages.length;
      }
    }, 120000); // Every 2 minutes
  }

  function showSocialProof(message) {
    const existing = document.getElementById('chatbot-social-proof');
    if (existing) return;

    const proofDiv = document.createElement('div');
    proofDiv.id = 'chatbot-social-proof';
    proofDiv.className = 'chatbot-social-proof';
    proofDiv.innerHTML = `
      ${escapeHtml(message)}
      <button class="chatbot-social-proof-close" onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(proofDiv);

    // Auto-remove after 8 seconds
    setTimeout(() => {
      const proof = document.getElementById('chatbot-social-proof');
      if (proof) proof.remove();
    }, 8000);
  }

  // ===== PREMIUM FEATURES =====

  // Session ID generator
  function getSessionId() {
    let sessionId = localStorage.getItem('chatbot_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chatbot_session_id', sessionId);
    }
    return sessionId;
  }

  // Load session from localStorage
  function loadSession() {
    if (!config.enableSessionPersistence) return false;

    try {
      const saved = localStorage.getItem('chatbot_session');
      if (!saved) return false;

      const session = JSON.parse(saved);
      const age = Date.now() - session.timestamp;

      // Expire after 24 hours
      if (age > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('chatbot_session');
        return false;
      }

      // Restore session
      currentThreadId = session.threadId;
      chatHistory = session.chatHistory || [];
      currentLanguage = session.language || config.defaultLanguage;

      // Update conversation starters with restored language
      updateConversationStarters();

      // Restore chat messages in UI
      if (chatHistory.length > 0) {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = '';
        chatHistory.forEach(msg => {
          addMessage(msg.content, msg.role === 'user' ? 'user' : 'bot');
        });
      }

      analytics.track('session_restored', {
        messageCount: chatHistory.length,
        age: Math.round(age / 1000 / 60) + ' minutes'
      });

      return true;
    } catch (e) {
      console.error('Error loading session:', e);
      return false;
    }
  }

  // Save session to localStorage
  function saveSession() {
    if (!config.enableSessionPersistence) return;

    try {
      const session = {
        threadId: currentThreadId,
        chatHistory: chatHistory,
        language: currentLanguage,
        timestamp: Date.now()
      };
      localStorage.setItem('chatbot_session', JSON.stringify(session));
    } catch (e) {
      console.error('Error saving session:', e);
    }
  }

  // Detect returning users
  function detectReturningUser() {
    if (!config.detectReturningUsers) return;

    const visits = localStorage.getItem('chatbot_visits');
    const lastVisit = localStorage.getItem('chatbot_last_visit');

    if (visits) {
      isReturningUser = true;
      const visitCount = parseInt(visits) + 1;
      localStorage.setItem('chatbot_visits', visitCount.toString());
      localStorage.setItem('chatbot_last_visit', Date.now().toString());

      analytics.track('returning_user', {
        visits: visitCount,
        lastVisit: lastVisit ? new Date(parseInt(lastVisit)).toISOString() : 'unknown'
      });

      // Show personalized welcome if no active session
      if (!currentThreadId && visitCount > 1) {
        setTimeout(() => {
          const msg = getMessage('welcomeBack');

          // Update welcome message
          const welcomeMsg = document.querySelector('.chatbot-message.bot .chatbot-message-content');
          if (welcomeMsg && msg) {
            welcomeMsg.textContent = msg;
          }
        }, 500);
      }
    } else {
      localStorage.setItem('chatbot_visits', '1');
      localStorage.setItem('chatbot_last_visit', Date.now().toString());

      analytics.track('new_user', {});
    }
  }

  // Check business hours
  function isWithinBusinessHours() {
    if (!config.businessHours) return true;

    try {
      const { start, end, days, timezone } = config.businessHours;
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone || 'Europe/Amsterdam' }));

      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const currentTime = now.getHours() * 100 + now.getMinutes(); // e.g., 14:30 = 1430

      const startTime = parseInt(start.replace(':', ''));
      const endTime = parseInt(end.replace(':', ''));

      const isWorkingDay = days.includes(currentDay);
      const isWorkingHours = currentTime >= startTime && currentTime <= endTime;

      return isWorkingDay && isWorkingHours;
    } catch (e) {
      console.error('Error checking business hours:', e);
      return true;
    }
  }

  // Update business hours status
  function updateBusinessHoursStatus() {
    if (!config.businessHours) return;

    const statusText = document.querySelector('.chatbot-header-text p');
    if (!statusText) return;

    if (isWithinBusinessHours()) {
      statusText.textContent = getMessage('businessHoursOnline');
      statusText.style.color = '#4CAF50';
    } else {
      statusText.textContent = getMessage('businessHoursOffline');
      statusText.style.color = '#FF9800';
    }
  }

  // Update unread badge
  function updateUnreadBadge() {
    const badge = document.querySelector('.chatbot-button-badge');
    if (!badge) return;

    if (unreadCount > 0) {
      badge.textContent = unreadCount > 9 ? '9+' : unreadCount.toString();
      badge.classList.add('show');

      // Update page title
      if (document.hidden) {
        document.title = `(${unreadCount}) ${document.title.replace(/^\(\d+\)\s*/, '')}`;
      }
    } else {
      badge.classList.remove('show');
      document.title = document.title.replace(/^\(\d+\)\s*/, '');
    }
  }

  // Play notification sound
  function playNotificationSound() {
    if (!config.enableSound) return;

    try {
      // Create simple notification beep using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Could not play sound:', e);
    }
  }

  // Natural typing delay
  function calculateTypingDelay(text) {
    if (!config.enableTypingDelay) return 0;

    // Simulate ~60 characters per second typing speed
    const charsPerSecond = 60;
    const baseDelay = (text.length / charsPerSecond) * 1000;

    // Add random variance (±20%)
    const variance = baseDelay * 0.2;
    const delay = baseDelay + (Math.random() * variance * 2 - variance);

    // Min 800ms, max 4000ms
    return Math.max(800, Math.min(4000, delay));
  }

  // Enhanced add message with typing delay
  const originalAddMessage = addMessage;
  function addMessageWithDelay(text, sender) {
    if (sender === 'bot' && config.enableTypingDelay) {
      const delay = calculateTypingDelay(text);

      setTimeout(() => {
        originalAddMessage(text, sender);

        // Update unread count if chat is closed
        if (!document.getElementById('chatbot-window')?.classList.contains('open')) {
          unreadCount++;
          updateUnreadBadge();
          playNotificationSound();
        }

        saveSession();
      }, delay);
    } else {
      originalAddMessage(text, sender);
      saveSession();
    }
  }

  // Replace addMessage with delayed version
  addMessage = addMessageWithDelay;

  // Smart retry logic for API calls
  async function sendMessageWithRetry(message, retries = 3) {
    const input = document.getElementById('chatbot-input');

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Get page context
        const pageContext = {
          url: window.location.href,
          title: document.title,
          referrer: document.referrer
        };

        // Send message with context and language preference
        // Language is handled by the OpenAI Assistant, not forced here
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            clientId: config.clientId,
            threadId: currentThreadId,
            language: currentLanguage, // Preference only
            pageContext: pageContext
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        hideTyping();

        // Store thread ID for conversation continuity
        if (data.threadId) {
          currentThreadId = data.threadId;
        }

        const botResponse = data.response || data.message || getMessage('errorNoResponse');

        // Store in chat history
        chatHistory.push({ role: 'assistant', content: botResponse });

        addMessage(botResponse, 'bot');

        analytics.track('message_received', {
          messageLength: botResponse.length,
          attempt: attempt
        });

        return; // Success!

      } catch (err) {
        console.error(`API call attempt ${attempt}/${retries} failed:`, err);

        if (attempt < retries) {
          // Show retry message
          const retryMsg = `${getMessage('retryAttempt')} (${attempt}/${retries})`;

          // Update typing indicator with retry message
          const typingDiv = document.getElementById('chatbot-typing');
          if (typingDiv) {
            typingDiv.querySelector('.chatbot-typing').innerHTML = retryMsg;
          }

          // Exponential backoff: 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
        } else {
          // All retries failed
          hideTyping();
          addMessage(getMessage('errorConnection'), 'bot');

          analytics.track('message_failed', {
            error: err.message,
            attempts: retries
          });
        }
      }
    }
  }

  // Override sendMessage to use retry logic
  sendMessage = function() {
    const input = document.getElementById('chatbot-input');
    const message = input?.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Store in chat history
    chatHistory.push({ role: 'user', content: message });

    // Track analytics
    analytics.track('message_sent', {
      messageLength: message.length,
      conversationLength: chatHistory.length
    });

    // Show typing indicator
    showTyping();

    // Send with retry logic
    sendMessageWithRetry(message);

    // Save session
    saveSession();
  };

  // Mobile optimizations
  function setupMobileOptimizations() {
    const chatWindow = document.getElementById('chatbot-window');
    if (!chatWindow) return;

    // Detect mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    if (isMobile) {
      // Full screen on mobile
      chatWindow.style.width = '100vw';
      chatWindow.style.height = '100vh';
      chatWindow.style.maxHeight = '100vh';
      chatWindow.style.borderRadius = '0';
      chatWindow.style.position = 'fixed';
      chatWindow.style.top = '0';
      chatWindow.style.left = '0';
      chatWindow.style.right = '0';
      chatWindow.style.bottom = '0';
      chatWindow.style.margin = '0';

      // Prevent body scroll when chat is open
      const toggleBtn = document.getElementById('chatbot-toggle');
      toggleBtn?.addEventListener('click', () => {
        if (chatWindow.classList.contains('open')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });

      const closeBtn = document.getElementById('chatbot-close');
      closeBtn?.addEventListener('click', () => {
        document.body.style.overflow = '';
      });

      // Swipe down to close
      let touchStartY = 0;
      let touchEndY = 0;

      chatWindow.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
      });

      chatWindow.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        if (touchEndY - touchStartY > 100) {
          // Swiped down more than 100px
          chatWindow.classList.remove('open');
          document.body.style.overflow = '';
        }
      });

      analytics.track('mobile_optimizations_enabled', {
        userAgent: navigator.userAgent
      });
    }
  }

  // Contact Form Functions
  function showContactForm() {
    const contactForm = document.getElementById('chatbot-contact-form');
    const inputArea = document.querySelector('.chatbot-input-area');
    const starters = document.getElementById('chatbot-starters');

    if (contactForm) {
      contactForm.classList.add('show');
      // Hide input area and starters when form is shown
      if (inputArea) inputArea.style.display = 'none';
      if (starters) starters.style.display = 'none';

      // Add bot message
      addMessage(
        currentLanguage === 'en'
          ? 'Perfect! Please fill in your contact details and we\'ll get back to you as soon as possible.'
          : 'Perfect! Vul je contactgegevens in en we nemen zo snel mogelijk contact met je op.',
        'bot'
      );

      analytics.track('contact_form_shown', {});
    }
  }

  function hideContactForm() {
    const contactForm = document.getElementById('chatbot-contact-form');
    const inputArea = document.querySelector('.chatbot-input-area');
    const starters = document.getElementById('chatbot-starters');

    if (contactForm) {
      contactForm.classList.remove('show');
      // Show input area again
      if (inputArea) inputArea.style.display = 'flex';
      // Show starters again if they were visible
      if (starters && config.conversationStarters && config.conversationStarters.length > 0) {
        starters.style.display = 'flex';
      }

      // Reset form
      const form = document.getElementById('chatbot-contact-form-element');
      if (form) form.reset();
    }
  }

  async function submitContactForm(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('chatbot-contact-submit');
    const form = document.getElementById('chatbot-contact-form-element');

    if (!form) return;

    // Disable submit button
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = currentLanguage === 'en' ? 'Sending...' : 'Versturen...';
    }

    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      clientId: config.clientId,
      clientEmail: config.emailAddress,
      companyName: config.companyName
    };

    try {
      const response = await fetch('https://ai-chatbot-widget-eight.vercel.app/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success! Show confirmation message
        addMessage(
          currentLanguage === 'en'
            ? `Thank you, ${data.name}! We've received your contact details and will get back to you soon. You'll also receive a confirmation email at ${data.email}.`
            : `Bedankt, ${data.name}! We hebben je gegevens ontvangen en nemen zo snel mogelijk contact met je op. Je ontvangt ook een bevestigingsmail op ${data.email}.`,
          'bot'
        );

        analytics.track('contact_form_submitted', {
          name: data.name,
          email: data.email,
          hasPhone: !!data.phone,
          hasMessage: !!data.message
        });

        // Hide form and reset
        setTimeout(() => {
          hideContactForm();
        }, 2000);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      addMessage(
        currentLanguage === 'en'
          ? 'Sorry, something went wrong. Please try again or use the email/WhatsApp buttons below.'
          : 'Sorry, er ging iets mis. Probeer het opnieuw of gebruik de email/WhatsApp knoppen hieronder.',
        'bot'
      );

      analytics.track('contact_form_error', {
        error: error.message
      });
    } finally {
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = currentLanguage === 'en' ? 'Submit' : 'Verstuur';
      }
    }
  }

  // Initialize all premium features
  function initPremiumFeatures() {
    // Load session
    const sessionLoaded = loadSession();

    // Detect returning users
    detectReturningUser();

    // Update business hours status
    updateBusinessHoursStatus();
    setInterval(updateBusinessHoursStatus, 60000); // Update every minute

    // Setup mobile optimizations
    setupMobileOptimizations();

    // Track page visibility for unread notifications
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && document.getElementById('chatbot-window')?.classList.contains('open')) {
        unreadCount = 0;
        updateUnreadBadge();
      }
    });

    // Track chat open/close
    const chatWindow = document.getElementById('chatbot-window');
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          if (chatWindow.classList.contains('open')) {
            unreadCount = 0;
            updateUnreadBadge();
            analytics.track('chatbot_opened', {
              sessionRestored: sessionLoaded
            });
          } else {
            analytics.track('chatbot_closed', {
              conversationLength: chatHistory.length
            });
          }
        }
      });
    });

    observer.observe(chatWindow, { attributes: true });

    // Track session duration on page unload
    window.addEventListener('beforeunload', () => {
      const duration = Date.now() - sessionStartTime;
      analytics.track('session_end', {
        duration: Math.round(duration / 1000) + 's',
        interactions: interactionCount,
        conversationLength: chatHistory.length
      });
    });

    analytics.track('premium_features_initialized', {
      sessionPersistence: config.enableSessionPersistence,
      returningUsers: config.detectReturningUsers,
      analytics: config.enableAnalytics,
      typingDelay: config.enableTypingDelay,
      sound: config.enableSound
    });
  }

  // Call initialization after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPremiumFeatures);
  } else {
    initPremiumFeatures();
  }

})();
