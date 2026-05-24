// src/pages/PublicDonationRequests.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../Components/Container";
import LoadingSpinner2nd from "../Components/LoadingSpinner2nd";

const API_BASE = "http://localhost:3000";

const PublicDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${API_BASE}/public/donation-requests`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load donation requests.");
        }
        const data = await res.json();
        setRequests(data || []);
      } catch (error) {
        console.error(error);
        setErr(error.message || "Failed to load donation requests.");
      } finally {
        setLoading(false);
      }
    };

    // Requirement: show all pending requests
    load();
  }, []);

  return (
    <section className="py-12 md:py-16">
      <Container>
        {/* header */}
        <div className=" mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Public Requests
          </div>
          <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Blood Donation Requests
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Showing all{" "}
                <span className="font-semibold text-rose-600">pending</span>{" "}
                blood donation requests that need a donor.
              </p>
            </div>
            <div className="text-xs text-slate-500 md:text-right">
              Updated in real-time as new requests are created.
            </div>
          </div>
        </div>

        {/* card */}
        <div className=" bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-sm text-slate-500">
              <LoadingSpinner2nd />
              Loading pending donation requests…
            </div>
          )}

          {err && (
            <p className="text-error text-sm mb-4">
              {err}
            </p>
          )}

          {!loading && !err && requests.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-500">
              There are no pending donation requests right now.
            </div>
          )}

          {!loading && !err && requests.length > 0 && (
            <>
              {/* summary row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <p className="text-sm text-slate-600">
                  {requests.length} request
                  {requests.length > 1 ? "s" : ""} waiting for donors.
                </p>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Status: pending
                </span>
              </div>

              {/* table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="table table-zebra-zebra">
                  <thead className="bg-slate-50/80">
                    <tr className="text-xs uppercase tracking-wide text-slate-500">
                      <th className="font-semibold">Recipient</th>
                      <th className="font-semibold">Location</th>
                      <th className="font-semibold">Blood</th>
                      <th className="font-semibold">Date</th>
                      <th className="font-semibold">Time</th>
                      <th className="font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r._id} className="text-sm">
                        <td className="align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {r.recipientName}
                            </span>
                            {r.hospitalName && (
                              <span className="text-xs text-slate-500">
                                {r.hospitalName}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="align-middle text-xs sm:text-sm text-slate-600">
                          {r.recipientDistrict}, {r.recipientUpazila}
                        </td>
                        <td className="align-middle">
                          <span className="badge badge-sm border-0 font-semibold text-white bg-gradient-to-r from-[#DC2626] to-[#F97316]">
                            {r.bloodGroup}
                          </span>
                        </td>
                        <td className="align-middle text-xs sm:text-sm text-slate-600">
                          {r.donationDate}
                        </td>
                        <td className="align-middle text-xs sm:text-sm text-slate-600">
                          {r.donationTime}
                        </td>
                        <td className="align-middle text-right">
                          <Link
                            to={`/donation-requests/${r._id}`}
                            className="btn btn-xs sm:btn-sm rounded-full border-0
                              bg-gradient-to-r from-[#DC2626] via-[#EA384D] to-[#F97316]
                              text-white font-semibold"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
};

export default PublicDonationRequests;
