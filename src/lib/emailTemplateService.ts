import { Appointment, ServiceNotificationRecord } from '../types';

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

export interface DynamicEmailOptions {
  customerEmail?: string;
  fallbackBranchNameEn?: string;
  fallbackBranchNameAr?: string;
  customVariables?: Record<string, string>;
}

const STORAGE_TEMPLATES_KEY = 'rozana_dynamic_email_templates_v1';

/**
 * Standard list of all supported dynamic variables for booking emails
 */
export const SUPPORTED_BOOKING_VARIABLES: EmailTemplateVariable[] = [
  {
    key: 'customer_name',
    labelEn: 'Customer Name',
    labelAr: 'اسم العميلة',
    example: 'Sarah Al-Otaibi',
    descriptionEn: 'Full name of the customer who booked the treatment',
    descriptionAr: 'الاسم الكامل للعميلة صاحبة الحجز',
    required: true
  },
  {
    key: 'service',
    labelEn: 'Service / Treatment',
    labelAr: 'الخدمة / الجلسة',
    example: 'Royal Caviar Hair Treatment',
    descriptionEn: 'Name of the selected salon treatment or spa service',
    descriptionAr: 'اسم الخدمة التجميلية أو العلاجية المختارة',
    required: true
  },
  {
    key: 'appointment_time',
    labelEn: 'Appointment Time',
    labelAr: 'وقت الموعد',
    example: '04:30 PM',
    descriptionEn: 'Scheduled appointment time slot',
    descriptionAr: 'الوقت المحدد للجلسة في صالون روزانة',
    required: true
  },
  {
    key: 'appointment_date',
    labelEn: 'Appointment Date',
    labelAr: 'تاريخ الموعد',
    example: '2026-11-05',
    descriptionEn: 'Scheduled date of the appointment',
    descriptionAr: 'تاريخ الموعد المحدد'
  },
  {
    key: 'booking_reference',
    labelEn: 'Booking Reference ID',
    labelAr: 'رمز الحجز المرجعي',
    example: 'ROZ-7824',
    descriptionEn: 'Unique reservation code for reception and verification',
    descriptionAr: 'الرمز المرجعي الفريد للتحقق عند الاستقبال'
  },
  {
    key: 'specialist',
    labelEn: 'Specialist / Stylist',
    labelAr: 'الأخصائية المعتمدة',
    example: 'Master Aesthetician Noura',
    descriptionEn: 'Assigned specialist or beautician for the session',
    descriptionAr: 'اسم خبيرة التجميل المسؤولة عن تقديم الخدمة'
  },
  {
    key: 'total_amount',
    labelEn: 'Total Amount',
    labelAr: 'المبلغ الإجمالي',
    example: '350 SAR',
    descriptionEn: 'Total payable amount in Saudi Riyals (SAR)',
    descriptionAr: 'المبلغ الإجمالي المستحق بالريال السعودي'
  },
  {
    key: 'salon_branch',
    labelEn: 'Salon Branch',
    labelAr: 'فرع الصالون',
    example: 'Rozana Salon • Al Shumaisi Branch, Riyadh',
    descriptionEn: 'Specific branch name and location',
    descriptionAr: 'اسم الفرع والموقع المحدد'
  },
  {
    key: 'salon_address',
    labelEn: 'Salon Address',
    labelAr: 'عنوان الصالون',
    example: 'Al Shumaisi District, Riyadh, Saudi Arabia',
    descriptionEn: 'Physical location of the salon sanctuary',
    descriptionAr: 'العنوان الجغرافي للصالون بالرياض'
  },
  {
    key: 'salon_phone',
    labelEn: 'Salon Phone / Concierge',
    labelAr: 'هاتف الصالون والكونسيرج',
    example: '+966 11 412 8890',
    descriptionEn: 'Customer care and reception telephone line',
    descriptionAr: 'رقم هاتف الاستقبال والكونسيرج'
  },
  {
    key: 'salon_email',
    labelEn: 'Salon Email',
    labelAr: 'البريد الإلكتروني للصالون',
    example: 'concierge@rozanasalon.sa',
    descriptionEn: 'Official salon contact email address',
    descriptionAr: 'البريد الإلكتروني الرسمي لخدمة عميلات روزانة'
  },
  {
    key: 'cancellation_policy',
    labelEn: 'Cancellation Policy',
    labelAr: 'سياسة التعديل والإلغاء',
    example: 'Free cancellation up to 4 hours prior to appointment',
    descriptionEn: 'Salon policy regarding changes and cancellations',
    descriptionAr: 'سياسة التعديل أو الإلغاء قبل الموعد'
  }
];

/**
 * Built-in luxury default email templates for Rozana Salon Al Shumaisi
 */
