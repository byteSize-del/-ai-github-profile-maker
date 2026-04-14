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
  const color = percentage > 50 ? '#4ade80' : percentage > 25 ? '#fbbf24' : '#f87171';

  return (
    <div className="credits-widget">
      <div className="credits-header">
        <div className="credits-left">
          <span className="credits-icon">💎</span>
          <span className="credits-label">Credits Remaining</span>
        </div>
        <span className="credits-value" style={{ color }}>
          {credits} / {DAILY_CREDITS}
        </span>
      </div>
      <div className="credits-bar">
        <div
          className="credits-fill"
          style={{ width: `${percentage}%`, background: `linear-gradient(90deg, ${color}, ${color}dd)` }}
        />
      </div>
      <div className="credits-footer">
        <span className="credits-info-text">
          ⚡ {CREDITS_PER_USE} credits per generation • {generationsLeft} profiles left today
        </span>
        <span className="credits-timer">
          ⏰ {timeLeft}
        </span>
      </div>
    </div>
  );
}

export default CreditsWidget;
