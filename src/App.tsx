/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TripRecord, FilterState, FuelStats } from './types/logistics';
import { CompanySettings, Customer, ReceiptDocument } from './types/billing';
import { ExpenseRecord, JobOrder, MaintenanceRecord } from './types/fleetOps';
import { INITIAL_TRIPS } from './data/initialTrips';
import {
  INITIAL_COMPANY_SETTINGS,
  INITIAL_CUSTOMERS,
  INITIAL_RECEIPTS,
} from './data/initialBillingData';
import {
  INITIAL_EXPENSES,
  INITIAL_JOB_ORDERS,
  INITIAL_MAINTENANCE,
} from './data/initialFleetOps';
import { parseThaiDateToDayIndex } from './utils/formatters';
import { TopNav } from './components/TopNav';
import { KPICards } from './components/KPICards';
import { FilterBar } from './components/FilterBar';
import { ChartsSection } from './components/ChartsSection';
import { TripTable } from './components/TripTable';
import { TripModal } from './components/TripModal';
import { FuelCalculatorModal } from './components/FuelCalculatorModal';
import { ImportExportModal } from './components/ImportExportModal';
import { AnalyticsView } from './components/AnalyticsView';
import { ReceiptManager } from './components/ReceiptManager';
import { ReceiptModal } from './components/ReceiptModal';
import { ReceiptPrintPreview } from './components/ReceiptPrintPreview';
import { CompanySettingsModal } from './components/CompanySettingsModal';
import { CustomerModal } from './components/CustomerModal';
import { ExpenseManager } from './components/ExpenseManager';
import { ExpenseModal } from './components/ExpenseModal';
import { ExpensePrintPreview } from './components/ExpensePrintPreview';
import { JobOrderManager } from './components/JobOrderManager';
import { JobOrderModal } from './components/JobOrderModal';
import { JobOrderPrintPreview } from './components/JobOrderPrintPreview';
import { MaintenanceManager } from './components/MaintenanceManager';
import { MaintenanceModal } from './components/MaintenanceModal';
import { MaintenancePrintPreview } from './components/MaintenancePrintPreview';

const STORAGE_KEY_TRIPS = 'fleet_logistics_trips_v1';
const STORAGE_KEY_FUEL = 'fleet_logistics_fuel_v1';
const STORAGE_KEY_RECEIPTS = 'fleet_logistics_receipts_v1';
const STORAGE_KEY_COMPANY = 'fleet_logistics_company_v1';
const STORAGE_KEY_CUSTOMERS = 'fleet_logistics_customers_v1';
const STORAGE_KEY_EXPENSES = 'fleet_logistics_expenses_v1';
const STORAGE_KEY_JOB_ORDERS = 'fleet_logistics_job_orders_v1';
const STORAGE_KEY_MAINTENANCE = 'fleet_logistics_maintenance_v1';

