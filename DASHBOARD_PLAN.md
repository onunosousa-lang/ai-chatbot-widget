# Dashboard Plan: Client Chatbot Management System

## Overview
Build an admin dashboard at `/dashboard` for managing client chatbot configurations, deployments, and monitoring.

---

## Current State Analysis

### What We Have:
- ✅ Onboarding intake form (`/onboarding.html`)
- ✅ Config generation API (`/api/intake`)
- ✅ Multiple client configs (JSON files: `config.groenvastbouw.json`, `config.demo.json`)
- ✅ Chatbot widget (`chatbot.js`)
- ✅ Chat API (`/api/chat`)
- ✅ Email notifications (Gmail SMTP)

### What's Missing:
- ❌ Central dashboard to view all clients
- ❌ Easy way to edit client configs
- ❌ Visual config builder (instead of manual JSON editing)
- ❌ Deployment workflow from dashboard
- ❌ Client status tracking (active, pending setup, inactive)
- ❌ Usage analytics per client
- ❌ Authentication/authorization

---

## Dashboard Features - Phase 1 (MVP)

### 1. Client List View
- Table showing all clients with:
  - Client ID
  - Company name
  - Status (pending, active, paused)
  - Created date
  - Last modified
  - Quick actions (view, edit, test, delete)

### 2. Client Detail/Edit View
- Visual form to edit all config options:
  - Company info
  - Branding (colors, logo)
  - Behavior settings
  - Messages/translations
  - OpenAI Assistant ID
  - Webhook settings
- Live preview of chatbot with current settings
- Save changes
- Generate embed code

### 3. New Client Setup Wizard
- Step 1: Import from onboarding form OR manual entry
- Step 2: Configure OpenAI Assistant
- Step 3: Set up webhooks
- Step 4: Test chatbot
- Step 5: Deploy & generate embed code

### 4. Deployment/Embed Code
- Generate HTML snippet for client
- Copy-to-clipboard
- Preview widget
- Installation instructions

---

## Technical Architecture Decisions

### Decision 1: Storage Layer

**Options:**

**A) File-based (Current + Git)**
- ✅ No new infrastructure needed
- ✅ Version control with Git
- ✅ Works with existing JSON files
- ❌ Concurrent edits risky
- ❌ No transactions
- ❌ Slower queries for large datasets

**B) Vercel KV (Redis)**
- ✅ Fast key-value storage
- ✅ Free tier: 256 MB, 100k requests/month
- ✅ Simple API
- ✅ Serverless-friendly
- ❌ Additional service
- ❌ No complex queries

**C) Vercel Postgres**
- ✅ Full relational database
- ✅ Free tier: 256 MB, 60 hours compute/month
- ✅ Complex queries
- ✅ Transactions
- ❌ Overkill for MVP
- ❌ More setup required

**RECOMMENDATION: Option B (Vercel KV)**
- Simple, fast, free tier sufficient
- Easy migration path to Postgres later if needed
- Perfect for key-value client configs

---

### Decision 2: Frontend Framework

**Options:**

**A) Vanilla HTML/CSS/JS**
- ✅ Consistent with onboarding form
- ✅ No build step
- ✅ Lightweight
- ❌ Hard to manage complex UI
- ❌ No state management
- ❌ More manual work

**B) React (via Next.js)**
- ✅ Already on Vercel (Next.js optimized)
- ✅ Component reusability
- ✅ Great ecosystem
- ✅ Easy to add real-time features
- ❌ Requires build step
- ❌ Larger bundle size

**C) Vue/Alpine.js**
- ✅ Lightweight
- ✅ Easy to learn
- ❌ Different from rest of stack
- ❌ Less Vercel optimization

**RECOMMENDATION: Option B (Next.js + React)**
- Vercel's native framework
- Best for complex dashboard UI
- Easy to add features later
- Can still serve static `/onboarding.html` alongside

---

### Decision 3: Authentication

**Options:**

**A) No Auth (IP whitelist)**
- ✅ Simplest
- ✅ No user management
- ❌ Insecure
- ❌ Not scalable

**B) Simple password (single admin)**
- ✅ Quick to implement
- ✅ Better than nothing
- ❌ Not production-grade
- ❌ No user roles

**C) NextAuth.js (OAuth + Email)**
- ✅ Industry standard
- ✅ Multiple providers (Google, Email magic link)
- ✅ Session management
- ✅ Free
- ❌ Requires setup

**RECOMMENDATION: Option C (NextAuth.js)**
- Professional solution
- Easy to set up with Google OAuth
- Can add email magic links
- Future-proof for team growth

---

### Decision 4: Dashboard Structure

