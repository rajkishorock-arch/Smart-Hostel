import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Ticket } from '../../types';
import { subscribeTickets } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import {
  Ticket as TicketIcon,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  X
} from 'lucide-react';

export const MaintenanceTicketsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const unsub = subscribeTickets(
      all => setTickets(all),
      { role: 'warden', uid: user?.uid || '' }
    );
    return () => unsub();
  }, [user]);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  return (
    <AppLayout
      activeDomain="maintenance"
      breadcrumbs={[
        { label: 'Maintenance Management', href: '/admin/maintenance' },
        { label: 'Tickets Queue' }
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
              <TicketIcon size={14} /> Complaints Desk
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Maintenance Tickets Queue
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Search, filter, and track all infrastructure reports submitted by hostel residents.
          </p>
        </div>

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

      {/* Filter Toolbar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search ticket ID, resident, room, or issue..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid var(--neutral-border)',
              fontSize: '0.85rem',
              outline: 'none',
              background: '#f8fafc'
            }}
          />
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--neutral-border)', fontSize: '0.84rem', background: '#ffffff', fontWeight: 600 }}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)' }}>Category:</span>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--neutral-border)', fontSize: '0.84rem', background: '#ffffff', fontWeight: 600 }}
          >
            <option value="All">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Priority */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)' }}>Priority:</span>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--neutral-border)', fontSize: '0.84rem', background: '#ffffff', fontWeight: 600 }}
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="pro-table-wrapper">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Resident</th>
              <th>Room</th>
              <th>Issue Summary</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Reported</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--neutral-muted)' }}>
                  No maintenance tickets found matching the specified filters.
                </td>
              </tr>
            ) : (
              filteredTickets.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 800 }}>#{t.id}</td>
                  <td>{t.residentName}</td>
                  <td>{t.block} - {t.room}</td>
                  <td style={{ maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                  <td style={{ color: 'var(--neutral-muted)', fontSize: '0.78rem' }}>
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedTicket(t)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--neutral-border)',
                          background: '#f8fafc',
                          color: 'var(--neutral-dark)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        onClick={() => navigate('/admin/maintenance/resolution', { state: { targetTicketId: t.id } })}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'var(--maint-primary)',
                          color: '#ffffff',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Resolve
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(3px)'
          }}
          onClick={() => setSelectedTicket(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: 'var(--maint-primary)',
                    background: 'var(--brand-yellow-subtle)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase'
                  }}
                >
                  Ticket Details
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: '4px 0 0 0' }}>
                  #{selectedTicket.id} — {selectedTicket.category}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Resident & Location:
                </span>
                <div style={{ fontWeight: 700, color: 'var(--neutral-dark)' }}>
                  {selectedTicket.residentName} • {selectedTicket.block} - Room {selectedTicket.room}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Issue Description:
                </span>
                <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginTop: '4px' }}>
                  {selectedTicket.description}
                </div>
              </div>

              {selectedTicket.wardenNotes && (
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Warden Resolution Notes:
                  </span>
                  <div style={{ fontSize: '0.88rem', color: '#334155', marginTop: '4px' }}>
                    {selectedTicket.wardenNotes}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedTicket(null)}
                style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--neutral-border)', background: '#ffffff', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = selectedTicket.id;
                  setSelectedTicket(null);
                  navigate('/admin/maintenance/resolution', { state: { targetTicketId: id } });
                }}
                style={{ padding: '9px 16px', borderRadius: '8px', border: 'none', background: 'var(--maint-primary)', color: '#ffffff', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Open in Resolution Desk
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
