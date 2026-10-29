import { Appointment, ServiceNotificationRecord } from '../types';
import { compileBookingEmail } from './emailTemplateService';

const STORAGE_KEY = 'rozana_service_notifications';

/**
 * Retrieves all stored mock notifications from localStorage
 */
export function getStoredNotifications(): ServiceNotificationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to parse stored notifications:', err);
    return [];
  }
}

/**
 * Saves notifications list to localStorage
 */
function saveNotifications(notifications: ServiceNotificationRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (err) {
    console.warn('Failed to save notifications:', err);
  }
}

export interface TriggerNotificationOptions {
  channels?: ('sms' | 'email')[];
  fallbackEmail?: string;
}

/**
 * Service Notification Trigger:
 * Automated trigger that sends an automated email and/or simulated SMS
 * to customers upon booking confirmation via the mock notification utility.
 */
export async function triggerBookingConfirmationNotifications(
  appointment: Appointment,
  options?: TriggerNotificationOptions
): Promise<{ smsRecord?: ServiceNotificationRecord; emailRecord?: ServiceNotificationRecord }> {
  const channels = options?.channels || ['sms', 'email'];
  const phone = appointment.customerPhone || '+966 50 000 0000';
  const email = options?.fallbackEmail || 'vip.guest@example.com';
  const branchNameEn = 'Rozana Salon • Al Shumaisi Branch, Riyadh';
  const branchNameAr = 'صالون روزانة • فرع الشميسي، الرياض';
  const ref = appointment.referenceId || `ROZ-${Math.floor(1000 + Math.random() * 9000)}`;

  // Simulated gateway random tokens
  const smsGatewayRef = `STC-GATEWAY-${Math.floor(100000 + Math.random() * 900000)}`;
  const emailGatewayRef = `AWS-SES-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const nowISO = new Date().toISOString();

  let smsRecord: ServiceNotificationRecord | undefined;
  let emailRecord: ServiceNotificationRecord | undefined;

  // 1. Generate Automated SMS Notification
  if (channels.includes('sms')) {
    const smsContentAr = 
      `عزيزتي ${appointment.customerName}، تم تأكيد حجزك الملكي في صالون روزانة (فرع الشميسي) بنجاح!\n` +
      `• رقم الحجز: ${ref}\n` +
      `• الخدمة: ${appointment.serviceNameAr}\n` +
      `• الموعد: ${appointment.date} في تمام الساعة ${appointment.time}\n` +
      `• الأخصائية: ${appointment.staffName || 'نخبة خبيرات التجميل'}\n` +
      `• الموقع: شارع الشميسي، الرياض.\n` +
      `نسعد بزيارتكِ وتدليلكِ. للاستفسار أو التعديل: 0114128890`;

    const smsContentEn = 
      `Dear ${appointment.customerName}, your royal booking at Rozana Luxury Salon (Al Shumaisi Branch) is CONFIRMED!\n` +
      `• Booking Ref: ${ref}\n` +
      `• Treatment: ${appointment.serviceNameEn}\n` +
      `• Date & Time: ${appointment.date} @ ${appointment.time}\n` +
      `• Specialist: ${appointment.staffName || 'Master Aesthetician'}\n` +
      `• Location: Al Shumaisi District, Riyadh.\n` +
      `We look forward to pampering you. Concierge Desk: +966 11 412 8890`;

    smsRecord = {
      id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      appointmentId: appointment.id,
      referenceId: ref,
      customerName: appointment.customerName,
      customerPhone: phone,
      channel: 'sms',
      senderId: 'RozanaVIP',
      contentEn: smsContentEn,
      contentAr: smsContentAr,
      status: 'delivered',
      sentAt: nowISO,
      gatewayRef: smsGatewayRef,
      serviceNameEn: appointment.serviceNameEn,
      serviceNameAr: appointment.serviceNameAr,
      date: appointment.date,
      time: appointment.time,
      totalSAR: appointment.totalSAR
    };
  }

  // 2. Generate Automated Email Notification using Dynamic Email Template Utility
  if (channels.includes('email')) {
    // Compile using dynamic booking confirmation template with variables (customer_name, service, appointment_time)
    const compiledEn = compileBookingEmail('booking_confirmation', appointment, 'en', {
      customerEmail: email,
      fallbackBranchNameEn: branchNameEn,
      fallbackBranchNameAr: branchNameAr
    });

    const compiledAr = compileBookingEmail('booking_confirmation', appointment, 'ar', {
      customerEmail: email,
      fallbackBranchNameEn: branchNameEn,
      fallbackBranchNameAr: branchNameAr
    });

    emailRecord = {
      id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      appointmentId: appointment.id,
      referenceId: ref,
      customerName: appointment.customerName,
      customerPhone: phone,
      customerEmail: email,
      channel: 'email',
      senderId: 'concierge@rozanasalon.sa',
      subject: compiledAr.subject,
      contentEn: compiledEn.textBody,
      contentAr: compiledAr.textBody,
      htmlBodyEn: compiledEn.htmlBody,
      htmlBodyAr: compiledAr.htmlBody,
      templateId: 'booking_confirmation',
      status: 'delivered',
      sentAt: nowISO,
      gatewayRef: emailGatewayRef,
      serviceNameEn: appointment.serviceNameEn,
      serviceNameAr: appointment.serviceNameAr,
      date: appointment.date,
      time: appointment.time,
      totalSAR: appointment.totalSAR
    };
  }

  // Simulate network dispatch delay for realistic utility behavior
  await new Promise((res) => setTimeout(res, 350));

  // Persist to history
  const currentHistory = getStoredNotifications();
  const toAdd: ServiceNotificationRecord[] = [];
  if (smsRecord) toAdd.push(smsRecord);
  if (emailRecord) toAdd.push(emailRecord);

  const updatedHistory = [...toAdd, ...currentHistory].slice(0, 50);
  saveNotifications(updatedHistory);

  // Dispatch global event for interactive live UI updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('rozana:notification-dispatched', {
        detail: {
          appointmentId: appointment.id,
          referenceId: ref,
          smsRecord,
          emailRecord
        }
      })
    );
  }

  return { smsRecord, emailRecord };
}

/**
 * Resends a previously sent notification
 */
export async function resendNotification(
  notificationId: string
): Promise<ServiceNotificationRecord | null> {
  const current = getStoredNotifications();
  const index = current.findIndex((n) => n.id === notificationId);
  if (index === -1) return null;

  const target = current[index];
  const updated: ServiceNotificationRecord = {
    ...target,
    id: `${target.channel}-${Date.now()}`,
    sentAt: new Date().toISOString(),
    status: 'delivered',
    gatewayRef: `${target.channel === 'sms' ? 'STC-RESEND' : 'SES-RESEND'}-${Math.floor(
      100000 + Math.random() * 900000
    )}`
  };

  current.unshift(updated);
  saveNotifications(current);

  return updated;
}
