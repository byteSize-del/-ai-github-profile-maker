import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate compelling typing SVG lines based on user's tech stack and role - NO CLICHÉS
function getTypingLines(style, name, role, techStack = []) {
  // Extract specializations from tech stack
  const hasReact = techStack.some(t => t.toLowerCase().includes('react'));
  const hasNode = techStack.some(t => t.toLowerCase().includes('node'));
  const hasAI = techStack.some(t => ['tensorflow', 'pytorch', 'ml', 'llm', 'ai', 'groq', 'langchain'].some(term => t.toLowerCase().includes(term)));
  const hasDevOps = techStack.some(t => ['docker', 'kubernetes', 'aws', 'gcp', 'devops'].some(term => t.toLowerCase().includes(term)));
  const hasPython = techStack.some(t => t.toLowerCase().includes('python'));
  
  // Parse role for keywords
  const roleType = role.toLowerCase();
  const isFullstack = roleType.includes('fullstack') || roleType.includes('full-stack');
  const isFrontend = roleType.includes('frontend') || roleType.includes('front-end') || roleType.includes('ui');
  const isBackend = roleType.includes('backend') || roleType.includes('back-end');
  const isDevOpsRole = roleType.includes('devops') || roleType.includes('infrastructure') || roleType.includes('sre');
  const isDataRole = roleType.includes('data') || roleType.includes('ml') || roleType.includes('ai');

  const lineSets = {
    professional: [
      // Tech-specific focus lines
      ...(hasReact && hasNode ? [`React + Node specialist`] : []),
      ...(hasAI ? [`Shipping AI features`] : []),
      ...(hasDevOps ? [`Building for scale`] : []),
      ...(hasPython && hasAI ? [`ML | Python | Production`] : []),
      
      // Achievement-focused lines (no clichés)
      `Turning ideas into products`,
      `Shipped to millions of users`,
      `Performance obsessive`,
      `Full-stack problem solver`,
      `Metrics + Code = Success`,
      
      // Tech stack lines (specific, not generic)
      ...techStack.slice(0, 3).map(tech => `${tech} expert`),
      
      // Role-appropriate lines
      ...(isFullstack ? [`End-to-end ownership`] : []),
      ...(isFrontend ? [`UI that users love`] : []),
      ...(isBackend ? [`Scaling databases & APIs`] : []),
      ...(isDevOpsRole ? [`Reliable systems`] : []),
      ...(isDataRole ? [`Data-driven decisions`] : []),
      
      // Fallback professional lines
      `Architecting solutions`,
      `Testing at scale`,
      `Open source contributor`,
    ],
    casual: [
      `${name.split(' ')[0]}'s code`,
      `${role} IRL`,
      `Breaking & fixing constantly`,
      `JavaScript is my canvas`,
      `Ship it 🚀`,
      `Refactoring nonstop`,
      `Debugging like a detective`,
      `Coffee-driven development`,
      ...techStack.slice(0, 2).map(tech => `${tech} wizard`),
    ],
    minimal: [
      `${name}`,
      `${role}`,
      `code → build → ship`,
      `${techStack.slice(0, 1)[0]} • TypeScript • Scale`,
      `Solving problems`,
    ],
  };

  let lines = lineSets[style] || lineSets.professional;
  
  // Filter out empty strings and duplicates
  lines = [...new Set(lines.filter(line => line && line.trim()))];
  
  // Ensure we have at least 3-4 lines
  if (lines.length < 3) {
    lines.push(`${name}`, role, ...lineSets.professional.slice(0, 2));
  }
  
  // Take first 4 unique lines for diversity
  lines = lines.slice(0, Math.min(4, lines.length));
  
  // Randomize order for uniqueness each time
  const shuffled = [...lines].sort(() => Math.random() - 0.5);
  
  return shuffled.join(';');
}

