# Make.com Setup Guide for Lead Collection

Quick guide to set up your chatbot lead collection with Make.com.

## Option 1: Manual Setup (Recommended - 5 minutes)

### Step 1: Create New Scenario

1. Go to https://make.com
2. Click **"Create a new scenario"**
3. Name it: "Chatbot Lead Collection"

### Step 2: Add Webhook Module

1. Click the **+** button
2. Search for **"Webhooks"**
3. Select **"Custom webhook"**
4. Click **"Add"** to create a new webhook
5. Give it a name: "Chatbot Leads"
6. Click **"Save"**
7. **Copy the webhook URL** - you'll need this!

### Step 3: Add Google Sheets Module (Optional)

1. Click **+** after the webhook
2. Search for **"Google Sheets"**
3. Select **"Add a row"**
4. Connect your Google account
5. Select your spreadsheet (create one first if needed)
6. Map the fields:
   - Column A: `name` → `{{1.name}}`
   - Column B: `email` → `{{1.email}}`
   - Column C: `phone` → `{{1.phone}}`
   - Column D: `preferred_time` → `{{1.preferred_time}}`
   - Column E: `notes` → `{{1.notes}}`
   - Column F: `timestamp` → `{{1.timestamp}}`
   - Column G: `source` → `{{1.source}}`

**Google Sheet Template Headers:**
```
Name | Email | Phone | Preferred Time | Notes | Timestamp | Source
```

### Step 4: Add Email Notification (Optional)

1. Click **+** after Google Sheets (or after webhook)
2. Search for **"Email"**
3. Select **"Send an email"**
4. Fill in:
   - **To:** `your-email@example.com`
   - **Subject:** `New Lead: {{1.name}}`
   - **Content:**
   ```
   New lead from chatbot:

   Name: {{1.name}}
   Email: {{1.email}}
   Phone: {{1.phone}}
   Preferred Time: {{1.preferred_time}}
   Notes: {{1.notes}}
   Timestamp: {{1.timestamp}}
   ```

### Step 5: Save and Activate

1. Click **"Save"** (bottom right)
2. Toggle the switch to **ON** (activate the scenario)

### Step 6: Add Webhook URL to Vercel

1. Copy the webhook URL from Step 2
2. Go to Vercel dashboard
3. Select project: `ai-chatbot-widget-eight`
4. **Settings** → **Environment Variables**
5. Click **"Add New"**
   - **Name:** `LEAD_WEBHOOK_URL`
   - **Value:** [paste your webhook URL]
6. Click **"Save"**
7. Go to **Deployments** → Click **"..."** on latest → **"Redeploy"**

---

## Option 2: Import Blueprint (Advanced)

### Using the provided `make-blueprint.json`:

1. In Make.com, click **"Scenarios"** → **"Import Blueprint"**
2. Upload `make-blueprint.json`
3. Configure:
   - Connect Google Sheets account
   - Select your spreadsheet
   - Update email address in Email module
4. Get webhook URL from the webhook module
5. Add to Vercel (see Step 6 above)

---

## Testing Your Setup

### 1. Test the Webhook First

In Make.com:
1. Right-click the webhook module
2. Click **"Run this module only"**
3. Send a test request:

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+31612345678",
    "preferred_time": "Morning",
    "notes": "Test lead from setup",
    "timestamp": "2025-01-15T10:00:00Z",
    "source": "chatbot"
  }'
```

4. Check if data appears in Google Sheets or Email

### 2. Test End-to-End

1. Make sure you've:
   - ✅ Added `LEAD_WEBHOOK_URL` to Vercel
   - ✅ Redeployed Vercel
   - ✅ Configured OpenAI Assistant (see `LEAD_COLLECTION_SETUP.md`)
   - ✅ Merged code to `main` branch

2. Go to your website
3. Open chatbot
4. Chat and provide contact info:
   ```
   You: "I'm interested in a passive house"
   Bot: "Great! Can I get your name and email?"
   You: "John Doe, john@example.com"
   Bot: "Thanks! What's your phone number?"
   You: "+31612345678"
   Bot: "When would you prefer a call?"
   You: "Tomorrow morning"
   ```

5. Check Make.com execution history
6. Check Google Sheets for the new row
7. Check your email inbox

---

## Troubleshooting

### Lead not appearing in Make.com?

1. Check Vercel logs:
   - Go to Vercel → Deployments → Latest → Functions → `/api/chat`
   - Look for "New Lead Collected" log
   - Check for webhook errors

2. Verify `LEAD_WEBHOOK_URL` is set correctly in Vercel

3. Make sure scenario is **ON** (green toggle in Make.com)

### Webhook receiving data but not saving to Sheets?

1. Check Google Sheets module is connected
2. Verify spreadsheet ID and sheet name are correct
3. Make sure the sheet has headers in row 1

### Email not sending?

1. Check email module is configured
2. Verify email address is correct
3. Check spam folder

---

## What Data You'll Receive

Each lead will include:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+31612345678",
  "preferred_time": "Morning",
  "notes": "Interested in 120m² passive house",
  "timestamp": "2025-01-15T10:30:00Z",
  "source": "chatbot"
}
```

**Fields:**
- `name` - Lead's full name (required)
- `email` - Email address (required)
- `phone` - Phone number (optional)
- `preferred_time` - When they want to be contacted (optional)
- `notes` - Any additional context from the conversation (optional)
- `timestamp` - When the lead was collected (automatic)
- `source` - Always "chatbot" (automatic)

---

## Advanced: Multiple Integrations

You can add multiple modules after the webhook:

```
Webhook → Google Sheets
       ↓
       → Email Notification
       ↓
       → Slack Message
       ↓
       → CRM (HubSpot, Salesforce, etc.)
       ↓
       → WhatsApp Notification
```

Just add more modules and connect them in parallel or sequence!

---

## Cost Estimation

**Make.com Free Tier:**
- 1,000 operations/month
- Each lead = 2-3 operations (webhook + sheets + email)
- ~300-500 leads/month for free

**Paid Plans:**
- Core: $9/month (10,000 operations)
- Pro: $16/month (10,000 ops + advanced features)

For most businesses, the free tier is enough to start!

---

**Questions?** Check the execution history in Make.com for detailed logs of each lead.
