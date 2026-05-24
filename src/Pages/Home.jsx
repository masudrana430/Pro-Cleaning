import React from "react";
import Banner from "../Components/Banner/Banner";
// import AppData from './AppData';
import Container from "../Components/Container";
import WinterHeroSwiper from "../Components/WinterHeroSwiper";

// If your images are in src/assets, import them like this:
import hero1 from "../assets/Group.png"; // replace with your own images
import hero2 from "../assets/Group 427320769.png";
import hero3 from "../assets/Group (1).png";

// import LoyalHearts from '../Components/LoyalHearts';
// import ExpertVets from '../Components/ExpertVets';
// import ExtraSection from '../Components/ExtraSection';
import LatestIssues from "./LatestIssues";
import CategorySection from "../Components/CategorySection";
import CommunityStats from "../Components/CommunityStats";
import VolunteerCTA from "../Components/VolunteerCTA";
<<<<<<< HEAD
import ContactSection from "../Components/ContactSection";
import FeaturedSection from "../Components/FeaturedSection";
=======
import HighlightsSection from "../Components/HighlightsSection";
import StatisticsSection from "../Components/StatisticsSection";
import TestimonialsSection from "../Components/TestimonialsSection";
import BlogsSection from "../Components/BlogsSection";
import NewsletterSection from "../Components/NewsletterSection";
import FAQSection from "../Components/FAQSection";
>>>>>>> b4f6383 (m)
// import CommunityStats from '../Components/CommunityStats';
// import { data } from 'react-router';
// import CategorySection from '../Components/CategorySection';
// import CommunityStats from '../Components/CommunityStats';

const Home = () => {
  const slides = [
    {
      title: "Donate Blood, Save Lives",
      subtitle:
        "Become a registered donor and help patients in critical need with just one donation.",
      img: hero1,
      cta: "Join as a Donor",
      to: "/src/Pages/Register.jsx", // registration route
      badge: "Start Donating",
    },
    {
      title: "Find the Right Donor Fast",
      subtitle:
        "Search by blood group, district, and upazila to connect with available donors near you.",
      img: hero2,
      cta: "Search Donors",
      to: "/search-donors", // your public search page
      badge: "Urgent Help",
    },
    {
      title: "Create a Blood Request",
      subtitle:
        "Need blood for a patient? Create a detailed request so donors can respond quickly.",
      img: hero3,
      cta: "Request Blood",
      to: "/dashboard/create-donation-request", // private route (will redirect to login if needed)
      badge: "Request Support",
    },
  ];

  return (
    <div>
      {/* <Banner /> */}

      <Container>
        <WinterHeroSwiper slides={slides} />
        {/* <LatestIssues /> */}
        {/* <CategorySection /> */}
        {/* <CommunityStats
          totals={{ users: 213, resolved: 145, pending: 32 }}
          sinceText="this week"
<<<<<<< HEAD
        /> */}
        {/* <VolunteerCTA /> */}
        <FeaturedSection />
        <ContactSection />
=======
        />
        <VolunteerCTA />
        <HighlightsSection />
        <StatisticsSection />
        <TestimonialsSection />
        <BlogsSection />
        <NewsletterSection />
        <FAQSection />
>>>>>>> b4f6383 (m)
      </Container>
    </div>
  );
};

export default Home;
