const fs = require('fs');

// Read rate list text file
const content = fs.readFileSync('public/assets/aistudio/Pawan_Research_Laboratory_All_Rates_and_AI_Studio_Prompt_dab25af2.txt', 'utf8');
const lines = content.split('\n');

let idxA = lines.findIndex(l => l.includes('SECTION A — INDIVIDUAL TESTS'));
let idxB = lines.findIndex(l => l.includes('SECTION B — PROFILES AND PACKAGES'));
let idxEndB = lines.findIndex((l, i) => i > idxB && l.includes('GOOGLE AI STUDIO PROMPT'));

const testsA = [];
for (let i = idxA; i < idxB; i++) {
  const line = lines[i].trim();
  if (/^\d+\./.test(line)) {
    const match = line.match(/^(\d+)\.\s*(.*?)\s*\|\s*MRP:\s*(.*?)\s*\|\s*20% discount:\s*(.*?)\s*\|\s*Website price:\s*(.*)$/);
    if (match) {
      testsA.push({
        num: parseInt(match[1], 10),
        name: match[2].trim(),
        mrp: parseInt(match[3].replace(/[₹,]/g, '').trim(), 10),
        discount: parseInt(match[4].replace(/[₹,]/g, '').trim(), 10),
        price: parseInt(match[5].replace(/[₹,]/g, '').trim(), 10)
      });
    }
  }
}

const pkgsB = [];
for (let i = idxB; i < idxEndB; i++) {
  const line = lines[i].trim();
  if (/^\d+\./.test(line)) {
    const match = line.match(/^(\d+)\.\s*(.*?)\s*\|\s*MRP:\s*(.*?)\s*\|\s*20% discount:\s*(.*?)\s*\|\s*Website price:\s*(.*)$/);
    if (match) {
      pkgsB.push({
        num: parseInt(match[1], 10),
        name: match[2].trim(),
        mrp: parseInt(match[3].replace(/[₹,]/g, '').trim(), 10),
        discount: parseInt(match[4].replace(/[₹,]/g, '').trim(), 10),
        price: parseInt(match[5].replace(/[₹,]/g, '').trim(), 10)
      });
    }
  }
}

console.log(`Parsed ${testsA.length} tests from Section A and ${pkgsB.length} packages from Section B.`);

// Common Hindi mappings for common words
const hindiWordMap = {
  'URINE': 'यूरिन (मूत्र)',
  'BLOOD': 'रक्त',
  'STOOL': 'मल (स्टूल)',
  'SPUTUM': 'बलगम',
  'PUS': 'मवाद',
  'FLUID': 'द्रव',
  'SWAB': 'स्वाब',
  'THYROID': 'थायराइड',
  'LIVER': 'लिवर',
  'KIDNEY': 'किडनी',
  'GLUCOSE': 'ग्लूकोज',
  'FASTING': 'फास्टिंग',
  'PROFILE': 'प्रोफाइल',
  'PANEL': 'पैनल',
  'CULTURE': 'कल्चर',
  'ANTIBODY': 'एंटीबॉडी',
  'ANTIGEN': 'एंटीजन',
  'PROTEIN': 'प्रोटीन',
  'CALCIUM': 'कैल्शियम',
  'VITAMIN': 'विटामिन',
  'HEPATITIS': 'हेपेटाइटिस',
  'MALARIA': 'मलेरिया',
  'DENGUE': 'डेंगू',
  'TYPHOID': 'टाइफाइड',
  'ALLERGY': 'एलर्जी'
};

