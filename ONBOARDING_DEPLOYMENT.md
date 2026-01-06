# Client Onboarding System - Deployment Guide

## Overview

The client onboarding system allows new clients to submit their information through a web form and automatically generates standardized chatbot configuration files.

## Architecture

- **Frontend**: `onboarding.html` - Static HTML form with vanilla JavaScript
- **Backend**: `api/intake.js` - Vercel serverless function
- **Email**: Gmail SMTP via Nodemailer (FREE)

## Files Created

```
/onboarding.html              # Client-facing intake form
/api/intake.js                # Serverless function for processing submissions
/package.json                 # Updated with Nodemailer dependency
```

## Environment Variables Required

Add these to your Vercel project settings:

### Required Variables

```bash
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
ADMIN_EMAIL=your-admin@email.com
```

### How to Get These Values

1. **GMAIL_USER**
   - Your Gmail address (e.g., `your-business@gmail.com`)
   - This will be used as the sender email

2. **GMAIL_APP_PASSWORD**
   - Go to https://myaccount.google.com/security
   - Enable 2-Factor Authentication (required)
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "ChatMate Vercel" as the name
   - Copy the 16-character password (no spaces)
   - IMPORTANT: This is NOT your regular Gmail password

3. **ADMIN_EMAIL**
   - Email address where new client intake notifications will be sent
   - Can be the same as GMAIL_USER or different
   - Example: `admin@chatmate.nl`

## Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Gmail App Password

#### Generate App Password

1. Enable 2-Step Verification on your Google Account:
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification" and follow setup

2. Generate App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" for app type
   - Select "Other (Custom name)" for device
   - Enter "ChatMate Vercel"
   - Click Generate
   - Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
   - Remove spaces when adding to environment variables

#### Important Notes

- Do NOT use your regular Gmail password
- App passwords only work with 2FA enabled
- Keep the app password secure
- You can revoke/regenerate anytime from the same page
- Gmail allows 500 emails/day (plenty for onboarding forms)

### 3. Set Environment Variables in Vercel

```bash
# Via Vercel CLI
vercel env add GMAIL_USER
vercel env add GMAIL_APP_PASSWORD
vercel env add ADMIN_EMAIL

# Or via Vercel Dashboard
# Go to Project Settings > Environment Variables
# Add all three variables for Production, Preview, and Development
```

Example values:
```
GMAIL_USER=chatmate.business@gmail.com
GMAIL_APP_PASSWORD=abcdabcdabcdabcd
ADMIN_EMAIL=admin@chatmate.nl
```

### 4. Deploy to Vercel

```bash
# Deploy
vercel --prod

# Or push to main branch if auto-deployment is configured
git add .
git commit -m "Add client onboarding system"
git push origin main
```

## Usage

### Client Flow

1. Client visits: `https://your-domain.vercel.app/onboarding.html`
2. Fills out the intake form
3. Submits the form
4. System generates two JSON files:
   - **public_config.json** - Safe to share with client (no secrets)
   - **internal_config.json** - Admin only (contains routing placeholders)
5. Client sees success screen with:
   - Generated client_id
   - Download button for public configuration
6. Receives confirmation email

### Admin Flow

Admin receives email with:
- Company name and client_id
- Full public_config.json
- Full internal_config.json
- Next steps checklist

## Configuration Output

### Public Config Structure

```json
{
  "version": "1.0",
  "client_id": "company-name-slug",
  "company": {
    "name": "Company Name",
    "website": "https://example.com",
    "industry": "construction",
    "country": "NL",
    "service_area": ["Amsterdam", "Rotterdam"],
    "languages": ["nl", "en"],
    "website_default_language": "nl",
    "privacy_url": "https://example.com/privacy",
    "contact": {
      "lead_notification_email": "leads@example.com",
      "lead_notification_phone": "+31 6 12345678",
      "contact_hours": "Mon-Fri 9:00-17:00"
    }
  },
  "offer": {
    "one_liner": "Your service description",
    "customer_type": "b2c|b2b|both",
    "top_services": ["Service 1", "Service 2", "Service 3"],
    "typical_budget_range": "€5,000 - €50,000",
    "typical_timeline": "2-6 months",
    "key_differentiator": "What makes you unique",
    "not_offered": ["Service you don't provide"]
  },
  "behavior": {
    "language_mode": "mirror_user",
    "first_message_mode": "two_options",
    "ask_contact_when_intent": true,
    "lead_fields_required": ["name", "email_or_phone"],
    "allow_price_ranges": true,
    "indicative_pricing_text": "Pricing context",
    "calendly_enabled": false,
    "calendly_url": ""
  },
  "branding": {
    "bot_display_name": "ChatBot Name",
    "tone": "professional|friendly|neutral",
    "primary_color": "#667eea",
    "logo_url": "https://example.com/logo.png"
  }
}
```

### Internal Config Structure

```json
{
  "version": "1.0",
  "client_id": "company-name-slug",
  "routing": {
    "assistant_id": "",
    "lead_webhook_key": "",
    "idempotency_salt": ""
  },
  "admin": {
    "created_at": "2026-01-06T12:00:00.000Z",
    "source": "intake_form",
    "notes": ""
  }
}
```

