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
  referenceId?: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceNameEn: string;
  serviceNameAr: string;
  serviceCategory?: ServiceCategory;
  staffId?: string;
  staffName?: string;
  staffNameEn?: string;
  staffNameAr?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "02:00 PM"
  status: AppointmentStatus;
  notes?: string;
  totalSAR: number;
  createdAt: string;
}

export type WaitlistStatus = 'pending' | 'notified' | 'claimed' | 'cancelled';

export interface WaitlistEntry {
  id: string;
  referenceCode?: string;
  date: string; // YYYY-MM-DD
  preferredTimeWindow?: string; // e.g., 'any', 'afternoon', 'evening'
  serviceId: string;
  serviceNameEn: string;
  serviceNameAr: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  status: WaitlistStatus;
  createdAt: string;
  userId?: string | null;
  notifiedAt?: string;
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
  heroTaglineEn?: string;
  heroTaglineAr?: string;
  heroSubEn?: string;
  heroSubAr?: string;
  heroBannerImg?: string;
}

export interface AdminSecurityConfig {
  email: string;
  password: string;
  recoveryQuestion: string;
  recoveryAnswer: string;
  lastUpdated?: string;
}

export interface AdminCredentials {
  email: string;
  password?: string;
  token?: string;
  authenticatedAt?: string;
  role?: string;
}

export interface VipPackage {
  id: string;
  titleEn?: string;
  titleAr?: string;
  nameEn?: string;
  nameAr?: string;
  taglineEn?: string;
  taglineAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  priceSAR: number;
  originalPriceSAR: number;
  durationMin?: number;
  durationHours?: number;
  badgeEn?: string;
  badgeAr?: string;
  servicesIncludedEn: string[];
  servicesIncludedAr: string[];
  imageUrl?: string;
  popular?: boolean;
}

export interface SalonSuite {
  id: string;
  nameEn: string;
  nameAr: string;
  titleEn?: string;
  titleAr?: string;
  descriptionEn: string;
  descriptionAr: string;
  featuresEn: string[];
  featuresAr: string[];
  imageUrl: string;
}

export interface TransformationItem {
  id: string;
  titleEn: string;
  titleAr: string;
  category?: string;
  categoryEn?: string;
  categoryAr?: string;
  serviceId: string;
  serviceNameEn?: string;
  serviceNameAr?: string;
  beforeLabelEn: string;
  beforeLabelAr: string;
  afterLabelEn: string;
  afterLabelAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  beforeImage: string;
  afterImage: string;
  specialistEn: string;
  specialistAr: string;
}

export type GiftCardStatus = 'active' | 'partially_redeemed' | 'redeemed' | 'expired' | 'cancelled';
export type GiftCardTheme = 'gold-onyx' | 'royal-rose' | 'emerald-palace' | 'pearl-minimal';

export interface GiftCardRedemption {
  id: string;
  date: string;
  amountSAR: number;
  appointmentRef?: string;
  note?: string;
  performedBy?: string;
}

export interface GiftCard {
  id: string;
  code: string;
  amountSAR: number;
  remainingBalanceSAR: number;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone?: string;
  personalMessage?: string;
  designTheme: GiftCardTheme;
  deliveryType: 'instant' | 'scheduled';
  scheduledDate?: string;
  status: GiftCardStatus;
  issuedAt: string;
  expiresAt: string;
  paymentMethod?: string;
  paymentRef?: string;
  redemptionHistory?: GiftCardRedemption[];
}

export type ToastType = 'booking' | 'giftcard' | 'success' | 'info' | 'warning';

export interface ToastNotification {
  id: string;
  type: ToastType;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  timestamp: string;
  data?: {
    appointmentId?: string;
    referenceId?: string;
    customerName?: string;
    serviceName?: string;
    date?: string;
    time?: string;
    totalSAR?: number;
    cardCode?: string;
    redeemedAmountSAR?: number;
    remainingBalanceSAR?: number;
    recipientName?: string;
  };
  action?: {
    labelAr: string;
    labelEn: string;
    onClick: () => void;
  };
  duration?: number;
  read?: boolean;
}

export type AuditLogCategory = 
  | 'services' 
  | 'staff' 
  | 'bookings' 
  | 'security' 
  | 'giftcards' 
  | 'content'
  | 'backup'
  | 'system';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO 8601 string
  category: AuditLogCategory;
  actionType: string; // e.g., 'price_change', 'service_edit', 'staff_update', 'booking_status', etc.
  titleAr: string;
  titleEn: string;
  detailsAr: string;
  detailsEn: string;
  actor: string; // e.g., 'Admin', 'Rozana Manager'
  targetId?: string;
  targetName?: string;
  previousValue?: string;
  newValue?: string;
  severity?: 'info' | 'warning' | 'success' | 'alert';
}

export type NotificationChannel = 'sms' | 'email';
export type NotificationStatus = 'queued' | 'sending' | 'delivered' | 'failed';

export interface ServiceNotificationRecord {
  id: string;
  appointmentId: string;
  referenceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  channel: NotificationChannel;
  senderId: string; // e.g. "RozanaVIP" or "concierge@rozanasalon.sa"
  subject?: string;
  contentEn: string;
  contentAr: string;
  status: NotificationStatus;
  sentAt: string;
  gatewayRef: string;
  serviceNameEn: string;
  serviceNameAr: string;
  date: string;
  time: string;
  totalSAR: number;
  htmlBodyEn?: string;
  htmlBodyAr?: string;
  templateId?: string;
}

export interface EmailTemplateVariable {
  key: string;
  labelEn: string;
  labelAr: string;
  example: string;
  descriptionEn: string;
  descriptionAr: string;
  required?: boolean;
}

export interface EmailTemplate {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: 'confirmation' | 'reminder' | 'update' | 'cancellation' | 'followup';
  subjectEn: string;
  subjectAr: string;
  bodyTextEn: string;
  bodyTextAr: string;
  bodyHtmlEn: string;
  bodyHtmlAr: string;
  supportedVariables: string[];
  isDefault?: boolean;
  updatedAt?: string;
}

export interface CompiledEmail {
  templateId: string;
  templateCategory: string;
  subject: string;
  textBody: string;
  htmlBody: string;
  variablesUsed: Record<string, string>;
  recipientEmail?: string;
  recipientName?: string;
  renderedAt: string;
}
