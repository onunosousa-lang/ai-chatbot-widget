# Lead Collection Setup Guide

Your chatbot now supports conversational lead collection! Follow these steps to activate it.

## ✅ Step 1: Code Updated

The API has been updated to handle function calling and lead collection. When deployed, it will:
- Detect when the AI collects contact information
- Save leads via webhook or other methods
- Continue the conversation naturally

## 🤖 Step 2: Configure Your OpenAI Assistant

You need to add the `save_lead` function to your OpenAI Assistant:

### 2.1 Go to OpenAI Platform
1. Visit: https://platform.openai.com/assistants
2. Find your assistant (the one with ID: `OPENAI_ASSISTANT_ID` from Vercel)
3. Click to edit it

### 2.2 Update Assistant Instructions

Add these instructions to your assistant:

```
You are a helpful assistant for [Company Name].

When a user shows interest in your services or asks for more information:
1. Naturally ask for their contact details (name, email, phone)
2. Ask when they'd prefer to be contacted (morning/afternoon/specific time)
3. Once you have their information, use the save_lead function to store it
4. Thank them and confirm they'll be contacted

Be conversational and natural. Don't make it feel like a form.
```

### 2.3 Add the Function/Tool

In the assistant configuration, add this function:

**Function Name:** `save_lead`

**Description:**
```
Saves a lead's contact information when they show interest in the service. Use this when you have collected the user's name, email, and optionally phone number and preferred contact time.
```

**Parameters (JSON Schema):**
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
      "description": "When they prefer to be contacted (e.g., 'morning', 'afternoon', 'Tuesday 2pm')"
    },
    "notes": {
      "type": "string",
      "description": "Any additional context or notes from the conversation"
    }
  },
  "required": ["name", "email"]
}
```

### 2.4 Save the Assistant

Click **Save** in the OpenAI dashboard.

## 📧 Step 3: Set Up Lead Storage

You have several options for where leads go:

### Option A: Webhook (Recommended for Zapier/Make.com)

1. Create a webhook in Zapier or Make.com
2. Connect it to your CRM (HubSpot, Salesforce, etc.) or Google Sheets
3. Add the webhook URL to Vercel:
   - Go to Vercel → `ai-chatbot-widget-eight` project
   - **Settings** → **Environment Variables**
   - Add: `LEAD_WEBHOOK_URL` = `https://your-webhook-url`
   - Redeploy

**Zapier Example:**
1. Create new Zap → Choose "Webhooks by Zapier"
2. Select "Catch Hook"
3. Copy the webhook URL
4. Add action: "Google Sheets - Create Row" or "Email - Send Email"

### Option B: Email Notification

If you want to receive leads via email, I can add email sending to the code. You'll need:
- SendGrid API key, or
- AWS SES, or
- Another email service

Let me know if you want this option!

### Option C: Database Storage

For storing in a database (Airtable, Supabase, etc.), I can add that integration.

## 🧪 Step 4: Test It

1. Deploy the changes to Vercel (merge to main)
2. Go to your website
3. Open the chatbot
4. Have a conversation and provide your contact info
5. Check if the lead appears in your webhook/CRM/sheets

**Example test conversation:**
```
You: "How much does a passive house cost?"
AI: "Great question! Passive houses start at €180,000..."
AI: "I'd love to send you detailed information. What's your name and email?"
You: "Test User, test@example.com"
AI: "Thanks! What's the best phone number to reach you?"
You: "+31612345678"
AI: "Perfect! When would you prefer a call?"
You: "Tomorrow morning"
AI: [Saves lead] "Excellent! We'll contact you tomorrow morning."
```

## 🚀 Step 5: Deploy

```bash
git add .
git commit -m "Add conversational lead collection with function calling"
git push origin main
```

Or create a PR and merge it.

## 📊 Monitoring Leads

- **Vercel Logs**: See leads in real-time at Vercel → Functions → `/api/chat` → Logs
- **Webhook**: Check your Zapier/Make.com history
- **CRM**: Leads appear automatically in your connected system

## 💡 Tips for Better Lead Collection

**Good Assistant Instructions:**
- "Ask naturally in conversation, not like a form"
- "Only ask for contact info when user shows clear interest"
- "Confirm what you'll send them (brochure, quote, etc.)"

**Customize for Your Business:**
- Adjust required fields (maybe you only need email)
- Add custom fields (budget, project timeline, location, etc.)
- Modify the assistant's tone to match your brand

## Need Help?

Common issues:
- **Lead not saving**: Check Vercel logs for errors
- **Function not called**: Verify the function is added to your OpenAI Assistant
- **Webhook failing**: Test the webhook URL manually

---

**Your chatbot now has professional lead collection! 🎉**
