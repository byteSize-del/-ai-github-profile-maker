import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="not-found">
      <p className="eyebrow">404</p>
      <h1 className="page-title">Page Not Found</h1>
      <p className="page-subtitle">
        The requested page does not exist or the route is no longer available.
      </p>
      <div className="cta-row" style={{ justifyContent: 'center' }}>
        <Link className="button-primary" to="/">Return Home</Link>
        <Link className="button-secondary" to="/dashboard">Open Dashboard</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
