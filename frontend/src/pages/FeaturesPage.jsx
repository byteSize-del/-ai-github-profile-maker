import { Link } from 'react-router-dom';

function FeaturesPage() {
  return (
    <div className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Features</p>
        <h1 className="page-title">A connected workflow from login to published profile</h1>
        <p className="page-subtitle">
          ProfileForge is designed as one coherent flow: authenticate, manage credits, generate,
          preview, and export.
        </p>
      </section>

      <section className="page-section premium-grid-3">
        <article className="premium-card">
          <h3>Secure authentication</h3>
          <p>OAuth state verification, HTTP-only session cookies, and protected routes.</p>
        </article>
        <article className="premium-card">
          <h3>Credit management</h3>
          <p>Daily credit refresh with immediate feedback and generation cost transparency.</p>
        </article>
        <article className="premium-card">
          <h3>Provider fallback</h3>
          <p>Automatic model routing across Groq, OpenRouter, and NVIDIA pipelines.</p>
        </article>
      </section>

      <section className="page-section split-layout">
        <article className="premium-card">
          <h3>Generation capabilities</h3>
          <ul className="premium-list">
            <li>Guided profile wizard with field-level validation.</li>
            <li>Template modes for professional and minimal styles.</li>
            <li>Tech stack and project context injection.</li>
            <li>Safe markdown rendering and downloadable output.</li>
          </ul>
        </article>
        <article className="premium-card">
          <h3>Platform controls</h3>
          <ul className="premium-list">
            <li>Dashboard with account and connection status.</li>
            <li>Session-aware navigation with login/logout actions.</li>
            <li>Auth middleware enforced on protected API routes.</li>
            <li>Consistent monochrome theme across all pages.</li>
          </ul>
        </article>
      </section>

      <section className="page-section">
        <div className="cta-row">
          <Link className="button-primary" to="/dashboard">Open Dashboard</Link>
          <Link className="button-secondary" to="/pricing">Review Plans</Link>
        </div>
      </section>
    </div>
  );
}

export default FeaturesPage;
