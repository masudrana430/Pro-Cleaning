// src/pages/dashboard/CreateDonationRequest.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import useCurrentUser from "../../hooks/useCurrentUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner2nd from "../../Components/LoadingSpinner2nd";
import LoadingSpinnercopy from "../../Components/LoadingSpinnercopy";

const districtOptions = ["Dhaka", "Chattogram", "Rajshahi", "Khulna"];
const upazilaOptionsByDistrict = {
  Dhaka: ["Dhanmondi", "Mirpur", "Uttara"],
  Chattogram: ["Kotwali", "Pahartali", "Panchlaish"],
  Rajshahi: ["Boalia", "Rajpara"],
  Khulna: ["Khalishpur", "Sonadanga"],
};
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const CreateDonationRequest = () => {
  const { user } = useContext(AuthContext);
  const { dbUser, loadingDbUser } = useCurrentUser();
  const axiosSecure = useAxiosSecure();

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (loadingDbUser) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinnercopy />
      </div>
    );
  }

  if (dbUser?.status === "blocked") {
    return (
      <div className="rounded-3xl border border-rose-100 shadow-xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-rose-700 flex items-center gap-2 mb-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-sm font-semibold">
            !
          </span>
          Create Donation Request
        </h2>
        <p className="text-sm text-rose-600">
          Your account is currently <span className="font-semibold">blocked</span>.
          You are not allowed to create new donation requests. Please contact an
          administrator if you believe this is a mistake.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setLoading(true);

    const form = e.currentTarget;

    const payload = {
      requesterName: dbUser?.name || user?.displayName,
      requesterEmail: dbUser?.email || user?.email,
      recipientName: form.recipientName.value.trim(),
      recipientDistrict: form.recipientDistrict.value,
      recipientUpazila: form.recipientUpazila.value,
      hospitalName: form.hospitalName.value.trim(),
      fullAddress: form.fullAddress.value.trim(),
      bloodGroup: form.bloodGroup.value,
      donationDate: form.donationDate.value,
      donationTime: form.donationTime.value,
      requestMessage: form.requestMessage.value.trim(),
    };

    try {
      const res = await axiosSecure.post("/donation-requests", payload);

      // if your backend returns something different, adapt this condition
      if (!res.data) {
        throw new Error("Unexpected server response.");
      }

      setSuccess("Donation request created successfully.");
      form.reset();
      setSelectedDistrict("");
      setSelectedUpazila("");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create request.";
      setErr(message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setErr("");
        setSuccess("");
      }, 2500);
    }
  };

  return (
    <div className="rounded-3xl shadow-2xl border border-slate-100 bg-base-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            New request
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Create Donation Request
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-xl">
            Provide the patient&apos;s details and location so nearby donors can
            respond quickly and safely.
          </p>
        </div>

        <div className="hidden md:flex flex-col items-end text-xs text-slate-500">
          <span>
            Requester information is read-only and comes from your profile.
          </span>
          <span className="mt-1 inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Only active users can create requests.
          </span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
      >
        {/* Requester info (readonly) */}
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Requester Name
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered rounded-xl bg-slate-50 cursor-not-allowed"
            value={dbUser?.name || user?.displayName || ""}
            readOnly
          />
        </div>

        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Requester Email
            </span>
          </label>
          <input
            type="email"
            className="input input-bordered rounded-xl bg-slate-50 cursor-not-allowed"
            value={dbUser?.email || user?.email || ""}
            readOnly
          />
        </div>

        {/* Recipient name */}
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Recipient Name
            </span>
          </label>
          <input
            type="text"
            name="recipientName"
            className="input input-bordered rounded-xl"
            placeholder="Patient / recipient full name"
            required
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
            name="recipientDistrict"
            className="select select-bordered rounded-xl"
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedUpazila("");
            }}
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
            name="recipientUpazila"
            className="select select-bordered rounded-xl"
            value={selectedUpazila}
            onChange={(e) => setSelectedUpazila(e.target.value)}
            required
            disabled={!selectedDistrict}
          >
            <option value="" disabled>
              {selectedDistrict ? "Select upazila" : "Select district first"}
            </option>
            {selectedDistrict &&
              (upazilaOptionsByDistrict[selectedDistrict] || []).map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
          </select>
        </div>

        {/* Hospital */}
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Hospital Name
            </span>
          </label>
          <input
            type="text"
            name="hospitalName"
            className="input input-bordered rounded-xl"
            placeholder="e.g. Dhaka Medical College Hospital"
            required
          />
        </div>

        {/* Full address (full width) */}
        <div className="form-control md:col-span-2">
          <label className="label pb-1">
            <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
              Full Address
            </span>
          </label>
          <input
            type="text"
            name="fullAddress"
            className="input input-bordered rounded-xl"
            placeholder="Street, area, and any helpful directions"
            required
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
            name="bloodGroup"
            className="select select-bordered rounded-xl"
            defaultValue=""
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
            name="donationDate"
            className="input input-bordered rounded-xl"
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
            name="donationTime"
            className="input input-bordered rounded-xl"
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
            name="requestMessage"
            className="textarea textarea-bordered rounded-2xl min-h-[120px]"
            placeholder="Explain why blood is needed, patient condition, and any special instructions for donors."
            rows={4}
            required
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
        <div className="md:col-span-2 flex justify-end pt-2">
          <button
            type="submit"
            className="btn rounded-full border-0 bg-gradient-to-r from-[#DC2626] via-[#EA384D] to-[#F97316] text-white font-semibold px-8 shadow-lg shadow-red-300/60 hover:shadow-red-400/80 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDonationRequest;

