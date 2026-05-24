import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import Container from "../Components/Container";
import IssuesTableCard from "../Components/IssuesTableCard";
import DeleteIssueModal from "./DeleteIssueModal";
import LoadingSpinnercopy from "../Components/LoadingSpinnercopy";

import Lottie from "lottie-react";
import NoData from "./../animation/No-Data.json";

import toast, { Toaster } from "react-hot-toast";

const MyIssues = () => {
  const { user } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    // Don’t fetch until user is available
    if (!user?.email) return;

    const token = user.accessToken || user?.stsTokenManager?.accessToken || "";

    setLoading(true);

    fetch(
      `https://b12-a10-copy-server.vercel.app/my-issues?email=${user.email}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch issues");
        }
        return response.json();
      })
      .then((data) => {
        setIssues(data || []);
      })
      .catch((error) => {
        console.error("Error fetching my issues:", error);
        toast.error("Failed to load your issues. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.email, user?.accessToken, user?.stsTokenManager?.accessToken]);

  // Loading state
  if (loading) {
    return (
      <Container>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinnercopy />
        </div>
      </Container>
    );
  }

  // No user logged in
  if (!user?.email) {
    return (
      <Container>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            Please sign in to view your issues
          </h2>
          <p className="opacity-70 max-w-md">
            Once you&apos;re logged in, you&apos;ll see all the issues
            associated with your account here.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Toast container */}
      <Toaster position="top-right" />

      <div className=" py-8">
        <div className=" space-y-6">
          {/* Header / summary */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p
                className="text-sm uppercase tracking-wide bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    bg-clip-text text-transparent
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A] font-semibold"
              >
                Dashboard
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mt-1">My Issues</h2>
              <p className="mt-1 text-sm md:text-base opacity-70 max-w-lg">
                Track, manage, and update all the issues you&apos;ve reported in
                one place.
              </p>
            </div>

            <div className="stats shadow hidden md:flex bg-base-100">
              <div className="stat">
                <div className="stat-title">Total Issues</div>
                <div
                  className="stat-value bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    bg-clip-text text-transparent
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A]"
                >
                  {issues.length}
                </div>
              </div>
              {/* You can wire real counts here later if you have statuses */}
              {/* <div className="stat">
                <div className="stat-title">Open</div>
                <div className="stat-value">4</div>
              </div>
              <div className="stat">
                <div className="stat-title">Resolved</div>
                <div className="stat-value text-success">2</div>
              </div> */}
            </div>
          </div>

          {/* Table card */}
          <div className="card bg-base-100 shadow-xl border border-base-200/60">
            <div className="card-body p-0">
              {/* Top bar inside card */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between px-6 pt-6 pb-4 border-b border-base-200/70">
                <div>
                  <h3 className="font-semibold text-lg">All Issues</h3>
                  <p className="text-sm opacity-70">
                    You can update or delete your issues directly from this
                    table.
                  </p>
                </div>

                {/* Placeholder for future filters / search */}
                {/* <div className="join">
                  <button className="btn btn-ghost btn-xs sm:btn-sm join-item">
                    All
                  </button>
                  <button className="btn btn-ghost btn-xs sm:btn-sm join-item">
                    Open
                  </button>
                  <button className="btn btn-ghost btn-xs sm:btn-sm join-item">
                    Resolved
                  </button>
                </div> */}
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra-zebra">
                  <thead className="bg-base-200/70 sticky top-0 z-10">
                    <tr className="text-sm">
                      <th>Issue</th>
                      <th>Category</th>
                      <th>Budget</th>
                      <th>Status</th>
                      <th className="w-56 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.length ? (
                      issues.map((issue) => (
                        <IssuesTableCard
                          key={issue._id}
                          issue={issue}
                          // Open delete modal
                          onAskDelete={(it) => setToDelete(it)}
                          // When an issue is deleted from a row action (if supported)
                          onDeleted={(id) => {
                            setIssues((prev) =>
                              prev.filter((it) => it._id !== id)
                            );
                            toast.success("Issue deleted successfully!");
                          }}
                          // When an issue is updated (status / fields)
                          onUpdated={(updatedIssue) => {
                            setIssues((prev) =>
                              prev.map((it) =>
                                it._id === updatedIssue._id ? updatedIssue : it
                              )
                            );
                            toast.success("Issue updated successfully!");
                          }}
                        />
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center opacity-70 py-10"
                        >
                          <div className="mt-6 flex flex-col items-center">
                            <Lottie
                              animationData={NoData}
                              loop={true}
                              style={{
                                width: "320px",
                                height: "320px",
                                margin: "0 auto",
                              }}
                            />
                            <p className="text-lg mt-4 font-medium">
                              No issues found
                            </p>
                            <p className="text-sm mt-1 max-w-sm">
                              You haven&apos;t reported any issues yet. Once you
                              do, they&apos;ll appear here for quick management.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeleteIssueModal
        open={!!toDelete}
        issue={toDelete}
        onClose={() => setToDelete(null)}
        onDeleted={(id) => {
          setIssues((prev) => prev.filter((it) => it._id !== id));
          setToDelete(null);
          toast.success("Issue deleted successfully!");
        }}
      />
    </Container>
  );
};

export default MyIssues;
