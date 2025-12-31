# Professional Client Onboarding Guide - AI Chatbot Service

## Complete Step-by-Step Process for Delivering Chatbot to Clients

---

## PHASE 1: PRE-SALE (Before Client Commits)

### Step 1: Initial Sales Call (30 min)

**What to discuss:**
1. Client's business type (B2B, B2C, services, e-commerce)
2. Current lead generation challenges
3. Website traffic volume
4. Current lead conversion rate (if known)
5. Budget and timeline expectations

**What to show:**
- Live demo of your Groenvastbouw chatbot
- Show mobile version
- Demonstrate lead collection
- Show Make.com lead delivery

**What to send after:**
```
Email Subject: AI Chatbot Proposal - [Client Company Name]

Hi [Name],

Thanks for the call today. Based on our discussion, here's what we'll deliver:

PACKAGE: Professional AI Chatbot
- 24/7 AI-powered chat widget on your website
- Automatic lead collection and qualification
- Leads delivered to your email/CRM automatically
- Mobile-optimized experience
- Session persistence (conversations resume after page refresh)
- Multi-language support (Dutch/English)
- Custom branding (your colors, logo, messaging)

PRICING:
Setup Fee: €299 (one-time)
Monthly: €99/month (cancel anytime)

TIMELINE:
- Setup: 24-48 hours after receiving your info
- Go-live: Within 1 week

WHAT WE NEED FROM YOU:
1. Company info (name, colors, logo)
2. Website URL for installation
3. Email/webhook for receiving leads

Next step: If you'd like to proceed, I'll send an invoice for the setup fee and we'll begin immediately.

Best regards,
[Your name]
```

---

## PHASE 2: CLIENT ONBOARDING (After Payment Received)

### Step 2: Send Client Onboarding Form (Email)

**Email Subject:** Welcome! Let's Set Up Your AI Chatbot

**Email body:**
```
Hi [Name],

Great! Let's get your chatbot set up. Please fill out this quick form:

COMPANY BRANDING
- Company name: _________________
- Website URL: _________________
- Brand colors (hex codes or send logo):
  Primary color: _________________
  Secondary color: _________________
- Logo URL (or attach file): _________________

CONTACT INFORMATION
- Email for receiving leads: _________________
- WhatsApp number (optional): _________________
- Contact email for "Email Us" button: _________________

WELCOME MESSAGE
What should the chatbot say when someone opens it?
Suggestion: "Welcome to [Company]! How can I help you today?"
Your version: _________________

BUSINESS HOURS
Mon-Fri hours: _____ - _____
Timezone: Europe/Amsterdam (or specify): _________________

LEAD DELIVERY
How do you want to receive leads?
[ ] Email only
[ ] Google Sheets
[ ] CRM (which one: _____________)

I'll have everything set up within 24-48 hours and send you a test link.

Best regards,
[Your name]
```

---

### Step 3: Technical Setup (Your Side - 2 hours)

**Checklist:**

#### A. Create Config File (15 min)

1. Copy template:
```bash
cd /path/to/ai-chatbot-widget
cp config.template.json config.clientname.json
```

2. Fill in client details:
```json
{
  "apiUrl": "https://ai-chatbot-widget-eight.vercel.app/api/chat",
  "clientId": "clientname",
  "primaryColor": "#CLIENT_COLOR",
  "secondaryColor": "#CLIENT_COLOR_2",
  "companyName": "Client Company Name",
  "welcomeMessage": "...",
  "placeholder": "Type your message...",
  "position": "bottom-right",
  "logo": "https://client.com/logo.png",
  "emailButton": true,
  "whatsappButton": true,
  "emailAddress": "contact@client.com",
  "whatsappNumber": "+31612345678",
  "buttonSize": "60px",
  "chatHeight": "450px",
  "chatWidth": "380px",
  "zIndex": 9999,
  "conversationStarters": [],
  "showLanguageSelector": true,
  "languages": ["nl", "en"],
  "defaultLanguage": "nl",
  "proactiveTrigger": true,
  "socialProof": false,
  "calendlyUrl": null,
  "enableSound": true,
  "enableSessionPersistence": true,
  "enableAnalytics": true,
  "enableTypingDelay": true,
  "showRating": true,
  "detectReturningUsers": true,
  "businessHours": {
    "start": "09:00",
    "end": "17:00",
    "days": [1, 2, 3, 4, 5],
    "timezone": "Europe/Amsterdam"
  },
  "pageSpecificTriggers": {}
}
```

3. Commit and push:
```bash
git add config.clientname.json
git commit -m "Add [Client Name] configuration"
git push origin main
```

#### B. Create OpenAI Assistant (20 min)

