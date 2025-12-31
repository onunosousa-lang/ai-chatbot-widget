# Quick Config File Guide

## Creating a New Client Config

### 1. Copy the template:
```bash
cp config.template.json config.yourclient.json
```

### 2. Edit these fields:

| Field | Description | Example |
|-------|-------------|---------|
| **clientId** | Unique identifier (lowercase, no spaces) | `"acmecorp"` |
| **primaryColor** | Main brand color (hex) | `"#FF5733"` |
| **secondaryColor** | Accent color (hex) | `"#C70039"` |
| **companyName** | Client's company name | `"Acme Corporation"` |
| **welcomeMessage** | First message users see | `"Hi! How can we help you today?"` |
| **logo** | Logo URL (optional) | `"https://acme.com/logo.png"` |
| **emailAddress** | Client's contact email | `"sales@acme.com"` |
| **whatsappNumber** | WhatsApp number with country code | `"+31612345678"` |

### 3. Customize conversation starters:

```json
"conversationStarters": [
  "💰 What are your prices?",
  "📞 Book a demo",
  "❓ How does it work?",
  "🚀 Get started"
]
```

### 4. Set page-specific triggers:

```json
"pageSpecificTriggers": {
  "/pricing": "Questions about our pricing? 💰",
  "/demo": "Want to see it in action? 🎬",
  "/contact": "Let's talk! 💬"
}
```

### 5. Configure business hours:

```json
"businessHours": {
  "start": "09:00",
  "end": "17:00",
  "days": [1, 2, 3, 4, 5],  // 0=Sunday, 1=Monday, etc.
  "timezone": "Europe/Amsterdam"
}
```

## Quick Start Example

**For a client called "TechStartup":**

```bash
# 1. Copy template
cp config.template.json config.techstartup.json

# 2. Edit the file - change:
# - clientId: "techstartup"
# - companyName: "TechStartup Inc"
# - primaryColor: "#7C3AED" (purple)
# - welcomeMessage: "Hi! Looking to scale your SaaS? 🚀"

# 3. Upload to Vercel
git add config.techstartup.json
git commit -m "Add TechStartup client config"
git push

# 4. Client embeds on their site:
<script src="https://your-url/chatbot.js"
        data-config="https://your-url/config.techstartup.json">
</script>
```

## All Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiUrl` | string | (required) | Your API endpoint |
| `clientId` | string | "default" | Unique client identifier |
| `primaryColor` | string | "#2ee8c2" | Main brand color |
| `secondaryColor` | string | "#1661a0" | Accent color |
| `companyName` | string | "Chatbots-IA" | Company name |
| `welcomeMessage` | string | "Hi! How can I help..." | Opening message |
| `placeholder` | string | "Type your message..." | Input placeholder |
| `position` | string | "bottom-right" | Widget position |
| `logo` | string | null | Logo URL |
| `emailButton` | boolean | true | Show email button |
| `whatsappButton` | boolean | true | Show WhatsApp button |
| `emailAddress` | string | - | Contact email |
| `whatsappNumber` | string | - | WhatsApp number |
| `buttonSize` | string | "60px" | Chat button size |
| `chatHeight` | string | "450px" | Chat window height |
| `chatWidth` | string | "380px" | Chat window width |
| `zIndex` | number | 9999 | CSS z-index |
| `conversationStarters` | array | [] | Quick action buttons |
| `showLanguageSelector` | boolean | false | Show EN/NL switcher |
| `languages` | array | ["nl", "en"] | Available languages |
| `defaultLanguage` | string | "nl" | Default language |
| `proactiveTrigger` | boolean | true | Auto-open chat |
| `socialProof` | boolean | false | Show notifications |
| `calendlyUrl` | string | null | Calendly booking URL |
| `enableSound` | boolean | true | Sound notifications |
| `enableSessionPersistence` | boolean | true | Remember chats |
| `enableAnalytics` | boolean | true | Track events |
| `enableTypingDelay` | boolean | true | Natural typing |
| `showRating` | boolean | true | Conversation rating |
| `detectReturningUsers` | boolean | true | Greet returning users |
| `businessHours` | object | null | Operating hours |
| `pageSpecificTriggers` | object | {} | URL-based messages |

## Pro Tips

### Colors
- Use client's brand colors from their website
- Check contrast: text should be readable on colored backgrounds
- Test on mobile (some colors look different on small screens)

### Welcome Message
- Keep it short (max 80 characters)
- Use emoji sparingly (1-2 max)
- Be specific about what you help with
- Examples:
  - B2B SaaS: "Looking to boost your sales pipeline? 🚀"
  - E-commerce: "Need help finding the perfect product? 🛍️"
  - Real Estate: "Ready to find your dream home? 🏡"
  - Consulting: "Let's solve your business challenges 💡"

### Conversation Starters
- Use 3-4 buttons (max 5)
- Start with emoji for visual appeal
- Make them actionable ("Book a call" not "Calls")
- Order by importance (most important first)

### Page-Specific Triggers
- Match the page content
- Be helpful, not salesy
- Examples:
  - `/pricing`: "Questions about our pricing? Let's find the right plan! 💰"
  - `/case-studies`: "Want to know how we helped similar companies? 📊"
  - `/blog/article-name`: "Have questions about this topic? 💬"
  - `/checkout`: "Need help completing your order? 🛒"

### Business Hours
- Set realistic hours (don't promise 24/7 if you can't deliver)
- Outside hours, bot focuses on lead collection
- Use client's timezone (not yours!)

## Testing Your Config

1. **Upload to Vercel:**
   ```bash
   git add config.yourclient.json
   git commit -m "Add new client config"
   git push
   ```

2. **Test in browser:**
   ```
   https://your-vercel-url/examples/basic.html?config=config.yourclient.json
   ```

3. **Check console for errors:**
   - Press F12 → Console tab
   - Look for: "Chatbot initialized with clientId: yourclient"

4. **Verify branding:**
   - Colors match client's brand ✓
   - Logo displays correctly ✓
   - Welcome message is clear ✓
   - Conversation starters make sense ✓

## Common Mistakes

❌ **Wrong clientId format:**
```json
"clientId": "Acme Corp"  // ❌ Has space and capital
"clientId": "acme-corp"  // ✅ Correct
```

❌ **Invalid color:**
```json
"primaryColor": "blue"   // ❌ Use hex
"primaryColor": "#0000FF" // ✅ Correct
```

❌ **Missing country code:**
```json
"whatsappNumber": "612345678"      // ❌ Missing +31
"whatsappNumber": "+31612345678"   // ✅ Correct
```

❌ **Wrong timezone:**
```json
"timezone": "Amsterdam"            // ❌ Invalid
"timezone": "Europe/Amsterdam"     // ✅ Correct
```

## Need Help?

- Example config: `config.groenvastbouw.json`
- Template: `config.template.json`
- Full guide: `CLIENT_SETUP_GUIDE.md`
