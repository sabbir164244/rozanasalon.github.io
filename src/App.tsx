import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
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
import { Footer } from './components/Footer';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { 
  INITIAL_SERVICES, 
  INITIAL_STAFF, 
  INITIAL_APPOINTMENTS, 
  INITIAL_REVIEWS, 
  SALON_SETTINGS 
} from './data/mockData';
import { Service, StaffMember, Appointment, SalonSettings, AppointmentStatus } from './types';

function MainSalonApp() {
  const { language } = useLanguage();

  // Application Data States (with localStorage persistence for live interactions)
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

  // Navigation & View States
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [showAdvisorModal, setShowAdvisorModal] = useState<boolean>(false);
  const [selectedServiceToBook, setSelectedServiceToBook] = useState<Service | null>(null);
  const [showFab, setShowFab] = useState<boolean>(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rozana_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('rozana_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('rozana_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('rozana_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle smooth navigation
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
  const handleSelectPackageToBook = (packageItem: any) => {
    // Create a temporary synthetic service for the selected package
    const packageService: Service = {
      id: packageItem.id,
      nameEn: packageItem.nameEn,
      nameAr: packageItem.nameAr,
      category: 'spa',
      priceSAR: packageItem.priceSAR,
      durationMin: packageItem.durationHours * 60,
      descriptionEn: packageItem.descriptionEn,
      descriptionAr: packageItem.descriptionAr,
      rating: 5.0,
      reviewsCount: 42,
      isSignature: true,
    };
    setSelectedServiceToBook(packageService);
    handleNavigate('booking');
  };

  // When customer confirms booking in Smart Booking Engine
  const handleNewBookingCreated = (newAppointment: Appointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
  };

  // Admin Kanban Status Updater
  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  // Staff availability toggle
  const handleToggleStaffAvailability = (staffId: string) => {
    setStaff(prev =>
      prev.map(m => (m.id === staffId ? { ...m, isAvailableToday: !m.isAvailableToday } : m))
    );
  };

  // Add new service
  const handleAddService = (newSrv: Service) => {
    setServices(prev => [newSrv, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0C0B08] text-[#EAEAEA] selection:bg-[#E5C378]/30 selection:text-[#E5C378] relative font-sans">
      {/* Top Haute-Luxe Navigation */}
      <Navbar
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onOpenAdmin={() => setShowAdminLogin(true)}
        isAdminView={isAdminView}
        onExitAdmin={() => setIsAdminView(false)}
      />

      {/* Main View Router */}
      {isAdminView ? (
        <AdminDashboard
          appointments={appointments}
          services={services}
          staff={staff}
          settings={settings}
          onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          onToggleStaffAvailability={handleToggleStaffAvailability}
          onAddService={handleAddService}
          onUpdateSettings={setSettings}
          onLogout={() => setIsAdminView(false)}
          onExitAdmin={() => setIsAdminView(false)}
        />
      ) : (
        <main>
          {/* Section 1: Hero */}
          <div id="hero">
            <Hero
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
            onBookTreatment={handleSelectServiceToBook}
          />

          {/* Section 4: VIP Bridal & Royal Packages */}
          <div id="packages">
            <BridalPackages
              onSelectPackage={handleSelectPackageToBook}
            />
          </div>

          {/* Section 5: Private VIP Suites Experience */}
          <div id="suites">
            <SuitesShowcase
              onBookSuite={() => handleNavigate('booking')}
            />
          </div>

          {/* Section 6: Smart 4-Step Booking Engine */}
          <BookingEngine
            services={services}
            staff={staff}
            initialSelectedService={selectedServiceToBook}
            onBookingComplete={handleNewBookingCreated}
          />

          {/* Section 7: Social Proof & Location (4.9 ★ Rating + Google Map) */}
          <SocialProofAndLocation
            reviews={INITIAL_REVIEWS}
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

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onSuccessLogin={() => {
            setShowAdminLogin(false);
            setIsAdminView(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainSalonApp />
    </LanguageProvider>
  );
}
