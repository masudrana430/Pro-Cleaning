import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Container from "../Components/Container";
import { AuthContext } from "../Provider/AuthProvider";
import toast from "react-hot-toast";

const API = (
  import.meta.env.VITE_API_URL || "https://b12-a10-copy-server.vercel.app"
).replace(/\/+$/, "");

const categories = [
  "Garbage",
  "Broken Footpath",
  "Illegal Dumping",
  "Waterlogging",
  "Other",
];

const toId = (id) =>
  typeof id === "string" ? id : id?.$oid ?? id?.toString?.() ?? "";

export default function UpdateIssueModal() {
  const { state } = useLocation(); // may contain { issue } from Link state
  const initialIssue = state?.issue || null;

  const { id } = useParams(); // fallback fetch by :id
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [issue, setIssue] = useState(initialIssue);
  const [loading, setLoading] = useState(!initialIssue);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const idStr = useMemo(() => toId(issue?._id || id), [issue?._id, id]);

  // Form state
  const [form, setForm] = useState({
    title: "",
    category: "Other",
    amount: 0,
    description: "",
    status: "ongoing", // UI values: "ongoing" | "ended" (ended -> resolved)
  });

  // Fetch if we didn’t get issue via state (deep link / refresh)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (initialIssue) {
        // seed form from state
        setForm({
          title: initialIssue.title ?? "",
          category: initialIssue.category ?? "Other",
          amount: Number(initialIssue.amount ?? 0),
          description: initialIssue.description ?? "",
          status:
            (initialIssue.status ?? "ongoing").toLowerCase() === "resolved"
              ? "ended"
              : initialIssue.status ?? "ongoing",
        });
        return;
      }
      try {
        if (!user) return navigate("/auth/login");
        const token = await user.getIdToken();
        const res = await fetch(`${API}/issues/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const iss = data?.result ?? null;
        if (mounted) {
          setIssue(iss);
          setForm({
            title: iss?.title ?? "",
            category: iss?.category ?? "Other",
            amount: Number(iss?.amount ?? 0),
            description: iss?.description ?? "",
            status:
              (iss?.status ?? "ongoing").toLowerCase() === "resolved"
                ? "ended"
                : iss?.status ?? "ongoing",
          });
        }
      } catch (e) {
        console.error(e);
        if (mounted) setError("Failed to load issue.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, navigate]);

  // If we had the issue in state, set it and stop loading
  useEffect(() => {
    if (initialIssue) {
      setIssue(initialIssue);
      setLoading(false);
    }
    console.log(initialIssue);
  }, [initialIssue]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.category) return "Category is required.";
    if (Number.isNaN(form.amount) || form.amount < 0)
      return "Amount must be ≥ 0.";
    if (!form.description.trim()) return "Description is required.";
    if (!["ongoing", "ended"].includes(form.status)) return "Invalid status.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    if (!user) return navigate("/auth/login");

    const payload = {
      title: form.title.trim(),
      category: form.category,
      amount: Number(form.amount) || 0,
      description: form.description.trim(),
      status: form.status === "ended" ? "resolved" : "ongoing",
    };

    try {
      setPending(true);
      setError("");

      const token = await user.getIdToken();
      const res = await fetch(`${API}/issues/${idStr}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Update failed (${res.status})`);

      // If backend returns updated doc and you want it:
      // const data = await res.json();

      // ✅ Show success toast
      toast.success("Issue updated successfully!");

      // ✅ Navigate back to My Issues
      navigate("/my-issues");
    } catch (err) {
      console.error(err);
      setError("Failed to update. Please try again.");
      // ✅ Error toast
      toast.error("Failed to update issue.");
    } finally {
      setPending(false);
    }
  };

  if (user === undefined || loading) {
    return (
      <Container>
        <div className="min-h-[50vh] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </Container>
    );
  }

  if (error && !issue) {
    return (
      <Container>
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <h2 className="text-xl font-semibold">
            {error || "Issue not found"}
          </h2>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-12 md:mb-16 mt-12 md:mt-16 card bg-base-100 w-full max-w-2xl mx-auto shadow-2xl rounded-2xl">
        <div className="card-body p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Update Issue</h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="label font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={onChange}
                required
                className="input input-bordered w-full"
                placeholder="Enter title"
              />
            </div>

            {/* Category + Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label font-medium">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  required
                  className="select select-bordered w-full"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label font-medium">Amount (BDT)</label>
                <input
                  type="number"
                  min={0}
                  name="amount"
                  value={form.amount}
                  onChange={onChange}
                  required
                  className="input input-bordered w-full"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                required
                rows={5}
                className="textarea textarea-bordered w-full"
                placeholder="Describe the issue"
              />
            </div>

            {/* Status (radio) */}
            <div>
              <label className="label font-medium">Status</label>
              <div className="flex items-center gap-6">
                <label className="label cursor-pointer">
                  <span className="label-text mr-2">Ongoing</span>
                  <input
                    type="radio"
                    name="status"
                    className="radio"
                    checked={form.status === "ongoing"}
                    onChange={() =>
                      setForm((f) => ({ ...f, status: "ongoing" }))
                    }
                  />
                </label>
                <label className="label cursor-pointer">
                  <span className="label-text mr-2">Ended</span>
                  <input
                    type="radio"
                    name="status"
                    className="radio"
                    checked={form.status === "ended"}
                    onChange={() => setForm((f) => ({ ...f, status: "ended" }))}
                  />
                </label>
              </div>
              <p className="text-xs opacity-70 mt-1">
                “Ended” will be saved as{" "}
                <span className="font-medium">resolved</span>.
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate(-1)}
                disabled={pending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="
                  btn btn-sm
                  border border-[#1a6a3d]
                  bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
                  text-white
                  transition-colors duration-300
                  hover:from-[#48D978] hover:to-[#2B8C4A]
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
                disabled={pending}
              >
                {pending ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
