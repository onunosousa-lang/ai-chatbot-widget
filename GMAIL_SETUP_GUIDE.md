# Gmail Setup Guide for Onboarding System

## Step 1: Enable 2-Factor Authentication

1. Go to https://myaccount.google.com/security
2. Scroll down to "How you sign in to Google"
3. Click on "2-Step Verification"
4. Follow the prompts to set it up (usually takes 2-3 minutes)
   - You'll need your phone for verification
   - Choose SMS or Google Authenticator app

## Step 2: Generate App Password

Once 2FA is enabled:

1. Go to https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords (at bottom)

2. You might need to sign in again

3. Under "Select app" → Choose **Mail**

4. Under "Select device" → Choose **Other (Custom name)**

5. Type: **ChatMate Vercel**

6. Click **Generate**

7. Google will show you a 16-character password like:
   ```
   xxxx xxxx xxxx xxxx
   ```

8. **COPY THIS PASSWORD** - Remove the spaces, so it becomes:
   ```
   xxxxxxxxxxxxxxxx
   ```

9. Click **Done**

## Step 3: Save Your Credentials

You'll need these three values:

```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx (16 chars, no spaces)
ADMIN_EMAIL=admin@chatmate.nl (where you want to receive notifications)
```

**Example:**
```
GMAIL_USER=chatmate.business@gmail.com
GMAIL_APP_PASSWORD=abcdabcdabcdabcd
ADMIN_EMAIL=onuno@chatmate.nl
```

## Step 4: Add to Vercel (Choose Method A OR B)

### Method A: Via Vercel Dashboard (Easier)

1. Go to https://vercel.com/dashboard

2. Click on your project: **ai-chatbot-widget**

3. Click **Settings** (top menu)

4. Click **Environment Variables** (left sidebar)

5. Add each variable:
   - Click **Add New**
   - Key: `GMAIL_USER`
   - Value: `your-email@gmail.com`
   - Select: **Production, Preview, Development**
   - Click **Save**

6. Repeat for:
   - Key: `GMAIL_APP_PASSWORD` → Value: your 16-char password
   - Key: `ADMIN_EMAIL` → Value: where you want notifications

7. **IMPORTANT**: After adding variables, redeploy your project:
   - Go to **Deployments** tab
   - Click the ⋯ menu on latest deployment
   - Click **Redeploy**

### Method B: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project (run in project directory)
vercel link

# Add environment variables
vercel env add GMAIL_USER
# Paste: your-email@gmail.com
# Select: Production, Preview, Development

vercel env add GMAIL_APP_PASSWORD
# Paste: your 16-char password (no spaces)
# Select: Production, Preview, Development

vercel env add ADMIN_EMAIL
# Paste: admin@chatmate.nl
# Select: Production, Preview, Development

# Deploy
vercel --prod
```

## Step 5: Test It

1. Visit your onboarding page:
   ```
   https://your-project.vercel.app/onboarding.html
   ```

2. Fill out the form with test data

3. Submit

4. Check your ADMIN_EMAIL inbox for the notification email

5. Check Gmail "Sent" folder to verify emails were sent

## Troubleshooting

### "Invalid login" or authentication errors

- Make sure 2FA is enabled on your Google Account
- Regenerate the App Password and try again
- Ensure you removed all spaces from the password
- Use the GMAIL_USER exactly as shown in Gmail (case doesn't matter)

### "App Passwords" option not showing

- Make sure 2-Step Verification is fully enabled
- Wait 5-10 minutes after enabling 2FA
- Try accessing directly: https://myaccount.google.com/apppasswords

### Emails not arriving

- Check spam folder
- Verify ADMIN_EMAIL is correct
- Check Vercel function logs for errors:
  - Dashboard → Your Project → Deployments → Click latest → View Function Logs

### Daily limit reached

- Gmail free accounts: 500 emails/day
- This is more than enough for onboarding forms
- If you need more, use Google Workspace

## Security Notes

- Never share your App Password
- The App Password is different from your Gmail password
- You can revoke it anytime from https://myaccount.google.com/apppasswords
- If compromised, just revoke and generate a new one
- Vercel keeps environment variables encrypted

## Need Help?

Check the main deployment guide: `ONBOARDING_DEPLOYMENT.md`
