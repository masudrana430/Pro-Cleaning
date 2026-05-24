// src/pages/PrivacyTerms.jsx
import React from "react";
import Container from "../Components/Container";

const PrivacyTerms = () => {
  return (
    <Container>
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-extrabold text-center">Privacy & Terms</h1>
        <p className="text-center mt-2 text-base-content/70">
          Simple policy overview for users of the platform.
        </p>

        <div className="mt-8 rounded-2xl border bg-base-100 p-6 shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-bold">Privacy</h2>
            <p className="mt-2 text-sm text-base-content/70">
              We collect basic account information (name, email) for authentication and
              to associate reports with user accounts. We may store report content such as
              title, description, media, and location.
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm text-base-content/70 space-y-1">
              <li>We do not sell your personal information.</li>
              <li>Do not post sensitive personal data in reports.</li>
              <li>Media is stored via third-party storage providers (if used).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">Terms</h2>
            <p className="mt-2 text-sm text-base-content/70">
              By using this platform, you agree to submit truthful reports and follow
              community guidelines. Misuse (spam, harassment, false reports) may result
              in suspension.
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm text-base-content/70 space-y-1">
              <li>You are responsible for the content you submit.</li>
              <li>We may remove content that violates guidelines.</li>
              <li>Service availability can change without notice.</li>
            </ul>
          </section>

          <section className="rounded-xl bg-base-200/40 p-4">
            <p className="text-sm text-base-content/70">
              If you have questions about these policies, contact the team from the Contact page.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
};

export default PrivacyTerms;