export const DEFAULT_BOOKING_EMAIL_TEMPLATES: EmailTemplate[] = [
  // 1. Immediate Booking Confirmation
  {
    id: 'booking_confirmation',
    nameEn: 'Booking Confirmation',
    nameAr: 'تأكيد الحجز الفوري',
    descriptionEn: 'Sent automatically to the customer right after booking confirmation with complete appointment details.',
    descriptionAr: 'يُرسل تلقائياً للعميلة فور تأكيد الحجز شاملاً كافة تفاصيل الجلسة والموعد.',
    category: 'confirmation',
    isDefault: true,
    supportedVariables: [
      'customer_name',
      'service',
      'appointment_time',
      'appointment_date',
      'booking_reference',
      'specialist',
      'total_amount',
      'salon_branch',
      'salon_address',
      'salon_phone'
    ],
    subjectEn: '✦ Reservation Confirmed: {{service}} for {{customer_name}} (#{{booking_reference}})',
    subjectAr: '✦ تم تأكيد حجزكِ الملكي: {{service}} للأستاذة {{customer_name}} (#{{booking_reference}})',
    bodyTextEn: `Dear {{customer_name}},

We are thrilled to confirm your bespoke reservation at Rozana Luxury Salon.

RESERVATION DETAILS:
• Booking Reference: {{booking_reference}}
• Treatment: {{service}}
• Date: {{appointment_date}}
• Time: {{appointment_time}}
• Specialist: {{specialist}}
• Total Amount: {{total_amount}}
• Location: {{salon_branch}} ({{salon_address}})

LUXURY AMENITIES FOR YOUR VISIT:
• Complimentary Valet Parking available at our private entrance.
• Enjoy authentic Saudi Cardamom Coffee and artisanal dates in our private relaxation lounge.
• Please arrive 10 minutes prior to your appointment time ({{appointment_time}}) for your personalized consultation.

Need to reschedule or make an inquiry?
Concierge Desk: {{salon_phone}} | {{salon_email}}

Warmest regards,
Rozana Luxury Salon Concierge Team • Al Shumaisi, Riyadh`,

    bodyTextAr: `أهلاً بكِ أستاذة {{customer_name}} في واحة الجمال الملكي بصالون روزانة.

يسعدنا ويشرفنا تأكيد حجز موعدكِ الفاخر بنجاح:

تفاصيل الحجز الملكي:
• رمز الحجز المرجعي: {{booking_reference}}
• الخدمة المختارة: {{service}}
• تاريخ الموعد: {{appointment_date}}
• وقت الموعد: {{appointment_time}}
• الأخصائية المسؤولة: {{specialist}}
• المبلغ الإجمالي: {{total_amount}}
• الفرع: {{salon_branch}}

ملاحظات لراحتكِ التامة:
• تتوفر خدمة صف السيارات المجانية (Valet Parking) أمام المدخل الرئيسي.
• تفضلي بالاستمتاع بضيافتنا الخاصة من القهوة السعودية والتمور الفاخرة في صالة الاسترخاء.
• نرجو الحضور قبل الموعد بـ 10 دقائق من موعدكِ ({{appointment_time}}) لبدء جلسة الاسترخاء.

لأي استفسار أو رغبة بالتعديل:
هاتف الكونسيرج: {{salon_phone}} | البريد: {{salon_email}}

مع خالص الود والتقدير،
فريق إدارة صالون روزانة • فرع الشميسي، الرياض`,

    bodyHtmlEn: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reservation Confirmed - Rozana Salon</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0907; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F8F5EE;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0907; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #12100B; border: 1px solid #D4AF37; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
          
          <!-- Gold Haute Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1C170E 0%, #2A2113 100%); padding: 36px 32px; text-align: center; border-bottom: 1px solid rgba(212,175,55,0.3);">
              <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 14px; background: #0E0C09; border: 1px solid #D4AF37; color: #E5C378; font-size: 22px; font-weight: bold; margin-bottom: 12px;">👑</div>
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #E5C378; letter-spacing: 1px; font-family: Georgia, serif;">ROZANA SALON</h1>
              <p style="margin: 6px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2.5px; color: #A89F91;">Haute Coiffure & Luxury Spa • Al Shumaisi, Riyadh</p>
            </td>
          </tr>

          <!-- Welcome Banner -->
          <tr>
            <td style="padding: 32px 32px 20px;">
              <span style="display: inline-block; padding: 4px 12px; background-color: rgba(229,195,120,0.15); border: 1px solid rgba(212,175,55,0.4); border-radius: 20px; font-size: 11px; font-weight: bold; color: #E5C378; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px;">Reservation Confirmed</span>
              <h2 style="margin: 0 0 12px; font-size: 22px; color: #FFFFFF; font-weight: 600; font-family: Georgia, serif;">Dear {{customer_name}},</h2>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #D2C8BA;">We have reserved your royal experience at Rozana Salon. Here are the full details of your appointment:</p>
            </td>
          </tr>

          <!-- Booking Summary Box -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1A160F; border: 1px solid rgba(212,175,55,0.3); border-radius: 16px; padding: 20px;">
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #8C8477; text-transform: uppercase;">Booking Reference</td>
                  <td align="right" style="padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: bold; color: #E5C378; font-family: monospace;">#{{booking_reference}}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #8C8477; text-transform: uppercase;">Treatment / Service</td>
                  <td align="right" style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15px; font-weight: bold; color: #FFFFFF;">{{service}}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #8C8477; text-transform: uppercase;">Appointment Time</td>
                  <td align="right" style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: bold; color: #E5C378;">{{appointment_time}}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #8C8477; text-transform: uppercase;">Date</td>
                  <td align="right" style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #F8F5EE;">{{appointment_date}}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #8C8477; text-transform: uppercase;">Specialist</td>
                  <td align="right" style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #F8F5EE;">{{specialist}}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; font-size: 12px; color: #8C8477; text-transform: uppercase;">Total Payable</td>
                  <td align="right" style="padding: 10px 12px; font-size: 16px; font-weight: bold; color: #E5C378;">{{total_amount}}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Amenities Section -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <div style="background-color: #15120B; border-radius: 14px; padding: 18px; border: 1px solid rgba(255,255,255,0.05);">
                <p style="margin: 0 0 8px; font-size: 13px; font-weight: bold; color: #E5C378;">Salon Amenities for Your Comfort:</p>
                <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.7; color: #A89F91;">
                  <li>Complimentary Valet Parking service right in front of our main entrance.</li>
                  <li>Enjoy our royal Saudi Cardamom Coffee and dates lounge.</li>
                  <li>Please arrive 10 minutes prior to your session time ({{appointment_time}}).</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Location & Help -->
          <tr>
            <td style="padding: 0 32px 36px; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #8C8477;">Location: {{salon_branch}}</p>
              <p style="margin: 0; font-size: 12px; color: #A89F91;">Concierge Desk: <strong style="color: #E5C378;">{{salon_phone}}</strong> | {{salon_email}}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0E0C09; padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #666;">
              <p style="margin: 0 0 4px;">© Rozana Luxury Salon. All rights reserved.</p>
              <p style="margin: 0;">Al Shumaisi District, Riyadh, Kingdom of Saudi Arabia.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,

    bodyHtmlAr: `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تأكيد الحجز - صالون روزانة</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0907; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #F8F5EE; direction: rtl; text-align: right;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0907; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #12100B; border: 1px solid #D4AF37; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8); direction: rtl; text-align: right;">
          
          <!-- Gold Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1C170E 0%, #2A2113 100%); padding: 36px 32px; text-align: center; border-bottom: 1px solid rgba(212,175,55,0.3);">
              <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 14px; background: #0E0C09; border: 1px solid #D4AF37; color: #E5C378; font-size: 22px; font-weight: bold; margin-bottom: 12px;">👑</div>
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #E5C378; letter-spacing: 1px;">صالون روزانة للتجميل والسبا</h1>
              <p style="margin: 6px 0 0; font-size: 12px; color: #A89F91;">واحة الأناقة والعناية الملكية الفائقة • فرع الشميسي، الرياض</p>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 32px 32px 20px;">
              <span style="display: inline-block; padding: 4px 12px; background-color: rgba(229,195,120,0.15); border: 1px solid rgba(212,175,55,0.4); border-radius: 20px; font-size: 11px; font-weight: bold; color: #E5C378; margin-bottom: 14px;">تم تأكيد حجزكِ بنجاح</span>
              <h2 style="margin: 0 0 12px; font-size: 22px; color: #FFFFFF; font-weight: bold;">أهلاً بكِ أستاذة {{customer_name}}،</h2>
              <p style="margin: 0; font-size: 14px; line-height: 1.8; color: #D2C8BA;">يسرنا تأكيد حجز جلستكِ الملكية لدى صالون روزانة. إليكِ كافة تفاصيل الموعد المسجل:</p>
            </td>
          </tr>

          <!-- Booking Summary Box -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1A160F; border: 1px solid rgba(212,175,55,0.3); border-radius: 16px; padding: 20px; direction: rtl; text-align: right;">
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: #8C8477;">رمز الحجز المرجعي</td>
                  <td align="left" style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15px; font-weight: bold; color: #E5C378; font-family: monospace;">#{{booking_reference}}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: #8C8477;">الخدمة المطلوبة</td>
                  <td align="left" style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15px; font-weight: bold; color: #FFFFFF;">{{service}}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: #8C8477;">وقت الموعد</td>
                  <td align="left" style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15px; font-weight: bold; color: #E5C378;">{{appointment_time}}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: #8C8477;">تاريخ الموعد</td>
                  <td align="left" style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #F8F5EE;">{{appointment_date}}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: #8C8477;">الأخصائية المسؤولة</td>
                  <td align="left" style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #F8F5EE;">{{specialist}}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; font-size: 13px; color: #8C8477;">المبلغ المطلوب</td>
                  <td align="left" style="padding: 10px 12px; font-size: 16px; font-weight: bold; color: #E5C378;">{{total_amount}}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notes -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <div style="background-color: #15120B; border-radius: 14px; padding: 18px; border: 1px solid rgba(255,255,255,0.05);">
                <p style="margin: 0 0 8px; font-size: 14px; font-weight: bold; color: #E5C378;">معلومات هامة لراحتكِ:</p>
                <ul style="margin: 0; padding-right: 20px; font-size: 13px; line-height: 1.8; color: #A89F91;">
                  <li>تتوفر خدمة صف السيارات المجانية (Valet) مباشرة أمام مدخل الصالون.</li>
                  <li>ندعوكِ للاستمتاع بضيافة القهوة السعودية الفاخرة وبدء جلسة الاسترخاء.</li>
                  <li>يرجى التكرم بالحضور قبل الموعد بـ 10 دقائق من موعدكِ ({{appointment_time}}).</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding: 0 32px 36px; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 13px; color: #8C8477;">العنوان: {{salon_branch}}</p>
              <p style="margin: 0; font-size: 13px; color: #A89F91;">مكتب الكونسيرج والاستقبال: <strong style="color: #E5C378;">{{salon_phone}}</strong> | {{salon_email}}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0E0C09; padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #666;">
              <p style="margin: 0 0 4px;">© جميع الحقوق محفوظة لصالون روزانة للتجميل.</p>
              <p style="margin: 0;">حي الشميسي، الرياض، المملكة العربية السعودية.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },

  // 2. Booking Reminder (24 Hours Prior)
  {
    id: 'booking_reminder',
    nameEn: 'Appointment Reminder',
    nameAr: 'تذكير بالموعد القادم',
    descriptionEn: 'Gentle reminder sent before the appointment time with timing, specialist, and directions.',
    descriptionAr: 'تذكير لطيف يُرسل للعميلة بموعد الجلسة والوقت والأخصائية ورقم التواصل.',
    category: 'reminder',
    isDefault: true,
    supportedVariables: [
      'customer_name',
      'service',
      'appointment_time',
      'appointment_date',
      'booking_reference',
      'specialist',
      'salon_branch',
      'salon_phone'
    ],
    subjectEn: 'Gentle Reminder: Your {{service}} appointment at {{appointment_time}} - Rozana Salon',
    subjectAr: 'تذكير لطيف بموعدكِ الملكي: {{service}} الساعة {{appointment_time}} - صالون روزانة',
    bodyTextEn: `Dear {{customer_name}},

This is a gentle reminder of your upcoming beauty appointment at Rozana Luxury Salon.

APPOINTMENT SUMMARY:
• Service: {{service}}
• Date: {{appointment_date}}
• Time: {{appointment_time}}
• Specialist: {{specialist}}
• Reference Code: #{{booking_reference}}
• Location: {{salon_branch}}

We have prepared our treatment suite and royal Saudi hospitality lounge for you. Please arrive 10 minutes prior to {{appointment_time}}.

If you need to adjust your time slot or have special requests, contact us promptly at {{salon_phone}}.

Looking forward to pampering you,
Rozana Luxury Salon Team`,

    bodyTextAr: `أهلاً بكِ أستاذة {{customer_name}}،

تذكير لطيف بموعد جلستكِ القادمة لدى صالون روزانة:

تفاصيل الموعد:
• الخدمة: {{service}}
• التاريخ: {{appointment_date}}
• الوقت: في تمام الساعة {{appointment_time}}
• الأخصائية: {{specialist}}
• رقم الحجز: #{{booking_reference}}
• الموقع: {{salon_branch}}

لقد جهزنا لكِ جناح العناية الخاص وضيافة القهوة الملكية. نرجو التفضل بالحضور قبل الموعد بـ 10 دقائق ({{appointment_time}}).

لأي تعديل أو استفسار، يسعدنا تواصلكِ على {{salon_phone}}.

نتطلع بكل شوق لتدليلكِ،
فريق صالون روزانة بالشميسي`,

    bodyHtmlEn: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Appointment Reminder</title></head>
<body style="margin: 0; padding: 24px 12px; background-color: #0A0907; color: #F8F5EE; font-family: sans-serif;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #12100B; border: 1px solid #D4AF37; border-radius: 20px; padding: 28px;">
    <div style="text-align: center; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 20px; margin-bottom: 20px;">
      <h2 style="color: #E5C378; margin: 0; font-family: Georgia, serif;">ROZANA SALON</h2>
      <p style="color: #A89F91; font-size: 12px; margin: 4px 0 0;">Upcoming Appointment Reminder</p>
    </div>
    <p style="font-size: 15px;">Dear <strong style="color: #FFFFFF;">{{customer_name}}</strong>,</p>
    <p style="color: #D2C8BA; font-size: 14px; line-height: 1.6;">We look forward to welcoming you soon for your scheduled <strong style="color: #E5C378;">{{service}}</strong>.</p>
    
    <div style="background-color: #1A160F; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid rgba(212,175,55,0.25);">
      <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #8C8477;">Treatment:</strong> {{service}}</p>
      <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #8C8477;">Time:</strong> <span style="color: #E5C378; font-weight: bold;">{{appointment_time}}</span> ({{appointment_date}})</p>
      <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #8C8477;">Specialist:</strong> {{specialist}}</p>
      <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #8C8477;">Booking Ref:</strong> #{{booking_reference}}</p>
    </div>

    <p style="font-size: 13px; color: #A89F91; line-height: 1.6;">Valet parking is ready for you. Please arrive 10 minutes prior to {{appointment_time}} to begin your session relaxed.</p>
    <p style="font-size: 12px; color: #8C8477; margin-top: 24px; text-align: center;">Concierge: {{salon_phone}} • {{salon_branch}}</p>
  </div>
</body>
</html>`,

    bodyHtmlAr: `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"><title>تذكير بالموعد</title></head>
<body style="margin: 0; padding: 24px 12px; background-color: #0A0907; color: #F8F5EE; font-family: Tahoma, sans-serif; direction: rtl; text-align: right;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #12100B; border: 1px solid #D4AF37; border-radius: 20px; padding: 28px;">
    <div style="text-align: center; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 20px; margin-bottom: 20px;">
      <h2 style="color: #E5C378; margin: 0;">صالون روزانة الملكي</h2>
      <p style="color: #A89F91; font-size: 12px; margin: 4px 0 0;">تذكير بموعد الجلسة التجميلية القادمة</p>
    </div>
    <p style="font-size: 15px;">أهلاً بكِ أستاذة <strong style="color: #FFFFFF;">{{customer_name}}</strong>،</p>
    <p style="color: #D2C8BA; font-size: 14px; line-height: 1.8;">نسعد بقرب موعد زيارتكِ للاستمتاع بجلسة <strong style="color: #E5C378;">{{service}}</strong>.</p>
    
    <div style="background-color: #1A160F; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid rgba(212,175,55,0.25);">
      <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #8C8477;">الخدمة:</strong> {{service}}</p>
      <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #8C8477;">الوقت:</strong> <span style="color: #E5C378; font-weight: bold;">{{appointment_time}}</span> ({{appointment_date}})</p>
      <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #8C8477;">الأخصائية:</strong> {{specialist}}</p>
      <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #8C8477;">رمز الحجز:</strong> #{{booking_reference}}</p>
    </div>

    <p style="font-size: 13px; color: #A89F91; line-height: 1.8;">خدمة صف السيارات جاهزة لاستقبالكِ. نرجو الحضور قبل الموعد بـ 10 دقائق ({{appointment_time}}) لتنعمي بضيافتنا.</p>
    <p style="font-size: 12px; color: #8C8477; margin-top: 24px; text-align: center;">الكونسيرج: {{salon_phone}} • {{salon_branch}}</p>
  </div>
</body>
</html>`
  },

  // 3. Rescheduled Appointment Notice
  {
    id: 'booking_rescheduled',
    nameEn: 'Rescheduled Appointment Notice',
    nameAr: 'إشعار تعديل الموعد',
    descriptionEn: 'Sent when the appointment time, date, or treatment is adjusted by client or staff.',
    descriptionAr: 'يُرسل عند تعديل تاريخ أو وقت الموعد أو الأخصائية بناءً على طلب العميلة أو الإدارة.',
    category: 'update',
    isDefault: true,
    supportedVariables: [
      'customer_name',
      'service',
      'appointment_time',
      'appointment_date',
      'booking_reference',
      'specialist',
      'salon_branch',
      'salon_phone'
    ],
    subjectEn: 'Updated Time: {{service}} for {{customer_name}} is now at {{appointment_time}}',
    subjectAr: 'تحديث الموعد: موعد {{service}} للأستاذة {{customer_name}} أصبح في تمام الساعة {{appointment_time}}',
    bodyTextEn: `Dear {{customer_name}},

Your booking for {{service}} (#{{booking_reference}}) has been successfully rescheduled.

UPDATED SCHEDULE:
• Service: {{service}}
• New Date: {{appointment_date}}
• New Time: {{appointment_time}}
• Assigned Specialist: {{specialist}}
• Location: {{salon_branch}}

We look forward to offering you an elevated experience at your newly updated time.

Concierge Desk: {{salon_phone}}`,

    bodyTextAr: `أهلاً بكِ أستاذة {{customer_name}}،

تم تحديث وتعديل موعد حجزكِ لخدمة {{service}} (رقم #{{booking_reference}}) بنجاح.

تفاصيل الموعد المعدلة:
• الخدمة: {{service}}
• التاريخ الجديد: {{appointment_date}}
• الوقت الجديد: {{appointment_time}}
• الأخصائية: {{specialist}}
• الفرع: {{salon_branch}}

نتطلع لاستقبالكِ وتقديم أرقى معايير العناية في موعدكِ الجديد.

مكتب الاستقبال: {{salon_phone}}`,

    bodyHtmlEn: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Booking Rescheduled</title></head>
<body style="margin: 0; padding: 24px; background-color: #0A0907; color: #F8F5EE; font-family: sans-serif;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #12100B; border: 1px solid #D4AF37; border-radius: 20px; padding: 28px;">
    <h2 style="color: #E5C378; margin-top: 0; font-family: Georgia, serif;">ROZANA SALON</h2>
    <p style="font-size: 15px;">Dear <strong style="color: #FFFFFF;">{{customer_name}}</strong>,</p>
    <p style="color: #D2C8BA; font-size: 14px;">Your reservation for <strong style="color: #E5C378;">{{service}}</strong> has been rescheduled:</p>
    <div style="background-color: #1A160F; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid rgba(212,175,55,0.25);">
      <p style="margin: 6px 0; font-size: 14px;"><strong>New Date:</strong> {{appointment_date}}</p>
      <p style="margin: 6px 0; font-size: 14px;"><strong>New Time:</strong> <span style="color: #E5C378; font-weight: bold;">{{appointment_time}}</span></p>
      <p style="margin: 6px 0; font-size: 14px;"><strong>Specialist:</strong> {{specialist}}</p>
      <p style="margin: 6px 0; font-size: 14px;"><strong>Ref:</strong> #{{booking_reference}}</p>
    </div>
    <p style="font-size: 12px; color: #8C8477;">Questions? Contact {{salon_phone}}.</p>
  </div>
</body></html>`,

    bodyHtmlAr: `<!DOCTYPE html>
<html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>تعديل الموعد</title></head>
<body style="margin: 0; padding: 24px; background-color: #0A0907; color: #F8F5EE; font-family: Tahoma, sans-serif; direction: rtl; text-align: right;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #12100B; border: 1px solid #D4AF37; border-radius: 20px; padding: 28px;">
    <h2 style="color: #E5C378; margin-top: 0;">صالون روزانة الملكي</h2>
    <p style="font-size: 15px;">أهلاً بكِ أستاذة <strong style="color: #FFFFFF;">{{customer_name}}</strong>،</p>
    <p style="color: #D2C8BA; font-size: 14px;">تم تحديث موعد حجزكِ لخدمة <strong style="color: #E5C378;">{{service}}</strong> بنجاح:</p>
    <div style="background-color: #1A160F; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid rgba(212,175,55,0.25);">
      <p style="margin: 6px 0; font-size: 14px;"><strong>التاريخ الجديد:</strong> {{appointment_date}}</p>
      <p style="margin: 6px 0; font-size: 14px;"><strong>الوقت الجديد:</strong> <span style="color: #E5C378; font-weight: bold;">{{appointment_time}}</span></p>
      <p style="margin: 6px 0; font-size: 14px;"><strong>الأخصائية:</strong> {{specialist}}</p>
      <p style="margin: 6px 0; font-size: 14px;"><strong>رمز الحجز:</strong> #{{booking_reference}}</p>
    </div>
    <p style="font-size: 12px; color: #8C8477;">للاستفسار: {{salon_phone}}.</p>
  </div>
</body></html>`
  },

  // 4. VIP Follow-up & Thank You
  {
    id: 'vip_followup',
    nameEn: 'VIP Follow-Up & Appreciation',
    nameAr: 'شكر وتقدير عميلات VIP',
    descriptionEn: 'Sent following the appointment to express gratitude, request feedback, and offer loyalty perks.',
    descriptionAr: 'يُرسل عقب انتهاء الجلسة للتعبير عن الامتنان وطلب التقييم ومكافأة العميلة بالنقاط.',
    category: 'followup',
    isDefault: true,
    supportedVariables: [
      'customer_name',
      'service',
      'appointment_date',
      'appointment_time',
      'salon_branch',
      'salon_phone'
    ],
    subjectEn: 'Thank you for visiting Rozana Salon, {{customer_name}} ✨',
    subjectAr: 'سعدنا بزيارتكِ لصالون روزانة، أستاذة {{customer_name}} ✨',
    bodyTextEn: `Dear {{customer_name}},

It was our absolute privilege to pamper you today at Rozana Salon during your {{service}} session.

We truly hope your experience was nothing short of perfection. Your satisfaction is our highest reward.

We would love to welcome you back soon. To reserve your next royal appointment, visit our salon concierge at {{salon_phone}}.

With warmest appreciation,
The Management of Rozana Luxury Salon • Al Shumaisi, Riyadh`,

    bodyTextAr: `أهلاً بكِ أستاذة {{customer_name}}،

كان شرفاً وسعادةً بالغة لنا استقبالكِ وتدليلكِ اليوم في صالون روزانة خلال جلسة {{service}}.

نتمنى من كل قلوبنا أن تكون تجربتكِ قد حازت على إعجابكِ ورضاكِ التام وبالمستوى الملكي الذي تستحقينه.

يسعدنا ويشرفنا دائماً استقبالكِ مجدداً في واحتنا بالشميسي. لحجز موعدكِ القادم، يسعدنا تواصلكِ مع الكونسيرج: {{salon_phone}}.

مع خالص الشكر والتقدير،
إدارة صالون روزانة للتجميل • الرياض`,

    bodyHtmlEn: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Thank You - Rozana Salon</title></head>
<body style="margin: 0; padding: 24px; background-color: #0A0907; color: #F8F5EE; font-family: sans-serif;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #12100B; border: 1px solid #D4AF37; border-radius: 20px; padding: 32px; text-align: center;">
    <div style="font-size: 30px; margin-bottom: 12px;">✨</div>
    <h2 style="color: #E5C378; margin: 0; font-family: Georgia, serif;">Thank You, {{customer_name}}</h2>
    <p style="color: #D2C8BA; font-size: 14px; line-height: 1.8; margin-top: 14px;">
      It was an absolute pleasure hosting you at Rozana Salon for your <strong style="color: #E5C378;">{{service}}</strong>.
    </p>
    <p style="color: #A89F91; font-size: 13px; line-height: 1.6;">
      We hope your session brought you complete relaxation and radiance. We eagerly await your next visit!
    </p>
    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(212,175,55,0.2); font-size: 12px; color: #8C8477;">
      Rozana Luxury Salon • {{salon_branch}} • {{salon_phone}}
    </div>
  </div>
</body></html>`,

    bodyHtmlAr: `<!DOCTYPE html>
<html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>شكراً لزيارتكِ صالون روزانة</title></head>
<body style="margin: 0; padding: 24px; background-color: #0A0907; color: #F8F5EE; font-family: Tahoma, sans-serif; direction: rtl; text-align: right;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #12100B; border: 1px solid #D4AF37; border-radius: 20px; padding: 32px; text-align: center;">
    <div style="font-size: 30px; margin-bottom: 12px;">✨</div>
    <h2 style="color: #E5C378; margin: 0;">شكراً لزيارتكِ، أستاذة {{customer_name}}</h2>
    <p style="color: #D2C8BA; font-size: 14px; line-height: 1.8; margin-top: 14px;">
      سعدنا وتشرفنا جداً باستقبالكِ اليوم في صالون روزانة للاستمتاع بجلسة <strong style="color: #E5C378;">{{service}}</strong>.
    </p>
    <p style="color: #A89F91; font-size: 13px; line-height: 1.8;">
      نتمنى أن تكون تجربتكِ قد حازت على رضاكِ التام وأضفت لمسة من الجمال والتألق ليومكِ.
    </p>
    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(212,175,55,0.2); font-size: 12px; color: #8C8477;">
      صالون روزانة للتجميل • {{salon_branch}} • {{salon_phone}}
    </div>
  </div>
</body></html>`
  }
];

