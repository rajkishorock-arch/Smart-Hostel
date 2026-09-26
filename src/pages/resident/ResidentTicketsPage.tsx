import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { Ticket } from '../../types';
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
  Sparkles
} from 'lucide-react';

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
    // Subscribe to tickets strictly scoped to resident uid
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
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
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
            Real-time status updates, technician appointments, and resolution notes from the Warden Desk.
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
            gap: '6px'
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
          placeholder="Search tickets by ID, category, keyword..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '9px 12px 9px 36px',
            borderRadius: '8px',
            border: '1px solid var(--neutral-border)',
            fontSize: '0.85rem',
            background: '#ffffff'
          }}
        />
      </div>

      {/* Tickets Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {filteredTickets.length === 0 ? (
          <div
            style={{
              padding: '48px',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid var(--neutral-border)',
              color: 'var(--neutral-muted)'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--neutral-dark)', marginBottom: '6px' }}>
              No maintenance tickets filed yet
            </div>
            <p style={{ fontSize: '0.86rem', margin: '0 0 16px 0' }}>
              If your ceiling fan, washbasin, or study furniture requires repair, lodge a ticket now.
            </p>
            <Link
              to="/resident/maintenance/report"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '8px',
                background: 'var(--maint-primary)',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 700
              }}
            >
              <PlusCircle size={15} /> Report Issue
            </Link>
          </div>
        ) : (
          filteredTickets.map(t => (
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--neutral-dark)' }}>
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
                      background: t.priority === 'Urgent' ? '#fef2f2' : t.priority === 'High' ? '#fffbeb' : '#f8fafc',
                      color: t.priority === 'Urgent' ? '#dc2626' : t.priority === 'High' ? '#d97706' : '#64748b'
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
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background:
                      t.status === 'Resolved' ? '#dcfce7' : t.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                    color:
                      t.status === 'Resolved' ? '#15803d' : t.status === 'In Progress' ? '#1d4ed8' : '#b45309'
                  }}
                >
                  ● {t.status}
                </span>
              </div>

              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--neutral-dark)', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                {t.description}
              </h2>

              {(t.aiSummary || t.aiSuggestedAction) && (
                <div
                  style={{
                    background: '#fefce8',
                    border: '1px solid #fef08a',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    margin: '10px 0',
                    fontSize: '0.82rem',
                    color: '#713f12'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800, color: '#854d0e', marginBottom: '3px' }}>
                    <Sparkles size={12} color="#d97706" /> AI Triage Assessment
                  </div>
                  {t.aiSummary && <div><strong>Summary:</strong> {t.aiSummary}</div>}
                  {t.aiSuggestedAction && <div style={{ marginTop: '2px', color: '#854d0e' }}><strong>Action:</strong> {t.aiSuggestedAction}</div>}
                </div>
              )}

              {t.wardenNotes && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--neutral-border)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    margin: '12px 0',
                    fontSize: '0.84rem',
                    color: '#334155'
                  }}
                >
                  <strong style={{ color: 'var(--maint-primary)' }}>Warden Desk Note:</strong> {t.wardenNotes}
                </div>
              )}

              <div style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', marginTop: '10px' }}>
                Lodge Date: {new Date(t.createdAt).toLocaleString()} • Room {t.room} ({t.block})
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
};
