// src/pages/dashboard/AllUsersPage.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import useCurrentUser from "../../hooks/useCurrentUser";
import { FiUsers, FiFilter, FiShield, FiUserX } from "react-icons/fi";
import LoadingSpinner2nd from "../../Components/LoadingSpinner2nd";
import LoadingSpinnercopy from "../../Components/LoadingSpinnercopy";

const API_BASE = "http://localhost:3000";
const statusFilters = ["all", "active", "blocked"];

const roleChipClass = (role) => {
  switch (role) {
    case "admin":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "volunteer":
      return "bg-sky-50 text-sky-800 border-sky-200";
    default:
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }
};

const statusChipClass = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "blocked":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const AllUsersPage = () => {
  const { user } = useContext(AuthContext);
  const { dbUser, loadingDbUser } = useCurrentUser();

  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [actionId, setActionId] = useState(null);

  const limit = 10;

  useEffect(() => {
    if (!user?.email || !dbUser) return;
    if (dbUser.role !== "admin") return;

    const load = async () => {
      setLoading(true);
      setErr("");

      try {
        const token = await user.getIdToken();
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (status !== "all") params.set("status", status);

        const res = await fetch(`${API_BASE}/users?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load users.");
        }

        const data = await res.json();
        setUsers(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error(error);
        setErr(error.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.email, dbUser, page, status]);

  const handleStatusChangeFilter = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleToggleBlock = async (u) => {
    const newStatus = u.status === "active" ? "blocked" : "active";
    const confirmText =
      newStatus === "blocked"
        ? `Block ${u.email}? They will not be able to create donation requests.`
        : `Unblock ${u.email}?`;
    if (!window.confirm(confirmText)) return;

    try {
      setActionId(u._id);
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/users/${u._id}/status`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to change status.");
      }
      setUsers((prev) =>
        prev.map((item) =>
          item._id === u._id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      alert(error.message || "Status update failed.");
    } finally {
      setActionId(null);
    }
  };

  const handleMakeRole = async (u, role) => {
    if (u.role === role) return;

    if (!window.confirm(`Change role of ${u.email} from ${u.role} to ${role}?`))
      return;

    try {
      setActionId(u._id);
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/users/${u._id}/role`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to change role.");
      }

      setUsers((prev) =>
        prev.map((item) => (item._id === u._id ? { ...item, role } : item))
      );
    } catch (error) {
      alert(error.message || "Role change failed.");
    } finally {
      setActionId(null);
    }
  };

  if (loadingDbUser) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinnercopy />
      </div>
    );
  }

  if (dbUser.role !== "admin") {
    return (
      <section className="py-6">
        <div className="rounded-2xl shadow-lg border border-rose-100 bg-base-100 p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-rose-700">
            <FiShield className="w-5 h-5" />
            All Users
          </h2>
          <p className="text-sm text-rose-500">
            You do not have permission to view this page.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="rounded-3xl shadow-2xl border border-slate-100 bg-base-100 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <FiUsers className="w-4 h-4" />
              </span>
              User Management
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
              All Users
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Manage roles, block or unblock users, and review donor accounts.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="inline-flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{users.length} user(s) on this page</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs text-slate-500">
                Filter by status
              </span>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-base-100 px-3 py-1">
                <FiFilter className="w-4 h-4 text-slate-400" />
                <select
                  className="select select-xs border-0 bg-transparent focus:outline-none focus:ring-0 text-xs px-0"
                  value={status}
                  onChange={(e) => handleStatusChangeFilter(e.target.value)}
                >
                  {statusFilters.map((s) => (
                    <option key={s} value={s}>
                      {s === "all" ? "All users" : s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner2nd />
          </div>
        ) : users.length === 0 ? (
          <p className="text-sm text-slate-500 mt-2">
            No users found for this filter.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="table table-zebra-zebra">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="font-semibold">User</th>
                  <th className="font-semibold">Email</th>
                  <th className="font-semibold">Role</th>
                  <th className="font-semibold">Status</th>
                  <th className="font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60">
                    {/* Avatar + name */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full ring-2 ring-rose-100 ring-offset-2 ring-offset-base-100 overflow-hidden bg-base-200">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold uppercase text-slate-700">
                                {u.name?.[0] || "U"}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-900 truncate">
                            {u.name || "Unknown user"}
                          </p>
                          <p className="text-[11px] text-slate-500 capitalize">
                            {u.role}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="align-middle">
                      <p className="text-xs text-slate-700 truncate max-w-[200px]">
                        {u.email}
                      </p>
                    </td>

                    {/* Role pill */}
                    <td className="align-middle">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold capitalize ${roleChipClass(
                          u.role
                        )}`}
                      >
                        {u.role === "admin" && (
                          <FiShield className="w-3 h-3 opacity-80" />
                        )}
                        {u.role}
                      </span>
                    </td>

                    {/* Status pill */}
                    <td className="align-middle">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold capitalize ${statusChipClass(
                          u.status
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
                        {u.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="align-middle">
                      <div className="flex justify-end gap-1 flex-wrap">
                        <button
                          className={`btn btn-xs rounded-full border-0 ${
                            u.status === "active"
                              ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                          onClick={() => handleToggleBlock(u)}
                          disabled={actionId === u._id}
                        >
                          <FiUserX className="w-3 h-3" />
                          {u.status === "active" ? "Block" : "Unblock"}
                        </button>

                        <button
                          className="btn btn-xs rounded-full border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
                          onClick={() => handleMakeRole(u, "volunteer")}
                          disabled={actionId === u._id || u.role === "volunteer"}
                        >
                          Volunteer
                        </button>

                        <button
                          className="btn btn-xs rounded-full border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                          onClick={() => handleMakeRole(u, "admin")}
                          disabled={actionId === u._id || u.role === "admin"}
                        >
                          Admin
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50/60 border-t border-slate-100">
              <p className="text-[11px] text-slate-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-xs rounded-full"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <button
                  className="btn btn-xs rounded-full"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {err && <p className="text-error text-sm mt-3">{err}</p>}
      </div>
    </section>
  );
};

export default AllUsersPage;
