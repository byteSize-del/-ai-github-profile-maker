import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import logoMark from '../assets/profileforge-logo.svg';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">
            <img src={logoMark} alt="ProfileForge logo" className="logo-image" />
          </span>
          <span className="logo-text">Profile<span>Forge</span></span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              Dashboard
            </Link>
          )}
          <Link to="/features" className={`nav-link ${isActive('/features') ? 'active' : ''}`}>
            Features
          </Link>
          <Link to="/pricing" className={`nav-link ${isActive('/pricing') ? 'active' : ''}`}>
            Pricing
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            About
          </Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
            Contact
          </Link>
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="user-login">{user?.github_username ? `@${user.github_username}` : 'Account'}</span>
              <button type="button" className="btn-nav-secondary" onClick={handleLogout}>
                Logout
              </button>
              <Link to="/generate" className="btn-nav-primary">
                Generate
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav-secondary">
                Sign In
              </Link>
              <Link to="/login" className="btn-nav-primary">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu open">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              Dashboard
            </Link>
          )}
          <Link to="/features" className={`nav-link ${isActive('/features') ? 'active' : ''}`}>
            Features
          </Link>
          <Link to="/pricing" className={`nav-link ${isActive('/pricing') ? 'active' : ''}`}>
            Pricing
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            About
          </Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
            Contact
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/generate" className="btn-nav-primary">Generate</Link>
              <button type="button" className="btn-nav-secondary mobile-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-nav-primary">Get Started</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
