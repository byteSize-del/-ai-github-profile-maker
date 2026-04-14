import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">ProfileForge Platform</p>
        <h1 className="page-title">A premium GitHub profile experience for serious developers</h1>
        <p className="page-subtitle">
          Build polished profile READMEs with a guided workflow, secure account sessions,
          and production-ready markdown output.
        </p>
        <div className="cta-row">
          <Link className="button-primary" to={isAuthenticated ? '/dashboard' : '/login'}>
            Open Workspace
          </Link>
          <Link className="button-secondary" to="/features">Explore Features</Link>
        </div>

        <div className="metrics-row">
          <div className="metric-tile">
            <div className="metric-tile-value">30</div>
            <div className="metric-tile-label">Daily free credits</div>
          </div>
          <div className="metric-tile">
            <div className="metric-tile-value">15</div>
            <div className="metric-tile-label">Credits per generation</div>
          </div>
          <div className="metric-tile">
            <div className="metric-tile-value">3</div>
            <div className="metric-tile-label">AI provider failover layers</div>
          </div>
        </div>
      </section>

      <section className="page-section premium-grid-3">
        <article className="premium-card">
          <h3>Structured profile wizard</h3>
          <p>Collect role, stack, projects, and links with field-level validation and guided steps.</p>
        </article>
        <article className="premium-card">
          <h3>Live markdown preview</h3>
          <p>Review rendered output and raw markdown before publishing to your profile repository.</p>
        </article>
        <article className="premium-card">
          <h3>Secure session workflow</h3>
          <p>Authentication uses OAuth state validation and HTTP-only cookie sessions.</p>
        </article>
      </section>
    </div>
  );
};

export default HomePage;
