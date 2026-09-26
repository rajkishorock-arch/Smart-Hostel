import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Ticket, TicketCategory } from '../../types';
import { subscribeTickets } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import {
  FolderKanban,
  Zap,
  Droplets,
  Hammer,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Ticket as TicketIcon
} from 'lucide-react';

export const MaintenanceCategoriesPage: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeCategory, setActiveCategory] = useState<TicketCategory>('Electrical');

  useEffect(() => {
    const unsub = subscribeTickets(
      all => setTickets(all),
      { role: 'warden', uid: user?.uid || '' }
    );
    return () => unsub();
  }, [user]);

  const categories = [
    {
      name: 'Electrical' as TicketCategory,
      icon: Zap,
      color: '#d97706',
      bg: '#fffbeb',
      description: 'Power sockets, ceiling fans, switches, wiring faults, MCB tripping, and lighting fixtures.'
    },
    {
      name: 'Plumbing' as TicketCategory,
      icon: Droplets,
      color: '#0284c7',
      bg: '#f0f9ff',
      description: 'Washbasin drainage, water supply line, bathroom taps, flushing systems, and geysers.'
    },
    {
      name: 'Carpentry' as TicketCategory,
      icon: Hammer,
      color: '#b45309',
      bg: '#fef3c7',
      description: 'Door hinges, study table locks, cupboards, window latches, and wooden bed frames.'
    },
    {
      name: 'Other' as TicketCategory,
      icon: HelpCircle,
      color: '#64748b',
      bg: '#f8fafc',
      description: 'Pest management, corridor cleaning, civil masonry, painting, and miscellaneous requests.'
    }
  ];

  const categoryCards = categories.map(cat => {
    const catTickets = tickets.filter(t => t.category === cat.name);
    return {
      ...cat,
      total: catTickets.length,
      open: catTickets.filter(t => t.status === 'Open').length,
      inProgress: catTickets.filter(t => t.status === 'In Progress').length,
      resolved: catTickets.filter(t => t.status === 'Resolved').length
    };
  });

  const categoryTickets = tickets.filter(t => t.category === activeCategory);

  return (
    <AppLayout
      activeDomain="maintenance"
      breadcrumbs={[
        { label: 'Maintenance Management', href: '/admin/maintenance' },
        { label: 'Trade Categories Breakdown' }
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
              <FolderKanban size={14} /> Trade Classifications
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Maintenance Trade Categories
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Specialized trade breakdowns for Electrical, Plumbing, Carpentry, and General facilities maintenance.
          </p>
        </div>

        <Link
          to="/admin/maintenance/tickets"
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
          <TicketIcon size={16} /> All Tickets
        </Link>
      </div>

      {/* 4 Category Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        {categoryCards.map(cat => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.name;

          return (
            <div
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              style={{
                background: '#ffffff',
                border: isSelected ? '2px solid var(--maint-primary)' : '1px solid var(--neutral-border)',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: cat.bg,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '8px',
                      background: isSelected ? 'var(--brand-yellow-subtle)' : '#f8fafc',
                      color: isSelected ? 'var(--maint-primary)' : 'var(--neutral-muted)'
                    }}
                  >
                    {isSelected ? 'Viewing' : `${cat.total} Tickets`}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: '0 0 6px 0' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  {cat.description}
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  textAlign: 'center',
                  background: '#f8fafc',
                  padding: '10px',
                  borderRadius: '8px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>Open</div>
                  <div style={{ fontWeight: 800, color: '#b45309' }}>{cat.open}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>Active</div>
                  <div style={{ fontWeight: 800, color: '#1d4ed8' }}>{cat.inProgress}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>Done</div>
                  <div style={{ fontWeight: 800, color: '#15803d' }}>{cat.resolved}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tickets in Selected Category */}
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
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
              {activeCategory} Tickets ({categoryTickets.length})
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
              Workorders filed specifically under {activeCategory}
            </span>
          </div>

          <Link
            to="/admin/maintenance/resolution"
            style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--maint-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Resolution Desk <ArrowRight size={14} />
          </Link>
        </div>

        <div className="pro-table-wrapper">
          <table className="pro-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Resident</th>
                <th>Room</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {categoryTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--neutral-muted)' }}>
                    No tickets filed under {activeCategory}.
                  </td>
                </tr>
              ) : (
                categoryTickets.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 800 }}>#{t.id}</td>
                    <td>{t.residentName}</td>
                    <td>{t.block} - {t.room}</td>
                    <td>{t.description}</td>
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
                    <td style={{ color: 'var(--neutral-muted)', fontSize: '0.78rem' }}>
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};
