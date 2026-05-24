// src/pages/dashboard/MyDonationRequests.jsx
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import LoadingSpinner2nd from "../../Components/LoadingSpinner2nd";
import LoadingSpinnercopy from "../../Components/LoadingSpinnercopy";

const API_BASE = "http://localhost:3000";
const statusFilters = ["all", "pending", "inprogress", "done", "canceled"];

const MyDonationRequests = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const limit = 5;

  useEffect(() => {
    if (!user?.email) return;

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
          `${API_BASE}/donation-requests/me?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to load donation requests.");

        const data = await res.json();
        setRequests(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error(error);
        setErr(error.message || "Failed to load donation requests.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.email, page, status]);

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirmed) return;

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/donation-requests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete request.");

      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      alert(error.message || "Delete failed.");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/donation-requests/${id}/status`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status.");

      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
    } catch (error) {
      alert(error.message || "Status update failed.");
    }
  };

  const renderStatusBadge = (s) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium";
    switch (s) {
      case "pending":
        return (
          <span className={`${base} bg-amber-50 text-amber-700`}>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5" />
            Pending
          </span>
        );
      case "inprogress":
        return (
          <span className={`${base} bg-blue-50 text-blue-700`}>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5" />
            In progress
          </span>
        );
      case "done":
        return (
          <span className={`${base} bg-emerald-50 text-emerald-700`}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Done
          </span>
        );
      case "canceled":
        return (
          <span className={`${base} bg-rose-50 text-rose-700`}>
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-1.5" />
            Canceled
          </span>
        );
      default:
        return (
          <span className={`${base} bg-slate-100 text-slate-700`}>
            {s || "Unknown"}
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl shadow-2xl border border-slate-100 bg-base-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Requests
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            My Donation Requests
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage all your blood donation requests with filtering and quick
            actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Status controls appear only when a request is in progress.
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-slate-500">
              Filter by status:
            </span>
            <select
              className="select select-bordered select-sm rounded-full"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {statusFilters.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All" : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table / states */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinnercopy />
        </div>
      ) : requests.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-500">
          No donation requests found for this filter.
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
        <>
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="table table-zebra-zebra">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Blood</th>
                  <th>Status</th>
                  <th>Donor Info</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {requests.map((req) => (
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
                    <td>{renderStatusBadge(req.status)}</td>
                    <td className="text-xs sm:text-sm text-slate-600">
                      {req.status === "inprogress" && req.donor ? (
                        <>
                          <span className="block font-medium">
                            {req.donor.name}
                          </span>
                          <span className="block text-xs text-slate-500">
                            {req.donor.email}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="text-right space-x-1 whitespace-nowrap">
                      {req.status === "inprogress" && (
                        <>
                          <button
                            className="btn btn-xs rounded-full btn-success"
                            onClick={() => updateStatus(req._id, "done")}
                          >
                            Done
                          </button>
                          <button
                            className="btn btn-xs rounded-full btn-error"
                            onClick={() => updateStatus(req._id, "canceled")}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {/* Optional: edit button for full spec compliance */}
                      <Link
                        to={`/dashboard/edit-donation-request/${req._id}`}
                        className="btn btn-xs rounded-full btn-outline"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-xs rounded-full btn-outline btn-error"
                        onClick={() => handleDelete(req._id)}
                      >
                        Delete
                      </button>
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

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
            <p className="text-xs text-slate-500">
              Showing page {page} of {totalPages}.
            </p>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm rounded-full"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="text-sm text-slate-600">
                {page} / {totalPages}
              </span>
              <button
                className="btn btn-sm rounded-full"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {err && (
        <p className="text-error text-sm mt-3">
          {err}
        </p>
      )}
    </div>
  );
};

export default MyDonationRequests;
