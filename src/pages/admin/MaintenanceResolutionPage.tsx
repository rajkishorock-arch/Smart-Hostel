import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Ticket } from '../../types';
import { subscribeTickets, updateTicketStatus } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Check,
  FileText
} from 'lucide-react';

export const MaintenanceResolutionPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const targetId = (location.state as any)?.targetTicketId;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(targetId || '');
  const [newStatus, setNewStatus] = useState<Ticket['status']>('In Progress');
  const [wardenNotes, setWardenNotes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeTickets(
      all => {
        setTickets(all);
        if (!selectedTicketId && all.length > 0) {
          setSelectedTicketId(targetId || all[0].id);
        }
      },
      { role: 'warden', uid: user?.uid || '' }
    );
    return () => unsub();
  }, [user]);

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  useEffect(() => {
    if (activeTicket) {
      setNewStatus(activeTicket.status);
      setWardenNotes(activeTicket.wardenNotes || '');
    }
  }, [selectedTicketId, activeTicket]);

  const handleApplyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;

    await updateTicketStatus(activeTicket.id, newStatus, wardenNotes);
    setFeedback(`Ticket #${activeTicket.id} updated to status "${newStatus}"!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const markResolvedQuick = async () => {
    if (!activeTicket) return;
    await updateTicketStatus(activeTicket.id, 'Resolved', wardenNotes || 'Inspection verified and problem resolved.');
    setNewStatus('Resolved');
    setFeedback(`Ticket #${activeTicket.id} marked as Resolved!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <AppLayout
      activeDomain="maintenance"
      breadcrumbs={[
        { label: 'Maintenance Management', href: '/admin/maintenance' },
        { label: 'Ticket Resolution Workflow' }
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
              <CheckCircle2 size={14} /> Resolution Console
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Maintenance Resolution & Lifecycle
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Supervise ticket lifecycle from receipt through contractor work to final sign-off.
          </p>
        </div>
      </div>

      {feedback && (
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
          <span>{feedback}</span>
        </div>
      )}

      {/* 3-Column Maintenance Board (OPEN, IN PROGRESS, RESOLVED) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          alignItems: 'start',
          marginBottom: '32px'
        }}
      >
        {/* COLUMN 1: OPEN */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '2px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--neutral-dark)', textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>
                OPEN
              </h2>
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                background: '#fef3c7',
                color: '#b45309'
              }}
            >
              {tickets.filter(t => t.status === 'Open').length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '300px' }}>
            {tickets.filter(t => t.status === 'Open').length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--neutral-muted)', fontSize: '0.84rem' }}>
                No open tickets pending dispatch.
              </div>
            ) : (
              tickets
                .filter(t => t.status === 'Open')
                .map(t => (
                  <div
                    key={t.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '10px',
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: 'var(--shadow-xs)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--neutral-dark)' }}>
                        #{t.id}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: t.priority === 'Urgent' ? '#fef2f2' : t.priority === 'High' ? '#fffbeb' : '#f8fafc',
                          color: t.priority === 'Urgent' ? '#dc2626' : t.priority === 'High' ? '#d97706' : '#64748b'
                        }}
                      >
                        {t.priority}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-blue)' }}>
                      {t.category} • {t.block} - Room {t.room}
                    </div>

                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#334155', lineHeight: 1.4 }}>
                      {t.description}
                    </p>

                    <div style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
                      Reported by {t.residentName} • {new Date(t.createdAt).toLocaleDateString()}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        onClick={() => setSelectedTicketId(t.id)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--neutral-border)',
                          background: '#ffffff',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          color: 'var(--neutral-dark)',
                          cursor: 'pointer'
                        }}
                      >
                        Open Ticket
                      </button>
                      <button
                        onClick={async () => {
                          await updateTicketStatus(t.id, 'In Progress');
                          setFeedback(`Ticket #${t.id} moved to In Progress!`);
                          setTimeout(() => setFeedback(null), 3000);
                        }}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#1d4ed8',
                          color: '#ffffff',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Start Work →
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* COLUMN 2: IN PROGRESS */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '2px solid #3b82f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--neutral-dark)', textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>
                IN PROGRESS
              </h2>
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                background: '#dbeafe',
                color: '#1d4ed8'
              }}
            >
              {tickets.filter(t => t.status === 'In Progress').length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '300px' }}>
            {tickets.filter(t => t.status === 'In Progress').length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--neutral-muted)', fontSize: '0.84rem' }}>
                No tickets currently under contractor repair.
              </div>
            ) : (
              tickets
                .filter(t => t.status === 'In Progress')
                .map(t => (
                  <div
                    key={t.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '10px',
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: 'var(--shadow-xs)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--neutral-dark)' }}>
                        #{t.id}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: '#dbeafe',
                          color: '#1d4ed8'
                        }}
                      >
                        In Progress
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-blue)' }}>
                      {t.category} • {t.block} - Room {t.room}
                    </div>

                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#334155', lineHeight: 1.4 }}>
                      {t.description}
                    </p>

                    {t.wardenNotes && (
                      <div style={{ fontSize: '0.74rem', color: '#1e40af', background: '#eff6ff', padding: '6px 8px', borderRadius: '6px' }}>
                        <strong>Note:</strong> {t.wardenNotes}
                      </div>
                    )}

                    <div style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
                      Reported by {t.residentName}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        onClick={() => setSelectedTicketId(t.id)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--neutral-border)',
                          background: '#ffffff',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          color: 'var(--neutral-dark)',
                          cursor: 'pointer'
                        }}
                      >
                        Open / Add Note
                      </button>
                      <button
                        onClick={async () => {
                          setSelectedTicketId(t.id);
                        }}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#16a34a',
                          color: '#ffffff',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Resolve ✓
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* COLUMN 3: RESOLVED */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '2px solid #22c55e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--neutral-dark)', textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>
                RESOLVED
              </h2>
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                background: '#dcfce7',
                color: '#15803d'
              }}
            >
              {tickets.filter(t => t.status === 'Resolved').length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '300px' }}>
            {tickets.filter(t => t.status === 'Resolved').length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--neutral-muted)', fontSize: '0.84rem' }}>
                No completed tickets logged yet.
              </div>
            ) : (
              tickets
                .filter(t => t.status === 'Resolved')
                .map(t => (
                  <div
                    key={t.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '10px',
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: 'var(--shadow-xs)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--neutral-dark)' }}>
                        #{t.id}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: '#dcfce7',
                          color: '#15803d'
                        }}
                      >
                        ✓ Resolved
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a' }}>
                      {t.category} • {t.block} - Room {t.room}
                    </div>

                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.4 }}>
                      {t.description}
                    </p>

                    {t.wardenNotes && (
                      <div style={{ fontSize: '0.76rem', color: '#166534', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 8px', borderRadius: '6px' }}>
                        <strong>Resolution Note:</strong> {t.wardenNotes}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
                      <span>Resident: {t.residentName}</span>
                      <span>{t.resolvedAt ? new Date(t.resolvedAt).toLocaleDateString() : 'Closed'}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        onClick={() => setSelectedTicketId(t.id)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--neutral-border)',
                          background: '#ffffff',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          color: 'var(--neutral-dark)',
                          cursor: 'pointer'
                        }}
                      >
                        View Ticket Details / Edit Notes
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Ticket Management & Resolution Modal */}
      {selectedTicketId && activeTicket && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '28px',
              width: '100%',
              maxWidth: '560px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--neutral-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'var(--brand-yellow-subtle)',
                    color: 'var(--maint-primary)',
                    textTransform: 'uppercase'
                  }}
                >
                  {activeTicket.category} Ticket
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: '4px 0 0 0' }}>
                  Manage Ticket #{activeTicket.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicketId('')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--neutral-muted)',
                  fontSize: '1.2rem',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '18px', fontSize: '0.84rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div><strong>Resident:</strong> {activeTicket.residentName}</div>
                <div><strong>Room:</strong> {activeTicket.block} - {activeTicket.room}</div>
              </div>
              <div style={{ color: '#334155', lineHeight: 1.5 }}>
                <strong>Issue Description:</strong> {activeTicket.description}
              </div>
            </div>

            <form onSubmit={handleApplyUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
                  Lifecycle Status:
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--neutral-border)',
                    fontSize: '0.86rem',
                    background: '#ffffff'
                  }}
                >
                  <option value="Open">OPEN (Pending Dispatch)</option>
                  <option value="In Progress">IN PROGRESS (Contractor Assigned)</option>
                  <option value="Resolved">RESOLVED (Completed &amp; Verified)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
                  Warden Resolution Note:
                </label>
                <textarea
                  rows={3}
                  placeholder="Record technician action, spare parts used, or inspection feedback for resident..."
                  value={wardenNotes}
                  onChange={e => setWardenNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--neutral-border)',
                    fontSize: '0.86rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--brand-purple)',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save Status &amp; Notes
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await updateTicketStatus(
                      activeTicket.id,
                      'Resolved',
                      wardenNotes || 'Inspection verified and issue resolved.'
                    );
                    setFeedback(`Ticket #${activeTicket.id} marked as Resolved!`);
                    setSelectedTicketId('');
                    setTimeout(() => setFeedback(null), 3000);
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Mark Resolved ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