## Security Features

### Built-in Protection

1. **Honeypot Field** - Hidden field to catch bots
2. **Rate Limiting** - 3 requests per minute per IP
3. **Server-side Validation** - All inputs validated
4. **CORS Configuration** - Controlled via vercel.json
5. **Secret Separation** - No secrets in public config

### Validation Rules

- Email format validation
- URL format validation
- Hex color validation
- Required field enforcement
- Conditional field validation (e.g., Calendly URL required when enabled)

## Customization

### Email Templates

Edit email templates in `/api/intake.js`:

```javascript
// Admin email template
await transporter.sendMail({
  from: `"ChatMate Onboarding" <${GMAIL_USER}>`,
  to: ADMIN_EMAIL,
  subject: `New Client Intake: ${companyName}`,
  html: `...` // Customize HTML here
});

// Client confirmation email template
await transporter.sendMail({
  from: `"ChatMate" <${GMAIL_USER}>`,
  to: clientEmail,
  subject: 'ChatMate Onboarding Received',
  html: `...` // Customize HTML here
});
```

### Form Fields

To add/modify form fields:

1. Update `onboarding.html` - Add HTML input
2. Update `api/intake.js` - Add validation
3. Update `generatePublicConfig()` or `generateInternalConfig()` functions

### Branding

Customize the form appearance in `onboarding.html`:

```css
/* Header gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Primary color */
.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## Testing

### Local Testing

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev

# Visit http://localhost:3000/onboarding.html
```

### Test Email Sending

1. Set up environment variables in `.env`:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-password
   ADMIN_EMAIL=your_test_email@example.com
   ```

2. Submit test form
3. Check both admin and client emails
4. Check Gmail "Sent" folder to verify emails were sent

## Troubleshooting

### Emails Not Sending

1. Verify 2-Factor Authentication is enabled on Gmail
2. Check GMAIL_APP_PASSWORD is correct (16 chars, no spaces)
3. Verify GMAIL_USER is correct
4. Check Gmail account hasn't hit daily limit (500 emails/day)
5. Look for "Less secure app" blocks (shouldn't happen with app passwords)
6. Check Vercel function logs for error details
7. Test with a simple email first to verify credentials

### Form Submission Fails

1. Check browser console for errors
2. Verify `/api/intake` endpoint is deployed
3. Check Vercel function logs
4. Ensure all required environment variables are set

### Rate Limiting Issues

If legitimate users hit rate limits, adjust in `api/intake.js`:

```javascript
const RATE_LIMIT_WINDOW = 60000; // Time window in ms
const RATE_LIMIT_MAX = 3; // Max requests per window
```

## Next Steps After Onboarding

When you receive a new client intake:

1. Review the generated configurations
2. Create OpenAI Assistant with company-specific instructions
3. Set up webhook in Make.com for lead notifications
4. Update `internal_config.json` with:
   - `assistant_id` from OpenAI
   - `lead_webhook_key` from Make.com
   - `idempotency_salt` (random string for security)
5. Send payment request to client
6. Provide installation instructions with the public config

## API Reference

### POST /api/intake

**Request Body:**

```json
{
  "company_name": "string (required)",
  "website_url": "string (required, valid URL)",
  "industry": "string (required)",
  "country": "string (required)",
  "service_area": "string (required)",
  "languages": ["string"] (required, array),
  "website_default_language": "string (required)",
  "one_liner_offer": "string (required)",
  "top_service_1": "string (required)",
  "top_service_2": "string (required)",
  "top_service_3": "string (required)",
  "customer_type": "b2c|b2b|both (required)",
  "typical_budget_range": "string (optional)",
  "typical_timeline": "string (optional)",
  "not_offered": "string (required)",
  "key_differentiator": "string (optional)",
  "lead_notification_email": "string (required, valid email)",
  "lead_notification_phone": "string (optional)",
  "contact_hours": "string (optional)",
  "privacy_policy_url": "string (required, valid URL)",
  "allow_price_ranges": "yes|no (required)",
  "indicative_pricing_text": "string (optional)",
  "calendly_enabled": "yes|no (required)",
  "calendly_url": "string (required if calendly_enabled=yes)",
  "bot_display_name": "string (optional)",
  "tone": "professional|friendly|neutral (required)",
  "primary_color_hex": "string (optional, hex format)",
  "logo_url": "string (optional, valid URL)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "client_id": "company-name-slug",
  "public_config": { ... },
  "message": "Configuration generated successfully"
}
```

**Error Response (400/429/500):**

```json
{
  "error": "Error message",
  "details": ["Validation error 1", "Validation error 2"]
}
```

## Monitoring

Monitor your onboarding system:

1. **Vercel Logs**: View function execution logs
2. **Resend Dashboard**: Track email delivery
3. **Analytics**: Add tracking to onboarding.html if needed

## Support

For issues or questions:
- Check Vercel function logs
- Review Resend email logs
- Verify environment variables
- Test locally with `vercel dev`
