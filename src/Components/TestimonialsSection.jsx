// src/Components/TestimonialsSection.jsx
import React from "react";

const TestimonialsSection = ({
  testimonials = [
    { name: "Local Resident", role: "Reporter", quote: "Reporting was simple, and the issue was fixed quickly." },
    { name: "Community Volunteer", role: "Volunteer", quote: "The platform made it easy to join cleanup drives." },
    { name: "Area Manager", role: "Moderator", quote: "A clear dashboard helps prioritize urgent reports." },
  ],
}) => {
  return (
    <section className="py-10">
      <div className="rounded-3xl bg-base-100 p-6 sm:p-8 shadow-sm border border-base-200">
        <h2 className="text-2xl font-bold text-base-content">Testimonials</h2>
        <p className="mt-1 text-sm text-base-content/70">
          What people are saying about community improvements.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-base-200 bg-base-200/30 p-5">
              <p className="text-sm text-base-content/70">“{t.quote}”</p>
              <div className="mt-4">
                <p className="text-sm font-semibold text-base-content">{t.name}</p>
                <p className="text-xs text-base-content/60">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
