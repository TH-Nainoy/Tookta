import React from 'react';
import { Search, Calendar, User, Filter, X } from 'lucide-react';
import { FilterState } from '../types/logistics';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableDrivers: string[];
  totalMatches: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  availableDrivers,
  totalMatches,
}) => {
  const handleResetFilters = () => {
    setFilters({
      startDate: '01/09/2569',
      endDate: '30/09/2569',
      driver: 'โจ้',
      containerSize: 'ทั้งหมด',
      shift: 'ทั้งหมด',
      searchQuery: '',
      paymentStatus: 'all',
    });
  };

  const isFiltered =
    filters.containerSize !== 'ทั้งหมด' ||
    filters.shift !== 'ทั้งหมด' ||
    filters.driver !== 'โจ้' ||
    filters.searchQuery !== '' ||
    filters.paymentStatus !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Primary Dropdowns matching the user's spreadsheet controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Driver / Vehicle Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-1.5 text-xs">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">ทะเบียน/คนขับ:</span>
            <select
              value={filters.driver}
              onChange={(e) => setFilters((prev) => ({ ...prev, driver: e.target.value }))}
              className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="ทั้งหมด">ทั้งหมด ({availableDrivers.length} คัน)</option>
              {availableDrivers.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range: From */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">จาก:</span>
            <input
              type="text"
              value={filters.startDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
              placeholder="01/09/2569"
              className="w-20 bg-transparent font-semibold text-slate-800 outline-none text-center"
            />
          </div>

          {/* Date Range: To */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500">ถึง:</span>
            <input
              type="text"
              value={filters.endDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
              placeholder="30/09/2569"
              className="w-20 bg-transparent font-semibold text-slate-800 outline-none text-center"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  startDate: '01/09/2569',
                  endDate: '15/09/2569',
                }))
              }
              className="px-2 py-1 text-slate-600 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
            >
              ครึ่งเดือนแรก
            </button>
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  startDate: '16/09/2569',
                  endDate: '30/09/2569',
                }))
              }
              className="px-2 py-1 text-slate-600 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
            >
              ครึ่งเดือนหลัง
            </button>
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  startDate: '01/09/2569',
                  endDate: '30/09/2569',
                }))
              }
              className="px-2 py-1 text-slate-600 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
            >
              ทั้งเดือน ก.ย. 69
            </button>
          </div>
        </div>

        {/* Right: Search box */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาเบอร์ตู้, สถานที่, ลานคืนตู้..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-slate-800 placeholder-slate-400"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Secondary filter tabs (Interactive segmented controls) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Container Size Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
            <span className="px-2 text-slate-400 text-[11px] font-medium">ตู้:</span>
            {['ทั้งหมด', '40\'', '20\''].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, containerSize: size }))}
                className={`px-2.5 py-1 font-medium rounded-md cursor-pointer transition-all ${
                  filters.containerSize === size
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Shift / Time Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
            <span className="px-2 text-slate-400 text-[11px] font-medium">รอบ:</span>
            {['ทั้งหมด', 'ส่งเช้า', 'ส่งเลย'].map((shift) => (
              <button
                key={shift}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, shift }))}
                className={`px-2.5 py-1 font-medium rounded-md cursor-pointer transition-all ${
                  filters.shift === shift
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {shift}
              </button>
            ))}
          </div>

          {/* Payment Status Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
            <span className="px-2 text-slate-400 text-[11px] font-medium">สถานะเงิน:</span>
            {[
              { label: 'ทั้งหมด', value: 'all' },
              { label: 'มียอดค้าง', value: 'pending' },
              { label: 'เคลียร์แล้ว', value: 'settled' },
            ].map((st) => (
              <button
                key={st.value}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, paymentStatus: st.value as any }))
                }
                className={`px-2.5 py-1 font-medium rounded-md cursor-pointer transition-all ${
                  filters.paymentStatus === st.value
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count & reset */}
        <div className="flex items-center gap-3 text-slate-500">
          <span>พบ {totalMatches} เที่ยววิ่ง</span>
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="cursor-pointer text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
