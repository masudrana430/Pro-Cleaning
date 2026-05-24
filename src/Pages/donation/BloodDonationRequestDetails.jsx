// src/pages/donation/BloodDonationRequestDetails.jsx
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import useCurrentUser from "../../hooks/useCurrentUser";
import LoadingSpinner2nd from "../../Components/LoadingSpinner2nd";

const API_BASE = "http://localhost:3000";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  inprogress: "bg-sky-50 text-sky-700 border-sky-200",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  canceled: "bg-rose-50 text-rose-700 border-rose-200",
};

const BloodDonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { dbUser, loadingDbUser } = useCurrentUser();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Load request details
  useEffect(() => {
    if (!user || !id) return;

    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE}/donation-requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load donation request.");
        }

        const data = await res.json();
        setRequest(data);
      } catch (error) {
        console.error(error);
        setErr(error.message || "Failed to load donation request.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, user]);

  const handleOpenModal = () => {
    setSuccessMsg("");
    setErr("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleConfirmDonation = async (e) => {
    e.preventDefault();
    if (!request) return;

    try {
      setSubmitting(true);
      setErr("");
      setSuccessMsg("");

      const token = await user.getIdToken();
      const donorName = dbUser?.name || user?.displayName || "";
      const donorEmail = user?.email;

      const res = await fetch(
        `${API_BASE}/donation-requests/${request._id}/status`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "inprogress",
            donor: { name: donorName, email: donorEmail },
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to confirm donation.");
      }

      setRequest((prev) =>
        prev
          ? {
              ...prev,
              status: "inprogress",
              donor: { name: donorName, email: donorEmail },
            }
          : prev
      );

      setSuccessMsg(
        "You have confirmed this donation. Status is now in progress."
      );
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      setErr(error.message || "Failed to confirm donation.");
    } finally {
      setSubmitting(false);
    }
  };

  const donorNameDisplay = dbUser?.name || user?.displayName || "Unknown";
  const donorEmailDisplay = user?.email || "";

  const isPending = request?.status === "pending";
  const isRequester = request && user && request.requesterEmail === user.email;
  const showDonateButton = isPending && !isRequester;

  const statusKey = (request?.status || "pending").toLowerCase();
  const statusClass =
    statusStyles[statusKey] || statusStyles.pending;

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto rounded-3xl shadow-2xl border border-slate-100 bg-base-100 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500 flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-xs font-semibold">
                🩸
              </span>
              Blood Donation Request
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
              {request?.recipientName || "Donation Request Details"}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Review full details and confirm if you want to volunteer as a donor.
            </p>
          </div>

          {request && (
            <div className="flex flex-col items-end gap-2">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold capitalize ${statusClass}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
                {request.status}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-xs font-semibold">
                Blood Group: {request.bloodGroup}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        {loading || loadingDbUser ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner2nd />
          </div>
        ) : err ? (
          <p className="text-error text-sm mt-4">{err}</p>
        ) : !request ? (
          <p className="text-sm text-gray-500 mt-4">
            Donation request not found.
          </p>
        ) : (
          <>
            {/* Donor info chip if exists */}
            {request.donor && (
              <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-xs md:text-sm">
                <p className="font-semibold text-emerald-800 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Donor Assigned
                </p>
                <p className="mt-1 text-emerald-900">
                  {request.donor.name} ({request.donor.email})
                </p>
              </div>
            )}

            {/* Sections */}
            <div className="space-y-6 text-sm">
              {/* Requester Info */}
              <div className="rounded-2xl border border-slate-100 bg-base-200/40 p-4">
                <h2 className="font-semibold text-base mb-2 text-slate-900">
                  Requester Info
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </span>
                    <p className="mt-1 text-slate-900">
                      {request.requesterName}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </span>
                    <p className="mt-1 text-slate-900">
                      {request.requesterEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recipient & Location */}
              <div className="rounded-2xl border border-slate-100 bg-base-200/40 p-4">
                <h2 className="font-semibold text-base mb-2 text-slate-900">
                  Recipient & Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Recipient Name
                    </span>
                    <p className="mt-1 text-slate-900">
                      {request.recipientName}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      District
                    </span>
                    <p className="mt-1 text-slate-900">
                      {request.recipientDistrict}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Upazila
                    </span>
                    <p className="mt-1 text-slate-900">
                      {request.recipientUpazila}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Hospital
                    </span>
                    <p className="mt-1 text-slate-900">
                      {request.hospitalName}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Full Address
                    </span>
                    <p className="mt-1 text-slate-900">
                      {request.fullAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Donation Details */}
              <div className="rounded-2xl border border-slate-100 bg-base-200/40 p-4">
                <h2 className="font-semibold text-base mb-2 text-slate-900">
                  Donation Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Blood Group
                    </span>
                    <p className="mt-1 text-slate-900">
                      {request.bloodGroup}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </span>
                    <p className="mt-1 text-slate-900">
                      {request.donationDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Time
                    </span>
                    <p className="mt-1 text-slate-900">
                      {request.donationTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h2 className="font-semibold text-base mb-2 text-slate-900">
                  Request Message
                </h2>
                <div className="rounded-2xl border border-slate-100 bg-base-200/60 px-4 py-3 text-slate-800 whitespace-pre-line">
                  {request.requestMessage}
                </div>
              </div>
            </div>

            {/* Footer / actions */}
            <div className="mt-8 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Please confirm only if you are truly available to donate.
              </div>

              <div className="flex items-center gap-3">
                {showDonateButton && (
                  <button
                    className="btn rounded-full border-0 bg-gradient-to-r from-[#DC2626] via-[#EA384D] to-[#F97316] text-white font-semibold px-6 shadow-lg shadow-red-300/60 hover:shadow-red-400/80 transition"
                    onClick={handleOpenModal}
                  >
                    Donate
                  </button>
                )}

                {!showDonateButton && isRequester && (
                  <p className="text-xs text-gray-500">
                    You created this request; you cannot donate to yourself.
                  </p>
                )}
                {!showDonateButton && !isRequester && !isPending && (
                  <p className="text-xs text-gray-500">
                    This request is no longer pending.
                  </p>
                )}

                {successMsg && (
                  <p className="text-success text-sm">{successMsg}</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-2">Confirm Donation</h3>
            <p className="text-xs text-slate-500 mb-4">
              You are about to confirm that you will donate blood for this
              request. Your name and email will be shared with the requester.
            </p>

            <form onSubmit={handleConfirmDonation} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs uppercase tracking-wide text-slate-500">
                    Donor Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={donorNameDisplay}
                  readOnly
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs uppercase tracking-wide text-slate-500">
                    Donor Email
                  </span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={donorEmailDisplay}
                  readOnly
                />
              </div>

              {err && (
                <p className="text-error text-xs mt-1">{err}</p>
              )}

              <div className="modal-action flex justify-between items-center">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm rounded-full"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm rounded-full border-0 bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-semibold px-5"
                  disabled={submitting}
                >
                  {submitting ? "Confirming..." : "Confirm Donation"}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={handleCloseModal} />
        </div>
      )}
    </section>
  );
};

export default BloodDonationRequestDetails;
