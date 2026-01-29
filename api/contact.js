const nodemailer = require('nodemailer');

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD
  }
});

// Simple in-memory rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

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

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  // Basic phone validation - at least 8 digits
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8;
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
    const { name, email, phone, message, clientId, clientEmail, companyName } = req.body;

    // Validation
    const errors = [];
    if (!name || name.trim().length === 0) {
      errors.push('Name is required');
    }
    if (!email || !validateEmail(email)) {
      errors.push('Valid email is required');
    }
    if (phone && !validatePhone(phone)) {
      errors.push('Valid phone number is required');
    }
    if (!clientEmail || !validateEmail(clientEmail)) {
      errors.push('Client email configuration is missing');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // Honeypot check
    if (req.body.website) {
      return res.status(400).json({ error: 'Invalid submission' });
    }

    // Send email to client
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2ee8c2;">Nieuw Contact Verzoek van Chatbot</h2>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Naam:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Telefoon:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
          ${message ? `<p><strong>Bericht:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
        </div>

        <p style="color: #666; font-size: 14px;">
          Dit bericht is verzonden via de chatbot op ${new Date().toLocaleString('nl-NL')}.
        </p>

        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">

        <p style="font-size: 12px; color: #999;">
          Client ID: ${clientId || 'default'}<br>
          IP Address: ${ip}
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${companyName || 'Chatbot'}" <${GMAIL_USER}>`,
      to: clientEmail,
      replyTo: email,
      subject: `Nieuw contact verzoek van ${name}`,
      html: emailContent
    });

    // Send confirmation to user
    try {
      const confirmationEmail = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2ee8c2;">Bedankt voor je bericht!</h2>

          <p>Hallo ${name},</p>

          <p>We hebben je contactverzoek ontvangen en nemen zo snel mogelijk contact met je op.</p>

          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Jouw gegevens:</strong></p>
            <p>Email: ${email}</p>
            ${phone ? `<p>Telefoon: ${phone}</p>` : ''}
          </div>

          <p>Met vriendelijke groet,<br>
          <strong>${companyName || 'Het Team'}</strong></p>

          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">

          <p style="font-size: 12px; color: #999;">
            Dit is een automatische bevestiging van je contactverzoek.
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: `"${companyName || 'Chatbot'}" <${GMAIL_USER}>`,
        to: email,
        subject: 'Bevestiging: We hebben je bericht ontvangen',
        html: confirmationEmail
      });
    } catch (confirmError) {
      console.error('Failed to send confirmation email:', confirmError);
      // Don't fail the request if confirmation email fails
    }

    return res.status(200).json({
      success: true,
      message: 'Contact details sent successfully'
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
