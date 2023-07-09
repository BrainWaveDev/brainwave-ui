import Reactweb from 'react';
import HeroSection from './heroSection';
import Features from './features';

// TODO: Add animations and transitions to the landing page
export default function About() {
  return (
    <div className="relative isolate px-6 xs:pt-7 sm:pt-14 lg:px-8">
      <HeroSection />
      <Features />
    </div>
  );
}
