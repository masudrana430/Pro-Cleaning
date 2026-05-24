// src/pages/Support.jsx
import React from "react";
import { Link } from "react-router-dom";
import Container from "../Components/Container";

const Support = () => {
  const faqs = [
    {
      q: "How do I submit an issue?",
      a: "Go to Add Issue, fill in title, category, location, description, and upload media (optional).",
    },
    {
      q: "Can I edit or delete my issue?",
      a: "If your account is the author, you can edit from your profile/dashboard (if enabled).",
    },
    {
      q: "How does contribution work?",
      a: "Open an issue details page and contribute a selected amount. You must be logged in to contribute.",
    },
    {
      q: "Why can’t I see some issues?",
      a: "Some issues may be removed for policy reasons or still processing. Refresh and try again.",
    },
  ];

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-extrabold text-center">Help & Support</h1>
        <p className="text-center mt-2 text-base-content/70">
          Quick answers and helpful links.
        </p>

        <div className="mt-8 grid gap-4">
          {faqs.map((f) => (
            <div key={f.q} className="collapse collapse-arrow rounded-2xl border bg-base-100">
              <input type="checkbox" />
              <div className="collapse-title font-semibold">{f.q}</div>
              <div className="collapse-content">
                <p className="text-sm text-base-content/70">{f.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-base-100 p-6">
            <h3 className="font-bold text-lg">Need more help?</h3>
            <p className="mt-2 text-sm text-base-content/70">
              Contact our support team and share screenshots or issue links.
            </p>
            <Link to="/contact" className="btn rounded-l-none border-0
    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    text-white font-semibold
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A] mt-4">
              Contact Support
            </Link>
          </div>

          <div className="rounded-2xl border bg-base-100 p-6">
            <h3 className="font-bold text-lg">Guidelines</h3>
            <p className="mt-2 text-sm text-base-content/70">
              Please avoid personal data in reports and use accurate locations.
            </p>
            <div className="mt-4 flex gap-2">
              <Link to="/terms" className="btn btn-outline rounded-xl">Terms</Link>
              <Link to="/privacy" className="btn btn-outline rounded-xl">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Support;