1. Go to https://platform.openai.com/assistants
2. Click "Create"
3. Fill in:
   - **Name:** "[Client Company] Customer Support Bot"
   - **Instructions:** Copy from ASSISTANT_INSTRUCTIONS_FINAL.md
     - Update company name throughout
     - Update service descriptions
     - Update pricing (if different)
   - **Model:** gpt-4-turbo-preview (or latest)
   - **Tools:** Enable "Function calling"

4. Add `save_lead` function:
```json
{
  "name": "save_lead",
  "description": "Saves a lead's contact information when they provide it",
  "parameters": {
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
}
```

5. Click "Save"
6. **Copy the Assistant ID** (e.g., asst_abc123xyz)

#### C. Set Up Make.com Scenario (30 min)

1. Go to https://make.com
2. Create new scenario: "[Client Name] - Chatbot Leads"
3. Add **Webhooks** module:
   - Click "Create a webhook"
   - Name: "[Client Name] Chatbot Leads"
   - **Copy webhook URL**

4. Add router with 3 paths:

**Path 1: Email Notification**
- Add "Email" module
- To: client@email.com
- Subject: 🔥 New Lead from Website Chat
- Body:
```
New lead from your website chatbot:

Name: {{1.name}}
Email: {{1.email}}
Phone: {{1.phone}}
Preferred Contact Time: {{1.preferred_time}}

Notes: {{1.notes}}

Conversation Summary:
{{1.conversationSummary}}

---
Lead captured: {{1.timestamp}}
Source: Website chatbot
Client ID: {{1.clientId}}
```

**Path 2: Google Sheets** (if requested)
- Add "Google Sheets" → "Add a Row"
- Connect to client's Google Sheet
- Map fields:
  - Name → {{1.name}}
  - Email → {{1.email}}
  - Phone → {{1.phone}}
  - Preferred Time → {{1.preferred_time}}
  - Notes → {{1.notes}}
  - Conversation → {{1.conversationSummary}}
  - Date → {{1.timestamp}}

**Path 3: CRM Integration** (if requested)
- Add CRM module (HubSpot, Pipedrive, etc.)
- Create contact/lead
- Map all fields

5. Click "Save" and toggle to "Active"

#### D. Add Environment Variables to Vercel (10 min)

1. Go to https://vercel.com/dashboard
2. Select your project: `ai-chatbot-widget`
3. Go to Settings → Environment Variables
4. Add these variables:

```
CLIENT_CLIENTNAME_ASSISTANT_ID = asst_abc123xyz
CLIENT_CLIENTNAME_WEBHOOK_URL = https://hook.eu1.make.com/xyz123
```

**Important:** Replace `CLIENTNAME` with client ID in UPPERCASE

5. Click "Save"
6. Go to Deployments → Click "..." → "Redeploy"
7. Wait for deployment to complete (2-3 minutes)

---

### Step 4: Testing (Your Side - 30 min)

**Create Testing Checklist:**

```
CHATBOT TESTING CHECKLIST - [Client Name]

□ Visual/Branding
  □ Logo displays correctly
  □ Colors match client's brand
  □ Company name correct
  □ Welcome message displays
  □ Chat window size appropriate
  □ Mobile responsive (test on phone)

□ Functionality
  □ Chat opens/closes smoothly
  □ Opening message shows 2 options
  □ Language selector works (EN/NL)
  □ Messages send successfully
  □ Bot responds within 3-5 seconds
  □ Typing indicator shows
  □ Session persists (close/reopen page)

□ Conversation Flow
  □ Test Dutch conversation (stays in Dutch)
  □ Test English conversation (stays in English)
  □ Bot provides 2-3 options after each answer
  □ Options are relevant and clear
  □ Bot answers questions accurately

□ Lead Capture
  □ Provide test details: "John Doe, john@test.com"
  □ save_lead function fires (check OpenAI logs)
  □ Lead arrives via email within 1 minute
  □ Google Sheet updated (if applicable)
  □ CRM updated (if applicable)
  □ Conversation summary included

□ Business Hours
  □ During hours: Normal operation
  □ Outside hours: Mentions team will contact

□ Edge Cases
  □ Send empty message (should be blocked)
  □ Send very long message (should handle)
  □ Rapid-fire messages (should queue)
  □ Network disconnect/reconnect (retry logic)

□ Email/WhatsApp Buttons
  □ Email button opens mailto: link
  □ WhatsApp button opens WhatsApp
  □ Correct email/phone number

TESTER: _____________
DATE: _____________
RESULT: □ PASS  □ FAIL (issues: _____________)
```

**Test on multiple devices:**
- Desktop (Chrome, Safari, Firefox)
- Mobile (iPhone, Android)
- Tablet

---

### Step 5: Client Review & Approval (24 hours)

**Send this email:**

