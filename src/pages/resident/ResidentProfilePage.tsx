import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import {
  UserCheck,
  Mail,
  Phone,
  Building2,
  Bed,
  Calendar,
  ShieldCheck
} from 'lucide-react';

export const ResidentProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[{ label: 'Resident Profile' }]}
    >
      {/* Top Banner */}
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
              <UserCheck size={14} /> Student Account
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            {user?.name || 'Resident'}
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Verified student residency records and institutional contact credentials.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div
        style={{
          maxWidth: '680px',
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.5rem'
            }}
          >
            {user?.name?.charAt(0) || 'R'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
              {user?.name}
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--neutral-muted)' }}>
              Enrolled Resident • {user?.hostel || 'Aravali Hostel'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neutral-muted)', fontSize: '0.86rem' }}>
              <Mail size={16} /> Email Address:
            </span>
            <strong style={{ color: 'var(--neutral-dark)', fontSize: '0.88rem' }}>{user?.email}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neutral-muted)', fontSize: '0.86rem' }}>
              <Phone size={16} /> Contact Phone:
            </span>
            <strong style={{ color: 'var(--neutral-dark)', fontSize: '0.88rem' }}>{user?.phone || '+91 98765 43210'}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neutral-muted)', fontSize: '0.86rem' }}>
              <Building2 size={16} /> Assigned Wing:
            </span>
            <strong style={{ color: 'var(--neutral-dark)', fontSize: '0.88rem' }}>{user?.block || 'Block A'}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neutral-muted)', fontSize: '0.86rem' }}>
              <Bed size={16} /> Room & Bed:
            </span>
            <strong style={{ color: 'var(--brand-blue)', fontSize: '0.88rem' }}>
              Room {user?.roomNumber || '204'} ({user?.bedNumber || 'Bed 1'})
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neutral-muted)', fontSize: '0.86rem' }}>
              <ShieldCheck size={16} /> Authorization Role:
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#dcfce7',
                color: '#15803d',
                textTransform: 'uppercase'
              }}
            >
              Resident (Immutable)
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
