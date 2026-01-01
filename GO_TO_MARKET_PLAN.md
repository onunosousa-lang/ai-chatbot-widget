# Go-to-Market Plan - AI Chatbot SaaS

## Phase 1: ESSENTIAL (Week 1) - Minimum to Start Selling

### 1. Live Demo Bot (CRITICAL - 1 hour)

**Create demo page:**

```html
<!-- demo.html -->
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Chatbot Demo - Probeer Gratis</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 800px;
            margin: 40px 20px;
            background: white;
            padding: 60px 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }
        h1 {
            font-size: 48px;
            margin: 0 0 20px 0;
            color: #333;
        }
        .subtitle {
            font-size: 24px;
            color: #666;
            margin-bottom: 40px;
        }
        .cta {
            background: #2ee8c2;
            color: white;
            font-size: 20px;
            padding: 18px 40px;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(46, 232, 194, 0.4);
            transition: transform 0.2s;
        }
        .cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(46, 232, 194, 0.5);
        }
        .arrow {
            font-size: 32px;
            margin-top: 30px;
            color: #2ee8c2;
            animation: bounce 2s infinite;
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
            margin-top: 50px;
            text-align: left;
        }
        .feature {
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .feature-icon {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .feature-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
        }
        .feature-desc {
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 Probeer de AI Chatbot</h1>
        <p class="subtitle">Zie hoe het werkt op jouw website</p>

        <button class="cta" onclick="alert('Klik op de chat widget rechtsonder! 👉')">
            Klik rechtsonder om te starten →
        </button>

        <div class="arrow">↓</div>

        <div class="features">
            <div class="feature">
                <div class="feature-icon">💬</div>
                <div class="feature-title">Natuurlijke Conversaties</div>
                <div class="feature-desc">Beantwoordt vragen 24/7</div>
            </div>
            <div class="feature">
                <div class="feature-icon">📧</div>
                <div class="feature-title">Automatische Leads</div>
                <div class="feature-desc">Direct in je inbox</div>
            </div>
            <div class="feature">
                <div class="feature-icon">📱</div>
                <div class="feature-title">Mobiel Geoptimaliseerd</div>
                <div class="feature-desc">Perfect op elke scherm</div>
            </div>
            <div class="feature">
                <div class="feature-icon">🌍</div>
                <div class="feature-title">Meertalig</div>
                <div class="feature-desc">NL, EN, FR, PT</div>
            </div>
        </div>
    </div>

    <!-- Your chatbot -->
    <script
        src="https://ai-chatbot-widget-eight.vercel.app/chatbot.js"
        data-config="https://ai-chatbot-widget-eight.vercel.app/config.demo.json">
    </script>
</body>
</html>
```

**Create config.demo.json:**

```json
{
  "apiUrl": "https://ai-chatbot-widget-eight.vercel.app/api/chat",
  "clientId": "demo",
  "primaryColor": "#667eea",
  "secondaryColor": "#764ba2",
  "companyName": "Demo Bedrijf",
  "welcomeMessage": "...",
  "placeholder": "Typ je vraag...",
  "position": "bottom-right",
  "logo": null,
  "emailButton": true,
  "whatsappButton": true,
  "emailAddress": "demo@example.com",
  "whatsappNumber": "+31612345678",
  "conversationStarters": [],
  "showLanguageSelector": true,
  "languages": ["nl", "en", "fr", "pt"],
  "defaultLanguage": "nl",
  "enableSound": true,
  "enableSessionPersistence": true,
  "enableTypingDelay": true
}
```

**Deploy:**
```bash
git add demo.html config.demo.json
git commit -m "Add demo page"
git push
```

**Result:** https://your-vercel-url.app/demo.html

---

### 2. Simple Landing Page (3 hours)

**Use free tools - NO coding needed:**

**Option A: Carrd.co (RECOMMENDED) €19/year**
- Go to https://carrd.co
- Choose "Landing" template
- Customize in 1 hour
- Custom domain: demo.yourdomain.nl
- Embed your demo bot in the page

**Option B: Notion (FREE)**
- Create Notion page
- Make it public
- Add to Super.so for custom domain (€12/month)

**Must have sections:**
1. **Hero:** "AI Chatbot voor je Website - €99/maand"
2. **Demo:** Embedded live chatbot or link to demo.html
3. **Features:** (3-5 bullet points)
   - 24/7 AI gesprekken
   - Automatische leads
   - Klaar in 48 uur
   - Geen contract
4. **Pricing:** Clear pricing table
5. **CTA:** "Start Gratis Proefperiode" button

**Example copy (Dutch):**

