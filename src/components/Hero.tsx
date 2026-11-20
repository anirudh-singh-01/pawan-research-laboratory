import React, { useState, useRef } from 'react';
import { Phone, Calendar, MessageCircle, Home, MapPin, CheckCircle2, Clock, ShieldCheck, Tag, Sparkles, Box, Image as ImageIcon, Droplets, Dna, FlaskConical, Eye, Layers } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Lab3DScene, SceneMode } from './Lab3DScene';

interface HeroProps {
  language: Language;
  onOpenBooking: () => void;
  onNavigateToHomeCollection: () => void;
  onSelectTest?: (testName: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onOpenBooking,
  onNavigateToHomeCollection,
  onSelectTest,
}) => {
  const t = TRANSLATIONS[language];
  type PathologyVisual = 'cells' | 'tubes' | 'dna' | 'photo';
  const [visualTab, setVisualTab] = useState<PathologyVisual>('cells');

  // 3D Card Tilt State for Test Pricing Card
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardTransform, setCardTransform] = useState({ rotateX: 0, rotateY: 0, glossX: 50, glossY: 50 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // max -6 to +6 deg
    const rotateY = ((x - centerX) / centerX) * 6;
    const glossX = (x / rect.width) * 100;
    const glossY = (y / rect.height) * 100;

    setCardTransform({ rotateX, rotateY, glossX, glossY });
  };

  const handleCardMouseLeave = () => {
    setIsHoveringCard(false);
    setCardTransform({ rotateX: 0, rotateY: 0, glossX: 50, glossY: 50 });
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Pawan Research Laboratory, I would like to inquire about pathology test booking and sample collection in Kanpur.`
  );
  const whatsappUrl = `https://wa.me/919335736360?text=${whatsappMessage}`;

  return (
    <section id="home" className="relative bg-gradient-to-b from-teal-50/60 via-slate-50 to-white pt-8 pb-16 lg:pt-12 lg:pb-20 border-b border-slate-200 overflow-hidden">
      
      {/* Decorative animated background elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-teal-200/20 via-emerald-100/30 to-teal-100/20 blur-3xl pointer-events-none -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Proposition & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Unboxed Section Label with Live Pulse Indicator */}
            <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wider text-teal-800 uppercase">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span className="w-5 h-0.5 bg-teal-700"></span>
              <span>{t.heroBadge}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-normal normal-case">{t.locationShort}</span>
            </div>

            {/* Main Headline - Dark navy/black bold serif typography with smooth fade-in-up */}
            <div className="space-y-2 fade-in-up">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-serif tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                {language === 'en'
                  ? 'Pawan Research Laboratory'
                  : 'पवन रिसर्च लैबोरेटरी'}
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-teal-900/90 font-serif italic">
                "{t.tagline}"
              </p>
            </div>

            {/* Value Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {t.heroSubheading}
            </p>

            {/* Location Line */}
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs max-w-xl transition-all duration-300 hover:shadow-sm hover:border-teal-200">
              <MapPin className="w-5 h-5 text-teal-700 shrink-0 mt-0.5 animate-bounce" style={{ animationDuration: '3s' }} />
              <div>
                <span className="font-semibold text-slate-900">
                  {language === 'en' ? 'Laboratory Location:' : 'प्रयोगशाला का पता:'}
                </span>{' '}
                <span>{t.locationFull}</span>
              </div>
            </div>

            {/* Primary Action Buttons (Original layout & colors with subtle pulse animation) */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {/* 1. Book a Test */}
              <button
                onClick={onOpenBooking}
                className="group relative inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 active:bg-teal-950 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden btn-pulse-medical"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
                <Calendar className="w-4 h-4 text-teal-200 group-hover:scale-110 transition-transform" />
                <span>{t.heroActionBook}</span>
              </button>

              {/* 2. Call Now */}
              <a
                href={`tel:${t.phone}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-800 hover:text-teal-950 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-teal-700" />
                <span>{t.heroActionCall}</span>
              </a>

              {/* 3. WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shadow-xs hover:shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>{t.heroActionWhatsApp}</span>
              </a>

              {/* 4. Home Sample Collection */}
              <button
                onClick={onNavigateToHomeCollection}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-teal-900 bg-teal-100/70 hover:bg-teal-200/80 border border-teal-200 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap cursor-pointer shadow-xs hover:shadow-sm"
              >
                <Home className="w-4 h-4 text-teal-800" />
                <span>{t.heroActionHome}</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium transition-colors hover:text-teal-900">
                <CheckCircle2 className="w-4 h-4 text-teal-700" />
                {t.heroTrust1}
              </span>
              <span className="flex items-center gap-1.5 font-medium transition-colors hover:text-teal-900">
                <CheckCircle2 className="w-4 h-4 text-teal-700" />
                {t.heroTrust2}
              </span>
              <span className="flex items-center gap-1.5 font-medium transition-colors hover:text-teal-900">
                <CheckCircle2 className="w-4 h-4 text-teal-700" />
                {t.heroTrust3}
              </span>
            </div>

          </div>

          {/* Right Column: 3D Interactive Model & Laboratory Photograph & Dark Teal Pricing Card */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 4-Item Visual Showcase Switcher: Blood Cells · Collection Tubes · DNA Helix · Lab Photo */}
            <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <span>{language === 'en' ? 'Pathology Visuals (4 Distinct Views)' : 'पैथोलॉजी विजुअल्स (4 अलग-अलग दृश्य)'}</span>
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {visualTab === 'cells'
                    ? (language === 'en' ? '1/4 Blood Cells' : '1/4 रक्त कोशिका')
                    : visualTab === 'tubes'
                    ? (language === 'en' ? '2/4 Sample Tubes' : '2/4 सैंपल ट्यूब्स')
                    : visualTab === 'dna'
                    ? (language === 'en' ? '3/4 DNA Helix' : '3/4 डीएनए हेलेक्स')
                    : (language === 'en' ? '4/4 Lab Photo' : '4/4 लैब फोटो')}
                </span>
              </div>

              {/* 4 Tab Buttons */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs">
                {/* 1. Blood Cells */}
                <button
                  type="button"
                  onClick={() => setVisualTab('cells')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                    visualTab === 'cells'
                      ? 'bg-rose-700 text-white shadow-xs font-semibold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title="Erythrocytes, Leukocytes & Platelets"
                >
                  <Droplets className="w-3.5 h-3.5 shrink-0 text-rose-300" />
                  <span className="text-[11px] truncate">{language === 'en' ? 'Blood Cells' : 'रक्त कोशिका'}</span>
                </button>

                {/* 2. Vacutainer Tubes */}
                <button
                  type="button"
                  onClick={() => setVisualTab('tubes')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                    visualTab === 'tubes'
                      ? 'bg-purple-700 text-white shadow-xs font-semibold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title="Vacutainer Collection Tubes"
                >
                  <FlaskConical className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                  <span className="text-[11px] truncate">{language === 'en' ? 'Tubes' : 'सैंपल ट्यूब्स'}</span>
                </button>

                {/* 3. DNA Helix */}
                <button
                  type="button"
                  onClick={() => setVisualTab('dna')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                    visualTab === 'dna'
                      ? 'bg-teal-700 text-white shadow-xs font-semibold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title="DNA Double Helix Molecular Model"
                >
                  <Dna className="w-3.5 h-3.5 shrink-0 text-teal-300" />
                  <span className="text-[11px] truncate">{language === 'en' ? 'DNA Helix' : 'डीएनए'}</span>
                </button>

                {/* 4. Lab Photo */}
                <button
                  type="button"
                  onClick={() => setVisualTab('photo')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                    visualTab === 'photo'
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title="Laboratory Photo & Dr. Pawan Pal (M.D)"
                >
                  <ImageIcon className="w-3.5 h-3.5 shrink-0 text-teal-300" />
                  <span className="text-[11px] truncate">{language === 'en' ? 'Lab Photo' : 'लैब फोटो'}</span>
                </button>
              </div>
            </div>

            {/* Media Display Area - Active Main View */}
            {visualTab !== 'photo' ? (
              <Lab3DScene
                language={language}
                onSelectTest={onSelectTest}
                activeMode={visualTab}
                onModeChange={(m) => setVisualTab(m)}
                hideHeader={true}
                className="w-full"
              />
            ) : (
              /* The Laboratory Photograph of Dr. Pawan Pal (M.D) - Preserved exactly as requested */
              <div className="relative rounded-2xl bg-white p-2.5 shadow-lg border border-slate-200 overflow-hidden transition-all duration-300">
                <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-[4/3] max-h-[310px]">
                  <img
                    src="/assets/aistudio/WhatsApp_Image_2026-10-27_at_7.31.24_PM_12933866.jpeg"
                    alt="Pawan Pal (M.D), Pawan Research Laboratory"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle scrim & verified banner */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent p-3 text-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-teal-300 text-xs font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                        <span>Verified Reports · Pawan Pal (M.D)</span>
                      </div>
                      <p className="text-xs font-bold text-white mt-0.5">
                        Pawan Research Laboratory
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-teal-200 bg-teal-900/80 px-2 py-0.5 rounded border border-teal-700">
                      Naubasta · Kanpur
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4 Distinct Pathology Visual Preview Cards - All 4 visible side-by-side (SAB ALAG ALAG DIKHE) */}
            <div className="bg-slate-50/90 rounded-2xl p-2.5 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-700" />
                  {language === 'en' ? 'All 4 Visuals (Side-by-Side)' : 'चारों विजुअल अलग-अलग (क्लिक करके बड़ा देखें)'}
                </span>
                <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {language === 'en' ? 'Click card to view' : 'कार्ड पर क्लिक करें'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* 1. Blood Cells Card */}
                <button
                  type="button"
                  onClick={() => setVisualTab('cells')}
                  className={`text-left p-2.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                    visualTab === 'cells'
                      ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/30'
                      : 'bg-white/90 border-slate-200 hover:border-rose-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                      <Droplets className="w-3.5 h-3.5" />
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      visualTab === 'cells' ? 'bg-rose-700 text-white' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {visualTab === 'cells' ? 'ACTIVE' : '1'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {language === 'en' ? 'Blood Cells' : 'रक्त कोशिका'}
                  </div>
                  <div className="text-[10px] text-rose-700 font-semibold truncate">
                    RBC · WBC · Platelets
                  </div>
                  <div className="text-[9px] text-emerald-700 font-bold truncate mt-0.5">
                    CBC ₹300 Special
                  </div>
                </button>

                {/* 2. Sample Tubes Card */}
                <button
                  type="button"
                  onClick={() => setVisualTab('tubes')}
                  className={`text-left p-2.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                    visualTab === 'tubes'
                      ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-500/30'
                      : 'bg-white/90 border-slate-200 hover:border-purple-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                      <FlaskConical className="w-3.5 h-3.5" />
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      visualTab === 'tubes' ? 'bg-purple-700 text-white' : 'bg-purple-50 text-purple-700'
                    }`}>
                      {visualTab === 'tubes' ? 'ACTIVE' : '2'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {language === 'en' ? 'Sample Tubes' : 'सैंपल ट्यूब्स'}
                  </div>
                  <div className="text-[10px] text-purple-700 font-medium truncate">
                    Lavender · Gold · Red
                  </div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5">
                    EDTA · SST · Clot
                  </div>
                </button>

                {/* 3. DNA Helix Card */}
                <button
                  type="button"
                  onClick={() => setVisualTab('dna')}
                  className={`text-left p-2.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                    visualTab === 'dna'
                      ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/30'
                      : 'bg-white/90 border-slate-200 hover:border-teal-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700">
                      <Dna className="w-3.5 h-3.5" />
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      visualTab === 'dna' ? 'bg-teal-700 text-white' : 'bg-teal-50 text-teal-700'
                    }`}>
                      {visualTab === 'dna' ? 'ACTIVE' : '3'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {language === 'en' ? 'DNA Helix' : 'डीएनए हेलेक्स'}
                  </div>
                  <div className="text-[10px] text-teal-700 font-medium truncate">
                    Double Helix 3D
                  </div>
                  <div className="text-[9px] text-teal-800 font-semibold truncate mt-0.5">
                    99.8% Precision
                  </div>
                </button>

                {/* 4. Lab Photo Card */}
                <button
                  type="button"
                  onClick={() => setVisualTab('photo')}
                  className={`text-left p-2.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                    visualTab === 'photo'
                      ? 'bg-white border-slate-800 shadow-md ring-2 ring-slate-800/30'
                      : 'bg-white/90 border-slate-200 hover:border-slate-400 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      visualTab === 'photo' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {visualTab === 'photo' ? 'ACTIVE' : '4'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {language === 'en' ? 'Lab Photo' : 'लैब फोटो'}
                  </div>
                  <div className="text-[10px] text-slate-700 font-medium truncate">
                    Dr. Pawan Pal (M.D)
                  </div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5">
                    Naubasta · Kanpur
                  </div>
                </button>
              </div>
            </div>

            {/* The Original Dark Teal Test Pricing Card with Interactive 3D Tilt & Lighting */}
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseEnter={() => setIsHoveringCard(true)}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: isHoveringCard
                  ? `perspective(1000px) rotateX(${cardTransform.rotateX}deg) rotateY(${cardTransform.rotateY}deg) scale(1.015)`
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
                transition: isHoveringCard ? 'transform 0.1s ease-out' : 'transform 0.5s ease-in-out',
              }}
              className="relative rounded-2xl bg-gradient-to-br from-teal-900 via-teal-950 to-slate-900 text-white p-5 shadow-xl border border-teal-800/50 overflow-hidden transform-style-3d cursor-default"
            >
              {/* Dynamic 3D specular light glare */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
                style={{
                  background: isHoveringCard
                    ? `radial-gradient(circle at ${cardTransform.glossX}% ${cardTransform.glossY}%, rgba(94, 234, 212, 0.25) 0%, transparent 60%)`
                    : 'none',
                }}
              />
              
              {/* Header inside Graphic Card */}
              <div className="flex items-center justify-between pb-3 border-b border-teal-800/60 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-800 flex items-center justify-center shadow-inner">
                    <svg className="w-4 h-4 text-teal-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                      <line x1="12" y1="22.08" x2="12" y2="12"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-teal-300">
                      Pawan Research Laboratory
                    </p>
                    <p className="text-xs font-semibold text-white">
                      Diagnostic Test Charges (20% OFF MRP)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded border border-emerald-600/70 font-bold shadow-xs">
                  20% OFF
                </span>
              </div>

              {/* Medical Diagnostic Visual Composition */}
              <div className="py-3 my-2 bg-slate-950/50 rounded-xl p-3 border border-teal-800/40 relative z-10">
                <div className="grid grid-cols-3 gap-2 text-center">
                  
                  {/* CBC Test with Special Highlight */}
                  <div className="relative p-2.5 bg-teal-900/50 hover:bg-teal-900/80 rounded-lg border border-teal-600/40 transition-all duration-200 hover:-translate-y-0.5">
                    <div className="text-teal-300 text-[11px] font-medium mb-0.5">
                      {language === 'en' ? 'Routine Tests' : 'रूटीन टेस्ट'}
                    </div>
                    <div className="text-sm sm:text-base font-bold font-mono text-emerald-300 tabular-nums">
                      CBC · ₹300
                    </div>
                    <div className="text-[10px] text-slate-400 line-through">MRP: ₹400</div>
                  </div>

                  {/* LFT */}
                  <div className="p-2.5 bg-teal-900/40 hover:bg-teal-900/70 rounded-lg border border-teal-700/30 transition-all duration-200 hover:-translate-y-0.5">
                    <div className="text-teal-300 text-[11px] font-medium mb-0.5">
                      {language === 'en' ? 'Organ Panels' : 'अंग प्रोफाइल'}
                    </div>
                    <div className="text-sm sm:text-base font-bold font-mono text-white tabular-nums">LFT · ₹520</div>
                    <div className="text-[10px] text-slate-400 line-through">MRP: ₹650</div>
                  </div>

                  {/* Thyroid T3/T4/TSH */}
                  <div className="p-2.5 bg-teal-900/40 hover:bg-teal-900/70 rounded-lg border border-teal-700/30 transition-all duration-200 hover:-translate-y-0.5">
                    <div className="text-teal-300 text-[11px] font-medium mb-0.5">
                      {language === 'en' ? 'Endocrine' : 'हार्मोन जांच'}
                    </div>
                    <div className="text-sm sm:text-base font-bold font-mono text-white tabular-nums">T3/T4/TSH · ₹480</div>
                    <div className="text-[10px] text-slate-400 line-through">MRP: ₹600</div>
                  </div>
                </div>

                {/* Animated ECG Heartbeat / Pathology Biosensor Wave & Hours */}
                <div className="mt-3 pt-2.5 border-t border-teal-800/40 flex items-center justify-between text-[11px] text-teal-200">
                  <div className="flex items-center gap-2">
                    {/* Animated SVG ECG Pulse Line */}
                    <svg className="w-16 h-4 text-emerald-400 overflow-visible" viewBox="0 0 100 24" fill="none">
                      <path
                        d="M0 12 H30 L35 4 L42 20 L48 8 L54 16 L58 12 H100"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-ecg"
                      />
                    </svg>
                    <span className="hidden sm:inline">Single-use Vacutainer Safety</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-teal-300">
                    <Clock className="w-3 h-3 text-teal-400" />
                    <span>07:00 AM – 08:30 PM</span>
                  </div>
                </div>
              </div>

              {/* Direct Booking CTA Card Footnote */}
              <div className="pt-1 flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[11px] text-teal-300">
                    {language === 'en' ? 'Need a sample collected at home?' : 'घर पर खून जांच करवानी है?'}
                  </p>
                  <p className="text-xs font-semibold text-white">
                    {language === 'en' ? 'Book doorstep collection now' : 'तुरंत होम कलेक्शन बुक करें'}
                  </p>
                </div>
                <button
                  onClick={onNavigateToHomeCollection}
                  className="px-3 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                >
                  {language === 'en' ? 'Book Slot' : 'स्लॉट चुनें'}
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Full-width 4-Column Feature/KPI Strip with 3D Depth, Scroll Reveal & Counter Animation */}
        <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 scroll-reveal">
          <div className="p-4 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 hover:border-teal-200 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <p className="text-xl sm:text-2xl font-bold text-teal-900 tracking-tight font-serif flex items-baseline gap-1">
              <span data-counter-target="620" data-counter-suffix="+">620+</span>
              <span className="text-sm font-semibold text-teal-700">
                {language === 'en' ? 'Tests' : 'जांच'}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t.statTestsSub}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 hover:border-teal-200 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <p className="text-xl sm:text-2xl font-bold text-teal-900 tracking-tight font-serif flex items-baseline gap-1">
              <span data-counter-target="10000" data-counter-suffix="+">10,000+</span>
              <span className="text-sm font-semibold text-teal-700">
                {language === 'en' ? 'Patients' : 'मरीज'}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {language === 'en' ? 'Trusted across Kanpur' : 'कानपुर वासियों का भरोसा'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 hover:border-teal-200 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <p className="text-xl sm:text-2xl font-bold text-teal-900 tracking-tight font-serif flex items-baseline gap-1">
              <span data-counter-target="100" data-counter-suffix="%">100%</span>
              <span className="text-sm font-semibold text-teal-700">
                {language === 'en' ? 'Sterile' : 'सुरक्षित'}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t.statCareSub}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 hover:border-teal-200 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <p className="text-xl sm:text-2xl font-bold text-teal-900 tracking-tight font-serif flex items-baseline gap-1">
              <span data-counter-target="20" data-counter-suffix="%">20%</span>
              <span className="text-sm font-semibold text-teal-700">
                {language === 'en' ? 'OFF MRP' : 'छूट'}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {language === 'en' ? 'Flat discount on all tests' : 'सभी जांचों पर सीधी छूट'}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
