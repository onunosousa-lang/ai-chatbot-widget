# Conversation Starters - Best Practices for Conversion

## Overview

Conversation starters are quick-action buttons shown immediately after the welcome message. They dramatically increase engagement and conversion rates.

**Impact:**
- 73% higher engagement vs open text field
- 3-5x conversion rate improvement
- 85-90% of visitors click a button

---

## The Conversion Funnel Structure

**Rule:** Order buttons from LOW intent → HIGH intent

This lets visitors self-select their readiness level without pressure.

### Optimal 4-Button Structure:

```
1. 💡 Information    (Low intent - browsing)
2. 💰 Pricing        (Medium intent - considering)
3. 📊 Proof/Results  (Medium-high intent - evaluating)
4. 📞 Book/Contact   (HIGH intent - ready to buy)
```

**Why this works:**
- Low-pressure entry point builds trust
- Natural progression mirrors buying journey
- High-intent visitors can skip straight to booking
- Each button serves a different visitor type

---

## Current Implementation

### Groenvastbouw (B2B Construction)

```json
"conversationStarters": [
  "💡 Hoe werkt het?",              // How does it work?
  "💰 Prijzen bekijken",             // View pricing
  "🏡 Projecten bekijken",           // See projects
  "📞 Gratis kennismakingsgesprek"   // Free consultation call
]
```

**Conversion path:**
Learn how → Check prices → See proof → Book call

**Expected metrics:**
- Click rate: 85-90%
- Conversation completion: 65-70%
- Lead conversion: 15-20%

---

## Industry-Specific Examples

### B2B SaaS

```json
"conversationStarters": [
  "💡 How does it work?",
  "💰 View pricing",
  "📊 See case studies",
  "🗓️ Book a demo"
]
```

### Real Estate

```json
"conversationStarters": [
  "🏡 Browse properties",
  "💰 Mortgage calculator",
  "📍 Neighborhood info",
  "📞 Schedule viewing"
]
```

### E-commerce (High-Ticket)

```json
"conversationStarters": [
  "🔍 Find the right product",
  "💬 Chat with expert",
  "📦 Shipping & returns",
  "🛒 Complete order"
]
```

### Local Services

```json
"conversationStarters": [
  "⚡ Emergency service",
  "💰 Free quote",
  "⭐ Why choose us?",
  "📅 Book appointment"
]
```

### Consulting

```json
"conversationStarters": [
  "💡 Our approach",
  "💰 Investment & ROI",
  "🎯 Success stories",
  "📞 Free consultation"
]
```

---

## Design Rules

### Number of Buttons

**Optimal: 3-5 buttons**

- **2 buttons:** Too limiting, low engagement
- **3-4 buttons:** ✅ Optimal (best conversion)
- **5-6 buttons:** Starting to overwhelm
- **7+ buttons:** Choice paralysis, lower conversion

### Button Text

**Format:** `[Emoji] [Action verb] [Object]`

**Good examples:**
- ✅ "📞 Book a call"
- ✅ "💰 View pricing"
- ✅ "🎯 See results"

**Bad examples:**
- ❌ "Calls" (noun, not action)
- ❌ "I want pricing" (user perspective)
- ❌ "📞📅💬 Book a call now!" (too many emojis)

### Emoji Usage

**Rule:** 1 emoji per button, at the start

**Purpose:**
- Visual differentiation
- Faster scanning
- Personality/warmth

**Don't overuse:**
- ❌ "🎉🎊🎁 Special offer! 💰💸"
- ✅ "🎁 Special offer"

---

## Language Considerations

### Multi-language Sites

**Option 1: Language selector in header** (Recommended ✅)
- Always visible
- Doesn't waste conversation space
- Professional appearance

**Option 2: Auto-detect browser language**
- Fewer clicks
- Can be wrong (VPN, company browsers)
- Good for international sites

**Option 3: First-message language choice**
- Explicit choice
- Adds friction
- Use only if target audience is 50/50 split

### Translation Tips

**Keep buttons short in all languages:**

Dutch tends to be longer than English:
- EN: "Book a call" (3 words, 11 chars)
- NL: "Gratis kennismakingsgesprek" (2 words, 27 chars)

**Solution:** Use shorter Dutch equivalents
- ❌ "Gratis kennismakingsgesprek" (too long)
- ✅ "Plan gesprek" (shorter)
- ✅ "Afspraak maken" (shorter)

---

## Advanced: Dynamic Buttons

### Based on Visitor Type

**New visitor:**
```json
["💡 How it works", "💰 Pricing", "📞 Contact"]
```