function getSampleInfo(name) {
  const u = name.toUpperCase();
  if (u.includes('URINE')) return { type: 'Urine', typeHi: 'यूरिन (मूत्र)' };
  if (u.includes('STOOL')) return { type: 'Stool', typeHi: 'मल (स्टूल)' };
  if (u.includes('SPUTUM')) return { type: 'Sputum', typeHi: 'बलगम' };
  if (u.includes('SEMEN')) return { type: 'Semen', typeHi: 'सीमेन' };
  if (u.includes('PUS')) return { type: 'Pus Swab', typeHi: 'मवाद स्वाब' };
  if (u.includes('SWAB')) return { type: 'Swab', typeHi: 'स्वाब' };
  if (u.includes('CSF') || u.includes('FLUID') || u.includes('PLEURAL') || u.includes('ASCITIC')) return { type: 'Body Fluid', typeHi: 'शारीरिक द्रव' };
  if (u.includes('TISSUE') || u.includes('BIOPSY')) return { type: 'Tissue', typeHi: 'बायोप्सी / ऊतक' };
  return { type: 'Blood', typeHi: 'रक्त' };
}

function getCategory(name) {
  const u = name.toUpperCase();
  if (u.includes('THYROID') || u.includes('TSH') || u.includes('T3') || u.includes('T4') || u.includes('FSH') || u.includes('LH') || u.includes('PROGESTERONE') || u.includes('ESTRADIOL') || u.includes('PROLACTIN') || u.includes('CORTISOL') || u.includes('TESTOSTERONE') || u.includes('HORMONE') || u.includes('AMH') || u.includes('BETA HCG') || u.includes('DHEA') || u.includes('PSA') || u.includes('INSULIN')) {
    return 'Thyroid & Hormones';
  }
  if (u.includes('GLUCOSE') || u.includes('SUGAR') || u.includes('HBA1C') || u.includes('GTT') || u.includes('OGTT') || u.includes('METABOLIC')) {
    return 'Diabetes & Metabolic';
  }
  if (u.includes('CBC') || u.includes('HEMOGLOBIN') || u.includes('ESR') || u.includes('PLATELET') || u.includes('LEUKOCYTE') || u.includes('DLC') || u.includes('TLC') || u.includes('RBC') || u.includes('COAGULATION') || u.includes('PT/INR') || u.includes('BLOOD GROUP') || u.includes('ABO') || u.includes('PERIPHERAL') || u.includes('GBP') || u.includes('HEMATOLOGY')) {
    return 'Hematology';
  }
  if (u.includes('VITAMIN') || u.includes('CALCIUM') || u.includes('IRON') || u.includes('FERRITIN') || u.includes('ELECTROLYTE') || u.includes('POTASSIUM') || u.includes('SODIUM') || u.includes('ZINC') || u.includes('MAGNESIUM') || u.includes('PHOSPHORUS') || u.includes('COPPER')) {
    return 'Vitamins & Minerals';
  }
  if (u.includes('HIV') || u.includes('HEPATITIS') || u.includes('HBSAG') || u.includes('HCV') || u.includes('DENGUE') || u.includes('MALARIA') || u.includes('TYPHOID') || u.includes('WIDAL') || u.includes('COVID') || u.includes('CULTURE') || u.includes('C/S') || u.includes('AFB') || u.includes('ANTIBODY') || u.includes('SEROLOGY') || u.includes('ELISA') || u.includes('INFECTION') || u.includes('VDRL') || u.includes('SYPHILIS') || u.includes('TORCH') || u.includes('CHIKUNGUNYA') || u.includes('MANTOUX') || u.includes('ALLERGY')) {
    return 'Infectious & Serology';
  }
  if (u.includes('LIVER') || u.includes('SGPT') || u.includes('SGOT') || u.includes('BILIRUBIN') || u.includes('KIDNEY') || u.includes('CREATININE') || u.includes('UREA') || u.includes('URIC ACID') || u.includes('LIPID') || u.includes('CHOLESTEROL') || u.includes('TRIGLYCERIDES') || u.includes('PROTEIN') || u.includes('ALBUMIN') || u.includes('AMYLASE') || u.includes('LIPASE') || u.includes('LDH') || u.includes('ALKALINE PHOSPHATASE') || u.includes('ELECTROPHORESIS')) {
    return 'Biochemistry';
  }
  return 'Clinical Pathology & Others';
}

