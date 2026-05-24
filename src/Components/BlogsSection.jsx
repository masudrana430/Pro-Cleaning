// src/Components/BlogsSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import Container from "./Container";

const BlogsSection = ({
  posts = [
    {
      id: 1,
      title: "How to Report Issues Effectively",
      excerpt: "Tips for adding photos, clear descriptions, and accurate locations.",
      date: "2026-01-01",
      to: "/",
    },
    {
      id: 2,
      title: "Community Cleanup: What Works",
      excerpt: "Small actions that create real results when neighbors collaborate.",
      date: "2026-01-01",
      to: "/",
    },
    {
      id: 3,
      title: "Keeping Streets Safe in Rainy Season",
      excerpt: "How to identify drainage issues early and prevent waterlogging.",
      date: "2026-01-01",
      to: "/",
    },
  ],
}) => {
  return (
    <section className="py-10">
      <div className="rounded-3xl bg-base-200/40 p-6 sm:p-8 border border-base-200">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-base-content">Blogs</h2>
            <p className="mt-1 text-sm text-base-content/70">
              Guides, updates, and community stories.
            </p>
          </div>

          <Link
            to="/"
            className="btn btn-sm rounded-xl btn-outline border-base-300"
          >
            View All
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {posts.map((p) => (
            <div key={p.id} className="rounded-2xl bg-base-100 p-5 shadow-sm border border-base-200">
              <p className="text-xs text-base-content/60">{p.date}</p>
              <h3 className="mt-2 font-semibold text-base-content line-clamp-2">{p.title}</h3>
              <p className="mt-2 text-sm text-base-content/70 line-clamp-3">{p.excerpt}</p>

              <div className="mt-4">
                <Link to={p.to} className="btn rounded-l-none border-0
    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    text-white font-semibold
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A]">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    
  );
};

export default BlogsSection;
