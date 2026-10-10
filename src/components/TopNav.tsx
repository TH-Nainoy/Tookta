import React from 'react';
import { Truck, Plus, Upload, Download, RefreshCw } from 'lucide-react';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenImportExport: () => void;
  onResetData: () => void;
  totalTrips: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenImportExport,
  onResetData,
  totalTrips,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 border border-purple-200/50 flex items-center justify-center text-purple-700 shadow-xs">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-800 whitespace-nowrap">
            FleetLogistics Pastel
          </span>
        </div>

        {/* Zone 2: clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeTab === 'overview'
                ? 'text-purple-700 font-semibold border-b-2 border-purple-500 pb-0.5'
                : 'text-slate-600'
            }`}
          >
            ภาพรวม
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeTab === 'table'
                ? 'text-purple-700 font-semibold border-b-2 border-purple-500 pb-0.5'
                : 'text-slate-600'
            }`}
          >
            เที่ยววิ่ง ({totalTrips})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jobOrders')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeTab === 'jobOrders'
                ? 'text-purple-700 font-semibold border-b-2 border-purple-500 pb-0.5'
                : 'text-slate-600'
            }`}
          >
            ใบสั่งงานขนส่ง
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('expenses')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeTab === 'expenses'
                ? 'text-purple-700 font-semibold border-b-2 border-purple-500 pb-0.5'
                : 'text-slate-600'
            }`}
          >
            ค่าใช้จ่าย & แนบไฟล์
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('maintenance')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeTab === 'maintenance'
                ? 'text-purple-700 font-semibold border-b-2 border-purple-500 pb-0.5'
                : 'text-slate-600'
            }`}
          >
            ประวัติการซ่อมบำรุง
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('receipts')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeTab === 'receipts'
                ? 'text-purple-700 font-semibold border-b-2 border-purple-500 pb-0.5'
                : 'text-slate-600'
            }`}
          >
            ใบเสร็จรับเงิน
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeTab === 'analytics'
                ? 'text-purple-700 font-semibold border-b-2 border-purple-500 pb-0.5'
                : 'text-slate-600'
            }`}
          >
            วิเคราะห์ต้นทุน
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onResetData}
            title="รีเซ็ตเป็นข้อมูลตัวอย่างตั้งต้น"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-purple-900 bg-purple-100 hover:bg-purple-200 border border-purple-200/80 rounded-xl transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 text-purple-700" />
            บันทึกเที่ยววิ่งใหม่
          </button>
        </div>
      </div>

      {/* Mobile Tab Scroller */}
      <div className="lg:hidden max-w-7xl mx-auto flex items-center gap-4 overflow-x-auto pt-2.5 pb-1 border-t border-slate-100 text-xs font-medium text-slate-600">
        {[
          { id: 'overview', label: 'ภาพรวม' },
          { id: 'table', label: `เที่ยววิ่ง (${totalTrips})` },
          { id: 'jobOrders', label: 'ใบสั่งงานขนส่ง' },
          { id: 'expenses', label: 'ค่าใช้จ่าย & แนบไฟล์' },
          { id: 'maintenance', label: 'ประวัติการซ่อมบำรุง' },
          { id: 'receipts', label: 'ใบเสร็จรับเงิน' },
          { id: 'analytics', label: 'วิเคราะห์ต้นทุน' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap pb-1 cursor-pointer transition-colors ${
              activeTab === tab.id
                ? 'text-purple-700 font-bold border-b-2 border-purple-500'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
