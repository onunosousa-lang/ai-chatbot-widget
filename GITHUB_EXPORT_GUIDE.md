# GitHub Export Guide

Complete guide for exporting the standalone chatbot widget to GitHub and distributing it to clients.

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like: `ai-chatbot-widget` or `chatbot-js`
3. Make it **Public** (so clients can access the files) or **Private** (if you want to control access)
4. Initialize with a README (optional, we'll replace it)

## Step 2: Prepare Files for Export

The chatbot widget folder contains everything you need:

```
chatbot-widget/
├── chatbot.js                      # Main widget file
├── config.json                     # Default configuration template
├── config.groenvastbouw.json       # Example client config
├── README.md                       # Documentation
├── GITHUB_EXPORT_GUIDE.md          # This file
└── examples/
    ├── basic.html                  # Basic integration example
    └── advanced.html               # Advanced integration example
```

## Step 3: Push to GitHub

### Option A: Using Git Command Line

```bash
# Navigate to the chatbot-widget folder
cd /path/to/chatbot-widget

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Standalone AI Chatbot Widget v1.0.0"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/ai-chatbot-widget.git

# Push to GitHub
git push -u origin main
```

### Option B: Using GitHub Desktop

1. Open GitHub Desktop
2. Click "Add" → "Add Existing Repository"
3. Select the `chatbot-widget` folder
4. Click "Publish repository"
5. Choose repository name and visibility
6. Click "Publish"

### Option C: Upload via GitHub Web Interface

1. Go to your repository on GitHub
2. Click "Add file" → "Upload files"
3. Drag and drop all files from `chatbot-widget/` folder
4. Click "Commit changes"

## Step 4: Enable GitHub Pages (Optional but Recommended)

This allows clients to load the chatbot directly from GitHub:

1. Go to repository Settings
2. Scroll to "Pages" section
3. Under "Source", select "main" branch
4. Click "Save"
5. Your chatbot will be available at: `https://YOUR_USERNAME.github.io/ai-chatbot-widget/chatbot.js`

## Step 5: Create Releases (Recommended)

Create versioned releases for better client management:

1. Go to "Releases" in your repository
2. Click "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: "Standalone AI Chatbot Widget v1.0.0"
5. Description: List features and changes
6. Attach `chatbot.js` as a binary
7. Click "Publish release"

Clients can then use specific versions:
```html
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ai-chatbot-widget@v1.0.0/chatbot.js"></script>
```

## Step 6: Distribution to Clients

### Method 1: Direct GitHub Link

Provide clients with:
```html
<script src="https://YOUR_USERNAME.github.io/ai-chatbot-widget/chatbot.js" 
  data-config="https://YOUR_USERNAME.github.io/ai-chatbot-widget/config.json"
></script>
```

### Method 2: CDN (jsDelivr)

jsDelivr automatically serves GitHub files via CDN:
```html
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ai-chatbot-widget/chatbot.js"></script>
```

### Method 3: Download and Self-Host

Clients can download `chatbot.js` and host it themselves:
```html
<script src="/js/chatbot.js" data-config="/js/config.json"></script>
```

### Method 4: npm Package (Advanced)

Publish to npm for professional distribution:

1. Create `package.json`:
```json
{
  "name": "@your-company/chatbot-widget",
  "version": "1.0.0",
  "description": "Standalone AI Chatbot Widget",
  "main": "chatbot.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/ai-chatbot-widget"
  },
  "keywords": ["chatbot", "ai", "widget"],
  "author": "Chatbots-IA B.V.",
  "license": "PROPRIETARY"
}
```

2. Publish:
```bash
npm login
npm publish --access public
```

3. Clients install via npm:
```bash
npm install @your-company/chatbot-widget
```

## Step 7: Client Onboarding Process

### For Each New Client:

1. **Create client-specific config file**
   - Copy `config.json` to `config.CLIENT_NAME.json`
   - Customize colors, logo, messages, API endpoint
   - Commit and push to GitHub

2. **Provide integration snippet**
```html
<script src="https://YOUR_USERNAME.github.io/ai-chatbot-widget/chatbot.js" 
  data-config="https://YOUR_USERNAME.github.io/ai-chatbot-widget/config.CLIENT_NAME.json"
></script>
```

3. **Test on client's website**
   - Ask client to add snippet to their website
   - Verify chatbot loads correctly
   - Test all functionality (messages, email, WhatsApp)

4. **Go live**
   - Client publishes changes
   - Monitor for any issues
   - Provide support as needed

## Step 8: Maintenance and Updates

### Updating the Widget

1. Make changes to `chatbot.js`
2. Test thoroughly
3. Update version number
4. Commit and push to GitHub
5. Create new release (e.g., `v1.1.0`)
6. Notify clients of update

### Client-Specific Updates

1. Edit `config.CLIENT_NAME.json`
2. Commit and push
3. Changes take effect immediately (no client action needed)

## Security Considerations

### Protecting Your Code

If you want to protect your chatbot code:

1. **Private Repository**: Make GitHub repo private
2. **Access Tokens**: Provide clients with personal access tokens
3. **Obfuscation**: Minify and obfuscate `chatbot.js`
4. **License**: Add license file restricting usage

### API Security

1. **CORS**: Configure your API to only accept requests from client domains
2. **Rate Limiting**: Implement rate limiting on your backend
3. **Authentication**: Use API keys or tokens for each client

## Example: Complete Client Setup

### Client: Groenvastbouw

**1. Config file** (`config.groenvastbouw.json`):
```json
{
  "apiUrl": "https://api.chatbots-ia.com/chat/groenvastbouw",
  "primaryColor": "#00D084",
  "companyName": "Groenvast Bouw",
  "welcomeMessage": "Welkom bij Groenvastbouw! 🏡",
  "logo": "https://groenvastbouw.nl/logo.png",
  "emailAddress": "info@groenvastbouw.nl",
  "whatsappNumber": "+31612345678"
}
```

**2. Integration snippet** (send to client):
```html
<!-- Add this before closing </body> tag -->
<script src="https://cdn.jsdelivr.net/gh/chatbots-ia/ai-chatbot-widget/chatbot.js" 
  data-config="https://cdn.jsdelivr.net/gh/chatbots-ia/ai-chatbot-widget/config.groenvastbouw.json"
></script>
```

**3. Test URL**:
- Demo: `https://YOUR_USERNAME.github.io/ai-chatbot-widget/examples/advanced.html`

## Troubleshooting

### Chatbot doesn't load
- Check if GitHub Pages is enabled
- Verify file paths are correct
- Check browser console for errors

### CORS errors
- Ensure your API has correct CORS headers
- Test API endpoint separately

### Config not loading
- Verify config file is valid JSON
- Check config URL is accessible
- Ensure GitHub Pages is serving the file

## Next Steps

1. ✅ Export chatbot to GitHub
2. ✅ Enable GitHub Pages
3. ✅ Create first release (v1.0.0)
4. ✅ Test with a client
5. ✅ Document client-specific configurations
6. ✅ Set up monitoring and analytics

---

**Need Help?**
Contact: support@chatbots-ia.com

**Version:** 1.0.0  
**Last Updated:** November 2025
