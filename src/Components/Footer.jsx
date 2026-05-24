// src/Components/Footer.jsx
import { Link } from "react-router-dom";
import logo from "../assets/Group 427320775.png";
import {
  MdOutlineMail,
  MdOutlinePhone,
  MdOutlineLocationOn,
} from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function GooglePlayIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3.2 2.2c-.4.4-.6 1-.6 1.7v16.2c0 .7.2 1.3.6 1.7l9.3-9.8L3.2 2.2zM14.3 12.1l2.8-3-9.6-6 6.8 9zM14.5 12.5l-6.9 9 9.6-6-2.7-3zM20.8 10.6l-2.3-1.4-3 3.2 3 3.2 2.3-1.4c1.1-.7 1.1-2.8 0-3.6z" />
    </svg>
  );
}

function AppStoreIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.36 1.64a4.9 4.9 0 0 1-1.17 3.74A4.33 4.33 0 0 1 11.8 7a5.05 5.05 0 0 1 1.2-3.78 4.72 4.72 0 0 1 3.36-1.58zM21.6 17.38c-.6 1.38-.9 2-1.68 3.22-1.09 1.66-2.35 3.73-4.2 3.77-1.58 0-2-.98-4.18-.97-2.19 0-2.67.98-4.25.97-1.85-.04-3.27-2.26-4.36-3.92C1.2 18.2.12 15.1 1.3 12.7c.9-1.9 2.9-3.12 5-3.15 1.56-.03 3.02 1.06 3.97 1.06.95 0 2.72-1.31 4.58-1.12 0 0 2.55.22 3.76 2.2-3.29 2.01-2.77 6 1 6.69z" />
    </svg>
  );
}

export default function Footer() {
  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/issues", label: "Issues" },
    { to: "/all-issues", label: "All Issues" },
    { to: "/add-issues", label: "Report Issue" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  const resources = [
    { to: "/about", label: "About Us" },
    { to: "/blog", label: "Blog" },
    { to: "/support", label: "Support" },
    { to: "/contact", label: "Contact" },
    { to: "/privacy-policy", label: "Privacy & Terms" },
  ];

  const programs = [
    { to: "/all-issues", label: "Community Issues" },
    { to: "/add-issues", label: "Cleanup Request" },
    { to: "/my-contribution", label: "My Contributions" },
    { to: "/dashboard/manage-issues", label: "Manage Issues" },
    { to: "/dashboard/reports", label: "Reports & Analytics" },
  ];

  return (
    <footer className="mt-10 bg-gradient-to-t from-[#020617] via-[#050816] to-[#0F172A] text-slate-100 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link
              to="/"
              aria-label="Pro Cleaning Home"
              className="inline-flex items-center gap-3"
            >
              <div className="flex items-center justify-center">
                <img
                  src={logo}
                  alt="Pro Cleaning logo"
                  className="h-10 w-auto md:h-12"
                />
              </div>

              <div className="leading-tight select-none">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300/80">
                  Pro Cleaning
                </p>

                <h2 className="text-[1.6rem] md:text-[1.85rem] font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-300 bg-clip-text text-transparent">
                    Clean City,
                  </span>{" "}
                  <span className="text-slate-50">Better Life</span>
                </h2>
              </div>
            </Link>

            <p className="mt-4 text-sm leading-6 text-slate-300 max-w-md">
              Pro Cleaning helps communities report local cleaning issues,
              organize cleanup activities, track progress, and create a cleaner,
              safer environment for everyone.
            </p>

            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MdOutlineMail className="mt-0.5 text-emerald-400" />
                <a
                  href="mailto:support@procleaning.app"
                  className="link link-hover text-slate-200"
                >
                  support@procleaning.app
                </a>
              </li>

              <li className="flex items-start gap-2">
                <MdOutlinePhone className="mt-0.5 text-emerald-400" />
                <a
                  href="tel:+8801XXXXXXXXX"
                  className="link link-hover text-slate-200"
                >
                  +880 1XXX-XXXXXX
                </a>
              </li>

              <li className="flex items-start gap-2">
                <MdOutlineLocationOn className="mt-0.5 text-emerald-400" />
                <span className="text-slate-300">
                  Chittagong, Bangladesh — Community cleaning support
                </span>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white/10 hover:border-white/30 text-slate-50 transition-colors"
              >
                <GooglePlayIcon className="h-5 w-5" />
                <span>Get it on Google Play</span>
              </a>

              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white/10 hover:border-white/30 text-slate-50 transition-colors"
              >
                <AppStoreIcon className="h-5 w-5" />
                <span>Download on the App Store</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-50 mb-3 text-sm tracking-wide uppercase">
              Quick Links
            </h4>

            <ul className="space-y-2 text-sm">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    <span className="h-[3px] w-[3px] rounded-full bg-emerald-400/60" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-50 mb-3 text-sm tracking-wide uppercase">
              Resources
            </h4>

            <ul className="space-y-2 text-sm">
              {resources.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    <span className="h-[3px] w-[3px] rounded-full bg-emerald-400/60" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-50 mb-3 text-sm tracking-wide uppercase">
              Programs
            </h4>

            <ul className="space-y-2 text-sm">
              {programs.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    <span className="h-[3px] w-[3px] rounded-full bg-emerald-400/60" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-xl">
            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-4 md:p-5 shadow-lg shadow-emerald-500/10">
              <div className="md:flex md:items-center md:justify-between gap-4">
                <div>
                  <h5 className="font-semibold text-slate-50 text-sm md:text-base">
                    Stay updated:
                    <span className="font-normal text-slate-300">
                      {" "}
                      cleanup campaigns, community alerts, and progress reports.
                    </span>
                  </h5>
                </div>

                <form
                  className="mt-3 md:mt-0 flex w-full md:w-auto"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Thanks for subscribing!");
                  }}
                >
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    className="input input-bordered rounded-r-none w-full md:w-72 bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
                  />

                  <button
                    type="submit"
                    className="btn rounded-l-none border-0 text-sm font-semibold bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500 text-white px-5 hover:from-emerald-400 hover:via-teal-400 hover:to-lime-400 transition-all duration-300"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between text-xs md:text-sm text-slate-300">
            <p className="order-2 lg:order-1 w-full lg:w-auto text-center lg:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-slate-100">Pro Cleaning</span>.
              Built for cleaner communities.
            </p>

            <div className="order-1 lg:order-2 flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
              <span className="text-xs md:text-sm text-slate-400">
                Stay connected
              </span>

              <a
                href="https://www.facebook.com/profile.php?id=100069416914519"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="px-2 py-1 rounded-full bg-white/5 text-xs border border-white/10 inline-flex items-center justify-center hover:bg-white/10 transition-colors"
                title="Follow us on Facebook"
              >
                <FaFacebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </a>

              <a
                href="https://x.com/ProCleaning"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
                className="px-2 py-1 rounded-full bg-white/5 text-xs border border-white/10 inline-flex items-center justify-center hover:bg-white/10 transition-colors"
                title="Follow us on X"
              >
                <FaXTwitter className="h-4 w-4" />
                <span className="sr-only">X</span>
              </a>

              <span className="px-2 py-1 rounded-full bg-white/5 text-xs border border-white/10">
                Email Updates
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}