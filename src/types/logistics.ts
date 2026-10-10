export interface TripRecord {
  id: string;
  date: string; // e.g. "04/09/2569"
  driver: string; // e.g. "โจ้"
  route: string; // e.g. "PAT - สายไหม 73"
  depot: string; // e.g. "127" (ลานคืนตู้)
  containerNo: string; // e.g. "CAAU4768383"
  size: '20\'' | '40\''; // e.g. "40'"
  shift: 'ส่งเช้า' | 'ส่งเลย' | string; // e.g. "ส่งเช้า"
  qty: number; // 1
  freightFee: number; // ค่ารถ (เช่น 6,000.00)
  otherFee: number; // อื่นๆ (เช่น 0.00 หรือ 400.00)
  depotFee: number; // ค่าคืนตู้ (เช่น 2,086.50)
  advancePaid: number; // เบิก (เช่น 6,000.00)
  pendingBalance: number; // ค้างจ่าย (เช่น 2,086.50)
  paymentDate: string; // ชำระค่ารถวันที่ (เช่น "6/9/2569" หรือ "30/9/2569")
  company: string; // บริษัท (เช่น "AIM")
  note: string; // หมายเหตุ (เช่น "RE6909-01")
}

export interface FilterState {
  startDate: string; // e.g. "01/09/2569"
  endDate: string; // e.g. "30/09/2569"
  driver: string; // e.g. "โจ้" or "ทั้งหมด"
  containerSize: string; // "ทั้งหมด" | "20'" | "40'"
  shift: string; // "ทั้งหมด" | "ส่งเช้า" | "ส่งเลย"
  searchQuery: string;
  paymentStatus: 'all' | 'settled' | 'pending';
}

export interface FuelStats {
  totalKm: number;
  fuelLiters: number;
  fuelPricePerLiter: number;
}
