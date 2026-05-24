// src/Components/StatisticsSection.jsx
import React from "react";

const StatisticsSection = ({
  stats = [
    { label: "Users", value: "2,450+" },
    { label: "Issues Reported", value: "1,120+" },
    { label: "Resolved", value: "860+" },
    { label: "Volunteers", value: "320+" },
  ],
  subtitle = "A quick snapshot of community activity.",
}) => {
  return (
    <section className="py-10">
      <div className="rounded-3xl bg-base-200/40 p-6 sm:p-8 border border-base-200">
        <h2 className="text-2xl font-bold text-base-content">Statistics</h2>
        <p className="mt-1 text-sm text-base-content/70">{subtitle}</p>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-base-100 p-5 text-center shadow-sm border border-base-200">
              <div className="text-3xl font-bold text-base-content">{s.value}</div>
              <div className="mt-1 text-xs text-base-content/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
