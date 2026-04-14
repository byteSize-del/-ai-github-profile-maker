function PrivacyPage() {
  return (
    <div className="legal-shell">
      <p className="eyebrow">Legal</p>
      <h1 className="page-title">Privacy Policy</h1>
      <div className="legal-content">
        <p>
          ProfileForge processes only the data required to authenticate users, track daily credits,
          and generate profile content.
        </p>
        <p>
          We store account identifier fields, generation metadata, and credit history for service
          operation and abuse prevention.
        </p>
        <p>
          OAuth sessions are protected with secure, HTTP-only cookies. Personal tokens are not
          exposed to frontend scripts.
        </p>
        <p>
          For removal requests or data questions, contact support through the Contact page.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPage;
