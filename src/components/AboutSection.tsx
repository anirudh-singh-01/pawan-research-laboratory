import React from 'react';
import { ShieldCheck, FileCheck, MapPin, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AboutSectionProps {
  language: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <section id="about" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <div className="max-w-3xl mb-12 scroll-reveal">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase mb-2">
            <span className="w-6 h-0.5 bg-teal-700"></span>
            <span>{language === 'en' ? 'Our Commitment' : 'हमारी प्रतिबद्धता'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {t.aboutTitle}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            {t.aboutSubtitle}
          </p>
        </div>

        {/* Narrative & Core Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Narrative Paragraphs */}
          <div className="lg:col-span-7 space-y-4 text-slate-600 text-base leading-relaxed scroll-reveal" data-reveal-delay="100">
            <p>
              {t.aboutP1}
            </p>
            <p>
              {t.aboutP2}
            </p>
            <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-100 text-sm text-teal-950">
              <span className="font-semibold text-teal-900 block mb-1">
                {language === 'en' ? 'Laboratory Ethics & Integrity' : 'नैतिकता एवं गुणवत्ता नीति'}
              </span>
              <span>
                {language === 'en'
                  ? 'All tests are performed with standardized diagnostic methodologies. We maintain transparent pricing with a flat 20% discount on MRP for patients and assist with proper fasting, diet, and medication guidelines before any blood draw.'
                  : 'सभी परीक्षण मानकीकृत नैदानिक विधियों द्वारा संपन्न किए जाते हैं। हम मरीजों हेतु एमआरपी पर 20% छूट के साथ पारदर्शी दरों का पालन करते हैं।'}
              </span>
            </div>
          </div>

          {/* 3 Structured Core Pillars */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-teal-300 transition-all duration-300 card-3d-hover card-hover-lift transform-style-3d shadow-xs hover:shadow-md scroll-reveal" data-reveal-delay="150">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {t.aboutPoint1Title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 leading-normal">
                    {t.aboutPoint1Desc}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-teal-300 transition-all duration-300 card-3d-hover card-hover-lift transform-style-3d shadow-xs hover:shadow-md scroll-reveal" data-reveal-delay="250">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 shadow-xs">
                  <FileCheck className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {t.aboutPoint2Title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 leading-normal">
                    {t.aboutPoint2Desc}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-teal-300 transition-all duration-300 card-3d-hover card-hover-lift transform-style-3d shadow-xs hover:shadow-md scroll-reveal" data-reveal-delay="350">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {t.aboutPoint3Title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 leading-normal">
                    {t.aboutPoint3Desc}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
