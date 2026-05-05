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
      // Check if profile needs completion
      if (user?.needs_profile_completion) {
        navigate('/complete-profile');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const code = searchParams.get('code');
    const provider = searchParams.get('provider');

    if (code) {
      const effectiveProvider = provider || sessionStorage.getItem('oauth_provider') || 'github';

      if (effectiveProvider === 'google') {
        handleGoogleCallback(code);
      } else {
        handleGitHubCallback(code);
      }

      sessionStorage.removeItem('oauth_provider');
    }
  }, [searchParams]);

  const handleGitHubCallback = async (code) => {
    const state = searchParams.get('state');
    try {
      setLoginError(null);
      await login(code, state, 'github');
      navigate('/dashboard');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleGoogleCallback = async (code) => {
    const state = searchParams.get('state');
    try {
      setLoginError(null);
      const userData = await login(code, state, 'google');
      // Check if profile needs completion (Google OAuth with missing name)
      if (userData?.needs_profile_completion) {
        navigate('/complete-profile');
      } else {
        navigate('/dashboard');
      }
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const stateResponse = await fetch(`${apiUrl}/api/auth/oauth-state?provider=github`, {
        credentials: 'include',
      });

      if (!stateResponse.ok) {
        throw new Error('Failed to initialize OAuth');
      }

      const { state } = await stateResponse.json();
      sessionStorage.setItem('oauth_provider', 'github');

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;
      window.location.href = authUrl;
    } catch (err) {
      setLoginError(err.message || 'Failed to initialize login');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoginError(null);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/auth/google/url`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to initialize Google OAuth');
      }

      const { url } = await response.json();
      sessionStorage.setItem('oauth_provider', 'google');
      window.location.href = url;
    } catch (err) {
      setLoginError(err.message || 'Failed to initialize Google login');
    }
  };

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-card login-loading">
            <div className="spinner"></div>
            <p>Verifying your session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Brand */}
          <div className="login-brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3H13v6.95c4.05-.5 7.2-3.95 7.2-8.15 0-5.52-4.48-10-10-10z" />
              </svg>
            </div>
            <h1>ProfileForge</h1>
            <p className="brand-tagline">AI-powered GitHub profiles</p>
          </div>

          {/* Content */}
          <div className="login-body">
            {/* Error */}
            {(loginError || error) && (
              <div className="login-error">
                <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{loginError || error}</span>
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="login-buttons">
              <button
                className="oauth-btn oauth-btn-github"
                onClick={handleGitHubLogin}
                disabled={loading}
              >
                <svg className="oauth-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>

              <button
                className="oauth-btn oauth-btn-google"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="oauth-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Perks */}
            <div className="login-perks">
              <span className="perk-tag">
                <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                30 daily credits
              </span>
              <span className="perk-tag">
                <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                AI-powered
              </span>
              <span className="perk-tag">
                <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Secure
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p className="login-terms">
              By signing in, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
