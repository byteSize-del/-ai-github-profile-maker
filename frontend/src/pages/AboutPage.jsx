import { Link } from 'react-router-dom';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page">
      {/* Header */}
      <section className="about-header">
        <h1>About ProfileForge</h1>
        <p>Empowering developers to create professional GitHub profiles with AI</p>
      </section>

      {/* What We Provide */}
      <section className="what-we-provide">
        <h2>What We Provide</h2>
        <div className="provide-grid">
          <div className="provide-item">
            <div className="provide-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3>AI-Powered Content Generation</h3>
            <p>Our platform uses advanced AI models from Groq, OpenRouter, and NVIDIA to create compelling, professional GitHub profile READMEs tailored to your skills and experience.</p>
          </div>
          <div className="provide-item">
            <div className="provide-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h3>Beautiful Visual Elements</h3>
            <p>Automatically include animated typing effects, visitor badges, GitHub stats cards, tech stack badges, and streak counters that make your profile stand out.</p>
          </div>
          <div className="provide-item">
            <div className="provide-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3>Simple Guided Experience</h3>
            <p>Our step-by-step wizard collects just the right information without overwhelming you. Answer a few questions, and we'll generate a complete profile.</p>
          </div>
          <div className="provide-item">
            <div className="provide-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
            <h3>Mobile-Optimized Designs</h3>
            <p>Every profile looks great on both desktop and mobile devices, ensuring your profile impresses visitors regardless of how they view it.</p>
          </div>
          <div className="provide-item">
            <div className="provide-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3>Daily Free Credits</h3>
            <p>Get 30 free credits every day, with each generation costing just 15 credits. Create multiple profiles and iterations without any cost.</p>
          </div>
          <div className="provide-item">
            <div className="provide-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h3>Instant Download</h3>
            <p>Copy your generated README directly to clipboard or download it as a ready-to-use README.md file for your GitHub profile repository.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-timeline">
          <div className="timeline-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Fill Out the Wizard</h3>
              <p>Answer a few simple questions about yourself: your name, GitHub username, role, bio, tech stack, and projects. The process takes less than 2 minutes.</p>
            </div>
          </div>
          <div className="timeline-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>AI Generates Your Profile</h3>
              <p>Our AI analyzes your input and creates a professional, engaging README with optimized formatting, visual elements, and personalized content.</p>
            </div>
          </div>
          <div className="timeline-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Preview & Customize</h3>
              <p>Review the generated README in real-time. You can see both the rendered preview and the raw markdown to ensure everything looks perfect.</p>
            </div>
          </div>
          <div className="timeline-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Deploy to GitHub</h3>
              <p>Copy to clipboard or download your README.md. Simply paste it into your GitHub profile repository and watch your profile transform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="our-mission">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            We believe every developer deserves a professional, impressive GitHub presence.
            Too many talented developers have lackluster profiles simply because they don't have
            the time or design skills to create compelling READMEs.
          </p>
          <p>
            ProfileForge bridges that gap by combining AI technology with proven design patterns,
            making it effortless for any developer—from students to senior engineers—to create
            GitHub profiles that truly represent their skills and potential.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Ready to Create Your Profile?</h2>
        <p>Start building your professional GitHub profile today—it's completely free.</p>
        <Link to="/generate" className="btn-about-cta">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          Get Started Free
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;