**File Structure:**
```
/app (Next.js App Router)
  /dashboard
    /page.tsx                 # Client list
    /[clientId]
      /page.tsx               # Client detail/edit
    /new
      /page.tsx               # New client wizard
    /components
      /ClientList.tsx
      /ClientForm.tsx
      /ChatbotPreview.tsx
      /CodeGenerator.tsx
  /api
    /clients
      /route.ts               # GET all, POST new
      /[clientId]
        /route.ts             # GET, PUT, DELETE one
    /deploy
      /[clientId]
        /route.ts             # Deploy client config
```

---

## Data Models

### Client Record (Vercel KV)

```typescript
interface Client {
  // Identity
  client_id: string;              // Primary key

  // Company
  company: {
    name: string;
    website: string;
    industry: string;
    country: string;
    service_area: string[];
    languages: string[];
    website_default_language: string;
    privacy_url: string;
    contact: {
      lead_notification_email: string;
      lead_notification_phone: string;
      contact_hours: string;
    };
  };

  // Offer
  offer: {
    one_liner: string;
    customer_type: "b2c" | "b2b" | "both";
    top_services: string[];
    typical_budget_range: string;
    typical_timeline: string;
    key_differentiator: string;
    not_offered: string[];
  };

  // Behavior
  behavior: {
    language_mode: string;
    first_message_mode: string;
    ask_contact_when_intent: boolean;
    lead_fields_required: string[];
    allow_price_ranges: boolean;
    indicative_pricing_text: string;
    calendly_enabled: boolean;
    calendly_url: string;
  };

  // Branding
  branding: {
    bot_display_name: string;
    tone: "professional" | "friendly" | "neutral";
    primary_color: string;
    logo_url: string;
  };

  // Internal/Routing (not in public config)
  routing: {
    assistant_id: string;           // OpenAI Assistant ID
    lead_webhook_url: string;       // Make.com webhook
    api_url: string;                // Usually /api/chat
  };

  // Metadata
  metadata: {
    status: "pending" | "active" | "paused" | "archived";
    created_at: string;
    updated_at: string;
    created_by: string;             // User email
    source: "intake_form" | "manual" | "import";
    notes: string;
  };

  // Widget config (for existing clients)
  widget?: {
    primaryColor: string;
    secondaryColor: string;
    welcomeMessage: string;
    placeholder: string;
    position: string;
    emailButton: boolean;
    whatsappButton: boolean;
    emailAddress: string;
    whatsappNumber: string;
    conversationStarters: string[];
    businessHours: {
      start: string;
      end: string;
      days: number[];
      timezone: string;
    };
    messages: Record<string, any>;
  };
}
```

### KV Keys Pattern:
```
clients:list              → Array of all client_ids
client:{client_id}        → Full client object
client:{client_id}:status → Quick status lookup
```

---

## API Endpoints

### Client Management
```
GET    /api/clients              → List all clients
POST   /api/clients              → Create new client
GET    /api/clients/:id          → Get one client
PUT    /api/clients/:id          → Update client
DELETE /api/clients/:id          → Delete client
PATCH  /api/clients/:id/status   → Update status only
```

### Deployment
```
POST   /api/clients/:id/deploy   → Generate/update config file
GET    /api/clients/:id/embed    → Get embed code
POST   /api/clients/:id/test     → Send test message
```

### Import
```
POST   /api/clients/import       → Import from onboarding form data
```

---

## User Flow

### Creating New Client from Dashboard

1. **Click "New Client"** → Opens wizard
2. **Step 1: Source**
   - Option A: "Import from Onboarding" → Show list of pending intakes
   - Option B: "Create Manually" → Go to blank form
3. **Step 2: Configure**
   - Fill/edit all fields with visual form
   - Live preview on right side
4. **Step 3: OpenAI Setup**
   - Input Assistant ID
   - Test connection
5. **Step 4: Webhook Setup**
   - Input Make.com webhook URL
   - Test webhook
6. **Step 5: Review & Deploy**
   - Summary of all settings
   - Click "Activate Client"
   - Generates embed code
7. **Success**
   - Show embed code
   - Send email to client with instructions
   - Redirect to client detail page

---

## Phase 1 MVP Scope

### Must Have:
1. ✅ Authentication (NextAuth with Google)
2. ✅ Client list page (read-only)
3. ✅ Client detail page (view + edit)
4. ✅ Create new client (manual form)
5. ✅ Save to Vercel KV
6. ✅ Generate embed code
7. ✅ Live preview widget

### Nice to Have (Phase 2):
- Import from intake form
- Analytics dashboard
- Bulk operations
- Client search/filter
- Activity log
- Email templates customization
- Multi-user permissions

### Skip for MVP:
- Advanced analytics
- A/B testing
- White-label options
- API rate limiting per client
- Custom domains

---

## Migration Strategy

### Existing Clients (JSON files)
1. Create migration script: `/scripts/migrate-json-to-kv.js`
2. Reads all `config.*.json` files
3. Transforms to new schema
4. Imports to Vercel KV
5. Keeps JSON files as backup

