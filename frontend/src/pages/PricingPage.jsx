import { Link } from 'react-router-dom';

function PricingPage() {
  return (
    <div className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Pricing</p>
        <h1 className="page-title">Transparent credits with no hidden billing layers</h1>
        <p className="page-subtitle">
          Start free and generate profiles immediately. Upgrade options can be enabled later without
          changing your existing workflow.
        </p>
      </section>

      <section className="page-section premium-grid-2">
        <article className="pricing-card-premium">
          <p className="plan-label">Free</p>
          <p className="plan-price">$0</p>
          <p className="plan-note">Ideal for individual developers building and testing profile variants.</p>
          <ul className="premium-list">
            <li>30 credits reset daily.</li>
            <li>15 credits per profile generation.</li>
            <li>Live markdown preview and direct export.</li>
            <li>Secure GitHub session login.</li>
          </ul>
          <Link className="button-primary" to="/login">Start Free</Link>
        </article>

        <article className="pricing-card-premium featured">
          <p className="plan-label">Pro (Roadmap)</p>
          <p className="plan-price">$9</p>
          <p className="plan-note">Planned for teams requiring extended generation volume and analytics.</p>
          <ul className="premium-list">
            <li>Higher monthly generation limits.</li>
            <li>Priority generation queue.</li>
            <li>Workspace governance and usage logs.</li>
            <li>Extended support channels.</li>
          </ul>
          <button className="button-secondary" disabled>Coming Soon</button>
        </article>
      </section>

      <section className="page-section premium-grid-2">
        <article className="premium-card">
          <h3>How credits are consumed</h3>
          <p>
            Credits are deducted only when generation succeeds. The dashboard always displays
            the current balance and upcoming reset timestamp.
          </p>
        </article>
        <article className="premium-card">
          <h3>Billing readiness</h3>
          <p>
            The current architecture supports incremental plan rollout without disrupting existing
            user sessions or profile history.
          </p>
        </article>
      </section>
    </div>
  );
}

export default PricingPage;
