import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import LoadingSpinner2nd from "../../Components/LoadingSpinner2nd";
import LoadingSpinnercopy from "../../Components/LoadingSpinnercopy";

const API_BASE = "http://localhost:3000";

const statusColorClasses = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  inprogress: "bg-sky-50 text-sky-700 border-sky-200",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  canceled: "bg-rose-50 text-rose-700 border-rose-200",
};

const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE}/donation-requests/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load details.");
        }

        const data = await res.json();
        setRequest(data);
      } catch (error) {
        console.error(error);
        setErr(error.message || "Failed to load details.");
      } finally {
        setLoading(false);
      }
    };

    if (user) load();
  }, [id, user]);

  const handleConfirmDonate = async () => {
    if (!request) return;
    setSaving(true);
    setErr("");
    setSuccess("");

    try {
      const token = await user.getIdToken();
      const donor = {
        name: user.displayName || user.email,
        email: user.email,
      };

      const res = await fetch(`${API_BASE}/donation-requests/${id}/status`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "inprogress", donor }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to confirm donation.");
      }

      setRequest((prev) =>
        prev ? { ...prev, status: "inprogress", donor } : prev
      );
      setSuccess("Thank you! You are now assigned as donor.");
      setModalOpen(false);
    } catch (error) {
      setErr(error.message || "Failed to confirm donation.");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(""), 2500);
    }
  };

  if (loading || !request) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinnercopy />
      </div>
    );
  }

  const statusKey = request.status?.toLowerCase() || "pending";
  const statusClasses =
    statusColorClasses[statusKey] || statusColorClasses.pending;

  return (
    <div className="max-w-3xl mx-auto rounded-3xl shadow-2xl border border-slate-100 bg-base-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-xs font-semibold">
              🩸
            </span>
            Donation Request Details
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            {request.recipientName || "Blood donation request"}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Review full details before committing to donate.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold capitalize ${statusClasses}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
            {request.status}
          </span>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-xs rounded-full border border-slate-200"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 text-sm">
        {/* Left column */}
        <div className="space-y-3">
          <div>
            <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-500">
              Recipient
            </p>
            <p className="mt-1 text-slate-900 font-semibold">
              {request.recipientName}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-500">
              Location
            </p>
            <p className="mt-1 text-slate-800">
              {request.recipientDistrict}, {request.recipientUpazila}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-500">
              Hospital
            </p>
            <p className="mt-1 text-slate-800">{request.hospitalName}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {request.fullAddress}
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-500">
                Blood Group
              </p>
              <span className="inline-flex mt-1 items-center justify-center px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-100">
                {request.bloodGroup}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 text-right">
                Date &amp; Time
              </p>
              <p className="mt-1 text-slate-800 text-right">
                {request.donationDate}
              </p>
              <p className="text-xs text-slate-500 text-right">
                at {request.donationTime}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-500">
              Requester
            </p>
            <p className="mt-1 text-slate-900 font-semibold">
              {request.requesterName}
            </p>
            <p className="text-xs text-slate-500">{request.requesterEmail}</p>
          </div>

          {request.status === "inprogress" && request.donor && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2">
              <p className="text-[11px] font-semibold tracking-wide uppercase text-emerald-700 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Assigned Donor
              </p>
              <p className="mt-1 text-sm text-emerald-900 font-semibold">
                {request.donor.name}
              </p>
              <p className="text-xs text-emerald-800">
                {request.donor.email}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Request message */}
      <div className="mt-6">
        <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 mb-1.5">
          Request Message
        </p>
        <div className="rounded-2xl border border-slate-100 bg-base-200/60 px-4 py-3 text-sm text-slate-800 whitespace-pre-wrap">
          {request.requestMessage}
        </div>
      </div>

      {err && (
        <p className="text-error text-sm mt-3">
          {err}
        </p>
      )}
      {success && (
        <p className="text-success text-sm mt-3">
          {success}
        </p>
      )}

      {/* Donate button only when pending */}
      {request.status === "pending" && (
        <div className="mt-6 flex justify-end">
          <button
            className="btn rounded-full border-0 bg-gradient-to-r from-[#DC2626] via-[#EA384D] to-[#F97316] text-white font-semibold px-6 shadow-lg shadow-red-300/60 hover:shadow-red-400/80 transition"
            onClick={() => setModalOpen(true)}
          >
            Donate
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-2xl shadow-2xl border border-slate-100 p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-1">Confirm Donation</h3>
            <p className="text-xs text-slate-500 mb-4">
              You are about to volunteer as a donor for this request. Your
              contact information will be shared with the requester.
            </p>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 mb-4 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                Donor Information
              </p>
              <p className="text-slate-900 font-semibold">
                {user.displayName || user.email}
              </p>
              <p className="text-xs text-slate-600">{user.email}</p>
            </div>

            {err && (
              <p className="text-error text-sm mb-2">
                {err}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                className="btn btn-ghost btn-sm rounded-full border border-slate-200"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm rounded-full border-0 bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-semibold px-5"
                onClick={handleConfirmDonate}
                disabled={saving}
              >
                {saving ? "Confirming..." : "Confirm Donation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationRequestDetails;
