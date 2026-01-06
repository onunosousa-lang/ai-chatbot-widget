# ✅ GROENVASTBOUW CHATBOT - READY TO DEPLOY

Everything is configured and ready. Here's your deployment checklist.

---

## 🎨 **COLORS - CONFIGURED ✅**

```json
{
  "headerColor": "#2A3439",      // Dark slate header (matches your website)
  "primaryColor": "#90dc35",     // Groenvastbouw green buttons
  "secondaryColor": "#6fb820"    // Hover state
}
```

**Result:** Your chatbot header will be dark slate, buttons will be Groenvastbouw green.

---

## 💬 **CONVERSATION STARTERS - CONFIGURED ✅**

```json
{
  "conversationStarters": [
    "Plan een gesprek",  // Triggers intake flow
    "Stel een vraag"     // Invites questions
  ]
}
```

**English versions automatically shown to English visitors:**
- "Schedule a call"
- "Ask a question"

---

## 🤖 **ASSISTANT INSTRUCTIONS - READY TO PASTE ✅**

**File:** `ASSISTANT_INSTRUCTIONS_GROENVASTBOUW.md`

Your excellent human-first instructions are now updated to:
- ✅ Recognize "Plan een gesprek" → Start 3-question intake
- ✅ Recognize "Stel een vraag" → Invite questions
- ✅ Natural conversation flow (no rigid menus)
- ✅ Early contact offering (based on intent)
- ✅ Immediate `save_lead()` function calling
- ✅ All Groenvastbouw product info included

---

## 📋 **DEPLOYMENT STEPS**

### **1. Upload Instructions to OpenAI (5 minutes)**

1. Go to https://platform.openai.com/assistants
2. Open your Groenvastbouw assistant
3. **Copy ALL text** from `ASSISTANT_INSTRUCTIONS_GROENVASTBOUW.md`
4. Paste into the Instructions field (replace everything)
5. Verify `save_lead` function exists with these parameters:
   ```json
   {
     "name": {"type": "string"},
     "email": {"type": "string"},
     "phone": {"type": "string"},
     "preferred_time": {"type": "string"},
     "notes": {"type": "string"}
   }
   ```
6. Click Save
7. Copy the Assistant ID (e.g., `asst_abc123xyz`)

### **2. Update Environment Variable (2 minutes)**

In Vercel dashboard:
- Go to Settings → Environment Variables
- Update or add:
  ```
  CLIENT_GROENVASTBOUW_ASSISTANT_ID=asst_your_id_here
  ```
- Select: Production, Preview, Development
- Save
- Redeploy if needed

### **3. Deploy Config (Automatic)**

The config is already in your GitHub repo:
- File: `config.groenvastbouw.json`
- Branch: `claude/optimize-chatbot-flow-UqS33`
- Status: ✅ Pushed

When you merge the PR or deploy from Vercel, the config will be live.

### **4. Test (5 minutes)**

**Test scenario 1: "Plan een gesprek"**
```
1. Open chatbot
2. Click "Plan een gesprek"
3. Should ask: "Fijn! Mag ik je naam?"
4. Provide: "Jan de Vries"
5. Should ask: "Hoe kan ons team je het beste bereiken?"
6. Provide: "jan@example.com"
7. Should ask: "Waar gaat het over?"
8. Provide: "Passief huis, Utrecht"
9. Should call save_lead() and confirm
10. Check Make.com webhook received the lead
```

**Test scenario 2: "Stel een vraag"**
```
1. Click "Stel een vraag"
2. Should say: "Stel gerust je vraag, ik help je graag!"
3. Ask: "Wat kost een passief huis?"
4. Should give price range naturally
5. Should NOT ask for contact info (unless you volunteer it)
```

**Test scenario 3: Language toggle**
```
1. Start in Dutch
2. Toggle to English
3. Conversation should continue in English
4. All responses should be in English
```

---

## 🎯 **WHAT YOUR CHATBOT DOES**

### **Visual Design:**
```
┌─────────────────────────────────┐
│ Groenvastbouw            [×]    │  ← Dark slate (#2A3439)
│ ● Online now                    │  ← Green dot (#90dc35)
├─────────────────────────────────┤
│ Welkom terug! Hoe kan ik je    │
│ vandaag helpen?                 │
│                                 │
│  ┌──────────────────────────┐  │
│  │  Plan een gesprek        │  │  ← Green (#90dc35)
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │  Stel een vraag          │  │  ← Green (#90dc35)
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

### **Conversation Behavior:**

**"Plan een gesprek" → 3-question intake:**
1. Name
2. Email or phone
3. Brief context (what to discuss)
Then: save_lead() → confirmation → continue conversation

**"Stel een vraag" → Natural Q&A:**
- Answers questions naturally
- No forced menus
- Offers contact when user shows intent (pricing, timeline, project details)
- Human, professional, helpful

---

## 📊 **LEAD FLOW**

When user completes "Plan een gesprek":

```
User provides: Jan, jan@example.com, "Passief huis Utrecht"
         ↓
Assistant calls save_lead()
         ↓
API sends to Make.com webhook
         ↓
Make.com router reads clientId="groenvastbouw"
         ↓
Routes to your configured destination (Email/Sheets/CRM)
         ↓
You receive lead with full conversation history
```

---

## ✅ **FINAL CHECKLIST**

**Configuration:**
- [x] Colors configured (#2A3439, #90dc35, #6fb820)
- [x] Conversation starters set ("Plan een gesprek", "Stel een vraag")
- [x] Config pushed to GitHub
- [x] Widget supports custom header colors

**Assistant:**
- [ ] Instructions uploaded to OpenAI platform
- [ ] save_lead function configured
- [ ] Assistant ID copied

**Environment:**
- [ ] CLIENT_GROENVASTBOUW_ASSISTANT_ID added to Vercel
- [ ] LEAD_WEBHOOK_URL configured (Make.com)
- [ ] Deployment triggered

**Testing:**
- [ ] "Plan een gesprek" tested (3-question flow)
- [ ] "Stel een vraag" tested (natural Q&A)
- [ ] Language toggle tested (NL ↔ EN)
- [ ] Lead arrives in Make.com
- [ ] Lead routes to correct destination

---

## 🚀 **READY TO GO LIVE**

Once you complete the checklist above:
- ✅ Chatbot matches Groenvastbouw brand
- ✅ Natural, human conversation flow
- ✅ Conversion-optimized with clear options
- ✅ Automatic lead capture and routing
- ✅ Works in Dutch and English
- ✅ Mobile-optimized

**Time to complete:** ~15 minutes
**Complexity:** Simple (just copy-paste and configure)

---

**Need help?** Check:
- `ASSISTANT_INSTRUCTIONS_GROENVASTBOUW.md` - Full instructions to paste
- `COMPLETE_SETUP_CHECKLIST.md` - Detailed setup guide
- `MAKE_SCENARIO_SETUP.md` - Make.com webhook setup

**Questions?** Everything is documented and ready to deploy!
