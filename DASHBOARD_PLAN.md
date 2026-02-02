# Dashboard Plan: Complete Client & AI Assistant Management System

## Overview
Build an admin dashboard at `/dashboard` for:
- Managing client chatbot configurations & deployments
- **Creating and managing OpenAI Assistants**
- **Uploading training documents and knowledge bases**
- **Testing and monitoring AI assistants**
- Full CRUD operations on bots and clients

---

## Updated Vision: Full Bot Management Platform

### What You Can Do:

**Bot/Assistant Management:**
- 📋 View all OpenAI Assistants in a list
- ➕ Create new assistants from dashboard
- ✏️ Edit assistant instructions, model, tools
- 📁 Upload files (PDFs, docs, knowledge base)
- 🔗 Link assistants to client configs
- 🧪 Test assistants with live chat
- 🗑️ Delete/archive assistants
- 📊 View assistant usage stats

**Client Management:**
- 👥 View all clients
- ⚙️ Edit UI settings (colors, branding, messages)
- 🎨 Configure widget behavior
- 🔗 Assign assistant to client
- 📋 Generate embed code
- 🚀 Deploy changes

**Unified Workflow:**
1. Create OpenAI Assistant → Upload docs → Configure instructions
2. Create Client → Configure UI/branding → Link to assistant
3. Test bot → Deploy → Send embed code to client

---

## Dashboard Features - Updated

### 1. **Assistants Page** (`/dashboard/assistants`)

**List View:**
```
┌─────────────────────────────────────────────────────────────┐
│  Assistants                                    [+ New]        │
├─────────────────────────────────────────────────────────────┤
│ Name              Model        Files  Clients  Status  Actions│
│ Groenvast Bot     gpt-4o         3      1     Active   [...] │
│ Demo Bot          gpt-4o-mini    1      1     Active   [...] │
│ Test Assistant    gpt-4o         0      0     Draft    [...] │
└─────────────────────────────────────────────────────────────┘
```

**Actions:**
- View details
- Edit
- Test chat
- Delete
- Clone

### 2. **Create/Edit Assistant** (`/dashboard/assistants/new` or `/dashboard/assistants/:id`)

**Tabs:**

**Tab 1: Basic Info**
- Name
- Description
- Model selection (gpt-4o, gpt-4o-mini, etc.)
- Temperature slider
- Response format

**Tab 2: Instructions**
- Large textarea for system instructions
- Template library (construction, legal, consulting, etc.)
- Variables: {company_name}, {services}, {tone}
- Preview with syntax highlighting

**Tab 3: Tools & Capabilities**
- ☑️ Code Interpreter
- ☑️ File Search (vector store)
- ☑️ Function Calling
- Configure functions (JSON schema editor)

**Tab 4: Knowledge Base**
- File upload area (drag & drop)
- List of uploaded files with preview
- Delete files
- Supported: PDF, DOC, TXT, MD, CSV
- Vector store status

**Tab 5: Test**
- Live chat interface
- Send test messages
- View responses
- Check tool usage
- Debug mode (show raw API calls)

**Actions:**
- Save Draft
- Save & Deploy
- Cancel

### 3. **Clients Page** (`/dashboard/clients`)

**List View:**
```
┌─────────────────────────────────────────────────────────────┐
│  Clients                                       [+ New]        │
├─────────────────────────────────────────────────────────────┤
│ Company          Assistant       Status    Created    Actions│
│ Groenvast Bouw   Groenvast Bot  Active    Jan 5      [...] │
│ Demo Client      Demo Bot        Active    Jan 3      [...] │
│ Pending Co.      (none)          Pending   Jan 6      [...] │
└─────────────────────────────────────────────────────────────┘
```

### 4. **Client Detail/Edit** (`/dashboard/clients/:id`)

**Tabs:**

**Tab 1: Company Info**
- Name, website, industry
- Service areas, languages
- Contact info

**Tab 2: Services & Offer**
- One-liner offer
- Top services (3)
- Budget range, timeline
- What you don't offer
- Key differentiators

**Tab 3: Assistant**
- Select from existing assistants dropdown
- Or: Create new assistant (inline)
- Override instructions (client-specific)
- Test conversation

**Tab 4: Widget UI**
- Branding: colors, logo, bot name
- Position, size
- Welcome message
- Conversation starters
- Language settings

**Tab 5: Behavior**
- Allow price ranges
- Calendly integration
- Lead fields required
- Business hours
- Proactive triggers

**Tab 6: Integrations**
- Lead webhook URL (Make.com)
- Email/WhatsApp buttons
- Analytics settings

