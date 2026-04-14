import './ProviderBadge.css';

const PROVIDER_CONFIG = {
  groq: { color: '#f59e0b', label: 'Groq' },
  openrouter: { color: '#3b82f6', label: 'OpenRouter' },
  nvidia: { color: '#76b900', label: 'NVIDIA' },
};

function ProviderBadge({ provider }) {
  if (!provider) return null;
  const config = PROVIDER_CONFIG[provider] || { color: '#6b7280', label: provider };

  return (
    <span
      className="provider-badge"
      style={{
        background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
        boxShadow: `0 2px 10px ${config.color}40`
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      {config.label}
    </span>
  );
}

export default ProviderBadge;