```
Subject: Your Chatbot is Ready for Review! 🎉

Hi [Name],

Your AI chatbot is ready! Please test it here:

🔗 TEST LINK:
https://your-vercel-url.app/examples/basic.html?config=config.clientname.json

PLEASE TEST:
1. Open the chat widget (bottom right)
2. Try asking a few questions in Dutch and English
3. Test the lead capture by providing your name and email
4. Check your inbox - you should receive the lead within 1 minute
5. Test on your phone (mobile experience)

THINGS TO CHECK:
✓ Colors and logo look good
✓ Welcome message is correct
✓ Bot answers accurately
✓ Lead arrives in your email
✓ Works on mobile

Please reply with:
- Any changes you'd like (colors, messages, etc.)
- Confirmation to proceed with website installation

Once approved, I'll send you the simple installation code for your website.

Best regards,
[Your name]
```

**Handle feedback:**
- Color changes: Update config, commit, push (5 min)
- Message changes: Update config or assistant (10 min)
- Functionality issues: Debug and fix

---

## PHASE 3: GO-LIVE (Client Approved)

### Step 6: Send Installation Instructions

**Email Subject:** Installation Code - Add to Your Website

**Email body:**
```
Hi [Name],

Great! Here's the installation code. Your webmaster/developer just needs to add this ONE LINE to your website.

📋 INSTALLATION CODE:

<script
  src="https://ai-chatbot-widget-eight.vercel.app/chatbot.js"
  data-config="https://ai-chatbot-widget-eight.vercel.app/config.clientname.json">
</script>


WHERE TO ADD IT:

Option 1 (Recommended): Add to <head> section
- Works on all pages automatically
- Chat appears on every page

Option 2: Add before closing </body> tag
- Slightly faster page load
- Also works on all pages

WORDPRESS USERS:
1. Go to Appearance → Theme File Editor
2. Click "header.php"
3. Paste code before </head>
4. Click "Update File"

Or use a plugin:
1. Install "Insert Headers and Footers" plugin
2. Go to Settings → Insert Headers and Footers
3. Paste code in "Scripts in Header"
4. Click "Save"

SHOPIFY USERS:
1. Go to Online Store → Themes
2. Click "Actions" → "Edit code"
3. Click "theme.liquid"
4. Paste code before </head>
5. Click "Save"

CUSTOM WEBSITES:
Ask your developer to add the script tag to your site's main template.

TESTING AFTER INSTALLATION:
1. Visit your website
2. You should see the chat widget in the bottom right
3. Test by sending a message
4. Verify you receive the lead via email

Questions? Just reply to this email!

Best regards,
[Your name]
```

### Step 7: Verify Installation (Same Day)

1. Visit client's website
2. Check chat widget appears
3. Send test message
4. Verify lead delivery
5. Test on mobile

**If issues:**
- Check browser console for errors
- Verify script tag is correct
- Check Vercel deployment status
- Check OpenAI API key is valid

**When verified, send confirmation:**

```
Subject: ✅ Chatbot is Live on Your Website!

Hi [Name],

Confirmed! Your AI chatbot is now live on [website.com] 🎉

WHAT'S WORKING:
✓ Chat widget appears on all pages
✓ Bot responds to visitors
✓ Leads are being delivered to [email]
✓ Mobile-optimized

WHAT TO EXPECT:
- Leads will arrive within 1 minute of capture
- Each lead includes full conversation history
- Bot operates 24/7 (even outside business hours)
- Session persistence keeps conversations going

MONITORING:
I'll check in next week to see how it's performing and if any adjustments are needed.

SUPPORT:
If you have questions or want to make changes, just reply to this email.

Welcome aboard!

[Your name]
```

---

## PHASE 4: POST-LAUNCH (Week 1-4)

### Step 8: Week 1 Check-in

**Send after 7 days:**

```
Subject: Week 1 Check-in - How's the Chatbot Performing?

Hi [Name],

Quick check-in! How has the chatbot been working for you?

QUESTIONS:
1. How many leads have you received so far?
2. Are the leads good quality?
3. Any changes you'd like to make?

OPTIMIZATION IDEAS:
- Update welcome message based on common questions
- Add page-specific triggers (e.g., special message on pricing page)
- Adjust business hours if needed
- Update assistant knowledge with FAQs

Let me know if you'd like any adjustments!

Best regards,
[Your name]
```

### Step 9: Month 1 Review

**After 30 days, send analytics:**

```
Subject: Month 1 Report - Your Chatbot Performance

Hi [Name],

Here's how your chatbot performed in the first month:

METRICS:
- Conversations started: [X]
- Leads captured: [Y]
- Conversion rate: [Z%]
- Most common questions: [list top 3]

RECOMMENDATIONS:
[Based on data, suggest 2-3 improvements]

Would you like to schedule a quick call to discuss optimization?

Best regards,
[Your name]
```

