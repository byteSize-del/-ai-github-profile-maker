import './ProviderBadge.css';

const PROVIDER_CONFIG = {
  groq: { label: 'Groq' },
  openrouter: { label: 'OpenRouter' },
  nvidia: { label: 'NVIDIA' },
};

function ProviderBadge({ provider }) {
  if (!provider) return null;
  const config = PROVIDER_CONFIG[provider] || { label: provider };

  return (
    <span className="provider-badge">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      {config.label}
    </span>
  );
}

export default ProviderBadge;
