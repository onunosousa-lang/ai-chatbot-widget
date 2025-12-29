# Multi-Client Setup Guide

Your chatbot now supports **multiple clients** using a single deployment! Each client can have their own:
- OpenAI Assistant
- Make.com webhook (different lead destinations)
- Custom branding and configuration

## How It Works

The system uses a **clientId** to route each conversation to the correct assistant and webhook:

```
Client Website → clientId: "groenvastbouw" → OpenAI Assistant (Groenvastbouw) → Make.com Webhook (Groenvastbouw leads)
Client Website → clientId: "acmecorp" → OpenAI Assistant (AcmeCorp) → Make.com Webhook (AcmeCorp leads)
```

---

## Adding a New Client

### Step 1: Create Client Configuration File

Create a new config file: `config.{clientname}.json`

**Example: `config.acmecorp.json`**
```json
{
  "apiUrl": "https://ai-chatbot-widget-eight.vercel.app/api/chat",
  "clientId": "acmecorp",
  "primaryColor": "#FF5733",
  "secondaryColor": "#C70039",
  "companyName": "Acme Corporation",
  "welcomeMessage": "Welcome to Acme Corp! How can I help you today?",
  "placeholder": "Type your message...",
  "position": "bottom-right",
  "logo": "https://example.com/logo.png",
  "emailButton": true,
  "whatsappButton": true,
  "emailAddress": "contact@acmecorp.com",
  "whatsappNumber": "+1234567890",
  "buttonSize": "60px",
  "chatHeight": "450px",
  "chatWidth": "380px",
  "zIndex": 9999
}
```

**Critical field:**
- `clientId`: Must be unique (lowercase, no spaces, e.g., "acmecorp", "companyxyz")

### Step 2: Create OpenAI Assistant for the Client

1. Go to https://platform.openai.com/assistants
2. Click **"Create"**
3. Configure the assistant:
   - **Name**: "Acme Corp Customer Support"
   - **Instructions**: Add the client's specific instructions (see `IMPROVED_ASSISTANT_INSTRUCTIONS.md` for template)
   - **Tools**: Enable "File Search" if needed
   - **Functions**: Add the `save_lead` function (see below)
4. **Copy the Assistant ID** (e.g., `asst_abc123xyz`)

**save_lead Function Schema:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The lead's full name"
    },
    "email": {
      "type": "string",
      "description": "The lead's email address"
    },
    "phone": {
      "type": "string",
      "description": "The lead's phone number (optional)"
    },
    "preferred_time": {
      "type": "string",
      "description": "When they prefer to be contacted"
    },
    "notes": {
      "type": "string",
      "description": "Additional context from the conversation"
    }
  },
  "required": ["name", "email"]
}
```

### Step 3: Set Up Make.com Webhook for the Client

1. Go to https://make.com
2. Create a new scenario: **"Chatbot Leads - Acme Corp"**
3. Add **Webhook** module:
   - Click **"Create a new webhook"**
   - Name it: "Acme Corp Chatbot Leads"
   - **Copy the webhook URL** (e.g., `https://hook.eu1.make.com/abc123xyz`)
4. Add **Google Sheets** or **Email** module (or both):
   - Connect to client's Google Sheet or email
   - Map the fields: `{{1.name}}`, `{{1.email}}`, `{{1.phone}}`, etc.
5. **Save and activate** the scenario

**See `MAKE_SETUP_GUIDE.md` for detailed instructions**

### Step 4: Add Environment Variables to Vercel

Go to Vercel → **Settings** → **Environment Variables** and add:

#### For the new client (replace `ACMECORP` with your client's ID in uppercase):

**Required:**
```
CLIENT_ACMECORP_ASSISTANT_ID = asst_abc123xyz
```

**Optional (if using Make.com or webhook):**
```
CLIENT_ACMECORP_WEBHOOK_URL = https://hook.eu1.make.com/abc123xyz
```

#### Default fallback (keeps existing clients working):
```
OPENAI_ASSISTANT_ID = asst_default123
LEAD_WEBHOOK_URL = https://hook.eu1.make.com/default123
```

**Example environment variables for 3 clients:**
```
OPENAI_API_KEY = sk-proj-abc123...

# Default (fallback)
OPENAI_ASSISTANT_ID = asst_default123
LEAD_WEBHOOK_URL = https://hook.eu1.make.com/default

# Groenvastbouw
CLIENT_GROENVASTBOUW_ASSISTANT_ID = asst_groenvast123
CLIENT_GROENVASTBOUW_WEBHOOK_URL = https://hook.eu1.make.com/groenvast

# Acme Corp
CLIENT_ACMECORP_ASSISTANT_ID = asst_acme123
CLIENT_ACMECORP_WEBHOOK_URL = https://hook.eu1.make.com/acme
```