/**
 * Normalizes variable string formats like {{customer_name}}, {{ customer_name }}, {customer_name}
 */
export function renderTemplateText(
  rawText: string,
  variables: Record<string, string | number | undefined | null>
): string {
  if (!rawText) return '';

  let compiled = rawText;

  // Build key map with alternative casings (e.g., customer_name, customerName, customer)
  const expandedVars: Record<string, string> = {};
  for (const [k, v] of Object.entries(variables)) {
    if (v !== undefined && v !== null) {
      const strVal = String(v);
      expandedVars[k.toLowerCase()] = strVal;
      // Also camelCase to snake_case if applicable
      const snake = k.replace(/([A-Z])/g, '_$1').toLowerCase();
      expandedVars[snake] = strVal;
      // Common aliases
      if (k === 'customerName' || k === 'customer_name') {
        expandedVars['customer_name'] = strVal;
        expandedVars['customername'] = strVal;
        expandedVars['customer'] = strVal;
        expandedVars['name'] = strVal;
      }
      if (k === 'service' || k === 'serviceName' || k === 'service_name') {
        expandedVars['service'] = strVal;
        expandedVars['servicename'] = strVal;
        expandedVars['service_name'] = strVal;
        expandedVars['treatment'] = strVal;
      }
      if (k === 'appointment_time' || k === 'appointmentTime' || k === 'time') {
        expandedVars['appointment_time'] = strVal;
        expandedVars['appointmenttime'] = strVal;
        expandedVars['time'] = strVal;
      }
      if (k === 'appointment_date' || k === 'appointmentDate' || k === 'date') {
        expandedVars['appointment_date'] = strVal;
        expandedVars['appointmentdate'] = strVal;
        expandedVars['date'] = strVal;
      }
      if (k === 'booking_reference' || k === 'referenceId' || k === 'ref') {
        expandedVars['booking_reference'] = strVal;
        expandedVars['bookingreference'] = strVal;
        expandedVars['reference_id'] = strVal;
        expandedVars['ref'] = strVal;
      }
      if (k === 'specialist' || k === 'staffName' || k === 'staff_name') {
        expandedVars['specialist'] = strVal;
        expandedVars['staff_name'] = strVal;
        expandedVars['staffname'] = strVal;
      }
      if (k === 'total_amount' || k === 'totalSAR' || k === 'price') {
        expandedVars['total_amount'] = strVal;
        expandedVars['totalsar'] = strVal;
        expandedVars['price'] = strVal;
      }
    }
  }

  // Replace double braces {{ var }} and single braces { var }
  compiled = compiled.replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g, (_, key) => {
    const lookup = key.toLowerCase();
    return expandedVars[lookup] !== undefined ? expandedVars[lookup] : `{{${key}}}`;
  });

  compiled = compiled.replace(/\{\s*([a-zA-Z0-9_-]+)\s*\}/g, (match, key) => {
    const lookup = key.toLowerCase();
    return expandedVars[lookup] !== undefined ? expandedVars[lookup] : match;
  });

  return compiled;
}

