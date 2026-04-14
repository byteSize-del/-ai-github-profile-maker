import { useState, useEffect } from 'react';
import ProfileWizard from '../components/ProfileWizard';
import ReadmePreview from '../components/ReadmePreview';
import CreditsWidget from '../components/CreditsWidget';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function GeneratePage() {
  const [userId, setUserId] = useState(null);
  const [generatedReadme, setGeneratedReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(null);
  const [resetAt, setResetAt] = useState(null);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState('');
  const [wizardComplete, setWizardComplete] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = generateUUID();
      localStorage.setItem('userId', id);
    }
    setUserId(id);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCredits();
    }
  }, [userId]);

  const fetchCredits = async () => {
    try {
      const res = await fetch(`${API_URL}/api/credits`, {
        credentials: 'include', // Send session cookie with request
      });
      const data = await res.json();
      setCredits(data.credits);
      setResetAt(data.resetAt);
    } catch (err) {
      console.error('Failed to fetch credits:', err);
    }
  };

  const handleGenerate = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send session cookie with request
        body: JSON.stringify({ userData }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate README');
      }

      setGeneratedReadme(data.readme);
      setCredits(data.creditsRemaining);
      setProvider(data.provider);
      setWizardComplete(true);
    } catch (err) {
      setError(err.message);
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
          <div className="header-badge">✨ AI-Powered</div>
          <h1>GitHub Profile Maker</h1>
          <p className="header-sub">Generate stunning, professional GitHub profiles in seconds</p>
        </header>

        {/* Credits Widget */}
        {userId && (
          <CreditsWidget credits={credits} resetAt={resetAt} />
        )}

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
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button className="error-close" onClick={() => setError(null)}>×</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GeneratePage;
