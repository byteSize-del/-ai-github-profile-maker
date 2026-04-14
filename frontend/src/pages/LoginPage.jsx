import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login, loading, error, isAuthenticated } = useAuth();
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/generate');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleGitHubCallback(code);
    }
  }, [searchParams]);

  const handleGitHubCallback = async (code) => {
    const state = searchParams.get('state');
    try {
      setLoginError(null);
      await login(code, state);  // Pass state to login
      navigate('/generate');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleGitHubLogin = async () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/login`;
    const scope = 'user:email read:user';

    if (!clientId) {
      setLoginError('GitHub Client ID not configured');
      return;
    }

    try {
      // SECURITY: Get OAuth state from backend (stored in httpOnly cookie)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const stateResponse = await fetch(`${apiUrl}/api/auth/oauth-state`, {
        credentials: 'include',  // Include cookies so backend can set oauth_state cookie
      });

      if (!stateResponse.ok) {
        throw new Error('Failed to initialize OAuth');
      }

      const { state } = await stateResponse.json();

      // Redirect to GitHub with server-generated state
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;
      window.location.href = authUrl;
    } catch (err) {
      setLoginError(err.message || 'Failed to initialize login');
    }
  };

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-loading">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome to ProfileForge</h1>
            <p>Sign in to generate your professional GitHub profile</p>
          </div>

          <div className="login-content">
            {(loginError || error) && (
              <div className="error-message">
                <span className="error-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                </span>
                <div>
                  <strong>Login Failed</strong>
                  <p>{loginError || error}</p>
                </div>
              </div>
            )}

            <div className="features-preview">
              <h3>What you'll get with a free account:</h3>
              <ul>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  AI-powered profile generation
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                  Live preview before saving
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  30 free credits daily
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  Export to Markdown instantly
                </li>
              </ul>
            </div>

            <button
              className="github-login-btn"
              onClick={handleGitHubLogin}
              disabled={loading}
            >
              <svg className="github-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="login-footer">
            <p className="privacy-note">
              By continuing, you agree to our{' '}
              <a href="/terms">Terms of Service</a> and{' '}
              <a href="/privacy">Privacy Policy</a>.
              <br />
              We only access your public profile information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
