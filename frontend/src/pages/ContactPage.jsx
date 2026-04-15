import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const CONTACT_API_URL = import.meta.env.DEV ? `${API_URL}/api/contact` : '/api/contact';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitSuccess('Message sent. Our team will respond within one business day.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setSubmitError(err.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Contact</p>
        <h1 className="page-title">Support channels for product and account requests</h1>
        <p className="page-subtitle">
          Reach the team for authentication issues, profile generation quality concerns,
          or platform feedback.
        </p>
      </section>

      <section className="page-section premium-grid-3">
        <article className="premium-card">
          <h3>Email</h3>
          <p>sahil.dev.me@gmail.com</p>
        </article>
        <article className="premium-card">
          <h3>Issue tracking</h3>
          <p>GitHub repository issue queue.</p>
        </article>
        <article className="premium-card">
          <h3>Response target</h3>
          <p>Business day response within 24 hours.</p>
        </article>
      </section>

      <section className="page-section contact-form-card">
        <h3>Message form</h3>
        <p className="plan-note">Send your support request and it will be saved to our support queue.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Subject
            <select name="subject" value={formData.subject} onChange={handleChange} required>
              <option value="">Select reason</option>
              <option value="Authentication support">Authentication support</option>
              <option value="Generation quality">Generation quality</option>
              <option value="Billing and credits">Billing and credits</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Message
            <textarea
              rows="6"
              name="message"
              placeholder="Describe your request in detail"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </label>
          {submitSuccess && <p className="form-status form-status-success">{submitSuccess}</p>}
          {submitError && <p className="form-status form-status-error">{submitError}</p>}
          <button className="button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default ContactPage;
