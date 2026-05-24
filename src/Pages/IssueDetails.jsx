import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import Container from "../Components/Container";
import { AuthContext } from "../Provider/AuthProvider";
import { toast } from "react-toastify";
import {
  MdLocationOn,
  MdAttachMoney,
  MdOutlineMail,
  MdOutlineAccessTime,
  MdOutlineCelebration,
  MdOutlineVolunteerActivism,
} from "react-icons/md";
import LoadingSpinnercopy from "../Components/LoadingSpinnercopy";

import Lottie from "lottie-react";
import NoData from "./../animation/No Result Green theme.json";

// use your deployed API base (or localhost while dev)
const API = "https://b12-a10-copy-server.vercel.app";

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

const toId = (id) =>
  typeof id === "string" ? id : id?.$oid ?? id?.toString?.() ?? "";

export default function IssueDetails() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { id } = useParams();

  const { user } = useContext(AuthContext);
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  // contribution modal + form
  const [openContrib, setOpenContrib] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contrib, setContrib] = useState({
    title: "",
    amount: "",
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  // contributors list
  const [contributors, setContributors] = useState([]);
  const [loadingContribs, setLoadingContribs] = useState(true);

  // ----- Fetch issue (auth-protected on your API)
  //this is for private details page
  // useEffect(() => {
  //   if (!id || !user) return;
  //   const controller = new AbortController();

  //   (async () => {
  //     try {
  //       const token = user.getIdToken
  //         ? await user.getIdToken()
  //         : user.accessToken || user?.stsTokenManager?.accessToken;

  //       const res = await fetch(`${API}/issues/${id}`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token ?? ""}`,
  //         },
  //         signal: controller.signal,
  //       });

  //       if (res.status === 401 || res.status === 403) {
  //         navigate("/auth/login");
  //         return;
  //       }
  //       if (!res.ok) throw new Error(`Failed to load issue: ${res.status}`);
  //       const data = await res.json();
  //       setIssue(data?.result ?? null);
  //     } catch (e) {
  //       if (e.name !== "AbortError") console.error(e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();

  //   return () => controller.abort();
  // }, [id, user, navigate]);


  // ----- Fetch issue (PUBLIC)
  //this is for public details page
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`${API}/issues/${id}`, {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Failed to load issue: ${res.status}`);
        const data = await res.json();
        setIssue(data?.result ?? null);
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  const idStr = useMemo(() => toId(issue?._id || id), [issue?._id, id]);

  // ----- Fetch contributors for this issue
  useEffect(() => {
    if (!idStr) return;
    const controller = new AbortController();
    (async () => {
      try {
        setLoadingContribs(true);
        const res = await fetch(
          `${API}/contributions?issueId=${encodeURIComponent(idStr)}`,
          { signal: controller.signal }
        );
        if (!res.ok)
          throw new Error(`Failed to load contributions: ${res.status}`);
        const data = await res.json();
        setContributors(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setLoadingContribs(false);
      }
    })();
    return () => controller.abort();
  }, [idStr]);

  // ----- UI helpers
  if (loading || navigation.state === "loading") {
    return (
      <Container>
        <LoadingSpinnercopy />
      </Container>
    );
  }
  if (!issue) {
    return (
      <Container>
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <h2 className="text-xl font-semibold">Issue not found</h2>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </Container>
    );
  }

  const {
    _id,
    title = "Untitled Issue",
    category = "Uncategorized",
    location = "—",
    description = "No description provided.",
    image,
    amount: suggestedBudget,
    email = "—",
    date,
  } = issue;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  // progress
  const totalCollected = contributors.reduce(
    (s, c) => s + (Number(c.amount) || 0),
    0
  );
  const goal = Number(suggestedBudget) || 0;
  const pct = goal
    ? Math.min(100, Math.round((totalCollected / goal) * 100))
    : 0;

    // this is for private details page
  // ----- Open modal prefilled
  // const openContribution = () => {
  //   setContrib({
  //     title,
  //     amount: "",
  //     name: user?.displayName || "",
  //     phone: "",
  //     address: "",
  //     note: "",
  //   });
  //   setOpenContrib(true);
  // };


  // this is for public details page
  const openContribution = () => {
    if (!user?.email) {
      toast.info("Please log in to contribute.");
      navigate("/auth/login");
      return;
    }

    setContrib({
      title,
      amount: "",
      name: user?.displayName || "",
      phone: "",
      address: "",
      note: "",
    });
    setOpenContrib(true);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setContrib((c) => ({ ...c, [name]: value }));
  };

  // ----- Submit contribution
  const submitContribution = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      toast.info("Please log in to contribute.");
      navigate("/auth/login");
      return;
    }
    const amt = Number(contrib.amount);
    if (!amt || amt <= 0)
      return toast.warn("Please enter a valid amount (BDT)");

    const payload = {
      issueId: idStr,
      issueTitle: title,
      amount: amt,
      contributorName: contrib.name?.trim() || user.displayName || "Anonymous",
      email: user.email,
      phone: contrib.phone?.trim() || "",
      address: contrib.address?.trim() || "",
      note: contrib.note?.trim() || "",
      date: new Date(), // not an input; recorded now
      avatar: user.photoURL || "", // optional, for table row
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API}/contribution`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Thank you for your contribution!");

      // Refresh contributors list
      const listRes = await fetch(
        `${API}/contributions?issueId=${encodeURIComponent(idStr)}`
      );
      const list = (await listRes.json()) || [];
      setContributors(Array.isArray(list) ? list : []);

      setOpenContrib(false);
    } catch (e) {
      console.error(e);
      // toast.error("Failed to contribute. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="max-w-5xl mx-auto py-6">
        <button className="btn btn-ghost mb-4" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* HERO */}
        <div className="rounded-2xl overflow-hidden shadow-xl border bg-base-100">
          <div className="relative">
            <div className="aspect-[16/6] bg-base-200">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-sm opacity-60">
                  No image available
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="badge badge-success">{category}</span>
                <span className="badge badge-outline text-white border-white/40">
                  <MdOutlineAccessTime className="text-lg" />
                  <span className="ml-1">{formattedDate}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight drop-shadow">
                {title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-3 text-sm opacity-95">
                <span className="inline-flex items-center gap-1">
                  <MdLocationOn className="text-lg" /> {location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MdOutlineMail className="text-lg" /> {email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MdAttachMoney className="text-lg" /> Goal:{" "}
                  <b>{currency(suggestedBudget || 0)}</b>
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className="btn btn-sm border border-[#1a6a3d]
    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    text-white font-semibold
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A]"
                  onClick={openContribution}
                >
                  <MdOutlineVolunteerActivism className="text-xl" />
                  Contribute
                </button>
                {/* this is for private details page */}
                {/* <button
                  className="btn btn-outline"
                  onClick={() => setOpenContrib(true)}
                >
                  Pay Clean-Up Contribution
                </button> */}

                {/* this is for public details page */}
                <button className="btn btn-outline" onClick={openContribution}>
                  Pay Clean-Up Contribution
                </button>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="p-5 sm:p-8">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="stat bg-base-200 rounded-xl">
                <div className="stat-title">Collected</div>
                <div
                  className="
    stat-value
    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    bg-clip-text text-transparent
  "
                >
                  {currency(totalCollected)}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-xl">
                <div className="stat-title">Goal</div>
                <div className="stat-value">
                  {currency(suggestedBudget || 0)}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-xl">
                <div className="stat-title">Progress</div>
                <div className="stat-value">{pct}%</div>
              </div>
              <div className="stat bg-base-200 rounded-xl">
                <div className="stat-title">Supporters</div>
                <div className="stat-value flex items-center gap-2">
                  {contributors.length}
                  <MdOutlineCelebration className="text-2xl text-warning" />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1 text-sm opacity-80">
                <span>Raised {currency(totalCollected)}</span>
                <span>
                  Target {currency(suggestedBudget || 0)} • {pct}%
                </span>
              </div>
              <progress
                className="progress progress-success w-full"
                value={pct}
                max="100"
              />
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Issue Details</h3>
              <p className="text-base-content/80 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Info Boxes */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-base-200">
                <p className="text-xs uppercase text-base-content/60">
                  Location
                </p>
                <p className="font-medium">{location}</p>
              </div>
              <div className="p-4 rounded-xl bg-base-200">
                <p className="text-xs uppercase text-base-content/60">
                  Issue ID
                </p>
                <p className="font-mono text-sm break-all">{idStr}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contributors Table */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold">Contributors</h3>
            {contributors.length > 0 && (
              <span className="text-sm opacity-70">
                {contributors.length}{" "}
                {contributors.length === 1 ? "person" : "people"} contributed
              </span>
            )}
          </div>

          {loadingContribs ? (
            <div className="py-6">
              <span className="loading loading-spinner" />
            </div>
          ) : contributors.length ? (
            <div className="overflow-x-auto rounded-xl border bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th>Contributor</th>
                    <th>Amount</th>
                    <th>Note</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contributors.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10">
                              <img
                                src={
                                  c.avatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    c.contributorName || "User"
                                  )}&background=36B864&color=fff&size=80&bold=true`
                                }
                                alt={c.contributorName || "User"}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">
                              {c.contributorName || "Anonymous"}
                            </div>
                            <div className="text-sm opacity-70">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="font-semibold">{currency(c.amount)}</td>
                      <td className="max-w-[320px]">
                        <span className="truncate inline-block align-middle">
                          {c.note || "—"}
                        </span>
                      </td>
                      <td className="text-sm opacity-70">
                        {c.date ? new Date(c.date).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border bg-base-100 p-6 text-center opacity-80">
              <div className="mt-6 flex flex-col items-center">
                <Lottie
                  animationData={NoData}
                  loop={true}
                  style={{
                    width: "400px",
                    height: "400px",
                    margin: "0 auto",
                  }}
                />
              </div>
              <p className="text-lg mt-4 font-medium">
                No contributions yet. Be the first to contribute!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contribution Modal */}
      {openContrib && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Contribute to Clean-Up</h3>

            <form
              onSubmit={submitContribution}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Issue Title (read only) */}
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text">Issue Title</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  value={title}
                  readOnly
                />
              </div>

              {/* Amount */}
              <div>
                <label className="label">
                  <span className="label-text">Amount (BDT)</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <span className="opacity-60">৳</span>
                  <input
                    type="number"
                    min="1"
                    name="amount"
                    value={contrib.amount}
                    onChange={onChange}
                    className="grow outline-none bg-transparent"
                    placeholder="e.g., 200"
                    required
                  />
                </label>
              </div>

              {/* Contributor Name */}
              <div>
                <label className="label">
                  <span className="label-text">Contributor Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={contrib.name}
                  onChange={onChange}
                  className="input input-bordered w-full"
                  placeholder="Your name"
                  required
                />
              </div>

              {/* Email (read only) */}
              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  value={user?.email || ""}
                  readOnly
                />
              </div>

              {/* Phone */}
              <div>
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={contrib.phone}
                  onChange={onChange}
                  className="input input-bordered w-full"
                  placeholder="01XXXXXXXXX"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={contrib.address}
                  onChange={onChange}
                  className="input input-bordered w-full"
                  placeholder="Street, City"
                />
              </div>

              {/* Date (display only) */}
              <div className="md:col-span-2 text-sm text-base-content/70">
                <b>Date:</b> {new Date().toLocaleString()}
              </div>

              {/* Additional info */}
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text">Additional info (optional)</span>
                </label>
                <textarea
                  name="note"
                  value={contrib.note}
                  onChange={onChange}
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  placeholder="Any message for the organizers"
                />
              </div>

              <div className="md:col-span-2 modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setOpenContrib(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${
                    submitting ? "btn-disabled" : ""
                  }`}
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : "Submit Contribution"}
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setOpenContrib(false)}
          />
        </div>
      )}
    </Container>
  );
}
