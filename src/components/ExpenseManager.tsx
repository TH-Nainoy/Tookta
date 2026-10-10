import React, { useState } from 'react';
import { ExpenseRecord, ExpenseCategory } from '../types/fleetOps';
import { formatCurrency } from '../utils/formatters';
import {
  DollarSign,
  Plus,
  Paperclip,
  Edit3,
  Trash2,
  Filter,
  Search,
  Fuel,
  Warehouse,
  CheckCircle2,
  Clock,
  FileText,
  Boxes,
  Printer,
} from 'lucide-react';

interface ExpenseManagerProps {
  expenses: ExpenseRecord[];
  onOpenAddModal: () => void;
  onEditExpense: (expense: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
  onPrintExpense?: (expense: ExpenseRecord) => void;
  onPrintAllExpenses?: (expenses: ExpenseRecord[]) => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  expenses,
  onOpenAddModal,
  onEditExpense,
  onDeleteExpense,
  onPrintExpense,
  onPrintAllExpenses,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingAttachment, setViewingAttachment] = useState<ExpenseRecord | null>(null);

  const filtered = expenses.filter((exp) => {
    if (selectedCategory !== 'ทั้งหมด' && exp.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        exp.title.toLowerCase().includes(q) ||
        exp.expenseNo.toLowerCase().includes(q) ||
        exp.driver.toLowerCase().includes(q) ||
        exp.vehiclePlate.toLowerCase().includes(q) ||
        exp.note.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalAmount = filtered.reduce((s, e) => s + e.amount, 0);
  const totalFuel = filtered.filter((e) => e.category === 'ค่าน้ำมัน').reduce((s, e) => s + e.amount, 0);
  const totalDepot = filtered.filter((e) => e.category === 'ค่าลานคืนตู้/ยกตู้').reduce((s, e) => s + e.amount, 0);
  const totalToll = filtered.filter((e) => e.category === 'ค่าทางด่วน').reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800">
              บันทึกค่าใช้จ่าย & แนบไฟล์หลักฐาน
            </h3>
            <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-medium border border-rose-200/60">
              {expenses.length} รายการ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            จัดการค่าใช้จ่ายเที่ยววิ่ง ค่าน้ำมัน ค่าคืนตู้ ค่าทางด่วน สามารถแก้ไขและแนบไฟล์สลิป/บิลได้ทุกรายการ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onPrintAllExpenses && (
            <button
              type="button"
              onClick={() => onPrintAllExpenses(filtered)}
              className="cursor-pointer px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
              title="พิมพ์รายงานสรุปค่าใช้จ่ายทั้งหมด"
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
            + บันทึกค่าใช้จ่ายใหม่
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/70 via-white to-red-50/40 border border-rose-100/80">
          <span className="text-xs font-medium text-rose-700">ค่าใช้จ่ายรวมทั้งหมด</span>
          <div className="text-2xl font-bold text-slate-800 mt-1 tabular-nums font-mono">
            ฿{formatCurrency(totalAmount)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            จาก {filtered.length} รายการที่เลือก
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 border border-amber-100/80">
          <div className="flex items-center justify-between text-xs font-medium text-amber-800">
            <span>ค่าน้ำมันเชื้อเพลิง</span>
            <Fuel className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-1 tabular-nums font-mono">
            ฿{formatCurrency(totalFuel)}
          </div>
          <div className="text-[11px] text-amber-800/80 mt-1">
            {totalAmount > 0 ? ((totalFuel / totalAmount) * 100).toFixed(1) : 0}% ของค่าใช้จ่าย
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/40 border border-purple-100/80">
          <div className="flex items-center justify-between text-xs font-medium text-purple-700">
            <span>ค่าลานคืนตู้ / ยกตู้</span>
            <Boxes className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900 mt-1 tabular-nums font-mono">
            ฿{formatCurrency(totalDepot)}
          </div>
          <div className="text-[11px] text-purple-600 mt-1">
            ค่าธรรมเนียมลานตู้คอนเทนเนอร์
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/70 via-white to-blue-50/40 border border-sky-100/80">
          <span className="text-xs font-medium text-sky-700">ค่าทางด่วน & อื่นๆ</span>
          <div className="text-2xl font-bold text-slate-800 mt-1 tabular-nums font-mono">
            ฿{formatCurrency(totalToll)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ค่าผ่านทางและการเบิกจ่ายหน้างาน
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">หมวดหมู่:</span>
          {['ทั้งหมด', 'ค่าน้ำมัน', 'ค่าลานคืนตู้/ยกตู้', 'ค่าทางด่วน', 'ค่าเบี้ยเลี้ยงคนขับ', 'อื่นๆ'].map((cat) => (
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

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อบิล, เลขที่, คนขับ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800 text-sm">
            รายการบันทึกค่าใช้จ่ายทั้งหมด ({filtered.length})
          </h4>
          <span className="text-xs text-slate-400">
            สามารถกดปุ่มดินสอเพื่อแก้ไข และกดไอคอนคลิปเพื่อดูไฟล์แนบ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/70">
                <th className="py-3 px-4 font-semibold whitespace-nowrap">เลขที่บิล / วันที่</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">หมวดหมู่</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">รายการ / รายละเอียด</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">คนขับ / ทะเบียน</th>
                <th className="py-3 px-3 font-semibold text-right whitespace-nowrap">จำนวนเงิน (฿)</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">วิธีชำระ</th>
                <th className="py-3 px-3 font-semibold text-center whitespace-nowrap">ไฟล์แนบ</th>
                <th className="py-3 px-4 font-semibold text-center whitespace-nowrap">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    ไม่พบรายการค่าใช้จ่ายที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : (
                filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-800">{exp.expenseNo}</div>
                      <div className="text-[11px] text-slate-400">{exp.date}</div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-slate-700 font-medium">{exp.category}</span>
                    </td>

                    <td className="py-3 px-3 text-slate-800 font-medium max-w-[260px] truncate" title={exp.title}>
                      <div>{exp.title}</div>
                      {exp.note && (
                        <div className="text-[11px] text-slate-400 font-normal truncate">
                          {exp.note}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{exp.driver}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{exp.vehiclePlate}</div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-800 tabular-nums whitespace-nowrap">
                      ฿{formatCurrency(exp.amount)}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                      {exp.paymentMethod}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {exp.attachments && exp.attachments.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setViewingAttachment(exp)}
                          className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200/80 transition-colors"
                        >
                          <Paperclip className="w-3 h-3" />
                          {exp.attachments.length} ไฟล์
                        </button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {onPrintExpense && (
                          <button
                            type="button"
                            onClick={() => onPrintExpense(exp)}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                            title="พิมพ์ใบสำคัญจ่าย"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="text-[11px]">พิมพ์</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onEditExpense(exp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-colors"
                          title="แก้ไขค่าใช้จ่าย"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteExpense(exp.id)}
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
                  ไฟล์แนบค่าใช้จ่าย: {viewingAttachment.expenseNo}
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
