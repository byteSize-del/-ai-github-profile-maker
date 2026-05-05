import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './ProfileCompletionPage.css';

function ProfileCompletionPage() {
  const navigate = useNavigate();
  const { user, updateProfile, loading, error } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name.trim()) {
      setLocalError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setLocalError('Name must be at least 2 characters');
      return;
    }

    if (name.trim().length > 100) {
      setLocalError('Name must be less than 100 characters');
      return;
    }

    try {
      await updateProfile(name.trim());
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message || 'Failed to update profile');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="profile-completion-page">
        <div className="profile-completion-loading">
          <div className="spinner"></div>
          <p>Saving your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-completion-page">
      <div className="profile-completion-container">
        <div className="profile-completion-card">
          {/* Brand */}
          <div className="profile-completion-brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3H13v6.95c4.05-.5 7.2-3.95 7.2-8.15 0-5.52-4.48-10-10-10z" />
              </svg>
            </div>
            <h1>Complete Your Profile</h1>
            <p className="brand-tagline">Just one more step to get started</p>
          </div>

          {/* Welcome message */}
          <div className="profile-welcome">
            <p>Welcome to ProfileForge! We noticed you signed in with Google. Please tell us your name so we can personalize your experience.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={100}
                required
                autoFocus
              />
            </div>

            {/* Error */}
            {(localError || error) && (
              <div className="profile-error">
                <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{localError || error}</span>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Continue to Dashboard'}
              </button>
              <button type="button" className="btn-secondary" onClick={handleSkip}>
                Skip for now
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="profile-info">
            <p>You can always update your profile later from the dashboard settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCompletionPage;
