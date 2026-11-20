/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { Language } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { TestDirectory } from './components/TestDirectory';
import { PackagesSection } from './components/PackagesSection';
import { HomeCollectionSection } from './components/HomeCollectionSection';
import { BookingSection } from './components/BookingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TRANSLATIONS } from './data/translations';
import { initAllMedicalAnimations } from './utils/medicalAnimations';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>(['cbc']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [homeCollectionPreset, setHomeCollectionPreset] = useState<boolean>(false);
  const [selectedPackageName, setSelectedPackageName] = useState<string>('');
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);

  // Initialize medical-grade scroll reveal, counters, and dismiss preloader
  useEffect(() => {
    initAllMedicalAnimations();
  }, []);

  const t = TRANSLATIONS[language];

  const handleToggleTest = (testId: string) => {
    setSelectedTestIds(prev =>
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleRemoveTest = (testId: string) => {
    setSelectedTestIds(prev => prev.filter(id => id !== testId));
  };

  const handleClearSelectedTests = () => {
    setSelectedTestIds([]);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (isHomeCollection = false) => {
    setHomeCollectionPreset(isHomeCollection);
    scrollToSection('book-test');
  };

  const handleSelectPackageForBooking = (packageName: string) => {
    setSelectedPackageName(packageName);
    scrollToSection('book-test');
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Pawan Research Laboratory, I would like to inquire about blood test bookings.`
  );
  const whatsappUrl = `https://wa.me/919335736360?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navigation Header with Top Search Bar & Left-Side Booking Button */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onOpenBooking={() => handleOpenBooking(false)}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() => scrollToSection('tests')}
        selectedTestIds={selectedTestIds}
        onToggleTest={handleToggleTest}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          language={language}
          onOpenBooking={() => handleOpenBooking(false)}
          onNavigateToHomeCollection={() => handleOpenBooking(true)}
          onSelectTest={() => {
            scrollToSection('tests');
          }}
        />

        {/* 2. About Us */}
        <AboutSection language={language} />

        {/* 3. Tests & Prices Directory */}
        <TestDirectory
          language={language}
          selectedTestIds={selectedTestIds}
          onToggleTest={handleToggleTest}
          onOpenBooking={() => scrollToSection('book-test')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 4 & 5. Wellness & Fitness Packages */}
        <PackagesSection
          language={language}
          onSelectPackageForBooking={handleSelectPackageForBooking}
        />

        {/* 6. Home Sample Collection */}
        <HomeCollectionSection
          language={language}
          onBookHomeCollection={() => handleOpenBooking(true)}
        />

        {/* 7. Book a Test Form */}
        <BookingSection
          language={language}
          selectedTestIds={selectedTestIds}
          onRemoveTest={handleRemoveTest}
          onClearSelectedTests={handleClearSelectedTests}
          homeCollectionDefault={homeCollectionPreset}
          prefilledPackageName={selectedPackageName}
        />

        {/* 8. Contact Us */}
        <ContactSection language={language} />
      </main>

      {/* 9. Footer */}
      <Footer
        language={language}
        onLanguageChange={setLanguage}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenBooking={() => handleOpenBooking(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        language={language}
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* Mobile Floating Action Bottom Bar (<15% viewport height) - Booking Button on Left Side */}
      <aside aria-label="Quick contact actions" className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg flex items-center justify-between gap-2">
        <button
          onClick={() => handleOpenBooking(false)}
          className="flex-1.5 py-2 px-3 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-teal-100" />
          <span>{t.bookTestBtn}</span>
        </button>

        <a
          href={`tel:${t.phone}`}
          className="flex-1 py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-teal-700" />
          <span>{language === 'en' ? 'Call' : 'कॉल'}</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span>WhatsApp</span>
        </a>
      </aside>
    </div>
  );
}
