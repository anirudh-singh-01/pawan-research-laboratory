import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Clock, User, MapPin, CheckCircle2, AlertCircle, X, MessageCircle, Send, Edit3, RotateCcw, ShieldCheck, Tag, Stethoscope, Building2 } from 'lucide-react';
import { Language, BookingFormData } from '../types';
import { TESTS_DATA } from '../data/testsData';
import { TRANSLATIONS } from '../data/translations';

interface BookingSectionProps {
  language: Language;
  selectedTestIds: string[];
  onRemoveTest: (testId: string) => void;
  onClearSelectedTests: () => void;
  homeCollectionDefault?: boolean;
  prefilledPackageName?: string;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  language,
  selectedTestIds,
  onRemoveTest,
  onClearSelectedTests,
  homeCollectionDefault = false,
  prefilledPackageName
}) => {
  const t = TRANSLATIONS[language];

  const [formData, setFormData] = useState<BookingFormData>({
    patientName: '',
    referredBy: '',
    hospitalName: '',
    phone: '',
    age: '',
    preferredDate: '',
    preferredTime: 'Morning (07:00 AM - 10:00 AM)',
    homeCollection: homeCollectionDefault,
    address: '',
    selectedTests: [],
    message: ''
  });

  const [customTestInput, setCustomTestInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedData, setSubmittedData] = useState<BookingFormData | null>(null);

  // Sync home collection default
  useEffect(() => {
    if (homeCollectionDefault) {
      setFormData(prev => ({ ...prev, homeCollection: true }));
    }
  }, [homeCollectionDefault]);

  // Sync prefilled package name from PackagesSection
  useEffect(() => {
    if (prefilledPackageName) {
      setFormData(prev => {
        if (!prev.selectedTests.includes(prefilledPackageName)) {
          return {
            ...prev,
            selectedTests: [...prev.selectedTests, prefilledPackageName]
          };
        }
        return prev;
      });
    }
  }, [prefilledPackageName]);

  // Selected test items from catalog
  const selectedTestsList = TESTS_DATA.filter(test => selectedTestIds.includes(test.id));

  // Compute total MRP and discounted price
  const totalMrp = selectedTestsList.reduce((acc, test) => {
    if (typeof test.mrp === 'number') {
      return acc + test.mrp;
    }
    return acc;
  }, 0);

  const totalDiscountedPrice = selectedTestsList.reduce((acc, test) => {
    if (typeof test.discountedPrice === 'number') {
      return acc + test.discountedPrice;
    }
    return acc;
  }, 0);

  const totalSavings = totalMrp - totalDiscountedPrice;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.patientName.trim()) {
      errs.patientName = language === 'en' ? 'Patient full name is required' : 'मरीज का पूरा नाम अनिवार्य है';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = language === 'en' ? 'Please enter a valid 10-digit mobile number' : 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें';
    }

    if (!formData.age.trim() || isNaN(Number(formData.age)) || Number(formData.age) <= 0 || Number(formData.age) > 120) {
      errs.age = language === 'en' ? 'Please enter a valid age (1-120)' : 'कृपया वैध आयु (1-120) दर्ज करें';
    }

    if (!formData.preferredDate) {
      errs.preferredDate = language === 'en' ? 'Preferred appointment date is required' : 'पसंदीदा तारीख अनिवार्य है';
    }

    if (formData.homeCollection && !formData.address.trim()) {
      errs.address = language === 'en' ? 'Address is required for home sample collection' : 'घर पर सैंपल कलेक्शन हेतु पूरा पता अनिवार्य है';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Combine tests from catalog and custom inputs
    const allSelectedNames = [
      ...selectedTestsList.map(t => `${language === 'en' ? t.name : t.nameHi} (₹${t.discountedPrice})`),
      ...(formData.selectedTests || [])
    ];

    const submission: BookingFormData = {
      ...formData,
      selectedTests: allSelectedNames
    };

    setSubmittedData(submission);
    // Smooth scroll to summary
    setTimeout(() => {
      const summaryEl = document.getElementById('booking-summary-anchor');
      if (summaryEl) {
        summaryEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAddCustomTest = () => {
    if (!customTestInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      selectedTests: [...(prev.selectedTests || []), customTestInput.trim()]
    }));
    setCustomTestInput('');
  };

  const handleRemoveCustomTest = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      selectedTests: prev.selectedTests.filter((_, i) => i !== idx)
    }));
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFormData({
      patientName: '',
      referredBy: '',
      hospitalName: '',
      phone: '',
      age: '',
      preferredDate: '',
      preferredTime: 'Morning (07:00 AM - 10:00 AM)',
      homeCollection: false,
      address: '',
      selectedTests: [],
      message: ''
    });
    setErrors({});
    onClearSelectedTests();
  };

  const generateWhatsAppMessage = (data: BookingFormData) => {
    const testsStr = data.selectedTests && data.selectedTests.length > 0
      ? data.selectedTests.join(', ')
      : (language === 'en' ? 'General Pathology Inquiry / Tests to confirm with lab' : 'सामान्य जांच पूछताछ / टेस्ट की पुष्टि लैब से करनी है');

    const homeCollectionText = data.homeCollection
      ? `YES (Home Sample Collection Required)\n*Address:* ${data.address || 'Address provided verbally'}`
      : 'NO (Patient will visit Pawan Research Laboratory in Naubasta)';

    const referralText = data.referredBy?.trim()
      ? `\n*Referred By (Doctor):* ${data.referredBy.trim()}`
      : '';
    const hospitalText = data.hospitalName?.trim()
      ? `\n*Hospital/Clinic:* ${data.hospitalName.trim()}`
      : '';

    const pricingInfo = totalDiscountedPrice > 0
      ? `\n*Est. Total (20% OFF):* ₹${totalDiscountedPrice} (Standard MRP: ₹${totalMrp})`
      : '';

    const text = `*Booking Request - Pawan Research Laboratory*
━━━━━━━━━━━━━━━━━━━━━━━━━
*Patient Name:* ${data.patientName}${referralText}${hospitalText}
*Phone Number:* ${data.phone}
*Age:* ${data.age} years
*Preferred Date:* ${data.preferredDate}
*Preferred Time:* ${data.preferredTime}
*Home Collection:* ${homeCollectionText}
*Selected Tests:* ${testsStr}${pricingInfo}
${data.message ? `*Notes/Prescription:* ${data.message}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━
_Note: Sent from Pawan Research Laboratory Website. Booking is subject to laboratory confirmation. 20% discount on standard MRP applied._`;

    return encodeURIComponent(text);
  };

  return (
    <section id="book-test" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase mb-2">
            <span className="w-6 h-0.5 bg-teal-700"></span>
            <span>{language === 'en' ? 'Appointment & Inquiry' : 'जांच बुकिंग'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {t.bookingTitle}
          </h2>
          <p className="mt-2 text-base text-slate-600">
            {t.bookingSubtitle}
          </p>
        </div>

        {/* Anchor for scrolling */}
        <div id="booking-summary-anchor"></div>

        {/* STATE 1: If Submitted, Show Clear Booking Request Summary */}
        {submittedData ? (
          <div className="bg-white rounded-2xl border-2 border-teal-800 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in duration-300">
            
            {/* Success Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-teal-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-6 h-6 text-teal-100" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-950 font-serif">
                    {t.bookingSummaryTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t.bookingSuccessMessage}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSubmittedData(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.editBookingBtn}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Reset form"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.newBookingBtn}</span>
                </button>
              </div>
            </div>

            {/* Crucial Notice 1: Booking is NOT confirmed until laboratory confirms it */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 mb-0.5">
                  {language === 'en' ? 'Confirmation Pending with Laboratory' : 'पुष्टि प्रतीक्षित (लैब द्वारा)'}
                </p>
                <p className="leading-relaxed">
                  {t.notConfirmedNotice}
                </p>
              </div>
            </div>

            {/* Summary Details Grid */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Patient Name */}
                <div className="pb-3 sm:border-b-0 border-b border-slate-200/80">
                  <span className="text-xs text-slate-500 font-medium block">
                    {t.patientNameLabel}
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {submittedData.patientName}
                  </span>
                </div>

                {/* Referred By (Doctor) & Hospital */}
                <div className="pb-3 sm:border-b-0 border-b border-slate-200/80">
                  <span className="text-xs text-slate-500 font-medium block">
                    {t.referredByLabel}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 block">
                    {submittedData.referredBy?.trim() ? (
                      `Dr. ${submittedData.referredBy.trim().replace(/^(dr\.?|doctor)\s+/i, '')}`
                    ) : (
                      <span className="text-slate-500 font-normal italic">
                        {language === 'en' ? 'Direct / Self' : 'स्वयं / प्रत्यक्ष'}
                      </span>
                    )}
                  </span>
                  {submittedData.hospitalName?.trim() && (
                    <span className="text-xs text-teal-800 font-medium flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-teal-700 shrink-0" />
                      <span>{submittedData.hospitalName.trim()}</span>
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="pb-3 sm:border-b-0 border-b border-slate-200/80">
                  <span className="text-xs text-slate-500 font-medium block">
                    {t.phoneLabel}
                  </span>
                  <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                    +91 {submittedData.phone}
                  </span>
                </div>

                {/* Age */}
                <div className="pb-3 sm:border-b-0 border-b border-slate-200/80">
                  <span className="text-xs text-slate-500 font-medium block">
                    {t.ageLabel}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {submittedData.age} {language === 'en' ? 'Years' : 'वर्ष'}
                  </span>
                </div>

                {/* Preferred Date & Time */}
                <div className="pb-3 sm:border-b-0 border-b border-slate-200/80">
                  <span className="text-xs text-slate-500 font-medium block">
                    {t.dateLabel} & {t.timeLabel}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {submittedData.preferredDate} · {submittedData.preferredTime}
                  </span>
                </div>

                {/* Home Sample Collection Choice */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block mb-1">
                    {t.homeCollectionQuestion}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                      submittedData.homeCollection
                        ? 'bg-teal-100 text-teal-900 border border-teal-300'
                        : 'bg-slate-200 text-slate-800'
                    }`}>
                      {submittedData.homeCollection ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-800" />
                          <span>{t.homeYes}</span>
                        </>
                      ) : (
                        <span>{t.homeNo}</span>
                      )}
                    </span>
                  </div>

                  {submittedData.homeCollection && submittedData.address && (
                    <div className="mt-2.5 p-3 bg-white border border-slate-200 rounded-lg text-xs">
                      <span className="text-slate-500 font-semibold block mb-0.5">
                        {t.addressLabel}:
                      </span>
                      <span className="text-slate-800 font-medium">
                        {submittedData.address}
                      </span>
                    </div>
                  )}
                </div>

                {/* Selected Tests & 20% Discount Breakdown */}
                <div className="sm:col-span-2 pt-3 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <span className="text-xs text-slate-500 font-medium">
                      {t.selectedTestsLabel}:
                    </span>
                    {totalDiscountedPrice > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">
                          MRP: <span className="line-through font-mono">₹{totalMrp}</span>
                        </span>
                        <span className="text-emerald-700 font-semibold">
                          Save ₹{totalSavings} (20% OFF)
                        </span>
                        <span className="text-teal-950 font-bold font-mono text-sm">
                          Total: ₹{totalDiscountedPrice}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {submittedData.selectedTests && submittedData.selectedTests.length > 0 ? (
                      submittedData.selectedTests.map((tName, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs"
                        >
                          {tName}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">
                        {language === 'en' ? 'General Diagnostic Consultation / Tests to confirm with laboratory' : 'सामान्य जांच परामर्श / टेस्ट की पुष्टि लैब से करेंगे'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Optional Message */}
                {submittedData.message && (
                  <div className="sm:col-span-2 pt-3 border-t border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block mb-1">
                      {t.messageLabel}:
                    </span>
                    <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                      "{submittedData.message}"
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Action Buttons: WhatsApp (with pre-filled text) & Call Laboratory (tel:+919335736360) */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {/* Button 1: Send Booking Request on WhatsApp with pre-filled details */}
              <a
                href={`https://wa.me/919335736360?text=${generateWhatsAppMessage(submittedData)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-5 h-5 text-white shrink-0" />
                <span>{t.sendOnWhatsAppBtn}</span>
              </a>

              {/* Button 2: Call Laboratory using tel:+919335736360 */}
              <a
                href="tel:+919335736360"
                className="flex-1 py-3.5 px-5 bg-slate-900 hover:bg-slate-950 text-white font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <span>{t.callLabBtn}</span>
              </a>
            </div>

            {/* Crucial Notice 2: Privacy / No Database Storage Notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {t.noDatabaseNotice}
              </p>
            </div>

          </div>
        ) : (
          /* STATE 2: The Booking Input Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Notice Banner */}
            <div className="p-3.5 bg-teal-50/60 border border-teal-200 rounded-xl flex items-start gap-2.5 text-xs text-teal-950">
              <AlertCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {t.bookingDemoDisclaimer}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Patient Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {t.patientNameLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => {
                      setFormData({ ...formData, patientName: e.target.value });
                      if (errors.patientName) setErrors({ ...errors, patientName: '' });
                    }}
                    placeholder={t.patientNamePlaceholder}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 ${
                      errors.patientName ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.patientName && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.patientName}</p>
                )}
              </div>

              {/* 1. Referred By (Doctor's Name) - Directly below/next to Patient Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {t.referredByLabel}
                </label>
                <div className="relative">
                  <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.referredBy || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, referredBy: e.target.value });
                    }}
                    placeholder={t.referredByPlaceholder}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>

              {/* 2. Hospital Name (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {t.hospitalNameLabel}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.hospitalName || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, hospitalName: e.target.value });
                    }}
                    placeholder={t.hospitalNamePlaceholder}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>

              {/* Mobile Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {t.phoneLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    placeholder={t.phonePlaceholder}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-700 ${
                      errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {t.ageLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => {
                    setFormData({ ...formData, age: e.target.value });
                    if (errors.age) setErrors({ ...errors, age: '' });
                  }}
                  placeholder={t.agePlaceholder}
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-700 ${
                    errors.age ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.age && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.age}</p>
                )}
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {t.dateLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={formData.preferredDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setFormData({ ...formData, preferredDate: e.target.value });
                      if (errors.preferredDate) setErrors({ ...errors, preferredDate: '' });
                    }}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 ${
                      errors.preferredDate ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.preferredDate && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.preferredDate}</p>
                )}
              </div>
            </div>

            {/* Preferred Time Slot */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                {t.timeLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: t.timeSlotMorning, value: 'Morning (07:00 AM - 10:00 AM)' },
                  { label: t.timeSlotMidday, value: 'Midday (10:00 AM - 01:00 PM)' },
                  { label: t.timeSlotAfternoon, value: 'Afternoon (01:00 PM - 05:00 PM)' },
                  { label: t.timeSlotEvening, value: 'Evening (05:00 PM - 08:00 PM)' }
                ].map((slot) => (
                  <button
                    type="button"
                    key={slot.value}
                    onClick={() => setFormData({ ...formData, preferredTime: slot.value })}
                    className={`p-2.5 text-xs font-medium rounded-lg border text-left transition-colors flex items-center justify-between cursor-pointer ${
                      formData.preferredTime === slot.value
                        ? 'border-teal-700 bg-teal-50 text-teal-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{slot.label}</span>
                    {formData.preferredTime === slot.value && (
                      <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Home Collection Required Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                {t.homeCollectionQuestion}
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, homeCollection: false })}
                  className={`flex-1 p-3 text-xs font-medium rounded-xl border text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
                    !formData.homeCollection
                      ? 'border-teal-700 bg-teal-50 text-teal-950 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    !formData.homeCollection ? 'border-teal-700 bg-teal-800' : 'border-slate-300'
                  }`}>
                    {!formData.homeCollection && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                  <span>{t.homeNo}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, homeCollection: true })}
                  className={`flex-1 p-3 text-xs font-medium rounded-xl border text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
                    formData.homeCollection
                      ? 'border-teal-700 bg-teal-50 text-teal-950 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    formData.homeCollection ? 'border-teal-700 bg-teal-800' : 'border-slate-300'
                  }`}>
                    {formData.homeCollection && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                  <span className="font-semibold text-teal-900">{t.homeYes}</span>
                </button>
              </div>
            </div>

            {/* Address field (Conditional if home collection is YES) */}
            {formData.homeCollection && (
              <div className="p-4 bg-teal-50/40 border border-teal-200 rounded-xl space-y-2 animate-in fade-in duration-200">
                <label className="block text-xs font-semibold text-slate-900">
                  {t.addressLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      if (errors.address) setErrors({ ...errors, address: '' });
                    }}
                    placeholder={t.addressPlaceholder}
                    className={`w-full pl-10 pr-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 ${
                      errors.address ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-600 font-medium">{errors.address}</p>
                )}
                <p className="text-[11px] text-slate-500">
                  {language === 'en'
                    ? 'Coverage: Naubasta, Hanspuram, Awas Vikas, Yashoda Nagar, and nearby South Kanpur locations.'
                    : 'कवरेज क्षेत्र: नौबस्ता, हंसपुरम, आवास विकास, यशोदा नगर एवं निकटवर्ती दक्षिण कानपुर।'}
                </p>
              </div>
            )}

            {/* Selected Tests Container */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-800">
                  {t.selectedTestsLabel}
                </label>
                {(selectedTestsList.length > 0 || (formData.selectedTests && formData.selectedTests.length > 0)) && (
                  <button
                    type="button"
                    onClick={() => {
                      onClearSelectedTests();
                      setFormData(prev => ({ ...prev, selectedTests: [] }));
                    }}
                    className="text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Clear all' : 'सभी हटाएं'}
                  </button>
                )}
              </div>

              {/* List of currently selected tests from catalog */}
              {selectedTestsList.length === 0 && (!formData.selectedTests || formData.selectedTests.length === 0) ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 flex items-center justify-between">
                  <span>{t.noTestsSelectedYet}</span>
                  <a
                    href="#tests"
                    className="font-semibold text-teal-800 hover:text-teal-950 underline underline-offset-2"
                  >
                    {t.selectFromListBtn}
                  </a>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTestsList.map(test => (
                    <div
                      key={test.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-900 rounded-lg text-xs font-medium"
                    >
                      <span>{language === 'en' ? test.name : test.nameHi}</span>
                      <span className="text-[10px] line-through text-slate-400 font-mono">₹{test.mrp}</span>
                      <span className="font-mono text-teal-800 font-bold">₹{test.discountedPrice}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveTest(test.id)}
                        className="text-teal-600 hover:text-teal-950 ml-1 cursor-pointer"
                        title="Remove test"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {(formData.selectedTests || []).map((customTest, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-medium"
                    >
                      <span>{customTest}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomTest(idx)}
                        className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add custom or prescription test name */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={customTestInput}
                  onChange={(e) => setCustomTestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTest();
                    }
                  }}
                  placeholder={language === 'en' ? 'Add package name or custom test (e.g. Lipid Profile, Full Body)' : 'अन्य टेस्ट या पैकेज का नाम लिखें...'}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTest}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg cursor-pointer"
                >
                  {language === 'en' ? '+ Add' : '+ जोड़ें'}
                </button>
              </div>
            </div>

            {/* Additional Message / Prescription Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                {t.messageLabel}
              </label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t.messagePlaceholder}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 active:bg-teal-950 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-teal-100" />
                <span>{t.submitBookingBtn}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};
