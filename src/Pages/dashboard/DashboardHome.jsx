<<<<<<< HEAD
// src/pages/dashboard/DashboardHome.jsx
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";
import { AuthContext } from "../../Provider/AuthProvider";
import { FiUsers, FiDollarSign, FiDroplet } from "react-icons/fi";
import LoadingSpinner2nd from "../../Components/LoadingSpinner2nd";
import LoadingSpinnercopy from "../../Components/LoadingSpinnercopy";

const API_BASE = "http://localhost:3000";

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const { dbUser, loadingDbUser } = useCurrentUser();

  const [recentRequests, setRecentRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loadingSection, setLoadingSection] = useState(false);

  const role = dbUser?.role || "donor";
  const roleLabel =
    role === "admin"
      ? "Administrator"
      : role === "volunteer"
      ? "Volunteer"
      : "Donor";

  useEffect(() => {
    if (!user?.email || !dbUser) return;

    const load = async () => {
      try {
        setError("");
        setLoadingSection(true);
        const token = await user.getIdToken();

        if (role === "donor") {
          const res = await fetch(
            `${API_BASE}/donation-requests/me?limit=3`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!res.ok) throw new Error("Failed to load recent requests.");
          const data = await res.json();
          setRecentRequests(data.items || []);
        } else {
          const res = await fetch(`${API_BASE}/stats/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to load stats.");
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoadingSection(false);
      }
    };

    load();
  }, [user?.email, dbUser, role]);

  if (loadingDbUser) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinnercopy />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome / hero card */}
      <section className="rounded-3xl shadow-2xl border border-slate-100 bg-base-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Dashboard
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900">
              Welcome back, {dbUser?.name || "User"}.
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              You are logged in as{" "}
              <span className="font-semibold capitalize">{roleLabel}</span>. Manage
              your activities and keep track of blood donation requests in one place.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Status: Active session
            </span>
            <p className="truncate max-w-xs">
              {dbUser?.email || user?.email || "No email available"}
            </p>
          </div>
        </div>
      </section>

      {/* Donor view: recent 3 requests */}
      {role === "donor" && (
        <section className="rounded-3xl shadow-xl border border-slate-100 bg-base-100 p-6 md:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="font-semibold text-lg md:text-xl text-slate-900">
                Recent Donation Requests
              </h2>
              <p className="text-xs text-slate-500">
                Shows your last 3 requests. Use this to quickly monitor and update
                their status.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/dashboard/create-donation-request"
                className="btn btn-sm rounded-full border-0 bg-slate-900 text-slate-50 hover:bg-slate-800"
              >
                New Request
              </Link>
              <Link
                to="/dashboard/my-donation-requests"
                className="btn btn-sm rounded-full btn-outline"
              >
                View all
              </Link>
            </div>
          </div>

          {loadingSection ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner2nd />
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              You have not created any donation request yet.
              <div className="mt-3">
                <Link
                  to="/dashboard/create-donation-request"
                  className="btn btn-sm rounded-full border-0 bg-gradient-to-r from-[#DC2626] via-[#EA384D] to-[#F97316] text-white font-semibold"
                >
                  Create your first request
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="table table-zebra-zebra">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th>Recipient</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Blood</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentRequests.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {req.recipientName}
                          </span>
                          {req.hospitalName && (
                            <span className="text-xs text-slate-500">
                              {req.hospitalName}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-xs sm:text-sm text-slate-600">
                        {req.recipientDistrict}, {req.recipientUpazila}
                      </td>
                      <td className="text-xs sm:text-sm text-slate-600">
                        {req.donationDate}
                      </td>
                      <td className="text-xs sm:text-sm text-slate-600">
                        {req.donationTime}
                      </td>
                      <td>
                        <span className="badge badge-sm border-0 text-white bg-gradient-to-r from-[#DC2626] to-[#F97316]">
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td className="capitalize text-xs sm:text-sm">
                        {req.status}
                      </td>
                      <td className="text-right space-x-1">
                        <Link
                          to={`/dashboard/edit-donation-request/${req._id}`}
                          className="btn btn-xs rounded-full btn-outline"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/donation-requests/${req._id}`}
                          className="btn btn-xs rounded-full border-0 bg-slate-900 text-slate-50 hover:bg-slate-800"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {error && (
            <p className="text-error text-sm mt-3">
              Failed to load data: {error}
            </p>
          )}
        </section>
      )}

      {/* Admin / Volunteer: stats cards */}
      {(role === "admin" || role === "volunteer") && (
        <section className="rounded-3xl shadow-xl border border-slate-100 bg-base-100 p-6 md:p-7">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-semibold text-lg md:text-xl text-slate-900">
                Overview
              </h2>
              <p className="text-xs text-slate-500">
                High-level metrics across users, funding, and blood donation
                requests.
              </p>
            </div>
          </div>

          {loadingSection && !stats ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner2nd />
            </div>
          ) : !stats ? (
            <p className="text-sm text-slate-500">
              No statistics available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Total donors */}
              <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50 p-4 flex items-center gap-4 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-700/60">
                  <FiUsers className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-300">
                    Total Donors
                  </p>
                  <p className="text-2xl font-bold leading-tight">
                    {stats.totalUsers ?? 0}
                  </p>
                </div>
              </div>

              {/* Total funding */}
              <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-500 to-orange-400 text-white p-4 flex items-center gap-4 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <FiDollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-rose-100">
                    Total Funding
                  </p>
                  <p className="text-2xl font-bold leading-tight">
                    ${Number(stats.totalFunding || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Total requests */}
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-500 to-teal-400 text-white p-4 flex items-center gap-4 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <FiDroplet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-emerald-100">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold leading-tight">
                    {stats.totalRequests ?? 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-error text-sm mt-3">
              Failed to load data: {error}
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default DashboardHome;
=======
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API = "https://b12-a10-copy-server.vercel.app";

const safeDate = (d) => {
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? null : x;
};

export default function DashboardHome() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch issues (public or private - token not required here)
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/issues`, { signal: controller.signal });
        const data = await res.json();

        // support shapes: [] or {result: []} or {data: []}
        const list =
          Array.isArray(data) ? data : data?.result || data?.data || [];
        setIssues(Array.isArray(list) ? list : []);
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  // Overview numbers (derived from backend list)
  const totals = useMemo(() => {
    const total = issues.length;

    const resolved = issues.filter((i) => {
      const s = (i.status || i.state || "").toLowerCase();
      return s === "resolved" || s === "done" || s === "completed";
    }).length;

    const pending = total - resolved;

    const totalGoal = issues.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    return { total, resolved, pending, totalGoal };
  }, [issues]);

  // Chart: Issues per category (Bar)
  const byCategory = useMemo(() => {
    const map = new Map();
    issues.forEach((i) => {
      const key = i.category || "Uncategorized";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  }, [issues]);

  // Chart: Issues over time (Line) - group by month
  const byMonth = useMemo(() => {
    const map = new Map();
    issues.forEach((i) => {
      const d = safeDate(i.date || i.createdAt);
      if (!d) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({ month, count }));
  }, [issues]);

  // Chart: Status distribution (Pie)
  const statusPie = useMemo(() => {
    const resolved = totals.resolved;
    const pending = totals.pending;
    return [
      { name: "Resolved", value: resolved },
      { name: "Pending", value: pending },
    ];
  }, [totals]);

  // Table: latest issues
  const latest = useMemo(() => {
    return [...issues]
      .sort((a, b) => {
        const da = safeDate(a.date || a.createdAt)?.getTime() || 0;
        const db = safeDate(b.date || b.createdAt)?.getTime() || 0;
        return db - da;
      })
      .slice(0, 8);
  }, [issues]);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Dashboard Overview</h1>
      <p className="mt-1 text-sm opacity-70">
        Real-time insights derived from backend issues data.
      </p>

      {/* Overview Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-base-100 p-5 shadow-sm">
          <p className="text-xs uppercase opacity-60">Total Issues</p>
          <p className="text-3xl font-bold mt-1">{totals.total}</p>
        </div>
        <div className="rounded-2xl border bg-base-100 p-5 shadow-sm">
          <p className="text-xs uppercase opacity-60">Resolved</p>
          <p className="text-3xl font-bold mt-1">{totals.resolved}</p>
        </div>
        <div className="rounded-2xl border bg-base-100 p-5 shadow-sm">
          <p className="text-xs uppercase opacity-60">Pending</p>
          <p className="text-3xl font-bold mt-1">{totals.pending}</p>
        </div>
        <div className="rounded-2xl border bg-base-100 p-5 shadow-sm">
          <p className="text-xs uppercase opacity-60">Total Goal (BDT)</p>
          <p className="text-3xl font-bold mt-1">
            {Math.round(totals.totalGoal).toLocaleString("en-BD")}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-base-100 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Issues by Category</h2>
            <span className="text-xs opacity-60">Bar Chart</span>
          </div>

          <div className="h-72 mt-3">
            {loading ? (
              <div className="h-full grid place-items-center">
                <span className="loading loading-spinner" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Status Split</h2>
            <span className="text-xs opacity-60">Pie Chart</span>
          </div>

          <div className="h-72 mt-3">
            {loading ? (
              <div className="h-full grid place-items-center">
                <span className="loading loading-spinner" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPie} dataKey="value" nameKey="name" outerRadius={90} label>
                    {/* No manual colors required; recharts will default,
                        but it may look same. If you want, you can add colors later. */}
                    {statusPie.map((_, idx) => (
                      <Cell key={idx} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-base-100 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Issues Over Time</h2>
          <span className="text-xs opacity-60">Line Chart</span>
        </div>

        <div className="h-72 mt-3">
          {loading ? (
            <div className="h-full grid place-items-center">
              <span className="loading loading-spinner" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Dynamic Table */}
      <div className="mt-6 rounded-2xl border bg-base-100 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Latest Issues</h2>
          <Link className="btn btn-sm btn-outline rounded-xl" to="/all-issues">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date</th>
                <th className="text-right">Goal</th>
              </tr>
            </thead>
            <tbody>
              {latest.map((i) => (
                <tr key={i._id}>
                  <td className="font-semibold">
                    <Link className="link link-primary" to={`/issues/${i._id}`}>
                      {i.title || "Untitled"}
                    </Link>
                  </td>
                  <td>{i.category || "—"}</td>
                  <td className="max-w-[220px] truncate">{i.location || "—"}</td>
                  <td className="text-sm opacity-70">
                    {safeDate(i.date || i.createdAt)
                      ? safeDate(i.date || i.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="text-right font-semibold">
                    ৳ {(Number(i.amount) || 0).toLocaleString("en-BD")}
                  </td>
                </tr>
              ))}

              {!loading && latest.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center opacity-70 py-8">
                    No issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
>>>>>>> a714453 (m)
