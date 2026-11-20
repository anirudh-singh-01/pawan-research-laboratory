import React from 'react';
import { X, ShieldCheck, AlertCircle, FileText, Lock } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface PrivacyPolicyModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  language,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
          aria-label="Close privacy modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 border border-teal-100">
            <Lock className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              {t.privacyTitle}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              {t.privacyLastUpdated} · Pawan Research Laboratory
            </p>
          </div>
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs">
              <strong>Medical Disclaimer:</strong> Information on this website is provided solely for general informational, educational, and service scheduling purposes. It does not constitute medical advice, diagnosis, or clinical consultation. Always consult a licensed medical doctor or qualified physician for interpretation of laboratory results and treatment decisions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              1. Laboratory Price Confirmation & Provisional Rates
            </h3>
            <p>
              All test fees, bundle rates, and wellness packages listed on this website reflect a flat 20% discount on standard laboratory MRP. Final charges, fasting or dietary requirements, and test availability must be confirmed directly with the staff of Pawan Research Laboratory prior to test execution or sample collection.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              2. Demonstration Nature of this Web Preview
            </h3>
            <p>
              This website serves as a preview portal. No real electronic health records (EHR) or confidential clinical diagnostic records are permanently stored on public web servers or transmitted to unverified third parties. No automated backend database or admin panel is active for storing patient data. Requests submitted through the booking interface represent scheduling inquiries which are finalized directly through phone or verified direct laboratory communication.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              3. Patient Privacy & Specimen Confidentiality
            </h3>
            <p>
              Pawan Research Laboratory strictly respects patient dignity and privacy. Clinical diagnostic results are treated as strictly confidential medical records, shared solely with the designated patient, patient’s authorized guardian, or attending physician as authorized by Indian medical guidelines.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              4. Ethical Transparency & Compliance
            </h3>
            <p>
              We adhere to truthful representation: we do not publish fabricated user testimonials, unverified doctor credentials, or unsubstantiated medical claims. Our laboratory focuses on diligent pathology testing, strict sample hygiene with single-use sterile disposables, and prompt report delivery.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              5. Contact for Privacy & Records
            </h3>
            <p>
              For any questions regarding patient privacy, specimen handling, or report verification, please reach out to:
              <br />
              <strong className="text-slate-800">Pawan Research Laboratory</strong>
              <br />
              Near Trimurti Apartment, Naubasta Bamba, Hamirpur Road, Hanspuram, Naubasta, Kanpur Nagar, Uttar Pradesh - 208021, India
              <br />
              Phone: 9335736360 | Email: palp58391@gmail.com
            </p>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg cursor-pointer"
          >
            {language === 'en' ? 'Understood & Close' : 'स्वीकार करें एवं बंद करें'}
          </button>
        </div>

      </div>
    </div>
  );
};
