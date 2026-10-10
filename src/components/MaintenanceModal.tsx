import React, { useState, useEffect, useRef } from 'react';
import { MaintenanceRecord, MaintenanceCategory } from '../types/fleetOps';
import { DocumentAttachment } from '../types/billing';
import { X, Wrench, Upload, Trash2, Paperclip, FileText } from 'lucide-react';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: MaintenanceRecord) => void;
  initialRecord?: MaintenanceRecord | null;
  drivers: string[];
}

const CATEGORIES: MaintenanceCategory[] = [
  'เปลี่ยนถ่ายน้ำมันเครื่อง',
  'เปลี่ยนยาง/สลับยาง',
  'ระบบเบรก/ผ้าเบรก',
  'ระบบไฟ/แบตเตอรี่',
  'ตรวจเช็กระยะ/ต่อ พ.ร.บ.',
  'ซ่อมช่วงล่าง/แหนบ',
  'ระบบหางลาก/หัวลาก',
  'อื่นๆ',
];

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRecord,
  drivers,
}) => {
  const [formData, setFormData] = useState<MaintenanceRecord>({
    id: '',
    recordNo: '',
    date: '30/09/2569',
    vehiclePlate: '71-4521 กทม.',
    driver: 'โจ้',
    odometer: 145000,
    category: 'เปลี่ยนถ่ายน้ำมันเครื่อง',
    title: '',
    description: '',
    garageName: 'ศูนย์บริการ HINO',
    partsCost: 0,
    laborCost: 0,
    totalCost: 0,
    nextDueOdometer: 155000,
    nextDueDate: '',
    status: 'เสร็จสิ้น',
    notes: '',
    attachments: [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialRecord) {
      setFormData(initialRecord);
    } else {
      setFormData({
        id: `MNT-${Date.now()}`,
        recordNo: `MT-6909${Math.floor(10 + Math.random() * 90)}`,
        date: new Date().toLocaleDateString('th-TH'),
        vehiclePlate: '71-4521 กทม.',
        driver: drivers[0] || 'โจ้',
        odometer: 145000,
        category: 'เปลี่ยนถ่ายน้ำมันเครื่อง',
        title: '',
        description: '',
        garageName: 'ศูนย์บริการฮีโน่ บางนา-ตราด',
        partsCost: 0,
        laborCost: 0,
        totalCost: 0,
        nextDueOdometer: 155000,
        nextDueDate: '',
        status: 'เสร็จสิ้น',
        notes: '',
        attachments: [],
      });
    }
  }, [initialRecord, isOpen, drivers]);

  if (!isOpen) return null;

  const handleCostChange = (parts: number, labor: number) => {
    setFormData((prev) => ({
      ...prev,
      partsCost: parts,
      laborCost: labor,
      totalCost: parts + labor,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const att: DocumentAttachment = {
          id: `ATT-MNT-${Date.now()}-${Math.random()}`,
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
      alert('กรุณากรอกหัวข้อการซ่อมบำรุง');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {initialRecord ? 'แก้ไขประวัติการซ่อมบำรุง' : 'บันทึกประวัติการซ่อมบำรุงรถใหม่'}
              </h3>
              <p className="text-xs text-slate-500">
                บันทึกการซ่อม เปลี่ยนถ่ายน้ำมันเครื่อง และอะไหล่พร้อมแนบใบเสร็จ
              </p>
            </div>
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
          {/* Row 1: Code, Date, Plate, Odometer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <div>
              <label className="block text-slate-600 font-medium mb-1">เลขที่บันทึก *</label>
              <input
                type="text"
                required
                value={formData.recordNo}
                onChange={(e) => setFormData({ ...formData, recordNo: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">วันที่เข้าซ่อม *</label>
              <input
                type="text"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-center"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">ทะเบียนรถ</label>
              <input
                type="text"
                value={formData.vehiclePlate}
                onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">เลขไมล์ปัจจุบัน (กม.)</label>
              <input
                type="number"
                value={formData.odometer}
                onChange={(e) => setFormData({ ...formData, odometer: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono font-medium text-right"
              />
            </div>
          </div>

          {/* Row 2: Category & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">ประเภทการซ่อมบำรุง *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-purple-900"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-medium mb-1">หัวข้อการซ่อมบำรุง *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="เช่น เปลี่ยนถ่ายน้ำมันเครื่องกึ่งสังเคราะห์ + กรองโซล่า"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          {/* Garage & Driver */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-medium mb-1">ชื่ออู่ / ศูนย์บริการ</label>
              <input
                type="text"
                value={formData.garageName}
                onChange={(e) => setFormData({ ...formData, garageName: e.target.value })}
                placeholder="เช่น ศูนย์บริการฮีโน่ บางนา-ตราด หรือ อู่ช่างเล็ก บางพลี"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">พนักงานขับรถ</label>
              <input
                type="text"
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">รายละเอียดชิ้นส่วนและอาการ</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="ระบุรหัสอะไหล่ เบอร์น้ำมันเครื่อง หรือรายการที่ช่างทำการแก้ไข..."
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Cost Breakdown */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
            <span className="font-semibold text-slate-800 block">สรุปค่าใช้จ่ายการซ่อมบำรุง</span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">ค่าอะไหล่ (฿)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.partsCost}
                  onChange={(e) => handleCostChange(parseFloat(e.target.value) || 0, formData.laborCost)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl font-mono text-right"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">ค่าแรงช่าง (฿)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.laborCost}
                  onChange={(e) => handleCostChange(formData.partsCost, parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl font-mono text-right"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">รวมค่าใช้จ่ายสุทธิ (฿)</label>
                <input
                  type="number"
                  readOnly
                  value={formData.totalCost}
                  className="w-full px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-xl font-mono font-bold text-purple-900 text-right"
                />
              </div>
            </div>
          </div>

          {/* Next Due Tracker */}
          <div className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-100 space-y-2">
            <span className="font-semibold text-purple-950 block">กำหนดการตรวจเช็กระยะถัดไป (Next Due Service)</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">กำหนดเลขไมล์ครั้งถัดไป (กม.)</label>
                <input
                  type="number"
                  value={formData.nextDueOdometer}
                  onChange={(e) => setFormData({ ...formData, nextDueOdometer: parseInt(e.target.value, 10) || 0 })}
                  placeholder="เช่น 155000"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl font-mono text-right"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">หรือวันที่ครบกำหนด</label>
                <input
                  type="text"
                  value={formData.nextDueDate}
                  onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                  placeholder="เช่น 20/11/2569"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-center"
                />
              </div>
            </div>
          </div>

          {/* File Attachments */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-slate-800">
                  แนบใบเสร็จอู่ / ใบกำกับ / รูปถ่ายอะไหล่ ({formData.attachments.length} ไฟล์)
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
                ยังไม่มีไฟล์แนบ กด "+ เลือกไฟล์แนบ" เพื่ออัปโหลดใบเสร็จค่าซ่อมหรือรูปอะไหล่
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
              บันทึกประวัติการซ่อม
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
