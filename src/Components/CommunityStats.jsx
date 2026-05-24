// src/Components/CommunityStats.jsx
import React, { useEffect, useState } from "react";
import Container from "./Container";
import { FiUsers, FiCheckCircle, FiClock, FiTrendingUp } from "react-icons/fi";
import { motion as Motion } from "framer-motion";

// Tiny count-up hook (no extra deps)
function useCountUp(value = 0, duration = 800) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const from = 0;
    const to = Number(value) || 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // cubic ease-out
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

export default function CommunityStats({
  totals = { users: 0, resolved: 0, pending: 0 },
  sinceText = "since launch",
}) {
  const users = Number(totals?.users ?? 0);
  const resolved = Number(totals?.resolved ?? 0);
  const pending = Number(totals?.pending ?? 0);
  const issuesTotal = resolved + pending;
  const resolutionRate = issuesTotal
    ? Math.round((resolved / issuesTotal) * 100)
    : 0;

  const usersCount = useCountUp(users);
  const resolvedCount = useCountUp(resolved);
  const pendingCount = useCountUp(pending);
  const rateCount = useCountUp(resolutionRate);

  const cards = [
    {
      label: "Registered Users",
      value: usersCount,
      raw: users,
      icon: (
        <div className="h-12 w-12 rounded-xl grid place-items-center bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70 shadow-inner">
          <FiUsers className="h-6 w-6" />
        </div>
      ),
      accent: "from-emerald-500/10 to-transparent",
      badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      label: "Issues Resolved",
      value: resolvedCount,
      raw: resolved,
      icon: (
        <div className="h-12 w-12 rounded-xl grid place-items-center bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 ring-1 ring-blue-200/70 shadow-inner">
          <FiCheckCircle className="h-6 w-6" />
        </div>
      ),
      accent: "from-blue-500/10 to-transparent",
      badge: "text-blue-700 bg-blue-50 border-blue-200",
    },
    {
      label: "Issues Pending",
      value: pendingCount,
      raw: pending,
      icon: (
        <div className="h-12 w-12 rounded-xl grid place-items-center bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 ring-1 ring-amber-200/70 shadow-inner">
          <FiClock className="h-6 w-6" />
        </div>
      ),
      accent: "from-amber-500/10 to-transparent",
      badge: "text-amber-700 bg-amber-50 border-amber-200",
    },
  ];

  return (
    <Container>
      <section className="relative my-10">
        {/* Soft header background */}
        <div className="absolute inset-x-0 -top-6 -z-10 h-32 bg-gradient-to-b from-base-200/70 to-transparent rounded-3xl" />
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight">
                <span
                  className="bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    bg-clip-text text-transparent
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A]"
                >
                  Community
                </span>{" "}
                Stats
              </h3>
              <p className="text-sm text-base-content/60">
                Updated {sinceText}
              </p>
            </div>

            {/* Resolution rate mini-card */}
            <Motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="card bg-base-100 border border-base-200 shadow-sm"
            >
              <div className="card-body py-3 px-4 gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="
    grid place-items-center h-8 w-8 rounded-lg
    bg-gradient-to-br from-[#E3F8EC] to-[#F5FFF9]
    text-[#1A6A3D]
    ring-1 ring-[#36B864]/40
  "
                  >
                    <FiTrendingUp className="h-4 w-4" />
                  </span>

                  <div className="text-sm font-medium">Resolution Rate</div>
                  <div className="ml-auto text-sm font-semibold">
                    {rateCount}%
                  </div>
                </div>
                <progress
                  className="progress progress-success w-full"
                  value={resolutionRate}
                  max="100"
                />
              </div>
            </Motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cards.map((c, idx) => (
              <Motion.div
                key={c.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 26,
                  mass: 0.7,
                  delay: idx * 0.05,
                }}
                className="relative group"
              >
                {/* Ambient accent */}
                <div
                  className={`pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b ${c.accent} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                  <div className="card-body flex-row items-center gap-4">
                    {c.icon}
                    <div className="min-w-0">
                      <div className="text-3xl font-extrabold leading-none">
                        {Number.isFinite(c.raw) ? c.value : 0}
                      </div>
                      <div className="text-sm text-base-content/70 truncate">
                        {c.label}
                      </div>
                    </div>
                    <span className={`ml-auto badge badge-outline ${c.badge}`}>
                      Live
                    </span>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>

          {/* Footer hint
          <div className="mt-4 text-xs text-base-content/60">
            * Resolution rate = Resolved ÷ (Resolved + Pending)
          </div> */}
        </div>
      </section>
    </Container>
  );
}
