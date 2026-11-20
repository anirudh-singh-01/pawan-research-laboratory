import React from 'react';
import { Phone, Mail, Instagram, MapPin, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ContactSectionProps {
  language: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const whatsappMessage = encodeURIComponent(
    `Hello Pawan Research Laboratory, I would like to inquire about tests and lab timings.`
  );
  const whatsappUrl = `https://wa.me/919335736360?text=${whatsappMessage}`;
  const instagramUrl = `https://instagram.com/pawan_research_laboratory`;

  return (
    <section id="contact" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase mb-2">
            <span className="w-6 h-0.5 bg-teal-700"></span>
            <span>{language === 'en' ? 'Laboratory Contact' : 'संपर्क केंद्र'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {t.contactTitle}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Cards Grid (Left 6-7 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Address Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 border border-teal-100">
                  <MapPin className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {t.addressTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {t.locationFull}
                  </p>
                  <p className="text-xs text-teal-800 font-medium mt-2">
                    {language === 'en'
                      ? 'Landmark: Near Trimurti Apartment, Naubasta Bamba, Hamirpur Road'
                      : 'लैंडमार्क: निकट त्रिमूर्ति अपार्टमेंट, नौबस्ता बम्बा, हमीरपुर रोड'}
                  </p>
                  <div className="mt-3">
                    <a
                      href="https://share.google/ATNYBLrFpXNHxAyVT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-teal-700" />
                      <span>{language === 'en' ? 'Get Directions on Google Maps →' : 'गूगल मैप पर दिशा-निर्देश प्राप्त करें →'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp Actions */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 border border-teal-100">
                  <Phone className="w-5 h-5 text-teal-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    {t.phoneTitle}
                  </h3>
                  <p className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    {t.phone}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en' ? 'Direct phone for inquiries & urgent reporting' : 'जांच जानकारी एवं आपातकालीन सैंपल हेतु उपलब्ध'}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <a
                      href={`tel:${t.phone}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t.callNowBtn}</span>
                    </a>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.whatsappBtn}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email & Instagram Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <Mail className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-bold text-slate-900">{t.emailTitle}</span>
                </div>
                <a
                  href={`mailto:${t.email}`}
                  className="text-xs font-mono text-teal-800 hover:underline break-all block"
                >
                  {t.email}
                </a>
              </div>

              {/* Instagram */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <Instagram className="w-4 h-4 text-pink-700" />
                  <span className="text-xs font-bold text-slate-900">{t.instagramTitle}</span>
                </div>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-teal-800 hover:underline flex items-center gap-1"
                >
                  <span>@{t.instagram}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 block">{t.hoursTitle}</span>
                <span className="text-slate-600">{t.hoursDetail}</span>
              </div>
            </div>

          </div>

          {/* Interactive Google Maps Frame for Kanpur (Right 6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs overflow-hidden">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">
                  {language === 'en' ? 'Laboratory Location · Pawan Research Laboratory' : 'स्थान का मानचित्र · पवन रिसर्च लैबोरेटरी'}
                </span>
              </div>
              <a
                href="https://share.google/ATNYBLrFpXNHxAyVT"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                <span>{language === 'en' ? 'Get Directions' : 'दिशा-निर्देश पाएं'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Google Maps View centered on Pawan Research Laboratory, Hamirpur Road, Hanspuram, Naubasta, Kanpur */}
            <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <iframe
                title="Pawan Research Laboratory Map Location"
                src="https://maps.google.com/maps?q=Pawan+Research+Laboratory,+Hamirpur+Road,+Hanspuram,+Naubasta,+Kanpur,+Uttar+Pradesh&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer"
              ></iframe>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-[11px] text-slate-500 leading-normal">
                {t.mapPlaceholderNotice}
              </p>
              <a
                href="https://share.google/ATNYBLrFpXNHxAyVT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-teal-800 hover:underline font-semibold whitespace-nowrap"
              >
                {language === 'en' ? 'Open in Google Maps ↗' : 'गूगल मैप में खोलें ↗'}
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