### Onboarding Form Integration
1. Update `/api/intake` to also save to KV
2. Add status: "pending"
3. Dashboard shows pending clients
4. Admin can review and activate

---

## Security Considerations

1. **Authentication**
   - NextAuth with Google OAuth
   - Restrict to specific email domain (e.g., @chatmate.nl)

2. **Authorization**
   - Middleware checks auth on all `/dashboard/*` routes
   - API routes check auth token

3. **Secrets Management**
   - Client configs DON'T include OpenAI API key (stays in env)
   - Webhook URLs stored encrypted in KV
   - Assistant IDs are safe to store

4. **Rate Limiting**
   - Dashboard API endpoints: 100 req/min per user
   - Public endpoints: existing rate limits

---

## Environment Variables (Additional)

```bash
# Existing
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
ADMIN_EMAIL=...

# New for Dashboard
NEXTAUTH_SECRET=random-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
KV_REST_API_URL=...              # Auto-provided by Vercel
KV_REST_API_TOKEN=...            # Auto-provided by Vercel
ALLOWED_ADMIN_EMAILS=admin@chatmate.nl,user@chatmate.nl
```

---

## Implementation Steps

### Step 1: Setup Next.js (30 min)
- [ ] Install Next.js 14 (App Router)
- [ ] Configure TypeScript
- [ ] Set up folder structure
- [ ] Update vercel.json

### Step 2: Setup Vercel KV (15 min)
- [ ] Create KV store in Vercel dashboard
- [ ] Install @vercel/kv package
- [ ] Test connection

### Step 3: Setup Authentication (45 min)
- [ ] Install NextAuth.js
- [ ] Configure Google OAuth provider
- [ ] Create auth middleware
- [ ] Protect dashboard routes

### Step 4: Client API (60 min)
- [ ] Create /api/clients CRUD endpoints
- [ ] Add validation
- [ ] Test with Postman/Insomnia

### Step 5: Client List UI (90 min)
- [ ] Create dashboard layout
- [ ] Build client list table
- [ ] Add search/filter
- [ ] Add pagination

### Step 6: Client Detail/Edit UI (120 min)
- [ ] Create client form with all fields
- [ ] Add validation
- [ ] Connect to API
- [ ] Add save/cancel

### Step 7: Live Preview (60 min)
- [ ] Embed chatbot.js in iframe
- [ ] Update config dynamically
- [ ] Add toggle to show/hide

### Step 8: Embed Code Generator (30 min)
- [ ] Create code snippet template
- [ ] Add copy button
- [ ] Show installation instructions

### Step 9: Migration Script (45 min)
- [ ] Write script to import existing JSON configs
- [ ] Test migration
- [ ] Run on production

### Step 10: Integration with Intake Form (30 min)
- [ ] Update /api/intake to save to KV
- [ ] Add "pending" status
- [ ] Test end-to-end

**Total Estimated Time: ~9 hours**

---

## Open Questions

1. **Do you want to migrate existing clients immediately or keep JSON files for now?**
   - Recommendation: Migrate to KV for consistency

2. **Should non-admin users have any access?**
   - Recommendation: Start admin-only, add client portal later

3. **Do clients need to see their own dashboard?**
   - Recommendation: Phase 2 feature (client portal)

4. **Should we keep the intake form or integrate into dashboard?**
   - Recommendation: Keep both (intake for new leads, dashboard for admin)

5. **Analytics: What metrics matter most?**
   - Conversations per day
   - Leads generated
   - Response time
   - User satisfaction
   - (Start simple, add later)

---

## Alternative: Simpler Admin Panel (No Next.js)

If you want to avoid Next.js complexity, we could build:

### Lightweight Option:
- Single HTML page `/admin.html`
- Vanilla JS + Tailwind CSS
- API endpoints for CRUD
- Simple password auth (not OAuth)
- File-based storage (enhanced JSON)

**Pros:**
- Faster to build (2-3 hours)
- No framework complexity
- Consistent with current stack

**Cons:**
- Limited scalability
- Manual state management
- Harder to add complex features

---

## Recommendation

**Go with Next.js Dashboard + Vercel KV**

Why:
1. Professional, scalable solution
2. Easy to add features later
3. Vercel-optimized
4. Better developer experience
5. Only ~9 hours of work for full MVP
6. Industry-standard approach

Next.js won't interfere with existing files:
- Keep `/onboarding.html` as static file
- Keep `/chatbot.js` as static file
- Dashboard runs alongside at `/dashboard`

---

## Next Steps

Please review and answer:

1. ✅ Approve overall approach (Next.js + Vercel KV)?
2. ✅ Which features are must-have for Phase 1?
3. ✅ Do we migrate existing JSON configs to KV?
4. ✅ Who should have dashboard access (email domains)?
5. ✅ Ready to start implementation?

Once approved, I'll begin with Step 1: Next.js setup.
