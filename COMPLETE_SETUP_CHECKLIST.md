# ✅ Complete Setup Checklist - ChatMate Chatbot

Follow this checklist to get your chatbot fully operational with Make.com lead capture.

---

## 🎯 **Phase 1: Make.com Setup (10 minutes)**

### **Step 1: Create Universal Webhook**

- [ ] Go to https://www.make.com
- [ ] Create new scenario: **"ChatMate - Universal Lead Handler"**
- [ ] Add **Webhooks > Custom webhook** module
- [ ] Name it: "ChatMate Universal Webhook"
- [ ] **Copy webhook URL** (e.g., `https://hook.eu1.make.com/abc123`)

### **Step 2: Add Router**

- [ ] Add **Flow Control > Router** after webhook
- [ ] Router creates multiple paths

### **Step 3: Configure Routes**

**Route 1: Groenvastbouw**
- [ ] Click on route line (dotted)
- [ ] Set filter: `clientId` = `groenvastbouw`
- [ ] Add **Email** module OR **Google Sheets**
- [ ] Configure recipient: `info@groenvastbouw.nl`
- [ ] Map fields:
  - Name: `{{1.name}}`
  - Email: `{{1.email}}`
  - Phone: `{{1.phone}}`
  - Notes: `{{1.notes}}`
  - Conversation: `{{1.conversationSummary}}`

**Route 2: Demo**
- [ ] Click on route line
- [ ] Set filter: `clientId` = `demo`
- [ ] Add **Google Sheets** module
- [ ] Select spreadsheet: "ChatMate Demo Leads"
- [ ] Map same fields as above

**Route 3: Default (Fallback)**
- [ ] No filter (catches everything else)
- [ ] Add **Email** module
- [ ] Send to: `info@chatmate.nl`
- [ ] Subject: `New Lead from {{1.clientId}}`

### **Step 4: Activate Scenario**

- [ ] Click **Save** (bottom left)
- [ ] Toggle **Scheduling** to **ON**
- [ ] Set to **"Immediately as data arrives"**
- [ ] Click **OK**
- [ ] Scenario is LIVE! ✅

---

## 🔐 **Phase 2: Environment Variables (5 minutes)**

### **Option A: Vercel (Production)**

- [ ] Go to https://vercel.com/dashboard
- [ ] Select your project: `ai-chatbot-widget`
- [ ] Go to **Settings → Environment Variables**
- [ ] Add these variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `OPENAI_API_KEY` | `sk-proj-...` | Production, Preview, Development |
| `OPENAI_ASSISTANT_ID` | `asst_...` (default) | Production, Preview, Development |
| `LEAD_WEBHOOK_URL` | `https://hook.eu1.make.com/...` | Production, Preview, Development |
| `CLIENT_GROENVASTBOUW_ASSISTANT_ID` | `asst_...` (Groenvast) | Production, Preview, Development |
| `CLIENT_DEMO_ASSISTANT_ID` | `asst_...` (Demo) | Production, Preview, Development |

- [ ] Click **Save** for each variable
- [ ] **Redeploy** your application (Settings → Deployments → Redeploy)

### **Option B: Local Development (.env.local)**

- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in your actual values:
```bash
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_ASSISTANT_ID=asst_xxxxx
LEAD_WEBHOOK_URL=https://hook.eu1.make.com/xxxxx
CLIENT_GROENVASTBOUW_ASSISTANT_ID=asst_xxxxx
CLIENT_DEMO_ASSISTANT_ID=asst_xxxxx
```
- [ ] Save file
- [ ] Restart your dev server

---

## 🤖 **Phase 3: OpenAI Assistant Configuration (5 minutes)**

### **For Each Client (Groenvastbouw, Demo, etc.)**

- [ ] Go to https://platform.openai.com/assistants
- [ ] Click **Create Assistant**
- [ ] Set name: "ChatMate - Groenvastbouw" (or Demo)
- [ ] Select model: **GPT-4** or **GPT-4 Turbo**
- [ ] Paste instructions from `ASSISTANT_INSTRUCTIONS_FINAL.md`
- [ ] Add **Function Tool**:
  - Name: `save_lead`
  - Description: "Save lead contact information to CRM"
  - Parameters:
