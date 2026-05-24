import React, { useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../Provider/AuthProvider";
import Container from "../Components/Container";
import {
  MdOutlineTitle,
  MdOutlineCategory,
  MdOutlineLocationOn,
  MdOutlineImage,
  MdOutlinePayments,
} from "react-icons/md";
import LoadingSpinnercopy from "../Components/LoadingSpinnercopy";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://b12-a10-copy-server.vercel.app";

const CATEGORIES = ["Garbage", "Footpath", "Dumping", "Waterlogging"];
const MAX_DESC = 500;

const AddIssues = () => {
  const { user } = useContext(AuthContext);

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    location: "",
    description: "",
    image: "",
    amount: "",
    status: "ongoing",
  });

  const todayDisplay = useMemo(() => new Date().toLocaleString(), []);

  const onChange = (key) => (e) => {
    const v = e.target.value;
    setForm((f) => ({
      ...f,
      [key]: key === "description" ? v.slice(0, MAX_DESC) : v,
    }));
  };

  const resetForm = () =>
    setForm({
      title: "",
      category: CATEGORIES[0],
      location: "",
      description: "",
      image: "",
      amount: "",
      status: "ongoing",
    });

  const onSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.title?.trim()) return toast.warn("Please enter issue title");
    if (!form.location?.trim()) return toast.warn("Please enter location");
    if (!form.description?.trim())
      return toast.warn("Please enter description");
    const amountNum = Number(form.amount);
    if (!amountNum || amountNum <= 0)
      return toast.warn("Please enter a valid budget amount (BDT)");

    const payload = {
      title: form.title.trim(),
      category: form.category,
      location: form.location.trim(),
      description: form.description.trim(),
      image: form.image?.trim(),
      amount: amountNum,
      status: form.status || "ongoing",
      date: new Date(),
      email: user?.email || "",
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }

      toast.success("Issue submitted successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit issue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="  py-8">
        {/* Header panel */}
        <div
          className="
    rounded-2xl
    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    text-white p-6 shadow-md
  "
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold">
                Report a Community Issue
              </h2>
              <p className="opacity-90">
                Help keep your neighborhood cleaner and safer.
              </p>
            </div>
            <div className="text-sm md:text-right">
              <div>
                <span className="opacity-80">Reporter:</span>{" "}
                <span className="font-semibold">{user?.email || "—"}</span>
              </div>
              <div>
                <span className="opacity-80">Date:</span>{" "}
                <span className="font-semibold">{todayDisplay}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="card bg-base-100 shadow-xl mt-6 border">
          <div className="card-body p-6 md:p-8">
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6">
              {/* Row: title + category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text">Issue Title</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <MdOutlineTitle className="text-base-content/60 text-lg" />
                    <input
                      type="text"
                      className="grow"
                      placeholder="e.g., Garbage spilling over near Road 8"
                      value={form.title}
                      onChange={onChange("title")}
                      required
                    />
                  </label>
                </div>

                {/* Category */}
                <div>
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <MdOutlineCategory className="text-base-content/60 text-lg" />
                    <select
                      className="grow bg-transparent outline-none"
                      value={form.category}
                      onChange={onChange("category")}
                      required
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {/* Row: location */}
              <div>
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <MdOutlineLocationOn className="text-base-content/60 text-lg" />
                  <input
                    type="text"
                    className="grow"
                    placeholder="e.g., Mohakhali, Dhaka"
                    value={form.location}
                    onChange={onChange("location")}
                    required
                  />
                </label>
                <p className="mt-1 text-xs text-base-content/60">
                  Be specific: street, landmark, area name, etc.
                </p>
              </div>

              {/* Row: description */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <span className="text-xs opacity-60">
                    {form.description.length}/{MAX_DESC}
                  </span>
                </div>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={5}
                  placeholder="Describe the issue clearly (what, where, severity, hazards)"
                  value={form.description}
                  onChange={onChange("description")}
                  required
                />
              </div>

              {/* Row: image + amount + status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text">Image URL (optional)</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <MdOutlineImage className="text-base-content/60 text-lg" />
                    <input
                      type="url"
                      className="grow"
                      placeholder="https://example.com/photo.jpg"
                      value={form.image}
                      onChange={onChange("image")}
                    />
                  </label>

                  {/* Preview */}
                  <div className="mt-3 rounded-xl overflow-hidden border bg-base-200/60">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt="Issue preview"
                        className="w-full h-56 object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://placehold.co/800x520?text=Preview+Not+Available";
                        }}
                      />
                    ) : (
                      <div className="h-56 grid place-items-center text-sm opacity-60">
                        No image selected
                      </div>
                    )}
                  </div>
                </div>

                {/* Budget + Status */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">
                        Suggested Fix Budget (BDT)
                      </span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                      <span className="opacity-70 text-lg">৳</span>
                      <MdOutlinePayments className="text-base-content/60 text-lg" />
                      <input
                        type="number"
                        min="1"
                        className="grow"
                        placeholder="e.g., 200"
                        value={form.amount}
                        onChange={onChange("amount")}
                        required
                      />
                    </label>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={form.status}
                      onChange={onChange("status")}
                    >
                      <option value="ongoing">ongoing</option>
                      <option value="pending">pending</option>
                      <option value="in-progress">in-progress</option>
                      <option value="resolved">resolved</option>
                    </select>
                    <p className="mt-1 text-xs text-base-content/60">
                      New reports default to <b>ongoing</b>.
                    </p>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Your Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered w-full"
                      value={user?.email || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className={`
    btn
    text-white
    border border-[#1a6a3d]
    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    hover:from-[#48D978] hover:to-[#2B8C4A]
    transition-colors duration-300
    ${submitting ? "btn-disabled" : ""}
  `}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <LoadingSpinnercopy className="h-2 w-2 mr-2 border-white" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Issue"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* tiny foot note */}
        <p className="text-xs text-base-content/60 mt-3">
          By submitting, you agree that your report may be shared with local
          authorities for action and transparency.
        </p>
      </div>
    </Container>
  );
};

export default AddIssues;
