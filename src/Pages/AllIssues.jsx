import React, { useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import { motion as Motion } from "framer-motion";
import IssuesCard from "../Components/IssuesCard";
import Container from "../Components/Container";
import Lottie from "lottie-react";
import Find from "./../animation/Not Found.json";

const norm = (v) => (v ?? "").toString().trim().toLowerCase();

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "ongoing", label: "Ongoing" },
  { value: "in-progress", label: "In-Progress" },
  { value: "resolved", label: "Resolved" },
];

const PAGE_SIZE = 6; // 👈 how many cards per page

// Animation variants
const gridVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AllIssues() {
  const data = useLoaderData() || [];

  // Build a case-insensitive unique category list
  const categories = useMemo(() => {
    const map = new Map(); // key: lower, val: original for display
    for (const it of data) {
      const c = it?.category;
      if (!c) continue;
      const lower = norm(c);
      if (!map.has(lower)) map.set(lower, c);
    }
    return [
      { value: "all", label: "All" },
      ...Array.from(map.entries())
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([value, label]) => ({ value, label })),
    ];
  }, [data]);

  // UI filter state (includes search)
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    search: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Helper to update filters & reset page to 1
  const updateFilters = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    const q = norm(filters.search);

    return data.filter((it) => {
      const catOk =
        filters.category === "all" || norm(it?.category) === filters.category;

      const st = norm(it?.status || "ongoing");
      const statusOk = filters.status === "all" || st === filters.status;

      // search across multiple fields
      const haystack = [
        it?.title,
        it?.location,
        it?.description,
        it?.category,
        it?.status,
      ]
        .map(norm)
        .join(" ");

      const searchOk = !q || haystack.includes(q);

      return catOk && statusOk && searchOk;
    });
  }, [data, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  const resetFilters = () => {
    setFilters({ category: "all", status: "all", search: "" });
    setCurrentPage(1);
  };

  const startIndex = filtered.length
    ? (currentPage - 1) * PAGE_SIZE + 1
    : 0;
  const endIndex = Math.min(currentPage * PAGE_SIZE, filtered.length);

  return (
    <Container>
      <div className="mb-12 md:mb-16 ">
        <div className="text-2xl text-center font-bold">All Issues</div>
        <p className="text-center mb-6">Browse, filter, search, and paginate issues.</p>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select select-bordered"
                value={filters.category}
                onChange={(e) =>
                  updateFilters({ category: e.target.value })
                }
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                className="select select-bordered"
                value={filters.status}
                onChange={(e) =>
                  updateFilters({ status: e.target.value })
                }
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Search</span>
              </label>
              <div className="join w-full">
                <input
                  type="search"
                  className="input input-bordered join-item w-full"
                  placeholder="Search title, location, description…"
                  value={filters.search}
                  onChange={(e) =>
                    updateFilters({ search: e.target.value })
                  }
                />
                {filters.search ? (
                  <button
                    type="button"
                    className="btn join-item"
                    onClick={() => updateFilters({ search: "" })}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                ) : (
                  <button className="btn join-item" disabled>
                    🔎
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
              Reset
            </button>
            <span className="text-xs sm:text-sm opacity-70">
              Showing{" "}
              {filtered.length
                ? `${startIndex}–${endIndex}`
                : "0"}{" "}
              of {filtered.length} filtered issues (total {data.length})
            </span>
          </div>
        </div>

        {/* Animated Grid */}
        {filtered.length ? (
          <>
            <Motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={gridVariants}
              initial="hidden"
              animate="show"
              // re-run stagger when filters/search/page change
              key={`${filters.category}-${filters.status}-${filters.search}-${currentPage}`}
            >
              {paginated.map((issue) => (
                <Motion.div
                  key={issue._id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <IssuesCard issue={issue} />
                </Motion.div>
              ))}
            </Motion.div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="join">
                  <button
                    className="btn btn-sm join-item"
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    « Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`btn btn-sm join-item ${
                          page === currentPage ? "btn-active" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    className="btn btn-sm join-item"
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(totalPages, p + 1)
                      )
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next »
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-12">
            <Lottie
              animationData={Find}
              loop={true}
              style={{ width: "400px", height: "400px", margin: "0 auto" }}
            />
            <p className="text-center text-lg mt-4">No issues found.</p>
          </div>
        )}
      </div>
    </Container>
  );
}
