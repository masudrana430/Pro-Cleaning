// src/Components/FAQSection.jsx
import React, { useState } from "react";

const FAQItem = ({ q, a, open, onToggle }) => (
  <div className="rounded-2xl border border-base-200 bg-base-100 p-5">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-start justify-between gap-4 text-left"
    >
      <span className="font-semibold text-base-content">{q}</span>
      <span className="text-base-content/60">{open ? "−" : "+"}</span>
    </button>
    {open && <p className="mt-3 text-sm leading-relaxed text-base-content/70">{a}</p>}
  </div>
);

const FAQSection = ({
  faqs = [
    {
      q: "How do I report an issue?",
      a: "Go to “Report an Issue”, add a title, details, location, and (optional) photo, then submit.",
    },
    {
      q: "Can I track what happens after reporting?",
      a: "Yes. Each report has a status timeline so you can follow progress and updates.",
    },
    {
      q: "Who can join cleanup drives?",
      a: "Any authenticated user can volunteer. Some drives may require approval based on capacity.",
    },
    {
      q: "Is my account secure?",
      a: "Yes. We use Firebase Authentication and protected routes for secure access and authorization.",
    },
  ],
}) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-10">
      <div className="rounded-3xl bg-base-200/40 p-6 sm:p-8 border border-base-200">
        <h2 className="text-2xl font-bold text-base-content">FAQ</h2>
        <p className="mt-1 text-sm text-base-content/70">
          Common questions about reporting, tracking, and volunteering.
        </p>

        <div className="mt-6 grid gap-4">
          {faqs.map((f, idx) => (
            <FAQItem
              key={f.q}
              q={f.q}
              a={f.a}
              open={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
