import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ProviderBadge from './ProviderBadge';
import './ReadmePreview.css';

function ReadmePreview({ markdown, provider }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="preview-card">
      <div className="preview-header">
        <div className="preview-title">
          <span className="preview-icon">📄</span>
          <h3>Generated README</h3>
        </div>
        <div className="preview-actions">
          {provider && <ProviderBadge provider={provider} />}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="preview-tabs">
        <button
          className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          👁️ Preview
        </button>
        <button
          className={`tab-btn ${activeTab === 'raw' ? 'active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          📝 Raw Markdown
        </button>
      </div>

      {/* Content */}
      <div className="preview-content">
        {activeTab === 'preview' ? (
          <div className="markdown-preview">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        ) : (
          <pre className="raw-markdown">{markdown}</pre>
        )}
      </div>

      {/* Action Buttons */}
      <div className="preview-footer">
        <button onClick={handleCopy} className="btn-preview">
          {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
        </button>
        <button onClick={handleDownload} className="btn-preview btn-download">
          ⬇️ Download README.md
        </button>
      </div>
    </div>
  );
}

export default ReadmePreview;