function getFasting(name) {
  const u = name.toUpperCase();
  return u.includes('FASTING') || u.includes('LIPID') || u.includes('FBS') || u.includes('CHOLESTEROL') || u.includes('TRIGLYCERIDE');
}

// Map of known medical test names to Hindi equivalents
const knownHindiNames = {
  'Complete Blood Count (CBC)': 'कम्प्लीट ब्लड काउंट (CBC)',
  'Hemoglobin (HB)': 'हीमोग्लोबिन (HB)',
  'Total Leukocyte Count (TLC)': 'टोटल ल्यूकोसाइट काउंट (TLC)',
  'Differential Leukocyte Count (DLC)': 'डिफरेंशियल ल्यूकोसाइट काउंट (DLC)',
  'Platelet Count': 'प्लेटलेट काउंट',
  'Erythrocyte Sedimentation Rate (ESR)': 'ईएसआर (ESR)',
  'ABO Group & RH Type (Blood Group)': 'ब्लड ग्रुप एवं आरएच टाइप',
  'Liver Function Test (LFT)': 'लिवर फंक्शन टेस्ट (LFT)',
  'Kidney Function Test (KFT)': 'किडनी फंक्शन टेस्ट (KFT)',
  'Lipid Profile': 'लिपिड प्रोफाइल (कोलेस्ट्रॉल)',
  'Thyroid Profile (Total T3, T4, TSH)': 'थायराइड प्रोफाइल (T3, T4, TSH)',
  'HbA1c (Glycated Hemoglobin)': 'एचबीए1सी (HbA1c - 3 माह का शुगर)',
  'Blood Sugar Fasting (FBS)': 'ब्लड शुगर फास्टिंग (FBS)',
  'Blood Sugar Post Prandial (PPBS)': 'ब्लड शुगर पोस्ट प्रांडियल (PPBS)',
  'Blood Sugar Random (RBS)': 'ब्लड शुगर रैंडम (RBS)',
  'Vitamin D3 (25-Hydroxy)': 'विटामिन डी3 (25-हाइड्रॉक्सी)',
  'Vitamin B12': 'विटामिन बी12',
  'Serum Calcium': 'सीरम कैल्शियम',
  'Serum Ferritin': 'सीरम फेरिटिन (आयरन स्टोरेज)',
  'Serum Uric Acid': 'सीरम यूरिक एसिड',
  'Serum Creatinine': 'सीरम क्रिएटिनिन',
  'Serum Electrolytes (Na, K, Cl)': 'सीरम इलेक्ट्रोलाइट्स (Na+, K+, Cl-)',
  'Urine Routine & Microscopic (R/M)': 'यूरिन रूटीन एवं माइक्रोस्कोपिक (R/M)',
  'Dengue NS1 Antigen (Rapid)': 'डेंगू एनएस1 एंटीजन (रैपिड)',
  'Dengue Serology (IgG / IgM)': 'डेंगू सीरोलॉजी (IgG / IgM)',
  'Widal Test (Typhoid)': 'विडाल टेस्ट (टाइफाइड)',
  'Malaria Antigen (Pv / Pf)': 'मलेरिया एंटीजन (Pv/Pf)',
  'HBsAg (Hepatitis B)': 'हेपेटाइटिस बी (HBsAg)',
  'Anti-HCV (Hepatitis C)': 'हेपेटाइटिस सी (Anti-HCV)',
  'HIV 1 & 2 Antibody': 'एचआईवी 1 और 2 एंटीबॉडी',
  'VDRL / RPR (Syphilis)': 'वीडीआरएल / आरपीआर (सिफलिस)',
  'C-Reactive Protein (CRP Quantitative)': 'सी-रिएक्टिव प्रोटीन (CRP)',
  'Rheumatoid Factor (RA / RF)': 'रूमेटॉइड फैक्टर (RA / RF)',
  'Stool Routine & Microscopy': 'स्टूल रूटीन एवं माइक्रोस्कोपी',
  'Semen Analysis': 'सीमेन एनालिसिस (शुक्राणु जांच)'
};

