const Contact = require('../models/Contact');
const { sendContactNotification } = require('../services/emailService');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+966|966|0)?5[0-9]{8}$/;

/**
 * Normalize and validate incoming contact form payload.
 * Accepts `subject` or `service` (frontend uses service as subject).
 */
function parseContactBody(body) {
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const phone = body.phone?.trim();
  const subject = (body.subject || body.service)?.trim();
  const message = body.message?.trim();

  if (!name || name.length < 2) {
    return { error: 'Name is required (minimum 2 characters).' };
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return { error: 'A valid email address is required.' };
  }
  if (!phone || !PHONE_REGEX.test(phone.replace(/\s/g, ''))) {
    return { error: 'A valid Saudi phone number is required.' };
  }
  if (!subject) {
    return { error: 'Subject is required.' };
  }
  if (!message || message.length < 10) {
    return { error: 'Message is required (minimum 10 characters).' };
  }

  return { data: { name, email, phone, subject, message } };
}

/**
 * POST /api/contact
 * Public — save submission to MongoDB and email info@tamalarabiya.com
 */
exports.submitContact = async (req, res) => {
  try {
    const parsed = parseContactBody(req.body);

    if (parsed.error) {
      return res.status(400).json({
        success: false,
        message: parsed.error,
      });
    }

    const { name, email, phone, subject, message } = parsed.data;

    // 1. Persist to MongoDB
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    // 2. Send email notification via Hostinger SMTP
    try {
      await sendContactNotification({ name, email, phone, subject, message });
    } catch (emailError) {
      // Roll back DB record if email fails so client can retry
      await Contact.findByIdAndDelete(contact._id);
      console.error('Contact email failed:', emailError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to send notification email. Please try again later.',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will contact you soon.',
      data: {
        id: contact._id,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    console.error('Contact submission error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
};
