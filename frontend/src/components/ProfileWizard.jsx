import { useState } from 'react';
import { z } from 'zod';
import './ProfileWizard.css';

// SECURITY: Input validation schemas to prevent injection attacks
const fieldSchemas = {
  name: z.string().trim().min(1, 'Name required').max(100, 'Name too long').regex(/^[a-zA-Z0-9\s\-'.]+$/, 'Invalid characters in name'),
  githubUsername: z.string().min(1, 'Username required').max(39, 'Username too long').regex(/^[a-zA-Z0-9-]+$/, 'Invalid GitHub username format'),
  role: z.string().trim().min(1, 'Role required').max(100, 'Role too long').regex(/^[a-zA-Z0-9\s\-&,.]+$/, 'Invalid characters in role'),
  bio: z.string().trim().min(1, 'Bio required').max(500, 'Bio too long (max 500 chars)'),
};

const PROFILE_STYLES = [
  { id: 'professional', label: 'Professional', icon: 'P', description: 'Clean, corporate-ready profile for hiring and portfolio review' },
  { id: 'job-ready', label: 'Job-Ready', icon: 'J', description: 'Interview-oriented profile with clear results and measurable outcomes' },
  { id: 'casual', label: 'Community', icon: 'C', description: 'Approachable profile with balanced tone and practical project context' },
  { id: 'minimal', label: 'Minimal', icon: 'M', description: 'Editorial layout with concise sections and restrained visual density' },
];

const STEPS = [
  { id: 'profileStyle', label: 'Choose your profile style', type: 'style-selector', required: true },
  { id: 'name', label: "What's your name?", type: 'text', placeholder: 'e.g., John Doe', required: true },
  { id: 'githubUsername', label: "What's your GitHub username?", type: 'text', placeholder: 'e.g., john-doe', required: true },
  { id: 'role', label: "What's your role or title?", type: 'text', placeholder: 'e.g., Full Stack Developer', required: true },
  { id: 'bio', label: 'Tell us about yourself', type: 'textarea', placeholder: 'A short bio... (2-3 sentences)', required: true, hasAutofill: true },
  { id: 'techStack', label: 'What technologies do you use?', type: 'tags', placeholder: 'Type and press Enter', defaultValues: ['JavaScript', 'React', 'Node.js'] },
  { id: 'projects', label: 'What projects are you working on?', type: 'tags', placeholder: 'Type and press Enter', defaultValues: ['Project Alpha', 'Open Source App'] },
  { id: 'socials', label: 'Add your social links (optional)', type: 'socials' },
  { id: 'widgets', label: 'Add optional widgets to your profile', type: 'widgets' },
  { id: 'donations', label: 'Add donation links (optional)', type: 'donations' },
];

function ProfileWizard({ onSubmit, loading, wizardComplete, onReset }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    profileStyle: 'professional',
    name: '',
    githubUsername: '',
    role: '',
    bio: '',
    techStack: ['JavaScript', 'React', 'Node.js'],
    projects: ['Project Alpha', 'Open Source App'],
    socials: { twitter: '', linkedin: '', portfolio: '', email: '' },
    widgets: { trophies: true, memes: false, quotes: true },
    donations: { github: '', patreon: '', buymeacoffee: '', paypal: '' },
  });
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState(STEPS[0].defaultValues || []);
  const [socialInputs, setSocialInputs] = useState({});
  const [widgetSelections, setWidgetSelections] = useState({ trophies: true, memes: false, quotes: true });
  const [donationLinks, setDonationLinks] = useState({});
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [showAutofillSuggestions, setShowAutofillSuggestions] = useState(false);
  const [fieldError, setFieldError] = useState(''); // SECURITY: Track validation errors

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    const stepId = step.id;
    let newData = { ...formData };
    setFieldError(''); // Clear previous errors

    // SECURITY: Validate text inputs before updating state
    if (stepId === 'name' || stepId === 'githubUsername' || stepId === 'role' || stepId === 'bio') {
      try {
        fieldSchemas[stepId].parse(inputValue);
        newData[stepId] = inputValue.trim();
      } catch (error) {
        setFieldError(error.errors[0]?.message || 'Invalid input');
        return; // Don't proceed if validation fails
      }
    } else if (stepId !== 'profileStyle') {
      if (stepId === 'techStack') {
        newData.techStack = tags.length > 0 ? tags : ['JavaScript'];
      } else if (stepId === 'projects') {
        newData.projects = tags.length > 0 ? tags : ['My Project'];
      } else if (stepId === 'socials') {
        newData.socials = socialInputs;
      } else if (stepId === 'widgets') {
        newData.widgets = widgetSelections;
      } else if (stepId === 'donations') {
        newData.donations = donationLinks;
      }
    }

    setFormData(newData);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      const nextStep = STEPS[currentStep + 1];

      if (nextStep.id === 'name' || nextStep.id === 'githubUsername' || nextStep.id === 'role' || nextStep.id === 'bio') {
        setInputValue(formData[nextStep.id] || '');
      } else if (nextStep.id === 'techStack') {
        setTags(formData.techStack);
        setInputValue('');
      } else if (nextStep.id === 'projects') {
        setTags(formData.projects);
        setInputValue('');
      } else if (nextStep.id === 'socials') {
        setSocialInputs(formData.socials);
      } else if (nextStep.id === 'widgets') {
        setWidgetSelections(formData.widgets);
      } else if (nextStep.id === 'donations') {
        setDonationLinks(formData.donations);
      }
    }
  };

  const handleAutofillBio = async () => {
    if (!formData.name || !formData.role) return;

    setAutofillLoading(true);

    // Specific, achievement-oriented bio templates (avoiding generic phrases)
    const suggestions = [
      `${formData.role} who ships production-ready systems. Recently built scalable applications handling real-time data and 10k+ users. Focused on performance optimization and clean architecture.`,
      `Building ${formData.techStack.slice(0, 2).join(' and ')} solutions that solve real problems. Led development of features impacting thousands of users. Obsessed with code quality and user experience.`,
      `${formData.role} specializing in ${formData.techStack[0] || 'modern web technologies'}. Transformed complex requirements into elegant, maintainable systems. Strong advocate for testing and documentation.`,
      `Turning ideas into products as a ${formData.role}. Shipped features to production that improved user engagement and system reliability. Believe in data-driven decisions and iterative improvement.`,
      `${formData.role} with focus on ${formData.projects[0] || 'innovative projects'}. Built systems from concept to production, owned architecture, implementation, and deployment end-to-end.`,
    ];

    await new Promise(resolve => setTimeout(resolve, 500));

    setInputValue(suggestions[Math.floor(Math.random() * suggestions.length)]);
    setAutofillLoading(false);
    setShowAutofillSuggestions(true);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const prevStep = STEPS[currentStep - 1];

      if (prevStep.id === 'name' || prevStep.id === 'githubUsername' || prevStep.id === 'role' || prevStep.id === 'bio') {
        setInputValue(formData[prevStep.id] || '');
      } else if (prevStep.id === 'techStack') {
        setTags(formData.techStack);
        setInputValue('');
      } else if (prevStep.id === 'projects') {
        setTags(formData.projects);
        setInputValue('');
      } else if (prevStep.id === 'socials') {
        setSocialInputs(formData.socials);
      } else if (prevStep.id === 'widgets') {
        setWidgetSelections(formData.widgets);
      } else if (prevStep.id === 'donations') {
        setDonationLinks(formData.donations);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (step.type === 'text' || step.type === 'textarea')) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSocialChange = (platform, value) => {
    setSocialInputs({ ...socialInputs, [platform]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = { ...formData, socials: socialInputs, widgets: widgetSelections, donations: donationLinks };
    setFormData(newData);
    onSubmit(newData);
  };

  if (wizardComplete) {
    return (
      <div className="wizard-card">
        <div className="wizard-complete">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>Profile Generated!</h2>
          <p>Your GitHub profile README has been created. Check the preview panel on the right.</p>
          <button className="btn-reset" onClick={onReset}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Create Another Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-card">
      {/* Progress Bar */}
      <div className="wizard-progress">
        <div className="wizard-progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="wizard-step-indicator">
        Step {currentStep + 1} of {STEPS.length}
      </div>

      {/* Step Dots */}
      <div className="wizard-dots">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`wizard-dot ${i <= currentStep ? 'active' : ''} ${i === currentStep ? 'current' : ''}`}
          />
        ))}
      </div>

      {/* Question */}
      <form onSubmit={currentStep === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
        <h2 className="wizard-question">{step.label}</h2>

        {/* Profile Style Selector */}
        {step.type === 'style-selector' && (
          <div className="style-selector">
            <p className="style-hint">This determines the tone, structure, and content of your profile README</p>
            <div className="style-grid">
              {PROFILE_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className={`style-card ${formData.profileStyle === style.id ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, profileStyle: style.id })}
                >
                  <div className="style-icon">{style.icon}</div>
                  <h3>{style.label}</h3>
                  <p>{style.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Input */}
        {step.type === 'text' && (
          <div>
            <input
              type="text"
              className={`wizard-input ${fieldError ? 'input-error' : ''}`}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setFieldError(''); // Clear error on user input
              }}
              onKeyDown={handleKeyPress}
              placeholder={step.placeholder}
              autoFocus
              required={step.required}
            />
            {fieldError && <p className="error-message">{fieldError}</p>}
            {step.id === 'githubUsername' && (
              <p className="input-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                Use your exact GitHub username (case-sensitive). This is used for your profile stats.
              </p>
            )}
          </div>
        )}

        {/* Textarea with Autofill */}
        {step.type === 'textarea' && (
          <div className="textarea-container">
            <div className="textarea-header">
              <button
                type="button"
                className="btn-autofill"
                onClick={handleAutofillBio}
                disabled={autofillLoading || !formData.name || !formData.role}
              >
                {autofillLoading ? (
                  <>
                    <span className="spinner"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    Auto-fill Bio
                  </>
                )}
              </button>
              {(!formData.name || !formData.role) && (
                <p className="autofill-hint">Complete name and role steps first to enable auto-fill</p>
              )}
            </div>
            <textarea
              className={`wizard-input wizard-textarea ${fieldError ? 'input-error' : ''}`}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowAutofillSuggestions(false);
                setFieldError(''); // Clear error on user input
              }}
              onKeyDown={handleKeyPress}
              placeholder={step.placeholder}
              autoFocus
              required={step.required}
              rows={4}
            />
            {fieldError && <p className="error-message">{fieldError}</p>}
            {showAutofillSuggestions && (
              <div className="autofill-suggestions">
                <p className="suggestions-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                  More suggestions:
                </p>
                <div className="suggestions-list">
                  {[
                    `${formData.role} focused on building reliable systems that users depend on.`,
                    `Shipping ${formData.techStack[0] || 'web'} applications with emphasis on performance and maintainability.`,
                    `Building products that solve real problems as a ${formData.role}.`
                  ].filter(s => s !== inputValue).slice(0, 3).map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      className="suggestion-btn"
                      onClick={() => setInputValue(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tags Input */}
        {step.type === 'tags' && (
          <div className="wizard-tags">
            <div className="tags-list">
              {tags.map((tag, i) => (
                <span key={i} className="tag">
                  {tag}
                  <button type="button" className="tag-remove" onClick={() => handleTagRemove(tag)}>×</button>
                </span>
              ))}
            </div>
            <input
              type="text"
              className="wizard-input tag-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleTagAdd}
              placeholder={step.placeholder}
              autoFocus
            />
            <p className="tag-hint">Press Enter to add</p>
          </div>
        )}

        {/* Social Links */}
        {step.type === 'socials' && (
          <div className="wizard-socials">
            {[
              { key: 'twitter', label: 'Twitter / X', icon: 'TW' },
              { key: 'linkedin', label: 'LinkedIn', icon: 'IN' },
              { key: 'portfolio', label: 'Portfolio', icon: 'WEB' },
              { key: 'email', label: 'Email', icon: 'MAIL' },
            ].map(({ key, label, icon }) => (
              <div key={key} className="social-input">
                <span className="social-icon">{icon}</span>
                <input
                  type={key === 'email' ? 'email' : 'url'}
                  placeholder={`${label} URL`}
                  value={socialInputs[key] || ''}
                  onChange={(e) => handleSocialChange(key, e.target.value)}
                />
              </div>
            ))}
            <p className="social-hint">You can skip this step if you prefer</p>
          </div>
        )}

        {/* Widgets Selection */}
        {step.type === 'widgets' && (
          <div className="wizard-widgets">
            <p className="widgets-hint">Add interactive elements to make your profile stand out</p>
            
            <label className="widget-option">
              <input
                type="checkbox"
                checked={widgetSelections.trophies}
                onChange={(e) => setWidgetSelections({ ...widgetSelections, trophies: e.target.checked })}
              />
              <div className="widget-info">
                <span className="widget-icon">TR</span>
                <div>
                  <strong>GitHub Trophies</strong>
                  <p>Showcase your GitHub achievements and badges</p>
                </div>
              </div>
            </label>

            <label className="widget-option">
              <input
                type="checkbox"
                checked={widgetSelections.memes}
                onChange={(e) => setWidgetSelections({ ...widgetSelections, memes: e.target.checked })}
              />
              <div className="widget-info">
                <span className="widget-icon">RM</span>
                <div>
                  <strong>Random Memes</strong>
                  <p>Add fun programming memes that refresh daily</p>
                </div>
              </div>
            </label>

            <label className="widget-option">
              <input
                type="checkbox"
                checked={widgetSelections.quotes}
                onChange={(e) => setWidgetSelections({ ...widgetSelections, quotes: e.target.checked })}
              />
              <div className="widget-info">
                <span className="widget-icon">QT</span>
                <div>
                  <strong>Inspirational Quotes</strong>
                  <p>Display rotating tech and programming quotes</p>
                </div>
              </div>
            </label>
          </div>
        )}

        {/* Donation Links */}
        {step.type === 'donations' && (
          <div className="wizard-donations">
            <p className="donations-hint">Let people support you through donations (optional)</p>
            {[
              { key: 'github', label: 'GitHub Sponsors', icon: 'GH' },
              { key: 'patreon', label: 'Patreon', icon: 'PT' },
              { key: 'buymeacoffee', label: 'Buy Me a Coffee', icon: 'BC' },
              { key: 'paypal', label: 'PayPal', icon: 'PP' },
            ].map(({ key, label, icon }) => (
              <div key={key} className="donation-input">
                <span className="donation-icon">{icon}</span>
                <input
                  type="url"
                  placeholder={`${label} URL`}
                  value={donationLinks[key] || ''}
                  onChange={(e) => setDonationLinks({ ...donationLinks, [key]: e.target.value })}
                />
              </div>
            ))}
            <p className="donations-hint">You can skip this step if you prefer</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="wizard-buttons">
          {currentStep > 0 && (
            <button type="button" className="btn-back" onClick={handleBack}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          {step.type === 'style-selector' ? (
            <button type="button" className="btn-next" onClick={handleNext}>
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ) : currentStep < STEPS.length - 1 ? (
            <button type="submit" className="btn-next" disabled={!inputValue.trim() && step.type !== 'tags' && step.type !== 'socials' && step.type !== 'widgets' && step.type !== 'donations'}>
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button type="submit" className="btn-generate" disabled={loading}>
              {loading ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Generating...
                </span>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  Generate Profile
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProfileWizard;
