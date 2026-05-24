// src/Pages/MyContribution.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import Container from "../Components/Container";
import { AuthContext } from "../Provider/AuthProvider";
import { toast } from "react-toastify";
import LoadingSpinnercopy from "../Components/LoadingSpinnercopy";

import Lottie from "lottie-react";
import NoData from "./../animation/no data found.json";

const API =
  import.meta.env.VITE_API_BASE || "https://b12-a10-copy-server.vercel.app";

const currency = (n) => {
  const v = Number(n) || 0;
  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `৳ ${v}`;
  }
};

export default function MyContribution() {
  const { user } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Load current user's contributions
  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();

    (async () => {
      try {
        const token = user.getIdToken
          ? await user.getIdToken()
          : user.accessToken || user?.stsTokenManager?.accessToken;

        const email = user.email;

        const res = await fetch(
          `${API}/my-contribution?email=${encodeURIComponent(email)}`,
          {
            headers: { Authorization: `Bearer ${token ?? ""}` },
            signal: controller.signal,
          }
        );

        if (res.status === 401 || res.status === 403) {
          toast.info("Please log in again");
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const normalized = (Array.isArray(data) ? data : []).map((d) => {
          const id =
            typeof d._id === "string"
              ? d._id
              : d._id?.$oid ?? d._id?.toString?.() ?? "";

          const title = d.issueTitle || d.title || "Untitled Issue";
          const category = d.category || "—";
          const paid = Number(d.amount) || 0;
          const when = d.date || d.createdAt || Date.now();

          return { ...d, _id: id, title, category, paid, when };
        });

        setRows(normalized);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          toast.error("Failed to load your contributions.");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [user]);

  const totalPaid = useMemo(
    () => rows.reduce((s, r) => s + (Number(r.paid) || 0), 0),
    [rows]
  );

  const latestDate = useMemo(() => {
    if (!rows.length) return null;
    const maxTime = Math.max(...rows.map((r) => new Date(r.when).getTime()));
    return new Date(maxTime);
  }, [rows]);

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-GB", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  // Single receipt for a row
  const downloadReceipt = async (row) => {
    try {
      setDownloading(true);

      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;

      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Clean-Up Contribution Receipt", 14, 16);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

      const email = user?.email || "—";
      const lines = [
        `Contributor: ${
          row.contributorName || user?.displayName || "Anonymous"
        }`,
        `Email: ${email}`,
        `Issue: ${row.title}`,
        `Category: ${row.category}`,
        `Contribution ID: ${row._id}`,
        `Date: ${fmtDate(row.when)}`,
        `Amount: ${currency(row.paid)}`,
      ];
      let y = 32;
      lines.forEach((t) => {
        doc.text(t, 14, y);
        y += 6;
      });

      y += 6;
      doc.setFontSize(9);
      doc.text("Thank you for helping keep our community clean!", 14, y);

      const safeEmail = (email || "user").replace(/[^a-zA-Z0-9_-]/g, "_");
      doc.save(`receipt_${safeEmail}_${row._id}.pdf`);
    } catch (e) {
      console.error("Receipt PDF error:", e);
      toast.error("Failed to create receipt PDF.");
    } finally {
      setDownloading(false);
    }
  };

  // Full report for all rows
  const downloadAllReport = async () => {
    if (!rows.length) return toast.info("No contributions to export.");
    try {
      setDownloading(true);

      const jsPDFModule = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");

      const jsPDF = jsPDFModule.default;
      const autoTable = autoTableModule.default || autoTableModule.autoTable;

      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("My Clean-Up Contributions", 14, 16);
      doc.setFontSize(10);
      doc.text(`User: ${user?.email || "—"}`, 14, 22);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(
        `Total Paid: ${currency(totalPaid)} | Records: ${rows.length}`,
        14,
        34
      );

      const body = rows.map((r, idx) => [
        idx + 1,
        r.title,
        r.category,
        currency(r.paid),
        fmtDate(r.when),
      ]);

      autoTable(doc, {
        head: [["#", "Issue Title", "Category", "Paid Amount", "Date"]],
        body,
        startY: 40,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [54, 184, 100] },
      });

      const safeEmail = (user?.email || "user").replace(/[^a-zA-Z0-9_-]/g, "_");
      doc.save(`my_contributions_${safeEmail}.pdf`);
    } catch (e) {
      console.error("Download all PDF error:", e);
      toast.error("Failed to export PDF.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinnercopy />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className=" py-8">
        <div className=" space-y-6">
          {/* Header + Summary */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                className="text-sm uppercase tracking-wide bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    bg-clip-text text-transparent
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A] font-semibold"
              >
                Contributions
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mt-1">
                My Contributions
              </h2>
              <p className="mt-1 text-sm opacity-70 max-w-md">
                View your contribution history, download receipts, and export a
                full PDF report of your support.
              </p>
            </div>

            <div className="stats shadow bg-base-100 border border-base-200/60">
              <div className="stat">
                <div className="stat-title">Total Paid</div>
                <div className="stat-value bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    bg-clip-text text-transparent
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A]">
                  {currency(totalPaid)}
                </div>
              </div>
              <div className="stat hidden sm:block">
                <div className="stat-title">Contributions</div>
                <div className="stat-value bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    bg-clip-text text-transparent
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A]">{rows.length || 0}</div>
              </div>
              <div className="stat hidden md:block">
                <div className="stat-title">Latest</div>
                <div className="stat-value text-xs md:text-sm">
                  {latestDate ? fmtDate(latestDate) : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Main card */}
          <div className="card bg-base-100 shadow-xl border border-base-200/60">
            <div className="card-body p-0">
              {/* Top bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 pt-6 pb-4 border-b border-base-200/70">
                <div>
                  <h3 className="font-semibold text-lg">
                    Contribution History
                  </h3>
                  <p className="text-sm opacity-70">
                    Download individual receipts or export everything as a PDF
                    report.
                  </p>
                </div>
                <button
                  className="
                    btn btn-sm
                    border border-[#1a6a3d]
                    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
                    text-white font-semibold
                    transition-colors duration-300
                    hover:from-[#48D978] hover:to-[#2B8C4A]
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                  disabled={downloading || !rows.length}
                  onClick={downloadAllReport}
                >
                  {downloading ? "Preparing…" : "Download All (PDF)"}
                </button>
              </div>

              {/* Table / Empty state */}
              {rows.length ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra-zebra">
                    <thead className="bg-base-200/70 sticky top-0 z-10 text-xs uppercase tracking-wide">
                      <tr>
                        <th>#</th>
                        <th>Issue Title</th>
                        <th>Category</th>
                        <th className="text-right">Paid Amount</th>
                        <th>Date</th>
                        <th className="w-40 text-center">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={r._id} className="text-sm">
                          <td className="align-top pt-4">{i + 1}</td>
                          <td className="max-w-[260px] align-top pt-4">
                            <p className="font-medium truncate">{r.title}</p>
                          </td>
                          <td className="align-top pt-4">{r.category}</td>
                          <td className="font-semibold text-right align-top pt-4 whitespace-nowrap">
                            {currency(r.paid)}
                          </td>
                          <td className="align-top pt-4 whitespace-nowrap">
                            {fmtDate(r.when)}
                          </td>
                          <td className="align-top pt-3">
                            <div className="flex justify-center">
                              <button
                                className="
                                  btn btn-xs sm:btn-sm btn-outline
                                  border-[#1a6a3d]
                                  hover:bg-[#1a6a3d] hover:text-white
                                "
                                onClick={() => downloadReceipt(r)}
                                disabled={downloading}
                              >
                                Receipt (PDF)
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-10 px-4">
                  <div className="max-w-md mx-auto flex flex-col items-center">
                    <Lottie
                      animationData={NoData}
                      loop={true}
                      style={{
                        width: "260px",
                        height: "260px",
                        margin: "0 auto",
                      }}
                    />
                    <p className="text-lg font-semibold mt-4">
                      You haven’t made any contributions yet.
                    </p>
                    <p className="text-sm opacity-70 mt-1 text-center">
                      When you contribute to an issue, your payment history and
                      receipts will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
