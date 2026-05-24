import React from "react";
import { useLoaderData } from "react-router";
import { motion as Motion } from "framer-motion";
import Container from "../Components/Container";
import IssuesCard from "../Components/IssuesCard";

// Per-item variant: uses the array index (custom) to delay each card
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.08, // <— stagger per item
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function LatestIssues() {
  const data = useLoaderData() || [];

  return (
    <Container>
      <div className="py-10">
        {/* Heading */}
        <Motion.h2
          className="text-3xl font-bold text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          Latest Issues
        </Motion.h2>

        {/* Grid (no AnimatePresence needed) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((issue, idx) => (
            <Motion.div
              key={issue._id || idx}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              custom={idx}                 // <— drives the delay
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <IssuesCard issue={issue} />
            </Motion.div>
          ))}
        </div>

        {/* Empty state */}
        {data.length === 0 && (
          <Motion.div
            className="text-center py-16 opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No issues found.
          </Motion.div>
        )}
      </div>
    </Container>
  );
}
