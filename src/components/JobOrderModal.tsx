import React, { useState, useEffect } from 'react';
import { JobOrder, JobOrderStatus } from '../types/fleetOps';
import { Customer } from '../types/billing';
import { X, Eye, Truck, MapPin, Calendar, Clock, ShieldCheck } from 'lucide-react';

interface JobOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: JobOrder) => void;
  onPreview: (order: JobOrder) => void;
  initialOrder?: JobOrder | null;
  customers: Customer[];
  drivers: string[];
}

const COMMON_PICKUPS = [
  'ท่าเรือกรุงเทพ (PAT คลองเตย)',
  'ท่าเรือแหลมฉบัง (LCIT / TIPS)',
  'ลานตู้ลาดกระบัง (ICD ลาดกระบัง)',
];

const COMMON_DELIVERIES = [
  'คลังสินค้าสายไหม 73 กรุงเทพฯ',
  'นิคมอุตสาหกรรมบางปู สมุทรปราการ',
  'คลังสินค้าตำหรุ บางพลี',
  'นิคมอมตะซิตี้ ชลบุรี / บ้านบึง',
  'สายไหม 67 กรุงเทพฯ',
];

const COMMON_DEPOTS = ['ลาน 127 ท้ายบ้าน', 'ลาน TID km.18', 'ลาน SMART', 'ลาน BCDS', 'ลาน UNICON', 'ลาน CIMC LKB'];

