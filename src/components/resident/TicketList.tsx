import React, { useState } from 'react';
import { Ticket, TicketCategory, TicketStatus } from '../../types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  MessageSquare,
  Zap,
  Droplet,
  Hammer,
  Wrench,
  Filter
} from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  onOpenLodgeModal: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({ tickets, onOpenLodgeModal }) => {
  const [statusFilter, setStatusFilter] = useState<'All' | TicketStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | TicketCategory>('All');

  // Summary counts
  const countOpen = tickets.filter(t => t.status === 'Open').length;
  const countInProgress = tickets.filter(t => t.status === 'In Progress').length;
  const countResolved = tickets.filter(t => t.status === 'Resolved').length;

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesStatus && matchesCat;
  });

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

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return (
          <span className="badge badge-open">
            <Clock size={12} /> Open (Dispatched)
          </span>
        );
      case 'In Progress':
        return (
          <span className="badge badge-in-progress">
            <AlertCircle size={12} /> In Progress (Technician Assigned)
          </span>
        );
      case 'Resolved':
        return (
          <span className="badge badge-resolved">
            <CheckCircle2 size={12} /> Resolved
          </span>
        );
    }
  };

  return (
    <div>
      {/* 1. Maintenance Summary Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div
          className="card"
          style={{
            padding: '20px',
            background: '#ffffff',
            borderLeft: '4px solid #f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Open Tickets
            </span>
            <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              {countOpen}
            </div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
            <Clock size={20} />
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '20px',
            background: '#ffffff',
            borderLeft: '4px solid #0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              In Progress
            </span>
            <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              {countInProgress}
            </div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1' }}>
            <AlertCircle size={20} />
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '20px',
            background: '#ffffff',
            borderLeft: '4px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Resolved Issues
            </span>
            <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              {countResolved}
            </div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* 2. My Tickets Card Header & Filters */}
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
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              My Maintenance Tickets &amp; Tracking
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              Live status synchronized directly with the Warden desk
            </p>
          </div>

          <button
            onClick={onOpenLodgeModal}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Wrench size={18} />
            <span>Lodge Maintenance Issue</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '12px 16px',
            background: '#f8fafc',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid #e2e8f0'
          }}
        >
          {/* Status filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={14} /> Status:
            </span>
            {(['All', 'Open', 'In Progress', 'Resolved'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  background: statusFilter === status ? '#4f46e5' : '#ffffff',
                  color: statusFilter === status ? '#ffffff' : '#475569',
                  border: statusFilter === status ? '1px solid #4338ca' : '1px solid #cbd5e1'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Category filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
              Category:
            </span>
            {(['All', 'Electrical', 'Plumbing', 'Carpentry', 'Other'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  background: categoryFilter === cat ? '#0f172a' : '#ffffff',
                  color: categoryFilter === cat ? '#ffffff' : '#475569',
                  border: categoryFilter === cat ? '1px solid #0f172a' : '1px solid #cbd5e1'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div
            style={{
              padding: '48px 16px',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px dashed #cbd5e1'
            }}
          >
            <Wrench size={36} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155' }}>
              No maintenance tickets matching this filter
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              If you have any room repairs or broken fixtures, lodge a new issue above.
            </p>
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
                  transition: 'border-color 0.2s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                      #{ticket.id}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Room {ticket.room} • {ticket.block}
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

                  <div>{getStatusBadge(ticket.status)}</div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.925rem', color: '#1e293b', lineHeight: 1.6, marginBottom: '12px' }}>
                  {ticket.description}
                </p>

                {/* Warden notes / resolution remark if present */}
                {ticket.wardenNotes && (
                  <div
                    style={{
                      background: ticket.status === 'Resolved' ? '#f0fdf4' : '#f0f9ff',
                      border: ticket.status === 'Resolved' ? '1px solid #bbf7d0' : '1px solid #bae6fd',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      color: ticket.status === 'Resolved' ? '#166534' : '#0369a1',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      marginBottom: '10px'
                    }}
                  >
                    <MessageSquare size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong>Warden Desk Note:</strong> {ticket.wardenNotes}
                    </div>
                  </div>
                )}

                {/* Footer timestamp */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span>Logged: {new Date(ticket.createdAt).toLocaleString()}</span>
                  {ticket.resolvedAt && (
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>
                      Resolved: {new Date(ticket.resolvedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
