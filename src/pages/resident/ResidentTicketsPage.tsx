import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { Ticket, TicketStatus } from '../../types';
import { subscribeTickets } from '../../services/storageService';
import {
  Ticket as TicketIcon,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ShieldCheck,
  Search,
  Sparkles,
  ShieldAlert,
  UserCheck,
  Check,
  CircleDot
} from 'lucide-react';

const LIFECYCLE_STAGES: TicketStatus[] = [
  'Open',
  'AI Classified',
  'Assigned',
  'In Progress',
  'Resolved'
];

function getStageIndex(status: TicketStatus): number {
  const idx = LIFECYCLE_STAGES.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export const ResidentTicketsPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(() => {
    return (location.state as any)?.successMessage || null;
  });

  useEffect(() => {
    if ((location.state as any)?.successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeTickets(
      all => setTickets(all),
      { role: 'resident', uid: user.uid }
    );
    return () => unsub();
  }, [user]);

  const filteredTickets = tickets.filter(t => {
    return (
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[
        { label: 'Maintenance', href: '/resident/maintenance/tickets' },
        { label: 'My Tickets' }
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
              <TicketIcon size={14} /> My Complaints Record
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            My Maintenance Tickets
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Real-time status updates, visible lifecycle timeline, technician assignment, and resolution sign-offs.
          </p>
        </div>

        <Link
          to="/resident/maintenance/report"
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--maint-primary)',
            color: '#ffffff',
            fontSize: '0.84rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(245, 158, 11, 0.25)'
          }}
        >
          <PlusCircle size={16} /> Report New Issue
        </Link>
      </div>

      {successMessage && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '24px',
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Search Input */}
      <div style={{ marginBottom: '20px', maxWidth: '400px', position: 'relative' }}>
        <Search
          size={16}
          color="#94a3b8"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search by ticket ID, issue, category..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px 10px 38px',
            borderRadius: '8px',
            border: '1px solid var(--neutral-border)',
            fontSize: '0.85rem',
            background: '#ffffff'
          }}
        />
      </div>

      {/* Tickets List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredTickets.length === 0 ? (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--neutral-border)',
              borderRadius: '14px',
              padding: '48px 24px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <TicketIcon size={36} color="var(--neutral-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
              No maintenance tickets found
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--neutral-muted)', margin: '6px 0 16px' }}>
              You do not have any registered complaints matching the filter.
            </p>
            <Link
              to="/resident/maintenance/report"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'var(--maint-primary)',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700
              }}
            >
              <PlusCircle size={15} /> Report Issue
            </Link>
          </div>
        ) : (
          filteredTickets.map(t => {
            const currentStageIndex = getStageIndex(t.status);

            return (
              <div
                key={t.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--neutral-border)',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--neutral-dark)' }}>
                      #{t.id}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: '#f1f5f9',
                        color: '#334155'
                      }}
                    >
                      {t.category}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background:
                          t.priority === 'Critical'
                            ? '#fef2f2'
                            : t.priority === 'High'
                            ? '#fffbeb'
                            : '#f8fafc',
                        color:
                          t.priority === 'Critical'
                            ? '#dc2626'
                            : t.priority === 'High'
                            ? '#d97706'
                            : '#64748b'
                      }}
                    >
                      {t.priority} Priority
                    </span>
                    {t.aiClassified && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: '#fef3c7',
                          color: '#92400e',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Sparkles size={11} color="#d97706" /> AI Classified
                      </span>
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      background:
                        t.status === 'Resolved'
                          ? '#dcfce7'
                          : t.status === 'In Progress' || t.status === 'Assigned'
                          ? '#dbeafe'
                          : '#fef3c7',
                      color:
                        t.status === 'Resolved'
                          ? '#15803d'
                          : t.status === 'In Progress' || t.status === 'Assigned'
                          ? '#1d4ed8'
                          : '#b45309'
                    }}
                  >
                    ● {t.status}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: '0 0 6px 0' }}>
                  {t.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#4b5563', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                  {t.description}
                </p>

                {/* Safety Alert Banner */}
                {(t.safetyAlert || t.priority === 'Critical') && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: '#fff1f2',
                      border: '1px solid #fecaca',
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}
                  >
                    <ShieldAlert size={18} color="#dc2626" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ fontSize: '0.8rem', color: '#991b1b' }}>
                      <strong style={{ display: 'block', marginBottom: '2px' }}>Safety Priority Incident:</strong>
                      {t.safetyAlert || 'Sparks, high leakage, or danger detected. Turn off mains if safe to do so. Warden and technicians have been notified.'}
                    </div>
                  </div>
                )}

                {/* Assigned Technician Banner */}
                {t.assignedTo && (
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      marginBottom: '14px',
                      fontSize: '0.8rem',
                      color: '#1e40af',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <UserCheck size={16} />
                    <span><strong>Assigned Technician:</strong> {t.assignedTo}</span>
                  </div>
                )}

                {/* ============================================================ */}
                {/* VISIBLE TICKET TIMELINE (Feature 5 Lifecycle)                */}
                {/* ============================================================ */}
                <div style={{ marginTop: '16px', marginBottom: '16px', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--neutral-dark)', marginBottom: '12px' }}>
                    Ticket Lifecycle Timeline:
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                    {LIFECYCLE_STAGES.map((stage, sIdx) => {
                      const isCompleted = sIdx < currentStageIndex;
                      const isCurrent = sIdx === currentStageIndex;
                      const timelineEvent = t.timeline?.find(ev => ev.status === stage);

                      return (
                        <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                          {/* Connector Line */}
                          {sIdx > 0 && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '12px',
                                right: '50%',
                                left: '-50%',
                                height: '3px',
                                background: sIdx <= currentStageIndex ? 'var(--brand-blue)' : '#cbd5e1',
                                zIndex: 1
                              }}
                            />
                          )}

                          {/* Circle Indicator */}
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: isCompleted ? 'var(--brand-blue)' : isCurrent ? '#ffffff' : '#f1f5f9',
                              border: isCurrent ? '2px solid var(--brand-blue)' : isCompleted ? 'none' : '1px solid #cbd5e1',
                              color: isCompleted ? '#ffffff' : isCurrent ? 'var(--brand-blue)' : '#94a3b8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              zIndex: 2,
                              marginBottom: '6px'
                            }}
                          >
                            {isCompleted ? <Check size={12} /> : isCurrent ? <CircleDot size={12} /> : sIdx + 1}
                          </div>

                          <div style={{ fontSize: '0.72rem', fontWeight: isCurrent ? 800 : 600, color: isCurrent ? 'var(--brand-blue)' : '#64748b', textAlign: 'center' }}>
                            {stage}
                          </div>
                          {timelineEvent && (
                            <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
                              {new Date(timelineEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Resolution / Warden Notes */}
                {(t.resolutionNote || t.wardenNotes) && (
                  <div
                    style={{
                      background: t.status === 'Resolved' ? '#f0fdf4' : '#f8fafc',
                      border: `1px solid ${t.status === 'Resolved' ? '#bbf7d0' : 'var(--neutral-border)'}`,
                      borderRadius: '8px',
                      padding: '12px 16px',
                      margin: '12px 0',
                      fontSize: '0.84rem',
                      color: t.status === 'Resolved' ? '#166534' : '#334155'
                    }}
                  >
                    <strong style={{ color: t.status === 'Resolved' ? '#15803d' : 'var(--maint-primary)' }}>
                      {t.status === 'Resolved' ? 'Official Resolution Note:' : 'Warden Desk Update:'}
                    </strong>{' '}
                    {t.resolutionNote || t.wardenNotes}
                  </div>
                )}

                <div style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', marginTop: '10px' }}>
                  Lodge Date: {new Date(t.createdAt).toLocaleString()} • Room {t.roomNumber || t.room} ({t.block})
                </div>
              </div>
            );
          })
        )}
      </div>
    </AppLayout>
  );
};
