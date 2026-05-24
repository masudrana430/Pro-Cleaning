import React from "react";

export default function MyIssues() {
  return (
    <div className="rounded-2xl border bg-base-100 p-6">
      <h2 className="text-xl font-bold">My Issues</h2>
      <p className="mt-2 text-sm opacity-70">
        Show issues created by the logged-in user (fetch from backend).
      </p>
    </div>
  );
}
