// src/pages/dashboard/AllDonationRequestsPage.jsx
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import useCurrentUser from "../../hooks/useCurrentUser";
import {
  FiDroplet,
  FiFilter,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiTrash2,
  FiEdit2,
  FiEye,
} from "react-icons/fi";
import LoadingSpinner2nd from "../../Components/LoadingSpinner2nd";
import LoadingSpinnercopy from "../../Components/LoadingSpinnercopy";

const API_BASE = "http://localhost:3000";
const statusFilters = ["all", "pending", "inprogress", "done", "canceled"];

const statusChipClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "inprogress":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "done":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "canceled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const AllDonationRequestsPage = () => {
  const { user } = useContext(AuthContext);
  const { dbUser, loadingDbUser } = useCurrentUser();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [actionId, setActionId] = useState(null);

  const limit = 10;
  const role = dbUser?.role;
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!user?.email || !dbUser) return;
    if (role !== "admin" && role !== "volunteer") return;

    const load = async () => {
      setLoading(true);
      setErr("");

      try {
        const token = await user.getIdToken();
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (status !== "all") params.set("status", status);

        const res = await fetch(
          `${API_BASE}/donation-requests?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load requests.");
        }

        const data = await res.json();
        setRequests(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error(error);
        setErr(error.message || "Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.email, dbUser, page, status, role]);

  const handleStatusFilterChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleUpdateStatus = async (reqItem, newStatus) => {
    if (!window.confirm(`Change status to ${newStatus}?`)) return;

    try {
      setActionId(reqItem._id);
      const token = await user.getIdToken();
      const res = await fetch(
        `${API_BASE}/donation-requests/${reqItem._id}/status`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update status.");
      }

      setRequests((prev) =>
        prev.map((r) =>
          r._id === reqItem._id ? { ...r, status: newStatus } : r
        )
      );
    } catch (error) {
      alert(error.message || "Status update failed.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this donation request?")) return;
    try {
      setActionId(id);
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/donation-requests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete request.");
      }

      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      alert(error.message || "Delete failed.");
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

  if (role !== "admin" && role !== "volunteer") {
    return (
      <section className="py-6">
        <div className="rounded-2xl shadow-lg border border-rose-100 bg-base-100 p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-rose-700">
            <FiDroplet className="w-5 h-5" />
            All Blood Donation Requests
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
                <FiDroplet className="w-4 h-4" />
              </span>
              Requests Management
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
              All Blood Donation Requests
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Monitor, update, and manage every blood donation request in the
              system.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="inline-flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span>{requests.length} request(s) on this page</span>
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
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                >
                  {statusFilters.map((s) => (
                    <option key={s} value={s}>
                      {s === "all" ? "All requests" : s}
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
        ) : requests.length === 0 ? (
          <p className="text-sm text-slate-500 mt-2">
            No donation requests found for this filter.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="table table-zebra-zebra">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="font-semibold">Recipient</th>
                  <th className="font-semibold">Location</th>
                  <th className="font-semibold">Schedule</th>
                  <th className="font-semibold">Blood</th>
                  <th className="font-semibold">Status</th>
                  <th className="font-semibold">Requester</th>
                  <th className="font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((reqItem) => (
                  <tr key={reqItem._id} className="hover:bg-slate-50/60">
                    {/* Recipient */}
                    <td className="align-middle">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-sm text-slate-900">
                          {reqItem.recipientName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          #{reqItem._id.slice(-6)}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="align-middle">
                      <div className="flex items-start gap-2 text-xs text-slate-600">
                        <FiMapPin className="w-3 h-3 mt-[2px] text-slate-400" />
                        <div className="flex flex-col">
                          <span>
                            {reqItem.recipientDistrict},{" "}
                            {reqItem.recipientUpazila}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {reqItem.hospitalName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="align-middle">
                      <div className="flex items-start gap-2 text-xs text-slate-600">
                        <FiCalendar className="w-3 h-3 mt-[2px] text-slate-400" />
                        <div>
                          <div>{reqItem.donationDate}</div>
                          <div className="text-[11px] text-slate-400">
                            {reqItem.donationTime}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Blood */}
                    <td className="align-middle">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-rose-200 bg-rose-50 text-rose-700 text-[11px] font-semibold">
                        <FiDroplet className="w-3 h-3" />
                        {reqItem.bloodGroup}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="align-middle">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold capitalize ${statusChipClass(
                          reqItem.status
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
                        {reqItem.status}
                      </span>
                    </td>

                    {/* Requester */}
                    <td className="align-middle">
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <FiUser className="w-3 h-3 mt-[2px] text-slate-400" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {reqItem.requesterName}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                            {reqItem.requesterEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="align-middle">
                      <div className="flex justify-end flex-wrap gap-1">
                        {["pending", "inprogress"].includes(
                          reqItem.status
                        ) && (
                          <>
                            <button
                              className="btn btn-xs rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              onClick={() =>
                                handleUpdateStatus(reqItem, "done")
                              }
                              disabled={actionId === reqItem._id}
                            >
                              Done
                            </button>
                            <button
                              className="btn btn-xs rounded-full bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                              onClick={() =>
                                handleUpdateStatus(reqItem, "canceled")
                              }
                              disabled={actionId === reqItem._id}
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {isAdmin && (
                          <>
                            <button
                              className="btn btn-xs rounded-full border border-slate-200 bg-base-100 hover:bg-slate-50 text-slate-700"
                              onClick={() =>
                                navigate(
                                  `/dashboard/edit-donation-request/${reqItem._id}`
                                )
                              }
                            >
                              <FiEdit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              className="btn btn-xs rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700"
                              onClick={() => handleDelete(reqItem._id)}
                              disabled={actionId === reqItem._id}
                            >
                              <FiTrash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </>
                        )}

                        <Link
                          to={`/donation-requests/${reqItem._id}`}
                          className="btn btn-xs rounded-full border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700"
                        >
                          <FiEye className="w-3 h-3" />
                          View
                        </Link>
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

export default AllDonationRequestsPage;
