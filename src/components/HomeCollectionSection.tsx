import React from 'react';
import { Home, Calendar, Phone, CheckCircle, Shield, Clock, MapPin } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HomeCollectionSectionProps {
  language: Language;
  onBookHomeCollection: () => void;
}

export const HomeCollectionSection: React.FC<HomeCollectionSectionProps> = ({
  language,
  onBookHomeCollection
}) => {
  const t = TRANSLATIONS[language];

  return (
    <section id="home-collection" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase mb-2">
            <span className="w-6 h-0.5 bg-teal-700"></span>
            <span>{language === 'en' ? 'Doorstep Diagnostics' : 'होम सर्विस'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {t.homeSectionTitle}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            {t.homeSectionSubtitle}
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-xl transition-all duration-300 card-3d-hover transform-style-3d">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 font-mono font-bold text-base flex items-center justify-center mb-4 border border-teal-100 shadow-xs">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-2">
              {t.homeStep1Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.homeStep1Desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-xl transition-all duration-300 card-3d-hover transform-style-3d">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 font-mono font-bold text-base flex items-center justify-center mb-4 border border-teal-100 shadow-xs">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-2">
              {t.homeStep2Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.homeStep2Desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-xl transition-all duration-300 card-3d-hover transform-style-3d">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 font-mono font-bold text-base flex items-center justify-center mb-4 border border-teal-100 shadow-xs">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-2">
              {t.homeStep3Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.homeStep3Desc}
            </p>
          </div>

        </div>

        {/* Hygiene & Practical Banner */}
        <div className="bg-white rounded-2xl border border-teal-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wide">
                <Shield className="w-4 h-4 text-teal-700" />
                <span>{language === 'en' ? 'Laboratory Specimen Standards' : 'नमूना सुरक्षा एवं स्वच्छता मानक'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
                {language === 'en'
                  ? 'Sterile Vacutainers & Temperature-Controlled Cold Box'
                  : 'स्टेरिलाइज्ड वैक्युटेनर एवं तापमान-नियंत्रित ट्रांसपोर्ट बॉक्स'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.homeAreaNotice}
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-teal-700" />
                  {language === 'en' ? 'Convenient for Elderly Patients' : 'बुजुर्गों एवं मरीजों के लिए अत्यधिक सुलभ'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-teal-700" />
                  {language === 'en' ? 'Zero Clinic Waiting Time' : 'क्लीनिक में प्रतीक्षा करने की जरूरत नहीं'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-700" />
                  {language === 'en' ? 'Morning Fasting Slots Available' : 'सुबह खाली पेट (फास्टिंग) स्लॉट्स उपलब्ध'}
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={onBookHomeCollection}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-teal-100" />
                <span>{t.homeCtaBtn}</span>
              </button>
              <a
                href={`tel:${t.phone}`}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4 text-teal-700" />
                <span>{language === 'en' ? 'Call for Collection' : 'फोन द्वारा मंगाएं'}</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
