import React from 'react';
import { ReceiptDocument, CompanySettings } from '../types/billing';
import { formatCurrency } from '../utils/formatters';
import { thaiBahtText } from '../utils/thaiBahtText';
import { X, Printer, Download, CheckCircle, FileText, Image as ImageIcon, ShieldCheck } from 'lucide-react';

interface ReceiptPrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptDocument;
  company: CompanySettings;
}

export const ReceiptPrintPreview: React.FC<ReceiptPrintPreviewProps> = ({
  isOpen,
  onClose,
  receipt,
  company,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[96vh]">
        {/* Top Control Bar (Hidden during printing) */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">ตัวอย่างก่อนพิมพ์ (Print Preview - ใบเสร็จรับเงิน)</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
              {receipt.receiptNo}
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
            {/* Document Header */}
            <div>
              <div className="flex justify-between items-start gap-6 border-b border-slate-200 pb-6">
                {/* Company Lockup */}
                <div className="flex items-start gap-4">
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt="Logo"
                      className="w-16 h-16 object-contain rounded-lg border border-slate-100 p-1 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xl shrink-0">
                      🚚
                    </div>
                  )}
                  <div>
                    <h1 className="text-base font-bold text-slate-900 leading-tight">
                      {company.name}
                    </h1>
                    {company.nameEn && (
                      <p className="text-[11px] text-slate-500">{company.nameEn}</p>
                    )}
                    <p className="text-[11px] text-slate-600 mt-1 max-w-md leading-relaxed">
                      {company.address}
                    </p>
                    <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-x-3">
                      <span>เลขประจำตัวผู้เสียภาษี: <strong className="font-mono text-slate-700">{company.taxId}</strong> ({company.branch})</span>
                      <span>โทร: {company.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Document Title Badge */}
                <div className="text-right shrink-0">
                  <div className="text-xl font-extrabold text-slate-900 tracking-wide uppercase">
                    ใบเสร็จรับเงิน
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium tracking-wider">
                    RECEIPT / TAX INVOICE
                  </div>
                  <div className="mt-3 space-y-1 text-right text-[11px]">
                    <div>
                      <span className="text-slate-400">เลขที่เอกสาร:</span>{' '}
                      <span className="font-mono font-bold text-slate-800">{receipt.receiptNo}</span>
                    </div>
                    {receipt.invoiceNo && (
                      <div>
                        <span className="text-slate-400">อ้างอิงใบแจ้งหนี้:</span>{' '}
                        <span className="font-mono text-slate-700">{receipt.invoiceNo}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400">วันที่ออก:</span>{' '}
                      <span className="font-medium text-slate-700">{receipt.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">สถานะ:</span>{' '}
                      <span className="font-medium text-emerald-700">{receipt.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info Box */}
              <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    ลูกค้า / ผู้ว่าจ้าง (CUSTOMER)
                  </span>
                  <div className="font-bold text-slate-900 text-sm">
                    {receipt.customerName}
                  </div>
                  <div className="text-[11px] text-slate-600 max-w-lg leading-relaxed">
                    {receipt.customerAddress || '-'}
                  </div>
                </div>
                <div className="text-left sm:text-right space-y-1 text-[11px] shrink-0">
                  <div>
                    <span className="text-slate-400">เลขประจำตัวผู้เสียภาษี:</span>{' '}
                    <span className="font-mono font-semibold text-slate-800">
                      {receipt.customerTaxId || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">สาขา:</span>{' '}
                    <span>{receipt.customerBranch || 'สำนักงานใหญ่'}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mt-4 overflow-hidden border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-600 border-b border-slate-200">
                      <th className="py-2.5 px-3 text-center w-12 font-semibold">ลำดับ</th>
                      <th className="py-2.5 px-3 font-semibold">รายการบริการขนส่ง</th>
                      <th className="py-2.5 px-3 font-semibold">เบอร์ตู้คอนเทนเนอร์</th>
                      <th className="py-2.5 px-3 text-center font-semibold">จำนวน</th>
                      <th className="py-2.5 px-3 text-right font-semibold">ราคาต่อหน่วย</th>
                      <th className="py-2.5 px-3 text-right font-semibold">จำนวนเงิน (฿)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {receipt.items.map((item, idx) => (
                      <tr key={item.id} className="text-slate-700">
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-slate-900">{item.description}</div>
                          {item.route && (
                            <div className="text-[11px] text-slate-500">เส้นทาง: {item.route}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">
                          {item.containerNo || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center tabular-nums">
                          {item.qty}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-900 tabular-nums">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation & Thai Words */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Left: Thai Baht Text & Payment info */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                    <span className="text-[10px] text-purple-700 block font-medium">
                      จำนวนเงินตัวอักษร (THAI BAHT IN WORDS):
                    </span>
                    <span className="font-semibold text-purple-900 text-xs mt-0.5 block">
                      ({thaiBahtText(receipt.totalPayable)})
                    </span>
                  </div>

                  {company.bankAccount && (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-600 space-y-1">
                      <div className="font-semibold text-slate-700">ช่องทางการชำระเงิน:</div>
                      <div>ธนาคาร: <strong>{company.bankName}</strong></div>
                      <div>เลขที่บัญชี: <strong className="font-mono text-slate-900">{company.bankAccount}</strong></div>
                      <div>ชื่อบัญชี: {company.bankAccountName || company.name}</div>
                    </div>
                  )}

                  {receipt.notes && (
                    <div className="text-[11px] text-slate-500 italic">
                      หมายเหตุ: {receipt.notes}
                    </div>
                  )}
                </div>

                {/* Right: Calculations Summary */}
                <div className="sm:col-span-5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>รวมเงินค่าบริการ (Subtotal):</span>
                    <span className="font-mono tabular-nums">฿{formatCurrency(receipt.subtotal)}</span>
                  </div>

                  {receipt.vatAmount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>ภาษีมูลค่าเพิ่ม (VAT {receipt.vatRate}%):</span>
                      <span className="font-mono tabular-nums">฿{formatCurrency(receipt.vatAmount)}</span>
                    </div>
                  )}

                  {receipt.withholdingTaxAmount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>หัก ภาษี ณ ที่จ่าย {receipt.withholdingTaxRate}% (WHT):</span>
                      <span className="font-mono text-rose-700 tabular-nums">
                        -฿{formatCurrency(receipt.withholdingTaxAmount)}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                    <span>ยอดรับชำระสุทธิ (Net Total):</span>
                    <span className="font-mono text-indigo-700 tabular-nums">
                      ฿{formatCurrency(receipt.totalPayable)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attachments Section in preview (No-print) */}
              {receipt.attachments && receipt.attachments.length > 0 && (
                <div className="mt-4 no-print p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700 block mb-2">
                    ไฟล์เอกสารแนบเพิ่มเติม ({receipt.attachments.length} ไฟล์):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {receipt.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-2 text-[11px]"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-medium text-slate-700 truncate max-w-[180px]">
                          {att.name}
                        </span>
                        <span className="text-slate-400">({(att.size / 1024).toFixed(0)} KB)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Document Signatures (Bottom) */}
            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="h-12 flex items-end justify-center">
                  <div className="w-48 border-b border-dashed border-slate-400" />
                </div>
                <div className="text-[11px] font-medium text-slate-800 mt-2">
                  ( ................................................................ )
                </div>
                <div className="text-[10px] text-slate-500">
                  ผู้รับเงิน / ผู้มีอำนาจลงนาม
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  วันที่ ..... / ..... / ..........
                </div>
              </div>

              <div>
                <div className="h-12 flex items-end justify-center">
                  <div className="w-48 border-b border-dashed border-slate-400" />
                </div>
                <div className="text-[11px] font-medium text-slate-800 mt-2">
                  ( ................................................................ )
                </div>
                <div className="text-[10px] text-slate-500">
                  ผู้จ่ายเงิน / ผู้รับเอกสาร
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  วันที่ ..... / ..... / ..........
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
