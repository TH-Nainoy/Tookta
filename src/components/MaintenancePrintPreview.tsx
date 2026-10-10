import React from 'react';
import { MaintenanceRecord } from '../types/fleetOps';
import { CompanySettings } from '../types/billing';
import { formatCurrency, formatInteger } from '../utils/formatters';
import { thaiBahtText } from '../utils/thaiBahtText';
import { X, Printer, Wrench, AlertTriangle } from 'lucide-react';

interface MaintenancePrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  record?: MaintenanceRecord | null;
  recordsList?: MaintenanceRecord[];
  company: CompanySettings;
}

export const MaintenancePrintPreview: React.FC<MaintenancePrintPreviewProps> = ({
  isOpen,
  onClose,
  record,
  recordsList = [],
  company,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSingle = !!record;
  const listToPrint = isSingle ? [record!] : recordsList;
  const totalCost = listToPrint.reduce((s, r) => s + r.totalCost, 0);
  const totalParts = listToPrint.reduce((s, r) => s + r.partsCost, 0);
  const totalLabor = listToPrint.reduce((s, r) => s + r.laborCost, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[96vh]">
        {/* Top Control Bar */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">
              {isSingle ? 'พิมพ์ใบประวัติการซ่อมบำรุงประจำรถ' : 'พิมพ์รายงานประวัติการซ่อมบำรุงกองรถ'}
            </span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
              {isSingle ? record?.recordNo : `${listToPrint.length} รายการ`}
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
                      🛠️
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
                      ฝ่ายยานพาหนะและซ่อมบำรุง · โทร: {company.phone}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-extrabold text-slate-900 tracking-wide uppercase">
                    {isSingle ? 'ใบประวัติการซ่อมบำรุง' : 'รายงานการซ่อมบำรุง'}
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold tracking-wider">
                    {isSingle ? 'VEHICLE MAINTENANCE RECORD' : 'FLEET MAINTENANCE LOGBOOK'}
                  </div>
                  <div className="mt-3 space-y-1 text-right text-[11px]">
                    <div>
                      <span className="text-slate-400">เลขที่บันทึก:</span>{' '}
                      <span className="font-mono font-bold text-slate-900">
                        {isSingle ? record?.recordNo : `RPT-MT-${new Date().toISOString().slice(0, 10)}`}
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

              {/* Case 1: Single Record Voucher */}
              {isSingle && record && (
                <div className="my-6 space-y-5">
                  {/* Vehicle & Service Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">ทะเบียนรถหัวลาก</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">{record.vehiclePlate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">เลขไมล์ขณะเข้าซ่อม</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {formatInteger(record.odometer)} กม.
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">วันที่เข้าซ่อม</span>
                      <span className="font-medium text-slate-800">{record.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">พนักงานขับรถ</span>
                      <span className="font-medium text-slate-800">{record.driver}</span>
                    </div>
                  </div>

                  {/* Repair Specifications */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                    <div className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                      <span className="font-bold text-slate-800 text-xs">
                        ประเภท: <span className="text-purple-900">{record.category}</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        อู่/ศูนย์บริการ: <strong>{record.garageName}</strong>
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {record.title}
                    </div>
                    {record.description && (
                      <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                        รายละเอียดชิ้นส่วน/การซ่อม: {record.description}
                      </div>
                    )}
                  </div>

                  {/* Cost Summary Box */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <span className="font-bold text-slate-800 text-xs block border-b border-slate-200 pb-1.5">
                      สรุปค่าใช้จ่ายการซ่อมบำรุง (Cost Breakdown)
                    </span>
                    <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-slate-500 block text-[11px]">ค่าอะไหล่และอุปกรณ์:</span>
                        <span className="font-mono font-semibold text-slate-800">
                          ฿{formatCurrency(record.partsCost)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">ค่าแรงช่าง:</span>
                        <span className="font-mono font-semibold text-slate-800">
                          ฿{formatCurrency(record.laborCost)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[11px]">รวมค่าใช้จ่ายทั้งสิ้น:</span>
                        <span className="font-mono font-bold text-purple-950 text-base">
                          ฿{formatCurrency(record.totalCost)}
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-purple-900 pt-2 border-t border-slate-200">
                      จำนวนเงินตัวอักษร: <strong>({thaiBahtText(record.totalCost)})</strong>
                    </div>
                  </div>

                  {/* Next Due Service Alert */}
                  {(record.nextDueOdometer || record.nextDueDate) && (
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-700" />
                        <span className="font-semibold text-amber-950">
                          กำหนดการตรวจเช็กระยะรอบถัดไป (Next Due Service):
                        </span>
                      </div>
                      <div className="font-mono font-bold text-amber-900">
                        {record.nextDueOdometer && `${formatInteger(record.nextDueOdometer)} กม.`}
                        {record.nextDueDate && ` (ภายใน ${record.nextDueDate})`}
                      </div>
                    </div>
                  )}

                  {/* Attachments Note */}
                  {record.attachments && record.attachments.length > 0 && (
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-[11px]">
                      <span className="font-semibold text-slate-700 block mb-1">
                        เอกสารหลักฐานแนบ ({record.attachments.length} ไฟล์):
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                        {record.attachments.map((att) => (
                          <li key={att.id} className="truncate">
                            {att.name} (ขนาด {(att.size / 1024).toFixed(0)} KB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Case 2: Multi-Item Logbook Report */}
              {!isSingle && (
                <div className="my-6 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">
                      รายการประวัติการซ่อมบำรุงทั้งหมด ({listToPrint.length} รายการ)
                    </span>
                    <span className="text-slate-500">
                      รวมค่าซ่อมบำรุง: <strong className="text-slate-900 font-mono">฿{formatCurrency(totalCost)}</strong>
                    </span>
                  </div>

                  <div className="overflow-hidden border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                          <th className="py-2 px-3 text-center w-10">ลำดับ</th>
                          <th className="py-2 px-3">เลขที่ / วันที่</th>
                          <th className="py-2 px-3">ทะเบียน / ไมล์</th>
                          <th className="py-2 px-3">ประเภท & รายการ</th>
                          <th className="py-2 px-3">อู่ / ศูนย์บริการ</th>
                          <th className="py-2 px-3 text-right">ค่าอะไหล่</th>
                          <th className="py-2 px-3 text-right">ค่าแรง</th>
                          <th className="py-2 px-3 text-right">รวมสุทธิ (฿)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {listToPrint.map((it, idx) => (
                          <tr key={it.id}>
                            <td className="py-2 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                            <td className="py-2 px-3 whitespace-nowrap font-mono">
                              <div>{it.recordNo}</div>
                              <div className="text-[10px] text-slate-400">{it.date}</div>
                            </td>
                            <td className="py-2 px-3 whitespace-nowrap">
                              <div className="font-mono font-bold text-slate-900">{it.vehiclePlate}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{formatInteger(it.odometer)} กม.</div>
                            </td>
                            <td className="py-2 px-3">
                              <div className="font-semibold text-purple-950">{it.category}</div>
                              <div className="text-[11px] text-slate-700">{it.title}</div>
                            </td>
                            <td className="py-2 px-3 text-slate-600">{it.garageName}</td>
                            <td className="py-2 px-3 text-right font-mono text-slate-600 tabular-nums">
                              ฿{formatCurrency(it.partsCost)}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-slate-600 tabular-nums">
                              ฿{formatCurrency(it.laborCost)}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                              ฿{formatCurrency(it.totalCost)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 font-bold border-t border-slate-200">
                          <td colSpan={7} className="py-2.5 px-3 text-right">รวมค่าซ่อมบำรุงทั้งสิ้น:</td>
                          <td className="py-2.5 px-3 text-right font-mono text-purple-950 text-sm">
                            ฿{formatCurrency(totalCost)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl text-xs flex justify-between items-center">
                    <span className="text-purple-800 font-medium">รวมตัวอักษร:</span>
                    <span className="font-bold text-purple-950">({thaiBahtText(totalCost)})</span>
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
                  ( {isSingle ? record?.driver : '................................................'} )
                </div>
                <div className="text-[10px] text-slate-500">พนักงานขับรถผู้ส่งซ่อม</div>
                <div className="text-[10px] text-slate-400 mt-0.5">วันที่ ..... / ..... / ..........</div>
              </div>

              <div>
                <div className="h-10 flex items-end justify-center">
                  <div className="w-36 border-b border-dashed border-slate-400" />
                </div>
                <div className="font-medium text-slate-800 mt-2">
                  ( {isSingle ? record?.garageName : '................................................'} )
                </div>
                <div className="text-[10px] text-slate-500">ช่างผู้ดำเนินการ / หัวหน้าช่างอู่</div>
                <div className="text-[10px] text-slate-400 mt-0.5">วันที่ ..... / ..... / ..........</div>
              </div>

              <div>
                <div className="h-10 flex items-end justify-center">
                  <div className="w-36 border-b border-dashed border-slate-400" />
                </div>
                <div className="font-medium text-slate-800 mt-2">
                  ( ................................................ )
                </div>
                <div className="text-[10px] text-slate-500">ผู้จัดการฝ่ายยานพาหนะ / ตรวจรับงาน</div>
                <div className="text-[10px] text-slate-400 mt-0.5">วันที่ ..... / ..... / ..........</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
