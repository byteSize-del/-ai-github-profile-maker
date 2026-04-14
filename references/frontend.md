# Frontend — Complete Implementation

## `frontend/src/App.jsx`

```jsx
import { useState, useEffect } from 'react';
import ProfileForm from './components/ProfileForm';
import ReadmePreview from './components/ReadmePreview';
import CreditsWidget from './components/CreditsWidget';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function App() {
  const [userId, setUserId] = useState(null);
  const [generatedReadme, setGeneratedReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(null);
  const [resetAt, setResetAt] = useState(null);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState('');

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
      const res = await fetch(`${API_URL}/api/credits/${userId}`);
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
        body: JSON.stringify({ userId, userData }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate README');
      }

      setGeneratedReadme(data.readme);
      setCredits(data.creditsRemaining);
      setProvider(data.provider);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>✨ AI GitHub Profile Maker</h1>
        <p>Generate stunning GitHub profile READMEs with AI</p>
      </header>

      {userId && (
        <CreditsWidget credits={credits} resetAt={resetAt} />
      )}

      <main className="app-main">
        <div className="form-section">
          <ProfileForm onSubmit={handleGenerate} loading={loading} />
          {error && <div className="error-message">{error}</div>}
        </div>

        {generatedReadme && (
          <div className="preview-section">
            <ReadmePreview markdown={generatedReadme} provider={provider} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
```

## `frontend/src/components/ProfileForm.jsx`

```jsx
import { useState } from 'react';

const DEFAULT_TECH_STACK = ['JavaScript', 'React', 'Node.js'];
const DEFAULT_PROJECTS = ['Project 1', 'Project 2'];

function ProfileForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    techStack: DEFAULT_TECH_STACK,
    bio: '',
    projects: DEFAULT_PROJECTS,
    socials: {
      twitter: '',
      linkedin: '',
      portfolio: '',
      email: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socials: { ...prev.socials, [name]: value },
    }));
  };

  const handleArrayChange = (e, field, index) => {
    const { value } = e.target;
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>📝 Profile Details</h2>

      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Role *</label>
        <input
          id="role"
          name="role"
          type="text"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g., Full Stack Developer"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="bio">Bio *</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="A short bio about yourself"
          rows={4}
          required
        />
      </div>

      <div className="form-group">
        <label>Tech Stack</label>
        {formData.techStack.map((tech, index) => (
          <div key={index} className="array-input">
            <input
              type="text"
              value={tech}
              onChange={(e) => handleArrayChange(e, 'techStack', index)}
              placeholder="e.g., React"
            />
            <button
              type="button"
              className="btn-remove"
              onClick={() => removeArrayItem('techStack', index)}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-add"
          onClick={() => addArrayItem('techStack')}
        >
          + Add Tech
        </button>
      </div>

      <div className="form-group">
        <label>Projects</label>
        {formData.projects.map((project, index) => (
          <div key={index} className="array-input">
            <input
              type="text"
              value={project}
              onChange={(e) => handleArrayChange(e, 'projects', index)}
              placeholder="Project name"
            />
            <button
              type="button"
              className="btn-remove"
              onClick={() => removeArrayItem('projects', index)}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-add"
          onClick={() => addArrayItem('projects')}
        >
          + Add Project
        </button>
      </div>

      <div className="form-group">
        <h3>Social Links</h3>
        <div className="form-group">
          <label htmlFor="twitter">Twitter</label>
          <input
            id="twitter"
            name="twitter"
            type="url"
            value={formData.socials.twitter}
            onChange={handleSocialChange}
            placeholder="https://twitter.com/yourusername"
          />
        </div>
        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn</label>
          <input
            id="linkedin"
            name="linkedin"
            type="url"
            value={formData.socials.linkedin}
            onChange={handleSocialChange}
            placeholder="https://linkedin.com/in/yourusername"
          />
        </div>
        <div className="form-group">
          <label htmlFor="portfolio">Portfolio</label>
          <input
            id="portfolio"
            name="portfolio"
            type="url"
            value={formData.socials.portfolio}
            onChange={handleSocialChange}
            placeholder="https://yourportfolio.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.socials.email}
            onChange={handleSocialChange}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <button type="submit" className="btn-generate" disabled={loading}>
        {loading ? 'Generating...' : '✨ Generate README'}
      </button>
    </form>
  );
}

export default ProfileForm;
```

## `frontend/src/components/ReadmePreview.jsx`

