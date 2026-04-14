import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">About</p>
        <h1 className="page-title">Built for professional developer branding</h1>
        <p className="page-subtitle">
          ProfileForge combines validated inputs, multi-provider AI generation, and markdown-first output
          so your profile remains accurate, readable, and easy to maintain.
        </p>
      </section>

      <section className="page-section split-layout">
        <article className="premium-card">
          <h3>Platform principles</h3>
          <ul className="premium-list">
            <li>Predictable structure and secure session handling.</li>
            <li>Generation quality with provider failover.</li>
            <li>Readable markdown that can be reviewed before publishing.</li>
            <li>Credit transparency with daily reset cadence.</li>
          </ul>
        </article>
        <article className="premium-card">
          <h3>How teams use ProfileForge</h3>
          <ul className="premium-list">
            <li>Onboard new developers with profile standards.</li>
            <li>Refresh README narrative before interviews.</li>
            <li>Create portfolio-focused profile variants quickly.</li>
            <li>Keep identity links and stack details consistent.</li>
          </ul>
        </article>
      </section>

      <section className="page-section">
        <div className="cta-row">
          <Link className="button-primary" to="/dashboard">Open Dashboard</Link>
          <Link className="button-secondary" to="/contact">Contact Support</Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