// Generate test items for testsData.ts
const testItems = testsA.map((t, idx) => {
  const sample = getSampleInfo(t.name);
  const category = getCategory(t.name);
  const fasting = getFasting(t.name);
  
  // Specific preserved ID for cbc to keep default App.tsx selection working
  let id = `test-${t.num}`;
  const u = t.name.toUpperCase();
  if (u === 'COMPLETE BLOOD COUNT (CBC)' || u === 'CBC') {
    id = 'cbc';
  } else if (u === 'HEMOGLOBIN' || u === 'HEMOGLOBIN (HB)') {
    id = 'hb';
  }

  const nameHi = knownHindiNames[t.name] || t.name;

  return {
    id,
    name: t.name,
    nameHi,
    code: `PRL-${String(t.num).padStart(3, '0')}`,
    category,
    mrp: t.mrp,
    discountedPrice: t.price,
    discountPercent: 20,
    price: t.price,
    sampleType: sample.type,
    sampleTypeHi: sample.typeHi,
    fastingRequired: fasting,
    tatHours: 'Same day / 24 hrs',
    description: `Diagnostic pathology evaluation for ${t.name} with 20% discount on standard MRP at Pawan Research Laboratory.`,
    descriptionHi: `पवन रिसर्च लैबोरेटरी में 20% एमआरपी छूट के साथ ${t.name} की सटीक एवं विश्वसनीय पैथोलॉजी जांच।`
  };
});

// Write src/data/testsData.ts
const testsDataFileContent = `import { TestItem } from '../types';

export const TESTS_DATA: TestItem[] = ${JSON.stringify(testItems, null, 2)};
`;

fs.writeFileSync('src/data/testsData.ts', testsDataFileContent);
console.log(`Successfully generated src/data/testsData.ts with ${testItems.length} tests.`);

// Generate packages for packagesData.ts
const packageItems = pkgsB.map((p) => {
  const isFitness = p.name.toUpperCase().includes('FITNESS') || p.name.toUpperCase().includes('FIT');
  const type = isFitness ? 'fitness' : 'wellness';

  return {
    id: `pkg-${p.num}`,
    name: p.name,
    nameHi: p.name,
    type,
    targetAudience: isFitness 
      ? 'Athletes, gym enthusiasts, runners and active individuals' 
      : 'Adults, families, seniors & individuals seeking preventive screening',
    targetAudienceHi: isFitness
      ? 'जिम जाने वाले युवाओं, धावकों और फिटनेस उत्साही व्यक्तियों हेतु'
      : 'वयस्क, वरिष्ठ नागरिक एवं नियमित स्वास्थ्य परीक्षण चाहने वाले',
    price: `₹${p.price}`,
    isConfirmedPrice: true,
    testsIncluded: [p.name],
    testsIncludedHi: [p.name],
    description: `Comprehensive diagnostic profile for ${p.name} conducted with clinical accuracy and 20% discount on standard MRP at Pawan Research Laboratory.`,
    descriptionHi: `पवन रिसर्च लैबोरेटरी में 20% एमआरपी छूट के साथ ${p.name} का संपूर्ण नैदानिक हेल्थ पैकेज।`,
    sampleRequired: 'Blood & Urine specimen as required by protocol',
    recommendedFor: 'Preventive healthcare & periodic screening',
    mrp: p.mrp,
    discountedPrice: p.price,
    discountPercent: 20
  };
});

// Write src/data/packagesData.ts
const packagesDataFileContent = `import { HealthPackage } from '../types';

export const HEALTH_PACKAGES: HealthPackage[] = ${JSON.stringify(packageItems, null, 2)};
`;

fs.writeFileSync('src/data/packagesData.ts', packagesDataFileContent);
console.log(`Successfully generated src/data/packagesData.ts with ${packageItems.length} packages.`);
