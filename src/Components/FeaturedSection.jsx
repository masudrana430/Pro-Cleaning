// src/Components/FeaturedSection.jsx
import { Link } from "react-router-dom";
import { FiDroplet, FiMapPin, FiHeart, FiArrowRight, FiShield } from "react-icons/fi";
import Container from "./Container"; // adjust path if needed

const FeaturedSection = () => {
  return (
    <section className="py-10 md:py-16">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-rose-100 bg-rose-50 text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-700">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Featured for you
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900">
              Make every drop count
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-500 max-w-2xl">
              Discover key actions you can take right now—donate blood, respond to urgent
              requests, or support the platform that connects donors and patients.
            </p>
          </div>

          <div className="text-xs md:text-sm text-slate-500">
            <p className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Real-time data from your account
            </p>
            <p className="mt-1">
              Actions here are tailored to how people typically use BloodCare-style platforms.
            </p>
          </div>
        </div>

        {/* Featured cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Urgent Requests */}
          <div className="group rounded-2xl border border-rose-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 bg-gradient-to-br from-rose-50 via-white to-rose-100/70 overflow-hidden">
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-semibold">
                  <FiDroplet className="w-3.5 h-3.5" />
                  Urgent requests
                </div>
                <span className="text-[11px] font-semibold text-rose-700">
                  High impact
                </span>
              </div>

              <h3 className="text-sm md:text-base font-semibold text-slate-900">
                Respond to pending blood requests
              </h3>
              <p className="mt-2 text-xs md:text-sm text-slate-600 flex-1">
                View all pending blood donation requests and volunteer when you are
                available and eligible to donate.
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                <div className="inline-flex items-center gap-1">
                  <FiMapPin className="w-3.5 h-3.5 text-rose-600" />
                  Filter by district &amp; upazila
                </div>
                <Link
                  to="/public-donation-requests"
                  className="inline-flex items-center gap-1 font-semibold text-rose-700 group-hover:text-rose-800"
                >
                  View requests
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Become a donor / complete profile */}
          <div className="group rounded-2xl border border-rose-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 bg-gradient-to-br from-white via-rose-50 to-rose-100/60 overflow-hidden">
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-semibold">
                  <FiHeart className="w-3.5 h-3.5" />
                  Donor profile
                </div>
                <span className="text-[11px] font-semibold text-rose-600">
                  Recommended
                </span>
              </div>

              <h3 className="text-sm md:text-base font-semibold text-slate-900">
                Strengthen your donor identity
              </h3>
              <p className="mt-2 text-xs md:text-sm text-slate-600 flex-1">
                Keep your name, avatar and contact details up-to-date so patients and
                volunteers can recognise and trust your offers to donate.
              </p>

              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Use a clear display name that matches your ID.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
                  Add a recognisable profile image for easier coordination.
                </li>
              </ul>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                <span>Visible on requests you create or respond to.</span>
                <Link
                  to="/my-profile"
                  className="inline-flex items-center gap-1 font-semibold text-rose-700 group-hover:text-rose-800"
                >
                  Edit profile
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Funding / platform support */}
          <div className="group rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/70 overflow-hidden">
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-semibold">
                  <FiShield className="w-3.5 h-3.5" />
                  Platform support
                </div>
                <span className="text-[11px] font-semibold text-slate-700">
                  Optional
                </span>
              </div>

              <h3 className="text-sm md:text-base font-semibold text-slate-900">
                Help keep the service running
              </h3>
              <p className="mt-2 text-xs md:text-sm text-slate-600 flex-1">
                If you cannot donate blood right now, you can still support the platform
                through secure funding to maintain infrastructure and outreach.
              </p>

              <div className="mt-3 text-xs text-slate-500 space-y-1.5">
                <p>• Stripe-powered payments, encrypted end-to-end.</p>
                <p>• Funds go towards system maintenance and awareness campaigns.</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Secure &amp; audited
                </span>
                <Link
                  to="/funding"
                  className="inline-flex items-center gap-1 font-semibold text-slate-800 group-hover:text-slate-900"
                >
                  Open funding
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedSection;
