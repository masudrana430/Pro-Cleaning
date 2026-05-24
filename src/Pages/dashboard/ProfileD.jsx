import React, { useContext, useMemo, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";

const API = "https://b12-a10-copy-server.vercel.app";

export default function ProfileD() {
  const { user } = useContext(AuthContext);

  const initial = useMemo(
    () => ({
      name: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
      phone: "",
      address: "",
    }),
    [user]
  );

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);

      // 1) Update Firebase profile (displayName + photoURL)
      await updateProfile(user, {
        displayName: form.name,
        photoURL: form.photoURL,
      });

      // 2) Update backend user profile (optional if endpoint exists)
      const token = user.getIdToken
        ? await user.getIdToken()
        : user.accessToken || user?.stsTokenManager?.accessToken;

      // If your server supports it, it will save phone/address/etc.
      await fetch(`${API}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({
          name: form.name,
          photoURL: form.photoURL,
          phone: form.phone,
          address: form.address,
        }),
      }).catch(() => {});

      toast.success("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-extrabold">My Profile</h1>
      <p className="mt-1 text-sm opacity-70">
        View and edit your profile information.
      </p>

      <div className="mt-6 rounded-2xl border bg-base-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-64">
            <div className="rounded-2xl border bg-base-200/40 p-5">
              <div className="avatar">
                <div className="w-20 rounded-full">
                  <img
                    alt="avatar"
                    src={
                      form.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        form.name || "User"
                      )}&background=36B864&color=fff&size=128&bold=true`
                    }
                  />
                </div>
              </div>
              <p className="mt-3 font-bold">{form.name || "—"}</p>
              <p className="text-sm opacity-70 break-all">{form.email || "—"}</p>
            </div>
          </div>

          <form onSubmit={onSave} className="flex-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Email (read-only)</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  value={form.email}
                  readOnly
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text">Photo URL</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="photoURL"
                  value={form.photoURL}
                  onChange={onChange}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="01XXXXXXXXX"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  placeholder="Street, City"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setForm(initial)}
                disabled={saving}
              >
                Reset
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${saving ? "btn-disabled" : ""}`}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
