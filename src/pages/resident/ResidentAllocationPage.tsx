import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Building2,
  Bed,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Calendar,
  UserCheck
} from 'lucide-react';

export const ResidentAllocationPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[
        { label: 'My Hostel', href: '/resident/room' },
        { label: 'My Allocation Slip' }
      ]}
    >
      {/* Banner */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--brand-blue)',
                background: 'var(--brand-blue-subtle)',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FileText size={14} /> Official Allotment
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Room Allocation Certificate
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Authorized campus hostel residency certificate and bed allocation receipt.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            border: '1px solid var(--neutral-border)',
            background: '#f8fafc',
            color: 'var(--neutral-dark)',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Printer size={16} /> Print Certificate
        </button>
      </div>

      {/* Official Certificate Card */}
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto 40px auto',
          background: '#ffffff',
          border: '2px solid #cbd5e1',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative'
        }}
      >
        {/* Certificate Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '24px', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              background: 'var(--brand-purple)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--neutral-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Office of Campus Residence & Mess Administration
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--neutral-dark)', margin: '4px 0' }}>
            Hostel Bed Allotment Slip
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 700 }}>
            ● Status: Officially Allotted & Verified
          </div>
        </div>

        {/* Certificate Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Resident Full Name
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-dark)', marginTop: '2px' }}>
              {user?.name}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Student Email ID
            </span>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--neutral-dark)', marginTop: '2px' }}>
              {user?.email}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Hostel Wing
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--neutral-dark)', marginTop: '2px' }}>
              {user?.hostel || 'Aravali Boys Hostel'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Building Block
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--neutral-dark)', marginTop: '2px' }}>
              {user?.block || 'Block A'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Allotted Room Number
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--brand-blue)', marginTop: '2px' }}>
              Room {user?.roomNumber || '204'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Assigned Bed Identifier
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--brand-blue)', marginTop: '2px' }}>
              {user?.bedNumber || 'Bed 1'}
            </div>
          </div>
        </div>

        {/* Certificate Footer Stamp */}
        <div
          style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)' }}>Digital Verification Reference:</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-dark)' }}>
              SH-RES-{user?.uid?.slice(0, 8).toUpperCase() || 'DEMO-2026'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--neutral-dark)' }}>
              Chief Warden Office
            </div>
            <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
              Verified Electronic Seal ✓
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
