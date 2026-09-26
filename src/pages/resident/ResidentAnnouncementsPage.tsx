import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Announcement } from '../../types';
import { subscribeAnnouncements } from '../../services/storageService';
import {
  Megaphone,
  Calendar,
  Building2,
  UtensilsCrossed,
  Wrench,
  ShieldCheck
} from 'lucide-react';

export const ResidentAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    // STRICT: publishedOnly = true ensures unpublished drafts are never sent to resident
    const unsub = subscribeAnnouncements(list => setAnnouncements(list), true);
    return () => unsub();
  }, []);

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[
        { label: 'Smart Mess', href: '/resident/mess/today' },
        { label: 'Campus Announcements' }
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
                color: 'var(--brand-purple)',
                background: 'var(--brand-purple-subtle)',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Megaphone size={14} /> Official Broadcasts
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Hostel & Mess Announcements
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Official notices regarding dining festivals, maintenance outages, and hostel administrative circulars.
          </p>
        </div>
      </div>

      {/* Announcements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {announcements.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--neutral-border)',
              color: 'var(--neutral-muted)'
            }}
          >
            No active announcements published at this time.
          </div>
        ) : (
          announcements.map(ann => {
            const isMess = ann.category === 'Mess';
            const isMaint = ann.category === 'Maintenance';
            const isHostel = ann.category === 'Hostel';

            return (
              <div
                key={ann.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--neutral-border)',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: isMess
                        ? 'var(--brand-green-subtle)'
                        : isMaint
                        ? 'var(--brand-yellow-subtle)'
                        : isHostel
                        ? 'var(--brand-blue-subtle)'
                        : '#f1f5f9',
                      color: isMess
                        ? 'var(--mess-accent)'
                        : isMaint
                        ? 'var(--maint-primary)'
                        : isHostel
                        ? 'var(--brand-blue)'
                        : '#475569',
                      textTransform: 'uppercase'
                    }}
                  >
                    {ann.category} Notice
                  </span>

                  <span style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: '0 0 10px 0' }}>
                  {ann.title}
                </h2>

                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  {ann.content}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
                  <ShieldCheck size={14} color="#16a34a" />
                  <span>Broadcasted by: <strong>{ann.author}</strong></span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AppLayout>
  );
};
