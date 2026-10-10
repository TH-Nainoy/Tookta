import React from 'react';
import { TripRecord, FuelStats } from '../types/logistics';
import { formatCurrency, formatInteger } from '../utils/formatters';
import { Coins, Fuel, DollarSign, Layers, ArrowRight, TrendingUp } from 'lucide-react';

interface AnalyticsViewProps {
  trips: TripRecord[];
  fuelStats: FuelStats;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ trips, fuelStats }) => {
  const totalFreight = trips.reduce((sum, t) => sum + t.freightFee, 0);
  const totalOther = trips.reduce((sum, t) => sum + t.otherFee, 0);
  const totalRevenue = totalFreight + totalOther;
  const totalDepot = trips.reduce((sum, t) => sum + t.depotFee, 0);
  const totalAdvance = trips.reduce((sum, t) => sum + t.advancePaid, 0);
  const totalPending = trips.reduce((sum, t) => sum + t.pendingBalance, 0);
  
  const estimatedFuelCost = fuelStats.fuelLiters * fuelStats.fuelPricePerLiter;
  const netOperatingProfit = totalRevenue - totalDepot - estimatedFuelCost;

  const size40Trips = trips.filter((t) => t.size === '40\'');
  const size20Trips = trips.filter((t) => t.size === '20\'');

  const avg40Freight = size40Trips.length > 0
    ? size40Trips.reduce((s, t) => s + t.freightFee, 0) / size40Trips.length
    : 0;
  const avg20Freight = size20Trips.length > 0
    ? size20Trips.reduce((s, t) => s + t.freightFee, 0) / size20Trips.length
    : 0;

  const avg40Depot = size40Trips.length > 0
    ? size40Trips.reduce((s, t) => s + t.depotFee, 0) / size40Trips.length
    : 0;
  const avg20Depot = size20Trips.length > 0
    ? size20Trips.reduce((s, t) => s + t.depotFee, 0) / size20Trips.length
    : 0;

  return (
    <div className="space-y-6">
      {/* 1. Cashflow Flow Architecture Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          กระแสเงินสดและโครงสร้างต้นทุนขนส่ง (Cashflow Breakdown)
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          วิเคราะห์การกระจายตัวของรายได้ค่ารถ ค่าคืนตู้ตามลาน ค่าน้ำมัน และยอดคงเหลือสุทธิ
        </p>

        {/* Visual Cascade Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100">
            <span className="text-xs font-medium text-purple-700">1. รายได้รวม (Revenue)</span>
            <div className="text-xl font-bold text-purple-900 mt-1 tabular-nums">
              ฿{formatCurrency(totalRevenue)}
            </div>
            <div className="text-[11px] text-purple-600 mt-2">
              จากเที่ยววิ่งทั้งหมด {trips.length} เที่ยว
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100">
            <span className="text-xs font-medium text-rose-700">2. หัก ค่าคืนตู้ (Depot Fees)</span>
            <div className="text-xl font-bold text-rose-900 mt-1 tabular-nums">
              -฿{formatCurrency(totalDepot)}
            </div>
            <div className="text-[11px] text-rose-600 mt-2">
              คิดเป็น {totalRevenue > 0 ? ((totalDepot / totalRevenue) * 100).toFixed(1) : 0}% ของรายได้
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100">
            <span className="text-xs font-medium text-amber-800">3. หัก ประมาณการน้ำมัน</span>
            <div className="text-xl font-bold text-amber-900 mt-1 tabular-nums">
              -฿{formatCurrency(estimatedFuelCost)}
            </div>
            <div className="text-[11px] text-amber-700 mt-2">
              {fuelStats.fuelLiters} ลิตร @ ฿{fuelStats.fuelPricePerLiter}/ลิตร
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-xs font-medium text-emerald-800">4. กำไรเบื้องต้นสุทธิ (Gross Profit)</span>
            <div className="text-xl font-bold text-emerald-900 mt-1 tabular-nums">
              ฿{formatCurrency(netOperatingProfit)}
            </div>
            <div className="text-[11px] text-emerald-700 mt-2">
              มาร์จิ้นกำไร {totalRevenue > 0 ? ((netOperatingProfit / totalRevenue) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>

        {/* Visual Progress Bar Ratio */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>สัดส่วนต้นทุนเทียบกับรายได้</span>
            <span>100% สุทธิ</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${Math.min(100, (totalDepot / (totalRevenue || 1)) * 100)}%` }}
              className="bg-rose-300 h-full"
              title="ค่าคืนตู้"
            />
            <div
              style={{ width: `${Math.min(100, (estimatedFuelCost / (totalRevenue || 1)) * 100)}%` }}
              className="bg-amber-300 h-full"
              title="ค่าน้ำมัน"
            />
            <div
              style={{
                width: `${Math.max(
                  0,
                  100 -
                    (totalDepot / (totalRevenue || 1)) * 100 -
                    (estimatedFuelCost / (totalRevenue || 1)) * 100
                )}%`,
              }}
              className="bg-emerald-300 h-full"
              title="กำไรคงเหลือ"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-300 inline-block" />
              ค่าคืนตู้ ({((totalDepot / (totalRevenue || 1)) * 100).toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300 inline-block" />
              ค่าน้ำมัน ({((estimatedFuelCost / (totalRevenue || 1)) * 100).toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 inline-block" />
              กำไรคงเหลือ (
              {(
                100 -
                (totalDepot / (totalRevenue || 1)) * 100 -
                (estimatedFuelCost / (totalRevenue || 1)) * 100
              ).toFixed(1)}
              %)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Comparison: 40' vs 20' Unit Economics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-semibold text-slate-800 text-sm">
              เปรียบเทียบขนาดตู้ 40 ฟุต (Long Container)
            </h4>
            <span className="font-mono text-purple-700 font-bold">{size40Trips.length} เที่ยว</span>
          </div>
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">ค่ารถเฉลี่ยต่อเที่ยว:</span>
              <span className="font-mono font-semibold text-slate-800">฿{formatCurrency(avg40Freight)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">ค่าคืนตู้เฉลี่ย:</span>
              <span className="font-mono font-semibold text-rose-800">฿{formatCurrency(avg40Depot)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">รายได้คงเหลือหลังคืนตู้เฉลี่ย:</span>
              <span className="font-mono font-bold text-emerald-800">
                ฿{formatCurrency(avg40Freight - avg40Depot)}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">รายได้รวมของตู้ 40':</span>
              <span className="font-mono font-bold text-purple-900">
                ฿{formatCurrency(size40Trips.reduce((s, t) => s + t.freightFee, 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-semibold text-slate-800 text-sm">
              เปรียบเทียบขนาดตู้ 20 ฟุต (Short Container)
            </h4>
            <span className="font-mono text-sky-700 font-bold">{size20Trips.length} เที่ยว</span>
          </div>
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">ค่ารถเฉลี่ยต่อเที่ยว:</span>
              <span className="font-mono font-semibold text-slate-800">฿{formatCurrency(avg20Freight)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">ค่าคืนตู้เฉลี่ย:</span>
              <span className="font-mono font-semibold text-rose-800">฿{formatCurrency(avg20Depot)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">รายได้คงเหลือหลังคืนตู้เฉลี่ย:</span>
              <span className="font-mono font-bold text-emerald-800">
                ฿{formatCurrency(avg20Freight - avg20Depot)}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">รายได้รวมของตู้ 20':</span>
              <span className="font-mono font-bold text-sky-900">
                ฿{formatCurrency(size20Trips.reduce((s, t) => s + t.freightFee, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
