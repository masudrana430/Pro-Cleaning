import React from "react";

export default function MyContributions() {
  return (
    <div className="rounded-2xl border bg-base-100 p-6">
      <h2 className="text-xl font-bold">My Contributions</h2>
      <p className="mt-2 text-sm opacity-70">
        Show contributions made by the logged-in user (fetch from backend).
      </p>
    </div>
  );
}
