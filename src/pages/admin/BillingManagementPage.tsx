import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { subscribeInvoices, sendPaymentReminder, payInvoice } from '../../services/storageService';
import { Invoice } from '../../types';
import {
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Search,
  Filter,
  Receipt,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { exportFinancialsToCSV } from '../../services/reportService';
import { generateFinancialAnalytics } from '../../services/predictiveService';
import { getAllResidents, getStoredRooms, getStoredTickets } from '../../services/storageService';

export const BillingManagementPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Manual payment modal state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [manualPayMode, setManualPayMode] = useState<'Cash' | 'NetBanking' | 'UPI'>('Cash');
  const [manualRef, setManualRef] = useState<string>('');

  useEffect(() => {
    const unsub = subscribeInvoices(invs => setInvoices(invs));
    return () => unsub();
  }, []);

  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalOutstanding = totalInvoiced - totalCollected;
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
    const matchesSearch = inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (inv.roomNumber && inv.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleSendReminder = async (invoiceId: string) => {
    await sendPaymentReminder(invoiceId);
    setActionMsg(`Urgent payment reminder sent to resident for Invoice ${invoiceId}`);
    setTimeout(() => setActionMsg(null), 4000);
  };

  const handleConfirmManualPay = async () => {
    if (!selectedInvoice) return;
    await payInvoice(selectedInvoice.id, manualPayMode, manualRef || `OFFLINE-${Date.now()}`);
    setSelectedInvoice(null);
    setManualRef('');
    setActionMsg(`Manual payment recorded for ${selectedInvoice.studentName}!`);
    setTimeout(() => setActionMsg(null), 4000);
  };

  return (
    <AppLayout
      activeDomain="dashboard"
      breadcrumbs={[
        { label: 'Finance & Accounts', href: '/admin/dashboard' },
        { label: 'Billing & Invoices' }
      ]}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
              Hostel Billing &amp; Fee Management
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Manage student term dues, mess charges, fee collection tracking, and payment reminders.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                const fin = generateFinancialAnalytics(getAllResidents(), getStoredRooms(), getStoredTickets());
                exportFinancialsToCSV(fin);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: '#ffffff',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <FileSpreadsheet size={15} color="#16a34a" />
              <span>Export Ledger</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {actionMsg && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* KPI Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Invoiced (Term)</span>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
              ₹{totalInvoiced.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{invoices.length} Registered Invoices</div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Collected Inflows</span>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#16a34a', marginTop: '6px' }}>
              ₹{totalCollected.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
              {totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 100}% collection rate
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Outstanding Balance</span>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>
              ₹{totalOutstanding.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Pending resident dues</div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overdue Invoices</span>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: overdueCount > 0 ? '#dc2626' : '#16a34a', marginTop: '6px' }}>
              {overdueCount} Critical
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Past grace period date</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', minWidth: '260px', flex: 1 }}>
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by student name, email, or room..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Paid', 'Pending', 'Overdue'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: filterStatus === st ? 'var(--brand-purple)' : '#f1f5f9',
                  color: filterStatus === st ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices Table */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-default)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border-default)', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px' }}>Invoice ID</th>
                <th style={{ padding: '14px 16px' }}>Student &amp; Room</th>
                <th style={{ padding: '14px 16px' }}>Fee Breakdown</th>
                <th style={{ padding: '14px 16px' }}>Total Due</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px' }}>Due Date</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No invoices matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--brand-purple)' }}>
                      {inv.id}
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>{inv.term}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{inv.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {inv.roomNumber ? `Room ${inv.roomNumber}` : 'Unallocated'} &bull; {inv.studentEmail}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Room: ₹{inv.roomFee} | Mess: ₹{inv.messFee} | Amenity: ₹{inv.amenitiesFee}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{inv.totalAmount.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background:
                            inv.status === 'Paid' ? '#ecfdf5' :
                            inv.status === 'Overdue' ? '#fef2f2' : '#fffbeb',
                          color:
                            inv.status === 'Paid' ? '#047857' :
                            inv.status === 'Overdue' ? '#b91c1c' : '#b45309',
                          border: `1px solid ${
                            inv.status === 'Paid' ? '#a7f3d0' :
                            inv.status === 'Overdue' ? '#fecaca' : '#fde68a'
                          }`
                        }}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {inv.dueDate}
                      {inv.paidAt && (
                        <div style={{ fontSize: '0.7rem', color: '#16a34a' }}>Paid on {new Date(inv.paidAt).toLocaleDateString()}</div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {inv.status !== 'Paid' && (
                          <>
                            <button
                              onClick={() => handleSendReminder(inv.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                background: '#f8fafc',
                                color: 'var(--text-secondary)',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                              title="Send Urgent Reminder"
                            >
                              <Send size={12} color="#f59e0b" />
                              <span>Remind</span>
                            </button>
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                background: 'var(--brand-purple)',
                                color: '#ffffff',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              <CreditCard size={12} />
                              <span>Record Pay</span>
                            </button>
                          </>
                        )}
                        {inv.status === 'Paid' && (
                          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={14} /> Settled
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal: Record Manual Offline Payment */}
        {selectedInvoice && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(3px)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedInvoice(null)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-lg)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                Record Fee Payment
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Invoice {selectedInvoice.id} for <strong>{selectedInvoice.studentName}</strong> (₹{selectedInvoice.totalAmount.toLocaleString()})
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>Payment Mode:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {(['Cash', 'NetBanking', 'UPI'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setManualPayMode(mode)}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: manualPayMode === mode ? '2px solid var(--brand-purple)' : '1px solid var(--border-default)',
                        background: manualPayMode === mode ? '#f5f3ff' : '#ffffff',
                        color: manualPayMode === mode ? 'var(--brand-purple)' : 'var(--text-primary)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>Receipt / Bank Reference No (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. REC-9921 or UTR-202611"
                  value={manualRef}
                  onChange={e => setManualRef(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '0.825rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-default)', background: '#ffffff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmManualPay}
                  style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'var(--brand-purple)', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Confirm Settlement
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};
