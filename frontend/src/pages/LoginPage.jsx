import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login, loading, error, isAuthenticated } = useAuth();
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
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
      await login(code, state);
      navigate('/dashboard');
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
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-main">
            <h1>Loading account session</h1>
            <p>Please wait while we verify your authentication state.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-main">
          <p className="eyebrow">Authentication</p>
          <h1>Sign in with GitHub</h1>
          <p>
            Login enables your secure dashboard, credit tracking, and profile generation workflow.
          </p>

          {(loginError || error) && (
            <div className="auth-error">
              <strong>Authentication failed</strong>
              <p>{loginError || error}</p>
            </div>
          )}

          <div className="cta-row">
            <button className="button-primary" onClick={handleGitHubLogin} disabled={loading}>
              Continue with GitHub
            </button>
          </div>

          <p className="plan-note">
            By continuing you accept the Terms of Service and Privacy Policy.
          </p>
        </div>

        <aside className="auth-benefits">
          <h3>Included in free account</h3>
          <ul>
            <li>Protected dashboard and session management.</li>
            <li>30 daily credits with transparent balance display.</li>
            <li>Wizard-based README generation and markdown export.</li>
            <li>Provider failover for higher generation reliability.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default LoginPage;