```jsx
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ProviderBadge from './ProviderBadge';
import './ReadmePreview.css';

function ReadmePreview({ markdown, provider }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="readme-preview">
      <div className="preview-header">
        <h2>📄 Generated README</h2>
        <div className="preview-actions">
          <ProviderBadge provider={provider} />
          <button onClick={handleCopy} className="btn-action">
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <button onClick={handleDownload} className="btn-action">
            ⬇️ Download
          </button>
        </div>
      </div>
      <div className="markdown-preview">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default ReadmePreview;
```

## `frontend/src/components/CreditsWidget.jsx`

```jsx
import { useState, useEffect } from 'react';
import './CreditsWidget.css';

function CreditsWidget({ credits, resetAt }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!resetAt) return;

    const updateTimer = () => {
      const now = new Date();
      const reset = new Date(resetAt);
      const diff = reset - now;

      if (diff <= 0) {
        setTimeLeft('Resetting...');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [resetAt]);

  if (credits === null) return null;

  const percentage = (credits / 50) * 100;
  const color = percentage > 50 ? '#4caf50' : percentage > 20 ? '#ff9800' : '#f44336';

  return (
    <div className="credits-widget">
      <div className="credits-info">
        <span className="credits-label">💎 Credits Remaining</span>
        <span className="credits-value" style={{ color }}>
          {credits} / 50
        </span>
      </div>
      <div className="credits-bar">
        <div
          className="credits-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <div className="credits-timer">
        ⏰ Resets in: {timeLeft}
      </div>
    </div>
  );
}

export default CreditsWidget;
```

## `frontend/src/components/ProviderBadge.jsx`

```jsx
import './ProviderBadge.css';

const PROVIDER_COLORS = {
  groq: '#f59e0b',
  openrouter: '#3b82f6',
  nvidia: '#76b900',
};

function ProviderBadge({ provider }) {
  const color = PROVIDER_COLORS[provider] || '#6b7280';

  return (
    <span className="provider-badge" style={{ backgroundColor: color }}>
      ⚡ {provider}
    </span>
  );
}

export default ProviderBadge;
```

## Styles

### `frontend/src/App.css`

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: #0d1117;
  color: #c9d1d9;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.app-header {
  text-align: center;
  margin-bottom: 2rem;
}

.app-header h1 {
  font-size: 2.5rem;
  color: #58a6ff;
  margin-bottom: 0.5rem;
}

.app-header p {
  color: #8b949e;
  font-size: 1.1rem;
}

.app-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 900px) {
  .app-main {
    grid-template-columns: 1fr;
  }
}

.error-message {
  background: #ff4444;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}
```

### `frontend/src/components/ReadmePreview.css`

```css
.readme-preview {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 1.5rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preview-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-action {
  background: #21262d;
  color: #c9d1d9;
  border: 1px solid #30363d;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #30363d;
}

.markdown-preview {
  background: #0d1117;
  padding: 1.5rem;
  border-radius: 8px;
  max-height: 70vh;
  overflow-y: auto;
}

.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3 {
  margin: 1rem 0;
  color: #58a6ff;
}

.markdown-preview a {
  color: #58a6ff;
}

.markdown-preview code {
  background: #21262d;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.markdown-preview pre {
  background: #21262d;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

.markdown-preview img {
  max-width: 100%;
}
```

### `frontend/src/components/CreditsWidget.css`

```css
.credits-widget {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.credits-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.credits-label {
  font-size: 0.9rem;
  color: #8b949e;
}

.credits-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.credits-bar {
  background: #21262d;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.credits-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.credits-timer {
  font-size: 0.85rem;
  color: #8b949e;
  text-align: center;
}
```

### `frontend/src/components/ProviderBadge.css`

```css
.provider-badge {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
}
```

### `frontend/src/components/ProfileForm.css` (Bonus styling)

```css
.profile-form {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 1.5rem;
}

.profile-form h2 {
  margin-bottom: 1rem;
  color: #58a6ff;
}

.profile-form h3 {
  margin: 1rem 0 0.5rem;
  color: #8b949e;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #c9d1d9;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  color: #c9d1d9;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #58a6ff;
}

.array-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.array-input input {
  flex: 1;
}

.btn-remove {
  background: #ff4444;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
}

.btn-add {
  background: #238636;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.btn-generate {
  width: 100%;
  background: linear-gradient(135deg, #58a6ff, #3b82f6);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: opacity 0.2s;
}

.btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```
