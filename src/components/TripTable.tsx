import React, { useState } from 'react';
import { TripRecord } from '../types/logistics';
import { formatCurrency, getDayNumber } from '../utils/formatters';
import { ArrowUpDown, Edit3, Trash2, Check, Clock, ExternalLink, FileText } from 'lucide-react';

interface TripTableProps {
  trips: TripRecord[];
  onEditTrip: (trip: TripRecord) => void;
  onDeleteTrip: (id: string) => void;
  onQuickSettle: (trip: TripRecord) => void;
  onCreateReceiptFromTrip?: (trip: TripRecord) => void;
  onOpenReceiptsTab?: () => void;
}

type SortField = 'date' | 'freightFee' | 'depotFee' | 'pendingBalance' | 'route';
type SortOrder = 'asc' | 'desc';

export const TripTable: React.FC<TripTableProps> = ({
  trips,
  onEditTrip,
  onDeleteTrip,
  onQuickSettle,
  onCreateReceiptFromTrip,
  onOpenReceiptsTab,
}) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedTrips = [...trips].sort((a, b) => {
    let result = 0;
    if (sortField === 'date') {
      result = getDayNumber(a.date) - getDayNumber(b.date);
    } else if (sortField === 'freightFee') {
      result = a.freightFee - b.freightFee;
    } else if (sortField === 'depotFee') {
      result = a.depotFee - b.depotFee;
    } else if (sortField === 'pendingBalance') {
      result = a.pendingBalance - b.pendingBalance;
    } else if (sortField === 'route') {
      result = a.route.localeCompare(b.route);
    }
    return sortOrder === 'asc' ? result : -result;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Header Bar */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            ประวัติการขนส่งตู้คอนเทนเนอร์
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            แสดงข้อมูลเที่ยววิ่ง บัญชีค่ารถ ค่าคืนตู้ และสถานะการชำระเงิน
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs text-slate-500">
            รวมทั้งหมด <span className="font-semibold text-slate-800 tabular-nums">{trips.length}</span> รายการ
          </div>
          {onOpenReceiptsTab && (
            <button
              type="button"
              onClick={onOpenReceiptsTab}
              className="cursor-pointer px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/70 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              จัดการใบเสร็จรับเงิน
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200/70 select-none">
              <th
                onClick={() => handleSort('date')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-800 whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  วันที่
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 font-semibold whitespace-nowrap">คนขับ / งาน</th>
              <th
                onClick={() => handleSort('route')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-800 whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  เส้นทาง (สถานที่)
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 font-semibold whitespace-nowrap">คืนตู้ (ลาน)</th>
              <th className="py-3 px-3 font-semibold whitespace-nowrap">เบอร์ตู้ & ขนาด</th>
              <th className="py-3 px-3 font-semibold whitespace-nowrap">รอบงาน</th>
              <th
                onClick={() => handleSort('freightFee')}
                className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-800 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  ค่ารถ (฿)
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('depotFee')}
                className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-800 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  ค่าคืนตู้ (฿)
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 font-semibold text-right whitespace-nowrap">เบิก (฿)</th>
              <th
                onClick={() => handleSort('pendingBalance')}
                className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-800 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  ค้างจ่าย (฿)
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 font-semibold whitespace-nowrap">การชำระเงิน</th>
              <th className="py-3 px-3 font-semibold whitespace-nowrap">บริษัท/หมายเหตุ</th>
              <th className="py-3 px-4 font-semibold text-center whitespace-nowrap">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedTrips.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-12 text-center text-slate-400">
                  ไม่พบรายการขนส่งที่ตรงกับเงื่อนไขการค้นหา
                </td>
              </tr>
            ) : (
              sortedTrips.map((trip) => {
                const hasPending = trip.pendingBalance > 0;
                return (
                  <tr
                    key={trip.id}
                    className="hover:bg-purple-50/20 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 tabular-nums whitespace-nowrap">
                      {trip.date}
                    </td>

                    {/* Driver */}
                    <td className="py-3 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {trip.driver}
                    </td>

                    {/* Route */}
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap font-medium">
                      {trip.route}
                    </td>

                    {/* Depot */}
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {trip.depot === '-' || !trip.depot ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        trip.depot
                      )}
                    </td>

                    {/* Container Number & Size */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono text-slate-800 font-medium">
                        {trip.containerNo}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span>ตู้ {trip.size}</span>
                        <span aria-hidden="true">·</span>
                        <span>{trip.qty} ตู้</span>
                      </div>
                    </td>

                    {/* Shift */}
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {trip.shift}
                    </td>

                    {/* Freight Fee */}
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-800 tabular-nums whitespace-nowrap">
                      ฿{formatCurrency(trip.freightFee)}
                      {trip.otherFee > 0 && (
                        <div className="text-[10px] text-amber-600">
                          +อื่นๆ {formatCurrency(trip.otherFee)}
                        </div>
                      )}
                    </td>

                    {/* Depot Fee */}
                    <td className="py-3 px-3 text-right font-mono text-rose-800 tabular-nums whitespace-nowrap">
                      {trip.depotFee > 0 ? `฿${formatCurrency(trip.depotFee)}` : '-'}
                    </td>

                    {/* Advance Paid */}
                    <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums whitespace-nowrap">
                      ฿{formatCurrency(trip.advancePaid)}
                    </td>

                    {/* Pending Balance */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                      {hasPending ? (
                        <span className="text-amber-800 font-semibold">
                          ฿{formatCurrency(trip.pendingBalance)}
                        </span>
                      ) : (
                        <span className="text-emerald-700">฿0.00</span>
                      )}
                    </td>

                    {/* Payment Info */}
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap max-w-[140px] truncate" title={trip.paymentDate}>
                      {trip.paymentDate ? (
                        <div className="flex items-center gap-1.5">
                          {hasPending ? (
                            <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                          ) : (
                            <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                          )}
                          <span className="truncate">{trip.paymentDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Company & Note */}
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap max-w-[150px] truncate" title={trip.note}>
                      <div className="flex items-center gap-1 text-slate-700">
                        <span>{trip.company || '-'}</span>
                        {trip.note && (
                          <>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className="text-slate-500 text-[11px] truncate">{trip.note}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {hasPending && (
                          <button
                            type="button"
                            onClick={() => onQuickSettle(trip)}
                            title="เคลียร์ชำระเงินเรียบร้อย"
                            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 cursor-pointer transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onCreateReceiptFromTrip && (
                          <button
                            type="button"
                            onClick={() => onCreateReceiptFromTrip(trip)}
                            title="ออกใบเสร็จรับเงินจากเที่ยวนี้"
                            className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onEditTrip(trip)}
                          title="แก้ไขข้อมูล"
                          className="p-1 rounded-md text-slate-500 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTrip(trip.id)}
                          title="ลบเที่ยววิ่ง"
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer summary row */}
      {sortedTrips.length > 0 && (
        <div className="bg-slate-50/90 px-5 py-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
          <div className="font-medium">
            รวมสุทธิของตาราง ({sortedTrips.length} เที่ยว)
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono text-slate-800">
            <div>
              <span className="text-slate-400 text-[11px] mr-1.5">ค่ารถ:</span>
              <span className="font-semibold">
                ฿{formatCurrency(sortedTrips.reduce((s, t) => s + t.freightFee, 0))}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] mr-1.5">ค่าคืนตู้:</span>
              <span className="font-semibold text-rose-800">
                ฿{formatCurrency(sortedTrips.reduce((s, t) => s + t.depotFee, 0))}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] mr-1.5">เบิกแล้ว:</span>
              <span className="font-semibold">
                ฿{formatCurrency(sortedTrips.reduce((s, t) => s + t.advancePaid, 0))}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] mr-1.5">ค้างจ่ายรวม:</span>
              <span className="font-bold text-amber-800">
                ฿{formatCurrency(sortedTrips.reduce((s, t) => s + t.pendingBalance, 0))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
