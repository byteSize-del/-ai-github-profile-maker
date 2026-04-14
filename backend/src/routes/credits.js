import { Router } from 'express';
import { getCredits } from '../db/credits.js';

const router = Router();

router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const { credits, resetAt } = getCredits(userId);
  res.json({ credits, resetAt });
});

export default router;
