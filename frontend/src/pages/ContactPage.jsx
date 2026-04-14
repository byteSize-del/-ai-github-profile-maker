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
          <div className="contact-icon">📧</div>
          <h3>Email Support</h3>
          <p>For general inquiries, feedback, or feature requests</p>
          <a href="mailto:support@profileforge.dev" className="contact-link">
            support@profileforge.dev
          </a>
        </div>
        <div className="contact-card">
          <div className="contact-icon">🐛</div>
          <h3>Bug Reports</h3>
          <p>Found a bug? Report it on our GitHub issues page</p>
          <a href="https://github.com/your-org/profileforge/issues" target="_blank" rel="noopener noreferrer" className="contact-link">
            GitHub Issues →
          </a>
        </div>
        <div className="contact-card">
          <div className="contact-icon">💬</div>
          <h3>Community</h3>
          <p>Join our community for discussions, tips, and updates</p>
          <a href="https://discord.gg/profileforge" target="_blank" rel="noopener noreferrer" className="contact-link">
            Discord Server →
          </a>
        </div>
        <div className="contact-card">
          <div className="contact-icon">📱</div>
          <h3>Social Media</h3>
          <p>Follow us for updates, tips, and feature announcements</p>
          <div className="social-links">
            <a href="https://twitter.com/profileforge" target="_blank" rel="noopener noreferrer" className="social-link">
              Twitter
            </a>
            <a href="https://linkedin.com/company/profileforge" target="_blank" rel="noopener noreferrer" className="social-link">
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <h2>Send Us a Message</h2>
        <p className="form-subtitle">We typically respond within 24 hours</p>
        <form className="contact-form">
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
            Send Message →
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
