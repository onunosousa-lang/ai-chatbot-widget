# Make.com Universal Webhook Setup (All Clients)

This guide shows you how to create **ONE** Make.com scenario that handles leads from **ALL** clients using dynamic routing based on `clientId`.

---

## 🎯 **Architecture**

```
Chatbot → API → Make.com Webhook → Router → Client-Specific Actions
                                      ├─ groenvastbouw → Email/CRM
                                      ├─ demo → Google Sheets
                                      ├─ client3 → HubSpot
                                      └─ default → Email
```

---

## 📋 **Step-by-Step Make.com Setup**

### **Step 1: Create New Scenario**

1. Go to https://www.make.com
2. Click **"Create a new scenario"**
3. Name it: **"ChatMate - Universal Lead Handler"**

---

### **Step 2: Add Webhook Module**

1. Click the **(+)** button
2. Search for **"Webhooks"**
3. Select **"Custom webhook"**
4. Click **"Create a webhook"**
5. Name it: **"ChatMate Universal Webhook"**
6. Click **"Save"**
7. **Copy the webhook URL** (looks like: `https://hook.eu1.make.com/xxxxx`)

**Example webhook URL:**
```
https://hook.eu1.make.com/abc123xyz456
```

**SAVE THIS URL** - you'll need it for your environment variables!

---

### **Step 3: Add Router Module**

1. Click **(+)** after the webhook
2. Search for **"Flow Control"**
3. Select **"Router"**
4. The router will split into multiple paths

---

### **Step 4: Configure Routes (One Per Client)**

#### **Route 1: Groenvastbouw** (Example)

**Filter:**
- Click on the route line (dotted line)
- Set condition:
  - Field: `clientId`
  - Operator: **Equal to**
  - Value: `groenvastbouw`

**Actions:**
1. Add **Email** module or **Google Sheets** module
2. Configure with Groenvastbouw-specific email/sheet
3. Map fields:
   - **Name:** `{{1.name}}`
   - **Email:** `{{1.email}}`
   - **Phone:** `{{1.phone}}`
   - **Notes:** `{{1.notes}}`
   - **Client ID:** `{{1.clientId}}`
   - **Conversation:** `{{1.conversationSummary}}`
   - **Timestamp:** `{{1.timestamp}}`

---

#### **Route 2: Demo** (Example)

**Filter:**
- Field: `clientId`
- Operator: **Equal to**
- Value: `demo`

**Actions:**
1. Add **Google Sheets** module
2. Select your spreadsheet: "ChatMate Demo Leads"
3. Map same fields as above

---

#### **Route 3: Default / Fallback**

**No filter** (catches everything else)

**Actions:**
1. Add **Email** module
2. Send to: `info@chatmate.nl`
3. Subject: `New Lead from {{1.clientId}}`
4. Body:
```
New lead received from: {{1.clientId}}

Name: {{1.name}}
Email: {{1.email}}
Phone: {{1.phone}}
Preferred Time: {{1.preferred_time}}
Notes: {{1.notes}}

--- Full Conversation ---
{{1.conversationSummary}}

Timestamp: {{1.timestamp}}
Source: {{1.source}}
```

---

### **Step 5: Save & Activate Scenario**

1. Click **"Save"** (bottom left)
2. Toggle **"Scheduling"** to **ON**
3. Set to **"Immediately as data arrives"**
4. Click **"OK"**
5. Scenario is now LIVE! ✅

---

## 🔐 **Step 6: Add Webhook to Environment Variables**

Update your `.env` file or Vercel environment variables:

```bash
LEAD_WEBHOOK_URL=https://hook.eu1.make.com/YOUR_WEBHOOK_URL_HERE
```

**In Vercel:**
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add new variable:
   - **Key:** `LEAD_WEBHOOK_URL`
   - **Value:** `https://hook.eu1.make.com/abc123xyz456`
   - **Environment:** Production, Preview, Development (select all)
4. Click **Save**
5. **Redeploy** your application

---

## 📊 **Example Make.com Scenario Structure**

```
┌─────────────────────────────────┐
│   Webhook (Receives Lead)       │
│   URL: hook.eu1.make.com/...    │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│         Router                  │
└──────────────┬──────────────────┘
               │
      ┌────────┴────────┬─────────────┬──────────┐
      ↓                 ↓             ↓          ↓
┌──────────┐     ┌───────────┐  ┌─────────┐  ┌─────────┐
│ Route 1  │     │  Route 2  │  │ Route 3 │  │ Default │
│ clientId │     │  clientId │  │ clientId│  │ (any)   │
│ = groen  │     │  = demo   │  │ = abc   │  │         │
└─────┬────┘     └─────┬─────┘  └────┬────┘  └────┬────┘
      │                │              │            │
      ↓                ↓              ↓            ↓
┌──────────┐     ┌───────────┐  ┌─────────┐  ┌─────────┐
│  Email   │     │  Sheets   │  │ HubSpot │  │  Email  │
│ groen@   │     │   Demo    │  │   CRM   │  │ info@   │
└──────────┘     └───────────┘  └─────────┘  └─────────┘
```

---

## 🧪 **Testing the Webhook**

### **Test 1: Send Test Data from Make.com**

1. In Make.com, click **"Run once"**
2. It will wait for data
3. Open your chatbot on your website
4. Have a conversation and provide contact details
5. Check Make.com - you should see the data arrive!

### **Test 2: Manual cURL Test**

```bash
curl -X POST https://hook.eu1.make.com/YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+31612345678",
    "preferred_time": "",
    "notes": "Language: NL, B2B, Interested in passive houses",
    "conversationSummary": "User: How much does a passive house cost?\nAssistant: For structure-only...",
    "clientId": "groenvastbouw",
    "timestamp": "2024-01-15T10:30:00Z",
    "source": "chatbot"
  }'
```

---

## 📈 **Scaling to 100+ Clients**

With this setup, you can scale infinitely:

**Option A: Add Routes Dynamically**
- Add new routes in Make.com as clients grow
- Copy/paste existing route and change `clientId` filter

**Option B: Use Data Store**
- Store client configurations in Make.com Data Store
- One route looks up client config dynamically
- No need to update scenario for new clients

**Option C: External Database**
- Store client configs in Airtable/Google Sheets
- Make.com looks up client email/CRM by `clientId`
- Fully dynamic, zero scenario changes

---

## 💡 **Best Practice: Client Configuration Table**

Create a Google Sheet: **"ChatMate Client Config"**

| clientId | email | crmType | crmUrl | sheet_id |
|----------|-------|---------|--------|----------|
| groenvastbouw | info@groenvastbouw.nl | email | - | - |
| demo | - | sheets | - | 123abc |
| client3 | - | hubspot | https://api.hubspot.com | - |

**In Make.com:**
1. After webhook, add **Google Sheets** lookup
2. Search for row where `clientId` matches
3. Use returned values for routing
4. One route handles ALL clients dynamically!

---

## 🚀 **Ready to Go?**

Once you complete this setup:
- ✅ All leads from all clients route to ONE webhook
- ✅ Each client gets their leads delivered correctly
- ✅ Scale to 1000+ clients without touching Make.com
- ✅ Full conversation history included
- ✅ Works with any CRM/tool

**Next:** Deploy your environment variable and test!