**After adding variables:**
1. Click **"Save"**
2. Go to **Deployments** → **"..."** → **"Redeploy"**

### Step 5: Embed Chatbot on Client's Website

Add this script to the client's website (replace `acmecorp` with the actual clientId):

**Option A: Using config file**
```html
<script
  src="https://ai-chatbot-widget-eight.vercel.app/chatbot.js"
  data-config="https://ai-chatbot-widget-eight.vercel.app/config.acmecorp.json">
</script>
```

**Option B: Inline configuration**
```html
<script
  src="https://ai-chatbot-widget-eight.vercel.app/chatbot.js"
  data-client-id="acmecorp"
  data-primary-color="#FF5733"
  data-company-name="Acme Corporation"
  data-welcome-message="Welcome to Acme Corp! How can I help you?">
</script>
```

**Important:** Make sure the `data-client-id` matches the clientId in your config file!

---

## Testing New Client Setup

### 1. Test Configuration Loading
```bash
# Visit the chatbot in browser
https://ai-chatbot-widget-eight.vercel.app/examples/basic.html?config=config.acmecorp.json

# Check browser console
# Should show: "Chatbot initialized with clientId: acmecorp"
```

### 2. Test Assistant Connection
1. Open chatbot on client's website
2. Send a test message: "Hello"
3. Check Vercel logs for:
   ```
   Using assistant ID: asst_acme123 for client: acmecorp
   ```

### 3. Test Lead Collection
1. Chat with bot and provide contact info
2. Check Make.com execution history
3. Verify lead appears in correct Google Sheet or email

### 4. Check for Errors
**Vercel Logs:**
- Go to Vercel → **Deployments** → **Latest** → **Functions** → `/api/chat`
- Look for errors like "No assistant ID configured for client"

---

## Pricing Tiers and Lead Caps (Coming Soon)

See `LEAD_CAPPING_SYSTEM.md` for implementation details.

**Planned tiers:**
- **Free**: 10 leads/month
- **Starter**: 50 leads/month ($29/mo)
- **Pro**: 200 leads/month ($79/mo)
- **Enterprise**: Unlimited ($199/mo)

---

## Environment Variable Naming Convention

**Pattern:**
```
CLIENT_{CLIENTID}_ASSISTANT_ID
CLIENT_{CLIENTID}_WEBHOOK_URL
```

**Rules:**
- `{CLIENTID}` must be **UPPERCASE** in environment variables
- Example: clientId "acmecorp" → `CLIENT_ACMECORP_ASSISTANT_ID`
- Example: clientId "xyz-company" → `CLIENT_XYZ-COMPANY_ASSISTANT_ID`

**Fallback behavior:**
- If client-specific env var doesn't exist, uses `OPENAI_ASSISTANT_ID` (default)
- If client-specific webhook doesn't exist, uses `LEAD_WEBHOOK_URL` (default)

---

## Troubleshooting

### Error: "No assistant ID configured for client: xyz"
**Solution:** Add `CLIENT_XYZ_ASSISTANT_ID` to Vercel environment variables

### Leads going to wrong webhook
**Solution:** Check that `CLIENT_{CLIENTID}_WEBHOOK_URL` is set correctly

### Chatbot not loading
**Solution:** Check that `clientId` in config matches the one in environment variables (case-insensitive)

### Client seeing default assistant instead of theirs
**Solution:**
1. Check browser console for clientId value
2. Verify environment variable name matches (uppercase)
3. Redeploy Vercel after adding variables

---

## Current Clients

| Client ID | Assistant ID | Webhook | Status |
|-----------|-------------|---------|--------|
| `default` | `asst_xxx` | Make.com (default) | ✅ Active |
| `groenvastbouw` | `asst_yyy` | Make.com (Groenvast) | ✅ Active |
| `acmecorp` | `asst_zzz` | Make.com (Acme) | ⏳ Setup |

**Add new rows as you add clients**

---

## Selling This as a Service

**Value proposition:**
- ✅ No technical setup required for clients
- ✅ Professional AI chatbot in 24 hours
- ✅ Automatic lead collection
- ✅ Custom branding and configuration
- ✅ Usage tracking and analytics

**What clients need to provide:**
1. Company name, colors, logo
2. Website URL for embedding
3. OpenAI API key (or bill them for usage)
4. Make.com account (or set it up for them)

**Monthly pricing ideas:**
- Setup fee: €200-500 (one-time)
- Monthly subscription: €50-200/month (based on lead volume)
- OpenAI API costs: Pass-through or markup 20-30%

---

**Questions?** Check Vercel logs and Make.com execution history for detailed debugging.
