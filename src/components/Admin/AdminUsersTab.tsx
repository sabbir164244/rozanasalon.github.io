import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { 
  Users, 
  Database, 
  ShieldCheck, 
  Calendar, 
  Award, 
  Sparkles, 
  Mail, 
  Phone,
  RefreshCw,
  Search
} from 'lucide-react';

interface FirestoreUser {
  id: string;
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  role: string;
  loyaltyPoints?: number;
  createdAt?: string;
}

export const AdminUsersTab: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const q = query(collection(db, 'users'), limit(50));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: FirestoreUser[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            uid: data.uid || docSnap.id,
            email: data.email || null,
            displayName: data.displayName || null,
            phoneNumber: data.phoneNumber || null,
            role: data.role || 'client',
            loyaltyPoints: data.loyaltyPoints !== undefined ? data.loyaltyPoints : 150,
            createdAt: data.createdAt || new Date().toISOString()
          });
        });
        setUsers(list);
        setLoading(false);
      }, (err) => {
        console.warn('Users listener error:', err);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore users subscribe error:', err);
      setLoading(false);
    }
  }, []);

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      (u.displayName && u.displayName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phoneNumber && u.phoneNumber.includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#18150F] via-[#221C13] to-[#18150F] border border-[#D4AF37]/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-tajawal text-[#E5C378]">
            <Database className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>{language === 'ar' ? 'قاعدة بيانات سحابية متصلة بالكامل (Firebase Firestore)' : 'Live Cloud Database (Firebase Firestore)'}</span>
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F8F5EE]">
            {language === 'ar' ? 'سجل عضويات العملاء والمستخدمين' : 'Client Accounts & Memberships'}
          </h2>
          <p className="font-tajawal text-xs sm:text-sm text-[#A89F91] max-w-2xl">
            {language === 'ar' 
              ? 'تتم مزامنة حسابات العملاء المسجلين ونقاط الولاء الفاخرة تلقائياً عبر Firebase Auth و Firestore.' 
              : 'Registered client profiles, contact data and VIP loyalty reward balances synced in real time.'}
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4">
          <div className="px-5 py-3 rounded-2xl bg-[#12100C] border border-white/10 text-center">
            <span className="text-2xl font-black text-[#E5C378] font-cinzel block">
              {users.length}
            </span>
            <span className="text-[11px] font-tajawal text-[#8C8477]">
              {language === 'ar' ? 'مستخدم مسجل' : 'Registered Users'}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C8477] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
          <input
            id="admin-users-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'البحث بالاسم أو البريد الإلكتروني أو رقم الهاتف...' : 'Search users by name, email or phone...'}
            className="w-full bg-[#14120D] border border-white/10 rounded-2xl ps-10 pe-4 py-3 text-xs text-[#F8F5EE] placeholder-[#666] outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>
      </div>

      {/* Users List Table */}
      <div className="rounded-3xl bg-[#14120D] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs font-tajawal">
            <thead>
              <tr className="bg-[#1C1812] border-b border-white/10 text-[#8C8477] uppercase text-[11px] tracking-wider">
                <th className="px-5 py-4 text-start">{language === 'ar' ? 'العميلة / المستخدم' : 'Client Profile'}</th>
                <th className="px-5 py-4 text-start">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="px-5 py-4 text-start">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</th>
                <th className="px-5 py-4 text-start">{language === 'ar' ? 'الرتبة' : 'Role'}</th>
                <th className="px-5 py-4 text-start">{language === 'ar' ? 'نقاط الولاء' : 'VIP Loyalty'}</th>
                <th className="px-5 py-4 text-start">{language === 'ar' ? 'تاريخ التسجيل' : 'Registered'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8C8477]">
                    <div className="inline-block w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-2" />
                    <p>{language === 'ar' ? 'جاري الاتصال بـ Firebase Firestore...' : 'Syncing from Firebase Firestore...'}</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8C8477]">
                    <Users className="w-8 h-8 text-[#555] mx-auto mb-2" />
                    <p>{language === 'ar' ? 'لا يوجد مستخدمون مطابقون حالياً. سيتصل أي حساب جديد فور تسجيله.' : 'No users match your query. New signups appear here instantly.'}</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#E5C378] font-bold text-xs">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <span className="font-bold text-[#F8F5EE] block">
                            {user.displayName || (language === 'ar' ? 'عميلة جديدة' : 'New VIP Guest')}
                          </span>
                          <span className="text-[10px] font-mono text-[#777]">{user.uid.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[#D2C8BA]">
                      {user.email || '—'}
                    </td>
                    <td className="px-5 py-4 font-mono text-[#D2C8BA]">
                      {user.phoneNumber || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#E5C378] font-bold font-mono text-xs">
                        <Award className="w-3 h-3 text-[#E5C378]" />
                        {user.loyaltyPoints || 0} pts
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#8C8477] text-[11px]">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
