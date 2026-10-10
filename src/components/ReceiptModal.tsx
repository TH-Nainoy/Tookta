import React, { useState, useEffect, useRef } from 'react';
import { ReceiptDocument, ReceiptItem, DocumentAttachment, Customer } from '../types/billing';
import { TripRecord } from '../types/logistics';
import { formatCurrency } from '../utils/formatters';
import {
  X,
  Plus,
  Trash2,
  Paperclip,
  Eye,
  FileText,
  UserPlus,
  Upload,
  ShieldCheck,
  Percent,
} from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (receipt: ReceiptDocument) => void;
  onPreview: (receipt: ReceiptDocument) => void;
  initialReceipt?: ReceiptDocument | null;
  customers: Customer[];
  onOpenCustomerModal: (customerToEdit?: Customer | null) => void;
  trips?: TripRecord[];
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onPreview,
  initialReceipt,
  customers,
  onOpenCustomerModal,
  trips = [],
}) => {
  const [formData, setFormData] = useState<ReceiptDocument>({
    id: '',
    receiptNo: '',
    invoiceNo: '',
    date: '30/09/2569',
    dueDate: '15/10/2569',
    customerId: '',
    customerName: '',
    customerAddress: '',
    customerTaxId: '',
    customerBranch: 'สำนักงานใหญ่',
    items: [],
    subtotal: 0,
    vatRate: 0,
    vatAmount: 0,
    withholdingTaxRate: 1,
    withholdingTaxAmount: 0,
    totalPayable: 0,
    confirmationAmount: 0,
    confirmationNote: '',
    showConfirmationOnReceipt: false, // Default: "มียอดให้ยืนยัน แต่ไม่ต้องลงในใบเสร็จ"
    isConfirmed: true,
    paymentMethod: 'โอนเงินผ่านธนาคาร',
    notes: '',
    attachments: [],
    status: 'ชำระแล้ว',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialReceipt) {
      setFormData(initialReceipt);
    } else {
      const defaultCust = customers[0] || null;
      const initialItems: ReceiptItem[] = [
        {
          id: `ITEM-${Date.now()}-1`,
          description: 'ค่าบริการขนส่งตู้คอนเทนเนอร์ 40\' (PAT - สายไหม 73)',
          containerNo: 'CAAU4768383',
          route: 'PAT - สายไหม 73',
          qty: 1,
          unitPrice: 6000,
          amount: 6000,
        },
      ];
      const sub = 6000;
      const wht = sub * 0.01;

      setFormData({
        id: `RC-${Date.now()}`,
        receiptNo: `RC-${Math.floor(100000 + Math.random() * 900000)}`,
        invoiceNo: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('th-TH'),
        dueDate: new Date(Date.now() + 15 * 86400000).toLocaleDateString('th-TH'),
        customerId: defaultCust?.id || '',
        customerName: defaultCust?.name || '',
        customerAddress: defaultCust?.address || '',
        customerTaxId: defaultCust?.taxId || '',
        customerBranch: defaultCust?.branch || 'สำนักงานใหญ่',
        items: initialItems,
        subtotal: sub,
        vatRate: 0,
        vatAmount: 0,
        withholdingTaxRate: 1,
        withholdingTaxAmount: wht,
        totalPayable: sub - wht,
        confirmationAmount: 2086.5,
        confirmationNote: 'ยอดค่าคืนตู้ลาน 127 สำหรับยืนยันการเคลียร์รอบงาน',
        showConfirmationOnReceipt: false,
        isConfirmed: true,
        paymentMethod: 'โอนเงินผ่านธนาคาร',
        notes: 'ชำระค่าบริการขนส่งตู้คอนเทนเนอร์เรียบร้อยแล้ว',
        attachments: [],
        status: 'ชำระแล้ว',
      });
    }
  }, [initialReceipt, isOpen, customers]);

  if (!isOpen) return null;

  // Handle Customer Selection
  const handleSelectCustomer = (customerId: string) => {
    const cust = customers.find((c) => c.id === customerId);
    if (cust) {
      setFormData((prev) => ({
        ...prev,
        customerId: cust.id,
        customerName: cust.name,
        customerAddress: cust.address,
        customerTaxId: cust.taxId,
        customerBranch: cust.branch,
      }));
    }
  };

  // Recalculate totals
  const recalculate = (
    items: ReceiptItem[],
    vatRate: number,
    whtRate: number
  ) => {
    const sub = items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
    const vat = (sub * (Number(vatRate) || 0)) / 100;
    const wht = (sub * (Number(whtRate) || 0)) / 100;
    const total = sub + vat - wht;

    return {
      subtotal: sub,
      vatAmount: vat,
      withholdingTaxAmount: wht,
      totalPayable: total,
    };
  };

  // Item modifications
  const handleItemChange = (index: number, field: keyof ReceiptItem, val: any) => {
    const updated = [...formData.items];
    const item = { ...updated[index], [field]: val };

    if (field === 'qty' || field === 'unitPrice') {
      const q = field === 'qty' ? Number(val) || 0 : item.qty;
      const p = field === 'unitPrice' ? Number(val) || 0 : item.unitPrice;
      item.amount = q * p;
    }

    updated[index] = item;
    const calcs = recalculate(updated, formData.vatRate, formData.withholdingTaxRate);
    setFormData((prev) => ({ ...prev, items: updated, ...calcs }));
  };

  const handleAddItem = () => {
    const newItem: ReceiptItem = {
      id: `ITEM-${Date.now()}`,
      description: 'ค่าบริการขนส่งตู้คอนเทนเนอร์',
      containerNo: '',
      route: '',
      qty: 1,
      unitPrice: 4700,
      amount: 4700,
    };
    const updated = [...formData.items, newItem];
    const calcs = recalculate(updated, formData.vatRate, formData.withholdingTaxRate);
    setFormData((prev) => ({ ...prev, items: updated, ...calcs }));
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length <= 1) {
      alert('ใบเสร็จต้องมีรายการอย่างน้อย 1 รายการ');
      return;
    }
    const updated = formData.items.filter((_, i) => i !== index);
    const calcs = recalculate(updated, formData.vatRate, formData.withholdingTaxRate);
    setFormData((prev) => ({ ...prev, items: updated, ...calcs }));
  };

  // Attachments Handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: DocumentAttachment[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const att: DocumentAttachment = {
          id: `ATT-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: (ev.target?.result as string) || '',
          uploadedAt: new Date().toLocaleString('th-TH'),
        };
        setFormData((prev) => ({
          ...prev,
          attachments: [...prev.attachments, att],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveAttachment = (attId: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== attId),
    }));
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      alert('กรุณาเลือกลูกค้าหรือระบุชื่อลูกค้า');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-4xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {initialReceipt ? 'แก้ไขใบเสร็จรับเงิน / ใบแจ้งหนี้' : 'สร้างใบเสร็จรับเงินใหม่'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              จัดการรายการค่าขนส่ง ยอดตรวจสอบยืนยัน และไฟล์แนบ
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview(formData)}
              className="cursor-pointer px-3.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              ดูตัวอย่างก่อนพิมพ์
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Metadata Row: Receipt No, Invoice No, Date, Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <div>
              <label className="block text-slate-600 font-medium mb-1">เลขที่ใบเสร็จ *</label>
              <input
                type="text"
                required
                value={formData.receiptNo}
                onChange={(e) => setFormData({ ...formData, receiptNo: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">อ้างอิงใบแจ้งหนี้</label>
              <input
                type="text"
                value={formData.invoiceNo}
                onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">วันที่ออกเอกสาร</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-center"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">สถานะเอกสาร</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium text-emerald-800"
              >
                <option value="ชำระแล้ว">ชำระแล้ว</option>
                <option value="รอยืนยัน">รอยืนยัน</option>
                <option value="ฉบับร่าง">ฉบับร่าง</option>
              </select>
            </div>
          </div>

          {/* Customer Selection & Details */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-sm">ข้อมูลลูกค้า / ผู้ว่าจ้าง</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenCustomerModal(null)}
                  className="cursor-pointer text-[11px] text-purple-700 hover:text-purple-900 font-medium flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  + เพิ่มลูกค้าใหม่
                </button>
                {formData.customerId && (
                  <button
                    type="button"
                    onClick={() => {
                      const cur = customers.find((c) => c.id === formData.customerId);
                      if (cur) onOpenCustomerModal(cur);
                    }}
                    className="cursor-pointer text-[11px] text-slate-500 hover:text-slate-800"
                  >
                    ✏️ แก้ไขข้อมูลลูกค้านี้
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">เลือกลูกค้าในระบบ</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => handleSelectCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="">-- เลือกลูกค้า --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">ชื่อในเอกสาร</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">ที่อยู่ลูกค้า</label>
                <input
                  type="text"
                  value={formData.customerAddress}
                  onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">เลขผู้เสียภาษี (13 หลัก)</label>
                <input
                  type="text"
                  value={formData.customerTaxId}
                  onChange={(e) => setFormData({ ...formData, customerTaxId: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-sm">รายการบริการขนส่งในใบเสร็จ</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="cursor-pointer text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                เพิ่มรายการ
              </button>
            </div>

            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 items-center"
                >
                  <div className="col-span-12 sm:col-span-4">
                    <input
                      type="text"
                      placeholder="คำอธิบายรายการ"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <input
                      type="text"
                      placeholder="เบอร์ตู้"
                      value={item.containerNo}
                      onChange={(e) => handleItemChange(index, 'containerNo', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <input
                      type="text"
                      placeholder="เส้นทาง"
                      value={item.route}
                      onChange={(e) => handleItemChange(index, 'route', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-1">
                    <input
                      type="number"
                      placeholder="จำนวน"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs text-center"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-1.5">
                    <input
                      type="number"
                      placeholder="ราคา"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono text-right"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-1 text-right font-mono font-semibold text-slate-800">
                    ฿{formatCurrency(item.amount)}
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="ลบแถวนี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span>หัก ภาษี ณ ที่จ่าย:</span>
                  <select
                    value={formData.withholdingTaxRate}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value) || 0;
                      const calcs = recalculate(formData.items, formData.vatRate, rate);
                      setFormData((prev) => ({
                        ...prev,
                        withholdingTaxRate: rate,
                        ...calcs,
                      }));
                    }}
                    className="px-2 py-1 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="1">1% (บริการขนส่ง)</option>
                    <option value="3">3% (บริการทั่วไป)</option>
                    <option value="0">0% (ไม่หัก)</option>
                  </select>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span>VAT:</span>
                  <select
                    value={formData.vatRate}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value) || 0;
                      const calcs = recalculate(formData.items, rate, formData.withholdingTaxRate);
                      setFormData((prev) => ({
                        ...prev,
                        vatRate: rate,
                        ...calcs,
                      }));
                    }}
                    className="px-2 py-1 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="0">0% (ยกเว้น/ไม่คิด)</option>
                    <option value="7">7% (รวมภาษี)</option>
                  </select>
                </label>
              </div>

              <div className="text-right font-mono">
                <div className="text-xs text-slate-500">
                  รวมบริการ: ฿{formatCurrency(formData.subtotal)} | หัก ณ ที่จ่าย:{' '}
                  <span className="text-rose-700">-฿{formatCurrency(formData.withholdingTaxAmount)}</span>
                </div>
                <div className="text-base font-bold text-indigo-900 mt-0.5">
                  ยอดรับชำระสุทธิ: ฿{formatCurrency(formData.totalPayable)}
                </div>
              </div>
            </div>
          </div>

          {/* REQUIREMENT: "ยอดตรวจสอบยืนยัน ไม่ต้องมีในเอกสาร เก็บไว้ในระบบอย่างเดียว" */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span className="font-bold text-amber-900">
                  ยอดตรวจสอบยืนยัน (เก็บไว้ในระบบอย่างเดียว)
                </span>
              </div>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-200">
                🔒 เก็บไว้ในระบบเท่านั้น (ไม่แสดงในเอกสารใบเสร็จ)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-amber-900 font-medium mb-1">
                  ยอดเงินที่ต้องยืนยัน (฿)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.confirmationAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmationAmount: parseFloat(e.target.value) || 0,
                      showConfirmationOnReceipt: false,
                    })
                  }
                  placeholder="2086.50"
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-mono font-bold text-amber-900 text-right"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-amber-900 font-medium mb-1">
                  คำอธิบายยอดเงินยืนยัน (เก็บบันทึกในระบบ)
                </label>
                <input
                  type="text"
                  value={formData.confirmationNote}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmationNote: e.target.value })
                  }
                  placeholder="เช่น ยอดค่าคืนตู้ลาน 127 หรือ ยอดค้างจ่ายหักกับร่มเกล้า"
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-800"
                />
              </div>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-tight">
              * ยอดเงินนี้จะถูก<strong>เก็บรักษาไว้ในฐานข้อมูลของระบบเท่านั้น</strong> เพื่อให้ฝ่ายบัญชีและหัวหน้างานใช้ตรวจเช็ก แต่จะไม่ถูกนำไปลงหรือพิมพ์ในเอกสารใบเสร็จรับเงินที่ส่งให้ลูกค้า
            </p>
          </div>

          {/* CRITICAL REQUIREMENT: "มีไฟล์ให้แนบเพิ่มเติม" (File Attachments) */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-slate-800 text-sm">
                  ไฟล์แนบเพิ่มเติม (ใบเสร็จลานตู้ / สลิปโอนเงิน / ใบกำกับ EIR)
                </span>
              </div>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                + แนบไฟล์เพิ่มเติม
              </button>
            </div>

            {formData.attachments.length === 0 ? (
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                ยังไม่มีไฟล์แนบ กดปุ่ม "+ แนบไฟล์เพิ่มเติม" เพื่ออัปโหลดเอกสารประกอบ
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-slate-800 truncate text-[11px]">
                          {att.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {(att.size / 1024).toFixed(0)} KB · {att.uploadedAt}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onPreview(formData)}
              className="cursor-pointer px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4 text-purple-600" />
              ดูตัวอย่างก่อนพิมพ์ (Preview)
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="cursor-pointer px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-xl transition-all shadow-xs"
              >
                บันทึกเอกสารใบเสร็จ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