/**
 * Extracts all dynamic variable keys present in a template string
 */
export function extractTemplateVariables(content: string): string[] {
  if (!content) return [];
  const matches = content.match(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g) || [];
  const keys = matches.map((m) => m.replace(/\{\{\s*|\s*\}\}/g, '').toLowerCase());
  return Array.from(new Set(keys));
}

/**
 * Validates template content for syntax and ensures critical variables exist
 */
export function validateTemplate(
  template: Partial<EmailTemplate>,
  requiredVariables: string[] = ['customer_name', 'service', 'appointment_time']
): {
  isValid: boolean;
  missingVariables: string[];
  syntaxErrors: string[];
} {
  const missingVariables: string[] = [];
  const syntaxErrors: string[] = [];

  const combinedContent = [
    template.subjectEn || '',
    template.subjectAr || '',
    template.bodyTextEn || '',
    template.bodyTextAr || '',
    template.bodyHtmlEn || '',
    template.bodyHtmlAr || ''
  ].join(' ');

  for (const req of requiredVariables) {
    if (!combinedContent.includes(`{{${req}}}`) && !combinedContent.includes(`{${req}}`)) {
      missingVariables.push(req);
    }
  }

  // Check unclosed braces
  const openCount = (combinedContent.match(/\{\{/g) || []).length;
  const closeCount = (combinedContent.match(/\}\}/g) || []).length;
  if (openCount !== closeCount) {
    syntaxErrors.push(`Mismatched double braces: ${openCount} open '{{' vs ${closeCount} closed '}}'`);
  }

  return {
    isValid: missingVariables.length === 0 && syntaxErrors.length === 0,
    missingVariables,
    syntaxErrors
  };
}

