import React, { useState, useMemo } from 'react';
import { Search, Plus, Check, AlertCircle, Tag, Filter } from 'lucide-react';
import { TestItem, Language } from '../types';
import { TESTS_DATA } from '../data/testsData';
import { TRANSLATIONS } from '../data/translations';

interface TestDirectoryProps {
  language: Language;
  selectedTestIds: string[];
  onToggleTest: (testId: string) => void;
  onOpenBooking: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const TestDirectory: React.FC<TestDirectoryProps> = ({
  language,
  selectedTestIds,
  onToggleTest,
  onOpenBooking,
  searchQuery: externalSearchQuery,
  onSearchChange,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = (q: string) => {
    setInternalSearchQuery(q);
    if (onSearchChange) {
      onSearchChange(q);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(36);
  const t = TRANSLATIONS[language];

  // Reset pagination when category or search changes
  React.useEffect(() => {
    setVisibleCount(36);
  }, [searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(TESTS_DATA.map(test => test.category))];
    return cats;
  }, []);

  const filteredTests = useMemo(() => {
    return TESTS_DATA.filter(test => {
      const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesName = test.name.toLowerCase().includes(q);
      const matchesNameHi = test.nameHi.toLowerCase().includes(q);
      const matchesCode = test.code ? test.code.toLowerCase().includes(q) : false;
      const matchesDesc = test.description.toLowerCase().includes(q);

      return matchesCategory && (matchesName || matchesNameHi || matchesCode || matchesDesc);
    });
  }, [searchQuery, selectedCategory]);

  const displayedTests = useMemo(() => {
    return filteredTests.slice(0, visibleCount);
  }, [filteredTests, visibleCount]);

  return (
    <section id="tests" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase mb-2">
            <span className="w-6 h-0.5 bg-teal-700"></span>
            <span>{language === 'en' ? 'Diagnostics Menu & Transparent Pricing' : 'जांच सूची एवं पारदर्शी दरें'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {t.testsSectionTitle}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            {t.testsSectionSubtitle}
          </p>
        </div>

        {/* 20% Discount Announcement Strip */}
        <div className="mb-8 p-4 bg-white border border-teal-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {language === 'en'
                  ? 'Flat 20% Discount on Standard MRP for All Patients'
                  : 'सभी मरीजों के लिए मानक एमआरपी (MRP) पर 20% की फ्लैट छूट'}
              </p>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Original MRP is shown crossed out and the discounted rate is clearly displayed. No hidden charges or assigned rates.'
                  : 'मूल एमआरपी को काटकर 20% छूट वाला मूल्य स्पष्ट रूप से दिखाया गया है। कोई छुपा हुआ शुल्क नहीं।'}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold shrink-0 self-start sm:self-auto">
            <span>20% OFF MRP</span>
          </div>
        </div>

        {/* Search Bar & Category Filter Controls */}
        <div className="space-y-4 mb-8">
          
          {/* Search Input Box */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Buttons (Functional Segmented Tab Controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'All' ? t.allCategories : cat}
                </button>
              );
            })}
          </div>

          {/* Quick Counter & Selected Summary */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 tabular-nums">{filteredTests.length}</span>
              <span>{t.totalTestsFound}</span>
              {searchQuery && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Filtered by: "{searchQuery}"</span>
                </>
              )}
            </div>

