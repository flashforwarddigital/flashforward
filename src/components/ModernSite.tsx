import React, { useEffect } from 'react';
import InteractiveHero from './InteractiveHero';
import { Header } from './modern-site/Header';
import { AboutSection } from './modern-site/AboutSection';
import { BreakSection } from './modern-site/BreakSection';
import { ServicesSection } from './modern-site/ServicesSection';
import { WorkSection } from './modern-site/WorkSection';
import { TeamSection } from './modern-site/TeamSection';
import { PricingSection } from './modern-site/PricingSection';
import { ContactSection } from './modern-site/ContactSection';
import { Footer } from './modern-site/Footer';
import { BrandCarouselSection } from './modern-site/BrandCarouselSection';
import { StatsSection } from './modern-site/StatsSection';
import { QuoteSection } from './modern-site/QuoteSection';
import { TestimonialCarouselSection } from './modern-site/TestimonialCarouselSection';
import { ExaggeratedStatsSection } from './modern-site/ExaggeratedStatsSection';
import { EvenAnotherQuoteSection } from './modern-site/EvenAnotherQuoteSection';
import { ModernSiteProps } from '../types';
import AITools from './modern-site/ai';
import { posthog } from '../lib/posthog';

const ModernSite: React.FC<ModernSiteProps> = ({ onBack, setCurrentView }) => {
  useEffect(() => {
    // Track page view with PostHog
    posthog.capture('page_view', { page: 'modern_site' });
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-gray-300 overflow-x-hidden font-light tracking-tight">
      {/* Header */}
      <Header onBack={onBack} />

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <InteractiveHero />

        {/* Break Section with Brand Carousel */}
        <BreakSection backgroundImage="/bg1.png" reducedPadding>
          <BrandCarouselSection />
        </BreakSection>

        {/* About Section */}
        <AboutSection />

        {/* Break Section with Stats */}
        <BreakSection backgroundImage="/bg2.png" reducedPadding>
          <StatsSection />
        </BreakSection>

        {/* Services Section */}
        <ServicesSection />

        {/* Break Section with Quote */}
        <BreakSection backgroundImage="/bg3.png" reducedPadding>
          <QuoteSection />
        </BreakSection>

        {/* Our Work Section */}
        <WorkSection />

        {/* Break Section with Testimonials */}
        <BreakSection backgroundImage="/bg4.png" reducedPadding>
          <TestimonialCarouselSection />
        </BreakSection>

        {/* Team Section */}
        <TeamSection />

        {/* Break Section with Exaggerated Stats */}
        <BreakSection backgroundImage="/bg1.png" reducedPadding>
          <ExaggeratedStatsSection />
        </BreakSection>

        {/* Pricing Section */}
        <PricingSection />

        {/* Break Section with Even Another Quote */}
        <BreakSection backgroundImage="/bg2.png">
          <EvenAnotherQuoteSection />
        </BreakSection>

        {/* Contact Section */}
        <ContactSection />

      </main>

      {/* AI Tools */}
      <AITools />

      {/* Footer */}
      <Footer onAdminClick={() => {
        posthog.capture('admin_click');
        setCurrentView('admin');
      }} />
    </div>
  );
};

export default ModernSite;