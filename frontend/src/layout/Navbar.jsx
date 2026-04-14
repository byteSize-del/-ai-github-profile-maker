import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">ProfileForge</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            About
          </Link>
          <Link to="/features" className={`nav-link ${location.pathname === '/features' ? 'active' : ''}`}>
            Features
          </Link>
          <Link to="/pricing" className={`nav-link ${location.pathname === '/pricing' ? 'active' : ''}`}>
            Pricing
          </Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
            Contact
          </Link>
        </div>

        <div className="navbar-actions">
          {isAuthenticated && user ? (
            <div className="user-menu">
              <img 
                src={user.avatar_url} 
                alt={user.login} 
                className="user-avatar"
                title={user.login}
              />
              <span className="user-login">{user.login}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
              <Link to="/generate" className="btn-nav-primary">
                Generate Profile →
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-nav-secondary">
                Sign In
              </Link>
              <Link to="/login" className="btn-nav-primary">
                Get Started Free →
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