---

## ONGOING SUPPORT & MAINTENANCE

### Monthly Tasks (Your Side)

**Every month:**
1. Check chatbot is functioning (5 min)
2. Review lead quality with client (if requested)
3. Update assistant knowledge if needed (10 min)
4. Monitor OpenAI API usage/costs (5 min)

**Bill monthly subscription:**
- Send invoice on same day each month
- €99/month or agreed price
- Include previous month's stats

---

## CLIENT OFFBOARDING (If They Cancel)

### Step 10: Cancellation Process

**When client cancels:**

1. **Confirm cancellation:**
```
Hi [Name],

Sorry to see you go! Just to confirm:
- Your chatbot will remain active until [end of billing period]
- After that, it will be deactivated
- Your data and conversation history will be deleted after 30 days

Would you mind sharing why you're canceling? I'd love to improve the service.

Best regards,
[Your name]
```

2. **Technical cleanup (after billing ends):**
- Remove config file from repo
- Delete/disable OpenAI Assistant
- Deactivate Make.com scenario
- Remove Vercel environment variables

---

## TOOLS & RESOURCES CHECKLIST

### What You Need to Deliver Service:

**Accounts Required:**
□ OpenAI API account (with credits)
□ Vercel account (free tier works)
□ Make.com account (free tier: 1,000 operations/month)
□ Domain for hosting chatbot (if using custom domain)

**Per Client:**
□ OpenAI Assistant ID
□ Make.com webhook URL
□ Client config file
□ Vercel environment variables

**Optional but Recommended:**
□ Project management tool (Trello, Notion)
□ Invoicing software (Stripe, PayPal, Wave)
□ Client portal (for self-service support)
□ Analytics dashboard (Google Data Studio)

---

## PRICING CALCULATOR

**Cost per client:**
- OpenAI API: ~€5-15/month (depends on usage)
- Make.com: €0 (free tier) or €9/month (Core plan)
- Vercel: €0 (free for unlimited clients)

**Your revenue per client:**
- Setup: €299 (one-time)
- Monthly: €99
- Costs: ~€10/month
- **Net profit: €89/month per client**

**At 10 clients:**
- Setup revenue: €2,990
- Monthly revenue: €990
- Monthly costs: €100
- **Monthly profit: €890**

**At 50 clients:**
- Monthly revenue: €4,950
- Monthly costs: €500
- **Monthly profit: €4,450** 🎉

---

## TEMPLATES & DOCUMENTS TO PREPARE

### 1. Service Agreement (Optional but Professional)

Simple 1-page agreement covering:
- Service description
- Pricing and payment terms
- Cancellation policy (30 days notice)
- Data handling
- Support included

### 2. Invoice Template

Include:
- Your company details
- Client details
- Line items (Setup fee / Monthly subscription)
- Payment instructions
- Due date

### 3. Welcome Packet (PDF)

Send after payment:
- Welcome letter
- What to expect
- Timeline
- Onboarding form
- Your contact info

---

## QUICK REFERENCE: NEW CLIENT CHECKLIST

```
□ Phase 1: Pre-Sale
  □ Sales call completed
  □ Proposal sent
  □ Payment received

□ Phase 2: Setup (24-48 hours)
  □ Onboarding form sent
  □ Client info received
  □ Config file created
  □ OpenAI Assistant created
  □ Make.com scenario created
  □ Vercel env vars added
  □ Vercel redeployed

□ Phase 3: Testing
  □ Full testing completed (use checklist)
  □ Test lead received
  □ Mobile tested
  □ Review link sent to client

□ Phase 4: Approval
  □ Client tested chatbot
  □ Feedback addressed
  □ Final approval received

□ Phase 5: Go-Live
  □ Installation code sent
  □ Client installed code
  □ Verified on live site
  □ Confirmation email sent

□ Phase 6: Post-Launch
  □ Week 1 check-in
  □ Month 1 review
  □ Invoice sent for month 2
```

---

## SUMMARY: PROFESSIONAL DELIVERY PROCESS

**Your work per client:**
- Setup time: 2-3 hours
- Testing time: 30 minutes
- Monthly maintenance: 15 minutes

**Client's work:**
- Fill onboarding form: 10 minutes
- Test chatbot: 10 minutes
- Install code: 5-15 minutes (or have developer do it)

**Timeline:**
- Day 1: Payment → Send onboarding form
- Day 2: Receive info → Complete setup → Send test link
- Day 3-4: Client tests → Approve
- Day 5: Client installs → Go live ✅

**Professional touches:**
- Clear communication at every step
- Set expectations upfront
- Test thoroughly before client sees it
- Follow up proactively
- Provide great support

This is a **fully professional, scalable service** that you can deliver to 50+ clients! 🚀
