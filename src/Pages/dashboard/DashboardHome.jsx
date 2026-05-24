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

const safeDate = (dateValue) => {
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function DashboardHome() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadIssues = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/issues`, {
          signal: controller.signal,
        });

        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : data?.result || data?.data || [];

        setIssues(Array.isArray(list) ? list : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load dashboard issues:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadIssues();

    return () => controller.abort();
  }, []);

  const totals = useMemo(() => {
    const total = issues.length;

    const resolved = issues.filter((issue) => {
      const status = (issue.status || issue.state || "").toLowerCase();
      return (
        status === "resolved" ||
        status === "done" ||
        status === "completed"
      );
    }).length;

    const pending = total - resolved;

    const totalGoal = issues.reduce((sum, issue) => {
      return sum + (Number(issue.amount) || 0);
    }, 0);

    return {
      total,
      resolved,
      pending,
      totalGoal,
    };
  }, [issues]);

  const byCategory = useMemo(() => {
    const map = new Map();

    issues.forEach((issue) => {
      const category = issue.category || "Uncategorized";
      map.set(category, (map.get(category) || 0) + 1);
    });

    return Array.from(map.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  }, [issues]);

  const byMonth = useMemo(() => {
    const map = new Map();

    issues.forEach((issue) => {
      const date = safeDate(issue.date || issue.createdAt);
      if (!date) return;

      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      map.set(month, (map.get(month) || 0) + 1);
    });

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({
        month,
        count,
      }));
  }, [issues]);

  const statusPie = useMemo(() => {
    return [
      {
        name: "Resolved",
        value: totals.resolved,
      },
      {
        name: "Pending",
        value: totals.pending,
      },
    ];
  }, [totals]);

  const latest = useMemo(() => {
    return [...issues]
      .sort((a, b) => {
        const dateA = safeDate(a.date || a.createdAt)?.getTime() || 0;
        const dateB = safeDate(b.date || b.createdAt)?.getTime() || 0;
        return dateB - dateA;
      })
      .slice(0, 8);
  }, [issues]);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold">
        Dashboard Overview
      </h1>

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
                  <Pie
                    data={statusPie}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {statusPie.map((item, index) => (
                      <Cell key={`${item.name}-${index}`} />
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

      {/* Latest Issues Table */}
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
              {latest.map((issue) => {
                const date = safeDate(issue.date || issue.createdAt);

                return (
                  <tr key={issue._id}>
                    <td className="font-semibold">
                      <Link
                        className="link link-primary"
                        to={`/issues/${issue._id}`}
                      >
                        {issue.title || "Untitled"}
                      </Link>
                    </td>

                    <td>{issue.category || "—"}</td>

                    <td className="max-w-[220px] truncate">
                      {issue.location || "—"}
                    </td>

                    <td className="text-sm opacity-70">
                      {date ? date.toLocaleDateString() : "—"}
                    </td>

                    <td className="text-right font-semibold">
                      ৳ {(Number(issue.amount) || 0).toLocaleString("en-BD")}
                    </td>
                  </tr>
                );
              })}

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