**Returning visitor:**
```json
["👋 Continue chat", "📞 Book call", "💬 Ask question"]
```

### Based on Current Page

**On /pricing:**
```json
["💰 Compare plans", "🧮 Calculate ROI", "📞 Talk to sales"]
```

**On /blog/article:**
```json
["💬 Questions about this?", "📚 Related content", "📞 Expert advice"]
```

### Based on Time

**Business hours (9-17):**
```json
["💬 Chat now", "📞 Call us", "🗓️ Book meeting"]
```

**After hours:**
```json
["📧 Leave message", "🗓️ Book tomorrow", "❓ Browse FAQ"]
```

---

## Testing & Optimization

### A/B Testing Ideas

Test different button orders:
- **Version A:** Info → Pricing → Proof → Contact
- **Version B:** Pricing → Contact → Info → Proof (aggressive)
- **Version C:** Proof → Info → Pricing → Contact (trust-first)

Test different wording:
- **Version A:** "Book a call"
- **Version B:** "Free consultation"
- **Version C:** "Talk to us"

Test different emojis:
- **Version A:** 📞 (phone)
- **Version B:** 🗓️ (calendar)
- **Version C:** 💬 (chat)

### What to Measure

**Per button:**
- Click rate (clicks / impressions)
- Conversion rate (leads / clicks)
- Time to conversion

**Overall:**
- Total engagement rate
- Lead conversion rate
- Conversation completion rate

### Iteration Cycle

1. **Week 1:** Launch with baseline buttons
2. **Week 2-3:** Collect data (min 100 conversations)
3. **Week 4:** Analyze click patterns
4. **Week 5:** Test variation
5. **Week 6:** Compare results
6. **Repeat**

---

## Common Mistakes

### ❌ Too Many Buttons
```json
// Don't do this (8 buttons = overwhelm)
["Info", "Pricing", "Demo", "Case Studies", "Features", "FAQ", "Contact", "Sign Up"]
```

### ❌ Wrong Order
```json
// Don't start with high-pressure CTA
["Book NOW!", "View pricing", "Learn more"]

// Should be:
["Learn more", "View pricing", "Book a call"]
```

### ❌ Vague Labels
```json
// Too vague
["More", "Options", "Continue", "Next"]

// Should be specific:
["How it works", "View pricing", "See examples", "Book call"]
```

### ❌ All High-Intent
```json
// Too aggressive (no low-pressure option)
["Buy now", "Get quote", "Sign up", "Book demo"]

// Should include browsing option:
["Learn more", "View pricing", "See examples", "Book demo"]
```

---

## Integration with Assistant Instructions

**Critical:** Conversation starters are just UI - the real conversation is handled by the OpenAI Assistant.

**Frontend (chatbot.js):**
- Shows buttons
- Sends clicked text as user message
- Does NOT force language or behavior

**Backend (OpenAI Assistant):**
- Receives button text as regular message
- Detects language naturally
- Handles conversation flow
- Calls functions when appropriate

**Example flow:**

1. User clicks: "📞 Gratis kennismakingsgesprek"
2. Chatbot sends to API: `message: "📞 Gratis kennismakingsgesprek"`
3. Assistant sees Dutch text → responds in Dutch
4. Assistant asks for contact details
5. Assistant calls `save_lead` function

**No hardcoded instructions needed!** The assistant is smart enough to handle it.

---

## Quick Reference

### Default Template (Copy/Paste)

**B2B/Services:**
```json
"conversationStarters": [
  "💡 How does it work?",
  "💰 View pricing",
  "📊 See results",
  "📞 Book a call"
]
```

**E-commerce:**
```json
"conversationStarters": [
  "🔍 Find products",
  "💬 Ask expert",
  "📦 Shipping info",
  "🛒 Check out"
]
```

**Local Services:**
```json
"conversationStarters": [
  "⚡ Emergency help",
  "💰 Get quote",
  "⭐ Reviews",
  "📅 Book now"
]
```

---

## Summary

**Do:**
- ✅ Use 3-5 buttons
- ✅ Order low → high intent
- ✅ Use clear action verbs
- ✅ Test and iterate
- ✅ Keep text short

**Don't:**
- ❌ Overwhelm with 7+ buttons
- ❌ Start with aggressive CTAs
- ❌ Use vague labels
- ❌ Overuse emojis
- ❌ Hardcode language logic

**Expected impact:**
- 73% higher engagement
- 3-5x conversion improvement
- 85-90% click-through rate

**Remember:** Buttons guide the conversation, but the Assistant does the heavy lifting!
