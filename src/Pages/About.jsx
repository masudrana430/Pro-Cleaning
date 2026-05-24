// src/components/AboutUsSection.jsx
import React from "react";

const Feature = ({ title, desc }) => (
  <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
    <h4 className="text-base font-semibold text-base-content">{title}</h4>
    <p className="mt-2 text-sm leading-relaxed text-base-content/70">{desc}</p>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="rounded-2xl border border-base-200 bg-base-100 p-5 text-center shadow-sm">
    <div className="text-2xl font-bold text-base-content">{value}</div>
    <div className="mt-1 text-xs tracking-wide text-base-content/60">{label}</div>
  </div>
);

export default function AboutUsSection() {
  return (
    <section id="about" className="bg-base-200/40 py-14 sm:py-18">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          {/* Left: Copy */}
          <div>
            <p className="inline-flex items-center rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-semibold text-base-content/70">
              About Us
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-base-content sm:text-4xl">
              Building cleaner communities with a simple, secure reporting platform
            </h2>

            <p className="mt-4 text-base leading-relaxed text-base-content/70">
              Our project is a full-stack MERN application that helps people report and track
              environmental and cleanliness issues in their local area—garbage buildup, broken
              footpaths, illegal dumping, waterlogging, and more. It also supports community
              action by enabling requests for cleanup drives and small community services
              (where applicable).
            </p>

            <p className="mt-4 text-base leading-relaxed text-base-content/70">
              We focus on a clean, modern UI with Tailwind CSS and strong access control using
              Firebase Authentication. With protected routes and user authorization, reports
              and actions stay organized, reliable, and safe.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-medium text-base-content/70">
                MERN Stack
              </span>
              <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-medium text-base-content/70">
                Firebase Auth
              </span>
              <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-medium text-base-content/70">
                Protected Routes
              </span>
              <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-medium text-base-content/70">
                Clean UI (Tailwind)
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Report Types" value="10+" />
              <Stat label="Status Tracking" value="Live" />
              <Stat label="Secure Access" value="Auth" />
              <Stat label="Community Impact" value="High" />
            </div>
          </div>

          {/* Right: Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Feature
              title="Report & Track Issues"
              desc="Submit incidents with details and monitor status updates—from new reports to resolution."
            />
            <Feature
              title="Cleanup Drive Requests"
              desc="Coordinate local cleanup efforts by submitting requests and viewing approved initiatives."
            />
            <Feature
              title="Service Requests"
              desc="Request small community services (if applicable) and keep progress transparent for residents."
            />
            <Feature
              title="Secure & Role-Aware"
              desc="Firebase Authentication, protected routes, and authorization keep user actions controlled."
            />
            <div className="sm:col-span-2 rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm">
              <h4 className="text-base font-semibold text-base-content">Our mission</h4>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                Make it effortless for residents to raise environmental concerns and for communities to
                take action—turning reports into real improvements with clarity and accountability.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="#reports"
                  className=" btn rounded-l-none border-0
    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    text-white font-semibold
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A]"
                >
                  Explore Reports
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-xl border border-base-300 bg-base-100 px-5 py-2.5 text-sm font-semibold text-base-content hover:bg-base-200/40"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-10 rounded-2xl border border-base-200 bg-base-100 p-6 text-sm text-base-content/70 shadow-sm">
          <p>
            Built with a modern MERN architecture (MongoDB, Express.js, React, Node.js) to keep the experience fast,
            scalable, and easy to maintain—while staying friendly for contributors and community partners.
          </p>
        </div>
      </div>
    </section>
  );
}
