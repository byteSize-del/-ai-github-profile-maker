import { Router } from 'express';
import Joi from 'joi';
import { saveContactMessage } from '../db/supabase.js';
import { extractSessionUserIfPresent } from '../middleware/auth.js';

const router = Router();

const contactSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).max(254).required(),
  subject: Joi.string().trim().min(1).max(120).required(),
  message: Joi.string().trim().min(1).max(5000).required(),
}).required();

function sanitizeText(input) {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

router.post('/', extractSessionUserIfPresent, async (req, res) => {
  try {
    const { error, value } = contactSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join('; ');
      return res.status(400).json({ error: `Validation failed: ${message}` });
    }

    const requestSize = JSON.stringify(value).length;
    if (requestSize > 12 * 1024) {
      return res.status(413).json({ error: 'Request body too large' });
    }

    const saved = await saveContactMessage({
      user_id: req.userId || null,
      name: sanitizeText(value.name),
      email: sanitizeText(value.email).toLowerCase(),
      subject: sanitizeText(value.subject),
      message: sanitizeText(value.message),
      status: 'new',
    });

    return res.status(201).json({
      success: true,
      id: saved.id,
      createdAt: saved.created_at,
      message: 'Message submitted successfully',
    });
  } catch (err) {
    console.error('Contact submission error:', err.message);

    if (err.message === 'Supabase not configured') {
      return res.status(503).json({ error: 'Contact service is temporarily unavailable' });
    }

    return res.status(500).json({ error: 'Failed to submit contact message' });
  }
});

export default router;
