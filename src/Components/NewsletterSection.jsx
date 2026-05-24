// src/Components/NewsletterSection.jsx
import React, { useState } from "react";
import Container from "./Container";

const NewsletterSection = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    // Optional: pass to parent handler to call API
    if (onSubmit) await onSubmit(email);

    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <Container>
      <section className="py-10">
        <div className="rounded-3xl bg-base-100 p-6 sm:p-8 shadow-sm border border-base-200">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-base-content">
                Newsletter
              </h2>
              <p className="mt-1 text-sm text-base-content/70">
                Get weekly updates on resolved issues, cleanup events, and
                community notices.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-base-content/70">
                <li>• Community cleanup drive announcements</li>
                <li>• Safety and environmental tips</li>
                <li>• Progress highlights from your area</li>
              </ul>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-base-200 bg-base-200/30 p-5"
            >
              <label className="text-sm font-semibold text-base-content">
                Email address
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  className="input input-bordered w-full rounded-xl"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="btn rounded-l-none border-0
    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    text-white font-semibold
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A]"
                >
                  Subscribe
                </button>
              </div>

              <p className="mt-3 text-xs text-base-content/60">
                We respect your privacy. Unsubscribe anytime.
              </p>

              {done && (
                <div className="mt-3 text-sm font-semibold text-success">
                  Subscribed successfully.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default NewsletterSection;
