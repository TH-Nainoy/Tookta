import React, { useState } from 'react';
import { FuelStats } from '../types/logistics';
import { X, Fuel, Gauge, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface FuelCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: FuelStats;
  onSave: (stats: FuelStats) => void;
  totalFreight: number;
}

export const FuelCalculatorModal: React.FC<FuelCalculatorModalProps> = ({
  isOpen,
  onClose,
  stats,
  onSave,
  totalFreight,
}) => {
  const [totalKm, setTotalKm] = useState(stats.totalKm || 1450);
  const [fuelLiters, setFuelLiters] = useState(stats.fuelLiters || 460);
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState(stats.fuelPricePerLiter || 32.5);

  if (!isOpen) return null;

  const kmPerLiter = fuelLiters > 0 ? (totalKm / fuelLiters).toFixed(2) : '0.00';
  const totalFuelCost = fuelLiters * fuelPricePerLiter;
  const costPerKm = totalKm > 0 ? (totalFuelCost / totalKm).toFixed(2) : '0.00';

  const handleSave = () => {
    onSave({
      totalKm: Number(totalKm),
      fuelLiters: Number(fuelLiters),
      fuelPricePerLiter: Number(fuelPricePerLiter),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Fuel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                คำนวณระยะทาง & อัตราสิ้นเปลืองน้ำมัน
              </h3>
              <p className="text-xs text-slate-500">
                แก้ปัญหา #REF! ในเอกสาร พร้อมสรุปต้นทุนน้ำมันจริง
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

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Inputs */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">
              ระยะทางสะสมรวม (กิโลเมตร)
            </label>
            <div className="relative">
              <input
                type="number"
                value={totalKm}
                onChange={(e) => setTotalKm(parseFloat(e.target.value) || 0)}
                placeholder="1450"
                className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                กม.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">
              ปริมาณน้ำมันดีเซลที่เติมทั้งหมด (ลิตร)
            </label>
            <div className="relative">
              <input
                type="number"
                value={fuelLiters}
                onChange={(e) => setFuelLiters(parseFloat(e.target.value) || 0)}
                placeholder="460"
                className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ลิตร
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">
              ราคาน้ำมันเฉลี่ยต่อลิตร (บาท/ลิตร)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={fuelPricePerLiter}
                onChange={(e) => setFuelPricePerLiter(parseFloat(e.target.value) || 0)}
                placeholder="32.50"
                className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ฿/ลิตร
              </span>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-emerald-900 font-medium">อัตราสิ้นเปลืองเฉลี่ย:</span>
              <span className="text-base font-bold text-emerald-800 font-mono">
                {kmPerLiter} กม./ลิตร
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>ค่าน้ำมันรวมทั้งหมด:</span>
              <span className="font-mono font-medium text-slate-800">
                ฿{formatCurrency(totalFuelCost)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>ต้นทุนน้ำมันต่อกิโลเมตร:</span>
              <span className="font-mono font-medium text-slate-800">
                ฿{costPerKm} / กม.
              </span>
            </div>
          </div>

          {/* Actions */}
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
              onClick={handleSave}
              className="cursor-pointer px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-xl transition-all shadow-xs"
            >
              บันทึกการคำนวณ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
