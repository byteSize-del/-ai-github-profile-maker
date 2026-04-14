import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              AI-Powered Profile Generation
            </div>

            <h1 className="hero-title">
              Build a GitHub profile that<br />
              <span className="text-gradient">actually represents your work</span>
            </h1>

            <p className="hero-subtitle">
              Stop wasting hours on markdown formatting. Generate professional, stats-rich GitHub profile READMEs 
              with proper widgets, animations, and clean design in under 30 seconds.
            </p>

            <div className="hero-actions">
              <Link to="/generate" className="btn-primary">
                Start Building
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/features" className="btn-secondary">
                See Features
              </Link>
            </div>

            <div className="hero-social-proof">
              <div className="avatar-stack">
                <div className="avatar">A</div>
                <div className="avatar">B</div>
                <div className="avatar">C</div>
                <div className="avatar">D</div>
              </div>
              <p>Trusted by developers worldwide</p>
            </div>
          </div>

          <div className="hero-preview">
            <div className="preview-window">
              <div className="preview-titlebar">
                <div className="preview-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="preview-title">README.md</span>
              </div>
              <div className="preview-content">
                <div className="preview-header">
                  <div className="preview-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <div className="preview-name">developer</div>
                    <div className="preview-role">Full Stack Engineer</div>
                  </div>
                </div>

                <div className="preview-badges">
                  <span className="badge">JavaScript</span>
                  <span className="badge">React</span>
                  <span className="badge">Node.js</span>
                  <span className="badge">TypeScript</span>
                </div>

                <div className="preview-stats-row">
                  <div className="preview-stat-card">
                    <div className="stat-value">342</div>
                    <div className="stat-label">Contributions</div>
                  </div>
                  <div className="preview-stat-card">
                    <div className="stat-value">1.2k</div>
                    <div className="stat-label">Stars</div>
                  </div>
                </div>

                <div className="preview-line"></div>
                <div className="preview-line short"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Everything you need</h2>
            <p className="section-subtitle">
              Generate a complete GitHub profile with stats, widgets, and professional design
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3>AI-Generated Content</h3>
              <p>Professional bios, project descriptions, and achievements written for you</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <h3>Live Preview</h3>
              <p>See your profile rendered in real-time before you commit</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3>GitHub Stats</h3>
              <p>Automatic integration with your contributions, streaks, and languages</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3>Trophies & Badges</h3>
              <p>Showcase your GitHub achievements and milestones</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3>Widgets</h3>
              <p>Add memes, quotes, visitor counters, and donation links</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </div>
              <h3>One-Click Export</h3>
              <p>Copy markdown or download your README ready to commit</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to build?</h2>
          <p className="cta-subtitle">
            Generate your GitHub profile README in under a minute
          </p>
          <Link to="/generate" className="btn-cta">
            Get Started
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
