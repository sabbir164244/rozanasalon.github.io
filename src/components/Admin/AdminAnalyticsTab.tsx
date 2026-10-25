import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Appointment, Service } from '../../types';
import { 
  TrendingUp, 
  DollarSign, 
  CalendarClock, 
  Users, 
  Sparkles, 
  ArrowUpRight 
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface AdminAnalyticsTabProps {
  appointments: Appointment[];
  services: Service[];
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  appointments,
  services,
}) => {
  const { language } = useLanguage();

  const totalRevenue = appointments
    .filter((a) => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => sum + (a.totalSAR || 0), 0);

  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const newCount = appointments.filter((a) => a.status === 'new').length;

  // Chart Mock Data based on Real Totals
  const REVENUE_TREND_DATA = [
    { day: language === 'ar' ? 'السبت' : 'Sat', revenue: 3200, bookings: 8 },
    { day: language === 'ar' ? 'الأحد' : 'Sun', revenue: 4150, bookings: 11 },
    { day: language === 'ar' ? 'الاثنين' : 'Mon', revenue: 3890, bookings: 9 },
    { day: language === 'ar' ? 'الثلاثاء' : 'Tue', revenue: 4900, bookings: 12 },
    { day: language === 'ar' ? 'الأربعاء' : 'Wed', revenue: 5800, bookings: 14 },
    { day: language === 'ar' ? 'الخميس' : 'Thu', revenue: 8450, bookings: 19 },
    { day: language === 'ar' ? 'الجمعة' : 'Fri', revenue: 9800, bookings: 23 },
  ];

  const CATEGORY_DISTRIBUTION_DATA = [
    { category: 'Facial', count: 18, revenue: 8900 },
    { category: 'Keratin', count: 14, revenue: 16800 },
    { category: 'Haircut', count: 22, revenue: 7700 },
    { category: 'Nails', count: 28, revenue: 5600 },
    { category: 'Spa & Moroccan', count: 12, revenue: 5400 },
  ];

  return (
    <div className="space-y-8 text-start animate-in fade-in duration-300">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-3xl bg-[#13110C] border border-white/10 p-6 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-[#8C8477] mb-2">
            <span className="text-xs font-tajawal">{language === 'ar' ? 'إجمالي المبيعات النشطة' : 'Active Revenue'}</span>
            <DollarSign className="w-5 h-5 text-[#E5C378]" />
          </div>
          <div className="font-playfair text-3xl font-bold text-[#F8F5EE]">
            {totalRevenue.toLocaleString()} <span className="text-sm font-mono text-[#E5C378]">SAR</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-tajawal text-emerald-400 mt-3">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% {language === 'ar' ? 'مقارنة بالأسبوع الماضي' : 'vs last week'}</span>
          </div>
        </div>

        <div className="rounded-3xl bg-[#13110C] border border-white/10 p-6 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-[#8C8477] mb-2">
            <span className="text-xs font-tajawal">{language === 'ar' ? 'الحجوزات المؤكدة' : 'Confirmed Slots'}</span>
            <CalendarClock className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-playfair text-3xl font-bold text-[#F8F5EE]">
            {confirmedCount}
          </div>
          <div className="text-[11px] font-tajawal text-[#A89F91] mt-3">
            {language === 'ar' ? 'جاهزة للاستقبال في أجنحة الشميسي' : 'Ready in Shumaisi suites'}
          </div>
        </div>

        <div className="rounded-3xl bg-[#13110C] border border-white/10 p-6 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-[#8C8477] mb-2">
            <span className="text-xs font-tajawal">{language === 'ar' ? 'طلبات جديدة بالانتظار' : 'New Requests'}</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div className="font-playfair text-3xl font-bold text-[#F8F5EE]">
            {newCount}
          </div>
          <div className="text-[11px] font-tajawal text-amber-300 mt-3">
            {language === 'ar' ? 'بانتظار تأكيد مشرفة الصالون' : 'Awaiting confirmation'}
          </div>
        </div>

        <div className="rounded-3xl bg-[#13110C] border border-white/10 p-6 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-[#8C8477] mb-2">
            <span className="text-xs font-tajawal">{language === 'ar' ? 'متوسط الفاتورة' : 'Average Ticket'}</span>
            <Users className="w-5 h-5 text-[#E5C378]" />
          </div>
          <div className="font-playfair text-3xl font-bold text-[#F8F5EE]">
            {(totalRevenue / (confirmedCount + completedCount || 1)).toFixed(0)}{' '}
            <span className="text-sm font-mono text-[#E5C378]">SAR</span>
          </div>
          <div className="text-[11px] font-tajawal text-[#A89F91] mt-3">
            {language === 'ar' ? 'شريحة كبار الشخصيات والعرائس' : 'High-AOV Luxury Segment'}
          </div>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Revenue Trend */}
        <div className="rounded-3xl bg-[#13110C] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#F8F5EE]">
                {language === 'ar' ? 'منحنى الإيرادات الأسبوعية (SAR)' : 'Weekly Revenue Flow (SAR)'}
              </h3>
              <p className="font-tajawal text-xs text-[#8C8477] mt-0.5">
                {language === 'ar' ? 'ارتفاع الإقبال في عطلة نهاية الأسبوع' : 'Peak demand on Thursdays & Fridays'}
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#E5C378]" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_TREND_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E5C378" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E5C378" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#26221A" />
                <XAxis dataKey="day" stroke="#777" tick={{ fontSize: 11 }} />
                <YAxis stroke="#777" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18150F',
                    borderColor: '#D4AF37',
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: '#F8F5EE'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E5C378" strokeWidth={2.5} fillOpacity={1} fill="url(#goldGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Revenue Distribution */}
        <div className="rounded-3xl bg-[#13110C] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#F8F5EE]">
                {language === 'ar' ? 'توزيع الإيرادات حسب الأقسام' : 'Revenue by Treatment Category'}
              </h3>
              <p className="font-tajawal text-xs text-[#8C8477] mt-0.5">
                {language === 'ar' ? 'الكيراتين وجلسات البشرة في الصدارة' : 'Keratin and Facials lead in volume'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_DISTRIBUTION_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#26221A" />
                <XAxis dataKey="category" stroke="#777" tick={{ fontSize: 11 }} />
                <YAxis stroke="#777" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18150F',
                    borderColor: '#D4AF37',
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: '#F8F5EE'
                  }}
                />
                <Bar dataKey="revenue" fill="#C59D4A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
