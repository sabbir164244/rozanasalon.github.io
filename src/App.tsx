import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './lib/firebase';
import { collection, addDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { ToastContainer } from './components/Toast/ToastContainer';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { TransformationShowcase } from './components/TransformationShowcase';
import { BridalPackages } from './components/BridalPackages';
import { SuitesShowcase } from './components/SuitesShowcase';
import { BookingEngine } from './components/BookingEngine';
import { SocialProofAndLocation } from './components/SocialProofAndLocation';
import { FloatingActionButton } from './components/FloatingActionButton';
import { BeautyAdvisorModal } from './components/BeautyAdvisorModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { DigitalGiftCardSection } from './components/GiftCards/DigitalGiftCardSection';
import { 
  INITIAL_SERVICES, 
  INITIAL_STAFF, 
  INITIAL_APPOINTMENTS, 
  INITIAL_REVIEWS, 
  SALON_SETTINGS,
  INITIAL_ADMIN_SECURITY,
  VIP_PACKAGES,
  SALON_SUITES,
  TRANSFORMATIONS,
  INITIAL_GIFT_CARDS,
  INITIAL_AUDIT_LOGS
} from './data/mockData';
import { 
  Service, 
  StaffMember, 
  Appointment, 
  SalonSettings, 
  AppointmentStatus,
  AdminSecurityConfig,
  AdminCredentials,
  VipPackage,
  SalonSuite,
  TransformationItem,
  SalonReview,
  GiftCard,
  AuditLogEntry,
  WaitlistEntry
} from './types';

function MainSalonApp() {
  const { language, isTransitioning } = useLanguage();
  const { notifyNewBooking, notifyGiftCardRedeemed } = useToast();
  const { currentUser } = useAuth();

  // Application Data States (with localStorage persistence for full real-time customization)
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('rozana_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('rozana_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('rozana_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [settings, setSettings] = useState<SalonSettings>(() => {
    const saved = localStorage.getItem('rozana_settings');
    return saved ? JSON.parse(saved) : SALON_SETTINGS;
  });

  const [securityConfig, setSecurityConfig] = useState<AdminSecurityConfig>(() => {
    const saved = localStorage.getItem('rozana_admin_security');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.password === 'rozana2026') {
          parsed.password = 'rozana6251';
        }
        return parsed;
      } catch {
        return INITIAL_ADMIN_SECURITY;
      }
    }
    return INITIAL_ADMIN_SECURITY;
  });

  const [packages, setPackages] = useState<VipPackage[]>(() => {
    const saved = localStorage.getItem('rozana_packages');
    return saved ? JSON.parse(saved) : VIP_PACKAGES;
  });

  const [suites, setSuites] = useState<SalonSuite[]>(() => {
    const saved = localStorage.getItem('rozana_suites');
    return saved ? JSON.parse(saved) : SALON_SUITES;
  });

  const [transformations, setTransformations] = useState<TransformationItem[]>(() => {
    const saved = localStorage.getItem('rozana_transformations');
    return saved ? JSON.parse(saved) : TRANSFORMATIONS;
  });

  const [reviews, setReviews] = useState<SalonReview[]>(() => {
    const saved = localStorage.getItem('rozana_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [giftCards, setGiftCards] = useState<GiftCard[]>(() => {
    const saved = localStorage.getItem('rozana_gift_cards');
    return saved ? JSON.parse(saved) : INITIAL_GIFT_CARDS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('rozana_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Navigation & View States
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showAdvisorModal, setShowAdvisorModal] = useState<boolean>(false);
  const [selectedServiceToBook, setSelectedServiceToBook] = useState<Service | null>(null);
  const [showFab, setShowFab] = useState<boolean>(true);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('rozana_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Real-time Firestore sync for appointments
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'appointments'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteAppointments: Appointment[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteAppointments.push({
              id: docSnap.id,
              referenceId: data.referenceId || docSnap.id.substring(0, 6).toUpperCase(),
              customerName: data.customerName || 'VIP Guest',
              customerPhone: data.customerPhone || '',
              serviceId: data.serviceId || 'srv-1',
              serviceNameEn: data.serviceNameEn || 'Salon Treatment',
              serviceNameAr: data.serviceNameAr || 'جلسة صالون',
              serviceCategory: data.serviceCategory || 'hair',
              staffId: data.staffId,
              staffName: data.staffName || 'Specialist',
              date: data.date || new Date().toISOString().split('T')[0],
              time: data.time || '02:00 PM',
              status: data.status || 'new',
              notes: data.notes,
              totalSAR: data.totalSAR || 0,
              createdAt: data.createdAt || data.createdTimestamp || new Date().toISOString()
            });
          });

          // Merge with local appointments avoiding duplicates
          setAppointments(prev => {
            const map = new Map<string, Appointment>();
            remoteAppointments.forEach(a => map.set(a.id, a));
            prev.forEach(a => {
              if (!map.has(a.id)) {
                map.set(a.id, a);
              }
            });
            return Array.from(map.values());
          });
        }
      }, (err) => {
        console.warn('Firestore appointments listener error:', err);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Could not attach Firestore listener:', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rozana_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('rozana_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('rozana_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('rozana_admin_security', JSON.stringify(securityConfig));
  }, [securityConfig]);

  useEffect(() => {
    localStorage.setItem('rozana_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('rozana_suites', JSON.stringify(suites));
  }, [suites]);

  useEffect(() => {
    localStorage.setItem('rozana_transformations', JSON.stringify(transformations));
  }, [transformations]);

  useEffect(() => {
    localStorage.setItem('rozana_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('rozana_gift_cards', JSON.stringify(giftCards));
  }, [giftCards]);

  useEffect(() => {
    localStorage.setItem('rozana_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Central Audit Logger
  const logAdminAction = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'> & { timestamp?: string }) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: entry.timestamp || new Date().toISOString()
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem('rozana_audit_logs');
  };

  // Smooth Navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isAdminView) {
      setIsAdminView(false);
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // When a customer clicks "Book This Service"
  const handleSelectServiceToBook = (service: Service) => {
    setSelectedServiceToBook(service);
    handleNavigate('booking');
  };

  // When a customer selects a VIP Bridal Package
  const handleSelectPackageToBook = (packageItem: VipPackage) => {
    const duration = packageItem.durationMin || (packageItem.durationHours ? packageItem.durationHours * 60 : 180);
    const packageService: Service = {
      id: packageItem.id,
      nameEn: packageItem.nameEn || packageItem.titleEn || 'VIP Royal Package',
      nameAr: packageItem.nameAr || packageItem.titleAr || 'باقة كبار الشخصيات الفاخرة',
      category: 'spa',
      priceSAR: packageItem.priceSAR,
      durationMin: duration,
      descriptionEn: packageItem.descriptionEn || packageItem.taglineEn || 'Exclusive Royal Treatment Package',
      descriptionAr: packageItem.descriptionAr || packageItem.taglineAr || 'باقة علاجية ملكية فاخرة وشاملة',
      rating: 5.0,
      reviewsCount: 48,
      isSignature: true,
    };
    setSelectedServiceToBook(packageService);
    handleNavigate('booking');
  };

  // When customer confirms booking in BookingEngine
  const handleNewBookingCreated = async (newAppointment: Appointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
    notifyNewBooking(newAppointment, () => {
      setIsAdminView(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Asynchronously save to Firebase Firestore database
    try {
      await addDoc(collection(db, 'appointments'), {
        ...newAppointment,
        userId: currentUser?.uid || null,
        userEmail: currentUser?.email || null,
        createdTimestamp: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Firestore appointment save notice:', err);
    }
  };

  // When customer signs up for Waitlist
  const handleJoinWaitlist = (entry: WaitlistEntry) => {
    logAdminAction({
      category: 'bookings',
      actionType: 'waitlist_entry',
      titleAr: `تسجيل في قائمة الانتظار #${entry.referenceCode}`,
      titleEn: `VIP Waitlist Entry: #${entry.referenceCode}`,
      detailsAr: `انضمت العميلة ${entry.customerName} لقائمة الانتظار لتاريخ ${entry.date} لخدمة ${entry.serviceNameAr}.`,
      detailsEn: `Client ${entry.customerName} registered on waitlist for ${entry.date} (${entry.serviceNameEn}).`,
      actor: 'Waitlist Engine',
      targetId: entry.id,
      targetName: `Waitlist #${entry.referenceCode}`,
      newValue: `${entry.date} - ${entry.preferredTimeWindow}`,
      severity: 'info'
    });
  };

  // Appointments CRUD
  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    const existing = appointments.find(a => a.id === id);
    const prevStatus = existing?.status || 'new';

    logAdminAction({
      category: 'bookings',
      actionType: 'booking_status',
      titleAr: `تحديث حالة الحجز #${existing?.referenceId || id}`,
      titleEn: `Booking Status Changed: #${existing?.referenceId || id}`,
      detailsAr: `تم تحديث حالة الحجز للعميلة (${existing?.customerName || 'عميلة'}) من "${prevStatus}" إلى "${newStatus}".`,
      detailsEn: `Status for booking (${existing?.customerName || 'Guest'}) updated from "${prevStatus}" to "${newStatus}".`,
      actor: 'Rozana Admin',
      targetId: id,
      targetName: `Ref #${existing?.referenceId || id}`,
      previousValue: prevStatus,
      newValue: newStatus,
      severity: newStatus === 'cancelled' ? 'alert' : 'success'
    });

    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  const handleUpdateAppointment = (updated: Appointment) => {
    const existing = appointments.find(a => a.id === updated.id);

    logAdminAction({
      category: 'bookings',
      actionType: 'booking_edit',
      titleAr: `تعديل تفاصيل الحجز #${updated.referenceId}`,
      titleEn: `Booking Details Updated: #${updated.referenceId}`,
      detailsAr: `تم تعديل وقت أو مواصفات الحجز للعميلة ${updated.customerName}.`,
      detailsEn: `Schedule or appointment details modified for ${updated.customerName}.`,
      actor: 'Rozana Admin',
      targetId: updated.id,
      targetName: `Ref #${updated.referenceId}`,
      previousValue: existing ? `${existing.date} ${existing.time}` : undefined,
      newValue: `${updated.date} ${updated.time}`,
      severity: 'info'
    });

    setAppointments(prev =>
      prev.map(apt => (apt.id === updated.id ? updated : apt))
    );
  };

  const handleDeleteAppointment = (id: string) => {
    const apt = appointments.find(a => a.id === id);

    logAdminAction({
      category: 'bookings',
      actionType: 'booking_delete',
      titleAr: `إلغاء وحذف حجز #${apt?.referenceId || id}`,
      titleEn: `Booking Record Removed: #${apt?.referenceId || id}`,
      detailsAr: `تم حذف سجل الحجز نهائياً للعميلة ${apt?.customerName || 'غير محدد'}.`,
      detailsEn: `Booking permanently expunged for client ${apt?.customerName || 'N/A'}.`,
      actor: 'Director (Admin)',
      targetId: id,
      targetName: `Ref #${apt?.referenceId || id}`,
      severity: 'alert'
    });

    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const handleAddAppointment = (newAppt: Appointment) => {
    logAdminAction({
      category: 'bookings',
      actionType: 'booking_create',
      titleAr: `حجز يدوي جديد #${newAppt.referenceId}`,
      titleEn: `Manual Booking Scheduled: #${newAppt.referenceId}`,
      detailsAr: `تم إنشاء حجز يدوي للعميلة ${newAppt.customerName} بقيمة ${newAppt.totalSAR} ر.س بتأكيد الإدارة.`,
      detailsEn: `Manual appointment created for ${newAppt.customerName} (${newAppt.totalSAR} SAR).`,
      actor: 'Front Desk / Admin',
      targetId: newAppt.id,
      targetName: `Ref #${newAppt.referenceId}`,
      newValue: `${newAppt.totalSAR} SAR (${newAppt.date})`,
      severity: 'success'
    });

    setAppointments(prev => [newAppt, ...prev]);
  };

  // Services CRUD
  const handleAddService = (newSrv: Service) => {
    logAdminAction({
      category: 'services',
      actionType: 'service_create',
      titleAr: `إضافة خدمة جديدة: ${newSrv.nameAr}`,
      titleEn: `New Service Added: ${newSrv.nameEn}`,
      detailsAr: `تم إدراج الخدمة في قائمة الخدمات بسعر ${newSrv.priceSAR} ر.س ومدة ${newSrv.durationMin} دقيقة.`,
      detailsEn: `Service added to salon menu at ${newSrv.priceSAR} SAR (${newSrv.durationMin} min).`,
      actor: 'Director (Admin)',
      targetId: newSrv.id,
      targetName: newSrv.nameEn,
      newValue: `${newSrv.priceSAR} SAR`,
      severity: 'success'
    });

    setServices(prev => [newSrv, ...prev]);
  };

  const handleUpdateService = (updatedService: Service) => {
    const existing = services.find(s => s.id === updatedService.id);
    const priceChanged = existing && existing.priceSAR !== updatedService.priceSAR;

    if (priceChanged) {
      logAdminAction({
        category: 'services',
        actionType: 'price_change',
        titleAr: `تعديل تسعيرة خدمة: ${updatedService.nameAr}`,
        titleEn: `Service Price Modified: ${updatedService.nameEn}`,
        detailsAr: `تم تغيير سعر الخدمة رسمياً من ${existing.priceSAR} ر.س إلى ${updatedService.priceSAR} ر.س.`,
        detailsEn: `Service pricing adjusted from ${existing.priceSAR} SAR to ${updatedService.priceSAR} SAR.`,
        actor: 'Director (Admin)',
        targetId: updatedService.id,
        targetName: updatedService.nameEn,
        previousValue: `${existing.priceSAR} SAR`,
        newValue: `${updatedService.priceSAR} SAR`,
        severity: 'warning'
      });
    } else {
      logAdminAction({
        category: 'services',
        actionType: 'service_edit',
        titleAr: `تحديث بيانات خدمة: ${updatedService.nameAr}`,
        titleEn: `Service Details Updated: ${updatedService.nameEn}`,
        detailsAr: `تم تحديث وصف أو مدة أو مميزات الخدمة.`,
        detailsEn: `Service duration, description or attributes updated.`,
        actor: 'Director (Admin)',
        targetId: updatedService.id,
        targetName: updatedService.nameEn,
        severity: 'info'
      });
    }

    setServices(prev =>
      prev.map(srv => (srv.id === updatedService.id ? updatedService : srv))
    );
  };

  const handleDeleteService = (serviceId: string) => {
    const srv = services.find(s => s.id === serviceId);

    logAdminAction({
      category: 'services',
      actionType: 'service_delete',
      titleAr: `حذف خدمة: ${srv ? srv.nameAr : serviceId}`,
      titleEn: `Service Removed: ${srv ? srv.nameEn : serviceId}`,
      detailsAr: `تم حذف الخدمة من قائمة الصالون وإلغاء إتاحتها للحجز.`,
      detailsEn: `Service deleted from active salon catalog.`,
      actor: 'Director (Admin)',
      targetId: serviceId,
      targetName: srv ? srv.nameEn : serviceId,
      severity: 'alert'
    });

    setServices(prev => prev.filter(srv => srv.id !== serviceId));
  };

  const handleResetServicesToDefault = () => {
    localStorage.removeItem('rozana_services');
    setServices(INITIAL_SERVICES);
    logAdminAction({
      category: 'services',
      actionType: 'service_edit',
      titleAr: 'استعادة قائمة الخدمات الافتراضية للصالون',
      titleEn: 'Restore Default Salon Services Catalog',
      detailsAr: 'تمت استعادة باقة الخدمات والأسعار الافتراضية الأصلية بنجاح.',
      detailsEn: 'Original salon service catalog, images, and default pricing restored.',
      actor: 'Director (Admin)',
      severity: 'warning'
    });
  };

  // Staff CRUD
  const handleToggleStaffAvailability = (staffId: string) => {
    const member = staff.find(m => m.id === staffId);
    const willBeAvailable = member ? !member.isAvailableToday : false;

    logAdminAction({
      category: 'staff',
      actionType: 'staff_availability',
      titleAr: `تغيير حالة توفر الخبيرة: ${member ? member.nameAr : staffId}`,
      titleEn: `Staff Availability Changed: ${member ? member.nameEn : staffId}`,
      detailsAr: willBeAvailable
        ? `تم تفعيل استقبال الحجوزات اليومية للخبيرة.`
        : `تم تعيين الخبيرة كغير متاحة لاستقبال مواعيد جديدة اليوم.`,
      detailsEn: willBeAvailable
        ? `Staff marked available for bookings today.`
        : `Staff marked unavailable for bookings today.`,
      actor: 'Rozana Manager',
      targetId: staffId,
      targetName: member ? member.nameEn : staffId,
      previousValue: member?.isAvailableToday ? 'Available' : 'Unavailable',
      newValue: willBeAvailable ? 'Available' : 'Unavailable',
      severity: 'info'
    });

    setStaff(prev =>
      prev.map(m => (m.id === staffId ? { ...m, isAvailableToday: !m.isAvailableToday } : m))
    );
  };

  const handleUpdateStaff = (updatedStaff: StaffMember) => {
    logAdminAction({
      category: 'staff',
      actionType: 'staff_update',
      titleAr: `تحديث ملف الخبيرة: ${updatedStaff.nameAr}`,
      titleEn: `Staff Profile Updated: ${updatedStaff.nameEn}`,
      detailsAr: `تم تحديث المسمى الوظيفي والخدمات والخبرات للخبيرة.`,
      detailsEn: `Staff specialty, designation, or bio parameters modified.`,
      actor: 'Director (Admin)',
      targetId: updatedStaff.id,
      targetName: updatedStaff.nameEn,
      severity: 'info'
    });

    setStaff(prev =>
      prev.map(st => (st.id === updatedStaff.id ? updatedStaff : st))
    );
  };

  const handleAddStaff = (newStaff: StaffMember) => {
    logAdminAction({
      category: 'staff',
      actionType: 'staff_create',
      titleAr: `إضافة خبيرة جديدة للفريق: ${newStaff.nameAr}`,
      titleEn: `New Staff Member Added: ${newStaff.nameEn}`,
      detailsAr: `تم ضم الخبيرة لقائمة فريق العمل بتخصص: ${newStaff.roleAr}.`,
      detailsEn: `Staff member onboarded with title: ${newStaff.roleEn}.`,
      actor: 'Director (Admin)',
      targetId: newStaff.id,
      targetName: newStaff.nameEn,
      severity: 'success'
    });

    setStaff(prev => [...prev, newStaff]);
  };

  // Gift Cards CRUD
  const handleAddGiftCard = (newCard: GiftCard) => {
    logAdminAction({
      category: 'system',
      actionType: 'giftcard_create',
      titleAr: `إصدار بطاقة إهداء فاخرة #${newCard.code}`,
      titleEn: `Gift Card Issued: #${newCard.code}`,
      detailsAr: `تم إصدار بطاقة إهداء للمستلم (${newCard.recipientName}) بقيمة ${newCard.amountSAR} ر.س.`,
      detailsEn: `Gift card issued for (${newCard.recipientName}) with value ${newCard.amountSAR} SAR.`,
      actor: 'Rozana Admin',
      targetId: newCard.id,
      targetName: `Card #${newCard.code}`,
      newValue: `${newCard.amountSAR} SAR`,
      severity: 'success'
    });

    setGiftCards(prev => [newCard, ...prev]);
  };

  const handleUpdateGiftCard = (updatedCard: GiftCard) => {
    setGiftCards(prev => prev.map(c => (c.id === updatedCard.id ? updatedCard : c)));
  };

  const handleDeleteGiftCard = (cardId: string) => {
    const card = giftCards.find(c => c.id === cardId);
    logAdminAction({
      category: 'system',
      actionType: 'giftcard_delete',
      titleAr: `حذف بطاقة إهداء #${card?.code || cardId}`,
      titleEn: `Gift Card Deleted: #${card?.code || cardId}`,
      detailsAr: `تم حذف بطاقة الإهداء من النظام.`,
      detailsEn: `Gift card removed from active registry.`,
      actor: 'Director (Admin)',
      targetId: cardId,
      severity: 'alert'
    });
    setGiftCards(prev => prev.filter(c => c.id !== cardId));
  };

  const handleRedeemGiftCardInBooking = (code: string, amount: number, appointmentRef: string) => {
    let matchedRecipient = '';
    let updatedRemaining = 0;

    logAdminAction({
      category: 'bookings',
      actionType: 'giftcard_redeem',
      titleAr: `خصم بطاقة إهداء #${code.toUpperCase()}`,
      titleEn: `Gift Card Redemption: #${code.toUpperCase()}`,
      detailsAr: `تم خصم مبلغ ${amount} ر.س من رصيد البطاقة لموعد الحجز #${appointmentRef}.`,
      detailsEn: `Applied ${amount} SAR redemption from card toward appointment #${appointmentRef}.`,
      actor: 'Booking Engine (Client)',
      targetName: `Card #${code.toUpperCase()}`,
      newValue: `-${amount} SAR`,
      severity: 'info'
    });

    setGiftCards(prev => prev.map(card => {
      if (card.code.toUpperCase() === code.toUpperCase()) {
        const newBal = Math.max(0, card.remainingBalanceSAR - amount);
        matchedRecipient = card.recipientName;
        updatedRemaining = newBal;
        const newRecord = {
          id: `red-${Date.now()}`,
          date: new Date().toISOString(),
          amountSAR: amount,
          appointmentRef,
          note: `Online booking deduction for Ref: ${appointmentRef}`,
          performedBy: 'Booking Engine'
        };
        return {
          ...card,
          remainingBalanceSAR: newBal,
          status: (newBal === 0 ? 'redeemed' : 'partially_redeemed') as any,
          redemptionHistory: [newRecord, ...(card.redemptionHistory || [])]
        };
      }
      return card;
    }));

    notifyGiftCardRedeemed({
      cardCode: code,
      amountSAR: amount,
      remainingSAR: updatedRemaining,
      recipientName: matchedRecipient,
      appointmentRef,
      onClickView: () => {
        setIsAdminView(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  // Security Update
  const handleUpdateSecurityConfig = (newConfig: AdminSecurityConfig) => {
    logAdminAction({
      category: 'security',
      actionType: 'security_update',
      titleAr: 'تحديث بيانات أمان البوابة الإدارية',
      titleEn: 'Admin Security Credentials Modified',
      detailsAr: `تم تحديث البريد الإلكتروني وكلمة المرور المشفرة وإعدادات الأمان.`,
      detailsEn: `Admin login email, hashed password, or secret recovery answers updated.`,
      actor: 'Super Admin',
      targetName: 'Security Configuration',
      severity: 'alert'
    });

    setSecurityConfig(newConfig);
  };

  // Content Customization
  const handleUpdateSettings = (newSettings: SalonSettings) => {
    setSettings(newSettings);
  };

  const handleUpdatePackages = (newPackages: VipPackage[]) => {
    setPackages(newPackages);
  };

  const handleUpdateSuites = (newSuites: SalonSuite[]) => {
    setSuites(newSuites);
  };

  const handleUpdateTransformations = (newTransformations: TransformationItem[]) => {
    setTransformations(newTransformations);
  };

  const handleUpdateReviews = (newReviews: SalonReview[]) => {
    setReviews(newReviews);
  };

  // Full Database Export
  const handleExportAllData = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      salon: 'Rozana Salon - Al Shumaisi',
      services,
      staff,
      appointments,
      settings,
      securityConfig,
      packages,
      suites,
      transformations,
      reviews,
      giftCards,
      auditLogs
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rozana_salon_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Full Database Import
  const handleImportAllData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.services) setServices(data.services);
      if (data.staff) setStaff(data.staff);
      if (data.appointments) setAppointments(data.appointments);
      if (data.settings) setSettings(data.settings);
      if (data.securityConfig) setSecurityConfig(data.securityConfig);
      if (data.packages) setPackages(data.packages);
      if (data.suites) setSuites(data.suites);
      if (data.transformations) setTransformations(data.transformations);
      if (data.reviews) setReviews(data.reviews);
      if (data.giftCards) setGiftCards(data.giftCards);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      return true;
    } catch (err) {
      console.error('Import error:', err);
      return false;
    }
  };

  // Reset to initial factory defaults
  const handleResetToDefaults = () => {
    localStorage.removeItem('rozana_services');
    localStorage.removeItem('rozana_staff');
    localStorage.removeItem('rozana_appointments');
    localStorage.removeItem('rozana_settings');
    localStorage.removeItem('rozana_admin_security');
    localStorage.removeItem('rozana_packages');
    localStorage.removeItem('rozana_suites');
    localStorage.removeItem('rozana_transformations');
    localStorage.removeItem('rozana_reviews');
    localStorage.removeItem('rozana_gift_cards');
    localStorage.removeItem('rozana_audit_logs');

    setServices(INITIAL_SERVICES);
    setStaff(INITIAL_STAFF);
    setAppointments(INITIAL_APPOINTMENTS);
    setSettings(SALON_SETTINGS);
    setSecurityConfig(INITIAL_ADMIN_SECURITY);
    setPackages(VIP_PACKAGES);
    setSuites(SALON_SUITES);
    setTransformations(TRANSFORMATIONS);
    setReviews(INITIAL_REVIEWS);
    setGiftCards(INITIAL_GIFT_CARDS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  // Secure Admin Authentication Handlers
  const handleAdminLoginSuccess = (credentials?: AdminCredentials) => {
    const activeCreds = credentials || {
      email: securityConfig.email,
      token: `adm-token-${Date.now()}`,
      authenticatedAt: new Date().toISOString(),
      role: 'salon_director'
    };
    setAdminCredentials(activeCreds);
    setShowAdminLogin(false);
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    // 1. Immediately wipe admin credentials from local memory/state
    setAdminCredentials(null);
    setIsAdminView(false);
    setShowAdminLogin(false);

    // 2. Clear any session or temporary token references
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('rozana_admin_session');
        sessionStorage.removeItem('admin_credentials');
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_auth');
      } catch (e) {
        // Safe ignore
      }
    }

    // 3. Record secure logout in audit logs
    logAdminAction({
      category: 'security',
      actionType: 'admin_logout',
      titleAr: 'تسجيل خروج آمن من لوحة التحكم',
      titleEn: 'Secure Admin Dashboard Logout',
      detailsAr: 'تم مسح بيانات الاعتماد الإدارية الحساسة من الذاكرة المحلية فوراً لمنع بقائها.',
      detailsEn: 'Admin credentials and session state cleared immediately from local memory.',
      actor: 'Director (Admin)',
      severity: 'info'
    });
  };

  return (
    <motion.div
      id="app-root-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: isTransitioning ? 0.05 : 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#0C0B08] text-[#EAEAEA] selection:bg-[#E5C378]/30 selection:text-[#E5C378] relative font-sans"
    >
      {/* Top Haute-Luxe Navigation */}
      <Navbar
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onOpenAdmin={() => setShowAdminLogin(true)}
        isAdminView={isAdminView}
        onExitAdmin={handleAdminLogout}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* Main View Router */}
      {isAdminView ? (
        <AdminDashboard
          appointments={appointments}
          services={services}
          staff={staff}
          settings={settings}
          securityConfig={securityConfig}
          adminCredentials={adminCredentials}
          packages={packages}
          suites={suites}
          transformations={transformations}
          reviews={reviews}
          giftCards={giftCards}
          auditLogs={auditLogs}
          onClearAuditLogs={handleClearAuditLogs}
          onAddAuditLog={logAdminAction}
          onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          onUpdateAppointment={handleUpdateAppointment}
          onDeleteAppointment={handleDeleteAppointment}
          onAddAppointment={handleAddAppointment}
          onAddService={handleAddService}
          onUpdateService={handleUpdateService}
          onDeleteService={handleDeleteService}
          onToggleStaffAvailability={handleToggleStaffAvailability}
          onUpdateStaff={handleUpdateStaff}
          onAddStaff={handleAddStaff}
          onUpdateSettings={handleUpdateSettings}
          onUpdateSecurityConfig={handleUpdateSecurityConfig}
          onUpdatePackages={handleUpdatePackages}
          onUpdateSuites={handleUpdateSuites}
          onUpdateTransformations={handleUpdateTransformations}
          onUpdateReviews={handleUpdateReviews}
          onAddGiftCard={handleAddGiftCard}
          onUpdateGiftCard={handleUpdateGiftCard}
          onDeleteGiftCard={handleDeleteGiftCard}
          onExportAllData={handleExportAllData}
          onImportAllData={handleImportAllData}
          onResetToDefaults={handleResetToDefaults}
          onResetServicesToDefault={handleResetServicesToDefault}
          onLogout={handleAdminLogout}
          onExitAdmin={handleAdminLogout}
        />
      ) : (
        <main>
          {/* Section 1: Hero */}
          <div id="hero">
            <Hero
              settings={settings}
              onBookNow={() => handleNavigate('booking')}
              onExploreServices={() => handleNavigate('services')}
              onOpenAdvisor={() => setShowAdvisorModal(true)}
            />
          </div>

          {/* Section 2: Services & Signature Spotlight */}
          <ServicesSection
            services={services}
            onSelectServiceToBook={handleSelectServiceToBook}
            onOpenAdvisor={() => setShowAdvisorModal(true)}
          />

          {/* Section 3: Interactive Transformation Before/After Showcase */}
          <TransformationShowcase
            transformations={transformations}
            onSelectServiceToBook={(serviceId) => {
              const matched = services.find(s => s.id === serviceId);
              if (matched) {
                handleSelectServiceToBook(matched);
              } else {
                handleNavigate('booking');
              }
            }}
          />

          {/* Section 4: VIP Bridal & Royal Packages */}
          <div id="packages">
            <BridalPackages
              packages={packages}
              onSelectPackageToBook={handleSelectPackageToBook}
            />
          </div>

          {/* Section 5: Digital Luxury Gift Cards Module */}
          <div id="giftcards">
            <DigitalGiftCardSection
              giftCards={giftCards}
              onPurchaseGiftCard={handleAddGiftCard}
              onBookWithGiftCard={(code) => {
                handleNavigate('booking');
              }}
            />
          </div>

          {/* Section 6: Private VIP Suites Experience */}
          <div id="suites">
            <SuitesShowcase
              suites={suites}
              onBookSuite={() => handleNavigate('booking')}
            />
          </div>

          {/* Section 7: Smart 4-Step Booking Engine */}
          <BookingEngine
            services={services}
            staff={staff}
            appointments={appointments}
            initialSelectedService={selectedServiceToBook}
            giftCards={giftCards}
            onBookingComplete={handleNewBookingCreated}
            onRedeemGiftCard={handleRedeemGiftCardInBooking}
            onJoinWaitlist={handleJoinWaitlist}
          />

          {/* Section 8: Social Proof & Location (4.9 ★ Rating + Google Map) */}
          <SocialProofAndLocation
            reviews={reviews}
            settings={settings}
          />

          {/* Floating Action Button: Book Appointment Now */}
          <FloatingActionButton
            visible={showFab}
            onBookClick={() => handleNavigate('booking')}
          />
        </main>
      )}

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setShowAdminLogin(true)}
      />

      {/* Admin Login Modal (with secure recovery question support) */}
      {showAdminLogin && (
        <AdminLogin
          securityConfig={securityConfig}
          onSuccessLogin={handleAdminLoginSuccess}
          onUpdateSecurityConfig={handleUpdateSecurityConfig}
          onCancel={() => setShowAdminLogin(false)}
        />
      )}

      {/* Haute Beauty Advisor Modal */}
      {showAdvisorModal && (
        <BeautyAdvisorModal
          isOpen={showAdvisorModal}
          onClose={() => setShowAdvisorModal(false)}
          onSelectRecommendedService={(service) => {
            setShowAdvisorModal(false);
            handleSelectServiceToBook(service);
          }}
        />
      )}

      {/* Client Firebase Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onNavigateToBooking={() => handleNavigate('booking')}
      />

      {/* Floating Live Toast Notification System */}
      <ToastContainer />
    </motion.div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <MainSalonApp />
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
