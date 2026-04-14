import { useState, useEffect } from 'react';
import { z } from 'zod';
import ProfileWizard from '../components/ProfileWizard';
import ReadmePreview from '../components/ReadmePreview';
import CreditsWidget from '../components/CreditsWidget';
import '../App.css';

// SECURITY: Input validation schema for user profile data
const userDataSchema = z.object({
  profileStyle: z.enum(['professional', 'job-ready', 'casual', 'minimal']).default('professional'),
  name: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9\s\-'.]+$/),
  githubUsername: z.string().min(1).max(39).regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/),
  role: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9\s\-&,.]+$/),
  bio: z.string().trim().min(1).max(500),
  techStack: z.array(z.string().max(50)).default([]),
  projects: z.array(z.string().max(100)).default([]),
  socials: z.object({
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),
    email: z.string().optional(),
  }).optional(),
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function GeneratePage() {
  const [generatedReadme, setGeneratedReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(null);
  const [resetAt, setResetAt] = useState(null);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState('');
  const [wizardComplete, setWizardComplete] = useState(false);

  // SECURITY: Use httpOnly cookies for session (backend extracts user ID)
  // Never store user ID in localStorage (XSS vulnerable)
  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const res = await fetch(`${API_URL}/api/credits`, {
        credentials: 'include',
      });

      if (!res.ok) {
        setCredits(0);
        setResetAt(null);
        return;
      }

      const data = await res.json();
      setCredits(Number.isFinite(data.credits) ? data.credits : 0);
      setResetAt(typeof data.resetAt === 'string' ? data.resetAt : null);
    } catch (err) {
      console.error('Failed to fetch credits:', err);
      setCredits(0);
      setResetAt(null);
    }
  };

  const handleGenerate = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // SECURITY: Validate input on client side before sending
      const validatedData = userDataSchema.parse(userData);
      
      // SECURITY: Check request size to prevent DoS
      const requestSize = JSON.stringify(validatedData).length;
      if (requestSize > 10 * 1024) {
        setError('Request data too large. Please reduce your input.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userData: validatedData }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate README');
      }

      setGeneratedReadme(data.readme);
      setCredits(data.creditsRemaining);
      setProvider(data.provider);
      setWizardComplete(true);
    } catch (validationErr) {
      // Handle both validation and network errors
      if (validationErr instanceof z.ZodError) {
        setError('Please fix validation errors: ' + validationErr.errors[0]?.message);
      } else {
        setError(validationErr.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedReadme('');
    setWizardComplete(false);
    setProvider('');
    setError(null);
  };

  return (
    <div className="generate-page">
      {/* Animated background */}
      <div className="bg-gradient">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>

      <div className="app-content">
        {/* Header */}
        <header className="app-header">
          <div className="header-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            AI-Powered
          </div>
          <h1>GitHub Profile Maker</h1>
          <p className="header-sub">Generate stunning, professional GitHub profiles in seconds</p>
        </header>

        {/* Credits Widget */}
        <CreditsWidget credits={credits} resetAt={resetAt} />

        {/* Main Content */}
        <main className="app-main">
          {/* Wizard Section */}
          <div className="wizard-container">
            <ProfileWizard
              onSubmit={handleGenerate}
              loading={loading}
              wizardComplete={wizardComplete}
              onReset={handleReset}
            />
          </div>

          {/* Preview Section */}
          {generatedReadme && (
            <div className="preview-container">
              <ReadmePreview markdown={generatedReadme} provider={provider} />
            </div>
          )}
        </main>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </span>
            <span className="error-text">{error}</span>
            <button className="error-close" onClick={() => setError(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GeneratePage;
