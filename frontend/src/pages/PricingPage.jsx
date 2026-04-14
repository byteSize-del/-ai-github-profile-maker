import { Link } from 'react-router-dom';
import './PricingPage.css';

function PricingPage() {
  return (
    <div className="pricing-page">
      {/* Header */}
      <section className="pricing-header">
        <h1>Simple, Transparent Pricing</h1>
        <p>Start free, upgrade when you need more. No hidden fees, no surprises.</p>
      </section>

      {/* Pricing Tiers */}
      <section className="pricing-tiers">
        {/* Free Tier */}
        <div className="pricing-card">
          <div className="pricing-tier free">
            <div className="tier-header">
              <h2>Free</h2>
              <div className="tier-price">
                <span className="price">$0</span>
                <span className="period">/forever</span>
              </div>
              <p className="tier-subtitle">Perfect for getting started</p>
            </div>
            <div className="tier-features">
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>30 free credits per day</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>2 profile generations daily (15 credits each)</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>All AI providers (Groq, OpenRouter, NVIDIA)</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Full customization options</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Preview & copy to clipboard</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Download as README.md</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>GitHub stats integration</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Community support</span>
              </div>
            </div>
            <Link to="/generate" className="btn-pricing btn-pricing-primary">
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Pro Tier */}
        <div className="pricing-card featured">
          <div className="popular-badge">Most Popular</div>
          <div className="pricing-tier pro">
            <div className="tier-header">
              <h2>Pro</h2>
              <div className="tier-price">
                <span className="price">$9</span>
                <span className="period">/month</span>
              </div>
              <p className="tier-subtitle">For power users & teams</p>
            </div>
            <div className="tier-features">
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span><strong>Unlimited</strong> profile generations</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Priority AI processing (faster results)</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Premium AI models (GPT-4, Claude)</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Advanced customization themes</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Profile history & versioning</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Custom domains for profile pages</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>API access for automation</span>
              </div>
              <div className="feature">
                <span className="feature-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Priority email support</span>
              </div>
            </div>
            <button className="btn-pricing btn-pricing-secondary" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>What happens when I run out of daily credits?</h3>
            <p>Your credits reset automatically at midnight UTC. You'll receive a fresh 30 credits the next day at no cost.</p>
          </div>
          <div className="faq-item">
            <h3>Can I use the generated README commercially?</h3>
            <p>Absolutely! All generated content is yours to use however you want—personal profiles, client work, or commercial projects.</p>
          </div>
          <div className="faq-item">
            <h3>Is my data secure?</h3>
            <p>We only store anonymous usage data for credit tracking. Your profile information is sent to AI providers securely and is not stored long-term.</p>
          </div>
          <div className="faq-item">
            <h3>When will Pro be available?</h3>
            <p>We're actively developing Pro features. Join our mailing list to be notified when Pro launches with early-bird pricing.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pricing-cta">
        <h2>Ready to Create Your Profile?</h2>
        <p>Start with our free tier—no signup, no credit card required.</p>
        <Link to="/generate" className="btn-pricing-cta">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          Start Creating Free Profiles
        </Link>
      </section>
    </div>
  );
}

export default PricingPage;
