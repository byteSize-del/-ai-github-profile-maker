import { Router } from 'express';
import Joi from 'joi';
import { generateReadme } from '../services/provider.js';
import { buildPrompt } from '../utils/prompt.js';
import { checkCredits, deductCredits } from '../middleware/credits.js';
import { extractSessionUser } from '../middleware/auth.js';
import { saveGeneration } from '../db/supabase.js';

const router = Router();
const CREDITS_PER_USE = parseInt(process.env.CREDITS_PER_USE) || 15;

/**
 * SECURITY: Input validation schema for user profile data
 * Prevents injection attacks, XSS, and malformed data
 */
const userDataSchema = Joi.object({
  profileStyle: Joi.string()
    .valid('professional', 'job-ready', 'casual', 'minimal')
    .default('professional'),
  name: Joi.string()
    .trim()
    .max(100)
    .required()
    .pattern(/^[a-zA-Z0-9\s\-'\.]+$/, 'name')  // Allow only safe characters
    .messages({
      'string.pattern.name': 'Name contains invalid characters',
      'any.required': 'Name is required',
    }),
  githubUsername: Joi.string()
    .min(1)
    .max(39)  // GitHub max username length
    .required()
    .pattern(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/, 'github username')
    .messages({
      'string.pattern.name': 'GitHub username can only contain alphanumeric characters and hyphens',
      'any.required': 'GitHub username is required',
    }),
  role: Joi.string()
    .trim()
    .max(100)
    .required()
    .pattern(/^[a-zA-Z0-9\s\-&,\.]+$/, 'role')
    .messages({
      'string.pattern.role': 'Role contains invalid characters',
      'any.required': 'Role is required',
    }),
  bio: Joi.string()
    .trim()
    .max(500)
    .required()
    .messages({
      'string.max': 'Bio must be less than 500 characters',
      'any.required': 'Bio is required',
    }),
  techStack: Joi.array()
    .items(Joi.string().trim().max(50))
    .max(20)  // Max 20 technologies
    .default([]),
  projects: Joi.array()
    .items(Joi.string().trim().max(100))
    .max(10)  // Max 10 projects
    .default([]),
  socials: Joi.object({
    twitter: Joi.string().trim().max(50).allow(''),
    linkedin: Joi.string().trim().max(100).allow(''),
    portfolio: Joi.string().uri().allow(''),
    email: Joi.string().email().allow(''),
  }).default({}),
}).required();

/**
 * Sanitize user input to prevent XSS
 */
function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
  return input;
}

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
    // SECURITY: Validate request body against schema
    const { error, value: validatedData } = userDataSchema.validate(req.body.userData, {
      abortEarly: false,  // Return all validation errors
      stripUnknown: true,  // Remove unknown fields
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join('; ');
      return res.status(400).json({ error: `Validation failed: ${errorMessages}` });
    }

    const userData = validatedData;
    const userId = req.userId;  // Use verified user ID from JWT, not from request body

    // Check request size to prevent DoS
    const requestSize = JSON.stringify(userData).length;
    if (requestSize > 10 * 1024) {  // 10KB max
      return res.status(413).json({ error: 'Request body too large' });
    }

    const prompt = buildPrompt(userData);
    
    // Log prompt size for debugging
    const promptSize = Buffer.byteLength(prompt, 'utf-8');
    if (promptSize > 100 * 1024) {  // 100KB max prompt
      return res.status(413).json({ error: 'Generated prompt too large' });
    }
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

    // Save generation to database
    try {
      await saveGeneration(userId, {
        github_username: userData.githubUsername,
        template: userData.profileStyle || 'professional',
        input: userData, // Store the input data
        readme: processedReadme,
        provider: provider,
        model: 'groq', // Default model
        generationTime: Date.now(), // Can be improved with actual timing
      });
      console.log(`[Generate] Successfully saved generation for user ${userId}`);
    } catch (saveError) {
      console.error('[Generate] Failed to save generation:', saveError.message);
      // Don't fail the request if saving fails - still return the generated README
    }

    res.json({
      readme: processedReadme,
      creditsUsed: CREDITS_PER_USE,
      creditsRemaining: creditsRemaining || 0,
      provider,
    });
  } catch (err) {
    console.error('Generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate README' });  // Don't expose internal error details
  }
});

export default router;
