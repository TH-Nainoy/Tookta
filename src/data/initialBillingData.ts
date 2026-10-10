import { CompanySettings, Customer, ReceiptDocument } from '../types/billing';

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  name: 'บริษัท ทวีโชค ขนส่ง โลจิสติกส์ จำกัด',
  nameEn: 'Thaweechoke Transport & Logistics Co., Ltd.',
  taxId: '0105562098471',
  branch: 'สำนักงานใหญ่',
  address: 'เลขที่ 88/19 หมู่ 5 ถนนบางนา-ตราด กม.19 ตำบลบางโฉลง อำเภอบางพลี จังหวัดสมุทรปราการ 10540',
  phone: '02-740-9889, 081-998-1234',
  email: 'billing@thaweechoke-logistics.com',
  logoUrl: '', // Can be uploaded or default to SVG badge
  bankName: 'ธนาคารกสิกรไทย (KBANK)',
  bankAccount: '142-2-90876-1',
  bankAccountName: 'บจก. ทวีโชค ขนส่ง โลจิสติกส์',
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'บริษัท เอไอเอ็ม โลจิสติกส์ อินเตอร์เนชั่นแนล จำกัด',
    taxId: '0105558123456',
    branch: 'สำนักงานใหญ่',
    address: '99/1 อาคารแคปปิตอลทาวเวอร์ ชั้น 12 ถนนสาทรเหนือ แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500',
    phone: '02-632-1100',
    email: 'contact@aim-logistics.co.th',
    contactPerson: 'คุณกรรณิการ์ (ฝ่ายบัญชี/ขนส่ง)',
  },
  {
    id: 'CUST-002',
    name: 'บริษัท ร่มเกล้า ทรานสปอร์ต แอนด์ คาร์โก้ จำกัด',
    taxId: '0105559098765',
    branch: 'สาขา 00001 (ร่มเกล้า)',
    address: '45/8 ถนนร่มเกล้า แขวงคลองสามประเวศ เขตลาดกระบัง กรุงเทพมหานคร 10520',
    phone: '02-360-8899',
    email: 'dispatch@romklao-cargo.com',
    contactPerson: 'คุณสมชาย',
  },
  {
    id: 'CUST-003',
    name: 'บริษัท สยาม คอนเทนเนอร์ ยาร์ด จำกัด',
    taxId: '0105560112233',
    branch: 'สำนักงานใหญ่',
    address: '127 หมู่ 3 ถนนสุขุมวิท ตำบลท้ายบ้านใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ 10280',
    phone: '02-703-5566',
    email: 'account@siamcontainer.com',
    contactPerson: 'คุณวัชระ',
  },
];

export const INITIAL_RECEIPTS: ReceiptDocument[] = [
  {
    id: 'RC-256909-001',
    receiptNo: 'RC-6909001',
    invoiceNo: 'INV-6909001',
    date: '30/09/2569',
    dueDate: '15/10/2569',
    customerId: 'CUST-001',
    customerName: 'บริษัท เอไอเอ็ม โลจิสติกส์ อินเตอร์เนชั่นแนล จำกัด',
    customerAddress: '99/1 อาคารแคปปิตอลทาวเวอร์ ชั้น 12 ถนนสาทรเหนือ แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500',
    customerTaxId: '0105558123456',
    customerBranch: 'สำนักงานใหญ่',
    items: [
      {
        id: 'ITEM-1',
        description: 'ค่าบริการขนส่งตู้คอนเทนเนอร์ 40\' (PAT - สายไหม 73)',
        containerNo: 'CAAU4768383',
        route: 'PAT - สายไหม 73',
        qty: 1,
        unitPrice: 6000.0,
        amount: 6000.0,
      },
      {
        id: 'ITEM-2',
        description: 'ค่าบริการขนส่งตู้คอนเทนเนอร์ 20\' (PAT - บางปู หัวลาก)',
        containerNo: 'TWCU2214615',
        route: 'PAT - บางปู (หัวลาก)',
        qty: 1,
        unitPrice: 4700.0,
        amount: 4700.0,
      },
      {
        id: 'ITEM-3',
        description: 'ค่าบริการขนส่งตู้คอนเทนเนอร์ 40\' (สายไหม 73 - บ้านบึง)',
        containerNo: 'BMOU4511588',
        route: 'สายไหม 73 - บ้านบึง',
        qty: 1,
        unitPrice: 8000.0,
        amount: 8000.0,
      },
    ],
    subtotal: 18700.0,
    vatRate: 0,
    vatAmount: 0.0,
    withholdingTaxRate: 1, // 1% Transport WHT
    withholdingTaxAmount: 187.0,
    totalPayable: 18513.0,

    // Requirement: "มียอดให้ยืนยัน แต่ไม่ต้องลงในใบเสร็จ"
    confirmationAmount: 3089.0, // e.g. ค่าคืนตู้สะสม / ยอดค้างจ่ายภายใน
    confirmationNote: 'ยอดค่าคืนตู้ลาน 127 + TID km.18 เพื่อตรวจสอบภายในก่อนปล่อยรถเที่ยวถัดไป',
    showConfirmationOnReceipt: false, // Don't print on receipt as requested!
    isConfirmed: true,

    paymentMethod: 'โอนเงินผ่านธนาคาร',
    notes: 'อ้างอิงใบสั่งงานขนส่ง RE6909-01, RE6909-07 ชำระเงินเข้าบัญชี บจก. ทวีโชค ขนส่ง โลจิสติกส์',
    attachments: [
      {
        id: 'ATT-1',
        name: 'ใบเสร็จค่าคืนตู้_ลาน127.pdf',
        size: 245000,
        type: 'application/pdf',
        dataUrl: '',
        uploadedAt: '30/09/2569 14:20',
      },
      {
        id: 'ATT-2',
        name: 'ใบปล่อยตู้_EIR_CAAU4768383.jpg',
        size: 512000,
        type: 'image/jpeg',
        dataUrl: '',
        uploadedAt: '30/09/2569 15:10',
      },
    ],
    status: 'ชำระแล้ว',
    tripIds: ['TRIP-256909-01', 'TRIP-256909-02', 'TRIP-256909-05'],
  },
];