export const JobOrderModal: React.FC<JobOrderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onPreview,
  initialOrder,
  customers,
  drivers,
}) => {
  const [formData, setFormData] = useState<JobOrder>({
    id: '',
    orderNo: '',
    date: '30/09/2569',
    appointmentDate: '30/09/2569',
    appointmentTime: '08:30 น.',
    customerName: '',
    driver: 'โจ้',
    driverPhone: '089-123-4567',
    vehiclePlate: '71-4521 กทม.',
    containerNo: '',
    containerSize: '40\'',
    sealNo: '',
    cargoType: 'สินค้าทั่วไป',
    weightKg: 18000,
    pickupLocation: 'ท่าเรือกรุงเทพ (PAT คลองเตย)',
    deliveryLocation: 'คลังสินค้าสายไหม 73 กรุงเทพฯ',
    returnDepot: 'ลาน 127 ท้ายบ้าน',
    freightRate: 6000,
    specialInstructions: 'ส่งงานรอบเช้า ระวังสินค้าเปียกชื้น ตรวจสอบซีลก่อนเปิดตู้',
    status: 'กำลังวิ่งงาน',
    notes: '',
    attachments: [],
  });

  useEffect(() => {
    if (initialOrder) {
      setFormData(initialOrder);
    } else {
      const defaultCust = customers[0]?.name || 'บริษัท เอไอเอ็ม โลจิสติกส์ อินเตอร์เนชั่นแนล จำกัด';
      setFormData({
        id: `WO-${Date.now()}`,
        orderNo: `WO-6909-${Math.floor(10 + Math.random() * 90)}`,
        date: new Date().toLocaleDateString('th-TH'),
        appointmentDate: new Date().toLocaleDateString('th-TH'),
        appointmentTime: '08:00 น.',
        customerName: defaultCust,
        driver: drivers[0] || 'โจ้',
        driverPhone: '089-123-4567',
        vehiclePlate: '71-4521 กทม.',
        containerNo: '',
        containerSize: '40\'',
        sealNo: `SL-${Math.floor(100000 + Math.random() * 900000)}`,
        cargoType: 'สินค้าทั่วไป / ชิ้นส่วนอะไหล่',
        weightKg: 18000,
        pickupLocation: 'ท่าเรือกรุงเทพ (PAT คลองเตย)',
        deliveryLocation: 'คลังสินค้าสายไหม 73 กรุงเทพฯ',
        returnDepot: 'ลาน 127 ท้ายบ้าน',
        freightRate: 6000,
        specialInstructions: 'ส่งงานตรงเวลา ตรวจเช็กลมยางและระบบเบรกก่อนออกเดินทาง',
        status: 'รอดำเนินการ',
        notes: '',
        attachments: [],
      });
    }
  }, [initialOrder, isOpen, customers, drivers]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.deliveryLocation || !formData.containerNo) {
      alert('กรุณากรอกเบอร์ตู้และสถานที่ส่งสินค้า');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-3xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {initialOrder ? 'แก้ไขใบสั่งงานขนส่ง' : 'สร้างใบสั่งงานขนส่งใหม่ (Transport Job Order)'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              จ่ายงานขนส่งตู้คอนเทนเนอร์ นัดหมายเวลา และกำหนดเส้นทาง
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview(formData)}
              className="cursor-pointer px-3.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              ดูตัวอย่างก่อนพิมพ์
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Row 1: Order No, Date, Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <div>
              <label className="block text-slate-600 font-medium mb-1">เลขที่ใบสั่งงาน *</label>
              <input
                type="text"
                required
                value={formData.orderNo}
                onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">วันที่ออกใบสั่งงาน</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-center"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">เวลานัดหมายส่ง</label>
              <input
                type="text"
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                placeholder="08:30 น."
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-center font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">สถานะงาน</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium text-purple-800 cursor-pointer"
              >
                <option value="รอดำเนินการ">รอดำเนินการ</option>
                <option value="กำลังวิ่งงาน">กำลังวิ่งงาน</option>
                <option value="ส่งสินค้าแล้ว">ส่งสินค้าแล้ว</option>
                <option value="คืนตู้สำเร็จ">คืนตู้สำเร็จ</option>
                <option value="ยกเลิก">ยกเลิก</option>
              </select>
            </div>
          </div>

          {/* Customer & Driver Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-800 block">ผู้ว่าจ้าง / ลูกค้า</span>
              <div>
                <label className="block text-slate-500 mb-1">ชื่อบริษัทลูกค้า</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-medium"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-800 block">พนักงานขับรถ & รถหัวลาก</span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">คนขับ</label>
                  <input
                    type="text"
                    value={formData.driver}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">เบอร์โทร</label>
                  <input
                    type="text"
                    value={formData.driverPhone}
                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">ทะเบียนรถ</label>
                  <input
                    type="text"
                    value={formData.vehiclePlate}
                    onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Container & Cargo Details */}
          <div className="p-3.5 rounded-xl border border-slate-200 space-y-3">
            <span className="font-semibold text-slate-800 block">ข้อมูลตู้คอนเทนเนอร์ & สินค้า</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">เบอร์ตู้คอนเทนเนอร์ *</label>
                <input
                  type="text"
                  required
                  value={formData.containerNo}
                  onChange={(e) => setFormData({ ...formData, containerNo: e.target.value.toUpperCase() })}
                  placeholder="CAAU4768383"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ขนาดตู้</label>
                <select
                  value={formData.containerSize}
                  onChange={(e) => setFormData({ ...formData, containerSize: e.target.value as any })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="40'">ตู้ 40' (ยาว)</option>
                  <option value="20'">ตู้ 20' (สั้น)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">เบอร์ซีลล็อค (Seal No.)</label>
                <input
                  type="text"
                  value={formData.sealNo}
                  onChange={(e) => setFormData({ ...formData, sealNo: e.target.value })}
                  placeholder="ML-998812"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ค่าจ้างขนส่ง (฿)</label>
                <input
                  type="number"
                  value={formData.freightRate}
                  onChange={(e) => setFormData({ ...formData, freightRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono font-bold text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">ประเภทสินค้า</label>
                <input
                  type="text"
                  value={formData.cargoType}
                  onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                  placeholder="เช่น ชิ้นส่วนอะไหล่ / อิเล็กทรอนิกส์"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">น้ำหนักสินค้า (กก.)</label>
                <input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-right"
                />
              </div>
            </div>
          </div>

          {/* Route & Routing Steps */}
          <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-3">
            <span className="font-semibold text-purple-950 block">เส้นทางและจุดส่งสินค้า</span>

            <div className="space-y-2.5">
              <div>
                <label className="block text-slate-600 font-medium mb-1">1. จุดรับตู้เปล่า / ท่าเรือ</label>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {COMMON_PICKUPS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, pickupLocation: p })}
                      className="text-[10px] bg-white hover:bg-purple-100 border border-purple-200/80 text-purple-700 px-2 py-0.5 rounded cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">2. สถานที่ส่งสินค้า / คลังปลายทาง *</label>
                <input
                  type="text"
                  required
                  value={formData.deliveryLocation}
                  onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                />
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {COMMON_DELIVERIES.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFormData({ ...formData, deliveryLocation: d })}
                      className="text-[10px] bg-white hover:bg-purple-100 border border-purple-200/80 text-purple-700 px-2 py-0.5 rounded cursor-pointer"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">3. ลานคืนตู้เปล่า (Return Depot)</label>
                <input
                  type="text"
                  value={formData.returnDepot}
                  onChange={(e) => setFormData({ ...formData, returnDepot: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {COMMON_DEPOTS.map((dp) => (
                    <button
                      key={dp}
                      type="button"
                      onClick={() => setFormData({ ...formData, returnDepot: dp })}
                      className="text-[10px] bg-white hover:bg-purple-100 border border-purple-200/80 text-purple-700 px-2 py-0.5 rounded cursor-pointer"
                    >
                      {dp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">ข้อกำหนดพิเศษ & คำสั่งความปลอดภัย</label>
            <textarea
              rows={2}
              value={formData.specialInstructions}
              onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
              placeholder="เช่น ส่งงานรอบเช้าก่อน 09:00 น. ระวังสินค้าเปียกชื้น สวมใส่อุปกรณ์ PPE"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onPreview(formData)}
              className="cursor-pointer px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4 text-purple-600" />
              ดูตัวอย่างก่อนพิมพ์
            </button>

            <div className="flex items-center gap-2.5">
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
                บันทึกใบสั่งงาน
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