```
[Hero]
Meer Leads met AI Chat
Automatische gesprekken. Directe resultaten.

[Subheading]
Installatie in 48 uur. €99/maand. Geen contract.

[CTA Button]
Gratis Demo Aanvragen →

[Features]
✓ 24/7 beschikbaar voor je klanten
✓ Automatische lead collectie
✓ Direct in je inbox
✓ Werkt op mobiel
✓ Meertalig (NL, EN, FR, PT)

[Social Proof]
"15 leads in de eerste week!" - Jan, Groenvastbouw

[Pricing]
Setup: €299 (eenmalig)
Maand: €99/maand

Inclusief:
- Volledige installatie
- Onbeperkte gesprekken
- Email + Google Sheets
- Maandelijks rapport

[Final CTA]
Klaar om te beginnen?
[Gratis Demo] [Neem Contact Op]
```

---

### 3. Payment Processing (30 min setup)

**For Netherlands/Belgium market:**

**Option A: Mollie (BEST for NL/BE) ⭐**
- Dutch company, perfect for NL/BE
- Supports: iDEAL, Bancontact, credit cards
- Fee: 1.29% + €0.29 per transaction
- https://mollie.com

**Setup:**
```
1. Go to mollie.com/dashboard/signup
2. Verify company (1-2 days)
3. Create payment link:
   - €299 (Setup Fee)
   - €99/month (Subscription)
4. Get payment link
5. Add to landing page
```

**Option B: Stripe (International)**
- For all 4 countries
- Fee: 1.5% + €0.25
- https://stripe.com

**Quick setup:**
```
1. stripe.com/setup
2. Create products:
   - "Chatbot Setup" - €299 one-time
   - "Chatbot Monthly" - €99/month recurring
3. Create payment links
4. Add to landing page
```

**Recommended: Start with Mollie (NL/BE market)**

---

## Phase 2: NICE TO HAVE (Week 2-3)

### 4. Short Demo Video (1 day)

**Script (60 seconds):**

```
[0-10s] Hook
"Mis je leads omdat je website 24/7 vragen niet kan beantwoorden?"

[10-25s] Problem
"Bezoekers hebben vragen. Buiten kantooruren? Weg.
Mobiel surfen? Geen tijd voor formulieren."

[25-40s] Solution
"Onze AI chatbot beantwoordt vragen direct.
Verzamelt leads automatisch.
Werkt 24/7. Ook op mobiel."

[40-50s] Proof
"Groenvastbouw: 15 leads eerste week.
TechStartup: 40% meer conversie."

[50-60s] CTA
"Probeer gratis. Installatie in 48 uur.
Link in bio."
```

**Tools:**
- **Loom** (gratis): Screen recording + webcam
- **CapCut** (gratis): Simple editing
- **Descript** (€12/month): Professional with AI

**Format:**
- Screen recording of demo
- Show chat on website
- Show lead email arriving
- Show mobile version

---

### 5. Case Study (After first 2-3 clients)

**Template:**

```
[Client Logo]

"15 leads in de eerste week"

Bedrijf: Groenvastbouw
Sector: Bouw & Renovatie
Probleem: Leads missen buiten kantooruren

Oplossing:
- AI chatbot met passiefbouw kennis
- 24/7 beschikbaar
- Automatische leads naar email

Resultaten (30 dagen):
- 47 gesprekken gestart
- 15 leads verzameld
- 32% conversie rate
- 3 offertes uitgebracht

[CTA: Wil jij dit ook?]
```

---

## Phase 3: GROWTH (Month 2+)

### 6. Content Marketing

**LinkedIn Posts (3x per week):**
```
Monday: Tip
"3 redenen waarom AI chatbots beter converteren dan formulieren"

Wednesday: Case study
"Hoe [Client] 40% meer leads kreeg in 30 dagen"

Friday: Behind-the-scenes
"Zo installeer je een AI chatbot in 5 minuten"
```

**Blog Posts (1x per week):**
- "AI Chatbot vs Live Chat: Wat is Beter?"
- "Kosten AI Chatbot: Complete Gids 2024"
- "Chatbot Installeren WordPress: Stap-voor-Stap"

---

## Phase 4: AUTOMATION (Month 3+)

### 7. Self-Service Demo

**Let prospects try instantly:**

```html
<!-- instant-demo.html -->
<form id="demo-form">
  <input type="email" placeholder="Je email" required>
  <input type="text" placeholder="Website URL" required>
  <button>Start Demo Nu →</button>
</form>

<script>
// On submit:
// 1. Create temporary config
// 2. Send demo link via email
// 3. Demo expires in 24 hours
</script>
```

**Tools:**
- Make.com: Send email with demo link
- Temporary config: config.temp-[timestamp].json
- Auto-delete after 24h

---

## PRIORITY ORDER: What to Build First

### Week 1 (LAUNCH READY):
1. ✅ Demo bot (1 hour) - Use demo.html above
2. ✅ Landing page (3 hours) - Use Carrd.co
3. ✅ Payment (30 min) - Mollie setup

**You can start selling after Week 1!**

### Week 2-3 (SCALE):
4. Demo video (1 day) - Loom recording
5. Case study (1 hour) - Get from first client

### Month 2+ (GROW):
6. Content marketing
7. LinkedIn outreach
8. Partnerships (web agencies)

