import { Router } from 'express';
import { generateReadme } from '../services/provider.js';
import { buildPrompt } from '../utils/prompt.js';
import { checkCredits, deductCredits } from '../middleware/credits.js';
import { extractSessionUser } from '../middleware/auth.js';

const router = Router();
const CREDITS_PER_USE = parseInt(process.env.CREDITS_PER_USE) || 15;

// Post-process function to fix stats URLs and ensure correct GitHub username is used
function ensureStatsRendered(readme, urls, profileStyle, correctUsername) {
  let result = readme;

  // CRITICAL: Replace ANY wrong username in stats URLs with the correct GitHub username
  // This catches when AI uses display name instead of actual GitHub username
  if (correctUsername) {
    console.log(`[Post-Process] Fixing stats URLs: replacing wrong username with "${correctUsername}"`);

    // Fix github-readme-stats URLs (works in both markdown and HTML src attributes)
    // Pattern matches: username=AnythingUntilQuoteOrAmpersand (catches all variations)
    const statsPatterns = [
      { regex: /(github-readme-stats\.vercel\.app\/api\?)username=[^"&\s]+/gi, replacement: `$1username=${correctUsername}` },
      { regex: /(github-readme-stats\.vercel\.app\/api\/top-langs\/\?)username=[^"&\s]+/gi, replacement: `$1username=${correctUsername}` },
      { regex: /(streak-stats\.demolab\.com\/\?)user=[^"&\s]+/gi, replacement: `$1user=${correctUsername}` },
      { regex: /(komarev\.com\/ghpvc\/\?)username=[^"&\s]+/gi, replacement: `$1username=${correctUsername}` },
    ];

    statsPatterns.forEach(({ regex, replacement }) => {
      const before = result;
      result = result.replace(regex, replacement);
      if (before !== result) {
        console.log(`[Post-Process] ✅ Replaced username in URL pattern`);
      }
    });

    // Additional catch: Find ANY URL that contains username/user parameter with wrong value
    // This catches edge cases where AI generates custom URLs
    const urlPattern = /(username|user)=([^&"]+)/gi;
    result = result.replace(urlPattern, (match, param, value) => {
      // Only replace if it's not already the correct username
      if (value !== correctUsername) {
        console.log(`[Post-Process] ⚠️ Found wrong username "${value}" in URL, replacing with "${correctUsername}"`);
        return `${param}=${correctUsername}`;
      }
      return match;
    });

    // Log final URLs for debugging
    const finalUrls = result.match(/(?:github-readme-stats|streak-stats|komarev)[^"'\s]+/g) || [];
    console.log(`[Post-Process] Final stats URLs in output:`, finalUrls.slice(0, 5));
  }
  
  // Define all stats that must be rendered as images
  const statsToInject = [
    // Fix code-block wrapped images
    { 
      pattern: /```(?:markdown|html)?\s*\n?(<p[^>]*>\s*<img\s+src="[^"]*"[^>]*>\s*<\/p>)\s*\n?```/gi,
      replacement: '$1'
    },
    { 
      pattern: /```(?:markdown)?\s*\n?(!\[Typing SVG\]\([^)]+\))\s*\n?```/gi,
      replacement: '$1'
    },
    { 
      pattern: /```(?:markdown)?\s*\n?(!\[Visitor Count\]\([^)]+\))\s*\n?```/gi,
      replacement: '$1'
    },
    { 
      pattern: /```(?:markdown)?\s*\n?(!\[GitHub Stats\]\([^)]+\))\s*\n?```/gi,
      replacement: '$1'
    },
    { 
      pattern: /```(?:markdown)?\s*\n?(!\[Top Languages\]\([^)]+\))\s*\n?```/gi,
      replacement: '$1'
    },
    { 
      pattern: /```(?:markdown)?\s*\n?(!\[GitHub Streak\]\([^)]+\))\s*\n?```/gi,
      replacement: '$1'
    },
    // Fix backtick-wrapped images
    { 
      pattern: /`(!\[Typing SVG\]\([^)]+\))`/gi,
      replacement: '$1'
    },
    { 
      pattern: /`(!\[Visitor Count\]\([^)]+\))`/gi,
      replacement: '$1'
    },
    { 
      pattern: /`(!\[GitHub Stats\]\([^)]+\))`/gi,
      replacement: '$1'
    },
    { 
      pattern: /`(!\[Top Languages\]\([^)]+\))`/gi,
      replacement: '$1'
    },
    { 
      pattern: /`(!\[GitHub Streak\]\([^)]+\))`/gi,
      replacement: '$1'
    },
  ];

  statsToInject.forEach(({ pattern, replacement }) => {
    result = result.replace(pattern, replacement);
  });

  // If stats are completely missing, inject them based on profile style
  if (!result.includes('github-readme-stats') && profileStyle !== 'job-ready') {
    result = result.replace(/\n##? Stats\n/, `\n## Stats\n\n![GitHub Stats](${urls.githubStatsUrl})\n\n![Top Languages](${urls.topLangsUrl})\n`);
  }
  
  if (!result.includes('streak-stats.demolab.com') && profileStyle !== 'job-ready') {
    result = result.replace(/\n##? Stats\n/, `\n## Stats\n\n![GitHub Streak](${urls.streakStatsUrl})\n`);
  }
  
  // For job-ready style (no typing SVG), inject stats with proper formatting
  if (!result.includes('github-readme-stats') && profileStyle === 'job-ready') {
    result = result.replace(/\n##? Stats\n/, `\n## Stats\n\n![GitHub Stats](${urls.githubStatsUrl})\n\n![Top Languages](${urls.topLangsUrl})\n`);
  }

  return result;
}

router.post('/', extractSessionUser, checkCredits, async (req, res) => {
  try {
    const { userData } = req.body;
    const userId = req.body.userId;

    if (!userData) {
      return res.status(400).json({ error: 'Missing userData in request body' });
    }

    if (!userData.name || !userData.role) {
      return res.status(400).json({ error: 'Missing required fields: name and role are required' });
    }

    if (!userData.githubUsername) {
      return res.status(400).json({ error: 'Missing required field: githubUsername is required for GitHub stats URLs' });
    }
    
    const prompt = buildPrompt(userData);
    
    // Log prompt size for debugging
    const promptSize = Buffer.byteLength(prompt, 'utf-8');
    console.log(`Prompt size: ${promptSize} bytes (~${Math.round(promptSize / 4)} tokens)`);
    
    const { result, provider } = await generateReadme(prompt);

    // Post-process to ensure stats are rendered as images, not code
    const correctGithubUsername = userData.githubUsername || '';
    console.log(`[Generate] Correct GitHub username from userData: "${correctGithubUsername}"`);
    
    const processedReadme = ensureStatsRendered(result, {
      typingSvgUrl: prompt.match(/https:\/\/readme-typing-svg\.demolab\.com\/\?[^"'\s)]+/)?.[0] || '',
      visitorBadgeUrl: prompt.match(/https:\/\/komarev\.com\/ghpvc\/\?[^"'\s)]+/)?.[0] || '',
      githubStatsUrl: prompt.match(/https:\/\/github-readme-stats\.vercel\.app\/api\?[^"'\s)]+/)?.[0] || '',
      topLangsUrl: prompt.match(/https:\/\/github-readme-stats\.vercel\.app\/api\/top-langs\/\?[^"'\s)]+/)?.[0] || '',
      streakStatsUrl: prompt.match(/https:\/\/streak-stats\.demolab\.com\/\?[^"'\s)]+/)?.[0] || '',
    }, userData.profileStyle || 'professional', correctGithubUsername);

    // Deduct credits (await the async function and get remaining credits)
    const creditsRemaining = await deductCredits(userId);

    res.json({
      readme: processedReadme,
      creditsUsed: CREDITS_PER_USE,
      creditsRemaining: creditsRemaining || 0,
      provider,
    });
  } catch (err) {
    console.error('Generation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
