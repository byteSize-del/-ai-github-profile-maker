import './ProviderBadge.css';

const PROVIDER_COLORS = {
  groq: '#f59e0b',
  openrouter: '#3b82f6',
  nvidia: '#76b900',
};

function ProviderBadge({ provider }) {
  if (!provider) return null;
  const color = PROVIDER_COLORS[provider] || '#6b7280';

  return (
    <span className="provider-badge" style={{ 
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      boxShadow: `0 2px 10px ${color}40`
    }}>
      ⚡ {provider}
    </span>
  );
}

export default ProviderBadge;
