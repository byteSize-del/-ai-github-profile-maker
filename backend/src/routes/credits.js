import { Router } from 'express';
import { getCredits } from '../db/supabase.js';
import { extractSessionUser } from '../middleware/auth.js';

const router = Router();

router.get('/', extractSessionUser, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { credits, resetAt } = await getCredits(userId);
    res.json({ credits, resetAt });
  } catch (error) {
    console.error('Credits fetch error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
