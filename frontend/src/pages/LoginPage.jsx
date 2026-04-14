import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login, loading, error, isAuthenticated } = useAuth();
  const [loginError, setLoginError] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/generate');
    }
  }, [isAuthenticated, user, navigate]);

  // Handle GitHub OAuth callback
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleGitHubCallback(code);
    }
  }, [searchParams]);

  const handleGitHubCallback = async (code) => {
    try {
      setLoginError(null);
      await login(code);
      navigate('/generate');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleGitHubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/login`;
    const scope = 'user:email read:user';

    if (!clientId) {
      setLoginError('GitHub Client ID not configured');
      return;
    }

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${Math.random().toString(36).substring(7)}`;
    window.location.href = authUrl;
  };

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome to AI GitHub Profile Maker</h1>
            <p>Sign in with your GitHub account to get started</p>
          </div>

          {(loginError || error) && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <div>
                <strong>Login Failed</strong>
                <p>{loginError || error}</p>
              </div>
            </div>
          )}

          <div className="login-content">
            <div className="features-preview">
              <h3>What you'll get:</h3>
              <ul>
                <li>✨ Generate stunning GitHub profiles with AI</li>
                <li>🎨 Multiple customizable templates</li>
                <li>💳 50 free credits per day</li>
                <li>📊 Track your generation history</li>
                <li>💾 Save your favorite profiles</li>
              </ul>
            </div>

            <button
              className="github-login-btn"
              onClick={handleGitHubLogin}
              disabled={loading}
            >
              <svg className="github-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
          </div>

          <div className="login-footer">
            <p className="privacy-note">
              We only access your public profile information and email address.
              <br />
              <a href="/privacy">Privacy Policy</a>
            </p>
          </div>
        </div>

        <div className="login-bg-decoration"></div>
      </div>
    </div>
  );
}

export default LoginPage;
