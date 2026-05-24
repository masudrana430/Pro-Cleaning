import React from "react";
import Container from "../Components/Container";
import WinterHeroSwiper from "../Components/WinterHeroSwiper";

import hero1 from "../assets/Group.png";
import hero2 from "../assets/Group 427320769.png";
import hero3 from "../assets/Group (1).png";

import LatestIssues from "./LatestIssues";
import CategorySection from "../Components/CategorySection";
import CommunityStats from "../Components/CommunityStats";
import VolunteerCTA from "../Components/VolunteerCTA";

import HighlightsSection from "../Components/HighlightsSection";
import StatisticsSection from "../Components/StatisticsSection";
import TestimonialsSection from "../Components/TestimonialsSection";
import BlogsSection from "../Components/BlogsSection";
import NewsletterSection from "../Components/NewsletterSection";
import FAQSection from "../Components/FAQSection";

const Home = () => {
  const slides = [
    {
      title: "Keep Your Community Clean",
      subtitle:
        "Report local cleaning issues, track progress, and help make your area healthier and safer.",
      img: hero1,
      cta: "Report an Issue",
      to: "/add-issues",
      badge: "Take Action",
    },
    {
      title: "Find Local Issues Fast",
      subtitle:
        "Browse community-reported problems by category, location, and status to understand what needs attention.",
      img: hero2,
      cta: "View Issues",
      to: "/issues",
      badge: "Explore Issues",
    },
    {
      title: "Contribute to a Cleaner City",
      subtitle:
        "Join volunteers, support cleanup campaigns, and help resolve public sanitation problems.",
      img: hero3,
      cta: "Join Community",
      to: "/auth/register",
      badge: "Get Involved",
    },
  ];

  return (
    <div>
      <Container>
        <WinterHeroSwiper slides={slides} />

        <LatestIssues />
        <CategorySection />

        <CommunityStats
          totals={{ users: 213, resolved: 145, pending: 32 }}
          sinceText="this week"
        />

        <VolunteerCTA />
        <HighlightsSection />
        <StatisticsSection />
        <TestimonialsSection />
        <BlogsSection />
        <NewsletterSection />
        <FAQSection />
      </Container>
    </div>
  );
};

export default Home;