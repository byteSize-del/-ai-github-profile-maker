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
            <div className="provider-logo">⚡</div>
            <h3>Groq</h3>
            <p>Lightning-fast inference with Llama 3.3 70B for rapid profile generation.</p>
            <div className="provider-badge primary">Primary</div>
          </div>
          <div className="provider-card">
            <div className="provider-logo">🌐</div>
            <h3>OpenRouter</h3>
            <p>Access to free tier Llama 3.3 70B, ensuring reliable generation even during high load.</p>
            <div className="provider-badge secondary">Fallback</div>
          </div>
          <div className="provider-card">
            <div className="provider-logo">🚀</div>
            <h3>NVIDIA NIM</h3>
            <p>Enterprise-grade AI models with consistent quality for dependable results.</p>
            <div className="provider-badge tertiary">Backup</div>
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
            <div className="credit-icon">🎁</div>
            <h3>30 Free Daily Credits</h3>
            <p>Every user gets 30 credits every day, automatically reset at midnight UTC. That's 2 free profile generations daily.</p>
          </div>
          <div className="credit-card">
            <div className="credit-icon">💎</div>
            <h3>15 Credits Per Generation</h3>
            <p>Each profile generation costs 15 credits. Create multiple variations until you find the perfect one.</p>
          </div>
          <div className="credit-card">
            <div className="credit-icon">⏰</div>
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
            <div className="customization-icon">📝</div>
            <div className="customization-content">
              <h3>Personal Information</h3>
              <p>Include your name, GitHub username, role, and a custom bio that reflects your professional identity.</p>
            </div>
          </div>
          <div className="customization-item">
            <div className="customization-icon">🛠️</div>
            <div className="customization-content">
              <h3>Tech Stack Badges</h3>
              <p>Showcase 40+ technologies with beautiful shields.io badges. JavaScript, React, Node.js, Python, Docker, and many more.</p>
            </div>
          </div>
          <div className="customization-item">
            <div className="customization-icon">📊</div>
            <div className="customization-content">
              <h3>GitHub Stats Integration</h3>
              <p>Dynamic stats cards showing your contributions, top languages, and current streak—all automatically pulled from your GitHub account.</p>
            </div>
          </div>
          <div className="customization-item">
            <div className="customization-icon">✨</div>
            <div className="customization-content">
              <h3>Animated Elements</h3>
              <p>Typing SVG animations, visitor counters, and gradient effects that make your profile visually engaging.</p>
            </div>
          </div>
          <div className="customization-item">
            <div className="customization-icon">🚀</div>
            <div className="customization-content">
              <h3>Project Showcase</h3>
              <p>Display your projects in a professional table format with descriptions and tech stack.</p>
            </div>
          </div>
          <div className="customization-item">
            <div className="customization-icon">🔗</div>
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
            Get Started Free →
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
