import { useState, useEffect } from 'react';
import './CreditsWidget.css';

const DAILY_CREDITS = 30;
const CREDITS_PER_USE = 15;

function CreditsWidget({ credits, resetAt }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!resetAt) return;

    const updateTimer = () => {
      const now = new Date();
      const reset = new Date(resetAt);
      const diff = reset - now;

      if (diff <= 0) {
        setTimeLeft('Resetting...');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [resetAt]);

  if (credits === null) return null;

  const percentage = (credits / DAILY_CREDITS) * 100;
  const generationsLeft = Math.floor(credits / CREDITS_PER_USE);
  const level = percentage > 50 ? 'high' : percentage > 25 ? 'medium' : 'low';

  return (
    <div className="credits-widget">
      <div className="credits-header">
        <div className="credits-left">
          <div className="credits-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <span className="credits-label">Credits Remaining</span>
        </div>
        <span className="credits-value">
          {credits} / {DAILY_CREDITS}
        </span>
      </div>
      <div className="credits-bar">
        <div
          className={`credits-fill ${level}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="credits-footer">
        <span className="credits-info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          {CREDITS_PER_USE} credits per generation • {generationsLeft} profiles left
        </span>
        <span className="credits-timer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {timeLeft}
        </span>
      </div>
    </div>
  );
}

export default CreditsWidget;
