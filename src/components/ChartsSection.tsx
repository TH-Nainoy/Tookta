import React, { useState } from 'react';
import { TripRecord } from '../types/logistics';
import { formatCurrency, formatInteger, getDayNumber } from '../utils/formatters';
import { BarChart3, PieChart, TrendingUp, MapPin, Warehouse } from 'lucide-react';

interface ChartsSectionProps {
  trips: TripRecord[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ trips }) => {
  const [activeDateHover, setActiveDateHover] = useState<string | null>(null);

  // Group trips by date
  const dateMap: Record<string, { date: string; freight: number; depot: number; count: number }> = {};
  trips.forEach((t) => {
    if (!dateMap[t.date]) {
      dateMap[t.date] = { date: t.date, freight: 0, depot: 0, count: 0 };
    }
    dateMap[t.date].freight += t.freightFee + t.otherFee;
    dateMap[t.date].depot += t.depotFee;
    dateMap[t.date].count += 1;
  });

  const timelineData = Object.values(dateMap).sort((a, b) => {
    return getDayNumber(a.date) - getDayNumber(b.date);
  });

  const maxDailyRevenue = Math.max(...timelineData.map((d) => d.freight), 10000);

  // Container Size breakdown
  const size40 = trips.filter((t) => t.size === '40\'');
  const size20 = trips.filter((t) => t.size === '20\'');
  const totalTrips = trips.length || 1;
  const pct40 = Math.round((size40.length / totalTrips) * 100);
  const pct20 = 100 - pct40;

  // Route breakdown
  const routeMap: Record<string, { count: number; revenue: number }> = {};
  trips.forEach((t) => {
    if (!routeMap[t.route]) routeMap[t.route] = { count: 0, revenue: 0 };
    routeMap[t.route].count += 1;
    routeMap[t.route].revenue += t.freightFee;
  });
  const topRoutes = Object.entries(routeMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);
  const maxRouteCount = Math.max(...topRoutes.map((r) => r[1].count), 1);

  // Depot breakdown
  const depotMap: Record<string, { count: number; fee: number }> = {};
  trips.forEach((t) => {
    const d = t.depot === '-' || !t.depot ? 'ไม่มีคืนตู้' : t.depot;
    if (!depotMap[d]) depotMap[d] = { count: 0, fee: 0 };
    depotMap[d].count += 1;
    depotMap[d].fee += t.depotFee;
  });
  const topDepots = Object.entries(depotMap)
    .sort((a, b) => b[1].fee - a[1].fee)
    .slice(0, 5);
  const maxDepotFee = Math.max(...topDepots.map((d) => d[1].fee), 1000);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* 1. Daily Trend Bar Chart (8 columns on lg) */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              สรุปรายได้ค่ารถและค่าคืนตู้ตามวันวิ่ง
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              กราฟแท่งเปรียบเทียบรายได้ค่ารถ (สีม่วงพาสเทล) กับค่าคืนตู้ (สีส้มพีช) ในแต่ละวัน
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-md bg-purple-300 inline-block" />
              ค่ารถ (รายได้)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-md bg-rose-200 inline-block" />
              ค่าคืนตู้ (ลาน)
            </span>
          </div>
        </div>

        {/* Timeline Bar Chart visualization */}
        {timelineData.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-xs text-slate-400">
            ไม่มีข้อมูลในช่วงเวลาที่เลือก
          </div>
        ) : (
          <div className="pt-6 pb-2">
            <div className="relative h-52 flex items-end gap-2.5 sm:gap-4 px-2 border-b border-slate-100">
              {/* Background grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-slate-200 w-full" />
                <div className="border-b border-dashed border-slate-200 w-full" />
                <div className="border-b border-dashed border-slate-200 w-full" />
              </div>

              {timelineData.map((item) => {
                const freightHeight = Math.max(12, Math.round((item.freight / maxDailyRevenue) * 160));
                const depotHeight = Math.max(6, Math.round((item.depot / maxDailyRevenue) * 160));
                const isHovered = activeDateHover === item.date;

                return (
                  <div
                    key={item.date}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setActiveDateHover(item.date)}
                    onMouseLeave={() => setActiveDateHover(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-3 z-20 w-44 bg-slate-900/95 text-white p-2.5 rounded-xl text-[11px] shadow-lg pointer-events-none transition-all">
                        <div className="font-semibold text-purple-200 border-b border-slate-700/80 pb-1 mb-1">
                          วันที่ {item.date} ({item.count} เที่ยว)
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>ค่ารถ:</span>
                          <span className="tabular-nums font-medium text-white">฿{formatCurrency(item.freight)}</span>
                        </div>
                        <div className="flex justify-between text-rose-300 mt-0.5">
                          <span>ค่าคืนตู้:</span>
                          <span className="tabular-nums font-medium">฿{formatCurrency(item.depot)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-300 mt-1 pt-1 border-t border-slate-800">
                          <span>คงเหลือ:</span>
                          <span className="tabular-nums font-semibold">฿{formatCurrency(item.freight - item.depot)}</span>
                        </div>
                      </div>
                    )}

                    {/* Bar Group */}
                    <div className="w-full flex items-end justify-center gap-1">
                      {/* Freight bar */}
                      <div
                        style={{ height: `${freightHeight}px` }}
                        className={`w-full max-w-[20px] rounded-t-md transition-all duration-300 ${
                          isHovered ? 'bg-purple-500 shadow-md' : 'bg-purple-200 hover:bg-purple-300'
                        }`}
                      />
                      {/* Depot bar */}
                      <div
                        style={{ height: `${depotHeight}px` }}
                        className={`w-full max-w-[14px] rounded-t-md transition-all duration-300 ${
                          isHovered ? 'bg-rose-400 shadow-md' : 'bg-rose-200 hover:bg-rose-300'
                        }`}
                      />
                    </div>

                    {/* X-axis label */}
                    <span className="mt-2 text-[10px] text-slate-500 font-medium group-hover:text-purple-700 truncate w-full text-center">
                      {item.date.split('/')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="text-right text-[11px] text-slate-400 mt-1">
              * ตัวเลขแกนนอนคือวันที่ในเดือนกันยายน 2569 (คลิกหรือเลื่อนดูยอดสุทธิ)
            </div>
          </div>
        )}
      </div>

      {/* 2. Container Size Mix (4 columns on lg) */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              สัดส่วนขนาดตู้คอนเทนเนอร์
            </h3>
            <span className="text-xs text-slate-400 font-mono">{trips.length} ตู้</span>
          </div>

          <div className="py-5 flex items-center justify-center">
            {/* Clean SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* 20' Arc (Sky Pastel) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#BAE6FD"
                  strokeWidth="16"
                  strokeDasharray="238.76"
                  strokeDashoffset="0"
                />
                {/* 40' Arc (Purple Pastel) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#C4B5FD"
                  strokeWidth="16"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 * (1 - pct40 / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-slate-800 tabular-nums">{pct40}%</span>
                <span className="text-[10px] text-slate-400">ตู้ 40 ฟุต</span>
              </div>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-400" />
                <span className="font-medium text-purple-900">ตู้ 40' (คอนเทนเนอร์ยาว)</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-purple-900 tabular-nums">{size40.length} เที่ยว</span>
                <span className="text-[11px] text-purple-600 block">
                  ฿{formatCurrency(size40.reduce((s, t) => s + t.freightFee, 0))}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-400" />
                <span className="font-medium text-sky-900">ตู้ 20' (คอนเทนเนอร์สั้น)</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-sky-900 tabular-nums">{size20.length} เที่ยว</span>
                <span className="text-[11px] text-sky-600 block">
                  ฿{formatCurrency(size20.reduce((s, t) => s + t.freightFee, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top Routes Ranking (6 cols on lg) */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            เส้นทางวิ่งยอดนิยม (Top Routes)
          </h3>
          <span className="text-xs text-slate-400 font-medium">จัดอันดับตามเที่ยว</span>
        </div>

        <div className="mt-4 space-y-3">
          {topRoutes.map(([route, data], idx) => {
            const barWidth = Math.round((data.count / maxRouteCount) * 100);
            return (
              <div key={route} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-mono">0{idx + 1}.</span>
                    {route}
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-slate-800 tabular-nums">{data.count} เที่ยว</span>
                    <span className="text-slate-400 text-[11px] ml-2 tabular-nums">
                      (฿{formatCurrency(data.revenue)})
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${barWidth}%` }}
                    className="h-full bg-emerald-300 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Top Container Depots (6 cols on lg) */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-rose-500" />
            สรุปค่าคืนตู้ตามลาน (Depot Expenses)
          </h3>
          <span className="text-xs text-slate-400 font-medium">จัดอันดับตามค่าใช้จ่าย</span>
        </div>

        <div className="mt-4 space-y-3">
          {topDepots.map(([depot, data], idx) => {
            const barWidth = Math.round((data.fee / maxDepotFee) * 100);
            return (
              <div key={depot} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-mono">0{idx + 1}.</span>
                    ลาน {depot}
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-rose-800 tabular-nums">฿{formatCurrency(data.fee)}</span>
                    <span className="text-slate-400 text-[11px] ml-2">({data.count} ตู้)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${barWidth}%` }}
                    className="h-full bg-rose-200 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
