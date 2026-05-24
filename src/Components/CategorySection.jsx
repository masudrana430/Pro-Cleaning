// src/Components/CategorySection.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { Fade, Slide } from "react-awesome-reveal"; // ✅ animation

import Delete from "./../animation/Delete Files.json";
import Construction from "./../animation/Construction.json";
import BrokenHouse from "./../animation/Blue House.json";
import Road from "./../animation/Car driving on road.json";
import Container from "./Container";

const CATS = [
  {
    key: "Garbage",
    label: "Garbage",
    desc: "Overflowing bins, littering, illegal dumping of waste.",
    emoji: (
      <Lottie
        animationData={Delete}
        loop
        className="h-12 w-12 shrink-0"
        style={{ margin: 0 }}
      />
    ),
    ring: "ring-success",
    bg: "bg-success/10",
  },
  {
    key: "Illegal Construction",
    label: "Illegal Construction",
    desc: "Unapproved structures blocking roads/footpaths & public spaces.",
    emoji: (
      <Lottie
        animationData={Construction}
        loop
        className="h-12 w-12 shrink-0"
        style={{ margin: 0 }}
      />
    ),
    ring: "ring-warning",
    bg: "bg-warning/10",
  },
  {
    key: "Broken Public Property",
    label: "Broken Public Property",
    desc: "Damaged lights, benches, signs, bus stops or public utilities.",
    emoji: (
      <Lottie
        animationData={BrokenHouse}
        loop
        className="h-12 w-12 shrink-0"
        style={{ margin: 0 }}
      />
    ),
    ring: "ring-info",
    bg: "bg-info/10",
  },
  {
    key: "Road Damage",
    label: "Road Damage",
    desc: "Potholes, cracks, waterlogging damage, unsafe road surfaces.",
    emoji: (
      <Lottie
        animationData={Road}
        loop
        className="h-12 w-12 shrink-0"
        style={{ margin: 0 }}
      />
    ),
    ring: "ring-error",
    bg: "bg-error/10",
  },
];

export default function CategorySection({ onSelect }) {
  const navigate = useNavigate();

  const handleView = (cat) => {
    if (onSelect) return onSelect(cat);
    navigate(`/all-issues?category=${encodeURIComponent(cat)}`);
  };

  return (
    <Container>
      <section className="py-10">
        {/* Heading animation */}
        <Fade triggerOnce direction="up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold">
              Report by{" "}
              <span
                className="
                  bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
                  bg-clip-text text-transparent
                "
              >
                Category
              </span>
            </h2>
            <p className="text-base-content/70 mt-2">
              Pick a category to view related reports or file a new one in
              seconds.
            </p>
          </div>
        </Fade>

        {/* Cards animation */}
        <Slide
          triggerOnce
          direction="up"
          cascade
          damping={0.15} // 👈 staggered effect, VERY visible
        >
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {CATS.map(({ key, label, desc, emoji, ring, bg }) => (
              <div
                key={key}
                className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow h-full"
              >
                <div className="card-body">
                  <div className="flex items-center gap-3">
                    <div className={`avatar placeholder ${ring}`}>
                      <div className={`w-12 rounded-full ${bg} ring-2`}>
                        {emoji}
                      </div>
                    </div>
                    <h3 className="card-title text-xl">{label}</h3>
                  </div>

                  <p className="mt-2 text-sm text-base-content/80">{desc}</p>

                  <div className="card-actions mt-4 justify-between">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleView(key)}
                      aria-label={`View ${label} issues`}
                    >
                      View issues
                    </button>

                    <Link
                      to={`/add-issues?category=${encodeURIComponent(key)}`}
                      className="
                        btn btn-sm
                        bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
                        text-white border border-[#1a6a3d]
                        font-semibold
                        transition-colors duration-300
                        hover:from-[#48D978] hover:to-[#2B8C4A]
                      "
                      aria-label={`Report ${label} issue`}
                    >
                      Report
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Slide>
      </section>
    </Container>
  );
}
