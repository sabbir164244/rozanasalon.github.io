import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { GiftCard, GiftCardStatus, GiftCardTheme } from '../../types';
import { 
  Gift, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  Check, 
  Eye, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  Printer, 
  MessageCircle, 
  Trash2,
  TrendingUp,
  Sparkles,
  X,
  CreditCard,
  History
} from 'lucide-react';

interface AdminGiftCardsTabProps {
  giftCards: GiftCard[];
  onAddGiftCard: (newCard: GiftCard) => void;
  onUpdateGiftCard: (updatedCard: GiftCard) => void;
  onDeleteGiftCard?: (cardId: string) => void;
}

export const AdminGiftCardsTab: React.FC<AdminGiftCardsTabProps> = ({
  giftCards,
  onAddGiftCard,
  onUpdateGiftCard,
  onDeleteGiftCard,
}) => {
  const { language } = useLanguage();
  const { notifyGiftCardRedeemed, addToast } = useToast();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | GiftCardStatus>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedCardForRedeem, setSelectedCardForRedeem] = useState<GiftCard | null>(null);
  const [selectedCardForView, setSelectedCardForView] = useState<GiftCard | null>(null);

  // Issue Form State
  const [newAmount, setNewAmount] = useState<number>(500);
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newRecipientPhone, setNewRecipientPhone] = useState('');
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newSenderName, setNewSenderName] = useState(language === 'ar' ? 'إدارة صالون روزانة (Rozana VIP)' : 'Rozana Salon Management');
  const [newPersonalMessage, setNewPersonalMessage] = useState(language === 'ar' ? 'بطاقة إهداء ملكية خاصة لكبار الشخصيات' : 'Exclusive VIP Gift Card');
  const [newTheme, setNewTheme] = useState<GiftCardTheme>('gold-onyx');
  const [isComp, setIsComp] = useState(true);

  // Redeem Form State
  const [redeemAmount, setRedeemAmount] = useState<string>('');
  const [redeemNote, setRedeemNote] = useState<string>('');
  const [appointmentRef, setAppointmentRef] = useState<string>('');
  const [redeemError, setRedeemError] = useState<string>('');

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Cards
  const filteredCards = giftCards.filter((card) => {
    const matchesSearch = 
      card.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.recipientPhone && card.recipientPhone.includes(searchTerm));

    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate KPIs
  const totalIssuedCount = giftCards.length;
  const totalIssuedValue = giftCards.reduce((acc, c) => acc + c.amountSAR, 0);
  const totalRemainingLiability = giftCards.reduce((acc, c) => acc + (c.status !== 'cancelled' ? c.remainingBalanceSAR : 0), 0);
  const totalRedeemedValue = totalIssuedValue - totalRemainingLiability;

  // Handle Create Gift Card
  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientName.trim() || newAmount <= 0) return;

    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const code = `ROZ-VIP-${randomPart}`;

    const now = new Date();
    const expiry = new Date();
    expiry.setFullYear(now.getFullYear() + 1);

    const createdCard: GiftCard = {
      id: `gift-${Date.now()}`,
      code,
      amountSAR: newAmount,
      remainingBalanceSAR: newAmount,
      senderName: newSenderName.trim() || 'Rozana VIP Management',
      senderEmail: 'admin@rozana.sa',
      recipientName: newRecipientName.trim(),
      recipientPhone: newRecipientPhone.trim(),
      recipientEmail: newRecipientEmail.trim(),
      personalMessage: newPersonalMessage.trim(),
      designTheme: newTheme,
      deliveryType: 'instant',
      status: 'active',
      issuedAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      paymentMethod: isComp ? 'VIP Complimentary' : 'Counter Cash',
      paymentRef: `ADM-${Math.floor(100000 + Math.random() * 900000)}`,
      redemptionHistory: []
    };

    onAddGiftCard(createdCard);
    setShowIssueModal(false);

    // Trigger toast notification
    addToast({
      type: 'success',
      titleAr: 'تم إصدار بطاقة إهداء جديدة',
      titleEn: 'Gift Card Issued Successfully',
      messageAr: `تم إصدار البطاقة (${createdCard.code}) بقيمة ${createdCard.amountSAR} ر.س للمستفيدة: ${createdCard.recipientName}`,
      messageEn: `Card (${createdCard.code}) issued with ${createdCard.amountSAR} SAR for: ${createdCard.recipientName}`,
      duration: 6000
    });

    // Reset fields
    setNewRecipientName('');
    setNewRecipientPhone('');
    setNewRecipientEmail('');
    setNewAmount(500);
  };

  // Handle Apply Redemption
  const handleApplyRedemption = (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemError('');

    if (!selectedCardForRedeem) return;

    const num = parseFloat(redeemAmount);
    if (isNaN(num) || num <= 0) {
      setRedeemError(language === 'ar' ? 'الرجاء إدخال مبلغ صحيح للصرف' : 'Please enter a valid amount');
      return;
    }

    if (num > selectedCardForRedeem.remainingBalanceSAR) {
      setRedeemError(
        language === 'ar'
          ? `المبلغ المدخل (${num} ر.س) يتجاوز الرصيد المتبقي بالبطاقة (${selectedCardForRedeem.remainingBalanceSAR} ر.س)`
          : `Amount exceeds current remaining balance (${selectedCardForRedeem.remainingBalanceSAR} SAR)`
      );
      return;
    }

    const newBalance = selectedCardForRedeem.remainingBalanceSAR - num;
    const newStatus: GiftCardStatus = newBalance === 0 ? 'redeemed' : 'partially_redeemed';

    const newRecord = {
      id: `red-${Date.now()}`,
      date: new Date().toISOString(),
      amountSAR: num,
      appointmentRef: appointmentRef.trim() || undefined,
      note: redeemNote.trim() || (language === 'ar' ? 'صرف يدوي من كاونتر صالون روزانة' : 'Manual counter redemption'),
      performedBy: 'Rozana Admin Desk'
    };

    const updated: GiftCard = {
      ...selectedCardForRedeem,
      remainingBalanceSAR: newBalance,
      status: newStatus,
      redemptionHistory: [newRecord, ...(selectedCardForRedeem.redemptionHistory || [])]
    };

    onUpdateGiftCard(updated);

    // Trigger Toast Notification
    notifyGiftCardRedeemed({
      cardCode: selectedCardForRedeem.code,
      amountSAR: num,
      remainingSAR: newBalance,
      recipientName: selectedCardForRedeem.recipientName,
      appointmentRef: appointmentRef.trim() || undefined
    });

    setSelectedCardForRedeem(null);
    setRedeemAmount('');
    setRedeemNote('');
    setAppointmentRef('');
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-[#241F14] border border-[#D4AF37]/40 text-[#E5C378]">
              <Gift className="w-5 h-5" />
            </span>
            <h2 className="font-playfair text-2xl font-bold text-[#F8F5EE]">
              {language === 'ar' ? 'سجل بطاقات الإهداء الرقمية (Gift Cards)' : 'Digital Gift Cards Registry'}
            </h2>
          </div>
          <p className="font-tajawal text-xs sm:text-sm text-[#A89F91]">
            {language === 'ar'
              ? 'متابعة البطاقات الصادرة والمستخدمة، صرف الأرصدة، وإصدار بطاقات كبار الشخصيات والعميلات المميزات.'
              : 'Monitor issued vouchers, process redemptions, and issue VIP complimentary gift cards.'}
          </p>
        </div>

        <button
          onClick={() => setShowIssueModal(true)}
          className="luxe-gold-btn px-5 py-2.5 rounded-xl text-xs sm:text-sm font-tajawal font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إصدار بطاقة إهداء جديدة' : 'Issue New Gift Card'}</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Issued Value */}
        <div className="p-5 rounded-2xl bg-[#14120D] border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-tajawal text-[#8C8477]">
              {language === 'ar' ? 'إجمالي قيمة البطاقات' : 'Total Issued Value'}
            </span>
            <span className="p-2 rounded-lg bg-[#211B11] text-[#E5C378]">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="font-playfair text-2xl font-bold text-[#F8F5EE]">
            {totalIssuedValue.toLocaleString()} <span className="text-xs font-tajawal text-[#E5C378]">ر.س</span>
          </div>
          <span className="text-[11px] font-tajawal text-[#8C8477] mt-1 block">
            {totalIssuedCount} {language === 'ar' ? 'بطاقة مسجلة بالنظام' : 'Cards Total'}
          </span>
        </div>

        {/* Outstanding Liability */}
        <div className="p-5 rounded-2xl bg-[#14120D] border border-[#D4AF37]/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-tajawal text-[#E5C378]">
              {language === 'ar' ? 'الرصيد المتبقي للصرف' : 'Outstanding Liability'}
            </span>
            <span className="p-2 rounded-lg bg-[#2A2315] text-[#E5C378]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="font-playfair text-2xl font-bold text-[#E5C378]">
            {totalRemainingLiability.toLocaleString()} <span className="text-xs font-tajawal text-[#E5C378]">ر.س</span>
          </div>
          <span className="text-[11px] font-tajawal text-[#8C8477] mt-1 block">
            {language === 'ar' ? 'أرصدة عميلات سارية المفعول' : 'Active Redeemable Balance'}
          </span>
        </div>

        {/* Redeemed Value */}
        <div className="p-5 rounded-2xl bg-[#14120D] border border-emerald-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-tajawal text-emerald-400">
              {language === 'ar' ? 'إجمالي ما تم صرفه' : 'Total Redeemed'}
            </span>
            <span className="p-2 rounded-lg bg-emerald-950/50 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="font-playfair text-2xl font-bold text-emerald-400">
            {totalRedeemedValue.toLocaleString()} <span className="text-xs font-tajawal text-emerald-400">ر.س</span>
          </div>
          <span className="text-[11px] font-tajawal text-[#8C8477] mt-1 block">
            {Math.round((totalRedeemedValue / (totalIssuedValue || 1)) * 100)}% {language === 'ar' ? 'نسبة الاستهلاك' : 'Redemption Rate'}
          </span>
        </div>

        {/* Active Cards Count */}
        <div className="p-5 rounded-2xl bg-[#14120D] border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-tajawal text-[#8C8477]">
              {language === 'ar' ? 'البطاقات النشطة حالياً' : 'Active Cards'}
            </span>
            <span className="p-2 rounded-lg bg-[#1F1C16] text-[#E5C378]">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="font-playfair text-2xl font-bold text-[#F8F5EE]">
            {giftCards.filter(c => c.status === 'active' || c.status === 'partially_redeemed').length}
          </div>
          <span className="text-[11px] font-tajawal text-[#8C8477] mt-1 block">
            {language === 'ar' ? 'جاهزة للحجز والاستخدام' : 'Ready for Booking'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#14120D] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C8477] absolute left-3 top-3" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'بحث برمز البطاقة، الاسم، أو الهاتف...' : 'Search code, name, phone...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#F8F5EE] focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'active', labelAr: 'نشطة', labelEn: 'Active' },
            { id: 'partially_redeemed', labelAr: 'مستخدمة جزئياً', labelEn: 'Partial' },
            { id: 'redeemed', labelAr: 'مكتملة الصرف', labelEn: 'Redeemed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-tajawal transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#E5C378] text-[#0C0B08] font-bold'
                  : 'bg-[#0E0C09] text-[#8C8477] hover:text-[#F8F5EE] border border-white/5'
              }`}
            >
              {language === 'ar' ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Gift Cards Table */}
      <div className="bg-[#14120D] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs font-tajawal">
            <thead className="bg-[#0E0C09] border-b border-white/5 text-[#8C8477]">
              <tr>
                <th className="p-4 text-start font-medium">{language === 'ar' ? 'رمز البطاقة' : 'Card Code'}</th>
                <th className="p-4 text-start font-medium">{language === 'ar' ? 'المهداة لها (المستلمة)' : 'Recipient'}</th>
                <th className="p-4 text-start font-medium">{language === 'ar' ? 'المرسل' : 'Sender'}</th>
                <th className="p-4 text-start font-medium">{language === 'ar' ? 'القيمة والرصيد المتبقي' : 'Value & Balance'}</th>
                <th className="p-4 text-start font-medium">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="p-4 text-start font-medium">{language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}</th>
                <th className="p-4 text-end font-medium">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#EDE7DC]">
              {filteredCards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8C8477]">
                    {language === 'ar' ? 'لا توجد بطاقات إهداء مطابقة للبحث' : 'No matching gift cards found'}
                  </td>
                </tr>
              ) : (
                filteredCards.map((card) => {
                  const percentUsed = Math.round(((card.amountSAR - card.remainingBalanceSAR) / card.amountSAR) * 100);

                  return (
                    <tr key={card.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Code */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-[#E5C378] bg-black/40 px-2.5 py-1 rounded-md border border-white/10">
                            {card.code}
                          </span>
                          <button
                            onClick={() => handleCopy(card.code, card.id)}
                            className="text-[#8C8477] hover:text-[#E5C378] transition-colors cursor-pointer"
                            title="Copy Code"
                          >
                            {copiedId === card.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Recipient */}
                      <td className="p-4">
                        <div className="font-medium text-[#F8F5EE]">{card.recipientName}</div>
                        {card.recipientPhone && (
                          <div className="text-[11px] text-[#8C8477] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span>{card.recipientPhone}</span>
                          </div>
                        )}
                      </td>

                      {/* Sender */}
                      <td className="p-4">
                        <div className="text-[#EDE7DC]">{card.senderName}</div>
                        <span className="text-[10px] text-[#8C8477]">{card.paymentMethod || 'Online'}</span>
                      </td>

                      {/* Value & Balance Progress */}
                      <td className="p-4">
                        <div className="flex items-baseline gap-1 font-bold">
                          <span className="text-[#E5C378] text-sm">{card.remainingBalanceSAR}</span>
                          <span className="text-[11px] text-[#8C8477]">/ {card.amountSAR} ر.س</span>
                        </div>
                        {/* Mini progress bar */}
                        <div className="w-24 h-1.5 bg-black/40 rounded-full mt-1.5 overflow-hidden border border-white/5">
                          <div
                            className={`h-full ${
                              card.remainingBalanceSAR === 0
                                ? 'bg-zinc-600'
                                : percentUsed > 50
                                ? 'bg-amber-500'
                                : 'bg-emerald-400'
                            }`}
                            style={{ width: `${100 - percentUsed}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
                            card.status === 'active'
                              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                              : card.status === 'partially_redeemed'
                              ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
                              : 'bg-zinc-900 border border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {card.status === 'active'
                            ? (language === 'ar' ? 'نشطة' : 'Active')
                            : card.status === 'partially_redeemed'
                            ? (language === 'ar' ? 'مستخدمة جزئياً' : 'Partial')
                            : (language === 'ar' ? 'مكتملة الصرف' : 'Redeemed')}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-[#8C8477]">
                        <div>{new Date(card.issuedAt).toLocaleDateString()}</div>
                        <div className="text-[10px]">
                          {language === 'ar' ? 'تنتهي: ' : 'Exp: '}
                          {new Date(card.expiresAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Redeem Button (if has balance) */}
                          {card.remainingBalanceSAR > 0 && (
                            <button
                              onClick={() => {
                                setSelectedCardForRedeem(card);
                                setRedeemAmount(card.remainingBalanceSAR.toString());
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#221B11] border border-[#D4AF37]/30 hover:border-[#E5C378] text-[#E5C378] hover:text-white transition-colors cursor-pointer text-xs font-medium"
                              title="Redeem Amount"
                            >
                              {language === 'ar' ? 'صرف' : 'Redeem'}
                            </button>
                          )}

                          {/* View Details */}
                          <button
                            onClick={() => setSelectedCardForView(card)}
                            className="p-1.5 rounded-lg bg-black/30 border border-white/5 hover:border-white/20 text-[#8C8477] hover:text-[#EDE7DC] transition-colors cursor-pointer"
                            title="View Voucher Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Issue New Gift Card */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#12100C] border border-[#D4AF37]/50 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#E5C378]" />
                <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
                  {language === 'ar' ? 'إصدار بطاقة إهداء جديدة' : 'Issue New Gift Card'}
                </h3>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="p-1.5 text-[#8C8477] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4 text-xs font-tajawal">
              {/* Amount */}
              <div>
                <label className="block text-[#B8AF9F] mb-1 font-medium">
                  {language === 'ar' ? 'قيمة البطاقة (ريال سعودي) *' : 'Gift Amount (SAR) *'}
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[250, 500, 1000, 2500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setNewAmount(amt)}
                      className={`py-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        newAmount === amt
                          ? 'bg-[#211B11] border-[#E5C378] text-[#E5C378]'
                          : 'bg-[#0E0C09] border-white/5 text-[#8C8477]'
                      }`}
                    >
                      {amt} ر.س
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="50"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl px-3.5 py-2.5 text-sm text-[#F8F5EE] focus:outline-none"
                />
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-[#B8AF9F] mb-1 font-medium">
                  {language === 'ar' ? 'اسم المستلمة *' : 'Recipient Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'ar' ? 'مثال: سمو الأميرة سارة / أ. منيرة' : 'e.g. Maha Al-Otaibi'}
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl px-3.5 py-2.5 text-sm text-[#F8F5EE] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#B8AF9F] mb-1 font-medium">
                    {language === 'ar' ? 'هاتف المستلمة (واتساب)' : 'Recipient Phone'}
                  </label>
                  <input
                    type="tel"
                    placeholder="+966 50 000 0000"
                    value={newRecipientPhone}
                    onChange={(e) => setNewRecipientPhone(e.target.value)}
                    className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl px-3 py-2 text-xs text-[#F8F5EE] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#B8AF9F] mb-1 font-medium">
                    {language === 'ar' ? 'بريد المستلمة' : 'Recipient Email'}
                  </label>
                  <input
                    type="email"
                    placeholder="guest@domain.sa"
                    value={newRecipientEmail}
                    onChange={(e) => setNewRecipientEmail(e.target.value)}
                    className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl px-3 py-2 text-xs text-[#F8F5EE] focus:outline-none"
                  />
                </div>
              </div>

              {/* Sender Name */}
              <div>
                <label className="block text-[#B8AF9F] mb-1 font-medium">
                  {language === 'ar' ? 'اسم المرسل' : 'Sender Name'}
                </label>
                <input
                  type="text"
                  value={newSenderName}
                  onChange={(e) => setNewSenderName(e.target.value)}
                  className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl px-3.5 py-2 text-xs text-[#F8F5EE] focus:outline-none"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-[#B8AF9F] mb-1 font-medium">
                  {language === 'ar' ? 'رسالة الإهداء المرفقة' : 'Personal Note'}
                </label>
                <textarea
                  rows={2}
                  value={newPersonalMessage}
                  onChange={(e) => setNewPersonalMessage(e.target.value)}
                  className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl p-3 text-xs text-[#F8F5EE] focus:outline-none resize-none"
                />
              </div>

              {/* Theme & Type */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isComp"
                    checked={isComp}
                    onChange={(e) => setIsComp(e.target.checked)}
                    className="accent-[#E5C378] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isComp" className="text-[#B8AF9F] cursor-pointer">
                    {language === 'ar' ? 'إهداء ترويجي مجاني لكبار الشخصيات (VIP Complimentary)' : 'VIP Complimentary Gift'}
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#8C8477] hover:text-white cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="luxe-gold-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'ar' ? 'توليد وإصدار البطاقة فوراً' : 'Issue & Activate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Manual Redemption Modal */}
      {selectedCardForRedeem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#12100C] border border-[#E5C378] max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
                  {language === 'ar' ? 'صرف واستخدام رصيد البطاقة' : 'Redeem Gift Card'}
                </h3>
                <span className="font-mono text-xs text-[#E5C378]">
                  {selectedCardForRedeem.code}
                </span>
              </div>
              <button
                onClick={() => setSelectedCardForRedeem(null)}
                className="p-1.5 text-[#8C8477] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Balance Card */}
            <div className="p-4 rounded-xl bg-[#1F1B12] border border-[#D4AF37]/30 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#8C8477] block font-tajawal">
                  {language === 'ar' ? 'الرصيد المتاح حالياً للصرف:' : 'Available Balance:'}
                </span>
                <span className="font-playfair text-2xl font-bold text-[#E5C378]">
                  {selectedCardForRedeem.remainingBalanceSAR} SAR
                </span>
              </div>
              <div className="text-end text-xs font-tajawal text-[#B8AF9F]">
                <div>{selectedCardForRedeem.recipientName}</div>
                <div className="text-[10px] text-[#8C8477]">{selectedCardForRedeem.recipientPhone || 'No Phone'}</div>
              </div>
            </div>

            <form onSubmit={handleApplyRedemption} className="space-y-4 text-xs font-tajawal">
              <div>
                <label className="block text-[#B8AF9F] mb-1 font-medium">
                  {language === 'ar' ? 'المبلغ المراد صرفه وخصمه (ريال سعودي) *' : 'Amount to Deduct (SAR) *'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    max={selectedCardForRedeem.remainingBalanceSAR}
                    min="1"
                    required
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    className="flex-1 bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl px-3.5 py-2.5 text-sm text-[#F8F5EE] focus:outline-none font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setRedeemAmount(selectedCardForRedeem.remainingBalanceSAR.toString())}
                    className="px-3 py-2.5 rounded-xl bg-[#2A2315] border border-[#D4AF37]/40 text-[#E5C378] text-[11px] font-bold cursor-pointer hover:bg-[#342b1a]"
                  >
                    {language === 'ar' ? 'صرف كامل الرصيد' : 'Full Amount'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#B8AF9F] mb-1 font-medium">
                  {language === 'ar' ? 'رقم حجز الموعد المرتبط (اختياري)' : 'Appointment Ref (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="مثال: ROZ-9102"
                  value={appointmentRef}
                  onChange={(e) => setAppointmentRef(e.target.value)}
                  className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl px-3.5 py-2 text-xs text-[#F8F5EE] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#B8AF9F] mb-1 font-medium">
                  {language === 'ar' ? 'ملاحظة أو سبب الخصم' : 'Note / Reason'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'مثال: جلسة نضارة الذهب عيار 24' : 'e.g. 24K Royal Gold Facial'}
                  value={redeemNote}
                  onChange={(e) => setRedeemNote(e.target.value)}
                  className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl px-3.5 py-2 text-xs text-[#F8F5EE] focus:outline-none"
                />
              </div>

              {redeemError && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-[11px]">
                  {redeemError}
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCardForRedeem(null)}
                  className="px-4 py-2 rounded-xl text-xs text-[#8C8477] hover:text-white cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="luxe-gold-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تأكيد خصم الرصيد' : 'Confirm Deduction'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: View Card Details & Redemption Audit Log */}
      {selectedCardForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#12100C] border border-white/10 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#E5C378]" />
                <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
                  {language === 'ar' ? 'تفاصيل بطاقة الإهداء' : 'Gift Card Details'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCardForView(null)}
                className="p-1.5 text-[#8C8477] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-tajawal">
              {/* Code Banner */}
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8C8477] block uppercase">{language === 'ar' ? 'رمز البطاقة' : 'Card Code'}</span>
                  <span className="font-mono text-base font-bold text-[#E5C378] tracking-wider">
                    {selectedCardForView.code}
                  </span>
                </div>
                <div className="text-end">
                  <span className="text-[10px] text-[#8C8477] block">{language === 'ar' ? 'الرصيد المتبقي' : 'Remaining'}</span>
                  <span className="font-playfair text-lg font-bold text-[#F8F5EE]">
                    {selectedCardForView.remainingBalanceSAR} / {selectedCardForView.amountSAR} SAR
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#18150F] border border-white/5">
                <div>
                  <span className="text-[#8C8477] block">{language === 'ar' ? 'المستلمة:' : 'Recipient:'}</span>
                  <strong className="text-[#EDE7DC]">{selectedCardForView.recipientName}</strong>
                  <div className="text-[11px] text-[#8C8477]">{selectedCardForView.recipientPhone || 'No Phone'}</div>
                </div>
                <div>
                  <span className="text-[#8C8477] block">{language === 'ar' ? 'المرسل:' : 'Sender:'}</span>
                  <strong className="text-[#EDE7DC]">{selectedCardForView.senderName}</strong>
                  <div className="text-[11px] text-[#8C8477]">{selectedCardForView.paymentMethod || 'Complimentary'}</div>
                </div>
              </div>

              {selectedCardForView.personalMessage && (
                <div className="p-3 rounded-xl bg-[#14120D] border border-white/5 italic text-[#A89F91]">
                  "{selectedCardForView.personalMessage}"
                </div>
              )}

              {/* Redemption History Log */}
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-[#E5C378] font-bold">
                  <History className="w-4 h-4" />
                  <span>{language === 'ar' ? 'سجل حركات الصرف والاستخدام:' : 'Redemption History:'}</span>
                </div>

                {(!selectedCardForView.redemptionHistory || selectedCardForView.redemptionHistory.length === 0) ? (
                  <div className="p-4 text-center rounded-xl bg-black/20 border border-white/5 text-[#8C8477]">
                    {language === 'ar' ? 'لم يتم صرف أي مبالغ من هذه البطاقة بعد (رصيد كامل ساري)' : 'No redemptions logged yet (full balance remains)'}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedCardForView.redemptionHistory.map((red) => (
                      <div key={red.id} className="p-2.5 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-bold text-emerald-400">-{red.amountSAR} SAR</span>
                          <span className="text-[#8C8477] mx-1.5">•</span>
                          <span className="text-[#EDE7DC]">{red.note || 'Redemption'}</span>
                          {red.appointmentRef && (
                            <span className="text-[10px] font-mono text-[#E5C378] ml-1 bg-black/40 px-1.5 py-0.5 rounded">
                              {red.appointmentRef}
                            </span>
                          )}
                        </div>
                        <span className="text-[#8C8477] text-[10px]">
                          {new Date(red.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedCardForView(null)}
                  className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#EDE7DC] cursor-pointer"
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
