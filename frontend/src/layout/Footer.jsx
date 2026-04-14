import { Link } from 'react-router-dom';
import logoMark from '../assets/profileforge-logo.svg';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logoMark} alt="ProfileForge logo" className="footer-logo-image" />
            <span className="footer-logo-text">ProfileForge</span>
          </div>
          <p className="footer-description">
            Premium GitHub profile platform for professional developers and teams.
          </p>
        </div>

        <div className="footer-section">
          <h4>Product</h4>
          <div className="footer-links">
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <div className="footer-links">
            <Link to="/features">Documentation</Link>
            <Link to="/contact">Support</Link>
            <Link to="/about">Company Info</Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          2026 ProfileForge. All rights reserved.
        </p>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
