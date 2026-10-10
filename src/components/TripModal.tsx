import React, { useState, useEffect } from 'react';
import { TripRecord } from '../types/logistics';
import { X, Check, Calculator } from 'lucide-react';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trip: TripRecord) => void;
  initialTrip?: TripRecord | null;
}

const COMMON_ROUTES = [
  'PAT - สายไหม 73',
  'PAT - บางปู (หัวลาก)',
  'สายไหม 73 - บ้านบึง',
  'PAT - ตำหรุ บางพลี',
  'PAT - สายไหม 67',
];

const COMMON_DEPOTS = ['127', 'TID km.18', 'SMART', 'STAR km.9', 'BCDS', 'UNICON', 'CIMC LKB', 'BC 2'];

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTrip,
}) => {
  const [formData, setFormData] = useState<Partial<TripRecord>>({
    date: '28/09/2569',
    driver: 'โจ้',
    route: 'PAT - สายไหม 73',
    depot: '127',
    containerNo: '',
    size: '40\'',
    shift: 'ส่งเช้า',
    qty: 1,
    freightFee: 6000,
    otherFee: 0,
    depotFee: 1500,
    advancePaid: 6000,
    pendingBalance: 1500,
    paymentDate: '',
    company: 'AIM',
    note: '',
  });

  useEffect(() => {
    if (initialTrip) {
      setFormData(initialTrip);
    } else {
      setFormData({
        date: '28/09/2569',
        driver: 'โจ้',
        route: 'PAT - สายไหม 73',
        depot: '127',
        containerNo: '',
        size: '40\'',
        shift: 'ส่งเช้า',
        qty: 1,
        freightFee: 6000,
        otherFee: 0,
        depotFee: 1500,
        advancePaid: 6000,
        pendingBalance: 1500,
        paymentDate: '',
        company: 'AIM',
        note: '',
      });
    }
  }, [initialTrip, isOpen]);

  if (!isOpen) return null;

  // Auto calculate pending balance suggestion: (Freight + Other - Advance) + DepotFee or custom
  const handleAutoCalc = () => {
    const freight = Number(formData.freightFee) || 0;
    const other = Number(formData.otherFee) || 0;
    const depot = Number(formData.depotFee) || 0;
    const advance = Number(formData.advancePaid) || 0;
    
    // In this logistics sheet, if advance == freight, pending is usually the depot fee + other
    const calculated = Math.max(0, freight + other + depot - advance);
    setFormData((prev) => ({ ...prev, pendingBalance: calculated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.route || !formData.containerNo) {
      alert('กรุณากรอกเส้นทางและเบอร์ตู้ให้ครบถ้วน');
      return;
    }

    const newTrip: TripRecord = {
      id: formData.id || `TRIP-${Date.now()}`,
      date: formData.date || '01/09/2569',
      driver: formData.driver || 'โจ้',
      route: formData.route,
      depot: formData.depot || '-',
      containerNo: formData.containerNo.trim().toUpperCase(),
      size: (formData.size as any) || '40\'',
      shift: formData.shift || 'ส่งเช้า',
      qty: Number(formData.qty) || 1,
      freightFee: Number(formData.freightFee) || 0,
      otherFee: Number(formData.otherFee) || 0,
      depotFee: Number(formData.depotFee) || 0,
      advancePaid: Number(formData.advancePaid) || 0,
      pendingBalance: Number(formData.pendingBalance) || 0,
      paymentDate: formData.paymentDate || '',
      company: formData.company || 'AIM',
      note: formData.note || '',
    };

    onSave(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {initialTrip ? 'แก้ไขข้อมูลเที่ยววิ่ง' : 'บันทึกเที่ยววิ่งคอนเทนเนอร์ใหม่'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              กรอกรายละเอียดเที่ยววิ่ง บัญชีค่ารถ และค่าคืนตู้
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
          {/* Row 1: Date & Driver & Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                วันที่วิ่ง (วว/ดด/ปปปป)
              </label>
              <input
                type="text"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="04/09/2569"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                คนขับ / งาน
              </label>
              <input
                type="text"
                required
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                placeholder="โจ้"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                รอบงาน (สถานะ)
              </label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none bg-white cursor-pointer"
              >
                <option value="ส่งเช้า">ส่งเช้า</option>
                <option value="ส่งเลย">ส่งเลย</option>
                <option value="ส่งบ่าย">ส่งบ่าย</option>
              </select>
            </div>
          </div>

          {/* Row 2: Route & Shortcuts */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">
              สถานที่ / เส้นทางวิ่ง
            </label>
            <input
              type="text"
              required
              value={formData.route}
              onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              placeholder="PAT - สายไหม 73"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none font-medium"
            />
            {/* Shortcuts */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 self-center">เส้นทางบ่อย:</span>
              {COMMON_ROUTES.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setFormData({ ...formData, route: r })}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[11px] cursor-pointer transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Container Number, Size, Depot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                เบอร์ตู้คอนเทนเนอร์
              </label>
              <input
                type="text"
                required
                value={formData.containerNo}
                onChange={(e) => setFormData({ ...formData, containerNo: e.target.value })}
                placeholder="CAAU4768383"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                ขนาดตู้
              </label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none bg-white cursor-pointer"
              >
                <option value="40'">ตู้ 40' (ยาว)</option>
                <option value="20'">ตู้ 20' (สั้น)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                ลานคืนตู้
              </label>
              <input
                type="text"
                value={formData.depot}
                onChange={(e) => setFormData({ ...formData, depot: e.target.value })}
                placeholder="127, TID km.18, SMART"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Depot shortcuts */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] text-slate-400 self-center">ลานคืนตู้บ่อย:</span>
            {COMMON_DEPOTS.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setFormData({ ...formData, depot: d })}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[11px] cursor-pointer transition-colors"
              >
                {d}
              </button>
            ))}
          </div>

          {/* Section: Financial Fields */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">บัญชีค่ารถ & ค่าคืนตู้</span>
              <button
                type="button"
                onClick={handleAutoCalc}
                className="cursor-pointer text-[11px] text-purple-700 hover:text-purple-900 flex items-center gap-1 font-medium"
              >
                <Calculator className="w-3 h-3" />
                คำนวณยอดค้างจ่ายอัตโนมัติ
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  ค่ารถ (฿)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.freightFee}
                  onChange={(e) => setFormData({ ...formData, freightFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl font-mono text-right"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  อื่นๆ (฿)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.otherFee}
                  onChange={(e) => setFormData({ ...formData, otherFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl font-mono text-right"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  ค่าคืนตู้ (฿)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.depotFee}
                  onChange={(e) => setFormData({ ...formData, depotFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl font-mono text-right text-rose-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  เบิกแล้ว (฿)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.advancePaid}
                  onChange={(e) => setFormData({ ...formData, advancePaid: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl font-mono text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60">
              <div>
                <label className="block text-amber-800 font-medium mb-1">
                  ค้างจ่าย (฿)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.pendingBalance}
                  onChange={(e) => setFormData({ ...formData, pendingBalance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-amber-200 rounded-xl font-mono text-right font-bold text-amber-800 bg-amber-50/50"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  ชำระค่ารถวันที่ / สถานะ
                </label>
                <input
                  type="text"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  placeholder="30/9/2569 หรือ หมายเหตุหักจ่าย"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  บริษัทลูกค้า
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="AIM"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">
              หมายเหตุ / เลขที่งาน (Job Reference)
            </label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="เช่น RE6909-01 หรือ หักกับร่มเกล้า..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