**Tab 7: Preview & Deploy**
- Live preview of widget
- Generate embed code
- Copy to clipboard
- Deployment status
- Send to client

### 5. **Dashboard Home** (`/dashboard`)

**Overview Cards:**
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Clients: 12 │  │ Assistants:8│  │ Active: 10  │
└─────────────┘  └─────────────┘  └─────────────┘
```

**Recent Activity:**
- New client: "Acme Corp" (2 hours ago)
- Assistant updated: "Legal Bot" (5 hours ago)
- File uploaded to "Construction Bot" (1 day ago)

**Quick Actions:**
- Create new client
- Create new assistant
- View pending clients

---

## Technical Architecture - Updated

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- Shadcn UI components
- React Hook Form (forms)
- TanStack Query (data fetching)

**Backend:**
- Vercel serverless functions
- OpenAI SDK (Assistants API v2)
- Vercel KV (metadata storage)
- Vercel Blob (file storage for uploads)

**APIs:**
- OpenAI Assistants API
- OpenAI Files API
- OpenAI Vector Stores API

### Data Models

#### Assistant Record (Vercel KV)

```typescript
interface Assistant {
  // OpenAI
  openai_id: string;              // asst_xxxxx from OpenAI

  // Metadata
  id: string;                     // Our internal ID
  name: string;
  description: string;
  model: "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo";

  // Configuration
  instructions: string;           // System prompt
  temperature: number;
  top_p: number;
  response_format: "auto" | "json_object" | "text";

  // Tools
  tools: Array<{
    type: "code_interpreter" | "file_search" | "function";
    function?: {
      name: string;
      description: string;
      parameters: object;
    };
  }>;

  // Knowledge Base
  vector_store_id?: string;       // OpenAI vector store ID
  file_ids: string[];             // OpenAI file IDs
  files: Array<{
    id: string;
    name: string;
    size: number;
    uploaded_at: string;
    status: "uploaded" | "processing" | "ready" | "error";
  }>;

  // Metadata
  status: "draft" | "active" | "archived";
  created_at: string;
  updated_at: string;
  created_by: string;
  linked_clients: string[];       // Array of client_ids

  // Stats (optional)
  stats?: {
    total_conversations: number;
    total_messages: number;
    avg_response_time: number;
  };
}
```

#### Client Record (Updated)

```typescript
interface Client {
  // Identity
  client_id: string;

  // Company info (same as before)
  company: { /* ... */ };
  offer: { /* ... */ };
  behavior: { /* ... */ };
  branding: { /* ... */ };

  // Assistant Link (NEW)
  assistant: {
    assistant_id: string;         // Links to Assistant.id
    openai_assistant_id: string;  // Direct OpenAI ID for API calls
    override_instructions?: string; // Client-specific instructions
  };

  // Routing
  routing: {
    api_url: string;
    lead_webhook_url: string;
  };

  // Metadata
  metadata: {
    status: "pending" | "active" | "paused" | "archived";
    created_at: string;
    updated_at: string;
    created_by: string;
    source: "intake_form" | "manual" | "import";
    notes: string;
  };
}
```

### KV Keys Pattern

```
assistants:list                    → Array of assistant IDs
assistant:{id}                     → Full assistant object
assistant:{id}:clients             → Array of linked client IDs

clients:list                       → Array of client IDs
client:{client_id}                 → Full client object
client:{client_id}:assistant       → Quick assistant lookup

user:{email}:sessions              → User sessions
```

---

## API Endpoints - Updated

### Assistant Management

```typescript
// List all assistants
GET /api/assistants
Response: { assistants: Assistant[] }

// Create new assistant
POST /api/assistants
Body: { name, model, instructions, tools, ... }
Response: { assistant: Assistant }

// Get one assistant
GET /api/assistants/:id
Response: { assistant: Assistant }

// Update assistant
PUT /api/assistants/:id
Body: { instructions?, model?, tools?, ... }
Response: { assistant: Assistant }

// Delete assistant
DELETE /api/assistants/:id
Response: { success: true }

// Upload file to assistant
POST /api/assistants/:id/files
Body: FormData with file
Response: { file: File }

// Delete file from assistant
DELETE /api/assistants/:id/files/:fileId
Response: { success: true }

// Test assistant (chat)
POST /api/assistants/:id/test
Body: { message: string, thread_id?: string }
Response: { response: string, thread_id: string }
```

### Client Management (Updated)

```typescript
// Link assistant to client
POST /api/clients/:id/assistant
Body: { assistant_id: string, override_instructions?: string }
Response: { client: Client }

