import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Phone, Calendar, Menu, X, Globe, ShieldAlert, Search, Plus, Check, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { TESTS_DATA } from '../data/testsData';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenBooking: () => void;
  onOpenPrivacy: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  selectedTestIds: string[];
  onToggleTest: (testId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onOpenBooking,
  onOpenPrivacy,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedTestIds,
  onToggleTest,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const liveMatches = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return TESTS_DATA.filter((test) => {
      const matchesName = test.name.toLowerCase().includes(q);
      const matchesNameHi = test.nameHi.toLowerCase().includes(q);
      const matchesCode = test.code ? test.code.toLowerCase().includes(q) : false;
      const matchesDesc = test.description.toLowerCase().includes(q);
      return matchesName || matchesNameHi || matchesCode || matchesDesc;
    });
  }, [searchQuery]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFocused(false);
    onSearchSubmit();
  };

  return (
    <>
      {/* Top Notification Strip */}
      <div className="bg-teal-950 text-teal-100 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-semibold text-white tracking-wide">{t.tagline}</span>
            <span className="hidden md:inline text-teal-400" aria-hidden="true">·</span>
            <span className="hidden md:inline text-teal-200">{t.locationShort}</span>
            <span className="hidden lg:inline text-teal-400" aria-hidden="true">·</span>
            <span className="hidden lg:inline text-teal-200 font-medium">20% OFF on MRP</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${t.phone}`}
              className="text-teal-200 hover:text-white transition-colors flex items-center gap-1 font-mono font-medium"
            >
              <Phone className="w-3 h-3 text-teal-400" />
              <span>{t.phone}</span>
            </a>
            <span className="text-teal-600" aria-hidden="true">|</span>
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 text-teal-200 hover:text-white font-medium transition-colors cursor-pointer"
              title="Switch Language"
            >
              <Globe className="w-3 h-3 text-teal-400" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#home"
            className="flex items-center gap-2.5 text-slate-900 group whitespace-nowrap shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m14 2 4 4-2 2-4-4 2-2Z"/>
                <path d="M12 4v4"/>
                <path d="M10 6 8.5 7.5"/>
                <path d="m2 22 7-7"/>
                <path d="m5 19 3 3"/>
                <circle cx="16" cy="18" r="4"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-lg tracking-tight text-slate-950 font-serif">
                {language === 'en' ? 'Pawan Research Laboratory' : 'पवन रिसर्च लैबोरेटरी'}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-teal-700 tracking-wider">
                {language === 'en' ? 'PATHOLOGY & CLINICAL DIAGNOSTICS' : 'पैथोलॉजी एवं क्लिनिकल डायग्नोस्टिक्स'}
              </span>
            </div>
          </a>

          {/* Zone 2: Clean Single-Line Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <button
              onClick={() => handleNavClick('#home')}
              className="hover:text-teal-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => handleNavClick('#about')}
              className="hover:text-teal-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => handleNavClick('#tests')}
              className="hover:text-teal-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              {t.navTests}
            </button>
            <button
              onClick={() => handleNavClick('#packages')}
              className="hover:text-teal-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              {t.navWellness}
            </button>
            <button
              onClick={() => handleNavClick('#home-collection')}
              className="hover:text-teal-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              {t.navHomeCollection}
            </button>
            <button
              onClick={() => handleNavClick('#contact')}
              className="hover:text-teal-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              {t.navContact}
            </button>
          </nav>

          {/* Zone 3: Language Toggle & Mobile Menu (Booking Button moved to Left Side below) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-teal-700" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Top Action & Search Strip: Booking Button on LEFT Side + Search Bar at TOP */}
        <div className="border-t border-slate-100 bg-slate-50/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2.5 sm:gap-4">
            {/* LEFT SIDE: Primary Booking Button */}
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 active:bg-teal-950 rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 cursor-pointer btn-pulse-medical"
            >
              <Calendar className="w-4 h-4 text-teal-200 shrink-0" />
              <span>{t.bookTestBtn}</span>
              {selectedTestIds.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-md tabular-nums">
                  {selectedTestIds.length}
                </span>
              )}
            </button>

            {/* TOP SEARCH BAR (Full width next to Booking Button) */}
            <div ref={searchContainerRef} className="relative flex-1 min-w-0">
              <form onSubmit={handleSearchFormSubmit} className="relative flex items-center">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-700 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setSearchFocused(true);
                  }}
                  placeholder={t.searchPlaceholder}
                  aria-label={language === 'en' ? 'Search pathology tests' : 'पैथोलॉजी टेस्ट खोजें'}
                  className="w-full pl-10 pr-20 sm:pr-24 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-14 sm:right-18 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 sm:px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Search' : 'खोजें'}
                </button>
              </form>

              {/* Live Search Results Dropdown */}
              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-[65vh] flex flex-col">
                  {liveMatches.length > 0 ? (
                    <>
                      <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                        <span>
                          <strong className="text-slate-900 tabular-nums">{liveMatches.length}</strong>{' '}
                          {language === 'en' ? 'matching tests found' : 'टेस्ट मिले'}
                        </span>
                        <span className="text-emerald-700 font-semibold">20% OFF MRP</span>
                      </div>
                      <div className="overflow-y-auto divide-y divide-slate-100">
                        {liveMatches.slice(0, 7).map((test) => {
                          const isSelected = selectedTestIds.includes(test.id);
                          return (
                            <div
                              key={test.id}
                              className="px-3.5 py-2.5 hover:bg-teal-50/40 flex items-center justify-between gap-3 transition-colors"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                    {language === 'en' ? test.name : test.nameHi}
                                  </span>
                                  {test.code && (
                                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                                      {test.code}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                  <span className="truncate">{test.category}</span>
                                  <span aria-hidden="true">·</span>
                                  <span className="line-through font-mono">MRP ₹{test.mrp}</span>
                                  <span className="font-bold font-mono text-teal-900">
                                    ₹{test.discountedPrice}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => onToggleTest(test.id)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg shrink-0 cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-teal-800 text-white hover:bg-teal-900'
                                    : 'bg-teal-50 text-teal-900 hover:bg-teal-100 border border-teal-200'
                                }`}
                              >
                                {isSelected ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>{language === 'en' ? 'Added' : 'चयनित'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    <span>{language === 'en' ? 'Select' : 'चुनें'}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchFocused(false);
                          onSearchSubmit();
                        }}
                        className="w-full px-3.5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-semibold border-t border-teal-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>
                          {language === 'en'
                            ? `View all ${liveMatches.length} results in Test Directory`
                            : `सभी ${liveMatches.length} परिणाम जांच सूची में देखें`}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">
                      {language === 'en'
                        ? `No tests found for "${searchQuery}". Try CBC, LFT, KFT, Thyroid, or Sugar.`
                        : `"${searchQuery}" के लिए कोई टेस्ट नहीं मिला। कृपया CBC, LFT, KFT, थायरॉइड या शुगर खोजें।`}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in duration-200">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500">Language / भाषा:</span>
              <button
                onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-md"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'हिंदी में देखें' : 'View in English'}</span>
              </button>
            </div>
            <button
              onClick={() => handleNavClick('#home')}
              className="w-full text-left py-2.5 px-3 text-slate-800 font-medium hover:bg-slate-50 rounded-md text-sm"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => handleNavClick('#about')}
              className="w-full text-left py-2.5 px-3 text-slate-800 font-medium hover:bg-slate-50 rounded-md text-sm"
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => handleNavClick('#tests')}
              className="w-full text-left py-2.5 px-3 text-slate-800 font-medium hover:bg-slate-50 rounded-md text-sm"
            >
              {t.navTests}
            </button>
            <button
              onClick={() => handleNavClick('#packages')}
              className="w-full text-left py-2.5 px-3 text-slate-800 font-medium hover:bg-slate-50 rounded-md text-sm"
            >
              {t.navWellness} & {t.navFitness}
            </button>
            <button
              onClick={() => handleNavClick('#home-collection')}
              className="w-full text-left py-2.5 px-3 text-slate-800 font-medium hover:bg-slate-50 rounded-md text-sm"
            >
              {t.navHomeCollection}
            </button>
            <button
              onClick={() => handleNavClick('#contact')}
              className="w-full text-left py-2.5 px-3 text-slate-800 font-medium hover:bg-slate-50 rounded-md text-sm"
            >
              {t.navContact}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPrivacy();
              }}
              className="w-full text-left py-2 px-3 text-slate-600 text-xs hover:bg-slate-50 rounded-md flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.navPrivacy}</span>
            </button>
            <div className="pt-3 flex flex-col gap-2">
              <a
                href={`tel:${t.phone}`}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-center text-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-teal-700" />
                <span>{t.callNowBtn}: {t.phone}</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-lg text-center text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.bookTestBtn}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
