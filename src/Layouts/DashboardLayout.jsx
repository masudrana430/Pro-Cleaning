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
  const { role, loading } = useUserRole();

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

            {!isAdmin ? (
              <nav className="space-y-1">
                <NavLink to="/dashboard/my-issues" className={navClass}>
                  My Issues
                </NavLink>
                <NavLink to="/dashboard/my-contributions" className={navClass}>
                  My Contributions
                </NavLink>
              </nav>
            ) : (
              <nav className="space-y-1">
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
              <p className="text-sm opacity-70 break-all">
                {user?.email || "No email available"}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}