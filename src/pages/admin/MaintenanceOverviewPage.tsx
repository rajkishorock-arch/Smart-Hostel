import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Ticket } from '../../types';
import { subscribeTickets } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Zap,
  Droplets,
  Hammer,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  FolderKanban,
  Ticket as TicketIcon
} from 'lucide-react';

export const MaintenanceOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const unsub = subscribeTickets(
      all => setTickets(all),
      { role: 'warden', uid: user?.uid || '' }
    );
    return () => unsub();
  }, [user]);

  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
  const highUrgentCount = tickets.filter(
    t => (t.priority === 'High' || t.priority === 'Urgent') && t.status !== 'Resolved'
  ).length;

  const categories = [
    { name: 'Electrical', icon: Zap, color: '#d97706', bg: '#fffbeb' },
    { name: 'Plumbing', icon: Droplets, color: '#0284c7', bg: '#f0f9ff' },
    { name: 'Carpentry', icon: Hammer, color: '#b45309', bg: '#fef3c7' },
    { name: 'Other', icon: HelpCircle, color: '#64748b', bg: '#f8fafc' }
  ];

  const categoryStats = categories.map(cat => {
    const catTickets = tickets.filter(t => t.category === cat.name);
    return {
      ...cat,
      total: catTickets.length,
      open: catTickets.filter(t => t.status === 'Open').length,
      inProgress: catTickets.filter(t => t.status === 'In Progress').length,
      resolved: catTickets.filter(t => t.status === 'Resolved').length
    };
  });

  return (
    <AppLayout
      activeDomain="maintenance"
      breadcrumbs={[
        { label: 'Maintenance Management', href: '/admin/maintenance' },
        { label: 'Maintenance Overview' }
      ]}
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
                color: 'var(--maint-primary)',
                background: 'var(--brand-yellow-subtle)',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Wrench size={14} /> Campus Estate & Repairs Console
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Maintenance & Utilities Overview
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Supervise infrastructure tickets, contractor assignments, category metrics, and resolution lifecycles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/admin/maintenance/tickets"
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid var(--neutral-border)',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: 'var(--neutral-dark)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <TicketIcon size={16} color="var(--maint-primary)" /> Ticket Queue
          </Link>
          <Link
            to="/admin/maintenance/resolution"
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              background: 'var(--maint-primary)',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle2 size={16} /> Resolve Issues
          </Link>
        </div>
      </div>

      {/* KPI Stats (Yellow/Amber Maintenance Accent) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            Open Tickets
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: openCount > 0 ? '#b45309' : '#15803d', marginTop: '8px' }}>
            {openCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            Pending review & dispatch
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            In Progress
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1d4ed8', marginTop: '8px' }}>
            {inProgressCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            Contractor actively working
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            Resolved Tickets
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#15803d', marginTop: '8px' }}>
            {resolvedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            Closed with resolution notes
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            Urgent / High Priority
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: highUrgentCount > 0 ? '#dc2626' : '#15803d', marginTop: '8px' }}>
            {highUrgentCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            Critical infrastructure issues
          </div>
        </div>
      </div>

      {/* Category Distribution Grid */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
              Category Distribution
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)' }}>
              Breakdown of issues across trade specializations
            </span>
          </div>
          <Link
            to="/admin/maintenance/categories"
            style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--maint-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            All Categories <ArrowRight size={14} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}
        >
          {categoryStats.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="card-maint"
                style={{
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: cat.bg,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                      {cat.name}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)' }}>
                      {cat.total} Total Logged
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>Open</div>
                    <div style={{ fontWeight: 800, color: '#b45309' }}>{cat.open}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>Active</div>
                    <div style={{ fontWeight: 800, color: '#1d4ed8' }}>{cat.inProgress}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>Solved</div>
                    <div style={{ fontWeight: 800, color: '#15803d' }}>{cat.resolved}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Maintenance Tickets Table */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
              Recent Complaints & Active Workorders
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
              Real-time feed of resident reports
            </span>
          </div>
          <Link
            to="/admin/maintenance/tickets"
            style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--maint-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Manage All Tickets <ArrowRight size={14} />
          </Link>
        </div>

        <div className="pro-table-wrapper">
          <table className="pro-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Resident</th>
                <th>Room</th>
                <th>Issue Description</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.slice(0, 5).map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 800 }}>#{t.id}</td>
                  <td>{t.residentName}</td>
                  <td>{t.block} - {t.room}</td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.description}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: '#f1f5f9' }}>
                      {t.category}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: t.priority === 'Urgent' ? '#fef2f2' : t.priority === 'High' ? '#fffbeb' : '#f8fafc',
                        color: t.priority === 'Urgent' ? '#dc2626' : t.priority === 'High' ? '#d97706' : '#64748b'
                      }}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background:
                          t.status === 'Resolved' ? '#dcfce7' : t.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                        color:
                          t.status === 'Resolved' ? '#15803d' : t.status === 'In Progress' ? '#1d4ed8' : '#b45309'
                      }}
                    >
                      ● {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};
