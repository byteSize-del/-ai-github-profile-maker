import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <span className="footer-logo-icon">⚡</span>
            <span className="footer-logo-text">ProfileForge</span>
          </div>
          <p className="footer-description">
            AI-powered GitHub profile generator for developers.
          </p>
        </div>

        <div className="footer-section">
          <h4>Product</h4>
          <div className="footer-links">
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/about">About</Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <div className="footer-links">
            <Link to="/contact">Contact Us</Link>
            <a href="https://github.com/your-org/profileforge/issues" target="_blank" rel="noopener noreferrer">
              GitHub Issues
            </a>
            <a href="https://discord.gg/profileforge" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <div className="footer-links">
            <a href="https://twitter.com/profileforge" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://linkedin.com/company/profileforge" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com/your-org/profileforge" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ProfileForge. Made with ❤️ using AI.</p>
        <p className="footer-powered">
          Powered by <span className="highlight">Groq</span> • <span className="highlight">OpenRouter</span> • <span className="highlight">NVIDIA NIM</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
