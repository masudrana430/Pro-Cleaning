// src/pages/dashboard/ProfilePage.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import useCurrentUser from "../../hooks/useCurrentUser";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import LoadingSpinner2nd from "../../Components/LoadingSpinner2nd";
import LoadingSpinnercopy from "../../Components/LoadingSpinnercopy";

const API_BASE = "http://localhost:3000";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { dbUser, loadingDbUser } = useCurrentUser();

  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (dbUser) {
      const base = {
        name: dbUser.name || "",
        email: dbUser.email || user?.email || "",
        avatar: dbUser.avatar || "",
        bloodGroup: dbUser.bloodGroup || "",
        district: dbUser.district || "",
        upazila: dbUser.upazila || "",
      };
      setFormData(base);
      setOriginalData(base);
    }
  }, [dbUser, user?.email]);

  if (loadingDbUser || !formData) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinnercopy />
      </div>
    );
  }

  const handleChange = (field, value) => {
    if (!editing) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (!originalData) return;
    setFormData(originalData);
    setEditing(false);
    setErr("");
    setSuccess("");
  };

  const handleSave = async () => {
    setErr("");
    setSuccess("");
    setSaving(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/users/${dbUser._id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          avatar: formData.avatar,
          bloodGroup: formData.bloodGroup,
          district: formData.district,
          upazila: formData.upazila,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update profile.");
      }
      setSuccess("Profile updated successfully.");
      setOriginalData(formData);
      setEditing(false);
    } catch (error) {
      setErr(error.message || "Profile update failed.");
    } finally {
      setSaving(false);
      setTimeout(() => {
        setErr("");
        setSuccess("");
      }, 2500);
    }
  };

  const roleLabel = dbUser?.role || "donor";
  const statusLabel = dbUser?.status || "active";

  return (
    <div className="max-w-3xl mx-auto">
      <section className="rounded-3xl shadow-2xl border border-slate-100 bg-base-100 p-6 md:p-8 space-y-6">
        {/* Header: title + actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              Account
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              My Profile
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
                Role: {roleLabel}
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  statusLabel === "blocked"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                    statusLabel === "blocked" ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                />
                Status: {statusLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editing ? (
              <button
                className="btn btn-sm rounded-full btn-outline flex items-center gap-2"
                onClick={() => setEditing(true)}
              >
                <FiEdit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <>
                <button
                  className="btn btn-sm rounded-full btn-ghost flex items-center gap-2"
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <FiX className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  className="btn btn-sm rounded-full btn-primary flex items-center gap-2"
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <FiSave className="w-4 h-4" />
                  {saving ? "Saving…" : "Save"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Avatar + main identity */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 border-b border-slate-100 pb-6">
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-slate-100 shadow-md bg-base-200">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-600">
                    {formData.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-900 text-slate-50">
                {roleLabel}
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold text-slate-900">
              {formData.name || "Unnamed User"}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{formData.email}</p>
            <p className="mt-3 text-xs text-slate-500">
              You can update your name, avatar URL and address details here. Email
              is used for authentication and cannot be changed from this page.
            </p>
          </div>
        </div>

        {/* Form fields */}
        <form className="space-y-5">
          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Full Name
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered rounded-xl"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                readOnly={!editing}
              />
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email (not editable)
                </span>
              </label>
              <input
                type="email"
                className="input input-bordered rounded-xl bg-base-200 cursor-not-allowed text-slate-500"
                value={formData.email}
                readOnly
              />
            </div>
          </div>

          {/* Avatar */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                Avatar URL
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered rounded-xl"
              value={formData.avatar}
              onChange={(e) => handleChange("avatar", e.target.value)}
              readOnly={!editing}
              placeholder="https://example.com/avatar.jpg"
            />
            <span className="text-[11px] text-slate-400 mt-1">
              Paste a direct image URL. Changes will reflect in your dashboard and
              navbar avatar.
            </span>
          </div>

          {/* Blood group & address */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Blood Group
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered rounded-xl"
                value={formData.bloodGroup}
                onChange={(e) =>
                  handleChange("bloodGroup", e.target.value.toUpperCase())
                }
                readOnly={!editing}
                placeholder="A+, O-, etc."
              />
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                  District
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered rounded-xl"
                value={formData.district}
                onChange={(e) => handleChange("district", e.target.value)}
                readOnly={!editing}
                placeholder="e.g. Dhaka"
              />
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Upazila
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered rounded-xl"
                value={formData.upazila}
                onChange={(e) => handleChange("upazila", e.target.value)}
                readOnly={!editing}
                placeholder="e.g. Dhanmondi"
              />
            </div>
          </div>

          {/* Feedback messages */}
          {err && (
            <div className="alert alert-error mt-2 py-2 text-sm">
              <span>{err}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success mt-2 py-2 text-sm">
              <span>{success}</span>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
