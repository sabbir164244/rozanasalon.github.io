export type Language = 'en' | 'ar';

export type ServiceCategory = 'all' | 'facial' | 'keratin' | 'haircut' | 'nails' | 'spa';

export type AppointmentStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  nameEn: string;
  nameAr: string;
  category: ServiceCategory;
  priceSAR: number;
  durationMin: number;
  descriptionEn: string;
  descriptionAr: string;
  isSignature?: boolean;
  rating: number;
  reviewsCount: number;
  badgeEn?: string;
  badgeAr?: string;
  imageUrl?: string;
  benefitsEn?: string[];
  benefitsAr?: string[];
}

export interface StaffMember {
  id: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  rating: number;
  avatar: string;
  isAvailableToday: boolean;
  specialties: string[];
}

export interface Appointment {
  id: string;
  referenceId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceNameEn: string;
  serviceNameAr: string;
  serviceCategory: ServiceCategory;
  staffId?: string;
  staffName?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "02:00 PM"
  status: AppointmentStatus;
  notes?: string;
  totalSAR: number;
  createdAt: string;
}

export interface SalonReview {
  id: string;
  authorNameEn: string;
  authorNameAr: string;
  rating: number;
  date: string;
  commentEn: string;
  commentAr: string;
  serviceUsedEn: string;
  serviceUsedAr: string;
  verified: boolean;
}

export interface SalonSettings {
  nameEn: string;
  nameAr: string;
  branchEn: string;
  branchAr: string;
  addressEn: string;
  addressAr: string;
  openHour: string; // "12:00 PM"
  closeHour: string; // "11:00 PM"
  phone: string;
  whatsapp: string;
  rating: number;
  totalReviews: number;
}
