import React, { useState } from 'react';
import { MaintenanceRecord, MaintenanceCategory } from '../types/fleetOps';
import { formatCurrency, formatInteger } from '../utils/formatters';
import {
  Wrench,
  Plus,
  Paperclip,
  Edit3,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Gauge,
  AlertTriangle,
  FileText,
  Printer,
} from 'lucide-react';

interface MaintenanceManagerProps {
  records: MaintenanceRecord[];
  onOpenAddModal: () => void;
  onEditRecord: (record: MaintenanceRecord) => void;
  onDeleteRecord: (id: string) => void;
  onPrintRecord?: (record: MaintenanceRecord) => void;
  onPrintAllRecords?: (records: MaintenanceRecord[]) => void;
}

export const MaintenanceManager: React.FC<MaintenanceManagerProps> = ({
  records,
  onOpenAddModal,
  onEditRecord,
  onDeleteRecord,
  onPrintRecord,
  onPrintAllRecords,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingAttachment, setViewingAttachment] = useState<MaintenanceRecord | null>(null);

  const filtered = records.filter((rec) => {
    if (selectedCategory !== 'ทั้งหมด' && rec.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        rec.title.toLowerCase().includes(q) ||
        rec.recordNo.toLowerCase().includes(q) ||
        rec.garageName.toLowerCase().includes(q) ||
        rec.vehiclePlate.toLowerCase().includes(q) ||
        rec.driver.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalCost = records.reduce((s, r) => s + r.totalCost, 0);
  const totalParts = records.reduce((s, r) => s + r.partsCost, 0);
  const totalLabor = records.reduce((s, r) => s + r.laborCost, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800">
              ประวัติการซ่อมบำรุง & การดูแลรถหัวลาก
            </h3>
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium border border-purple-200/60">
              {records.length} รายการ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            บันทึกประวัติการเปลี่ยนถ่ายน้ำมันเครื่อง เปลี่ยนยาง เบรก ช่วงล่าง และเช็กระยะพร้อมแนบใบเสร็จ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onPrintAllRecords && (
            <button
              type="button"
              onClick={() => onPrintAllRecords(filtered)}
              className="cursor-pointer px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
              title="พิมพ์รายงานสรุปประวัติการซ่อมบำรุงทั้งหมด"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              พิมพ์รายงานสรุป ({filtered.length})
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAddModal}
            className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            + บันทึกประวัติการซ่อมใหม่
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 border border-indigo-100/80">
          <span className="text-xs font-medium text-indigo-700">ค่าซ่อมบำรุงรวมสุทธิ</span>
          <div className="text-2xl font-bold text-slate-800 mt-1 tabular-nums font-mono">
            ฿{formatCurrency(totalCost)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ค่าอะไหล่ ฿{formatCurrency(totalParts)} · ค่าแรง ฿{formatCurrency(totalLabor)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 border border-emerald-100/80">
          <span className="text-xs font-medium text-emerald-800">จำนวนครั้งที่เข้าซ่อม</span>
          <div className="text-2xl font-bold text-slate-800 mt-1 tabular-nums font-mono">
            {records.length} <span className="text-xs font-normal text-slate-500">ครั้ง</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            เฉลี่ย ฿{records.length > 0 ? formatCurrency(totalCost / records.length) : 0}/ครั้ง
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 border border-purple-100/80">
          <span className="text-xs font-medium text-purple-700">เลขไมล์ล่าสุดที่เช็ก</span>
          <div className="text-2xl font-bold text-purple-900 mt-1 tabular-nums font-mono">
            {records.length > 0 ? formatInteger(Math.max(...records.map((r) => r.odometer))) : '143,200'}{' '}
            <span className="text-xs font-normal text-purple-700">กม.</span>
          </div>
          <div className="text-[11px] text-purple-600 mt-1">
            รถหัวลาก 71-4521 กทม.
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 border border-amber-100/80">
          <div className="flex items-center justify-between text-xs font-medium text-amber-800">
            <span>กำหนดรอบเช็กถัดไป</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-1 tabular-nums font-mono">
            150,000 <span className="text-xs font-normal text-amber-700">กม.</span>
          </div>
          <div className="text-[11px] text-amber-800/80 mt-1">
            เหลืออีก ~6,800 กม. ถ่ายน้ำมันเครื่อง
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">ประเภท:</span>
          {['ทั้งหมด', 'เปลี่ยนถ่ายน้ำมันเครื่อง', 'เปลี่ยนยาง/สลับยาง', 'ระบบเบรก/ผ้าเบรก', 'ระบบไฟ/แบตเตอรี่', 'อื่นๆ'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-100 text-purple-900 border border-purple-200/70 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อรายการ, อู่, ทะเบียน..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800 text-sm">
            รายการประวัติการซ่อมบำรุง ({filtered.length})
          </h4>
          <span className="text-xs text-slate-400">
            แสดงประวัติ ค่าใช้จ่าย และกำหนดการเช็กระยะรอบถัดไป
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/70">
                <th className="py-3 px-4 font-semibold whitespace-nowrap">เลขที่ / วันที่</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">ประเภทการซ่อม</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">รายการ / รายละเอียด</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">เลขไมล์ (กม.)</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">อู่ / ศูนย์บริการ</th>
                <th className="py-3 px-3 font-semibold text-right whitespace-nowrap">ค่าอะไหล่ (฿)</th>
                <th className="py-3 px-3 font-semibold text-right whitespace-nowrap">ค่าแรง (฿)</th>
                <th className="py-3 px-3 font-semibold text-right whitespace-nowrap">รวมสุทธิ (฿)</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">รอบถัดไป</th>
                <th className="py-3 px-3 font-semibold text-center whitespace-nowrap">ไฟล์แนบ</th>
                <th className="py-3 px-4 font-semibold text-center whitespace-nowrap">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    ไม่พบรายการซ่อมบำรุงที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">{rec.recordNo}</div>
                      <div className="text-[11px] text-slate-400">{rec.date}</div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-medium text-purple-900">{rec.category}</span>
                    </td>

                    <td className="py-3 px-3 max-w-[240px]">
                      <div className="font-medium text-slate-800 truncate" title={rec.title}>
                        {rec.title}
                      </div>
                      {rec.description && (
                        <div className="text-[11px] text-slate-400 truncate" title={rec.description}>
                          {rec.description}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-slate-700 tabular-nums whitespace-nowrap">
                      {formatInteger(rec.odometer)} กม.
                    </td>

                    <td className="py-3 px-3 text-slate-600 max-w-[160px] truncate" title={rec.garageName}>
                      {rec.garageName}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums whitespace-nowrap">
                      ฿{formatCurrency(rec.partsCost)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums whitespace-nowrap">
                      ฿{formatCurrency(rec.laborCost)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      ฿{formatCurrency(rec.totalCost)}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                      {rec.nextDueOdometer ? (
                        <div className="text-amber-800 font-mono font-medium">
                          {formatInteger(rec.nextDueOdometer)} กม.
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                      {rec.nextDueDate && (
                        <div className="text-slate-400">{rec.nextDueDate}</div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {rec.attachments && rec.attachments.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setViewingAttachment(rec)}
                          className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200/80 transition-colors"
                        >
                          <Paperclip className="w-3 h-3" />
                          {rec.attachments.length} ไฟล์
                        </button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {onPrintRecord && (
                          <button
                            type="button"
                            onClick={() => onPrintRecord(rec)}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                            title="พิมพ์ใบประวัติการซ่อม"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="text-[11px]">พิมพ์</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onEditRecord(rec)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-colors"
                          title="แก้ไขประวัติ"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteRecord(rec.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="ลบรายการ"
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

      {/* Attachment Preview Modal */}
      {viewingAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  ไฟล์แนบการซ่อม: {viewingAttachment.recordNo}
                </h4>
                <p className="text-xs text-slate-500">{viewingAttachment.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingAttachment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {viewingAttachment.attachments.map((att) => (
                <div
                  key={att.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 text-xs truncate">
                    <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="font-medium text-slate-700 truncate">{att.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {(att.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              ))}
            </div>

            <div className="text-right pt-2">
              <button
                type="button"
                onClick={() => setViewingAttachment(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
