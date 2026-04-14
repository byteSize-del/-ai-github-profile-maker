function ContactPage() {
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
          <p>support@profileforge.dev</p>
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
        <p className="plan-note">This form is currently a client-side placeholder for the support API.</p>
        <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
          <label>
            Name
            <input type="text" placeholder="Your full name" required />
          </label>
          <label>
            Email
            <input type="email" placeholder="you@example.com" required />
          </label>
          <label>
            Subject
            <select required>
              <option value="">Select reason</option>
              <option value="auth">Authentication support</option>
              <option value="generation">Generation quality</option>
              <option value="billing">Billing and credits</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Message
            <textarea rows="6" placeholder="Describe your request in detail" required />
          </label>
          <button className="button-primary" type="submit">Send Message</button>
        </form>
      </section>
    </div>
  );
}

export default ContactPage;
