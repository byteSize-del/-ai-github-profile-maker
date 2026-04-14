import { Link } from 'react-router-dom';
import './FeaturesPage.css';

function FeaturesPage() {
  return (
    <div className="features-page">
      {/* Header */}
      <section className="features-header">
        <h1>Features</h1>
        <p>Everything you need to create a stunning GitHub profile</p>
      </section>

      {/* AI Providers */}
      <section className="ai-providers-section">
        <h2>Powered by Leading AI Providers</h2>
        <p className="section-subtitle">
          We integrate with multiple AI providers to ensure reliable, high-quality content generation with automatic fallback.
        </p>
        <div className="providers-grid">
          <div className="provider-card">
            <div className="provider-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3>Groq</h3>
            <p>Lightning-fast inference with Llama 3.3 70B for rapid profile generation.</p>
            <span className="provider-badge primary">Primary</span>
          </div>
          <div className="provider-card">
            <div className="provider-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3>OpenRouter</h3>
            <p>Access to free tier Llama 3.3 70B, ensuring reliable generation even during high load.</p>
            <span className="provider-badge secondary">Fallback</span>
          </div>
          <div className="provider-card">
            <div className="provider-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3>NVIDIA NIM</h3>
            <p>Enterprise-grade AI models with consistent quality for dependable results.</p>
            <span className="provider-badge tertiary">Backup</span>
          </div>
        </div>
      </section>

      {/* Credit System */}
      <section className="credit-system">
        <h2>Transparent Credit System</h2>
        <p className="section-subtitle">
          Fair, simple pricing with daily free credits. No hidden fees, no subscriptions required.
        </p>
        <div className="credit-details">
          <div className="credit-card">
            <div className="credit-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <h3>30 Free Daily Credits</h3>
            <p>Every user gets 30 credits every day, automatically reset at midnight UTC. That's 2 free profile generations daily.</p>
          </div>
          <div className="credit-card">
            <div className="credit-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3>15 Credits Per Generation</h3>
            <p>Each profile generation costs 15 credits. Create multiple variations until you find the perfect one.</p>
          </div>
          <div className="credit-card">
            <div className="credit-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3>Automatic Reset</h3>
            <p>Credits refresh daily at midnight UTC. Never worry about running out—your free credits return every day.</p>
          </div>
        </div>
      </section>

      {/* Customization */}
      <section className="customization-section">
        <h2>Deep Customization Options</h2>
        <p className="section-subtitle">
          Every profile is tailored to your unique skills, experience, and personality.
        </p>
        <div className="customization-features">
          <div className="customization-item">
            <div className="customization-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="customization-content">
              <h3>Personal Information</h3>
              <p>Include your name, GitHub username, role, and a custom bio that reflects your professional identity.</p>
            </div>
          </div>
          <div className="customization-item">
            <div className="customization-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <div className="customization-content">
              <h3>Tech Stack Badges</h3>
              <p>Showcase 40+ technologies with beautiful shields.io badges. JavaScript, React, Node.js, Python, Docker, and many more.</p>
            </div>
          </div>
          <div className="customization-item">
            <div className="customization-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
            </div>
            <div className="customization-content">
              <h3>GitHub Stats Integration</h3>
              <p>Dynamic stats cards showing your contributions, top languages, and current streak—all automatically pulled from your GitHub account.</p>
            </div>
          </div>
          <div className="customization-item">
            <div className="customization-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="customization-content">
              <h3>Animated Elements</h3>
              <p>Typing SVG animations, visitor counters, and gradient effects that make your profile visually engaging.</p>
            </div>
          </div>
          <div className="customization-item">
            <div className="customization-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="customization-content">
              <h3>Project Showcase</h3>
              <p>Display your projects in a professional table format with descriptions and tech stack.</p>
            </div>
          </div>
          <div className="customization-item">
            <div className="customization-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div className="customization-content">
              <h3>Social Links</h3>
              <p>Connect your Twitter, LinkedIn, portfolio, and email to make networking effortless.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="features-cta">
        <h2>Ready to Experience These Features?</h2>
        <p>Create your professional GitHub profile today with all these powerful features.</p>
        <div className="features-cta-actions">
          <Link to="/generate" className="btn-features-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Get Started Free
          </Link>
          <Link to="/pricing" className="btn-features-secondary">
            View Pricing
          </Link>
        </div>
      </section>
    </div>
  );
}

export default FeaturesPage;