### Month 3+ (AUTOMATE):
9. Self-service demo
10. Affiliate program
11. White-label reseller program

---

## IMMEDIATE ACTION PLAN (This Week)

### Monday:
- [ ] Create config.demo.json
- [ ] Create demo.html
- [ ] Deploy to Vercel
- [ ] Test demo page

### Tuesday:
- [ ] Sign up for Carrd.co
- [ ] Create landing page
- [ ] Write copy (use template above)
- [ ] Add demo link

### Wednesday:
- [ ] Sign up for Mollie
- [ ] Create payment links (€299 + €99/month)
- [ ] Add to landing page
- [ ] Test payment flow

### Thursday:
- [ ] Create LinkedIn post announcing launch
- [ ] Reach out to 10 business owners you know
- [ ] Offer: "Eerste 5 klanten: €49/maand eerste 3 maanden"

### Friday:
- [ ] Send 20 cold emails with demo link
- [ ] Post on Dutch business forums
- [ ] Share in Facebook groups

---

## MARKETING CHANNELS (Netherlands/Belgium)

### Free Channels:
1. **LinkedIn** (Dutch + English posts)
   - Connect with business owners
   - Share demo link
   - Post case studies

2. **Facebook Groups**
   - "Ondernemers Nederland"
   - "ZZP Nederland"
   - "Belgian Entrepreneurs"

3. **Cold Email**
   - Find emails: hunter.io
   - Template: "Saw your website, noticed you don't have chat..."

4. **Reddit**
   - r/Netherlands
   - r/Belgium
   - r/entrepreneur

### Paid Channels (Later):
1. **Google Ads** (€200/month)
   - Keywords: "chatbot website", "AI chat Nederland"
   - Target: Netherlands, Belgium

2. **LinkedIn Ads** (€300/month)
   - Target: Business owners, Marketing managers
   - Industries: B2B services, Real estate

3. **Facebook Ads** (€150/month)
   - Retargeting demo page visitors

---

## MULTI-LANGUAGE STRATEGY

### Netherlands/Belgium (Primary):
- Landing page: Dutch
- Demo bot: Dutch default (NL/EN switcher)
- Payment: Mollie (supports iDEAL/Bancontact)

### France (Secondary):
- Landing page: French version (carrd.co allows multiple pages)
- Demo bot: French default
- Payment: Mollie or Stripe

### Portugal (Tertiary):
- Start with English landing page
- Add Portuguese later if demand
- Demo bot: Portuguese support ready

**Recommendation:** Start NL/BE only. Add FR/PT after 10 clients.

---

## COST BREAKDOWN

### Month 1:
| Item | Cost |
|------|------|
| Carrd.co (landing page) | €19/year (€1.60/month) |
| Mollie (payment) | €0 (pay-per-transaction) |
| Domain (optional) | €10/year |
| **Total** | **~€12 first month** |

### Per Client:
| Item | Monthly Cost |
|------|--------------|
| OpenAI API | €5-15 |
| Make.com | €0 (free tier) |
| Vercel | €0 (free tier) |
| **Total per client** | **~€10** |

**Profit per client:** €99 - €10 = **€89/month**

---

## SALES SCRIPT (Cold Email)

**Subject:** Meer leads met AI chat op [theirwebsite.nl]?

```
Hi [Name],

Ik zag je website [theirwebsite.nl].

Vraag: Hoeveel bezoekers verlaat je site buiten kantooruren zonder contact op te nemen?

Ik help bedrijven zoals [their industry] met een AI chatbot die:
- 24/7 vragen beantwoordt
- Automatisch leads verzamelt
- In 48 uur live staat

Voorbeeld: Groenvastbouw kreeg 15 leads in week 1.

Wil je zien hoe het op jouw site werkt?
[Link naar demo]

Installatie: €299
Maandelijks: €99

Groet,
[Your name]

PS: Eerste 5 klanten betalen €49/maand voor 3 maanden.
```

---

## SUCCESS METRICS

### Month 1 Goals:
- [ ] 3 paying clients
- [ ] €297 setup revenue
- [ ] €297 monthly recurring (3 × €99)

### Month 3 Goals:
- [ ] 10 clients
- [ ] €990 MRR
- [ ] 1 case study
- [ ] 1 testimonial video

### Month 6 Goals:
- [ ] 25 clients
- [ ] €2,475 MRR
- [ ] 3 case studies
- [ ] Automated demo system

### Month 12 Goals:
- [ ] 50 clients
- [ ] €4,950 MRR
- [ ] Partner with 3 web agencies
- [ ] Launch white-label program

---

## LAUNCH CHECKLIST

**Before reaching out to first client:**

- [ ] Demo page live and working
- [ ] Landing page live with clear pricing
- [ ] Payment link working (test payment)
- [ ] Email template ready
- [ ] LinkedIn profile optimized
- [ ] Response time: < 2 hours

**You're ready to sell!** 🚀

Start with friends/network → Get testimonial → Scale with cold outreach.