export default function App() {
  // 1. Trips
  const [trips, setTrips] = useState<TripRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRIPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load trips from storage', e);
    }
    return INITIAL_TRIPS;
  });

  // 2. Fuel stats
  const [fuelStats, setFuelStats] = useState<FuelStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FUEL);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load fuel stats', e);
    }
    return {
      totalKm: 1480,
      fuelLiters: 470,
      fuelPricePerLiter: 32.5,
    };
  });

  // 3. Company Settings
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPANY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load company settings', e);
    }
    return INITIAL_COMPANY_SETTINGS;
  });

  // 4. Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load customers', e);
    }
    return INITIAL_CUSTOMERS;
  });

  // 5. Receipts
  const [receipts, setReceipts] = useState<ReceiptDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECEIPTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load receipts', e);
    }
    return INITIAL_RECEIPTS;
  });

  // 6. Expenses (Editable & Attachments)
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXPENSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load expenses', e);
    }
    return INITIAL_EXPENSES;
  });

  // 7. Job Orders (ใบสั่งงานขนส่ง)
  const [jobOrders, setJobOrders] = useState<JobOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JOB_ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load job orders', e);
    }
    return INITIAL_JOB_ORDERS;
  });

  // 8. Maintenance Records (ประวัติการซ่อมบำรุง)
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MAINTENANCE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load maintenance records', e);
    }
    return INITIAL_MAINTENANCE;
  });

  // Active top navigation tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Filter state for trips
  const [filters, setFilters] = useState<FilterState>({
    startDate: '01/09/2569',
    endDate: '30/09/2569',
    driver: 'โจ้',
    containerSize: 'ทั้งหมด',
    shift: 'ทั้งหมด',
    searchQuery: '',
    paymentStatus: 'all',
  });

  // Trip & General Modals
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripRecord | null>(null);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  // Billing Modals
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<ReceiptDocument | null>(null);
  const [previewReceipt, setPreviewReceipt] = useState<ReceiptDocument | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Expense Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [previewExpense, setPreviewExpense] = useState<ExpenseRecord | null>(null);
  const [previewAllExpenses, setPreviewAllExpenses] = useState<ExpenseRecord[] | null>(null);

  // Job Order Modals
  const [isJobOrderModalOpen, setIsJobOrderModalOpen] = useState(false);
  const [editingJobOrder, setEditingJobOrder] = useState<JobOrder | null>(null);
  const [previewJobOrder, setPreviewJobOrder] = useState<JobOrder | null>(null);

  // Maintenance Modals
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceRecord | null>(null);
  const [previewMaintenance, setPreviewMaintenance] = useState<MaintenanceRecord | null>(null);
  const [previewAllMaintenance, setPreviewAllMaintenance] = useState<MaintenanceRecord[] | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
    } catch (e) {
      console.error('Error saving trips', e);
    }
  }, [trips]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FUEL, JSON.stringify(fuelStats));
    } catch (e) {
      console.error('Error saving fuel stats', e);
    }
  }, [fuelStats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPANY, JSON.stringify(companySettings));
    } catch (e) {
      console.error('Error saving company settings', e);
    }
  }, [companySettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.error('Error saving customers', e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(receipts));
    } catch (e) {
      console.error('Error saving receipts', e);
    }
  }, [receipts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error('Error saving expenses', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JOB_ORDERS, JSON.stringify(jobOrders));
    } catch (e) {
      console.error('Error saving job orders', e);
    }
  }, [jobOrders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MAINTENANCE, JSON.stringify(maintenanceRecords));
    } catch (e) {
      console.error('Error saving maintenance records', e);
    }
  }, [maintenanceRecords]);

  // Unique drivers list
  const availableDrivers = useMemo(() => {
    const set = new Set<string>();
    trips.forEach((t) => {
      if (t.driver) set.add(t.driver);
    });
    return Array.from(set);
  }, [trips]);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    const startDayIndex = parseThaiDateToDayIndex(filters.startDate);
    const endDayIndex = parseThaiDateToDayIndex(filters.endDate);
    const query = filters.searchQuery.trim().toLowerCase();

    return trips.filter((t) => {
      if (filters.driver !== 'ทั้งหมด' && t.driver !== filters.driver) {
        return false;
      }
      if (startDayIndex > 0 || endDayIndex > 0) {
        const itemDayIndex = parseThaiDateToDayIndex(t.date);
        if (startDayIndex > 0 && itemDayIndex < startDayIndex) return false;
        if (endDayIndex > 0 && itemDayIndex > endDayIndex) return false;
      }
      if (filters.containerSize !== 'ทั้งหมด' && t.size !== filters.containerSize) {
        return false;
      }
      if (filters.shift !== 'ทั้งหมด' && t.shift !== filters.shift) {
        return false;
      }
      if (filters.paymentStatus === 'settled' && t.pendingBalance > 0) {
        return false;
      }
      if (filters.paymentStatus === 'pending' && t.pendingBalance <= 0) {
        return false;
      }
      if (query) {
        const match =
          t.containerNo.toLowerCase().includes(query) ||
          t.route.toLowerCase().includes(query) ||
          t.depot.toLowerCase().includes(query) ||
          t.company.toLowerCase().includes(query) ||
          t.note.toLowerCase().includes(query) ||
          t.paymentDate.toLowerCase().includes(query);
        if (!match) return false;
      }
      return true;
    });
  }, [trips, filters]);

  // Handlers for Trips
  const handleSaveTrip = (newTrip: TripRecord) => {
    setTrips((prev) => {
      const idx = prev.findIndex((t) => t.id === newTrip.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newTrip;
        return copy;
      }
      return [newTrip, ...prev];
    });
    setEditingTrip(null);
  };

  const handleDeleteTrip = (id: string) => {
    if (confirm('คุณต้องการลบรายการเที่ยววิ่งนี้ใช่หรือไม่?')) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleQuickSettle = (trip: TripRecord) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === trip.id
          ? {
              ...t,
              pendingBalance: 0,
              paymentDate: `ชำระแล้ว ${new Date().toLocaleDateString('th-TH')}`,
            }
          : t
      )
    );
  };

  const handleResetData = () => {
    if (confirm('รีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้นใช่หรือไม่?')) {
      setTrips(INITIAL_TRIPS);
      setFuelStats({
        totalKm: 1480,
        fuelLiters: 470,
        fuelPricePerLiter: 32.5,
      });
      setReceipts(INITIAL_RECEIPTS);
      setCustomers(INITIAL_CUSTOMERS);
      setCompanySettings(INITIAL_COMPANY_SETTINGS);
      setExpenses(INITIAL_EXPENSES);
      setJobOrders(INITIAL_JOB_ORDERS);
      setMaintenanceRecords(INITIAL_MAINTENANCE);
      setFilters({
        startDate: '01/09/2569',
        endDate: '30/09/2569',
        driver: 'โจ้',
        containerSize: 'ทั้งหมด',
        shift: 'ทั้งหมด',
        searchQuery: '',
        paymentStatus: 'all',
      });
    }
  };

  const handleImportTrips = (newTrips: TripRecord[]) => {
    setTrips(newTrips);
  };

  // Handlers for Receipts
  const handleSaveReceipt = (receipt: ReceiptDocument) => {
    setReceipts((prev) => {
      const idx = prev.findIndex((r) => r.id === receipt.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = receipt;
        return copy;
      }
      return [receipt, ...prev];
    });
    setEditingReceipt(null);
  };

  const handleDeleteReceipt = (id: string) => {
    if (confirm('ต้องการลบใบเสร็จรับเงินนี้ใช่หรือไม่?')) {
      setReceipts((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleCreateReceiptFromTrip = (trip: TripRecord) => {
    const cust =
      customers.find((c) => c.name.toLowerCase().includes((trip.company || '').toLowerCase())) ||
      customers[0];

    const sub = trip.freightFee + trip.otherFee;
    const wht = sub * 0.01;

    const newDoc: ReceiptDocument = {
      id: `RC-${Date.now()}`,
      receiptNo: `RC-${Math.floor(100000 + Math.random() * 900000)}`,
      invoiceNo: trip.note ? `INV-${trip.note}` : `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      date: trip.date || new Date().toLocaleDateString('th-TH'),
      dueDate: new Date(Date.now() + 15 * 86400000).toLocaleDateString('th-TH'),
      customerId: cust?.id || '',
      customerName: cust?.name || trip.company || 'บริษัทลูกค้า',
      customerAddress: cust?.address || '',
      customerTaxId: cust?.taxId || '',
      customerBranch: cust?.branch || 'สำนักงานใหญ่',
      items: [
        {
          id: `ITEM-${Date.now()}`,
          description: `ค่าบริการขนส่งตู้คอนเทนเนอร์ ${trip.size} (${trip.route})`,
          containerNo: trip.containerNo,
          route: trip.route,
          qty: 1,
          unitPrice: sub,
          amount: sub,
        },
      ],
      subtotal: sub,
      vatRate: 0,
      vatAmount: 0,
      withholdingTaxRate: 1,
      withholdingTaxAmount: wht,
      totalPayable: sub - wht,
      confirmationAmount: trip.depotFee || trip.pendingBalance || 0,
      confirmationNote: `ยอดค่าคืนตู้ลาน ${trip.depot} สำหรับยืนยันการเคลียร์รอบงาน`,
      showConfirmationOnReceipt: false,
      isConfirmed: true,
      paymentMethod: 'โอนเงินผ่านธนาคาร',
      notes: `อ้างอิงรอบงาน ${trip.driver} (${trip.shift}) เลขที่ ${trip.note || '-'}`,
      attachments: [],
      status: trip.pendingBalance > 0 ? 'รอยืนยัน' : 'ชำระแล้ว',
      tripIds: [trip.id],
    };

    setEditingReceipt(newDoc);
    setIsReceiptModalOpen(true);
  };

  const handleSaveCustomer = (customer: Customer) => {
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.id === customer.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = customer;
        return copy;
      }
      return [...prev, customer];
    });
    setEditingCustomer(null);
  };

  // Handlers for Expenses
  const handleSaveExpense = (expense: ExpenseRecord) => {
    setExpenses((prev) => {
      const idx = prev.findIndex((e) => e.id === expense.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = expense;
        return copy;
      }
      return [expense, ...prev];
    });
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('ต้องการลบรายการค่าใช้จ่ายนี้ใช่หรือไม่?')) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Handlers for Job Orders
  const handleSaveJobOrder = (order: JobOrder) => {
    setJobOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === order.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = order;
        return copy;
      }
      return [order, ...prev];
    });
    setEditingJobOrder(null);
  };

  const handleDeleteJobOrder = (id: string) => {
    if (confirm('ต้องการลบใบสั่งงานขนส่งนี้ใช่หรือไม่?')) {
      setJobOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  // Handlers for Maintenance
  const handleSaveMaintenance = (record: MaintenanceRecord) => {
    setMaintenanceRecords((prev) => {
      const idx = prev.findIndex((r) => r.id === record.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = record;
        return copy;
      }
      return [record, ...prev];
    });
    setEditingMaintenance(null);
  };

  const handleDeleteMaintenance = (id: string) => {
    if (confirm('ต้องการลบประวัติการซ่อมบำรุงนี้ใช่หรือไม่?')) {
      setMaintenanceRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-16">
      {/* Top Header */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingTrip(null);
          setIsTripModalOpen(true);
        }}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onResetData={handleResetData}
        totalTrips={trips.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        {/* KPI Summary Cards (Pastel Tone) - displayed on overview & trips & analytics */}
        {(activeTab === 'overview' || activeTab === 'table' || activeTab === 'analytics') && (
          <KPICards
            trips={filteredTrips}
            fuelStats={fuelStats}
            onOpenFuelModal={() => setIsFuelModalOpen(true)}
          />
        )}

        {/* Filter Bar with presets (on overview & table) */}
        {(activeTab === 'overview' || activeTab === 'table') && (
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            availableDrivers={availableDrivers}
            totalMatches={filteredTrips.length}
          />
        )}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <ChartsSection trips={filteredTrips} />
            <TripTable
              trips={filteredTrips}
              onEditTrip={(trip) => {
                setEditingTrip(trip);
                setIsTripModalOpen(true);
              }}
              onDeleteTrip={handleDeleteTrip}
              onQuickSettle={handleQuickSettle}
              onCreateReceiptFromTrip={handleCreateReceiptFromTrip}
              onOpenReceiptsTab={() => setActiveTab('receipts')}
            />
          </div>
        )}

        {/* Tab 2: Trips Table */}
        {activeTab === 'table' && (
          <div className="space-y-6">
            <TripTable
              trips={filteredTrips}
              onEditTrip={(trip) => {
                setEditingTrip(trip);
                setIsTripModalOpen(true);
              }}
              onDeleteTrip={handleDeleteTrip}
              onQuickSettle={handleQuickSettle}
              onCreateReceiptFromTrip={handleCreateReceiptFromTrip}
              onOpenReceiptsTab={() => setActiveTab('receipts')}
            />
          </div>
        )}

        {/* Tab 3: Job Orders (ใบสั่งงานขนส่ง) */}
        {activeTab === 'jobOrders' && (
          <JobOrderManager
            orders={jobOrders}
            onOpenCreateModal={() => {
              setEditingJobOrder(null);
              setIsJobOrderModalOpen(true);
            }}
            onEditOrder={(order) => {
              setEditingJobOrder(order);
              setIsJobOrderModalOpen(true);
            }}
            onPreviewOrder={(order) => {
              setPreviewJobOrder(order);
            }}
            onDeleteOrder={handleDeleteJobOrder}
          />
        )}

        {/* Tab 4: Expenses (ค่าใช้จ่าย & แนบไฟล์) */}
        {activeTab === 'expenses' && (
          <ExpenseManager
            expenses={expenses}
            onOpenAddModal={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
            onEditExpense={(exp) => {
              setEditingExpense(exp);
              setIsExpenseModalOpen(true);
            }}
            onDeleteExpense={handleDeleteExpense}
            onPrintExpense={(exp) => {
              setPreviewExpense(exp);
              setPreviewAllExpenses(null);
            }}
            onPrintAllExpenses={(list) => {
              setPreviewExpense(null);
              setPreviewAllExpenses(list);
            }}
          />
        )}

        {/* Tab 5: Maintenance (ประวัติการซ่อมบำรุง) */}
        {activeTab === 'maintenance' && (
          <MaintenanceManager
            records={maintenanceRecords}
            onOpenAddModal={() => {
              setEditingMaintenance(null);
              setIsMaintenanceModalOpen(true);
            }}
            onEditRecord={(rec) => {
              setEditingMaintenance(rec);
              setIsMaintenanceModalOpen(true);
            }}
            onDeleteRecord={handleDeleteMaintenance}
            onPrintRecord={(rec) => {
              setPreviewMaintenance(rec);
              setPreviewAllMaintenance(null);
            }}
            onPrintAllRecords={(list) => {
              setPreviewMaintenance(null);
              setPreviewAllMaintenance(list);
            }}
          />
        )}

        {/* Tab 6: Receipts & Invoices */}
        {activeTab === 'receipts' && (
          <ReceiptManager
            receipts={receipts}
            onOpenCreateModal={() => {
              setEditingReceipt(null);
              setIsReceiptModalOpen(true);
            }}
            onEditReceipt={(rc) => {
              setEditingReceipt(rc);
              setIsReceiptModalOpen(true);
            }}
            onPreviewReceipt={(rc) => {
              setPreviewReceipt(rc);
            }}
            onDeleteReceipt={handleDeleteReceipt}
            companySettings={companySettings}
            onOpenCompanySettings={() => setIsCompanyModalOpen(true)}
          />
        )}

        {/* Tab 7: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <AnalyticsView trips={filteredTrips} fuelStats={fuelStats} />
            <ChartsSection trips={filteredTrips} />
          </div>
        )}
      </main>

      {/* Trip Modals */}
      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => {
          setIsTripModalOpen(false);
          setEditingTrip(null);
        }}
        onSave={handleSaveTrip}
        initialTrip={editingTrip}
      />

      <FuelCalculatorModal
        isOpen={isFuelModalOpen}
        onClose={() => setIsFuelModalOpen(false)}
        stats={fuelStats}
        onSave={(newStats) => setFuelStats(newStats)}
        totalFreight={filteredTrips.reduce((s, t) => s + t.freightFee, 0)}
      />

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        trips={filteredTrips}
        onImportTrips={handleImportTrips}
      />

      {/* Billing & Receipt Modals */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setEditingReceipt(null);
        }}
        onSave={handleSaveReceipt}
        onPreview={(doc) => setPreviewReceipt(doc)}
        initialReceipt={editingReceipt}
        customers={customers}
        onOpenCustomerModal={(cust) => {
          setEditingCustomer(cust || null);
          setIsCustomerModalOpen(true);
        }}
        trips={trips}
      />

      {previewReceipt && (
        <ReceiptPrintPreview
          isOpen={!!previewReceipt}
          onClose={() => setPreviewReceipt(null)}
          receipt={previewReceipt}
          company={companySettings}
        />
      )}

      <CompanySettingsModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        settings={companySettings}
        onSave={(newSettings) => setCompanySettings(newSettings)}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setEditingCustomer(null);
        }}
        initialCustomer={editingCustomer}
        onSave={handleSaveCustomer}
      />

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        initialExpense={editingExpense}
        drivers={availableDrivers}
      />

      {/* Job Order Modals */}
      <JobOrderModal
        isOpen={isJobOrderModalOpen}
        onClose={() => {
          setIsJobOrderModalOpen(false);
          setEditingJobOrder(null);
        }}
        onSave={handleSaveJobOrder}
        onPreview={(order) => setPreviewJobOrder(order)}
        initialOrder={editingJobOrder}
        customers={customers}
        drivers={availableDrivers}
      />

      {previewJobOrder && (
        <JobOrderPrintPreview
          isOpen={!!previewJobOrder}
          onClose={() => setPreviewJobOrder(null)}
          order={previewJobOrder}
          company={companySettings}
        />
      )}

      {/* Maintenance Modal */}
      <MaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => {
          setIsMaintenanceModalOpen(false);
          setEditingMaintenance(null);
        }}
        onSave={handleSaveMaintenance}
        initialRecord={editingMaintenance}
        drivers={availableDrivers}
      />

      {/* Expense Print Preview Modal */}
      {(previewExpense || previewAllExpenses) && (
        <ExpensePrintPreview
          isOpen={!!previewExpense || !!previewAllExpenses}
          onClose={() => {
            setPreviewExpense(null);
            setPreviewAllExpenses(null);
          }}
          expense={previewExpense}
          expensesList={previewAllExpenses || []}
          company={companySettings}
        />
      )}

      {/* Maintenance Print Preview Modal */}
      {(previewMaintenance || previewAllMaintenance) && (
        <MaintenancePrintPreview
          isOpen={!!previewMaintenance || !!previewAllMaintenance}
          onClose={() => {
            setPreviewMaintenance(null);
            setPreviewAllMaintenance(null);
          }}
          record={previewMaintenance}
          recordsList={previewAllMaintenance || []}
          company={companySettings}
        />
      )}
    </div>
  );
}
