import React, { useState } from 'react';
import { JobOrder, JobOrderStatus } from '../types/fleetOps';
import { CompanySettings } from '../types/billing';
import { formatCurrency } from '../utils/formatters';
import {
  Truck,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Boxes,
  MapPin,
} from 'lucide-react';

interface JobOrderManagerProps {
  orders: JobOrder[];
  onOpenCreateModal: () => void;
  onEditOrder: (order: JobOrder) => void;
  onPreviewOrder: (order: JobOrder) => void;
  onDeleteOrder: (id: string) => void;
  onConvertToTrip?: (order: JobOrder) => void;
}

export const JobOrderManager: React.FC<JobOrderManagerProps> = ({
  orders,
  onOpenCreateModal,
  onEditOrder,
  onPreviewOrder,
  onDeleteOrder,
  onConvertToTrip,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = orders.filter((ord) => {
    if (selectedStatus !== 'ทั้งหมด' && ord.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        ord.orderNo.toLowerCase().includes(q) ||
        ord.containerNo.toLowerCase().includes(q) ||
        ord.driver.toLowerCase().includes(q) ||
        ord.deliveryLocation.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const activeCount = orders.filter((o) => o.status === 'กำลังวิ่งงาน').length;
  const pendingCount = orders.filter((o) => o.status === 'รอดำเนินการ').length;
  const completedCount = orders.filter((o) => o.status === 'คืนตู้สำเร็จ').length;
  const totalFreight = orders.reduce((s, o) => s + (o.freightRate || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800">
              ใบสั่งงานขนส่ง (Transport Job Orders)
            </h3>
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium border border-purple-200/60">
              {orders.length} ใบสั่งงาน
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ออกใบสั่งงานคนขับ นัดหมายเวลาเข้ารับตู้ ส่งสินค้า และลานคืนตู้เปล่า พร้อมพิมพ์เอกสาร A4
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          + ออกใบสั่งงานใหม่
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 border border-indigo-100/80">
          <span className="text-xs font-medium text-indigo-700">ใบสั่งงานทั้งหมด</span>
          <div className="text-2xl font-bold text-slate-800 mt-1 tabular-nums font-mono">
            {orders.length} <span className="text-xs font-normal text-slate-500">งาน</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            มูลค่ารวม ฿{formatCurrency(totalFreight)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 border border-amber-100/80">
          <div className="flex items-center justify-between text-xs font-medium text-amber-800">
            <span>กำลังวิ่งงาน (Active)</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-1 tabular-nums font-mono">
            {activeCount} <span className="text-xs font-normal text-amber-700">คัน</span>
          </div>
          <div className="text-[11px] text-amber-800/80 mt-1">
            อยู่ระหว่างนำส่งหรือคืนตู้
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 border border-purple-100/80">
          <span className="text-xs font-medium text-purple-700">รอดำเนินการ (Pending)</span>
          <div className="text-2xl font-bold text-purple-900 mt-1 tabular-nums font-mono">
            {pendingCount} <span className="text-xs font-normal text-purple-600">งาน</span>
          </div>
          <div className="text-[11px] text-purple-600 mt-1">
            รอเข้ารับตู้ที่ท่าเรือ/ลาน
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 border border-emerald-100/80">
          <span className="text-xs font-medium text-emerald-800">คืนตู้สำเร็จ (Done)</span>
          <div className="text-2xl font-bold text-emerald-900 mt-1 tabular-nums font-mono">
            {completedCount} <span className="text-xs font-normal text-emerald-700">งาน</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            ปิดงานเรียบร้อยแล้ว
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">สถานะงาน:</span>
          {['ทั้งหมด', 'กำลังวิ่งงาน', 'รอดำเนินการ', 'ส่งสินค้าแล้ว', 'คืนตู้สำเร็จ'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${
                selectedStatus === st
                  ? 'bg-purple-100 text-purple-900 border border-purple-200/70 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่, เบอร์ตู้, ปลายทาง..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
      </div>

      {/* Job Orders List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800 text-sm">
            รายการใบสั่งงานขนส่ง ({filtered.length})
          </h4>
          <span className="text-xs text-slate-400">
            คลิกปุ่มพิมพ์เพื่อเปิดใบสั่งงาน A4 อย่างเป็นทางการ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/70">
                <th className="py-3 px-4 font-semibold whitespace-nowrap">เลขที่ / วันที่</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">เวลานัดหมาย</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">ลูกค้า / ผู้ว่าจ้าง</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">คนขับ / ทะเบียน</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">เบอร์ตู้ & ขนาด</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">เส้นทางนำส่ง / ลานคืน</th>
                <th className="py-3 px-3 font-semibold text-right whitespace-nowrap">ค่าจ้าง (฿)</th>
                <th className="py-3 px-3 font-semibold text-center whitespace-nowrap">สถานะ</th>
                <th className="py-3 px-4 font-semibold text-center whitespace-nowrap">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    ไม่พบใบสั่งงานขนส่งที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">{ord.orderNo}</div>
                      <div className="text-[11px] text-slate-400">{ord.date}</div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{ord.appointmentTime}</div>
                      <div className="text-[11px] text-slate-400">{ord.appointmentDate}</div>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-800 max-w-[180px] truncate" title={ord.customerName}>
                      {ord.customerName}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{ord.driver}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{ord.vehiclePlate}</div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono font-medium text-slate-900">{ord.containerNo}</div>
                      <div className="text-[11px] text-slate-400">ตู้ {ord.containerSize} · ซีล {ord.sealNo}</div>
                    </td>

                    <td className="py-3 px-3 max-w-[220px]">
                      <div className="font-medium text-slate-800 truncate" title={ord.deliveryLocation}>
                        {ord.deliveryLocation}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate" title={ord.returnDepot}>
                        คืน: {ord.returnDepot}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      ฿{formatCurrency(ord.freightRate)}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${
                          ord.status === 'คืนตู้สำเร็จ'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : ord.status === 'กำลังวิ่งงาน'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-purple-50 text-purple-800 border-purple-200'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onPreviewOrder(ord)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                          title="พิมพ์ใบสั่งงาน"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-[11px]">พิมพ์</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditOrder(ord)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-colors"
                          title="แก้ไขใบสั่งงาน"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteOrder(ord.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="ลบใบสั่งงาน"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
