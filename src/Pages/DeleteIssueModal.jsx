import React, { useContext, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";

const API = (
  import.meta.env.VITE_API_URL || "https://b12-a10-copy-server.vercel.app"
).replace(/\/+$/, "");

export default function DeleteIssueModal({ open, issue, onClose, onDeleted }) {
  const { user } = useContext(AuthContext);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");

  if (!open || !issue) return null;

  const handleDelete = async () => {
    try {
      setPending(true);
      setErr("");

      const token = user ? await user.getIdToken() : "";
      const res = await fetch(`${API}/issues/${issue._id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "", // optional in your current process
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        onDeleted?.(issue._id);
        onClose?.();
      } else {
        throw new Error(data.error || "Delete failed");
      }
    } catch (e) {
      console.error(e);
      setErr("Failed to delete. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete this issue?</h3>
        <p className="py-3">
          This will permanently remove{" "}
          <span className="font-medium">{issue.title}</span>.
        </p>

        {err && (
          <div className="alert alert-error my-2">
            <span>{err}</span>
          </div>
        )}

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={pending}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={pending}
          >
            {pending ? (
              <span className="loading loading-spinner" />
            ) : (
              "Yes, delete"
            )}
          </button>
        </div>
      </div>

      {/* backdrop */}
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
