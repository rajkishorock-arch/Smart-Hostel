import React, { useState, useEffect } from 'react';
import { GatePassRequest } from '../../types';
import {
  subscribeGatePasses,
  updateGatePassStatus
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
  X
} from 'lucide-react';

export const HostelGatePassesPage: React.FC = () => {
  const [passes, setPasses] = useState<GatePassRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeGatePasses((all) => {
      setPasses(all);
      setLoading(false);
    });
    return () => unsub();
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

  const filteredPasses = passes.filter(p => {
    const pStatus = (p.status || '').toLowerCase();
    const matchesFilter = filter === 'all' || pStatus === filter;
    const matchesSearch =
      p.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.destination && p.destination.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const pendingCount = passes.filter(p => (p.status || '').toLowerCase() === 'pending').length;
  const approvedCount = passes.filter(p => (p.status || '').toLowerCase() === 'approved').length;

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
          marginBottom: '28px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Gate Pass &amp; Campus Leave Approvals
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Authorize student town out-passes, weekend leaves, and monitor campus exit logs in real time.
          </p>
        </div>

        {/* Live Counters */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              background: pendingCount > 0 ? '#fffbeb' : '#f8fafc',
              border: `1.5px solid ${pendingCount > 0 ? '#fde68a' : '#e2e8f0'}`,
              borderRadius: '10px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Clock size={18} color={pendingCount > 0 ? '#d97706' : '#64748b'} />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: pendingCount > 0 ? '#b45309' : '#0f172a' }}>
                {pendingCount}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Needs Review</span>
            </div>
          </div>

          <div
            style={{
              background: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              borderRadius: '10px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <CheckCircle2 size={18} color="#059669" />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065f46' }}>
                {approvedCount}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>Approved Active</span>
            </div>
          </div>
        </div>
      </div>

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
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          {[
            { id: 'all', label: `All Requests (${passes.length})` },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'approved', label: `Approved (${approvedCount})` },
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
            className="input-field"
            style={{ width: '100%', paddingLeft: '36px', height: '38px', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Passes List / Table */}
      <div className="pro-table-wrapper">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Pass Type &amp; Purpose</th>
              <th>Out &amp; Expected In</th>
              <th>Parent Contact</th>
              <th>Current Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
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
                <tr key={pass.id}>
                  <td>
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

                  <td>
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

                  <td>
                    <div style={{ fontSize: '0.8rem' }}>
                      <div style={{ color: '#0f172a', fontWeight: 600 }}>
                        Out: {pass.departureDate} {pass.departureTime ? `(${pass.departureTime})` : ''}
                      </div>
                      <div style={{ color: '#b91c1c', fontWeight: 600 }}>
                        In: {pass.expectedReturnDate} {pass.expectedReturnTime ? `(${pass.expectedReturnTime})` : ''}
                      </div>
                    </div>
                  </td>

                  <td>
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

                  <td>
                    {pass.status.toLowerCase() === 'approved' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <CheckCircle2 size={13} /> Approved
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

                  <td style={{ textAlign: 'right' }}>
                    {pass.status.toLowerCase() === 'pending' ? (
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          disabled={actionLoadingId === pass.id}
                          onClick={() => handleStatusChange(pass.id, 'Approved')}
                          className="btn btn-sm"
                          style={{
                            background: '#10b981',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Authorize and Sign Gate Pass"
                        >
                          <Check size={14} />
                          <span>Approve</span>
                        </button>

                        <button
                          disabled={actionLoadingId === pass.id}
                          onClick={() => handleStatusChange(pass.id, 'Rejected')}
                          className="btn btn-sm"
                          style={{
                            background: '#ef4444',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Reject Gate Pass Request"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Decided by {(pass.approvedBy || pass.reviewedBy || 'Warden').split(' ')[0]}
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
  );
};
