import './ContactPage.css';

function ContactPage() {
  return (
    <div className="contact-page">
      {/* Header */}
      <section className="contact-header">
        <h1>Get in Touch</h1>
        <p>Have questions, feedback, or need support? We're here to help.</p>
      </section>

      {/* Contact Methods */}
      <section className="contact-methods">
        <div className="contact-card">
          <div className="contact-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h3>Email Support</h3>
          <p>For general inquiries, feedback, or feature requests</p>
          <a href="mailto:support@profileforge.dev" className="contact-link">
            support@profileforge.dev
          </a>
        </div>
        <div className="contact-card">
          <div className="contact-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </div>
          <h3>Bug Reports</h3>
          <p>Found a bug? Report it on our GitHub issues page</p>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="contact-link">
            GitHub Issues
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
        <div className="contact-card">
          <div className="contact-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3>Community</h3>
          <p>Join our community for discussions, tips, and updates</p>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="contact-link">
            Discord Server
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
        <div className="contact-card">
          <div className="contact-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </div>
          <h3>Social Media</h3>
          <p>Follow us for updates, tips, and feature announcements</p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <h2>Send Us a Message</h2>
        <p className="form-subtitle">We typically respond within 24 hours</p>
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select id="subject" required>
              <option value="">Select a topic</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="feature">Feature Request</option>
              <option value="bug">Bug Report</option>
              <option value="billing">Billing Question</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="How can we help you?"
              rows="6"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn-submit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send Message
          </button>
        </form>
      </section>

      {/* FAQ */}
      <section className="contact-faq">
        <h2>Quick Answers</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h3>How do I get more credits?</h3>
            <p>You receive 30 free credits every day at midnight UTC. If you need unlimited credits, consider our Pro plan (coming soon).</p>
          </div>
          <div className="faq-item">
            <h3>Can I use ProfileForge for commercial projects?</h3>
            <p>Yes! All generated content is yours to use for any purpose—personal, client work, or commercial projects.</p>
          </div>
          <div className="faq-item">
            <h3>My profile didn't generate correctly. What should I do?</h3>
            <p>Try regenerating with slightly different input. If the issue persists, report it via GitHub Issues with details about what you entered.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