// Test client's chatbot
POST /api/clients/:id/test
Body: { message: string }
Response: { response: string }
```

---

## OpenAI Integration Details

### Assistants API v2 Workflow

**Create Assistant:**
```javascript
const assistant = await openai.beta.assistants.create({
  name: "Groenvast Bot",
  instructions: "You are an AI assistant for...",
  model: "gpt-4o",
  tools: [
    { type: "file_search" },
    { type: "code_interpreter" }
  ]
});
```

**Upload Files:**
```javascript
// 1. Upload file to OpenAI
const file = await openai.files.create({
  file: fs.createReadStream("company-info.pdf"),
  purpose: "assistants"
});

// 2. Create vector store
const vectorStore = await openai.beta.vectorStores.create({
  name: "Groenvast Knowledge Base",
  file_ids: [file.id]
});

// 3. Attach to assistant
await openai.beta.assistants.update(assistant.id, {
  tool_resources: {
    file_search: {
      vector_store_ids: [vectorStore.id]
    }
  }
});
```

**Test Chat:**
```javascript
// 1. Create thread
const thread = await openai.beta.threads.create();

// 2. Add message
await openai.beta.threads.messages.create(thread.id, {
  role: "user",
  content: "What are your services?"
});

// 3. Run assistant
const run = await openai.beta.threads.runs.create(thread.id, {
  assistant_id: assistant.id
});

// 4. Wait for completion
// 5. Get response
const messages = await openai.beta.threads.messages.list(thread.id);
```

---

## File Upload Architecture

### Storage Strategy

**Option 1: Direct to OpenAI (Simpler)**
- User uploads file → Send directly to OpenAI Files API
- Store OpenAI file_id in KV
- ✅ Simple, no storage needed
- ❌ Can't preview files later
- ❌ Harder to manage

**Option 2: Vercel Blob + OpenAI (Recommended)**
- User uploads file → Store in Vercel Blob
- Also send to OpenAI Files API
- Store both blob URL and OpenAI file_id
- ✅ Can preview/download files
- ✅ Backup if needed
- ✅ Better UX
- ❌ Slight duplication

**RECOMMENDATION: Option 2**

### File Upload Flow

```
User selects file
    ↓
Upload to Vercel Blob (/api/upload)
    ↓
Get blob URL
    ↓
Send file to OpenAI Files API
    ↓
Get OpenAI file_id
    ↓
Store both in KV:
  - blob_url (for preview)
  - openai_file_id (for assistant)
    ↓
Add to vector store
    ↓
