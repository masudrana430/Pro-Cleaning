<<<<<<< HEAD
// src/layouts/DashboardLayout.jsx
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiUsers,
  FiList,
  FiPlusCircle,
  FiMenu,
} from "react-icons/fi";
import useCurrentUser from "../hooks/useCurrentUser";
// import LoadingSpinner from "../Components/LoadingSpinner";
import logo from "../assets/Group 427320775.png";
import LoadingSpinner2nd from "../Components/LoadingSpinner2nd";

const DashboardLayout = () => {
  const { dbUser, loadingDbUser } = useCurrentUser();

  if (loadingDbUser) return <LoadingSpinner2nd />;

  const role = dbUser?.role || "donor";

  const navLinkBase =
    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors";

  const navLinkClasses = ({ isActive }) =>
    `${navLinkBase} ${
      isActive
        ? "bg-rose-50 text-rose-600 border border-rose-100"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        {/* MAIN CONTENT */}
        <div className="drawer-content flex flex-col">
          {/* Top bar (only for mobile/tablet) */}
          <header className="w-full flex items-center justify-between px-4 md:px-8 py-3 border-b bg-base-100/90 backdrop-blur z-10">
            <div className="flex items-center gap-3">
              <label
                htmlFor="dashboard-drawer"
                className="btn btn-ghost btn-square lg:hidden"
                aria-label="Open sidebar"
              >
                <FiMenu className="h-5 w-5" />
              </label>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Dashboard
                </p>
                <h1 className="text-lg font-semibold capitalize text-slate-900">
                  {role} panel
                </h1>
              </div>
            </div>

            <Link
              to="/"
              className="btn btn-xs sm:btn-sm rounded-full border-0 bg-slate-900 text-slate-50 hover:bg-slate-800"
            >
              Back to Home
            </Link>
          </header>

          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>

        {/* SIDEBAR */}
        <div className="drawer-side">
          <label
            htmlFor="dashboard-drawer"
            className="drawer-overlay"
            aria-label="Close sidebar"
          />
          <aside className="w-72 bg-base-100 border-r min-h-full flex flex-col">
            {/* Brand / Role */}
            <div className="px-5 py-6 border-b">
              <Link
                to="/"
                className="flex items-center gap-3 sm:gap-4 normal-case"
                aria-label="BloodCare Home"
              >
                
                <div
                  className="
                              bg-white rounded-full shadow-lg
                              w-10 h-10 lg:w-10 lg:h-10
                              flex items-center justify-center
                            "
                >
                  <img
                    src={logo}
                    alt="Give a Life logo"
                    className="h-10 lg:h-14 w-auto"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-tight">
                    <span className="text-red-600">GIVE</span> A LIFE
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Role:{" "}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 capitalize">
                      {role}
                    </span>
                  </p>
                </div>
              </Link>
            </div>

            {/* NAVIGATION */}
            <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto">
              {/* General section */}
              <div>
                <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  General
                </p>
                <ul className="space-y-1">
                  <li>
                    <NavLink to="/dashboard" end className={navLinkClasses}>
                      <FiHome className="h-4 w-4" />
                      <span>Home</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/profile" className={navLinkClasses}>
                      <FiUser className="h-4 w-4" />
                      <span>Profile</span>
                    </NavLink>
                  </li>
                </ul>
              </div>

              {/* Donor-only */}
              {role === "donor" && (
                <div>
                  <p className="px-3 mt-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Donor
                  </p>
                  <ul className="space-y-1">
                    <li>
                      <NavLink
                        to="/dashboard/my-donation-requests"
                        className={navLinkClasses}
                      >
                        <FiList className="h-4 w-4" />
                        <span>My Donation Requests</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/create-donation-request"
                        className={navLinkClasses}
                      >
                        <FiPlusCircle className="h-4 w-4" />
                        <span>Create Donation Request</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              )}

              {/* Admin-only */}
              {role === "admin" && (
                <div>
                  <p className="px-3 mt-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Admin
                  </p>
                  <ul className="space-y-1">
                    <li>
                      <NavLink
                        to="/dashboard/all-users"
                        className={navLinkClasses}
                      >
                        <FiUsers className="h-4 w-4" />
                        <span>All Users</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/all-blood-donation-request"
                        className={navLinkClasses}
                      >
                        <FiList className="h-4 w-4" />
                        <span>All Donation Requests</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              )}

              {/* Volunteer-only */}
              {role === "volunteer" && (
                <div>
                  <p className="px-3 mt-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Volunteer
                  </p>
                  <ul className="space-y-1">
                    <li>
                      <NavLink
                        to="/dashboard/all-blood-donation-request"
                        className={navLinkClasses}
                      >
                        <FiList className="h-4 w-4" />
                        <span>All Donation Requests</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              )}
            </nav>

            {/* Footer / user info */}
            <div className="p-4 border-t text-[11px] text-slate-500">
              <p className="mb-0.5">Logged in as:</p>
              <p className="font-medium truncate">
                {dbUser?.name || dbUser?.email || "User"}
              </p>
=======
import React, { useContext } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import useUserRole from "../hooks/useUserRole";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-xl block font-medium transition ${
    isActive
      ? "bg-success text-white"
      : "hover:bg-base-200 text-base-content/80"
  }`;

export default function DashboardLayout() {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const { role, loading } = useUserRole(); // "user" | "admin"

  const handleLogout = async () => {
    try {
      await logOut?.();
      navigate("/auth/login");
    } catch (e) {
      console.error(e);
    }
  };

  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen bg-base-200/30">
      {/* Top Navbar */}
      <div className="navbar bg-base-100 border-b sticky top-0 z-30">
        <div className="navbar-start">
          <label htmlFor="dash-drawer" className="btn btn-ghost lg:hidden">
            ☰
          </label>
          <Link to="/" className="btn btn-ghost text-lg font-extrabold">
            CleanCity
          </Link>
        </div>

        <div className="navbar-center hidden md:flex">
          <span className="text-sm opacity-70">
            Dashboard {loading ? "• Loading..." : isAdmin ? "• Admin" : "• User"}
          </span>
        </div>

        <div className="navbar-end">
          {/* Profile dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
              <div className="avatar">
                <div className="w-9 rounded-full">
                  <img
                    alt="profile"
                    src={
                      user?.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.displayName || "User"
                      )}&background=36B864&color=fff&size=96&bold=true`
                    }
                  />
                </div>
              </div>
              <span className="hidden sm:inline font-semibold">
                {user?.displayName || "Account"}
              </span>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-2xl w-56 border"
            >
              <li>
                <Link to="/dashboard/profile">Profile</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard Home</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Drawer Layout */}
      <div className="drawer lg:drawer-open">
        <input id="dash-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content">
          {/* Page content */}
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </div>

        <div className="drawer-side">
          <label htmlFor="dash-drawer" className="drawer-overlay"></label>

          <aside className="w-72 min-h-full bg-base-100 border-r p-4">
            <div className="mb-4">
              <p className="text-xs uppercase opacity-60">Menu</p>
              <p className="font-bold text-lg">Dashboard</p>
            </div>

            {/* Common */}
            <nav className="space-y-1">
              <NavLink to="/dashboard" end className={navClass}>
                Overview
              </NavLink>
              <NavLink to="/dashboard/profile" className={navClass}>
                Profile
              </NavLink>
              <NavLink to="/" className={navClass}>
                Back to Home
              </NavLink>
            </nav>

            <div className="divider my-4" />

            {/* Role-based */}
            {!isAdmin ? (
              <nav className="space-y-1">
                {/* User role: minimum 2 items */}
                <NavLink to="/dashboard/my-issues" className={navClass}>
                  My Issues
                </NavLink>
                <NavLink to="/dashboard/my-contributions" className={navClass}>
                  My Contributions
                </NavLink>
              </nav>
            ) : (
              <nav className="space-y-1">
                {/* Admin role: minimum 3 items */}
                <NavLink to="/dashboard/manage-issues" className={navClass}>
                  Manage Issues
                </NavLink>
                <NavLink to="/dashboard/manage-users" className={navClass}>
                  Manage Users
                </NavLink>
                <NavLink to="/dashboard/reports" className={navClass}>
                  Reports & Analytics
                </NavLink>
              </nav>
            )}

            <div className="mt-6 rounded-2xl bg-base-200/40 p-4 border">
              <p className="text-sm font-semibold">Signed in as</p>
              <p className="text-sm opacity-70 break-all">{user?.email}</p>
>>>>>>> a714453 (m)
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
};

export default DashboardLayout;
=======
}
>>>>>>> a714453 (m)