/**
 * Retrieves all email templates (with custom overrides stored in localStorage)
 */
export function getEmailTemplates(): EmailTemplate[] {
  if (typeof window === 'undefined') return DEFAULT_BOOKING_EMAIL_TEMPLATES;

  try {
    const raw = localStorage.getItem(STORAGE_TEMPLATES_KEY);
    if (!raw) return DEFAULT_BOOKING_EMAIL_TEMPLATES;

    const parsed: EmailTemplate[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_BOOKING_EMAIL_TEMPLATES;
    }

    // Merge defaults with custom templates
    const map = new Map<string, EmailTemplate>();
    DEFAULT_BOOKING_EMAIL_TEMPLATES.forEach((d) => map.set(d.id, d));
    parsed.forEach((p) => map.set(p.id, p));

    return Array.from(map.values());
  } catch (err) {
    console.warn('Failed to load email templates from storage:', err);
    return DEFAULT_BOOKING_EMAIL_TEMPLATES;
  }
}

/**
 * Retrieves a specific email template by ID
 */
export function getEmailTemplateById(templateId: string): EmailTemplate | undefined {
  const templates = getEmailTemplates();
  return templates.find((t) => t.id === templateId) || DEFAULT_BOOKING_EMAIL_TEMPLATES[0];
}

