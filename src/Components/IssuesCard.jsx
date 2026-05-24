import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import Location from "./../animation/Globe.json";

const safeAmount = (amount) => {
  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  } catch {
    return `৳ ${amount ?? 0}`;
  }
};

const toId = (_id) =>
  typeof _id === "string" ? _id : _id?.$oid ?? _id?.toString?.() ?? "";

const statusPill = (status) => {
  switch ((status || "").toLowerCase()) {
    case "resolved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "in-progress":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "ongoing":
    default:
      return "bg-sky-50 text-sky-700 border-sky-200";
  }
};

const IssuesCard = ({ issue }) => {
  const { _id, title, category, location, amount, image, status } = issue || {};
  const idStr = useMemo(() => toId(_id), [_id]);

  return (
    <div
      className="
        group/card relative overflow-hidden rounded-2xl border border-base-200
        bg-base-100/70 backdrop-blur-sm transition-all
        hover:shadow-xl hover:border-base-300
      "
    >
      {/* Image & overlays */}
      <figure className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://placehold.co/800x520?text=No+Image";
          }}
        />

        {/* Soft gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0
                     bg-gradient-to-t from-base-100/70 via-transparent to-transparent"
        />

        {/* Category pill (top-left) */}
        {category && (
          <span
            className="
              absolute left-3 top-3 inline-flex items-center gap-2
              rounded-full border bg-white/80 px-3 py-1 text-xs font-semibold
              text-base-content shadow-sm backdrop-blur
            "
          >
            <span
              className="inline-block h-2 w-2 rounded-full bg-[#36B864]"
              aria-hidden
            />
            {category}
          </span>
        )}

        {/* Status pill (top-right, optional) */}
        {status && (
          <span
            className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur ${statusPill(
              status
            )}`}
            title={`Status: ${status}`}
          >
            {status}
          </span>
        )}
      </figure>

      {/* Body */}
      <div className="p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">
          {title || "Untitled issue"}
        </h3>

        {/* Location */}
        <div className="mt-3 flex items-center gap-2">
          <Lottie
            animationData={Location}
            loop
            className="h-6 w-6 shrink-0"
            style={{ margin: 0 }}
          />
          <p className="text-sm text-base-content/70 line-clamp-1">
            {location || "—"}
          </p>
        </div>

        {/* Divider */}
        <div className="my-4 h-px w-full bg-base-200" />

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-base-content/60">
              Suggested Budget
            </span>
            <span className="text-base font-bold">{safeAmount(amount)}</span>
          </div>

          <Link
            to={`/issues-details/${idStr}`}
            className="
    btn btn-sm border border-[#1a6a3d]
    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    text-white font-semibold
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A]
  "
          >
            See Details
          </Link>
        </div>
      </div>

      {/* Focus ring for a11y if card becomes focusable later */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-offset-0 focus-within:ring-2 focus-within:ring-emerald-400"
        aria-hidden
      />
    </div>
  );
};

export default IssuesCard;