Attach to assistant
```

---

## UI Components Needed

### Reusable Components

1. **AssistantCard** - Card showing assistant info
2. **ClientCard** - Card showing client info
3. **FileUploader** - Drag & drop file upload
4. **ChatInterface** - Test chat UI
5. **CodeBlock** - Syntax highlighting for embed code
6. **FormBuilder** - Dynamic form generator
7. **ColorPicker** - Custom color picker
8. **ModelSelector** - Dropdown for GPT models
9. **StatusBadge** - Status indicator
10. **ConfirmDialog** - Delete confirmations

### Page Layouts

1. **DashboardLayout** - Sidebar + top nav
2. **TableLayout** - Data tables with search/filter
3. **FormLayout** - Multi-step forms
4. **PreviewLayout** - Split view (config + preview)

---

## Implementation Steps - Updated

### Phase 1: Foundation (4-5 hours)

**Step 1: Next.js Setup** (45 min)
- [ ] Install Next.js 14 with TypeScript
- [ ] Set up folder structure
- [ ] Install dependencies:
  - `openai`
  - `@vercel/kv`
  - `@vercel/blob`
  - `next-auth`
  - `tailwindcss`
  - `shadcn-ui`

**Step 2: Authentication** (45 min)
- [ ] Set up NextAuth with Google OAuth
- [ ] Create middleware to protect routes
- [ ] Add login page

**Step 3: Vercel KV + Blob** (30 min)
- [ ] Create KV database
- [ ] Create Blob storage
- [ ] Test connections

**Step 4: OpenAI SDK Setup** (30 min)
- [ ] Initialize OpenAI client
- [ ] Test Assistants API connection
- [ ] Create helper functions

**Step 5: Dashboard Layout** (90 min)
- [ ] Create sidebar navigation
- [ ] Create dashboard home page
- [ ] Add responsive layout

### Phase 2: Assistant Management (5-6 hours)

**Step 6: Assistants List** (90 min)
- [ ] Fetch assistants from OpenAI
- [ ] Store in KV for caching
- [ ] Build list UI with table
- [ ] Add search/filter

**Step 7: Create Assistant** (120 min)
- [ ] Build multi-tab form
- [ ] Instructions editor with templates
- [ ] Model selector
- [ ] Tools configuration
- [ ] Create via OpenAI API
- [ ] Store in KV

**Step 8: Edit Assistant** (90 min)
- [ ] Load existing assistant
- [ ] Update form
- [ ] Save changes to OpenAI + KV
- [ ] Handle errors

**Step 9: File Upload** (120 min)
- [ ] Build file uploader component
- [ ] Upload to Vercel Blob
- [ ] Send to OpenAI Files API
- [ ] Create/update vector store
- [ ] Display file list
- [ ] Delete files

**Step 10: Test Chat** (90 min)
- [ ] Build chat interface
- [ ] Create thread
- [ ] Send messages
- [ ] Display responses
- [ ] Show loading states

### Phase 3: Client Management (4-5 hours)

**Step 11: Clients List** (60 min)
- [ ] Fetch clients from KV
- [ ] Build table UI
- [ ] Link to assistants
- [ ] Status indicators

**Step 12: Create/Edit Client** (180 min)
- [ ] Build multi-tab form (7 tabs)
- [ ] All form fields from onboarding
- [ ] Assistant selector dropdown
- [ ] Save to KV

**Step 13: Link Assistant to Client** (45 min)
- [ ] Dropdown to select assistant
- [ ] Update client record
- [ ] Option to override instructions

**Step 14: Widget Preview** (90 min)
- [ ] Embed chatbot.js in iframe
- [ ] Pass config dynamically
- [ ] Live updates as form changes
- [ ] Toggle preview on/off

### Phase 4: Deployment & Code Gen (2-3 hours)

**Step 15: Embed Code Generator** (60 min)
- [ ] Generate HTML snippet
- [ ] Include CDN links
- [ ] Config injection
- [ ] Copy to clipboard button

**Step 16: Config Export** (45 min)
- [ ] Generate JSON config file
- [ ] Download button
- [ ] Email to client

**Step 17: Migration Script** (60 min)
- [ ] Read existing JSON configs
- [ ] Transform to new schema
- [ ] Import to KV
- [ ] Test migration

### Phase 5: Polish & Testing (2-3 hours)

**Step 18: Error Handling** (45 min)
- [ ] Toast notifications
- [ ] Form validation
- [ ] API error handling
- [ ] Loading states

**Step 19: Testing** (90 min)
- [ ] Test full workflow
- [ ] Test file uploads
- [ ] Test assistant creation
- [ ] Test client linking

**Step 20: Documentation** (45 min)
- [ ] Update README
- [ ] Add environment variables guide
- [ ] Create user guide

---

**Total Estimated Time: 18-22 hours**

---

## Environment Variables - Complete List

```bash
# Existing
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=...
ADMIN_EMAIL=...

# OpenAI
OPENAI_API_KEY=sk-proj-...              # Your OpenAI API key
OPENAI_ORGANIZATION=org-...             # Optional

# NextAuth
NEXTAUTH_SECRET=random-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Vercel Storage (auto-generated by Vercel)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
BLOB_READ_WRITE_TOKEN=...

# Admin Access
ALLOWED_ADMIN_EMAILS=admin@chatmate.nl,user@chatmate.nl
```

---

## File Structure

```
/app
  /dashboard
    /page.tsx                        # Dashboard home
    /layout.tsx                      # Dashboard layout

    /assistants
      /page.tsx                      # Assistants list
      /new
        /page.tsx                    # Create assistant
      /[id]
        /page.tsx                    # Edit assistant
        /test
          /page.tsx                  # Test chat

    /clients
      /page.tsx                      # Clients list
      /new
        /page.tsx                    # Create client
      /[id]
        /page.tsx                    # Edit client
        /preview
          /page.tsx                  # Preview widget

    /components
      /AssistantForm.tsx
      /AssistantList.tsx
      /ClientForm.tsx
      /ClientList.tsx
      /ChatInterface.tsx
      /FileUploader.tsx
      /CodeGenerator.tsx
      /WidgetPreview.tsx
      /Sidebar.tsx
      /Navbar.tsx

  /api
    /assistants
      /route.ts                      # GET, POST
      /[id]
        /route.ts                    # GET, PUT, DELETE
        /files
          /route.ts                  # POST (upload)
          /[fileId]
            /route.ts                # DELETE
        /test
          /route.ts                  # POST (test chat)

    /clients
      /route.ts                      # GET, POST
      /[id]
        /route.ts                    # GET, PUT, DELETE
        /assistant
          /route.ts                  # POST (link assistant)
        /test
          /route.ts                  # POST (test)
        /deploy
          /route.ts                  # POST (deploy config)

    /upload
      /route.ts                      # File upload handler

    /auth
      /[...nextauth]
        /route.ts                    # NextAuth config

  /login
    /page.tsx                        # Login page

