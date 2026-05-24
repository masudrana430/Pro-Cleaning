// src/pages/dashboard/EditDonationRequest.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import LoadingSpinner2nd from "../../Components/LoadingSpinner2nd";
import LoadingSpinnercopy from "../../Components/LoadingSpinnercopy";

const API_BASE = "http://localhost:3000";

const districtOptions = ["Dhaka", "Chattogram", "Rajshahi", "Khulna"];
const upazilaOptionsByDistrict = {
  Dhaka: ["Dhanmondi", "Mirpur", "Uttara"],
  Chattogram: ["Kotwali", "Pahartali", "Panchlaish"],
  Rajshahi: ["Boalia", "Rajpara"],
  Khulna: ["Khalishpur", "Sonadanga"],
};
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const EditDonationRequest = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
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
          throw new Error(data.message || "Failed to load request.");
        }

        const data = await res.json();
        setFormData({
          recipientName: data.recipientName || "",
          recipientDistrict: data.recipientDistrict || "",
          recipientUpazila: data.recipientUpazila || "",
          hospitalName: data.hospitalName || "",
          fullAddress: data.fullAddress || "",
          bloodGroup: data.bloodGroup || "",
          donationDate: data.donationDate || "",
          donationTime: data.donationTime || "",
          requestMessage: data.requestMessage || "",
        });
      } catch (error) {
        console.error(error);
        setErr(error.message || "Failed to load request.");
      } finally {
        setLoading(false);
      }
    };

    if (user) load();
  }, [id, user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setSaving(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/donation-requests/${id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update request.");
      }

      setSuccess("Donation request updated successfully.");
      setTimeout(() => {
        navigate("/dashboard/my-donation-requests");
      }, 1200);
    } catch (error) {
      setErr(error.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinnercopy />
      </div>
    );
  }

  return (
    <div className="rounded-3xl shadow-2xl border border-slate-100 bg-base-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-xs font-semibold">
              ✎
            </span>
            Edit Donation Request
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            Update patient & request details
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-xl">
            Adjust the recipient information, hospital address, and timing so
            donors receive accurate instructions.
          </p>
        </div>

        <div className="flex md:flex-col items-end gap-2 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-xs rounded-full border border-slate-200"
          >
            ← Back
          </button>
          <span className="hidden md:inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Changes are saved securely.
          </span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
      >
        {/* Recipient name */}
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Recipient Name
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered rounded-xl"
            value={formData.recipientName}
            onChange={(e) => handleChange("recipientName", e.target.value)}
            required
            placeholder="Patient / recipient full name"
          />
        </div>

        {/* District */}
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Recipient District
            </span>
          </label>
          <select
            className="select select-bordered rounded-xl"
            value={formData.recipientDistrict}
            onChange={(e) => handleChange("recipientDistrict", e.target.value)}
            required
          >
            <option value="" disabled>
              Select district
            </option>
            {districtOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Upazila */}
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Recipient Upazila
            </span>
          </label>
          <select
            className="select select-bordered rounded-xl"
            value={formData.recipientUpazila}
            onChange={(e) => handleChange("recipientUpazila", e.target.value)}
            required
          >
            <option value="" disabled>
              Select upazila
            </option>
            {(upazilaOptionsByDistrict[formData.recipientDistrict] || []).map(
              (u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              )
            )}
          </select>
        </div>

        {/* Hospital name */}
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Hospital Name
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered rounded-xl"
            value={formData.hospitalName}
            onChange={(e) => handleChange("hospitalName", e.target.value)}
            required
            placeholder="e.g. Dhaka Medical College Hospital"
          />
        </div>

        {/* Full address */}
        <div className="form-control md:col-span-2">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Full Address
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered rounded-xl"
            value={formData.fullAddress}
            onChange={(e) => handleChange("fullAddress", e.target.value)}
            required
            placeholder="Street, area, ward, and any helpful directions"
          />
        </div>

        {/* Blood group */}
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Required Blood Group
            </span>
          </label>
          <select
            className="select select-bordered rounded-xl"
            value={formData.bloodGroup}
            onChange={(e) => handleChange("bloodGroup", e.target.value)}
            required
          >
            <option value="" disabled>
              Select blood group
            </option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Donation Date
            </span>
          </label>
          <input
            type="date"
            className="input input-bordered rounded-xl"
            value={formData.donationDate}
            onChange={(e) => handleChange("donationDate", e.target.value)}
            required
          />
        </div>

        {/* Time */}
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Donation Time
            </span>
          </label>
          <input
            type="time"
            className="input input-bordered rounded-xl"
            value={formData.donationTime}
            onChange={(e) => handleChange("donationTime", e.target.value)}
            required
          />
        </div>

        {/* Message */}
        <div className="form-control md:col-span-2">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Request Message
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered rounded-2xl min-h-[120px]"
            rows={4}
            value={formData.requestMessage}
            onChange={(e) => handleChange("requestMessage", e.target.value)}
            required
            placeholder="Explain the patient condition, urgency, and any instructions donors should know."
          />
        </div>

        {err && (
          <p className="text-error text-sm md:col-span-2 mt-1">
            {err}
          </p>
        )}
        {success && (
          <p className="text-success text-sm md:col-span-2 mt-1">
            {success}
          </p>
        )}

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="btn btn-ghost rounded-full border border-slate-200"
            onClick={() => navigate("/dashboard/my-donation-requests")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn rounded-full border-0 bg-gradient-to-r from-[#DC2626] via-[#EA384D] to-[#F97316] text-white font-semibold px-8 shadow-lg shadow-red-300/60 hover:shadow-red-400/80 transition"
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Donation Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDonationRequest;
