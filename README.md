# Standalone AI Chatbot Widget

A lightweight, fully customizable AI chatbot widget that can be integrated into any website with just one line of code. Perfect for SaaS businesses selling chatbot solutions to clients.

## Features

- **Zero Dependencies** - Pure vanilla JavaScript, no frameworks required
- **Fully Customizable** - Colors, logo, messages, position, and more
- **Responsive Design** - Works perfectly on desktop and mobile
- **Easy Integration** - Just one `<script>` tag
- **Multiple Configuration Methods** - JSON file or inline data attributes
- **Email & WhatsApp Integration** - Built-in contact buttons
- **Beautiful UI** - Modern gradient design with smooth animations
- **API Flexible** - Connect to any backend API endpoint

## Quick Start

### Method 1: Basic Integration (Inline Configuration)

Add this single line to your HTML, right before the closing `</body>` tag:

```html
<script src="https://your-cdn.com/chatbot.js" 
  data-api-url="https://your-api.com/chat"
  data-primary-color="#2ee8c2"
  data-company-name="Your Company"
  data-welcome-message="Hi! How can I help you today?"
></script>
```

### Method 2: JSON Configuration File

Create a `config.json` file:

```json
{
  "apiUrl": "https://your-api.com/chat",
  "primaryColor": "#2ee8c2",
  "companyName": "Your Company",
  "welcomeMessage": "Hi! How can I help you today?"
}
```

Then add this to your HTML:

```html
<script src="https://your-cdn.com/chatbot.js" data-config="config.json"></script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiUrl` | string | *required* | Your chatbot API endpoint |
| `primaryColor` | string | `#2ee8c2` | Main theme color (hex) |
| `secondaryColor` | string | `#1661a0` | Secondary theme color (hex) |
| `companyName` | string | `Chatbots-IA` | Your company name |
| `welcomeMessage` | string | `Hi! How can I help you today?` | Initial bot message |
| `placeholder` | string | `Type your message...` | Input placeholder text |
| `position` | string | `bottom-right` | Widget position (`bottom-right`, `bottom-left`, `top-right`, `top-left`) |
| `logo` | string | `null` | URL to your company logo |
| `emailButton` | boolean | `true` | Show email button |
| `whatsappButton` | boolean | `true` | Show WhatsApp button |
| `emailAddress` | string | `contact@chatbots-ia.com` | Your email address |
| `whatsappNumber` | string | `+31612345678` | Your WhatsApp number (include country code) |
| `buttonSize` | string | `60px` | Floating button size |
| `chatHeight` | string | `450px` | Chat window height |
| `chatWidth` | string | `380px` | Chat window width |
| `zIndex` | number | `9999` | CSS z-index |

## API Endpoint Requirements

Your API endpoint should accept POST requests with this format:

**Request:**
```json
{
  "message": "User's message here"
}
```

**Response:**
```json
{
  "response": "Bot's response here"
}
```

Or alternatively:
```json
{
  "message": "Bot's response here"
}
```

## Examples

### Example 1: Groenvastbouw (Construction Company)

```html
<script src="chatbot.js" data-config="config.groenvastbouw.json"></script>
```

With `config.groenvastbouw.json`:
```json
{
  "apiUrl": "https://api.groenvastbouw.nl/chat",
  "primaryColor": "#00D084",
  "secondaryColor": "#00A86B",
  "companyName": "Groenvast Bouw",
  "welcomeMessage": "Welkom bij Groenvastbouw! 🏡 Hoe kan ik je helpen?",
  "logo": "https://groenvastbouw.nl/logo.png",
  "emailAddress": "info@groenvastbouw.nl",
  "whatsappNumber": "+31612345678"
}
```

### Example 2: Minimal Setup

```html
<script src="chatbot.js" 
  data-api-url="https://api.example.com/chat"
></script>
```

### Example 3: Custom Branding

```html
<script src="chatbot.js" 
  data-api-url="https://api.example.com/chat"
  data-primary-color="#FF6B6B"
  data-secondary-color="#4ECDC4"
  data-company-name="TechCorp"
  data-logo="https://example.com/logo.png"
  data-position="bottom-left"
></script>
```

## Deployment Options

### Option 1: Self-Hosted

1. Upload `chatbot.js` to your web server
2. Reference it directly:
```html
<script src="/path/to/chatbot.js" data-config="config.json"></script>
```

### Option 2: CDN (Recommended for Clients)

1. Upload to a CDN (Cloudflare, AWS S3, Vercel, etc.)
2. Use the CDN URL:
```html
<script src="https://cdn.yourcompany.com/chatbot.js" data-config="config.json"></script>
```

### Option 3: GitHub Pages

1. Create a GitHub repository
2. Upload `chatbot.js` and `config.json`
3. Enable GitHub Pages
4. Use the GitHub Pages URL:
```html
<script src="https://username.github.io/repo-name/chatbot.js" data-config="config.json"></script>
```

## For SaaS Providers

### Selling to Clients

When selling this chatbot to clients, you can:

1. **Host the widget** on your infrastructure
2. **Create client-specific config files** (e.g., `config.client1.json`, `config.client2.json`)
3. **Provide a simple integration snippet** to each client:

```html
<script src="https://your-saas.com/chatbot.js" 
  data-config="https://your-saas.com/configs/client-name.json"
></script>
```

### Multi-Tenant Setup

For managing multiple clients:

1. Create a config file for each client
2. Store configs in a database and serve via API
3. Use client ID in the config URL:

```html
<script src="https://your-saas.com/chatbot.js" 
  data-config="https://your-saas.com/api/config/CLIENT_ID"
></script>
```

### White-Label Option

To completely white-label the solution:

1. Replace `chatbot.js` with your branding
2. Host on your own domain
3. Provide clients with your branded URL

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Size

- **chatbot.js**: ~15KB (uncompressed)
- **chatbot.js**: ~5KB (gzipped)

## Security Considerations

- Always use HTTPS for API endpoints
- Validate and sanitize user input on your backend
- Implement rate limiting on your API
- Use CORS headers to restrict API access
- Never expose sensitive API keys in the frontend

## Troubleshooting

### Chatbot doesn't appear
- Check browser console for errors
- Verify the script URL is correct
- Ensure `data-api-url` is set

### API errors
- Check your API endpoint is accessible
- Verify CORS headers are set correctly
- Check API response format matches requirements

### Styling conflicts
- Adjust `zIndex` if the widget is hidden behind other elements
- Check for CSS conflicts with your website

## License

This chatbot widget is proprietary software owned by Chatbots-IA B.V.

## Support

For support, email: support@chatbots-ia.com

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Author:** Chatbots-IA B.V.
