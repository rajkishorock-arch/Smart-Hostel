import React, { useState } from 'react';
import { Ticket, TicketCategory, TicketStatus } from '../../types';
import { updateTicketStatus } from '../../services/storageService';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  MessageSquare,
  Sparkles,
  Zap,
  Droplet,
  Hammer,
  User,
  Check,
  Edit3
} from 'lucide-react';

interface MaintenanceBoardProps {
  tickets: Ticket[];
  onStatusUpdated?: () => void;
}

export const MaintenanceBoard: React.FC<MaintenanceBoardProps> = ({ tickets, onStatusUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TicketStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | TicketCategory>('All');

  // Active ticket being edited
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [newStatus, setNewStatus] = useState<TicketStatus>('In Progress');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      t.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setNewStatus(ticket.status);
    setNotes(ticket.wardenNotes || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket) return;

    setIsUpdating(true);
    try {
      await updateTicketStatus(editingTicket.id, newStatus, notes.trim());
      setEditingTicket(null);
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getCategoryIcon = (cat: TicketCategory) => {
    switch (cat) {
      case 'Electrical':
        return <Zap size={14} color="#d97706" />;
      case 'Plumbing':
        return <Droplet size={14} color="#2563eb" />;
      case 'Carpentry':
        return <Hammer size={14} color="#c026d3" />;
      default:
        return <Wrench size={14} color="#475569" />;
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: '24px',
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '18px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#e0e7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4338ca'
            }}
          >
            <Wrench size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              1. Maintenance Resolution Board
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              Manage reported hostel issues, update resolution status, and dispatch technician notes
            </p>
          </div>
        </div>

        <span style={{ fontSize: '0.825rem', color: '#475569', fontWeight: 600 }}>
          Showing <strong>{filteredTickets.length}</strong> of {tickets.length} tickets
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          background: '#f8fafc',
          padding: '14px',
          borderRadius: '14px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search room, resident, issue..."
            className="form-input"
            style={{ paddingLeft: '36px', height: '40px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <select
          className="form-select"
          style={{ height: '40px' }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open (Pending)</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        {/* Category Filter */}
        <select
          className="form-select"
          style={{ height: '40px' }}
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as any)}
        >
          <option value="All">All Categories</option>
          <option value="Electrical">⚡ Electrical</option>
          <option value="Plumbing">💧 Plumbing</option>
          <option value="Carpentry">🔨 Carpentry</option>
          <option value="Other">🛠️ Other</option>
        </select>
      </div>

      {/* Ticket Table / Cards */}
      {filteredTickets.length === 0 ? (
        <div style={{ padding: '36px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
          No maintenance issues found matching the criteria.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px 20px',
                background: '#ffffff',
                boxShadow: 'var(--shadow-sm)',
                transition: 'border-color 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                    #{ticket.id}
                  </span>
                  <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                    Room {ticket.room} ({ticket.block})
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    Resident: {ticket.residentName}
                  </span>

                  <span className={`badge badge-category-${ticket.category.toLowerCase()}`}>
                    {getCategoryIcon(ticket.category)}
                    {ticket.category}
                  </span>

                  {ticket.aiClassified && (
                    <span
                      style={{
                        background: '#ede9fe',
                        color: '#6d28d9',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Sparkles size={12} /> AI Classified ({ticket.aiConfidence}%)
                    </span>
                  )}

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: ticket.priority === 'Urgent' ? '#fee2e2' : ticket.priority === 'High' ? '#ffedd5' : '#f1f5f9',
                      color: ticket.priority === 'Urgent' ? '#b91c1c' : ticket.priority === 'High' ? '#c2410c' : '#475569'
                    }}
                  >
                    Priority: {ticket.priority}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    className={
                      ticket.status === 'Resolved'
                        ? 'badge badge-resolved'
                        : ticket.status === 'In Progress'
                        ? 'badge badge-in-progress'
                        : 'badge badge-open'
                    }
                  >
                    {ticket.status}
                  </span>

                  <button
                    onClick={() => handleOpenEdit(ticket)}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Edit3 size={14} />
                    <span>Update Status</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.925rem', color: '#1e293b', lineHeight: 1.5, marginBottom: '10px' }}>
                {ticket.description}
              </p>

              {/* Warden Notes display if present */}
              {ticket.wardenNotes && (
                <div
                  style={{
                    background: ticket.status === 'Resolved' ? '#f0fdf4' : '#f0f9ff',
                    border: ticket.status === 'Resolved' ? '1px solid #bbf7d0' : '1px solid #bae6fd',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    color: ticket.status === 'Resolved' ? '#166534' : '#0369a1',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <MessageSquare size={14} />
                  <span>
                    <strong>Resolution Log:</strong> {ticket.wardenNotes}
                  </span>
                </div>
              )}

              {/* Footer timestamps */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>Reported: {new Date(ticket.createdAt).toLocaleString()}</span>
                {ticket.resolvedAt && (
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>
                    Resolved at: {new Date(ticket.resolvedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Resolution Modal */}
      {editingTicket && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Update Ticket Status: #{editingTicket.id}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Room {editingTicket.room} • {editingTicket.category} • {editingTicket.residentName}
                </span>
              </div>
              <button
                onClick={() => setEditingTicket(null)}
                style={{ padding: '6px', borderRadius: '8px', color: '#64748b', background: '#f1f5f9' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStatus}>
              {/* Status Select */}
              <div className="form-group">
                <label className="form-label">New Maintenance Status</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {(['Open', 'In Progress', 'Resolved'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewStatus(s)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        border: newStatus === s ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                        background: newStatus === s ? '#eef2ff' : '#ffffff',
                        color: newStatus === s ? '#4338ca' : '#475569',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {s === 'Resolved' ? '✅ ' : s === 'In Progress' ? '⚙️ ' : '⏳ '}
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div className="form-group">
                <label className="form-label">Warden Remarks / Technician Notes</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Electrician Mr. Vinod dispatched; replaced 5uF capacitor and verified fan functionality."
                  className="form-textarea"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  These remarks will immediately appear on the student resident's live portal.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setEditingTicket(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-primary"
                  style={{ minWidth: '150px' }}
                >
                  {isUpdating ? 'Saving...' : 'Apply & Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
