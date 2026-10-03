import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { subscribeInvoices, payInvoice } from '../../services/storageService';
import { Invoice } from '../../types';
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  ShieldCheck,
  QrCode,
  Smartphone,
  Building,
  Check
} from 'lucide-react';

export const ResidentBillingPage: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeInvoices(allInvs => {
      // Find invoices strictly for current authenticated user or demo resident
      const userInvs = allInvs.filter(i =>
        i.studentUid === user?.uid ||
        i.studentUid === user?.id ||
        i.studentEmail.toLowerCase() === user?.email?.toLowerCase() ||
        (user?.email === 'resident@campus.edu' && (i.studentUid === 'res-demo' || i.studentEmail.includes('resident@campus.edu')))
      );
      setInvoices(userInvs);
    });
    return () => unsub();
  }, [user]);

  const activeInvoice = invoices[0] || (user?.email === 'resident@campus.edu' ? {
    id: 'INV-2026-001',
    studentUid: user?.id || 'res-demo',
    studentName: user?.name || 'Rahul Sharma',
    studentEmail: user?.email || 'resident@campus.edu',
    roomNumber: user?.roomNumber || '204',
    term: 'Spring Term 2026',
    roomFee: 6500,
    messFee: 4200,
    amenitiesFee: 500,
    totalAmount: 11200,
    amountPaid: 0,
    status: 'Pending',
    dueDate: '2026-04-05',
    createdAt: '2026-03-01T08:00:00Z'
  } : null);

  const handleSimulatedPayment = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      const txRef = `UPI/${new Date().getFullYear()}${String(Date.now()).slice(-8)}`;
      await payInvoice(activeInvoice.id, selectedMethod === 'UPI' ? 'UPI' : selectedMethod === 'Card' ? 'Card' : 'NetBanking', txRef);
      setIsProcessing(false);
      setIsPayModalOpen(false);
      setSuccessMsg(`Payment of ₹${activeInvoice.totalAmount.toLocaleString()} successful! Ref: ${txRef}`);
    }, 1200);
  };

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[
        { label: 'Resident Portal', href: '/dashboard' },
        { label: 'Fee Statement & Payments' }
      ]}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Banner */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px 28px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '6px', background: '#eff6ff', color: 'var(--brand-blue)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              <CreditCard size={14} /> Official Fee Desk
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Fees &amp; Digital Payments
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              View approved institutional fee schedules, payment receipts, and instant settlement gateway.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-default)',
              background: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Printer size={15} />
            <span>Print Statement</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '14px 18px', borderRadius: '10px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18} color="#059669" />
            <div>
              <strong>Payment Confirmed!</strong>
              <div style={{ fontSize: '0.78rem', marginTop: '2px' }}>{successMsg}</div>
            </div>
          </div>
        )}

        {!activeInvoice ? (
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-default)', padding: '56px 24px', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              Zero Balance &bull; All Hostel Fees Cleared
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto' }}>
              You do not have any outstanding dues for the current academic session. Whenever a new fee schedule is published by Accounts Administration, it will appear here.
            </p>
          </div>
        ) : (
          /* Invoice Statement Card */
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-default)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Invoice Statement #{activeInvoice.id}
                </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                {activeInvoice.term} Accommodation &amp; Mess
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Issued to: <strong>{activeInvoice.studentName}</strong> ({activeInvoice.studentEmail}) &bull; Room {activeInvoice.roomNumber || 'A-204'}
              </div>
            </div>

            <div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '16px',
                  background:
                    activeInvoice.status === 'Paid' ? '#ecfdf5' :
                    activeInvoice.status === 'Overdue' ? '#fef2f2' : '#fffbeb',
                  color:
                    activeInvoice.status === 'Paid' ? '#047857' :
                    activeInvoice.status === 'Overdue' ? '#b91c1c' : '#b45309',
                  border: `1px solid ${
                    activeInvoice.status === 'Paid' ? '#a7f3d0' :
                    activeInvoice.status === 'Overdue' ? '#fecaca' : '#fde68a'
                  }`
                }}
              >
                {activeInvoice.status}
              </span>
            </div>
          </div>

          {/* Breakdown Items */}
          <div style={{ padding: '24px 28px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-default)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ paddingBottom: '10px' }}>Description / Head</th>
                  <th style={{ paddingBottom: '10px' }}>Billing Cycle</th>
                  <th style={{ paddingBottom: '10px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 0' }}>
                    <strong>Hostel Room Fee</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standard Double Occupancy &bull; Block A</div>
                  </td>
                  <td style={{ padding: '14px 0', color: 'var(--text-muted)' }}>Semester Term</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 600 }}>₹{activeInvoice.roomFee.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 0' }}>
                    <strong>Mess Catering &amp; Dining Fee</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unlimited 4-meal daily meal plan</div>
                  </td>
                  <td style={{ padding: '14px 0', color: 'var(--text-muted)' }}>Semester Term</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 600 }}>₹{activeInvoice.messFee.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 0' }}>
                    <strong>Campus Wi-Fi &amp; Maintenance Surcharge</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-speed connectivity &amp; 24/7 power backup</div>
                  </td>
                  <td style={{ padding: '14px 0', color: 'var(--text-muted)' }}>Semester Term</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 600 }}>₹{activeInvoice.amenitiesFee.toLocaleString()}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ paddingTop: '16px', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    Total Term Dues:
                  </td>
                  <td style={{ paddingTop: '16px', textAlign: 'right', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    ₹{activeInvoice.totalAmount.toLocaleString()}
                  </td>
                </tr>
                {activeInvoice.paidAt && (
                  <tr>
                    <td colSpan={2} style={{ paddingTop: '8px', fontSize: '0.78rem', color: '#16a34a' }}>
                      Settled on {new Date(activeInvoice.paidAt).toLocaleDateString()} ({activeInvoice.transactionRef})
                    </td>
                    <td style={{ paddingTop: '8px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>
                      -₹{activeInvoice.amountPaid.toLocaleString()}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          {/* Bottom Action Footer */}
          <div style={{ background: '#f8fafc', padding: '20px 28px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Clock size={16} />
              <span>Due by: <strong>{activeInvoice.dueDate}</strong></span>
            </div>

            {activeInvoice.status !== 'Paid' ? (
              <button
                onClick={() => setIsPayModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--brand-purple)',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <CreditCard size={16} />
                <span>Pay ₹{activeInvoice.totalAmount.toLocaleString()} Online</span>
              </button>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '0.85rem' }}>
                <ShieldCheck size={18} />
                <span>Payment Verified &amp; Cleared</span>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Modal: Interactive Payment Gateway Simulation */}
        {isPayModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setIsPayModalOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                background: '#ffffff',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: 'var(--shadow-lg)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Campus Online Payment Gateway
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>256-Bit SSL</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-default)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payable Amount</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-purple)' }}>
                    ₹{activeInvoice.totalAmount.toLocaleString()}
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {activeInvoice.id}<br />
                  {activeInvoice.term}
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>Select Payment Method:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPI')}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '8px',
                      border: selectedMethod === 'UPI' ? '2px solid var(--brand-purple)' : '1px solid var(--border-default)',
                      background: selectedMethod === 'UPI' ? '#f5f3ff' : '#ffffff',
                      color: selectedMethod === 'UPI' ? 'var(--brand-purple)' : 'var(--text-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Smartphone size={18} />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Card')}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '8px',
                      border: selectedMethod === 'Card' ? '2px solid var(--brand-purple)' : '1px solid var(--border-default)',
                      background: selectedMethod === 'Card' ? '#f5f3ff' : '#ffffff',
                      color: selectedMethod === 'Card' ? 'var(--brand-purple)' : 'var(--text-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <CreditCard size={18} />
                    <span>Debit/Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('NetBanking')}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '8px',
                      border: selectedMethod === 'NetBanking' ? '2px solid var(--brand-purple)' : '1px solid var(--border-default)',
                      background: selectedMethod === 'NetBanking' ? '#f5f3ff' : '#ffffff',
                      color: selectedMethod === 'NetBanking' ? 'var(--brand-purple)' : 'var(--text-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Building size={18} />
                    <span>NetBanking</span>
                  </button>
                </div>
              </div>

              {selectedMethod === 'UPI' && (
                <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1', marginBottom: '20px' }}>
                  <QrCode size={96} style={{ margin: '0 auto 8px auto', display: 'block' }} color="#1e1b4b" />
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Scan with GPay, PhonePe, or Paytm</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>UPI ID: smarthostel.aravali@icici</div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  disabled={isProcessing}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-default)', background: '#ffffff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSimulatedPayment}
                  disabled={isProcessing}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--brand-purple)',
                    color: '#ffffff',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: isProcessing ? 'wait' : 'pointer'
                  }}
                >
                  {isProcessing ? 'Verifying Gateway...' : `Authorize ₹${activeInvoice.totalAmount.toLocaleString()}`}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};
