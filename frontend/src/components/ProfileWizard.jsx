import { useState } from 'react';
import './ProfileWizard.css';

const PROFILE_STYLES = [
  { id: 'professional', label: 'Professional', icon: '💼', description: 'Clean, corporate-ready profile perfect for job hunting and recruiters' },
  { id: 'job-ready', label: 'Job-Ready', icon: '🎯', description: 'Interview-optimized with metrics, achievements, and clear availability status' },
  { id: 'casual', label: 'Casual & Fun', icon: '🎮', description: 'Friendly, personality-driven profile that builds genuine community connections' },
  { id: 'minimal', label: 'Minimal', icon: '✨', description: 'Clean, elegant design that lets your code and projects speak for themselves' },
];

const STEPS = [
  { id: 'profileStyle', label: 'Choose your profile style', type: 'style-selector', required: true },
  { id: 'name', label: 'What\'s your name?', type: 'text', placeholder: 'e.g., John Doe', required: true },
  { id: 'githubUsername', label: 'What\'s your GitHub username?', type: 'text', placeholder: 'e.g., john-doe', required: true },
  { id: 'role', label: 'What\'s your role or title?', type: 'text', placeholder: 'e.g., Full Stack Developer', required: true },
  { id: 'bio', label: 'Tell us about yourself', type: 'textarea', placeholder: 'A short bio... (2-3 sentences)', required: true, hasAutofill: true },
  { id: 'techStack', label: 'What technologies do you use?', type: 'tags', placeholder: 'Type and press Enter', defaultValues: ['JavaScript', 'React', 'Node.js'] },
  { id: 'projects', label: 'What projects are you working on?', type: 'tags', placeholder: 'Type and press Enter', defaultValues: ['Project Alpha', 'Open Source App'] },
  { id: 'socials', label: 'Add your social links (optional)', type: 'socials' },
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
  });
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState(STEPS[0].defaultValues || []);
  const [socialInputs, setSocialInputs] = useState({});
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [showAutofillSuggestions, setShowAutofillSuggestions] = useState(false);

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    // Save current step data
    const stepId = step.id;
    let newData = { ...formData };

    if (stepId === 'profileStyle') {
      // Already set when user clicks a style
    } else if (stepId === 'name' || stepId === 'githubUsername' || stepId === 'role' || stepId === 'bio') {
      newData[stepId] = inputValue.trim();
    } else if (stepId === 'techStack') {
      newData.techStack = tags.length > 0 ? tags : ['JavaScript'];
    } else if (stepId === 'projects') {
      newData.projects = tags.length > 0 ? tags : ['My Project'];
    } else if (stepId === 'socials') {
      newData.socials = socialInputs;
    }

    setFormData(newData);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      const nextStep = STEPS[currentStep + 1];

      // Pre-populate next step
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
      }
    }
  };

  const handleAutofillBio = async () => {
    if (!formData.name || !formData.role) return;
    
    setAutofillLoading(true);
    
    // Generate bio suggestions based on user's name and role
    const suggestions = [
      `Passionate ${formData.role} with a love for clean code and innovative solutions. Building digital experiences that matter.`,
      `${formData.role} who thrives on solving complex problems. Always learning, always building. Open source enthusiast.`,
      `Creative ${formData.role} dedicated to crafting elegant, user-centric applications. Believer in the power of technology to transform lives.`,
      `Driven ${formData.role} focused on delivering high-quality, scalable solutions. Tech enthusiast and lifelong learner.`,
      `${formData.role} with expertise in modern web technologies. Passionate about developer experience and community building.`
    ];
    
    // Simulate a brief "thinking" delay
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
    // Save socials
    const newData = { ...formData, socials: socialInputs };
    setFormData(newData);
    onSubmit(newData);
  };

  // If wizard is complete, show "Generate Another" button
  if (wizardComplete) {
    return (
      <div className="wizard-card">
        <div className="wizard-complete">
          <div className="success-icon">🎉</div>
          <h2>Profile Generated!</h2>
          <p>Your GitHub profile README has been created. Check the preview panel on the right.</p>
          <button className="btn-reset" onClick={onReset}>
            ✨ Create Another Profile
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
              className="wizard-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={step.placeholder}
              autoFocus
              required={step.required}
            />
            {step.id === 'githubUsername' && (
              <p className="input-hint">
                ⚠️ Use your exact GitHub username (case-sensitive). This is used for your profile stats.
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
                  <>✨ Auto-fill Bio</>
                )}
              </button>
              {(!formData.name || !formData.role) && (
                <p className="autofill-hint">Complete name and role steps first to enable auto-fill</p>
              )}
            </div>
            <textarea
              className="wizard-input wizard-textarea"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowAutofillSuggestions(false);
              }}
              onKeyDown={handleKeyPress}
              placeholder={step.placeholder}
              autoFocus
              required={step.required}
              rows={4}
            />
            {showAutofillSuggestions && (
              <div className="autofill-suggestions">
                <p className="suggestions-label">💡 More suggestions:</p>
                <div className="suggestions-list">
                  {[
                    `Passionate ${formData.role} with a love for clean code and innovative solutions.`,
                    `${formData.role} who thrives on solving complex problems. Always learning.`,
                    `Creative ${formData.role} dedicated to crafting elegant, user-centric applications.`
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
              { key: 'twitter', label: 'Twitter / X', icon: '🐦' },
              { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
              { key: 'portfolio', label: 'Portfolio', icon: '🌐' },
              { key: 'email', label: 'Email', icon: '📧' },
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

        {/* Navigation Buttons */}
        <div className="wizard-buttons">
          {currentStep > 0 && (
            <button type="button" className="btn-back" onClick={handleBack}>
              ← Back
            </button>
          )}
          {step.type === 'style-selector' ? (
            <button type="button" className="btn-next" onClick={handleNext}>
              Next →
            </button>
          ) : currentStep < STEPS.length - 1 ? (
            <button type="submit" className="btn-next" disabled={!inputValue.trim() && step.type !== 'tags' && step.type !== 'socials'}>
              Next →
            </button>
          ) : (
            <button type="submit" className="btn-generate" disabled={loading}>
              {loading ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Generating...
                </span>
              ) : (
                '✨ Generate Profile'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProfileWizard;
