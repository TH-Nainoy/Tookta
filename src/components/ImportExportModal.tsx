import React, { useState } from 'react';
import { TripRecord } from '../types/logistics';
import { X, Download, Copy, Printer, Check, Upload, FileText } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: TripRecord[];
  onImportTrips: (newTrips: TripRecord[]) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  trips,
  onImportTrips,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate CSV text
  const generateCSV = (): string => {
    const headers = [
      'วันที่',
      'งาน',
      'สถานที่',
      'คืนตู้',
      'เบอร์ตู้',
      'ขนาด',
      'สถานะการขนส่ง',
      'จำนวน',
      'ค่ารถ',
      'อื่นๆ',
      'ค่าคืนตู้',
      'เบิก',
      'ค้างจ่าย',
      'ชำระค่ารถวันที่',
      'บริษัท',
      'หมายเหตุ',
    ];

    const rows = trips.map((t) => [
      t.date,
      t.driver,
      `"${t.route}"`,
      `"${t.depot}"`,
      t.containerNo,
      t.size,
      t.shift,
      t.qty,
      t.freightFee.toFixed(2),
      t.otherFee.toFixed(2),
      t.depotFee.toFixed(2),
      t.advancePaid.toFixed(2),
      t.pendingBalance.toFixed(2),
      `"${t.paymentDate}"`,
      `"${t.company}"`,
      `"${t.note}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const handleDownloadCSV = () => {
    const csvContent = generateCSV();
    // Add UTF-8 BOM so Excel opens Thai properly
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Logistics_Fleet_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(generateCSV());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleProcessImport = () => {
    try {
      setImportError(null);
      if (!importText.trim()) {
        setImportError('กรุณาวางข้อความ CSV ก่อนกดยืนยัน');
        return;
      }

      const lines = importText.trim().split(/\r?\n/);
      const parsed: TripRecord[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('เลือกวันที่') || line.startsWith('🚛') || line.startsWith('วันที่,งาน')) {
          continue; // skip headers
        }

        // Split CSV row with regex handling quotes
        const match = line.match(/(?:^|,)(?:"([^"]*)"|([^,]*))/g);
        if (!match || match.length < 5) continue;

        const cols = match.map((c) => {
          let s = c.startsWith(',') ? c.slice(1) : c;
          s = s.trim();
          if (s.startsWith('"') && s.endsWith('"')) {
            s = s.slice(1, -1);
          }
          return s.trim();
        });

        if (cols[0] && cols[0].includes('/')) {
          const date = cols[0];
          const driver = cols[1] || 'โจ้';
          const route = cols[2] || '';
          const depot = cols[3] || '-';
          const containerNo = cols[4] || '';
          const size = (cols[5] && cols[5].includes('20') ? '20\'' : '40\'') as any;
          const shift = cols[6] || 'ส่งเช้า';
          const qty = parseInt(cols[7], 10) || 1;
          const cleanNum = (str: string) => parseFloat(str?.replace(/,/g, '') || '0') || 0;
          const freightFee = cleanNum(cols[8]);
          const otherFee = cleanNum(cols[9]);
          const depotFee = cleanNum(cols[10]);
          const advancePaid = cleanNum(cols[11]);
          const pendingBalance = cleanNum(cols[12]);
          const paymentDate = cols[13] || '';
          const company = cols[14] || 'AIM';
          const note = cols[15] || '';

          parsed.push({
            id: `IMPORT-${Date.now()}-${i}`,
            date,
            driver,
            route,
            depot,
            containerNo,
            size,
            shift,
            qty,
            freightFee,
            otherFee,
            depotFee,
            advancePaid,
            pendingBalance,
            paymentDate,
            company,
            note,
          });
        }
      }

      if (parsed.length === 0) {
        setImportError('ไม่พบแถวข้อมูลที่สามารถนำเข้าได้ กรุณาตรวจสอบรูปแบบวันที่ เช่น 04/09/2569');
        return;
      }

      onImportTrips(parsed);
      setImportSuccess(`นำเข้าข้อมูลเรียบร้อยแล้วทั้งหมด ${parsed.length} รายการ`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setImportError('เกิดข้อผิดพลาดในการประมวลผล CSV: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                นำเข้าและส่งออกข้อมูลเที่ยววิ่ง
              </h3>
              <p className="text-xs text-slate-500">
                รองรับ Excel, CSV และพิมพ์รายงานสรุป
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-100 px-6 pt-3 gap-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`pb-2.5 cursor-pointer transition-colors ${
              activeTab === 'export'
                ? 'text-purple-700 border-b-2 border-purple-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ส่งออกข้อมูล (Export)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 cursor-pointer transition-colors ${
              activeTab === 'import'
                ? 'text-purple-700 border-b-2 border-purple-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            นำเข้าข้อมูลใหม่ (Import CSV)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 text-xs">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <p className="text-slate-600">
                คุณสามารถดาวน์โหลดข้อมูลตารางเที่ยววิ่งปัจจุบัน ({trips.length} รายการ) เป็นไฟล์ CSV ที่เปิดด้วย Microsoft Excel ได้ทันที โดยภาษาไทยไม่เป็นภาษาต่างดาว
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  className="cursor-pointer p-4 rounded-xl border border-purple-200/80 bg-purple-50/50 hover:bg-purple-100/60 flex flex-col items-center justify-center gap-2 text-purple-900 font-medium transition-all"
                >
                  <Download className="w-5 h-5 text-purple-600" />
                  <span>ดาวน์โหลด Excel / CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyClipboard}
                  className="cursor-pointer p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/60 flex flex-col items-center justify-center gap-2 text-slate-800 font-medium transition-all"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-slate-500" />
                  )}
                  <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกข้อความ CSV'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="cursor-pointer p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/60 flex flex-col items-center justify-center gap-2 text-slate-800 font-medium transition-all"
                >
                  <Printer className="w-5 h-5 text-slate-500" />
                  <span>พิมพ์รายงาน (Print)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-slate-600">
                วางข้อความ CSV จากตารางบันทึกเที่ยววิ่งของคุณลงในกล่องด้านล่างนี้:
              </p>
              <textarea
                rows={7}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="วันที่,งาน,สถานที่,คืนตู้,เบอร์ตู้,ขนาด,สถานะการขนส่ง,จำนวน,ค่ารถ,อื่นๆ,ค่าคืนตู้,เบิก,ค้างจ่าย,ชำระค่ารถวันที่,บริษัท,หมายเหตุ&#10;04/09/2569,โจ้,PAT - สายไหม 73,127,CAAU4768383,40',ส่งเช้า,1,6000.00,0.00,2086.50,6000.00,2086.50,6/9/2569,AIM,RE6909-01"
                className="w-full p-3 font-mono text-[11px] border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none bg-slate-50"
              />

              {importError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {importError}
                </div>
              )}

              {importSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                  {importSuccess}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleProcessImport}
                  className="cursor-pointer px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-xl transition-all shadow-xs"
                >
                  นำเข้าและอัปเดตตาราง
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
