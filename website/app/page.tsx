'use client';

import HeroSection from '@/components/sections/HeroSection';
import HowItWorks from '@/components/sections/HowItWorks';
import Features from '@/components/sections/Features';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';
import CallToAction from '@/components/sections/CallToAction';
import Footer from '@/components/sections/Footer';
import Header from '@/components/sections/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="gradient-bg">
        <Header />
        <HeroSection />
      </div>
      <HowItWorks />
      <Features />
      <Testimonials />
      <FAQ />
      <CallToAction />
      <Footer />
    </main>
  );
}