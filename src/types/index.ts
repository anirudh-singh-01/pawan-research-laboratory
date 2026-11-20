export type Language = 'en' | 'hi';

export interface TestItem {
  id: string;
  name: string;
  nameHi: string;
  code?: string;
  category: string;
  mrp: number | string;
  discountedPrice: number | string;
  discountPercent: number;
  price: number | string;
  sampleType: string;
  sampleTypeHi: string;
  fastingRequired?: boolean;
  tatHours?: string;
  description: string;
  descriptionHi: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  nameHi: string;
  type: 'wellness' | 'fitness' | string;
  targetAudience: string;
  targetAudienceHi: string;
  price: string;
  isConfirmedPrice: boolean;
  testsIncluded: string[];
  testsIncludedHi: string[];
  description: string;
  descriptionHi: string;
  sampleRequired: string;
  recommendedFor: string;
  mrp?: number;
  discountedPrice?: number;
  discountPercent?: number;
}

export interface BookingFormData {
  patientName: string;
  referredBy?: string;
  hospitalName?: string;
  phone: string;
  age: string;
  preferredDate: string;
  preferredTime: string;
  homeCollection: boolean;
  address: string;
  selectedTests: string[];
  message: string;
}
