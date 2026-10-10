export interface CompanySettings {
  name: string;
  nameEn: string;
  taxId: string;
  branch: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
}

export interface Customer {
  id: string;
  name: string;
  taxId: string;
  branch: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
}

export interface DocumentAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  uploadedAt: string;
}

export interface ReceiptItem {
  id: string;
  description: string;
  containerNo?: string;
  route?: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export interface ReceiptDocument {
  id: string;
  receiptNo: string;
  invoiceNo?: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerTaxId: string;
  customerBranch: string;
  items: ReceiptItem[];
  subtotal: number;
  vatRate: number; // e.g. 7 or 0
  vatAmount: number;
  withholdingTaxRate: number; // e.g. 1% for transport
  withholdingTaxAmount: number;
  totalPayable: number;

  // Requirement: "มียอดให้ยืนยัน แต่ไม่ต้องลงในใบเสร็จ"
  confirmationAmount: number; // e.g. ยอดเงินประกัน/ยอดค้างจ่าย/เงินมัดจำ
  confirmationNote: string; // e.g. "ค้างจ่ายรอบก่อน / มัดจำตู้"
  showConfirmationOnReceipt: boolean; // default false
  isConfirmed: boolean;

  paymentMethod: 'โอนเงินผ่านธนาคาร' | 'เงินสด' | 'เช็คธนาคาร';
  notes: string;
  attachments: DocumentAttachment[];
  status: 'ฉบับร่าง' | 'รอยืนยัน' | 'ชำระแล้ว';
  tripIds?: string[];
}
