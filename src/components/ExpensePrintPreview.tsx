import React from 'react';
import { ExpenseRecord } from '../types/fleetOps';
import { CompanySettings } from '../types/billing';
import { formatCurrency } from '../utils/formatters';
import { thaiBahtText } from '../utils/thaiBahtText';
import { X, Printer, FileText, CheckCircle2 } from 'lucide-react';

interface ExpensePrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  // If expense is provided, print single payment voucher; if null, print expensesList report
  expense?: ExpenseRecord | null;
  expensesList?: ExpenseRecord[];
  company: CompanySettings;
}

export const ExpensePrintPreview: React.FC<ExpensePrintPreviewProps> = ({
  isOpen,
  onClose,
  expense,
  expensesList = [],
  company,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSingle = !!expense;
  const listToPrint = isSingle ? [expense!] : expensesList;
  const totalAmount = listToPrint.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[96vh]">
        {/* Top Control Bar */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">
              {isSingle ? 'พิมพ์ใบสำคัญจ่าย / ใบเบิกค่าใช้จ่าย' : 'พิมพ์รายงานสรุปค่าใช้จ่ายกองรถ'}
            </span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
              {isSingle ? expense?.expenseNo : `${listToPrint.length} รายการ`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              พิมพ์เอกสาร (Print / PDF)
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
                      โทร: {company.phone} · เลขผู้เสียภาษี: {company.taxId}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-extrabold text-slate-900 tracking-wide uppercase">
                    {isSingle ? 'ใบสำคัญจ่าย / ใบเบิกเงิน' : 'รายงานสรุปค่าใช้จ่าย'}
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold tracking-wider">
                    {isSingle ? 'PAYMENT / EXPENSE VOUCHER' : 'FLEET EXPENSE REPORT'}
                  </div>
                  <div className="mt-3 space-y-1 text-right text-[11px]">
                    <div>
                      <span className="text-slate-400">เลขที่เอกสาร:</span>{' '}
                      <span className="font-mono font-bold text-slate-900">
                        {isSingle ? expense?.expenseNo : `RPT-EXP-${new Date().toISOString().slice(0, 10)}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">วันที่พิมพ์:</span>{' '}
                      <span className="font-medium text-slate-700">
                        {new Date().toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Case 1: Single Expense Voucher */}
              {isSingle && expense && (
                <div className="my-6 space-y-5">
                  {/* Expense Meta Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">วันที่จ่ายเงิน</span>
                      <span className="font-medium text-slate-800">{expense.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">หมวดหมู่</span>
                      <span className="font-semibold text-purple-900">{expense.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">ผู้ขอเบิก / คนขับ</span>
                      <span className="font-medium text-slate-800">{expense.driver}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">ทะเบียนรถ</span>
                      <span className="font-mono font-bold text-slate-900">{expense.vehiclePlate}</span>
                    </div>
                  </div>

                  {/* Expense Details Box */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                    <div className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-800">รายละเอียดรายการค่าใช้จ่าย</span>
                      <span className="text-[11px] text-slate-500">วิธีชำระ: {expense.paymentMethod}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {expense.title}
                    </div>
                    {expense.note && (
                      <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        หมายเหตุ: {expense.note}
                      </div>
                    )}
                  </div>

                  {/* Financial Amount & Thai Words */}
                  <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div>
                      <span className="text-[11px] text-purple-800 font-medium block">
                        จำนวนเงินตัวอักษร:
                      </span>
                      <span className="font-bold text-purple-950 text-xs">
                        ({thaiBahtText(expense.amount)})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block">จำนวนเงินสุทธิ (Net Total)</span>
                      <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                        ฿{formatCurrency(expense.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Attachments Note */}
                  {expense.attachments && expense.attachments.length > 0 && (
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-[11px]">
                      <span className="font-semibold text-slate-700 block mb-1">
                        เอกสารหลักฐานแนบ ({expense.attachments.length} ไฟล์):
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                        {expense.attachments.map((att) => (
                          <li key={att.id} className="truncate">
                            {att.name} (ขนาด {(att.size / 1024).toFixed(0)} KB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Case 2: Multi-Item Expenses Summary Report */}
              {!isSingle && (
                <div className="my-6 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">
                      ตารางรายการค่าใช้จ่ายทั้งหมด ({listToPrint.length} รายการ)
                    </span>
                    <span className="text-slate-500">
                      ยอดรวมสุทธิ: <strong className="text-slate-900 font-mono">฿{formatCurrency(totalAmount)}</strong>
                    </span>
                  </div>

                  <div className="overflow-hidden border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                          <th className="py-2 px-3 text-center w-10">ลำดับ</th>
                          <th className="py-2 px-3">เลขที่ / วันที่</th>
                          <th className="py-2 px-3">หมวดหมู่</th>
                          <th className="py-2 px-3">รายการค่าใช้จ่าย</th>
                          <th className="py-2 px-3">คนขับ / ทะเบียน</th>
                          <th className="py-2 px-3 text-right">จำนวนเงิน (฿)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {listToPrint.map((it, idx) => (
                          <tr key={it.id}>
                            <td className="py-2 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                            <td className="py-2 px-3 whitespace-nowrap font-mono">
                              <div>{it.expenseNo}</div>
                              <div className="text-[10px] text-slate-400">{it.date}</div>
                            </td>
                            <td className="py-2 px-3 font-medium text-slate-700">{it.category}</td>
                            <td className="py-2 px-3">
                              <div className="font-medium text-slate-900">{it.title}</div>
                              {it.note && <div className="text-[10px] text-slate-400 truncate">{it.note}</div>}
                            </td>
                            <td className="py-2 px-3 whitespace-nowrap">
                              <div>{it.driver}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{it.vehiclePlate}</div>
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-medium text-slate-900 tabular-nums">
                              ฿{formatCurrency(it.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 font-bold border-t border-slate-200">
                          <td colSpan={5} className="py-2.5 px-3 text-right">รวมเงินค่าใช้จ่ายทั้งสิ้น:</td>
                          <td className="py-2.5 px-3 text-right font-mono text-purple-950 text-sm">
                            ฿{formatCurrency(totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl text-xs flex justify-between items-center">
                    <span className="text-purple-800 font-medium">รวมตัวอักษร:</span>
                    <span className="font-bold text-purple-950">({thaiBahtText(totalAmount)})</span>
                  </div>
                </div>
              )}
            </div>

            {/* Document Signatures (Bottom) */}
            <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-[11px]">
              <div>
                <div className="h-10 flex items-end justify-center">
                  <div className="w-36 border-b border-dashed border-slate-400" />
                </div>
                <div className="font-medium text-slate-800 mt-2">
                  ( {isSingle ? expense?.driver : '................................................'} )
                </div>
                <div className="text-[10px] text-slate-500">ผู้ขอเบิกจ่ายเงิน</div>
                <div className="text-[10px] text-slate-400 mt-0.5">วันที่ ..... / ..... / ..........</div>
              </div>

              <div>
                <div className="h-10 flex items-end justify-center">
                  <div className="w-36 border-b border-dashed border-slate-400" />
                </div>
                <div className="font-medium text-slate-800 mt-2">
                  ( ................................................ )
                </div>
                <div className="text-[10px] text-slate-500">ผู้ตรวจสอบเอกสาร / บัญชียานพาหนะ</div>
                <div className="text-[10px] text-slate-400 mt-0.5">วันที่ ..... / ..... / ..........</div>
              </div>

              <div>
                <div className="h-10 flex items-end justify-center">
                  <div className="w-36 border-b border-dashed border-slate-400" />
                </div>
                <div className="font-medium text-slate-800 mt-2">
                  ( ................................................ )
                </div>
                <div className="text-[10px] text-slate-500">ผู้อนุมัติจ่ายเงิน / กรรมการผู้มีอำนาจ</div>
                <div className="text-[10px] text-slate-400 mt-0.5">วันที่ ..... / ..... / ..........</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
