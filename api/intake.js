const nodemailer = require('nodemailer');

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@chatmate.nl';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD
  }
});

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 3; // 3 requests per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

function generateClientId(companyName) {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

function parseMultilineToArray(text) {
  if (!text) return [];
  return text
    .split(/[\n,]+/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateHexColor(color) {
  if (!color) return true; // optional field
  const re = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return re.test(color);
}

function validateInput(data) {
  const errors = [];

  // Required fields
  if (!data.company_name || data.company_name.trim().length === 0) {
    errors.push('Company name is required');
  }

  if (!data.website_url || !validateUrl(data.website_url)) {
    errors.push('Valid website URL is required');
  }

  if (!data.industry) {
    errors.push('Industry is required');
  }

  if (!data.country) {
    errors.push('Country is required');
  }

  if (!data.service_area) {
    errors.push('Service area is required');
  }

  if (!data.languages || data.languages.length === 0) {
    errors.push('At least one language must be selected');
  }

  if (!data.website_default_language) {
    errors.push('Website default language is required');
  }

  if (!data.one_liner_offer) {
    errors.push('One-liner offer is required');
  }

  if (!data.top_service_1 || !data.top_service_2 || !data.top_service_3) {
    errors.push('All three top services are required');
  }

  if (!data.customer_type || !['b2c', 'b2b', 'both'].includes(data.customer_type)) {
    errors.push('Valid customer type is required');
  }

  if (!data.not_offered) {
    errors.push('Not offered services are required');
  }

  if (!data.lead_notification_email || !validateEmail(data.lead_notification_email)) {
    errors.push('Valid lead notification email is required');
  }

  if (!data.privacy_policy_url || !validateUrl(data.privacy_policy_url)) {
    errors.push('Valid privacy policy URL is required');
  }

  if (!data.allow_price_ranges || !['yes', 'no'].includes(data.allow_price_ranges)) {
    errors.push('Allow price ranges must be yes or no');
  }

  if (!data.calendly_enabled || !['yes', 'no'].includes(data.calendly_enabled)) {
    errors.push('Calendly enabled must be yes or no');
  }

  if (data.calendly_enabled === 'yes' && (!data.calendly_url || !validateUrl(data.calendly_url))) {
    errors.push('Valid Calendly URL is required when Calendly is enabled');
  }

  if (!data.tone || !['professional', 'friendly', 'neutral'].includes(data.tone)) {
    errors.push('Valid tone is required');
  }

  if (data.primary_color_hex && !validateHexColor(data.primary_color_hex)) {
    errors.push('Invalid hex color format');
  }

  if (data.logo_url && !validateUrl(data.logo_url)) {
    errors.push('Invalid logo URL');
  }

  return errors;
}

function generatePublicConfig(data, clientId) {
  const serviceArea = parseMultilineToArray(data.service_area);
  const notOffered = parseMultilineToArray(data.not_offered);
  const languages = data.languages.map(lang => lang.toLowerCase());

  return {
    version: "1.0",
    client_id: clientId,
    company: {
      name: data.company_name.trim(),
      website: data.website_url.trim(),
      industry: data.industry,
      country: data.country,
      service_area: serviceArea,
      languages: languages,
      website_default_language: data.website_default_language.toLowerCase(),
      privacy_url: data.privacy_policy_url.trim(),
      contact: {
        lead_notification_email: data.lead_notification_email.trim(),
        lead_notification_phone: data.lead_notification_phone?.trim() || "",
        contact_hours: data.contact_hours?.trim() || ""
      }
    },
    offer: {
      one_liner: data.one_liner_offer.trim(),
      customer_type: data.customer_type,
      top_services: [
        data.top_service_1.trim(),
        data.top_service_2.trim(),
        data.top_service_3.trim()
      ],
      typical_budget_range: data.typical_budget_range?.trim() || "",
      typical_timeline: data.typical_timeline?.trim() || "",
      key_differentiator: data.key_differentiator?.trim() || "",
      not_offered: notOffered
    },
    behavior: {
      language_mode: "mirror_user",
      first_message_mode: "two_options",
      ask_contact_when_intent: true,
      lead_fields_required: ["name", "email_or_phone"],
      allow_price_ranges: data.allow_price_ranges === 'yes',
      indicative_pricing_text: data.indicative_pricing_text?.trim() || "",
      calendly_enabled: data.calendly_enabled === 'yes',
      calendly_url: data.calendly_url?.trim() || ""
    },
    branding: {
      bot_display_name: data.bot_display_name?.trim() || data.company_name.trim(),
      tone: data.tone,
      primary_color: data.primary_color_hex?.trim() || "#667eea",
      logo_url: data.logo_url?.trim() || ""
    }
  };
}

function generateInternalConfig(clientId) {
  return {
    version: "1.0",
    client_id: clientId,
    routing: {
      assistant_id: "",
      lead_webhook_key: "",
      idempotency_salt: ""
    },
    admin: {
      created_at: new Date().toISOString(),
      source: "intake_form",
      notes: ""
    }
  };
}

async function sendAdminEmail(clientId, publicConfig, internalConfig, companyName) {
  try {
    await transporter.sendMail({
      from: `"ChatMate Onboarding" <${GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Client Intake: ${companyName}`,
      html: `
        <h2>New Client Onboarding Request</h2>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Client ID:</strong> ${clientId}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>

        <hr>

        <h3>Public Configuration</h3>
        <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(publicConfig, null, 2)}</pre>

        <hr>

        <h3>Internal Configuration</h3>
        <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(internalConfig, null, 2)}</pre>

        <hr>

        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Review the configuration</li>
          <li>Create OpenAI Assistant</li>
          <li>Configure webhook in Make.com</li>
          <li>Send payment request and installation instructions to client</li>
        </ol>
      `
    });
  } catch (error) {
    console.error('Failed to send admin email:', error);
    throw new Error('Failed to send admin notification');
  }
}

async function sendClientEmail(clientEmail, companyName) {
  try {
    await transporter.sendMail({
      from: `"ChatMate" <${GMAIL_USER}>`,
      to: clientEmail,
      subject: 'ChatMate Onboarding Received',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Thank You, ${companyName}!</h2>

          <p>We've successfully received your onboarding information.</p>

          <p>Our team is now reviewing your details and will contact you within 24 hours with:</p>
          <ul>
            <li>Payment details and pricing confirmation</li>
            <li>Installation instructions for your website</li>
            <li>Access to your chatbot dashboard</li>
            <li>Training materials and best practices</li>
          </ul>

          <p>If you have any questions in the meantime, feel free to reply to this email.</p>

          <p style="margin-top: 30px;">Best regards,<br>
          <strong>ChatMate Team</strong></p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

          <p style="font-size: 12px; color: #777;">
            This is an automated confirmation email. You're receiving this because you submitted an onboarding form at ChatMate.
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send client email:', error);
    // Don't throw - client email is less critical than admin email
  }
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    const data = req.body;

    // Honeypot check
    if (data.website) {
      return res.status(400).json({ error: 'Invalid submission' });
    }

    // Validate input
    const validationErrors = validateInput(data);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Generate client ID
    const clientId = generateClientId(data.company_name);

    // Generate configurations
    const publicConfig = generatePublicConfig(data, clientId);
    const internalConfig = generateInternalConfig(clientId);

    // Send emails
    await sendAdminEmail(
      clientId,
      publicConfig,
      internalConfig,
      data.company_name
    );

    await sendClientEmail(
      data.lead_notification_email,
      data.company_name
    );

    // Return success
    return res.status(200).json({
      success: true,
      client_id: clientId,
      public_config: publicConfig,
      message: 'Configuration generated successfully'
    });

  } catch (error) {
    console.error('Intake error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