/**
 * Saves or updates a template in localStorage
 */
export function saveEmailTemplate(template: EmailTemplate): void {
  try {
    const templates = getEmailTemplates();
    const index = templates.findIndex((t) => t.id === template.id);

    const updatedTemplate: EmailTemplate = {
      ...template,
      updatedAt: new Date().toISOString()
    };

    if (index >= 0) {
      templates[index] = updatedTemplate;
    } else {
      templates.push(updatedTemplate);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_TEMPLATES_KEY, JSON.stringify(templates));
    }
  } catch (err) {
    console.warn('Failed to save email template:', err);
  }
}

/**
 * Resets all templates back to default luxury built-ins
 */
export function resetEmailTemplatesToDefault(): EmailTemplate[] {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_TEMPLATES_KEY);
    }
  } catch (err) {
    console.warn('Failed to reset email templates:', err);
  }
  return DEFAULT_BOOKING_EMAIL_TEMPLATES;
}

/**
 * Compiles an appointment into a ready-to-dispatch dynamic email
 * Supports bilingual rendering (English / Arabic)
 */
export function compileBookingEmail(
  templateId: string,
  appointment: Appointment,
  lang: 'en' | 'ar' = 'ar',
  options?: DynamicEmailOptions
): CompiledEmail {
  const template = getEmailTemplateById(templateId) || DEFAULT_BOOKING_EMAIL_TEMPLATES[0];

  const serviceName = lang === 'ar' ? appointment.serviceNameAr : appointment.serviceNameEn;
  const staffName = appointment.staffName || (lang === 'ar' ? 'نخبة خبيرات التجميل' : 'Master Aesthetician');
  const refCode = appointment.referenceId || appointment.id || `ROZ-${Math.floor(1000 + Math.random() * 9000)}`;
  const branchName = lang === 'ar' 
    ? (options?.fallbackBranchNameAr || 'صالون روزانة • فرع الشميسي، الرياض')
    : (options?.fallbackBranchNameEn || 'Rozana Salon • Al Shumaisi Branch, Riyadh');

  const variables: Record<string, string> = {
    customer_name: appointment.customerName || (lang === 'ar' ? 'العميلة الكريمة' : 'Valued Guest'),
    service: serviceName,
    appointment_time: appointment.time || '02:00 PM',
    appointment_date: appointment.date || new Date().toISOString().split('T')[0],
    booking_reference: refCode,
    specialist: staffName,
    total_amount: `${appointment.totalSAR ?? 0} ${lang === 'ar' ? 'ر.س' : 'SAR'}`,
    salon_branch: branchName,
    salon_address: lang === 'ar' ? 'شارع الشميسي، الرياض، المملكة العربية السعودية' : 'Al Shumaisi District, Riyadh, Saudi Arabia',
    salon_phone: '+966 11 412 8890',
    salon_email: 'concierge@rozanasalon.sa',
    cancellation_policy: lang === 'ar' 
      ? 'إلغاء مجاني حتى 4 ساعات قبل موعد الجلسة'
      : 'Free cancellation up to 4 hours prior to appointment',
    ...(options?.customVariables || {})
  };

  const subjectTemplate = lang === 'ar' ? template.subjectAr : template.subjectEn;
  const bodyTextTemplate = lang === 'ar' ? template.bodyTextAr : template.bodyTextEn;
  const bodyHtmlTemplate = lang === 'ar' ? template.bodyHtmlAr : template.bodyHtmlEn;

  const subject = renderTemplateText(subjectTemplate, variables);
  const textBody = renderTemplateText(bodyTextTemplate, variables);
  const htmlBody = renderTemplateText(bodyHtmlTemplate, variables);

  return {
    templateId: template.id,
    templateCategory: template.category,
    subject,
    textBody,
    htmlBody,
    variablesUsed: variables,
    recipientEmail: options?.customerEmail,
    recipientName: appointment.customerName,
    renderedAt: new Date().toISOString()
  };
}

/**
 * Quick preview helper with mock appointment data for testing or previewing templates
 */
export function previewBookingEmail(
  templateId: string,
  lang: 'en' | 'ar' = 'ar',
  customData?: Partial<Appointment>
): CompiledEmail {
  const mockAppointment: Appointment = {
    id: 'apt-sample-preview',
    referenceId: 'ROZ-5821',
    customerName: lang === 'ar' ? 'سارة العتيبي' : 'Sarah Al-Otaibi',
    customerPhone: '+966 50 123 4567',
    serviceId: 'srv-caviar',
    serviceNameEn: 'Royal Caviar & Keratin Hair Therapy',
    serviceNameAr: 'علاج الكافيار والبروتين الملكي للشعر',
    staffName: lang === 'ar' ? 'نورة القحطاني (خبيرة أولى)' : 'Noura Al-Qahtani (Senior Specialist)',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '04:30 PM',
    status: 'confirmed',
    totalSAR: 420,
    createdAt: new Date().toISOString(),
    ...customData
  };

  return compileBookingEmail(templateId, mockAppointment, lang, {
    customerEmail: 'sarah.otaibi@example.com'
  });
}
