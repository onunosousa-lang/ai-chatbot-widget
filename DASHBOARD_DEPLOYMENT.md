# Dashboard Deployment Guide

## Current Status

✅ **Completed:**
- Next.js 16 setup with TypeScript
- Tailwind CSS configuration
- Authentication system (simple password-based)
- Dashboard layout with sidebar navigation
- OpenAI SDK integration
- Upstash Redis (KV) integration
- Auth API endpoints (`/api/auth/login`, `/api/auth/logout`, `/api/auth/session`)
- Dashboard home page with stats
- Login page

## Environment Variables Needed

Add these to your Vercel project:

```bash
# Existing
OPENAI_API_KEY=sk-proj-...
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
ADMIN_EMAIL=...

# New for Dashboard
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here

# Upstash Redis (for KV storage)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

## Setup Upstash Redis

1. Go to https://console.upstash.com/
2. Sign up / Login
3. Click "Create Database"
4. Choose "Global" (or region closest to you)
5. Copy the REST URL and REST TOKEN
6. Add to Vercel environment variables

## Local Development

```bash
# Install dependencies (already done)
npm install

# Create .env.local file
cat > .env.local <<EOF
OPENAI_API_KEY=your-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
UPSTASH_REDIS_REST_URL=your-url
UPSTASH_REDIS_REST_TOKEN=your-token
EOF

# Run development server
npm run dev

# Open http://localhost:3000
# Login with admin / admin123
```

## What's Working Now

1. **Authentication:**
   - Login page at `/login`
   - Protected dashboard routes
   - Session-based auth with cookies
   - Logout functionality

2. **Dashboard Layout:**
   - Sidebar navigation
   - Home, Assistants, Clients pages
   - Responsive design

3. **Dashboard Home:**
   - Stats cards (assistants, clients, active)
   - Quick action buttons

## What Needs to Be Built (Next Steps)

### 1. Assistants Management

**Files to create:**
- `/app/dashboard/assistants/page.tsx` - List all OpenAI assistants
- `/app/dashboard/assistants/new/page.tsx` - Create new assistant
- `/app/dashboard/assistants/[id]/page.tsx` - Edit assistant
- `/app/api/assistants/route.ts` - GET, POST endpoints
- `/app/api/assistants/[id]/route.ts` - GET, PUT, DELETE endpoints

**Features:**
- List all assistants from OpenAI
- Create assistant (name, model, instructions, tools)
- Edit assistant
- Delete assistant
- Upload files to assistant
- Test chat with assistant

### 2. Clients Management

**Files to create:**
- `/app/dashboard/clients/page.tsx` - List all clients
- `/app/dashboard/clients/new/page.tsx` - Create new client
- `/app/dashboard/clients/[id]/page.tsx` - Edit client
- `/app/api/clients/route.ts` - GET, POST endpoints
- `/app/api/clients/[id]/route.ts` - GET, PUT, DELETE endpoints

**Features:**
- List all clients from KV
- Create client (company info, branding, link assistant)
- Edit client
- Delete client
- Generate embed code
- Preview widget

### 3. Embed Code Generator

**Component to create:**
- `/components/EmbedCodeGenerator.tsx`

**Features:**
- Generate HTML snippet for client
- Copy to clipboard
- Email to client
- Download as file

## Quick Implementation Guide

### Create Assistants List Page

```typescript
// app/dashboard/assistants/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AssistantsPage() {
  const [assistants, setAssistants] = useState([]);

  useEffect(() => {
    fetch('/api/assistants')
      .then(r => r.json())
      .then(data => setAssistants(data.assistants || []));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Assistants</h1>
        <Link href="/dashboard/assistants/new" className="bg-purple-600 text-white px-6 py-2 rounded-lg">
          Create New
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Model</th>
              <th className="px-6 py-3 text-left">Created</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assistants.map((asst: any) => (
              <tr key={asst.id} className="border-t">
                <td className="px-6 py-4">{asst.name}</td>
                <td className="px-6 py-4">{asst.model}</td>
                <td className="px-6 py-4">
                  {new Date(asst.created_at * 1000).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/dashboard/assistants/${asst.id}`} className="text-purple-600">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Create Assistants API Endpoint

```typescript
// app/api/assistants/route.ts
import { NextResponse } from 'next/server';
import { listAssistants, createAssistant } from '@/lib/openai';

export async function GET() {
  try {
    const assistants = await listAssistants();
    return NextResponse.json({ assistants });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const assistant = await createAssistant(data);
    return NextResponse.json({ assistant });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Create Clients API Endpoint

```typescript
// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import { getAllClients, saveClient } from '@/lib/kv';

export async function GET() {
  try {
    const clients = await getAllClients();
    return NextResponse.json({ clients });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await saveClient(data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

## Deploy to Vercel

```bash
# 1. Commit all changes
git add .
git commit -m "Add dashboard foundation"
git push origin claude/client-onboarding-form-Z83dh

# 2. Deploy to Vercel
vercel --prod

# 3. Set environment variables in Vercel Dashboard
# Go to Settings → Environment Variables
# Add all the variables listed above

# 4. Redeploy after adding env vars
vercel --prod
```

## Testing

1. Visit `https://your-domain.vercel.app/`
2. Should redirect to `/login`
3. Login with your ADMIN_USERNAME / ADMIN_PASSWORD
4. Should see dashboard with stats
5. Navigate to Assistants / Clients (will show empty until you build those pages)

## Security Notes

- Session cookies are httpOnly and secure in production
- Password is stored in environment variables (upgrade to hashed passwords for production)
- All dashboard routes check authentication
- CORS is configured for API routes

## Next Development Steps

1. Complete Assistants management pages
2. Complete Clients management pages
3. Add file upload functionality (Vercel Blob)
4. Add test chat interface
5. Add embed code generator
6. Add widget preview
7. Integrate with existing onboarding form

## Time Estimate

- Assistants pages: 3-4 hours
- Clients pages: 3-4 hours
- File upload: 1-2 hours
- Test chat: 1-2 hours
- Embed code generator: 1 hour
- Widget preview: 1-2 hours

**Total:** ~12-16 hours for full implementation

## Need Help?

The foundation is complete. You can now:
1. Test the dashboard locally
2. Deploy to Vercel
3. Build remaining pages following the patterns above
4. Or ask me to continue building specific features

All the core infrastructure (auth, OpenAI integration, KV storage, layout) is ready!
