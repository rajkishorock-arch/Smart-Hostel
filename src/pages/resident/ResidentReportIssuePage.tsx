import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { Ticket, TicketCategory, TicketPriority } from '../../types';
import { saveTicket } from '../../services/storageService';
import { classifyTicketText, AIClassificationResult } from '../../services/aiClassifier';
import {
  PlusCircle,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Zap,
  Droplets,
  Hammer,
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ResidentReportIssuePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = useState<TicketCategory>('Electrical');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [description, setDescription] = useState('');
  const [smartSuggestion, setSmartSuggestion] = useState<AIClassificationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setDescription(val);
    if (val.trim().length > 4) {
      const result = classifyTicketText(val);
      if (result.matchedKeywords.length > 0) {
        setSmartSuggestion(result);
      } else {
        setSmartSuggestion(null);
      }
    } else {
      setSmartSuggestion(null);
    }
  };

  const applySuggestion = () => {
    if (smartSuggestion) {
      setCategory(smartSuggestion.category);
      setPriority(smartSuggestion.priority);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please describe the issue in detail.');
      return;
    }
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newTicket: Ticket = {
        id: `tkt-${Date.now().toString().slice(-5)}`,
        residentId: user.uid,
        residentName: user.name || 'Resident',
        room: user.roomNumber || '204',
        block: user.block || 'Block A',
        category,
        description,
        priority,
        status: 'Open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveTicket(newTicket);
      navigate('/resident/maintenance/tickets', {
        state: { successMessage: `Ticket #${newTicket.id} (${newTicket.category}) successfully lodged to Warden Desk!` }
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to submit maintenance ticket.');
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { name: 'Electrical' as TicketCategory, icon: Zap, label: 'Electrical', desc: 'Lights, fan, socket spark, switch' },
    { name: 'Plumbing' as TicketCategory, icon: Droplets, label: 'Plumbing', desc: 'Tap leak, drain clog, flush, geyser' },
    { name: 'Carpentry' as TicketCategory, icon: Hammer, label: 'Carpentry', desc: 'Door lock, cupboard, bed frame, table' },
    { name: 'Other' as TicketCategory, icon: HelpCircle, label: 'Other', desc: 'Civil, painting, pest, general request' }
  ];

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[
        { label: 'Maintenance', href: '/resident/maintenance/tickets' },
        { label: 'Report Room Issue' }
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
              <Wrench size={14} /> Maintenance Service Desk
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Lodge Maintenance Issue
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Submit an official repair ticket for your hostel room. The Warden Desk will assign a technician.
          </p>
        </div>

        <Link
          to="/resident/maintenance/tickets"
          style={{
            padding: '9px 16px',
            borderRadius: '8px',
            border: '1px solid var(--neutral-border)',
            background: '#f8fafc',
            color: 'var(--neutral-dark)',
            fontSize: '0.84rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          View My Tickets Queue <ArrowRight size={14} />
        </Link>
      </div>

      {error && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '24px',
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <div
        style={{
          maxWidth: '800px',
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Room Location Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--neutral-border)' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Resident Name
              </span>
              <div style={{ fontWeight: 800, color: 'var(--neutral-dark)', marginTop: '2px' }}>
                {user?.name}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Room & Block Location
              </span>
              <div style={{ fontWeight: 800, color: 'var(--brand-blue)', marginTop: '2px' }}>
                Room {user?.roomNumber || '204'} • {user?.block || 'Block A'}
              </div>
            </div>
          </div>

          {/* 1. Category Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: 'var(--neutral-dark)', marginBottom: '10px' }}>
              1. Select Issue Category:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
              {categoryOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = category === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setCategory(opt.name)}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid var(--maint-primary)' : '1px solid var(--neutral-border)',
                      background: isSelected ? '#fffdfa' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: isSelected ? 'var(--brand-yellow-subtle)' : '#f1f5f9', color: isSelected ? 'var(--maint-primary)' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: isSelected ? 'var(--maint-primary)' : 'var(--neutral-dark)' }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', marginTop: '2px' }}>
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Urgency / Priority */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: 'var(--neutral-dark)', marginBottom: '8px' }}>
              2. Urgency Level:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
              {(['Low', 'Medium', 'High', 'Urgent'] as TicketPriority[]).map(pri => (
                <button
                  key={pri}
                  type="button"
                  onClick={() => setPriority(pri)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: priority === pri ? '2px solid var(--maint-primary)' : '1px solid var(--neutral-border)',
                    background: priority === pri ? 'var(--brand-yellow-subtle)' : '#f8fafc',
                    color: priority === pri ? 'var(--maint-primary)' : 'var(--neutral-dark)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  {pri}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
              3. Describe the Problem:
            </label>
            <textarea
              rows={5}
              required
              placeholder="e.g. Ceiling fan regulator is broken, or bathroom tap is leaking..."
              value={description}
              onChange={handleDescriptionChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--neutral-border)',
                fontSize: '0.88rem',
                fontFamily: 'inherit',
                lineHeight: 1.5
              }}
            />

            {smartSuggestion && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'var(--brand-yellow-subtle)',
                  border: '1px solid #fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#92400e' }}>
                  <Sparkles size={16} color="var(--maint-primary)" />
                  <span>
                    Smart Classification: <strong>{smartSuggestion.category}</strong> ({smartSuggestion.priority} priority) detected from "{smartSuggestion.matchedKeywords.join(', ')}".
                  </span>
                </div>
                <button
                  type="button"
                  onClick={applySuggestion}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--maint-primary)',
                    color: '#ffffff',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Apply Suggestion
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <Link
              to="/resident/maintenance/tickets"
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid var(--neutral-border)',
                background: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: 'var(--neutral-dark)'
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--maint-primary)',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PlusCircle size={16} /> {isSubmitting ? 'Submitting...' : 'Submit Maintenance Ticket'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};
