# Lead Capping System Implementation

Implement usage limits per client to enforce pricing tiers and prevent abuse.

---

## 📊 Pricing Tiers

| Tier | Monthly Price | Lead Limit | Features |
|------|--------------|------------|----------|
| **Free** | €0 | 10 leads/month | Basic chatbot, standard branding |
| **Starter** | €29/month | 50 leads/month | Custom branding, analytics |
| **Pro** | €79/month | 200 leads/month | CRM integration, lead scoring |
| **Enterprise** | €199/month | Unlimited | Everything + white-label |

---

## 🏗️ Architecture Options

### Option A: Simple Counter (Recommended for MVP)
**Storage:** Environment variables + manual tracking
**Pros:** No database needed, quick to implement
**Cons:** Manual reset each month, no real-time tracking

### Option B: Vercel KV (Redis)
**Storage:** Vercel KV (built-in Redis)
**Pros:** Real-time tracking, automatic reset, scales well
**Cons:** Requires Vercel Pro plan ($20/mo)

### Option C: External Database
**Storage:** Supabase, MongoDB, PostgreSQL
**Pros:** Full control, advanced analytics
**Cons:** More complex, additional service needed

**Recommended:** Start with **Option B (Vercel KV)** - best balance of simplicity and features

---

## 📦 Option B: Vercel KV Implementation

### Step 1: Enable Vercel KV

1. Go to Vercel dashboard
2. Select your project: `ai-chatbot-widget-eight`
3. Go to **Storage** tab
4. Click **"Create Database"** → **"KV"**
5. Name it: `chatbot-lead-counter`
6. Click **"Create"**

Vercel will automatically add these environment variables:
```
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

### Step 2: Install KV Client

```bash
npm install @vercel/kv
```

### Step 3: Add Lead Tracking to API

Update `api/chat/index.js`:

```javascript
import OpenAI from 'openai';
import { kv } from '@vercel/kv';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // ... existing CORS headers ...

  try {
    const { message, threadId, clientId = 'default' } = req.body;

    // Get client-specific configuration
    const clientConfig = getClientConfig(clientId);

    // Check lead limit BEFORE processing conversation
    const canAcceptLead = await checkLeadLimit(clientId, clientConfig.tier);
    if (!canAcceptLead) {
      return res.status(429).json({
        error: 'Lead limit reached',
        message: 'You have reached your monthly lead limit. Please upgrade your plan.',
        upgradeUrl: 'https://your-pricing-page.com'
      });
    }

    // ... rest of existing chat logic ...

  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Get client configuration with tier information
function getClientConfig(clientId) {
  const assistantId = process.env[`CLIENT_${clientId.toUpperCase()}_ASSISTANT_ID`] || process.env.OPENAI_ASSISTANT_ID;
  const webhookUrl = process.env[`CLIENT_${clientId.toUpperCase()}_WEBHOOK_URL`] || process.env.LEAD_WEBHOOK_URL;
  const tier = process.env[`CLIENT_${clientId.toUpperCase()}_TIER`] || 'free';

  if (!assistantId) {
    throw new Error(`No assistant ID configured for client: ${clientId}`);
  }

  return {
    assistantId,
    webhookUrl,
    tier,
    clientId
  };
}

// Check if client can accept more leads this month
async function checkLeadLimit(clientId, tier) {
  const limits = {
    'free': 10,
    'starter': 50,
    'pro': 200,
    'enterprise': -1 // unlimited
  };

  const limit = limits[tier] || limits['free'];

  // Enterprise has no limits
  if (limit === -1) return true;

  // Get current month key
  const now = new Date();
  const monthKey = `leads:${clientId}:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Get current count
  const currentCount = await kv.get(monthKey) || 0;

  // Check if limit reached
  return currentCount < limit;
}

// Increment lead count (call this AFTER save_lead succeeds)
async function incrementLeadCount(clientId) {
  const now = new Date();
  const monthKey = `leads:${clientId}:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Increment counter
  await kv.incr(monthKey);

  // Set expiry to end of next month (auto-cleanup)
  const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  const ttl = Math.floor((endOfNextMonth - now) / 1000);
  await kv.expire(monthKey, ttl);
}

// Update saveLead function to increment counter
async function saveLead(leadData, webhookUrl, clientId) {
  const { name, email, phone, preferred_time, notes } = leadData;

  console.log('📧 New Lead Collected:', leadData);

  // Send lead via webhook
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          preferred_time,
          notes,
          timestamp: new Date().toISOString(),
          source: 'chatbot',
          clientId
        })
      });

      // Only increment count if webhook succeeds
      await incrementLeadCount(clientId);

    } catch (error) {
      console.error('Webhook error:', error);
      // Don't increment count if webhook fails
      throw error;
    }
  }

  return true;
}
```

### Step 4: Update saveLead Calls

Find where `saveLead()` is called and pass `clientId`:

```javascript
// In the function calling handler
for (const toolCall of toolCalls) {
  if (toolCall.function.name === 'save_lead') {
    const args = JSON.parse(toolCall.function.arguments);

    // Save the lead with client-specific webhook and clientId
    await saveLead(args, clientConfig.webhookUrl, clientId);

    toolOutputs.push({
      tool_call_id: toolCall.id,
      output: JSON.stringify({ success: true, message: 'Lead saved successfully' })
    });
  }
}
```

### Step 5: Set Client Tiers in Environment Variables

In Vercel → **Settings** → **Environment Variables**, add tier for each client:

```
CLIENT_GROENVASTBOUW_TIER = pro
CLIENT_ACMECORP_TIER = starter
CLIENT_TESTCLIENT_TIER = free
```

**Tier values:** `free`, `starter`, `pro`, `enterprise`

### Step 6: Deploy

```bash
git add .
git commit -m "Add lead capping system with Vercel KV"
git push origin main
```

Vercel will automatically redeploy.

---

## 🧪 Testing Lead Caps

### Manual Test via Browser

1. Open chatbot for a test client
2. Collect leads until limit reached
3. Next lead should show error:
   ```json
   {
     "error": "Lead limit reached",
     "message": "You have reached your monthly lead limit. Please upgrade your plan.",
     "upgradeUrl": "https://your-pricing-page.com"
   }
   ```

### Check Current Usage via Vercel KV

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Check lead count
vercel kv get leads:groenvastbouw:2025-01
```