/lib
  /openai.ts                         # OpenAI client
  /kv.ts                             # KV helpers
  /blob.ts                           # Blob helpers
  /utils.ts                          # Utilities

/components
  /ui                                # Shadcn components
```

---

## User Workflows

### Workflow 1: Create New Bot from Scratch

1. Login to dashboard
2. Go to Assistants → Click "New Assistant"
3. Fill basic info (name, model, description)
4. Write instructions or use template
5. Enable tools (file search, code interpreter)
6. Upload knowledge base files (PDFs, docs)
7. Wait for processing
8. Test bot in chat interface
9. Save assistant
10. Create client → Link this assistant
11. Configure UI/branding
12. Preview widget
13. Generate embed code
14. Send to client

### Workflow 2: Edit Existing Bot

1. Go to Assistants → Select bot
2. Edit instructions
3. Upload additional files
4. Delete old files
5. Test changes
6. Save
7. Changes auto-apply to all linked clients

### Workflow 3: Onboard New Client (from intake form)

1. Receive intake form submission (email)
2. Go to Dashboard → Clients → "Pending"
3. Click on pending client
4. Review submitted info
5. Edit if needed
6. Create new assistant OR select existing
7. Upload client-specific documents
8. Configure UI/branding
9. Test chatbot
10. Activate client
11. Generate embed code
12. Email client with instructions

---

## Advanced Features (Phase 2+)

### Analytics Dashboard
- Conversations per client
- Most asked questions
- Response times
- User satisfaction scores
- Peak usage times

### Template Library
- Pre-built assistant templates:
  - Construction company
  - Legal services
  - Consulting
  - Real estate
  - Healthcare
- One-click apply template

### Batch Operations
- Bulk update instructions across assistants
- Clone assistant to new client
- Export/import configurations

### Version Control
- Track changes to instructions
- Rollback to previous versions
- A/B test different instructions

### Client Portal (Phase 3)
- Clients can login
- View their analytics
- Edit some settings (messages, hours)
- Download reports

---

## Cost Considerations

### Vercel
- KV Free Tier: 256 MB, 100k requests/month
- Blob Free Tier: 500 MB storage
- Function execution: Free tier generous

### OpenAI
- Assistants API: Pay per token
- File Storage: $0.10/GB/day
- GPT-4o: $2.50/1M input tokens
- GPT-4o-mini: $0.15/1M input tokens

**Recommendation:**
- Use gpt-4o-mini for most clients
- Reserve gpt-4o for premium clients
- Monitor file storage costs
- Set usage limits per client

---

## Security Considerations

1. **API Key Protection**
   - Never expose OpenAI API key to client
   - All API calls go through your backend
   - Rate limiting per client

2. **File Upload Security**
   - Validate file types (PDF, DOC, TXT only)
   - Scan for malware
   - Size limits (10MB per file)
   - Total storage limits per client

3. **Access Control**
   - Admin-only dashboard access
   - Client-specific data isolation
   - Audit logs for sensitive operations

4. **Data Privacy**
   - Client data encrypted in KV
   - Files stored securely in Blob
   - GDPR compliance (data deletion)

---

## Next Steps - Decisions Needed

Please confirm:

1. ✅ **Approve full assistant management approach?**
   - Create/edit/delete assistants from dashboard
   - Upload files and manage knowledge base
   - Test assistants with live chat

2. ✅ **Storage: Vercel KV + Blob?**
   - KV for metadata
   - Blob for file backup/preview
   - OpenAI for actual AI processing

3. ✅ **Framework: Next.js + OpenAI SDK?**
   - Full TypeScript
   - Shadcn UI components
   - ~18-22 hours implementation

4. ✅ **Which Phase 1 features are must-have?**
   - Can we skip any to reduce time?
   - Or add anything critical?

5. ✅ **Ready to start implementation?**
   - I'll begin with Next.js setup
   - Set up OpenAI integration
   - Build assistant management first

Let me know your thoughts and we can start building!
