import React from 'react';
import { ReceiptDocument, CompanySettings } from '../types/billing';
import { formatCurrency } from '../utils/formatters';
import {
  FileText,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Printer,
  Paperclip,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building,
} from 'lucide-react';

interface ReceiptManagerProps {
  receipts: ReceiptDocument[];
  onOpenCreateModal: () => void;
  onEditReceipt: (receipt: ReceiptDocument) => void;
  onPreviewReceipt: (receipt: ReceiptDocument) => void;
  onDeleteReceipt: (id: string) => void;
  companySettings: CompanySettings;
  onOpenCompanySettings: () => void;
}

export const ReceiptManager: React.FC<ReceiptManagerProps> = ({
  receipts,
  onOpenCreateModal,
  onEditReceipt,
  onPreviewReceipt,
  onDeleteReceipt,
  companySettings,
  onOpenCompanySettings,
}) => {
  const totalBilled = receipts.reduce((s, r) => s + r.totalPayable, 0);
  const totalWht = receipts.reduce((s, r) => s + r.withholdingTaxAmount, 0);
  const totalConfirmed = receipts.reduce((s, r) => s + (r.confirmationAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800">
              ระบบใบเสร็จรับเงิน & ใบแจ้งหนี้ขนส่ง
            </h3>
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium border border-purple-200/60">
              {receipts.length} เอกสาร
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ออกใบเสร็จรับเงินอย่างเป็นทางการ ตรวจสอบยอดเงินยืนยัน แนบไฟล์ประกอบ และสั่งพิมพ์ A4
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCompanySettings}
            className="cursor-pointer px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5 text-slate-500" />
            ตั้งค่าบริษัท & โลโก้
          </button>

          <button
            type="button"
            onClick={onOpenCreateModal}
            className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            + ออกใบเสร็จรับเงินใหม่
          </button>
        </div>
      </div>

      {/* Mini KPI Cards for Receipts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 border border-indigo-100/80">
          <span className="text-xs font-medium text-indigo-700">ยอดเงินในใบเสร็จรวม (Net Billed)</span>
          <div className="text-2xl font-bold text-slate-800 mt-1 tabular-nums font-mono">
            ฿{formatCurrency(totalBilled)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            หัก ณ ที่จ่ายสะสม: ฿{formatCurrency(totalWht)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 border border-amber-100/80">
          <div className="flex items-center justify-between text-xs font-medium text-amber-800">
            <span>ยอดตรวจสอบยืนยัน (เก็บในระบบ)</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-1 tabular-nums font-mono">
            ฿{formatCurrency(totalConfirmed)}
          </div>
          <div className="text-[11px] text-amber-800/80 mt-1">
            * เก็บไว้ในระบบอย่างเดียว ไม่ปรากฏในเอกสารใบเสร็จ
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 border border-emerald-100/80">
          <span className="text-xs font-medium text-emerald-800">ข้อมูลบริษัทผู้จัดพิมพ์</span>
          <div className="font-semibold text-slate-800 mt-1 truncate text-xs">
            {companySettings.name}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
            <span>เลขผู้เสียภาษี: {companySettings.taxId || '-'}</span>
            <span aria-hidden="true">·</span>
            <span>{companySettings.logoUrl ? 'มีโลโก้แล้ว ✓' : 'ยังไม่มีโลโก้'}</span>
          </div>
        </div>
      </div>

      {/* Receipts Table List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800 text-sm">
            รายการเอกสารใบเสร็จทั้งหมด
          </h4>
          <span className="text-xs text-slate-400">
            คลิกดูตัวอย่างเพื่อตรวจสอบก่อนสั่งพิมพ์
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/70">
                <th className="py-3 px-4 font-semibold">เลขที่ใบเสร็จ</th>
                <th className="py-3 px-3 font-semibold">วันที่</th>
                <th className="py-3 px-3 font-semibold">ลูกค้า / ผู้ว่าจ้าง</th>
                <th className="py-3 px-3 font-semibold text-center">รายการ</th>
                <th className="py-3 px-3 font-semibold text-right">ยอดรับสุทธิ (฿)</th>
                <th className="py-3 px-3 font-semibold text-right">ยอดในระบบ (฿)</th>
                <th className="py-3 px-3 font-semibold text-center">ไฟล์แนบ</th>
                <th className="py-3 px-3 font-semibold text-center">สถานะ</th>
                <th className="py-3 px-4 font-semibold text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {receipts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    ยังไม่มีรายการใบเสร็จรับเงิน กดปุ่ม "+ ออกใบเสร็จรับเงินใหม่" ด้านบนเพื่อเริ่มสร้าง
                  </td>
                </tr>
              ) : (
                receipts.map((rc) => (
                  <tr key={rc.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {rc.receiptNo}
                      {rc.invoiceNo && (
                        <div className="text-[10px] text-slate-400 font-normal">
                          {rc.invoiceNo}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {rc.date}
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-800 max-w-[200px] truncate">
                      {rc.customerName}
                    </td>

                    <td className="py-3 px-3 text-center text-slate-600">
                      {rc.items.length} รายการ
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      ฿{formatCurrency(rc.totalPayable)}
                    </td>

                    {/* Confirmation amount: strictly system-only */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                      {rc.confirmationAmount > 0 ? (
                        <div title={`${rc.confirmationNote || 'ยอดตรวจสอบภายใน'} (เก็บในระบบอย่างเดียว)`}>
                          <span className="text-amber-800 font-semibold">
                            ฿{formatCurrency(rc.confirmationAmount)}
                          </span>
                          <span className="text-[10px] text-amber-600 block">
                            (ในระบบเท่านั้น)
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Attachments */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {rc.attachments && rc.attachments.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          <Paperclip className="w-3 h-3" />
                          {rc.attachments.length} ไฟล์
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {rc.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onPreviewReceipt(rc)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                          title="ดูตัวอย่างก่อนพิมพ์"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-[11px]">พิมพ์</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditReceipt(rc)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-colors"
                          title="แก้ไขเอกสาร"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteReceipt(rc.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="ลบเอกสาร"
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
