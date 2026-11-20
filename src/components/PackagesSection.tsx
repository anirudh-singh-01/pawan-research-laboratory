import React, { useState, useMemo } from 'react';
import { Check, Info, Tag, Search } from 'lucide-react';
import { HealthPackage, Language } from '../types';
import { HEALTH_PACKAGES } from '../data/packagesData';
import { TRANSLATIONS } from '../data/translations';

interface PackagesSectionProps {
  language: Language;
  onSelectPackageForBooking: (packageName: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  language,
  onSelectPackageForBooking
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(18);
  const t = TRANSLATIONS[language];

  // Reset pagination when filter or search changes
  React.useEffect(() => {
    setVisibleCount(18);
  }, [filterType, searchQuery]);

  const filteredPackages = useMemo(() => {
    return HEALTH_PACKAGES.filter(pkg => {
      const matchesType = filterType === 'all' || pkg.type === filterType;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesType;

      const matchesName = pkg.name.toLowerCase().includes(q);
      const matchesNameHi = pkg.nameHi.toLowerCase().includes(q);
      const matchesDesc = pkg.description.toLowerCase().includes(q);

      return matchesType && (matchesName || matchesNameHi || matchesDesc);
    });
  }, [filterType, searchQuery]);

  const displayedPackages = useMemo(() => {
    return filteredPackages.slice(0, visibleCount);
  }, [filteredPackages, visibleCount]);

  const wellnessCount = useMemo(() => HEALTH_PACKAGES.filter(p => p.type === 'wellness').length, []);
  const fitnessCount = useMemo(() => HEALTH_PACKAGES.filter(p => p.type === 'fitness').length, []);

  return (
    <section id="packages" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase mb-2">
            <span className="w-6 h-0.5 bg-teal-700"></span>
            <span>{language === 'en' ? 'Curated Health Profiles & Packages' : 'हेल्थ एवं फिटनेस पैकेज'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {language === 'en' ? 'Wellness & Fitness Packages' : 'वेलनेस एवं फिटनेस पैकेज'}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            {language === 'en'
              ? 'Multi-test preventative profiles designed for families, seniors, working professionals, and active gym enthusiasts with 20% discount on standard MRP.'
              : 'नियमित स्वास्थ्य निगरानी, वरिष्ठ नागरिकों की देखभाल और जिम-एथलीट रिकवरी हेतु 20% एमआरपी छूट के साथ विशेष जांच पैकेज।'}
          </p>
        </div>

        {/* Notice on Package Pricing & 20% Discount */}
        <div className="mb-8 p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-950 flex items-start gap-3">
          <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <p>
            {language === 'en'
              ? `Complete Laboratory Package Directory: Displaying all ${HEALTH_PACKAGES.length} certified health packages and multi-test panels with a flat 20% discount on standard MRP applied. Original MRP is crossed out and our website discounted rate is shown prominently.`
              : `संपूर्ण लैब पैकेज डायरेक्टरी: सभी ${HEALTH_PACKAGES.length} प्रमाणित हेल्थ पैकेज एवं मल्टी-टेस्ट प्रोफाइल्स मानक एमआरपी पर 20% छूट के साथ उपलब्ध हैं। मूल एमआरपी को काटकर 20% रियायती दर स्पष्ट रूप से दर्शाई गई है।`}
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'en' ? `All Profiles (${HEALTH_PACKAGES.length})` : `सभी प्रोफाइल्स (${HEALTH_PACKAGES.length})`}
              </button>
              <button
                onClick={() => setFilterType('wellness')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap ${
                  filterType === 'wellness'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.navWellness} ({wellnessCount})
              </button>
              <button
                onClick={() => setFilterType('fitness')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap ${
                  filterType === 'fitness'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.navFitness} ({fitnessCount})
              </button>
            </div>

            {/* Search Box for Packages */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search profiles by name...' : 'पैकेज नाम से खोजें...'}
                className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-500">
            {language === 'en'
              ? `Showing ${displayedPackages.length} of ${filteredPackages.length} available profiles`
              : `${filteredPackages.length} में से ${displayedPackages.length} प्रोफाइल दिखाए जा रहे हैं`}
          </div>
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPackages.map((pkg) => {
            const isFitness = pkg.type === 'fitness';
            const tests = language === 'en' ? pkg.testsIncluded : pkg.testsIncludedHi;

            return (
              <div
                key={pkg.id}
                className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200 hover:border-teal-300 p-6 shadow-xs hover:shadow-xl transition-all duration-300 card-3d-hover transform-style-3d"
              >
                <div>
                  {/* Category Type Indicator with 20% OFF pill */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-semibold text-teal-800">
                      {isFitness
                        ? (language === 'en' ? 'Fitness & Athletic' : 'फिटनेस एवं एथलीट')
                        : (language === 'en' ? 'Wellness Profile' : 'वेलनेस प्रोफाइल')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <Tag className="w-3 h-3 text-emerald-600" />
                      <span>20% OFF MRP</span>
                    </span>
                  </div>

                  {/* Package Title */}
                  <h3 className="text-xl font-bold text-slate-900 font-serif leading-tight">
                    {language === 'en' ? pkg.name : pkg.nameHi}
                  </h3>

                  {/* Target Audience */}
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    <strong className="text-slate-700">
                      {language === 'en' ? 'Target: ' : 'उपयुक्त: '}
                    </strong>
                    {language === 'en' ? pkg.targetAudience : pkg.targetAudienceHi}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {language === 'en' ? pkg.description : pkg.descriptionHi}
                  </p>

                  {/* Tests Included List */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5">
                      {t.testsIncludedTitle} ({tests.length})
                    </h4>
                    <ul className="space-y-1.5">
                      {tests.map((testItem, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                          <span className="leading-snug">{testItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample Note */}
                  <div className="mt-4 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700">{t.sampleTypeReq} </span>
                    <span>{pkg.sampleRequired}</span>
                  </div>
                </div>

                {/* Card Footer: Transparent MRP and 20% Discount Pricing */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      {/* Crossed out MRP with discount badge */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400">MRP:</span>
                        <span className="line-through text-slate-400 font-mono tabular-nums">
                          ₹{pkg.mrp}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                          20% OFF
                        </span>
                      </div>

                      {/* Prominent Discounted Price */}
                      <div className="text-xl font-extrabold font-mono text-teal-900 tabular-nums">
                        ₹{pkg.discountedPrice}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectPackageForBooking(language === 'en' ? pkg.name : pkg.nameHi)}
                      className="py-2.5 px-4 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      {language === 'en' ? 'Book Package' : 'पैकेज बुक करें'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state if search finds nothing */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">
              {language === 'en' ? 'No profiles matching your search' : 'खोज से मेल खाता कोई पैकेज नहीं मिला'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en'
                ? 'Try searching with general terms like Wellness, Fitness, Fever, Arthritis, Cardiac, or clear search.'
                : 'कृपया वेलनेस, फिटनेस, फीवर, अर्थराइटिस जैसे शब्दों से खोजें अथवा सर्च फ़िल्टर हटाएं।'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg cursor-pointer"
            >
              {language === 'en' ? 'Reset Filters' : 'फ़िल्टर रीसेट करें'}
            </button>
          </div>
        )}

        {/* Pagination & Show More Controls */}
        {filteredPackages.length > visibleCount && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setVisibleCount(prev => Math.min(prev + 18, filteredPackages.length))}
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center"
            >
              {language === 'en'
                ? `Show More Profiles (${visibleCount} of ${filteredPackages.length})`
                : `और प्रोफाइल देखें (${filteredPackages.length} में से ${visibleCount})`}
            </button>
            <button
              onClick={() => setVisibleCount(filteredPackages.length)}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer text-center"
            >
              {language === 'en'
                ? `View All ${filteredPackages.length} Profiles`
                : `सभी ${filteredPackages.length} प्रोफाइल्स एक साथ देखें`}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
