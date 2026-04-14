import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CreditsWidget from '../components/CreditsWidget';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [credits, setCredits] = useState(0);
  const [resetAt, setResetAt] = useState(null);
  const [creditsError, setCreditsError] = useState('');

  useEffect(() => {
    const loadCredits = async () => {
      try {
        const res = await fetch(`${API_URL}/api/credits`, {
          credentials: 'include',
        });

        if (!res.ok) {
          setCreditsError('Unable to load credit information.');
          return;
        }

        const data = await res.json();
        setCredits(Number.isFinite(data.credits) ? data.credits : 0);
        setResetAt(typeof data.resetAt === 'string' ? data.resetAt : null);
      } catch (error) {
        setCreditsError('Unable to connect to credits service.');
      }
    };

    loadCredits();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userHandle = useMemo(() => {
    return user?.github_username ? `@${user.github_username}` : 'Authenticated account';
  }, [user]);

  return (
    <div className="dashboard-shell">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <p className="eyebrow">User Dashboard</p>
          <h1>Workspace Overview</h1>
          <p>Manage account access, review credits, and launch profile generation.</p>
        </div>
        <div className="dashboard-actions">
          <button className="button-secondary" onClick={handleLogout}>Logout</button>
          <Link className="button-primary" to="/generate">Open Generator</Link>
        </div>
      </div>

      <CreditsWidget credits={credits} resetAt={resetAt} />

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Account</h3>
          <div className="dashboard-kpi">
            <div className="dashboard-kpi-item">
              <strong>{userHandle}</strong>
              <span>GitHub handle</span>
            </div>
            <div className="dashboard-kpi-item">
              <strong>{credits}</strong>
              <span>Credits available</span>
            </div>
            <div className="dashboard-kpi-item">
              <strong>{Math.floor(credits / 15)}</strong>
              <span>Generations left</span>
            </div>
          </div>

          {creditsError && <p className="plan-note">{creditsError}</p>}

          <div className="dashboard-actions">
            <Link className="button-primary" to="/generate">Generate README</Link>
            <Link className="button-secondary" to="/features">Review Features</Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Connection Status</h3>
          <div className="dashboard-list">
            <div className="dashboard-list-item">
              <strong>Authentication</strong>
              <p>Secure session established with HTTP-only cookie.</p>
            </div>
            <div className="dashboard-list-item">
              <strong>API Endpoint</strong>
              <p>{API_URL}</p>
            </div>
            <div className="dashboard-list-item">
              <strong>Next Credit Reset</strong>
              <p>{resetAt ? new Date(resetAt).toLocaleString() : 'Pending sync'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
