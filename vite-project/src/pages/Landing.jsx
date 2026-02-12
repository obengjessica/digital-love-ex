import React from "react";
import Hero from "../components/ui/landing/Hero";
import Features from "../components/ui/landing/Features";
import CTA from "../components/ui/landing/CTA";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
};

export default Landing;
