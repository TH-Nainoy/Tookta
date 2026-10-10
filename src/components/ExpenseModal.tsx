import React, { useState, useEffect, useRef } from 'react';
import { ExpenseRecord, ExpenseCategory } from '../types/fleetOps';
import { DocumentAttachment } from '../types/billing';
import { X, Upload, Trash2, Paperclip, FileText, Image as ImageIcon } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseRecord) => void;
  initialExpense?: ExpenseRecord | null;
  drivers: string[];
}

const CATEGORIES: ExpenseCategory[] = [
  'ค่าน้ำมัน',
  'ค่าลานคืนตู้/ยกตู้',
  'ค่าทางด่วน',
  'ค่าเบี้ยเลี้ยงคนขับ',
  'ค่าที่จอดรถ',
  'ค่าซ่อมแซมฉุกเฉิน',
  'ค่าปรับ/ค่าตรวจสภาพ',
  'อื่นๆ',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialExpense,
  drivers,
}) => {
  const [formData, setFormData] = useState<ExpenseRecord>({
    id: '',
    expenseNo: '',
    date: '30/09/2569',
    category: 'ค่าน้ำมัน',
    title: '',
    amount: 0,
    driver: 'โจ้',
    vehiclePlate: '71-4521 กทม.',
    paymentMethod: 'โอนเงิน',
    status: 'จ่ายแล้ว',
    note: '',
    attachments: [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialExpense) {
      setFormData(initialExpense);
    } else {
      setFormData({
        id: `EXP-${Date.now()}`,
        expenseNo: `EX-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('th-TH'),
        category: 'ค่าน้ำมัน',
        title: '',
        amount: 0,
        driver: drivers[0] || 'โจ้',
        vehiclePlate: '71-4521 กทม.',
        paymentMethod: 'โอนเงิน',
        status: 'จ่ายแล้ว',
        note: '',
        attachments: [],
      });
    }
  }, [initialExpense, isOpen, drivers]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const att: DocumentAttachment = {
          id: `ATT-EXP-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: (ev.target?.result as string) || '',
          uploadedAt: new Date().toLocaleString('th-TH'),
        };
        setFormData((prev) => ({
          ...prev,
          attachments: [...prev.attachments, att],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveAttachment = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('กรุณากรอกรายการค่าใช้จ่าย');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {initialExpense ? 'แก้ไขรายการค่าใช้จ่าย' : 'บันทึกค่าใช้จ่ายใหม่'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              บันทึกยอดเงิน หมวดหมู่ พร้อมแนบไฟล์สลิปหรือใบเสร็จ
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">เลขที่เอกสาร / บิล</label>
              <input
                type="text"
                required
                value={formData.expenseNo}
                onChange={(e) => setFormData({ ...formData, expenseNo: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">วันที่จ่ายเงิน *</label>
              <input
                type="text"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="04/09/2569"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">หมวดหมู่ค่าใช้จ่าย *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white cursor-pointer font-medium text-slate-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">จำนวนเงิน (บาท) *</label>
              <input
                type="number"
                step="any"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="2086.50"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-right focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">รายการ / รายละเอียด *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="เช่น ค่าคืนตู้ลาน 127 หรือ ค่าน้ำมัน ปตท. บางปู"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">คนขับ / ผู้เบิกจ่าย</label>
              <input
                type="text"
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                placeholder="โจ้"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">ทะเบียนรถ</label>
              <input
                type="text"
                value={formData.vehiclePlate}
                onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                placeholder="71-4521 กทม."
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">วิธีการชำระ</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl bg-white"
              >
                <option value="โอนเงิน">โอนเงิน</option>
                <option value="เงินสด">เงินสด</option>
                <option value="บัตรน้ำมัน fleet card">บัตรน้ำมัน fleet card</option>
                <option value="ค้างจ่าย">ค้างจ่าย</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">หมายเหตุเพิ่มเติม</label>
            <textarea
              rows={2}
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="เช่น อ้างอิงเลขที่บิลลานตู้ หรือหักเคลียร์กับรอบก่อน..."
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Attachments Section */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-slate-800">
                  แนบไฟล์สลิป / ใบเสร็จรับเงิน ({formData.attachments.length} ไฟล์)
                </span>
              </div>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,application/pdf"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer text-xs font-semibold text-purple-700 hover:text-purple-900 bg-white border border-purple-200 hover:bg-purple-50 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                + เลือกไฟล์แนบ
              </button>
            </div>

            {formData.attachments.length === 0 ? (
              <div className="p-3 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-[11px]">
                ยังไม่มีไฟล์แนบ กด "+ เลือกไฟล์แนบ" เพื่ออัปโหลดรูปถ่ายสลิปหรือบิลใบเสร็จ
              </div>
            ) : (
              <div className="space-y-1.5">
                {formData.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="font-medium text-slate-800 truncate max-w-[240px]">
                        {att.name}
                      </span>
                      <span className="text-slate-400">({(att.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="cursor-pointer px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-xl transition-all shadow-xs"
            >
              บันทึกค่าใช้จ่าย
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
