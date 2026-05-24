// src/Components/HighlightsSection.jsx
import React from "react";

const HighlightsSection = () => {
  const items = [
    { title: "Report Issues Fast", desc: "Post incidents with location, photos, and details in minutes." },
    { title: "Track Status", desc: "Follow updates from “New” to “Resolved” with clear progress." },
    { title: "Cleanup Requests", desc: "Request cleanup drives and community services (if available)." },
    { title: "Secure Access", desc: "Firebase auth + protected routes to keep actions controlled." },
  ];

  return (
    <section className="py-10">
      <div className="rounded-3xl bg-base-100 p-6 sm:p-8 shadow-sm border border-base-200">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-base-content">Highlights</h2>
            <p className="mt-1 text-sm text-base-content/70">
              Key features that help your community take action.
            </p>
          </div>
          <span className="hidden sm:inline-flex rounded-full border border-base-300 px-3 py-1 text-xs font-semibold text-base-content/70">
            MERN • Firebase • Tailwind
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-base-200 bg-base-200/30 p-5 hover:bg-base-200/50 transition"
            >
              <h3 className="font-semibold text-base-content">{it.title}</h3>
              <p className="mt-2 text-sm text-base-content/70">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
