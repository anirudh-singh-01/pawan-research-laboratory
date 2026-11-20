import React from 'react';
import { Phone, Mail, Instagram, MapPin, Globe, Shield, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenPrivacy: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onLanguageChange,
  onOpenPrivacy,
  onOpenBooking
}) => {
  const t = TRANSLATIONS[language];

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Brand & Purpose (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m14 2 4 4-2 2-4-4 2-2Z"/>
                  <path d="M12 4v4"/>
                  <path d="m2 22 7-7"/>
                  <circle cx="16" cy="18" r="4"/>
                </svg>
              </div>
              <span className="text-white font-bold text-base font-serif tracking-tight">
                {t.brandName}
              </span>
            </div>

            <p className="text-teal-400 font-medium font-serif italic text-sm">
              "{t.tagline}"
            </p>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              {t.footerDesc}
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-400 border border-slate-800 text-xs transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}</span>
              </button>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-mono">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavClick('#home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#tests')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navTests}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#packages')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navWellness} & {t.navFitness}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#home-collection')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navHomeCollection}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navContact}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-teal-400 transition-colors cursor-pointer text-slate-400 flex items-center gap-1"
                >
                  <Shield className="w-3 h-3 text-teal-500" />
                  <span>{t.navPrivacy}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Address (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-mono">
              {t.contactDetails}
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{t.locationFull}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`tel:${t.phone}`} className="hover:text-white font-mono">
                  +91 {t.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${t.email}`} className="hover:text-white font-mono break-all">
                  {t.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <a
                  href={`https://instagram.com/${t.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-mono"
                >
                  @{t.instagram}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2 px-3 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-center font-medium transition-colors cursor-pointer"
              >
                {t.bookTestBtn}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Line: Disclaimer & Copyright of Pawan Research Laboratory */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>{t.copyright}</p>
          <div className="flex items-center gap-3">
            <button onClick={onOpenPrivacy} className="hover:text-slate-300 underline cursor-pointer">
              {t.navPrivacy}
            </button>
            <span aria-hidden="true">·</span>
            <span>20% Discount on MRP applied across all tests</span>
          </div>
        </div>

      </div>

      {/* Website Designer Credit - Positioned at the very end of the page in normal document flow */}
      <div className="border-t border-slate-900 bg-black/40 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-semibold">
              Website Designed By
            </div>
            <div className="text-sm font-bold text-white font-serif tracking-tight">
              Anirudh Singh
            </div>
            <div className="text-xs text-slate-400">
              Contact For Website Design · <span className="font-mono text-teal-300 font-medium">Mobile: 9580724016</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            <a
              href="tel:+919580724016"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-teal-200 border border-slate-800 rounded-lg text-xs font-semibold transition-colors"
              title="Call Anirudh Singh"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>Call 9580724016</span>
            </a>
            <a
              href="https://wa.me/919580724016?text=Hello%20Anirudh,%20I%20saw%20your%20work%20on%20the%20Pawan%20Research%20Laboratory%20website%20and%20would%20like%20to%20inquire%20about%20website%20design%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors"
              title="WhatsApp Anirudh Singh"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};
