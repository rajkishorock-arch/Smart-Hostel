import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { Ticket, TicketCategory, TicketPriority, SmartMaintenanceAIResult } from '../../types';
import { saveTicket } from '../../services/storageService';
import { analyzeMaintenanceWithAI } from '../../services/aiClassifier';
import {
  Wrench,
  Sparkles,
  AlertTriangle,
  RotateCw,
  Check,
  Loader2,
  Zap,
  Droplets,
  Hammer,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const ResidentReportIssuePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(user?.roomNumber || '204');
  const [block, setBlock] = useState(user?.block || 'Block A');
  const [category, setCategory] = useState<TicketCategory>('Electrical');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [description, setDescription] = useState('');

  // AI Assistant states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<SmartMaintenanceAIResult | null>(null);
  const [aiApplied, setAiApplied] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3 Competition Demonstration Chips
  const handleChipClick = (sampleText: string) => {
    setDescription(sampleText);
    setAiResult(null);
    setAiApplied(false);
  };

  const handleAnalyzeWithAI = async () => {
    if (!description.trim() || description.trim().length < 4) {
      setError('Please describe the problem before analyzing with AI.');
      return;
    }
    setError(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeMaintenanceWithAI(description, room, block);
      setAiResult(result);
      setAiApplied(false);
    } catch (err: any) {
      setError('AI analysis temporarily interrupted. Please try again or select category manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUseAiSuggestions = () => {
    if (aiResult) {
      setCategory(aiResult.category);
      setPriority(aiResult.priority);
      setAiApplied(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 5) {
      setError('Please provide a descriptive explanation (at least 5 characters).');
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
        room: room.trim().slice(0, 15) || user.roomNumber || '204',
        block: block.trim().slice(0, 20) || user.block || 'Block A',
        category,
        description: description.trim(),
        priority,
        status: 'Open',
        aiClassified: Boolean(aiResult),
        aiConfidence: aiResult?.confidence || 0,
        aiSuggestedCategory: aiResult?.category,
        aiSuggestedPriority: aiResult?.priority,
        aiUrgency: aiResult?.urgency,
        aiSummary: aiResult?.summary,
        aiSuggestedAction: aiResult?.suggestedAction,
        aiReasoning: aiResult?.reasoning,
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
            Submit an official repair ticket for your hostel room with Smart Maintenance AI triage.
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
          My Tickets <ArrowRight size={14} />
        </Link>
      </div>

      {error && (
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '24px',
            fontSize: '0.86rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Container */}
      <div
        style={{
          maxWidth: '720px',
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Room & Block */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
                Room Number:
              </label>
              <input
                type="text"
                required
                value={room}
                onChange={e => setRoom(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--neutral-border)',
                  fontSize: '0.88rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
                Hostel Block:
              </label>
              <input
                type="text"
                required
                value={block}
                onChange={e => setBlock(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--neutral-border)',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
              <span>Problem Description:</span>
              <span style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} color="#d97706" /> Smart Maintenance AI Assistant
              </span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe the issue in detail (e.g. Room fan stopped working and switch is sparking...)"
              value={description}
              onChange={e => {
                setDescription(e.target.value);
                if (error) setError(null);
              }}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid var(--neutral-border)',
                fontSize: '0.88rem',
                fontFamily: 'inherit',
                lineHeight: 1.5
              }}
            />
          </div>

          {/* 3 Competition Demo Chips (Section 17) */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              ⚡ Quick Test Examples:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleChipClick('Bathroom tap is leaking continuously.')}
                style={{
                  fontSize: '0.76rem',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: '1px solid #bfdbfe',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                💧 Leaking bathroom tap
              </button>
              <button
                type="button"
                onClick={() => handleChipClick('Room fan stopped working and switch is sparking.')}
                style={{
                  fontSize: '0.76rem',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#dc2626',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ⚡ Fan sparking
              </button>
              <button
                type="button"
                onClick={() => handleChipClick('Door hinge and wooden frame are broken.')}
                style={{
                  fontSize: '0.76rem',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: '1px solid #fed7aa',
                  background: '#fff7ed',
                  color: '#c2410c',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🔨 Broken door hinge
              </button>
            </div>
          </div>

          {/* [Analyze with AI] Button (Section 2 & 15) */}
          <div>
            <button
              type="button"
              onClick={handleAnalyzeWithAI}
              disabled={isAnalyzing || !description.trim()}
              style={{
                width: '100%',
                padding: '11px 18px',
                borderRadius: '10px',
                border: '1px solid #fcd34d',
                background: isAnalyzing ? '#fef3c7' : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                color: '#92400e',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: isAnalyzing || !description.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 1px 3px rgba(217, 119, 6, 0.15)'
              }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Analyzing maintenance issue...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} color="#d97706" />
                  <span>Analyze with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Compact Professional AI Result Card (Section 1, 3, 9) */}
          {aiResult && (
            <div
              className="animate-fade-in"
              style={{
                background: '#ffffff',
                border: '1.5px solid #fde68a',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#d97706" />
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e' }}>
                    Smart Maintenance AI
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {aiResult.source === 'local_fallback' && (
                    <span style={{ fontSize: '0.7rem', color: '#b45309', background: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>
                      Smart Classification Fallback
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      background: '#ecfdf5',
                      color: '#065f46',
                      border: '1px solid #a7f3d0',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}
                  >
                    {aiResult.confidence}% Confidence
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#78350f', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                Describe the problem and AI will suggest the maintenance category, priority and recommended action.
              </p>

              {/* Category, Priority, Urgency Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  background: '#fefce8',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #fef08a',
                  marginBottom: '14px',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
                    Category
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#713f12', marginTop: '2px' }}>
                    {aiResult.category}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
                    Priority
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: aiResult.priority === 'Urgent' ? '#dc2626' : '#713f12', marginTop: '2px' }}>
                    {aiResult.priority}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
                    Urgency
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: aiResult.urgency === 'High' ? '#dc2626' : '#713f12', marginTop: '2px' }}>
                    {aiResult.urgency}
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div style={{ marginBottom: '10px', fontSize: '0.84rem' }}>
                <span style={{ fontWeight: 800, color: '#78350f' }}>AI Summary: </span>
                <span style={{ color: '#451a03' }}>{aiResult.summary}</span>
              </div>

              {/* Recommended Action */}
              <div style={{ marginBottom: '10px', fontSize: '0.84rem', background: '#fffbeb', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ fontWeight: 800, color: '#92400e' }}>Recommended Action: </span>
                <span style={{ color: '#78350f' }}>{aiResult.suggestedAction}</span>
              </div>

              {/* Explainable Reasoning (Section 12) */}
              <div style={{ fontSize: '0.8rem', color: '#92400e', marginBottom: '16px', lineHeight: 1.4 }}>
                <strong>Why this classification? </strong>
                {aiResult.reasoning}
              </div>

              {/* Buttons: [Use AI Suggestions] [Analyze Again] */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleUseAiSuggestions}
                  style={{
                    flex: 1,
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: aiApplied ? '#16a34a' : 'var(--brand-purple)',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Check size={16} />
                  {aiApplied ? 'Suggestions Applied ✓' : 'Use AI Suggestions'}
                </button>
                <button
                  type="button"
                  onClick={handleAnalyzeWithAI}
                  disabled={isAnalyzing}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--neutral-border)',
                    background: '#ffffff',
                    color: 'var(--neutral-dark)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCw size={15} />
                  Analyze Again
                </button>
              </div>
            </div>
          )}

          {/* Form Selectors: Category & Priority (Resident retains final control) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
                Category:
                {aiApplied && (
                  <span style={{ color: '#16a34a', marginLeft: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                    (AI Populated)
                  </span>
                )}
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TicketCategory)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--neutral-border)',
                  fontSize: '0.88rem',
                  background: '#ffffff'
                }}
              >
                <option value="Electrical">⚡ Electrical</option>
                <option value="Plumbing">💧 Plumbing</option>
                <option value="Carpentry">🔨 Carpentry</option>
                <option value="Other">🛠️ Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
                Priority:
                {aiApplied && (
                  <span style={{ color: '#16a34a', marginLeft: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                    (AI Populated)
                  </span>
                )}
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TicketPriority)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--neutral-border)',
                  fontSize: '0.88rem',
                  background: '#ffffff'
                }}
              >
                <option value="Low">Low (General)</option>
                <option value="Medium">Medium (Normal)</option>
                <option value="High">High (Impacting Routine)</option>
                <option value="Urgent">🚨 Urgent (Immediate / Hazard)</option>
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <Link
              to="/resident/maintenance/tickets"
              style={{
                padding: '11px 20px',
                borderRadius: '8px',
                border: '1px solid var(--neutral-border)',
                background: '#ffffff',
                color: 'var(--neutral-dark)',
                fontSize: '0.88rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '11px 28px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--maint-primary)',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit to Warden Desk'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};