```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "description": "Full name" },
    "email": { "type": "string", "description": "Email address" },
    "phone": { "type": "string", "description": "Phone number" },
    "preferred_time": { "type": "string", "description": "Preferred contact time" },
    "notes": { "type": "string", "description": "Additional context about conversation" }
  },
  "required": ["name"]
}
```
- [ ] (Optional) Add **File Search** and upload company documents
- [ ] Click **Save**
- [ ] **Copy Assistant ID** (starts with `asst_`)
- [ ] Add to environment variables

---

## 🌐 **Phase 4: Landing Page Setup (Already Done! ✅)**

Your landing page (`index.html`) already has the chatbot installed:

```html
<script
    src="https://ai-chatbot-widget-eight.vercel.app/chatbot.js"
    data-config="https://ai-chatbot-widget-eight.vercel.app/config.demo.json">
</script>
```

**No action needed!** The chatbot will automatically appear on your landing page.

---

## 🧪 **Phase 5: Testing End-to-End (10 minutes)**

### **Test 1: Chatbot Appears**
- [ ] Open `https://ai-chatbot-widget-eight.vercel.app/` (or your domain)
- [ ] Chatbot button appears in bottom-right ✅
- [ ] Click to open chat window
- [ ] Welcome message shows

### **Test 2: Conversation Works**
- [ ] Type a message: "What are your prices?"
- [ ] AI responds with relevant answer
- [ ] AI provides 2-3 follow-up options
- [ ] Options are clickable

### **Test 3: Lead Capture**
- [ ] Continue conversation
- [ ] When prompted, provide contact details:
  - Name: "Test User"
  - Email: "test@example.com"
- [ ] AI confirms: "Thanks Test User, I've noted your details"

### **Test 4: Make.com Receives Lead**
- [ ] Go to Make.com scenario
- [ ] Check execution history (clock icon)
- [ ] Latest run should show your test lead
- [ ] Data includes: name, email, conversation, clientId

### **Test 5: Email/Sheets Delivery**
- [ ] Check the destination you configured:
  - Email inbox (if using email module)
  - Google Sheets (if using sheets module)
- [ ] Lead data appears correctly
- [ ] Conversation transcript is included

---

## 📊 **Phase 6: Monitoring & Analytics (Ongoing)**

### **Make.com Monitoring**
- [ ] Check Make.com scenario runs daily
- [ ] Monitor for errors (red exclamation marks)
- [ ] Review execution logs

### **OpenAI Usage**
- [ ] Go to https://platform.openai.com/usage
- [ ] Monitor API costs
- [ ] Track conversation volume

### **Client Feedback**
- [ ] Ask clients for feedback on lead quality
- [ ] Review conversation transcripts
- [ ] Optimize assistant instructions if needed

---

## 🚀 **Going Live Checklist**

Before announcing to clients:

- [ ] All environment variables set in Vercel
- [ ] Make.com scenario tested and active
- [ ] At least 5 test conversations completed successfully
- [ ] Leads delivered to correct destinations
- [ ] Client-specific branding configured (colors, logo, messages)
- [ ] Mobile responsiveness tested
- [ ] Proactive messages tested (30s, exit intent, scroll)
- [ ] Multi-language tested (if applicable)
- [ ] Business hours status working
- [ ] Email notifications arriving within 1 minute

---

## 📞 **Support & Troubleshooting**

### **Chatbot doesn't appear?**
- Check browser console for errors (F12 → Console)
- Verify script tag is before `</body>`
- Clear browser cache (Ctrl+F5)
- Check Vercel deployment status

### **Leads not arriving in Make.com?**
- Check Make.com scenario is ON
- Review execution history for errors
- Verify webhook URL in environment variables
- Test webhook with manual cURL request

### **AI not responding correctly?**
- Review assistant instructions
- Check if function calling is enabled
- Verify correct assistant ID in env vars
- Check OpenAI API usage/limits

---

## ✅ **Success Criteria**

You're ready to go when:

- ✅ Chatbot loads on landing page
- ✅ Conversations work smoothly
- ✅ Leads captured automatically
- ✅ Make.com routes leads correctly
- ✅ Clients receive leads via their preferred method
- ✅ Full conversation history included
- ✅ No errors in last 10 test runs

---

**Time to complete:** ~30 minutes
**Complexity:** Medium
**Scalability:** ∞ (One scenario handles all clients)

**Questions?** See `MAKE_SCENARIO_SETUP.md` for detailed Make.com instructions.