            {selectedTestIds.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-teal-900 font-medium">
                  {selectedTestIds.length} {language === 'en' ? 'tests selected' : 'टेस्ट चयनित'}
                </span>
                <button
                  onClick={onOpenBooking}
                  className="font-semibold text-teal-800 hover:text-teal-950 underline underline-offset-2 cursor-pointer"
                >
                  {language === 'en' ? 'Proceed to Booking →' : 'बुकिंग फॉर्म पर जाएं →'}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedTests.map((test) => {
            const isSelected = selectedTestIds.includes(test.id);
            const isCBC = test.id === 'cbc' || test.code === 'CBC' || test.name.toLowerCase().includes('complete blood count');

            return (
              <div
                key={test.id}
                className={`flex flex-col justify-between bg-white rounded-xl border p-4.5 transition-all duration-300 card-3d-hover card-hover-lift transform-style-3d relative overflow-hidden ${
                  isSelected
                    ? 'border-teal-700 ring-2 ring-teal-700/60 bg-teal-50/25 shadow-md -translate-y-1'
                    : isCBC
                    ? 'border-emerald-300 ring-1 ring-emerald-200/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Special Tag for CBC */}
                {isCBC && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-600 to-teal-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider font-mono">
                    Special ₹300
                  </div>
                )}

                <div>
                  {/* Category & Sample metadata (unboxed text with separators) */}
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-teal-800">{test.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{language === 'en' ? test.sampleType : test.sampleTypeHi}</span>
                    </div>
                    {test.code && (
                      <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {test.code}
                      </span>
                    )}
                  </div>

                  {/* Test Title */}
                  <h3 className="text-base font-bold text-slate-900 font-serif leading-snug">
                    {language === 'en' ? test.name : test.nameHi}
                  </h3>

                  {/* Secondary name if different */}
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {language === 'en' ? test.nameHi : test.name}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {language === 'en' ? test.description : test.descriptionHi}
                  </p>

                  {/* Fasting Requirement Notice */}
                  {test.fastingRequired && (
                    <div className="mt-2 text-[11px] text-amber-800 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{t.fastingNotice}</span>
                    </div>
                  )}
                </div>

                {/* Price & Action Row: Shows MRP Crossed Out & Discounted Price Prominently */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    {/* MRP crossed out with 20% OFF tag */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-400">MRP:</span>
                      <span className="line-through text-slate-400 font-mono tabular-nums">
                        ₹{test.mrp}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                        {test.discountPercent ? `${test.discountPercent}% OFF` : '20% OFF'}
                      </span>
                    </div>

                    {/* Discounted Price Prominently */}
                    <div className="text-xl font-extrabold font-mono text-teal-900 tabular-nums">
                      ₹{test.discountedPrice}
                    </div>

                    <div className="text-[10px] text-slate-500">
                      {t.provisionalNote}
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleTest(test.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 shadow-xs ${
                      isSelected
                        ? 'bg-teal-800 text-white hover:bg-teal-900'
                        : 'bg-slate-100 text-slate-800 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 border border-slate-200'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.addedToBooking}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t.bookThisTest}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination & Show More Controls */}
        {filteredTests.length > visibleCount && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setVisibleCount(prev => Math.min(prev + 36, filteredTests.length))}
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center"
            >
              {language === 'en'
                ? `Show More Tests (${visibleCount} of ${filteredTests.length})`
                : `और टेस्ट लोड करें (${filteredTests.length} में से ${visibleCount})`}
            </button>
            <button
              onClick={() => setVisibleCount(filteredTests.length)}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer text-center"
            >
              {language === 'en'
                ? `View All ${filteredTests.length} Tests`
                : `सभी ${filteredTests.length} टेस्ट एक साथ देखें`}
            </button>
          </div>
        )}

        {/* Empty state if search finds nothing */}
        {filteredTests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">
              {language === 'en' ? 'No tests matching your search' : 'खोज से मेल खाता कोई टेस्ट नहीं मिला'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === 'en'
                ? 'Try searching with an acronym like CBC, LFT, KFT, TFT, Sugar, or clear the search query.'
                : 'कृपया CBC, LFT, KFT, शुगर जैसे शब्दों से खोजें अथवा सर्च फ़िल्टर हटाएं।'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg cursor-pointer"
            >
              {language === 'en' ? 'Reset Filters' : 'फ़िल्टर रीसेट करें'}
            </button>
          </div>
        )}

        {/* Disclaimer Note at Bottom */}
        <div className="mt-8 p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.pricesDisclaimer}
          </p>
        </div>

      </div>
    </section>
  );
};
