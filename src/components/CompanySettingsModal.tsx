import React, { useState, useRef } from 'react';
import { CompanySettings } from '../types/billing';
import { X, Building, Upload, Image, Trash2, CheckCircle2 } from 'lucide-react';

interface CompanySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CompanySettings;
  onSave: (settings: CompanySettings) => void;
}

export const CompanySettingsModal: React.FC<CompanySettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ขนาดไฟล์โลโก้ต้องไม่เกิน 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        setFormData((prev) => ({ ...prev, logoUrl: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                ตั้งค่าข้อมูลบริษัท & อัปโหลดโลโก้
              </h3>
              <p className="text-xs text-slate-500">
                ข้อมูลหัวเอกสารใบเสร็จรับเงิน ใบแจ้งหนี้ และบัญชีรับโอนเงิน
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
          {/* Logo Upload Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <label className="block text-slate-700 font-semibold mb-2">
              โลโก้บริษัท (Company Logo)
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Company Logo Preview"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 text-center p-2">
                    <Image className="w-6 h-6 mb-1 text-slate-300" />
                    <span className="text-[10px]">ยังไม่มีโลโก้</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    เลือกรูปภาพโลโก้ (PNG/JPG)
                  </button>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="cursor-pointer px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-medium flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      ลบโลโก้
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  แนะนำภาพพื้นหลังโปร่งใส (.png) อัตราส่วนสี่เหลี่ยมจัตุรัสหรือแนวนอน ขนาดไม่เกิน 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                ชื่อบริษัทภาษาไทย *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="บริษัท ทวีโชค ขนส่ง โลจิสติกส์ จำกัด"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                ชื่อบริษัทภาษาอังกฤษ
              </label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="Thaweechoke Transport & Logistics Co., Ltd."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                เลขประจำตัวผู้เสียภาษี (13 หลัก)
              </label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                placeholder="0105562098471"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                สาขา
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                placeholder="สำนักงานใหญ่"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              ที่อยู่บริษัท (สำหรับพิมพ์หัวบิล)
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="เลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                เบอร์โทรศัพท์
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="02-740-9889, 081-998-1234"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                อีเมล
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="billing@thaweechoke-logistics.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Bank Transfer Details */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
            <span className="font-semibold text-slate-700 block">ข้อมูลบัญชีธนาคารสำหรับรับชำระเงิน</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">ธนาคาร</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="ธนาคารกสิกรไทย"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">เลขที่บัญชี</label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  placeholder="142-2-90876-1"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ชื่อบัญชี</label>
                <input
                  type="text"
                  value={formData.bankAccountName}
                  onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                  placeholder="บจก. ทวีโชค ขนส่ง โลจิสติกส์"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
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
              className="cursor-pointer px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-medium rounded-xl transition-all shadow-xs"
            >
              บันทึกการตั้งค่าบริษัท
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
