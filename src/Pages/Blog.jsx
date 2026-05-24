// src/pages/Blog.jsx
import React from "react";
import { Link } from "react-router-dom";
import Container from "../Components/Container";

const Blog = () => {
  // Replace with API data later
  const posts = [
    {
      id: "1",
      title: "How to Report Issues Effectively",
      excerpt:
        "Tips for clear descriptions, photos, and accurate location pins.",
      date: "2026-01-01",
      tag: "Guide",
    },
    {
      id: "2",
      title: "Community Cleanup Drives: What Works",
      excerpt:
        "Simple planning steps to run successful community cleanup events.",
      date: "2026-01-01",
      tag: "Community",
    },
    {
      id: "3",
      title: "Reducing Waterlogging in Rainy Season",
      excerpt:
        "How to identify drainage issues early and prevent bigger problems.",
      date: "2026-01-01",
      tag: "Safety",
    },
  ];

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-3xl font-extrabold text-center">Blog</h1>
        <p className="text-center mt-2 text-base-content/70">
          Updates, guides, and stories from the community.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border bg-base-100 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="badge badge-outline">{p.tag}</span>
                <span className="text-xs opacity-60">{p.date}</span>
              </div>

              <h2 className="mt-3 text-lg font-bold">{p.title}</h2>
              <p className="mt-2 text-sm text-base-content/70">{p.excerpt}</p>

              <div className="mt-4">
                {/* If you don’t have a blog details page, you can remove this Link */}
                <Link
                  to={`/blog/${p.id}`}
                  className="link btn rounded-l-none border-0
    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    text-white font-semibold
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A]"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border bg-base-200/40 p-6">
          <p className="text-sm text-base-content/70">
            Want us to publish an update about your local area? Send details
            from the{" "}
            <Link to="/contact" className="link btn rounded-l-none border-0
    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    text-white font-semibold
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A] ">
              Contact
            </Link>{" "}
            page.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Blog;