**Output:** `5` (current number of leads this month)

### Reset Counter Manually

```bash
vercel kv set leads:groenvastbouw:2025-01 0
```

### View All Clients

```bash
vercel kv keys 'leads:*'
```

**Output:**
```
leads:groenvastbouw:2025-01
leads:acmecorp:2025-01
leads:testclient:2025-01
```

---

## 📊 Admin Dashboard (Optional)

Create an admin page to view usage: `api/admin/stats.js`

```javascript
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Add authentication here!
  const authToken = req.headers.authorization;
  if (authToken !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get all client keys
    const keys = await kv.keys('leads:*');
    const stats = [];

    for (const key of keys) {
      const count = await kv.get(key);
      const [_, clientId, month] = key.split(':');

      stats.push({
        clientId,
        month,
        leadsCollected: count,
        tier: process.env[`CLIENT_${clientId.toUpperCase()}_TIER`] || 'free'
      });
    }

    return res.status(200).json({ stats });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

**Access:**
```bash
curl -H "Authorization: Bearer YOUR_SECRET" \
  https://ai-chatbot-widget-eight.vercel.app/api/admin/stats
```

**Response:**
```json
{
  "stats": [
    {
      "clientId": "groenvastbouw",
      "month": "2025-01",
      "leadsCollected": 15,
      "tier": "pro"
    },
    {
      "clientId": "acmecorp",
      "month": "2025-01",
      "leadsCollected": 48,
      "tier": "starter"
    }
  ]
}
```

---

## 🔔 Usage Alerts

Send alerts when clients approach their limit:

```javascript
async function incrementLeadCount(clientId) {
  const now = new Date();
  const monthKey = `leads:${clientId}:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Increment counter
  const newCount = await kv.incr(monthKey);

  // Get tier and limit
  const tier = process.env[`CLIENT_${clientId.toUpperCase()}_TIER`] || 'free';
  const limits = { 'free': 10, 'starter': 50, 'pro': 200, 'enterprise': -1 };
  const limit = limits[tier];

  // Send alert at 80% and 100%
  const percentUsed = (newCount / limit) * 100;

  if (percentUsed === 80) {
    await sendUsageAlert(clientId, newCount, limit, '80% of your lead limit used');
  }

  if (percentUsed === 100) {
    await sendUsageAlert(clientId, newCount, limit, 'Lead limit reached! Please upgrade.');
  }

  // Set expiry
  const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  const ttl = Math.floor((endOfNextMonth - now) / 1000);
  await kv.expire(monthKey, ttl);
}

async function sendUsageAlert(clientId, currentCount, limit, message) {
  // Send email via SendGrid, Resend, or your email service
  console.log(`🚨 Alert for ${clientId}: ${message} (${currentCount}/${limit})`);

  // Or send to Make.com webhook for automated email
  const alertWebhookUrl = process.env.USAGE_ALERT_WEBHOOK_URL;
  if (alertWebhookUrl) {
    await fetch(alertWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        currentCount,
        limit,
        message,
        timestamp: new Date().toISOString()
      })
    });
  }
}
```

---

## 💳 Upgrade Flow

When limit reached, show upgrade options in chatbot:

Update `chatbot.js` to handle 429 error:

```javascript
fetch(config.apiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message, clientId: config.clientId, threadId: currentThreadId })
})
.then(res => {
  if (res.status === 429) {
    return res.json().then(data => {
      hideTyping();
      addMessage(
        `⚠️ ${data.message}\n\nUpgrade your plan to continue collecting leads: ${data.upgradeUrl}`,
        'bot'
      );
      throw new Error('Lead limit reached');
    });
  }
  return res.json();
})
.then(data => {
  // ... normal flow ...
})
```

---

## 📈 Analytics & Reporting

### Monthly Report Email

Send automated monthly reports to clients:

**Make.com Scenario:**
1. **Schedule**: First day of each month
2. **HTTP Module**: GET `/api/admin/stats?clientId=groenvastbouw`
3. **Email Module**: Send report with:
   - Leads collected last month
   - Percentage of limit used
   - Conversation statistics
   - Upgrade suggestions

### Revenue Dashboard

Track MRR (Monthly Recurring Revenue):

```javascript
// api/admin/revenue.js
export default async function handler(req, res) {
  const pricing = { free: 0, starter: 29, pro: 79, enterprise: 199 };

  const clients = [
    { id: 'groenvastbouw', tier: 'pro' },
    { id: 'acmecorp', tier: 'starter' },
    // ... load from database or env vars
  ];

  const mrr = clients.reduce((total, client) => {
    return total + pricing[client.tier];
  }, 0);

  return res.status(200).json({
    mrr,
    clients: clients.length,
    breakdown: {
      free: clients.filter(c => c.tier === 'free').length,
      starter: clients.filter(c => c.tier === 'starter').length,
      pro: clients.filter(c => c.tier === 'pro').length,
      enterprise: clients.filter(c => c.tier === 'enterprise').length
    }
  });
}
```

---

## 🔐 Security Considerations

### Prevent Abuse

1. **Rate limiting**: Max leads per hour per client
2. **Duplicate detection**: Don't count same email twice
3. **Fraud detection**: Flag suspicious patterns
4. **IP blocking**: Block spam IPs

**Implementation:**

```javascript
async function saveLead(leadData, webhookUrl, clientId) {
  const { email } = leadData;

  // Check if email already exists this month
  const emailKey = `lead:${clientId}:${email}:${getCurrentMonth()}`;
  const exists = await kv.get(emailKey);

  if (exists) {
    console.log('Duplicate lead detected:', email);
    return false; // Don't count duplicate
  }

  // Save email to prevent duplicates
  await kv.set(emailKey, 1, { ex: 30 * 24 * 60 * 60 }); // 30 days

  // ... rest of saveLead function ...
}
```

---

## 🎯 Monetization Strategy

### Pricing Psychology

**Recommended pricing:**
- Free: €0 (10 leads) - Hook customers
- Starter: €29/mo (50 leads) - €0.58 per lead
- Pro: €79/mo (200 leads) - €0.40 per lead ⭐ Best value
- Enterprise: €199/mo (unlimited) - High-value clients

**Highlight "Pro" as most popular**

### Add-Ons

Charge extra for:
- Additional leads: €1 per lead over limit
- CRM integration setup: €100 one-time
- Custom assistant training: €200
- White-label branding: €50/mo

### Annual Discounts

Offer 2 months free for annual:
- Starter: €290/year (save €58)
- Pro: €790/year (save €158)
- Enterprise: €1,990/year (save €398)

---

## 🚀 Next Steps

1. ✅ Enable Vercel KV
2. ✅ Update API with lead tracking
3. ✅ Set client tiers in env vars
4. ✅ Test with different clients
5. ✅ Create admin dashboard
6. ✅ Set up usage alerts
7. ✅ Build pricing page
8. ✅ Add payment integration (Stripe)

---

## 💡 Future Enhancements

### Real-Time Usage Widget

Show clients their usage in chatbot:
```
"💬 You have used 35/50 leads this month"
```

### Auto-Upgrade Prompts

When reaching 90%:
```
"You're almost at your limit! Upgrade to Pro for unlimited leads: [Upgrade Now]"
```

### Usage-Based Pricing

Alternative to tiers:
- Pay per lead: €2 per qualified lead
- No monthly fee, only pay for results
- Appeals to small businesses

---

**Questions?** Test the system and monitor Vercel KV for real-time usage tracking!
