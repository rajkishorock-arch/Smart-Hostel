import React, { useState, useEffect } from 'react';
import { GatePassRequest, GateMovementLog } from '../../types';
import {
  subscribeGatePasses,
  updateGatePassStatus,
  subscribeGateMovements,
  recordGateMovement,
  logActivity
} from '../../services/storageService';
import {
  QrCode,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  PhoneCall,
  User,
  MapPin,
  Filter,
  Search,
  Check,
  X,
  AlertTriangle,
  ArrowRightLeft,
  LogIn,
  LogOut,
  Bell,
  ShieldAlert
} from 'lucide-react';

export const HostelGatePassesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'checkpoint' | 'audit'>('requests');
  const [passes, setPasses] = useState<GatePassRequest[]>([]);
  const [movements, setMovements] = useState<GateMovementLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'checked_out' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [guardActionMessage, setGuardActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubPasses = subscribeGatePasses((all) => {
      setPasses(all);
      setLoading(false);
    });
    const unsubMoves = subscribeGateMovements((logs) => {
      setMovements(logs);
    });

    return () => {
      unsubPasses();
      unsubMoves();
    };
  }, []);

  const handleStatusChange = async (passId: string, newStatus: 'Approved' | 'Rejected') => {
    setActionLoadingId(passId);
    try {
      await updateGatePassStatus(passId, newStatus, 'Approved by Chief Warden Desk', 'Dr. R. K. Verma (Chief Warden)');
    } catch (err) {
      console.error('Failed to update gate pass status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleGateMovement = async (passId: string, type: 'Exit' | 'Entry') => {
    setActionLoadingId(passId);
    try {
      const res = await recordGateMovement(passId, type, 'Main Gate Turnstile A', 'Officer Ram Singh (Security Guard)');
      setGuardActionMessage(res.message);
      setTimeout(() => setGuardActionMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Movement logging failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredPasses = passes.filter(p => {
    const pStatus = (p.status || '').toLowerCase();
    let matchesFilter = true;
    if (filter === 'all') matchesFilter = true;
    else if (filter === 'pending') matchesFilter = pStatus === 'pending';
    else if (filter === 'approved') matchesFilter = pStatus === 'approved';
    else if (filter === 'checked_out') matchesFilter = pStatus === 'checked out';
    else if (filter === 'rejected') matchesFilter = pStatus === 'rejected';

    const matchesSearch =
      p.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.destination && p.destination.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const pendingCount = passes.filter(p => (p.status || '').toLowerCase() === 'pending').length;
  const approvedCount = passes.filter(p => (p.status || '').toLowerCase() === 'approved').length;
  const checkedOutCount = passes.filter(p => (p.status || '').toLowerCase() === 'checked out').length;

  // Curfew overdue detection (Residents who exited and expectedReturnTime has passed or past 22:00)
  const overdueResidents = passes.filter(p => {
    if (p.status?.toLowerCase() !== 'checked out') return false;
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 22 || (p.expectedReturnTime && p.expectedReturnTime < '21:30');
  });

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#0284c7',
                background: '#e0f2fe',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={14} /> Security &amp; Out-Pass Terminal
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Smart Gate Pass &amp; Campus Curfew Control
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Authorize student town passes, monitor turnstile tap-in/tap-out logs, and track real-time 10:00 PM curfew compliance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'requests' ? '#ffffff' : 'transparent',
              color: activeTab === 'requests' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'requests' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Leave Applications ({passes.length})
          </button>
          <button
            onClick={() => setActiveTab('checkpoint')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'checkpoint' ? '#ffffff' : 'transparent',
              color: activeTab === 'checkpoint' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeTab === 'checkpoint' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <ArrowRightLeft size={14} /> Gate Turnstile Scanner
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'audit' ? '#ffffff' : 'transparent',
              color: activeTab === 'audit' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'audit' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Audit Trail ({movements.length})
          </button>
        </div>
      </div>

      {/* Overdue Curfew Alert Banner (High-Priority Real-Time Telemetry) */}
      {overdueResidents.length > 0 && (
        <div
          style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '24px',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldAlert size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#991b1b' }}>
                CURFEW PROTOCOL ALERT: {overdueResidents.length} Student(s) Unreturned Past 10:00 PM Deadline!
              </div>
              <div style={{ fontSize: '0.82rem', color: '#b91c1c', marginTop: '2px' }}>
                {overdueResidents.map(r => `${r.residentName} (Room ${r.roomNumber})`).join(', ')} — Flagged for disciplinary SMS notification.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={`tel:${overdueResidents[0].parentPhone || '+919431012345'}`}
              style={{
                background: '#dc2626',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              <PhoneCall size={14} /> Call Parent of {overdueResidents[0].residentName.split(' ')[0]}
            </a>
          </div>
        </div>
      )}

      {/* Action Notification Toast */}
      {guardActionMessage && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            background: '#ecfdf5',
            color: '#065f46',
            border: '1.5px solid #a7f3d0',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{guardActionMessage}</span>
        </div>
      )}

      {/* Live Operational Counters Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>PENDING REVIEWS</span>
            <Clock size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: pendingCount > 0 ? '#b45309' : '#0f172a' }}>
            {pendingCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Awaiting Chief Warden Signature</span>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>APPROVED READY</span>
            <CheckCircle2 size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#065f46' }}>
            {approvedCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Valid QR pass issued</span>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>OFF-CAMPUS NOW</span>
            <LogOut size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0369a1' }}>
            {checkedOutCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Currently outside campus gates</span>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>CURFEW DEADLINE</span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>
            10:00 PM
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Mandatory main gate turnstile lock</span>
        </div>
      </div>

      {/* TAB 1: APPLICATIONS LIST */}
      {activeTab === 'requests' && (
        <div>
          {/* Filter and Search Bar */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
              {[
                { id: 'all', label: `All Requests (${passes.length})` },
                { id: 'pending', label: `Pending (${pendingCount})` },
                { id: 'approved', label: `Approved (${approvedCount})` },
                { id: 'checked_out', label: `Off-Campus (${checkedOutCount})` },
                { id: 'rejected', label: `Rejected` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: filter === f.id ? '#1e3a8a' : '#64748b',
                    background: filter === f.id ? '#ffffff' : 'transparent',
                    boxShadow: filter === f.id ? 'var(--shadow-xs)' : 'none',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search student or room..."
                style={{
                  width: '100%',
                  paddingLeft: '36px',
                  height: '38px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  boxSizing: 'border-box',
                  fontSize: '0.82rem'
                }}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="pro-table-wrapper" style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table className="pro-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Student Details</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Pass Type &amp; Purpose</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Out &amp; Expected In</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Parent Verification</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Current Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                      Loading gate pass database...
                    </td>
                  </tr>
                ) : filteredPasses.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                      No gate pass requests match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPasses.map(pass => (
                    <tr key={pass.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              background: '#eff6ff',
                              color: '#1e3a8a',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem'
                            }}
                          >
                            {pass.roomNumber}
                          </div>
                          <div>
                            <strong style={{ color: '#0f172a', display: 'block' }}>{pass.residentName}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Room {pass.roomNumber} ({pass.bedNumber || 'Bed 1'})
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div>
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              background: '#f1f5f9',
                              color: '#334155',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              marginBottom: '4px'
                            }}
                          >
                            {(pass.type || pass.leaveType || 'Gate Pass').replace('_', ' ')}
                          </span>
                          <div style={{ fontSize: '0.825rem', color: '#334155' }}>
                            {pass.reason}
                          </div>
                          {pass.destination && (
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Dest: {pass.destination}
                            </span>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: '0.8rem' }}>
                          <div style={{ color: '#0f172a', fontWeight: 600 }}>
                            Out: {pass.departureDate} {pass.departureTime ? `(${pass.departureTime})` : ''}
                          </div>
                          <div style={{ color: '#b91c1c', fontWeight: 600 }}>
                            In: {pass.expectedReturnDate} {pass.expectedReturnTime ? `(${pass.expectedReturnTime})` : ''}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                            {pass.parentPhone || pass.parentContact || '+91 94310 12345'}
                          </span>
                          <a
                            href={`tel:${pass.parentPhone || pass.parentContact || ''}`}
                            style={{
                              padding: '4px',
                              borderRadius: '6px',
                              background: '#ecfdf5',
                              color: '#059669',
                              display: 'inline-flex'
                            }}
                            title="Call Parent for Verification"
                          >
                            <PhoneCall size={13} />
                          </a>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        {pass.status.toLowerCase() === 'approved' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                            <CheckCircle2 size={13} /> Approved
                          </span>
                        ) : pass.status.toLowerCase() === 'checked out' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                            <LogOut size={13} /> Off-Campus
                          </span>
                        ) : pass.status.toLowerCase() === 'completed' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                            <CheckCircle2 size={13} /> Returned
                          </span>
                        ) : pass.status.toLowerCase() === 'rejected' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                            <XCircle size={13} /> Rejected
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                            <Clock size={13} /> Pending
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        {pass.status.toLowerCase() === 'pending' ? (
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              disabled={actionLoadingId === pass.id}
                              onClick={() => handleStatusChange(pass.id, 'Approved')}
                              style={{
                                background: '#10b981',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '0.78rem'
                              }}
                              title="Authorize and Sign Gate Pass"
                            >
                              <Check size={14} />
                              <span>Approve</span>
                            </button>

                            <button
                              disabled={actionLoadingId === pass.id}
                              onClick={() => handleStatusChange(pass.id, 'Rejected')}
                              style={{
                                background: '#ef4444',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '0.78rem'
                              }}
                              title="Reject Gate Pass Request"
                            >
                              <X size={14} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : pass.status.toLowerCase() === 'approved' ? (
                          <button
                            disabled={actionLoadingId === pass.id}
                            onClick={() => handleGateMovement(pass.id, 'Exit')}
                            style={{
                              background: '#0284c7',
                              color: '#ffffff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.78rem'
                            }}
                          >
                            <LogOut size={13} /> Mark Exit
                          </button>
                        ) : pass.status.toLowerCase() === 'checked out' ? (
                          <button
                            disabled={actionLoadingId === pass.id}
                            onClick={() => handleGateMovement(pass.id, 'Entry')}
                            style={{
                              background: '#059669',
                              color: '#ffffff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.78rem'
                            }}
                          >
                            <LogIn size={13} /> Mark Entry
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Signed by {(pass.approvedBy || pass.reviewedBy || 'Warden').split(' ')[0]}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TURNSTILE SCANNER / CHECKPOINT */}
      {activeTab === 'checkpoint' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Quick Turnstile Scanner Card */}
          <div
            style={{
              background: '#ffffff',
              border: '2px solid #0f172a',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#0f172a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ArrowRightLeft size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Turnstile Guard Station
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Main Gate Turnstile A • Automated Optical Barrier
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '18px', lineHeight: 1.4 }}>
              Scan student pass QR code or click below to simulate security guard turnstile hardware validation.
            </p>

            {/* Quick 1-tap pass actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {passes
                .filter(p => p.status === 'Approved' || p.status === 'Checked Out')
                .slice(0, 5)
                .map(p => (
                  <div
                    key={p.id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.84rem', color: '#0f172a', display: 'block' }}>
                        {p.residentName} (Room {p.roomNumber})
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Status: <strong style={{ color: p.status === 'Checked Out' ? '#0284c7' : '#059669' }}>{p.status}</strong>
                      </span>
                    </div>

                    <div>
                      {p.status === 'Approved' ? (
                        <button
                          disabled={actionLoadingId === p.id}
                          onClick={() => handleGateMovement(p.id, 'Exit')}
                          style={{
                            background: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <LogOut size={12} /> Scan Out
                        </button>
                      ) : (
                        <button
                          disabled={actionLoadingId === p.id}
                          onClick={() => handleGateMovement(p.id, 'Entry')}
                          style={{
                            background: '#059669',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <LogIn size={12} /> Scan In
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Currently Checked Out Residents */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--neutral-border)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              Students Currently Outside Campus ({checkedOutCount})
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '18px' }}>
              Monitored in real time until return scan at the security barrier.
            </p>

            {checkedOutCount === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px' }}>
                All hostel residents are currently accounted for inside campus premises.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                {passes
                  .filter(p => p.status === 'Checked Out')
                  .map(p => (
                    <div
                      key={p.id}
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #bae6fd',
                        borderRadius: '12px',
                        padding: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{p.residentName}</strong>
                        <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Room {p.roomNumber}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '12px' }}>
                        Expected Return: <strong style={{ color: '#b91c1c' }}>{p.expectedReturnTime || '21:00'}</strong>
                      </div>
                      <button
                        onClick={() => handleGateMovement(p.id, 'Entry')}
                        style={{
                          width: '100%',
                          background: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <LogIn size={14} /> Log Campus Return
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Chronological Gate Turnstile Movement Audit Log
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Immutable optical turnstile telemetry stamped with guard officer credentials
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Event ID</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Resident</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Room</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Movement</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Timestamp</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Checkpoint Gate</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Security Guard</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Curfew Protocol</th>
                </tr>
              </thead>
              <tbody>
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      No gate movements recorded yet today.
                    </td>
                  </tr>
                ) : (
                  movements.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                        {m.id}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>{m.residentName}</td>
                      <td style={{ padding: '10px 14px', color: '#64748b' }}>Room {m.roomNumber}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            background: m.movementType === 'Exit' ? '#fef3c7' : '#ecfdf5',
                            color: m.movementType === 'Exit' ? '#b45309' : '#047857'
                          }}
                        >
                          {m.movementType === 'Exit' ? <LogOut size={12} /> : <LogIn size={12} />}
                          {m.movementType}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#475569' }}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#64748b' }}>{m.gateNumber}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>{m.securityOfficer}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: m.curfewStatus === 'Within Hours' ? '#ecfdf5' : '#fef2f2',
                            color: m.curfewStatus === 'Within Hours' ? '#047857' : '#b91c1c',
                            fontWeight: 700
                          }}
                        >
                          {m.curfewStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
