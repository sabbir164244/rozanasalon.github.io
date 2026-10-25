import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { StaffMember } from '../../types';
import { StaffWeatherWidget } from './StaffWeatherWidget';
import { 
  Users, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Sparkles, 
  Edit3, 
  Image as ImageIcon,
  Save
} from 'lucide-react';

interface AdminStaffTabProps {
  staff: StaffMember[];
  onToggleAvailability: (staffId: string) => void;
  onUpdateStaff: (updatedStaff: StaffMember) => void;
  onAddStaff: (newStaff: StaffMember) => void;
}

export const AdminStaffTab: React.FC<AdminStaffTabProps> = ({
  staff,
  onToggleAvailability,
  onUpdateStaff,
  onAddStaff,
}) => {
  const { language } = useLanguage();

  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add staff state
  const [newNameEn, setNewNameEn] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [newRoleEn, setNewRoleEn] = useState('');
  const [newRoleAr, setNewRoleAr] = useState('');
  const [newAvatar, setNewAvatar] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80');
  const [newSpecialties, setNewSpecialties] = useState('Facial, Keratin, Luxury Bridal');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: StaffMember = {
      id: `staff-${Date.now()}`,
      nameEn: newNameEn || 'Salon Specialist',
      nameAr: newNameAr || 'أخصائية التجميل الملكي',
      roleEn: newRoleEn || 'Master Aesthetician',
      roleAr: newRoleAr || 'خبيرة عناية وتجميل معتمدة',
      rating: 5.0,
      avatar: newAvatar,
      isAvailableToday: true,
      specialties: newSpecialties.split(',').map(s => s.trim()).filter(Boolean)
    };
    onAddStaff(created);
    setIsAddOpen(false);
    setNewNameEn('');
    setNewNameAr('');
    setNewRoleEn('');
    setNewRoleAr('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    onUpdateStaff(editingStaff);
    setEditingStaff(null);
  };

  return (
    <div className="space-y-8 text-start animate-in fade-in duration-300">
      {/* Google Search Weather Widget for Riyadh & Outdoor Treatment Advisory */}
      <StaffWeatherWidget />

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
            {language === 'ar' ? 'فريق خبيرات صالون روزانة' : 'Salon Specialists & Stylist Team'}
          </h3>
          <p className="font-tajawal text-xs text-[#A89F91]">
            {language === 'ar' ? 'التحكم في توفر الأخصائيات اليوم وتحديث بياناتهن وصورهن' : 'Manage staff shifts, specialties, profiles and photos'}
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-5 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة أخصائية' : 'Add Specialist'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {staff.map((st) => (
          <div
            key={st.id}
            className="rounded-3xl bg-[#13110C] border border-white/10 p-5 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all shadow-lg"
          >
            <div>
              <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 mb-4 shadow-md">
                <img src={st.avatar} alt={st.nameEn} className="w-full h-full object-cover" />
                <button
                  onClick={() => onToggleAvailability(st.id)}
                  title="Toggle Duty"
                  className={`absolute bottom-1 end-1 w-5 h-5 rounded-full border-2 border-[#13110C] flex items-center justify-center cursor-pointer ${
                    st.isAvailableToday ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
              </div>

              <div className="text-center">
                <h4 className="font-playfair text-base font-bold text-[#F8F5EE]">
                  {st.nameEn}
                </h4>
                <p className="font-tajawal text-xs text-[#E5C378]">{st.nameAr}</p>
                <p className="font-tajawal text-[11px] text-[#A89F91] mt-1">
                  {language === 'ar' ? st.roleAr : st.roleEn}
                </p>

                <div className="flex items-center justify-center gap-1 mt-2 text-[#E5C378]">
                  <Star className="w-3.5 h-3.5 fill-[#E5C378]" />
                  <span className="font-mono text-xs font-bold">{st.rating.toFixed(1)}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1 mt-3">
                  {st.specialties.map((sp, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-[#18150F] text-[10px] text-[#D2C8BA] border border-white/5">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between gap-2">
              <button
                onClick={() => onToggleAvailability(st.id)}
                className={`flex-1 py-1.5 rounded-xl text-[11px] font-tajawal font-bold transition-colors cursor-pointer ${
                  st.isAvailableToday
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-950/60 text-red-300 border border-red-500/30'
                }`}
              >
                {st.isAvailableToday 
                  ? (language === 'ar' ? 'متاحة اليوم ✓' : 'Available Today') 
                  : (language === 'ar' ? 'في إجازة ✕' : 'Off Duty')}
              </button>

              <button
                onClick={() => setEditingStaff(st)}
                className="p-1.5 rounded-xl bg-[#221D14] hover:bg-[#2A2318] text-[#E5C378] border border-white/10 cursor-pointer"
                title="Edit Details"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#13110C] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl text-start">
            <button
              onClick={() => setEditingStaff(null)}
              className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>

            <h3 className="font-playfair text-xl font-bold text-[#F8F5EE] mb-4">
              {language === 'ar' ? 'تعديل بيانات الأخصائية' : 'Edit Specialist Profile'}
            </h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'الاسم بالإنجليزية' : 'Name (EN)'}
                </label>
                <input
                  type="text"
                  required
                  value={editingStaff.nameEn}
                  onChange={(e) => setEditingStaff({ ...editingStaff, nameEn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'الاسم بالعربية' : 'Name (AR)'}
                </label>
                <input
                  type="text"
                  required
                  value={editingStaff.nameAr}
                  onChange={(e) => setEditingStaff({ ...editingStaff, nameAr: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'رابط الصورة الرمزية (Avatar URL)' : 'Avatar Photo URL'}
                </label>
                <input
                  type="url"
                  required
                  value={editingStaff.avatar}
                  onChange={(e) => setEditingStaff({ ...editingStaff, avatar: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="flex-1 py-2.5 rounded-full bg-[#1A1711] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold cursor-pointer shadow-lg"
                >
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#13110C] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl text-start">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>

            <h3 className="font-playfair text-xl font-bold text-[#F8F5EE] mb-4">
              {language === 'ar' ? 'إضافة أخصائية جديدة' : 'Add New Specialist'}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'الاسم بالإنجليزية' : 'Name (EN)'}
                </label>
                <input
                  type="text"
                  required
                  value={newNameEn}
                  onChange={(e) => setNewNameEn(e.target.value)}
                  placeholder="e.g. Layla Al-Mansoor"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'الاسم بالعربية' : 'Name (AR)'}
                </label>
                <input
                  type="text"
                  required
                  value={newNameAr}
                  onChange={(e) => setNewNameAr(e.target.value)}
                  placeholder="مثال: ليلى المنصور"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'المسمى الوظيفي بالإنجليزية' : 'Role (EN)'}
                </label>
                <input
                  type="text"
                  required
                  value={newRoleEn}
                  onChange={(e) => setNewRoleEn(e.target.value)}
                  placeholder="Senior Hair Master"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'المسمى الوظيفي بالعربية' : 'Role (AR)'}
                </label>
                <input
                  type="text"
                  required
                  value={newRoleAr}
                  onChange={(e) => setNewRoleAr(e.target.value)}
                  placeholder="خبيرة معالجة الشعر الملكية"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'رابط الصورة (Image URL)' : 'Photo URL'}
                </label>
                <input
                  type="url"
                  required
                  value={newAvatar}
                  onChange={(e) => setNewAvatar(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#1A1711] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold cursor-pointer shadow-lg"
                >
                  {language === 'ar' ? 'إضافة' : 'Add Specialist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
