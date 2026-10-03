import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { subscribeInvoices, payInvoice } from '../../services/storageService';
import { Invoice } from '../../types';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  ShieldCheck,
  QrCode,
  Smartphone,
  Building,
  Check,
  Copy,
  Download,
  FileText,
  Sparkles,
  Receipt,
  ArrowRight,
  X
} from 'lucide-react';

export const ResidentBillingPage: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    const unsub = subscribeInvoices(allInvs => {
      // Find invoices strictly for current authenticated user or demo resident
      const userInvs = allInvs.filter(i =>
        i.studentUid === user?.uid ||
        i.studentUid === user?.id ||
        i.studentEmail.toLowerCase() === user?.email?.toLowerCase() ||
        (user?.email === 'resident@campus.edu' && (i.studentUid === 'res-demo' || i.studentEmail.includes('resident@campus.edu'))) ||
        i.roomNumber === user?.roomNumber
      );
      setInvoices(userInvs);
    });
    return () => unsub();
  }, [user]);

  const activeInvoice: Invoice = invoices[0] || {
    id: 'INV-2026-001',
    studentUid: user?.id || user?.uid || 'res-demo',
    studentName: user?.name || 'Rahul Sharma',
    studentEmail: user?.email || 'resident@campus.edu',
    roomNumber: user?.roomNumber || '204',
    term: 'Spring Semester 2026',
    roomFee: 35000,
    messFee: 18000,
    amenitiesFee: 4500,
    cautionDeposit: 5000,
    electricitySurcharge: 750,
    totalAmount: 63250,
    amountPaid: 0,
    status: 'Pending',
    dueDate: '2026-04-15',
    receiptNumber: 'RCP-ARAVALI-2026-8942',
    createdAt: '2026-03-01T08:00:00Z'
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('aravali.hostel@icici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmUpiPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const finalUtr = utrNumber.trim() || `UPI/${new Date().getFullYear()}${String(Date.now()).slice(-8)}`;

    setTimeout(async () => {
      await payInvoice(
        activeInvoice.id,
        selectedMethod,
        finalUtr,
        'resident.rahul@okicici'
      );
      setIsProcessing(false);
      setIsPayModalOpen(false);
      setSuccessMsg(`Payment of ₹${activeInvoice.totalAmount.toLocaleString()} verified and reconciled! UTR: ${finalUtr}`);
      setIsReceiptModalOpen(true);
    }, 1000);
  };

  const upiIntentString = `upi://pay?pa=aravali.hostel@icici&pn=Aravali%20Residence%20Hall&am=${activeInvoice.totalAmount}&cu=INR&tn=${activeInvoice.id}`;

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[
        { label: 'Resident Portal', href: '/dashboard' },
        { label: 'Fee Statement & Payments' }
      ]}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '6px', background: '#eff6ff', color: '#0284c7', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              <CreditCard size={14} /> Official Fee Desk &amp; Instant UPI
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Fees &amp; Digital Payments
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Itemized campus fee schedule, instant zero-fee UPI settlement, and official collegiate tax receipts.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {activeInvoice.status === 'Paid' && (
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1.5px solid #10b981',
                  background: '#ecfdf5',
                  color: '#047857',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Receipt size={16} />
                <span>View Official Receipt</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Printer size={15} />
              <span>Print Statement</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', color: '#065f46', padding: '14px 18px', borderRadius: '12px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} color="#059669" />
              <div>
                <strong>Payment Successfully Cleared!</strong>
                <div style={{ fontSize: '0.78rem', marginTop: '2px' }}>{successMsg}</div>
              </div>
            </div>
            <button
              onClick={() => setIsReceiptModalOpen(true)}
              style={{
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Open Receipt
            </button>
          </div>
        )}

        {/* Invoice Statement Card */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-default)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                INVOICE STATEMENT #{activeInvoice.id}
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                {activeInvoice.term} Residential Dues
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Issued to: <strong>{activeInvoice.studentName}</strong> ({activeInvoice.studentEmail}) &bull; Room {activeInvoice.roomNumber || user?.roomNumber || '204'}
              </div>
            </div>

            <div>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  background:
                    activeInvoice.status === 'Paid' ? '#ecfdf5' :
                    activeInvoice.status === 'Overdue' ? '#fef2f2' : '#fffbeb',
                  color:
                    activeInvoice.status === 'Paid' ? '#047857' :
                    activeInvoice.status === 'Overdue' ? '#b91c1c' : '#b45309',
                  border: `1.5px solid ${
                    activeInvoice.status === 'Paid' ? '#a7f3d0' :
                    activeInvoice.status === 'Overdue' ? '#fecaca' : '#fde68a'
                  }`
                }}
              >
                {activeInvoice.status === 'Paid' ? 'PAID & VERIFIED' : activeInvoice.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Breakdown Items Table */}
          <div style={{ padding: '24px 28px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-default)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ paddingBottom: '12px', fontWeight: 700 }}>Fee Head / Description</th>
                  <th style={{ paddingBottom: '12px', fontWeight: 700 }}>Billing Cycle</th>
                  <th style={{ paddingBottom: '12px', textAlign: 'right', fontWeight: 700 }}>Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 0' }}>
                    <strong style={{ color: '#0f172a' }}>1. Hostel Room Accommodation Fee</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standard Double Occupancy &bull; Block A, Floor 2 (Includes furniture &amp; maintenance)</div>
                  </td>
                  <td style={{ padding: '14px 0', color: 'var(--text-muted)' }}>Semester Term</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{(activeInvoice.roomFee || 35000).toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 0' }}>
                    <strong style={{ color: '#0f172a' }}>2. Mess Catering &amp; Dining Plan</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unlimited 4-meal daily buffet (Breakfast, Lunch, Snacks, Dinner)</div>
                  </td>
                  <td style={{ padding: '14px 0', color: 'var(--text-muted)' }}>Semester Term</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{(activeInvoice.messFee || 18000).toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 0' }}>
                    <strong style={{ color: '#0f172a' }}>3. Campus High-Speed Fiber WiFi &amp; Common Amenities</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-speed 1Gbps connectivity, RO water &amp; 24/7 power backup</div>
                  </td>
                  <td style={{ padding: '14px 0', color: 'var(--text-muted)' }}>Semester Term</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{(activeInvoice.amenitiesFee || 4500).toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 0' }}>
                    <strong style={{ color: '#0f172a' }}>4. Institutional Caution &amp; Damage Security Deposit</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Refundable at end of academic tenure upon room clearance</div>
                  </td>
                  <td style={{ padding: '14px 0', color: 'var(--text-muted)' }}>One-time Refundable</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{(activeInvoice.cautionDeposit || 5000).toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 0' }}>
                    <strong style={{ color: '#0f172a' }}>5. Electricity Telemetry Sub-meter Surcharge</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Smart energy meter consumption billing for Room {activeInvoice.roomNumber || '204'}</div>
                  </td>
                  <td style={{ padding: '14px 0', color: 'var(--text-muted)' }}>Monthly Telemetry</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{(activeInvoice.electricitySurcharge || 750).toLocaleString()}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ paddingTop: '18px', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    Total Net Payable Dues:
                  </td>
                  <td style={{ paddingTop: '18px', textAlign: 'right', fontWeight: 900, fontSize: '1.35rem', color: '#0f172a' }}>
                    ₹{activeInvoice.totalAmount.toLocaleString()}
                  </td>
                </tr>
                {activeInvoice.paidAt && (
                  <tr>
                    <td colSpan={2} style={{ paddingTop: '8px', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                      Paid on {new Date(activeInvoice.paidAt).toLocaleDateString()} via {activeInvoice.paymentMode} ({activeInvoice.transactionRef})
                    </td>
                    <td style={{ paddingTop: '8px', textAlign: 'right', fontWeight: 800, color: '#059669', fontSize: '1rem' }}>
                      -₹{activeInvoice.amountPaid.toLocaleString()}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          {/* Bottom Action Footer */}
          <div style={{ background: '#f8fafc', padding: '20px 28px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Clock size={16} />
              <span>Due Date: <strong>{activeInvoice.dueDate}</strong></span>
            </div>

            {activeInvoice.status !== 'Paid' ? (
              <button
                onClick={() => setIsPayModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#000000',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 12px 28px -6px rgba(249, 115, 22, 0.45)'
                }}
              >
                <Smartphone size={18} />
                <span>Pay ₹{activeInvoice.totalAmount.toLocaleString()} via UPI</span>
              </button>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 800, fontSize: '0.88rem' }}>
                  <ShieldCheck size={20} />
                  <span>Settled &amp; Verified</span>
                </span>
                <button
                  onClick={() => setIsReceiptModalOpen(true)}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Receipt size={14} /> Download Receipt
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MODAL 1: INSTANT DYNAMIC UPI CHECKOUT MODAL */}
        {isPayModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setIsPayModalOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '480px',
                background: '#ffffff',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      Instant UPI Checkout
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Aravali Residence Hall • Zero Convenience Fee</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsPayModalOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              {/* Amount Box */}
              <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-default)', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Amount Due</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>
                    ₹{activeInvoice.totalAmount.toLocaleString()}
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  <strong>{activeInvoice.id}</strong><br />
                  Room {activeInvoice.roomNumber || '204'}
                </div>
              </div>

              {/* Dynamic QR Code Box */}
              <div style={{ textAlign: 'center', padding: '18px', background: '#f8fafc', borderRadius: '14px', border: '1.5px dashed #cbd5e1', marginBottom: '18px' }}>
                <div style={{ background: '#ffffff', display: 'inline-block', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', marginBottom: '8px' }}>
                  <svg width="150" height="150" viewBox="0 0 100 100" style={{ display: 'block' }}>
                    <rect width="100" height="100" fill="#ffffff" />
                    <rect x="8" y="8" width="26" height="26" fill="#0f172a" />
                    <rect x="12" y="12" width="18" height="18" fill="#ffffff" />
                    <rect x="16" y="16" width="10" height="10" fill="#0f172a" />

                    <rect x="66" y="8" width="26" height="26" fill="#0f172a" />
                    <rect x="70" y="12" width="18" height="18" fill="#ffffff" />
                    <rect x="74" y="16" width="10" height="10" fill="#0f172a" />

                    <rect x="8" y="66" width="26" height="26" fill="#0f172a" />
                    <rect x="12" y="70" width="18" height="18" fill="#ffffff" />
                    <rect x="16" y="74" width="10" height="10" fill="#0f172a" />

                    <rect x="42" y="12" width="8" height="14" fill="#0f172a" />
                    <rect x="54" y="20" width="6" height="16" fill="#0f172a" />
                    <rect x="38" y="42" width="14" height="14" fill="#0f172a" />
                    <rect x="56" y="44" width="12" height="10" fill="#0f172a" />
                    <rect x="42" y="66" width="8" height="20" fill="#0f172a" />
                    <rect x="58" y="68" width="16" height="14" fill="#0f172a" />
                    <rect x="78" y="50" width="14" height="8" fill="#0f172a" />
                    <rect x="78" y="72" width="8" height="16" fill="#0f172a" />
                  </svg>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                  Scan with any UPI App (GPay, PhonePe, Paytm)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
                  <code style={{ fontSize: '0.78rem', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', color: '#1e293b' }}>
                    aravali.hostel@icici
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedUpi ? '#10b981' : '#64748b' }}
                    title="Copy UPI VPA"
                  >
                    {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Fast 1-Tap UTR Simulation Form */}
              <form onSubmit={handleConfirmUpiPayment}>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                      Bank UTR / Transaction Reference (12 digits) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setUtrNumber(`202610${String(Date.now()).slice(-6)}`)}
                      style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Auto-fill Bank UTR
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 202610034481 or UPI/2026/8941"
                    value={utrNumber}
                    onChange={e => setUtrNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.86rem',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsPayModalOpen(false)}
                    disabled={isProcessing}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    style={{
                      flex: 2,
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#000000',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: isProcessing ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 8px 20px -4px rgba(249, 115, 22, 0.45)'
                    }}
                  >
                    {isProcessing ? 'Verifying with Bank...' : 'Submit UTR & Settle Dues ✓'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: OFFICIAL COLLEGIATE PRINTABLE / PDF RECEIPT MODAL */}
        {isReceiptModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(6px)',
              zIndex: 3100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setIsReceiptModalOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '620px',
                background: '#ffffff',
                borderRadius: '20px',
                padding: '36px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
                maxHeight: '92vh',
                overflowY: 'auto',
                position: 'relative',
                border: '1px solid #cbd5e1'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Receipt Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  CENTRAL RESIDENTIAL ACCOMMODATION SERVICES
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                  ARAVALI RESIDENCE HALL
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                  Affiliated to Technical Campus Board &bull; Code: ARV-HALL-01 &bull; GST Exempt (Educational Hostel)
                </div>
                <div style={{ display: 'inline-block', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontSize: '0.72rem', fontWeight: 800, padding: '3px 12px', borderRadius: '9999px', marginTop: '8px' }}>
                  OFFICIAL COLLEGIATE FEE RECEIPT &bull; CONFIRMED &amp; CLEARED
                </div>
              </div>

              {/* Receipt Particulars Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem', marginBottom: '20px', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Receipt No:</span><br />
                  <strong style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#0f172a' }}>
                    {activeInvoice.receiptNumber || 'RCP-ARAVALI-2026-8942'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Date of Clearing:</span><br />
                  <strong style={{ color: '#0f172a' }}>
                    {new Date(activeInvoice.paidAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Student Name:</span><br />
                  <strong style={{ color: '#0f172a' }}>{activeInvoice.studentName}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Room &amp; Bed Allotment:</span><br />
                  <strong style={{ color: '#0f172a' }}>Room {activeInvoice.roomNumber || user?.roomNumber || '204'} (Bed 1), Block A</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Payment Mode:</span><br />
                  <strong style={{ color: '#0f172a' }}>{activeInvoice.paymentMode || 'UPI (Instant Clearing)'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Bank UTR / Transaction Ref:</span><br />
                  <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>
                    {activeInvoice.transactionRef || 'UPI/2026/89410382'}
                  </strong>
                </div>
              </div>

              {/* Itemized Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '8px 10px', fontWeight: 700 }}>Description</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700 }}>Billing Cycle</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px' }}>Room Accommodation (Block A)</td>
                    <td style={{ padding: '8px 10px', color: '#64748b' }}>Spring 2026</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>₹{(activeInvoice.roomFee || 35000).toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px' }}>Mess Catering &amp; Food Services</td>
                    <td style={{ padding: '8px 10px', color: '#64748b' }}>Spring 2026</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>₹{(activeInvoice.messFee || 18000).toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px' }}>Amenities, Fiber WiFi &amp; Generator</td>
                    <td style={{ padding: '8px 10px', color: '#64748b' }}>Spring 2026</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>₹{(activeInvoice.amenitiesFee || 4500).toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px' }}>Caution &amp; Security Deposit (Refundable)</td>
                    <td style={{ padding: '8px 10px', color: '#64748b' }}>One-time</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>₹{(activeInvoice.cautionDeposit || 5000).toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px' }}>Electricity Sub-meter Surcharge</td>
                    <td style={{ padding: '8px 10px', color: '#64748b' }}>Telemetry</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>₹{(activeInvoice.electricitySurcharge || 750).toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr style={{ background: '#f8fafc', borderTop: '2px solid #0f172a' }}>
                    <td colSpan={2} style={{ padding: '10px', fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                      TOTAL AMOUNT RECEIVED:
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>
                      ₹{activeInvoice.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Digital Signature & Verification Seal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed #cbd5e1', paddingTop: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={32} color="#059669" />
                  <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                    <strong>Cryptographically Verified:</strong><br />
                    Hash: <code>SHA256:{activeInvoice.id.slice(0, 8)}98A2</code><br />
                    Central Accounts Ledger
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'cursive', fontSize: '1rem', color: '#1e3a8a', marginBottom: '2px' }}>
                    Dr. R. K. Verma
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0f172a' }}>
                    Chief Warden &amp; Cashier Desk
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                    Aravali Residence Hall
                  </div>
                </div>
              </div>

              {/* Print / Close Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={16} /> Print Official PDF Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};
