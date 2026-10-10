import React from 'react';
import { JobOrder } from '../types/fleetOps';
import { CompanySettings } from '../types/billing';
import { formatCurrency } from '../utils/formatters';
import { X, Printer, Truck, MapPin, Calendar, Clock, ShieldCheck, CheckSquare } from 'lucide-react';

interface JobOrderPrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  order: JobOrder;
  company: CompanySettings;
}

export const JobOrderPrintPreview: React.FC<JobOrderPrintPreviewProps> = ({
  isOpen,
  onClose,
  order,
  company,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[96vh]">
        {/* Top Control Bar */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">ตัวอย่างพิมพ์ใบสั่งงานขนส่ง (Transport Job Order)</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
              {order.orderNo}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              พิมพ์ใบสั่งงาน (Print / PDF)
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas (A4 simulation) */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-md border border-slate-200/60 text-slate-800 text-xs flex flex-col justify-between print:shadow-none print:border-none print:p-0 print:m-0">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                <div className="flex items-start gap-4">
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt="Logo"
                      className="w-16 h-16 object-contain rounded-lg border border-slate-100 p-1 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xl shrink-0">
                      🚛
                    </div>
                  )}
                  <div>
                    <h1 className="text-base font-bold text-slate-900 leading-tight">
                      {company.name}
                    </h1>
                    <p className="text-[11px] text-slate-500">{company.nameEn}</p>
                    <p className="text-[11px] text-slate-600 mt-1 max-w-md">
                      {company.address}
                    </p>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      โทร: {company.phone}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-extrabold text-slate-900 tracking-wide uppercase">
                    ใบสั่งงานขนส่ง
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold tracking-wider">
                    TRANSPORT DISPATCH ORDER
                  </div>
                  <div className="mt-3 space-y-1 text-right text-[11px]">
                    <div>
                      <span className="text-slate-400">เลขที่ใบสั่งงาน:</span>{' '}
                      <span className="font-mono font-bold text-slate-900">{order.orderNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">วันที่ออกเอกสาร:</span>{' '}
                      <span className="font-medium text-slate-700">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">สถานะ:</span>{' '}
                      <span className="font-medium text-purple-700">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 1: Customer & Driver Appointment */}
              <div className="grid grid-cols-2 gap-4 my-5">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    ข้อมูลผู้ว่าจ้าง / ลูกค้า
                  </span>
                  <div className="font-bold text-slate-900 text-xs">
                    {order.customerName}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    เวลานัดหมายส่งสินค้า:{' '}
                    <strong className="text-slate-800 font-medium">
                      {order.appointmentDate} เวลา {order.appointmentTime}
                    </strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    พนักงานขับรถ & รถบรรทุก
                  </span>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">
                      {order.driver}
                    </span>
                    <span className="font-mono text-slate-600 text-[11px]">
                      โทร: {order.driverPhone || '-'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    ทะเบียนรถหัวลาก:{' '}
                    <strong className="font-mono text-slate-800 font-bold">
                      {order.vehiclePlate}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Grid 2: Container & Cargo Details */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <span className="font-bold text-slate-800 text-xs block border-b border-slate-100 pb-2">
                  รายละเอียดตู้คอนเทนเนอร์และสินค้า (Container & Cargo Specifications)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">เบอร์ตู้คอนเทนเนอร์:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {order.containerNo || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">ขนาดตู้:</span>
                    <span className="font-medium text-slate-800">
                      ตู้ {order.containerSize}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">เบอร์ซีลล็อคตู้:</span>
                    <span className="font-mono font-medium text-slate-800">
                      {order.sealNo || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">น้ำหนักสินค้า:</span>
                    <span className="font-mono text-slate-800">
                      {order.weightKg ? `${order.weightKg.toLocaleString()} กก.` : '-'}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 pt-1">
                  ประเภทสินค้า: <strong className="text-slate-800">{order.cargoType || 'สินค้าทั่วไป'}</strong>
                </div>
              </div>

              {/* Grid 3: Route & Depot Routing Steps */}
              <div className="my-5 p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-3">
                <span className="font-bold text-purple-950 text-xs block border-b border-purple-200/60 pb-1.5">
                  เส้นทางและขั้นตอนการวิ่งงาน (Route & Checkpoints)
                </span>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <span className="text-slate-500 text-[10px] block">จุดรับตู้เปล่า / ท่าเรือ (Pickup):</span>
                      <strong className="text-slate-900">{order.pickupLocation}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <span className="text-slate-500 text-[10px] block">สถานที่ส่งสินค้า / คลังปลายทาง (Delivery):</span>
                      <strong className="text-slate-900">{order.deliveryLocation}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <span className="text-slate-500 text-[10px] block">ลานคืนตู้เปล่า (Return Depot):</span>
                      <strong className="text-slate-900">{order.returnDepot}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Instructions & Safety Checklist */}
              {order.specialInstructions && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs">
                  <span className="font-bold text-amber-900 block mb-1">
                    ข้อกำหนดพิเศษ & คำสั่งความปลอดภัย:
                  </span>
                  <p className="text-amber-900 text-[11px] leading-relaxed">
                    {order.specialInstructions}
                  </p>
                </div>
              )}

              {/* Driver Pre-trip Checklist */}
              <div className="mt-4 p-3 rounded-xl border border-slate-200 bg-slate-50 text-[11px] text-slate-700">
                <span className="font-semibold text-slate-800 block mb-1.5">
                  รายการตรวจเช็คสภาพก่อนออกเดินทาง (Driver Inspection Checklist):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="flex items-center gap-1.5">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>ตรวจสภาพยางและลมยาง</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>ตรวจระบบเบรกและสายลม</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>ตรวจล็อกทวิสต์ล็อค 4 มุม</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>ตรวจซีลล็อคตู้ไม่ชำรุด</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-[11px]">
              <div>
                <div className="h-10 flex items-end justify-center">
                  <div className="w-32 border-b border-dashed border-slate-400" />
                </div>
                <div className="font-medium text-slate-800 mt-2">
                  ( ................................................. )
                </div>
                <div className="text-[10px] text-slate-500">ผู้จ่ายงานขนส่ง / Dispatcher</div>
              </div>

              <div>
                <div className="h-10 flex items-end justify-center">
                  <div className="w-32 border-b border-dashed border-slate-400" />
                </div>
                <div className="font-medium text-slate-800 mt-2">
                  ( {order.driver} )
                </div>
                <div className="text-[10px] text-slate-500">พนักงานขับรถรับทราบงาน</div>
              </div>

              <div>
                <div className="h-10 flex items-end justify-center">
                  <div className="w-32 border-b border-dashed border-slate-400" />
                </div>
                <div className="font-medium text-slate-800 mt-2">
                  ( ................................................. )
                </div>
                <div className="text-[10px] text-slate-500">ผู้รับสินค้าปลายทางเซ็นรับ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
