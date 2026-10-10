import { DocumentAttachment } from './billing';

export type ExpenseCategory =
  | 'ค่าน้ำมัน'
  | 'ค่าทางด่วน'
  | 'ค่าลานคืนตู้/ยกตู้'
  | 'ค่าเบี้ยเลี้ยงคนขับ'
  | 'ค่าที่จอดรถ'
  | 'ค่าปรับ/ค่าตรวจสภาพ'
  | 'ค่าซ่อมแซมฉุกเฉิน'
  | 'อื่นๆ';

export interface ExpenseRecord {
  id: string;
  expenseNo: string;
  date: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  driver: string;
  vehiclePlate: string;
  paymentMethod: 'เงินสด' | 'โอนเงิน' | 'บัตรน้ำมัน fleet card' | 'ค้างจ่าย';
  status: 'เบิกแล้ว' | 'รอเคลียร์' | 'จ่ายแล้ว';
  note: string;
  attachments: DocumentAttachment[];
  tripId?: string;
}

export type JobOrderStatus =
  | 'รอดำเนินการ'
  | 'กำลังวิ่งงาน'
  | 'ส่งสินค้าแล้ว'
  | 'คืนตู้สำเร็จ'
  | 'ยกเลิก';

export interface JobOrder {
  id: string;
  orderNo: string; // e.g. WO-6909-01
  date: string;
  appointmentDate: string;
  appointmentTime: string;
  customerName: string;
  driver: string;
  driverPhone: string;
  vehiclePlate: string;
  containerNo: string;
  containerSize: '20\'' | '40\'';
  sealNo: string;
  cargoType: string; // ประเภทสินค้า
  weightKg?: number;
  pickupLocation: string; // จุดรับตู้เปล่า/ลานรับตู้
  deliveryLocation: string; // สถานที่ส่งสินค้า
  returnDepot: string; // ลานคืนตู้
  freightRate: number; // ค่าจ้างขนส่ง
  specialInstructions: string; // ข้อกำหนดพิเศษ
  status: JobOrderStatus;
  notes: string;
  attachments: DocumentAttachment[];
  tripId?: string;
}

export type MaintenanceCategory =
  | 'เปลี่ยนถ่ายน้ำมันเครื่อง'
  | 'เปลี่ยนยาง/สลับยาง'
  | 'ระบบเบรก/ผ้าเบรก'
  | 'ระบบไฟ/แบตเตอรี่'
  | 'ตรวจเช็กระยะ/ต่อ พ.ร.บ.'
  | 'ซ่อมช่วงล่าง/แหนบ'
  | 'ระบบหางลาก/หัวลาก'
  | 'อื่นๆ';

export interface MaintenanceRecord {
  id: string;
  recordNo: string;
  date: string;
  vehiclePlate: string;
  driver: string;
  odometer: number;
  category: MaintenanceCategory;
  title: string;
  description: string;
  garageName: string;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  nextDueOdometer?: number;
  nextDueDate?: string;
  status: 'เสร็จสิ้น' | 'รอดำเนินการ' | 'รออะไหล่';
  notes: string;
  attachments: DocumentAttachment[];
}