export function buildPrompt(userData) {
  const profileStyle = userData.profileStyle || 'professional';

  // IMPORTANT: gh = GitHub username (for stats URLs), name = display name (for text)
  // ALWAYS use gh for ALL GitHub stats, streak, visitor count, and languages URLs
  // CRITICAL: Never fall back to display name - it will break stats URLs
  const gh = userData.githubUsername;
  const name = userData.name;

  // Validate that we have a GitHub username
  if (!gh) {
    throw new Error('GitHub username is required for stats URLs. Please provide githubUsername in userData.');
  }

  const socialsText = Object.entries(userData.socials || {})
    .filter(([_, v]) => v && v.trim())
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');

  // Generate unique typing SVG lines each time based on profile style and user's actual tech stack
  const typingLines = getTypingLines(profileStyle, name, userData.role, userData.techStack || []);

  // Only include typing SVG for non-job-ready profiles
  let typingSvgUrl = 'NO_TYPING_SVG';
  if (profileStyle !== 'job-ready') {
    typingSvgUrl = `https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=6C63FF&center=true&vCenter=true&width=500&lines=${encodeURIComponent(typingLines)}`;
  }

  const visitorBadgeUrl = `https://komarev.com/ghpvc/?username=${gh}&label=Profile+Views&color=0e75b6&style=flat-square`;

  // Use the most reliable GitHub stats endpoints
  // Note: These free services occasionally go down for maintenance
  const githubStatsUrl = `https://github-readme-stats.vercel.app/api?username=${gh}&show_icons=true&theme=tokyonight&hide_border=true&count_private=true`;

  const topLangsUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${gh}&layout=compact&theme=tokyonight&hide_border=true&count_private=true`;

  const streakStatsUrl = `https://streak-stats.demolab.com/?user=${gh}&theme=tokyonight&hide_border=true`;

  // GitHub Trophies widget
  const trophiesUrl = `https://github-profile-trophy.vercel.app/?username=${gh}&theme=tokyonight&no-frame=true&margin-w=15&margin-h=15&no-bg=true&rank=-C`;

  // Random Memes widget (refreshes daily)
  const memesUrl = `https://readme-memes.vercel.app/api/meme`;

  // Inspirational Quotes widget
  const quotesUrl = `https://quotes-readme.vercel.app/api?theme=dark&align=center`;

  // Donation links HTML
  const donations = userData.donations || {};
  const donationHtml = Object.entries(donations)
    .filter(([_, url]) => url && url.trim())
    .map(([platform, url]) => {
      const icons = {
        github: '💚',
        patreon: '🎨',
        buymeacoffee: '☕',
        paypal: '💳'
      };
      return `<a href="${url}" target="_blank">${icons[platform] || '💰'} ${platform}</a>`;
    })
    .join(' · ');

  // Tech stack badges - generate as HTML img tags for proper rendering
  const techBadgeUrls = (userData.techStack || []).map(tech => {
    const normalized = tech.toLowerCase().replace(/[.#]/g, '');
    const logos = {
      javascript: { logo: 'javascript', color: 'F7DF1E', logoColor: 'white' },
      typescript: { logo: 'typescript', color: '3178C6', logoColor: 'white' },
      python: { logo: 'python', color: '3776AB', logoColor: 'white' },
      react: { logo: 'react', color: '20232A', logoColor: '61DAFB' },
      'node.js': { logo: 'nodedotjs', color: '339933', logoColor: 'white' },
      node: { logo: 'nodedotjs', color: '339933', logoColor: 'white' },
      express: { logo: 'express', color: '000000', logoColor: 'white' },
      mongodb: { logo: 'mongodb', color: '47A248', logoColor: 'white' },
      postgresql: { logo: 'postgresql', color: '4169E1', logoColor: 'white' },
      postgres: { logo: 'postgresql', color: '4169E1', logoColor: 'white' },
      docker: { logo: 'docker', color: '2496ED', logoColor: 'white' },
      aws: { logo: 'amazonwebservices', color: '232F3E', logoColor: 'white' },
      firebase: { logo: 'firebase', color: 'FFCA28', logoColor: 'white' },
      nextdotjs: { logo: 'nextdotjs', color: '000000', logoColor: 'white' },
      'next.js': { logo: 'nextdotjs', color: '000000', logoColor: 'white' },
      vite: { logo: 'vite', color: '646CFF', logoColor: 'white' },
      redux: { logo: 'redux', color: '764ABC', logoColor: 'white' },
      html5: { logo: 'html5', color: 'E34F26', logoColor: 'white' },
      css3: { logo: 'css3', color: '1572B6', logoColor: 'white' },
      sass: { logo: 'sass', color: 'CC6699', logoColor: 'white' },
      tailwindcss: { logo: 'tailwindcss', color: '06B6D4', logoColor: 'white' },
      tailwind: { logo: 'tailwindcss', color: '06B6D4', logoColor: 'white' },
      graphql: { logo: 'graphql', color: 'E10098', logoColor: 'white' },
      jest: { logo: 'jest', color: 'C21325', logoColor: 'white' },
      git: { logo: 'git', color: 'F05032', logoColor: 'white' },
      linux: { logo: 'linux', color: 'FCC624', logoColor: 'white' },
      rust: { logo: 'rust', color: '000000', logoColor: 'white' },
      go: { logo: 'go', color: '00ADD8', logoColor: 'white' },
      java: { logo: 'openjdk', color: 'ED8B00', logoColor: 'white' },
      cplusplus: { logo: 'c++', color: '00599C', logoColor: 'white' },
      'c++': { logo: 'c++', color: '00599C', logoColor: 'white' },
      vue: { logo: 'vuedotjs', color: '4FC08D', logoColor: 'white' },
      angular: { logo: 'angular', color: 'DD0031', logoColor: 'white' },
      svelte: { logo: 'svelte', color: 'FF3E00', logoColor: 'white' },
      flutter: { logo: 'flutter', color: '02569B', logoColor: 'white' },
      dart: { logo: 'dart', color: '0175C2', logoColor: 'white' },
      swift: { logo: 'swift', color: 'FA7343', logoColor: 'white' },
      kotlin: { logo: 'kotlin', color: '7F52FF', logoColor: 'white' },
      mysql: { logo: 'mysql', color: '4479A1', logoColor: 'white' },
      sqlite: { logo: 'sqlite', color: '003B57', logoColor: 'white' },
      redis: { logo: 'redis', color: 'DC382D', logoColor: 'white' },
      django: { logo: 'django', color: '092E20', logoColor: 'white' },
      flask: { logo: 'flask', color: '000000', logoColor: 'white' },
      spring: { logo: 'spring', color: '6DB33F', logoColor: 'white' },
      github: { logo: 'github', color: '181717', logoColor: 'white' },
      'vs code': { logo: 'visualstudiocode', color: '007ACC', logoColor: 'white' },
      visualstudiocode: { logo: 'visualstudiocode', color: '007ACC', logoColor: 'white' },
    };
    const config = logos[normalized] || { logo: normalized, color: '58a6ff', logoColor: 'white' };
    return `<img src="https://img.shields.io/badge/${tech}-${config.color}?style=for-the-badge&logo=${config.logo}&logoColor=${config.logoColor}"/>`;
  }).join('\n  ');

  // Load template based on profile style
  const templatePath = join(__dirname, `../templates/${profileStyle}.md`);
  let templateContent;

  try {
    templateContent = readFileSync(templatePath, 'utf-8');
  } catch (error) {
    console.error(`Template not found: ${templatePath}, falling back to professional`);
    templateContent = readFileSync(join(__dirname, '../templates/professional.md'), 'utf-8');
  }

  // Replace variables in template
  const prompt = templateContent
    .replace(/\$\{name\}/g, name)
    .replace(/\$\{gh\}/g, gh)
    .replace(/\$\{userData\.role\}/g, userData.role)
    .replace(/\$\{userData\.bio\}/g, userData.bio)
    .replace(/\$\{userData\.techStack\.join\(.*?\)\}/g, userData.techStack.join(', '))
    .replace(/\$\{userData\.projects\.join\(.*?\)\}/g, userData.projects.join(', '))
    .replace(/\$\{socialsText \?.*?:\s*''\}/gs, socialsText ? `\n**Social Links:**\n${socialsText}` : '')
    .replace(/\$\{typingSvgUrl\}/g, typingSvgUrl)
    .replace(/\$\{visitorBadgeUrl\}/g, visitorBadgeUrl)
    .replace(/\$\{githubStatsUrl\}/g, githubStatsUrl)
    .replace(/\$\{topLangsUrl\}/g, topLangsUrl)
    .replace(/\$\{streakStatsUrl\}/g, streakStatsUrl)
    .replace(/\$\{techBadgeUrls\}/g, techBadgeUrls)
    .replace(/\$\{trophiesUrl\}/g, trophiesUrl)
    .replace(/\$\{memesUrl\}/g, memesUrl)
    .replace(/\$\{quotesUrl\}/g, quotesUrl)
    .replace(/\$\{donationHtml\}/g, donationHtml || 'NO_DONATIONS');

  return prompt;
}
