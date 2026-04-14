import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">✨ AI-Powered Profile Generation</div>
          <h1 className="hero-title">
            Create Stunning <span className="highlight">GitHub Profiles</span> in Seconds
          </h1>
          <p className="hero-subtitle">
            Transform your GitHub presence with AI-generated READMEs that showcase your skills, 
            projects, and personality. No markdown expertise required.
          </p>
          <div className="hero-actions">
            <Link to="/generate" className="btn-hero-primary">
              Get Started Free →
            </Link>
            <Link to="/about" className="btn-hero-secondary">
              Learn More
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Profiles Created</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">User Rating</span>
            </div>
            <div className="stat">
              <span className="stat-number">3</span>
              <span className="stat-label">AI Providers</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-dot red"></div>
              <div className="preview-dot yellow"></div>
              <div className="preview-dot green"></div>
            </div>
            <div className="preview-content">
              <div className="preview-line short"></div>
              <div className="preview-line medium"></div>
              <div className="preview-line long"></div>
              <div className="preview-badges">
                <span className="preview-badge">React</span>
                <span className="preview-badge">Node.js</span>
                <span className="preview-badge">TypeScript</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlights */}
      <section className="features-highlights">
        <h2>Why Choose ProfileForge?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Generation</h3>
            <p>Leverage cutting-edge AI models from Groq, OpenRouter, and NVIDIA to create professional profiles.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Generate a complete, stunning GitHub profile in under 30 seconds with our guided wizard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Beautiful Design</h3>
            <p>Professional layouts with animated badges, stats cards, and typing effects that stand out.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Daily Free Credits</h3>
            <p>Get 30 free credits every day. Each profile generation costs only 5 credits.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>Loved by Developers Worldwide</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              "ProfileForge completely transformed my GitHub presence. My profile now looks professional and attracts more visitors!"
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👨‍💻</div>
              <div className="author-info">
                <strong>Alex Chen</strong>
                <span>Full Stack Developer</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              "I spent hours trying to make my README look good. ProfileForge did it in seconds, and it looks better than anything I could create manually."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👩‍🔬</div>
              <div className="author-info">
                <strong>Sarah Miller</strong>
                <span>ML Engineer</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              "The AI understands exactly what recruiters want to see. I've gotten more profile views since using ProfileForge."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">🚀</div>
              <div className="author-info">
                <strong>Raj Patel</strong>
                <span>Software Engineer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your GitHub Profile?</h2>
          <p>Join thousands of developers who've elevated their GitHub presence with AI-powered profiles.</p>
          <Link to="/generate" className="btn-cta">
            Start Creating Now — It's Free ✨
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
