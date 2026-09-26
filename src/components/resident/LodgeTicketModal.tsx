import React, { useState } from 'react';
import { UserProfile, Ticket, TicketCategory, TicketPriority, SmartMaintenanceAIResult } from '../../types';
import { analyzeMaintenanceWithAI } from '../../services/aiClassifier';
import { saveTicket } from '../../services/storageService';
import {
  X,
  Wrench,
  Sparkles,
  Zap,
  Droplets,
  Hammer,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  RotateCw,
  Check,
  ShieldAlert,
  Loader2
} from 'lucide-react';

interface LodgeTicketModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (ticket: Ticket) => void;
}

export const LodgeTicketModal: React.FC<LodgeTicketModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [room, setRoom] = useState(user.roomNumber || '204');
  const [block, setBlock] = useState(user.block || 'Block A');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Other');
  const [priority, setPriority] = useState<TicketPriority>('Medium');

  // AI Assistant states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<SmartMaintenanceAIResult | null>(null);
  const [aiApplied, setAiApplied] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  // 3 Competition Demonstration Chips
  const handleChipClick = (sampleText: string) => {
    setDescription(sampleText);
    setAiResult(null);
    setAiApplied(false);
  };

  const handleAnalyzeWithAI = async () => {
    if (!description.trim() || description.trim().length < 4) {
      setSubmitError('Please enter a brief description before analyzing with AI.');
      return;
    }
    setSubmitError(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeMaintenanceWithAI(description, room, block);
      setAiResult(result);
      setAiApplied(false);
    } catch (err: any) {
      setSubmitError('AI analysis temporarily interrupted. Please try again or select category manually.');
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
    setSubmitError(null);

    const cleanDesc = description.trim();
    if (!cleanDesc || cleanDesc.length < 5) {
      setSubmitError('Please provide a descriptive explanation (at least 5 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const newTicket: Ticket = {
        id: 'tkt-' + Date.now().toString().slice(-6),
        residentId: user.uid,
        residentName: user.name,
        room: room.trim().slice(0, 15) || user.roomNumber || '204',
        block: block.trim().slice(0, 20) || user.block || 'Block A',
        category,
        description: cleanDesc.slice(0, 500),
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
      onSuccess(newTicket);
      onClose();
    } catch (err) {
      setSubmitError('Unable to lodge maintenance ticket right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
          maxWidth: '640px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--brand-yellow-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--maint-primary)'
              }}
            >
              <Wrench size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Report Room Issue
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)', margin: 0 }}>
                Official campus repair request with Smart Maintenance AI triage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: 'none',
              color: 'var(--neutral-muted)',
              background: '#f1f5f9',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {submitError && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Room & Block info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">Room Number</label>
              <input
                type="text"
                required
                className="form-input"
                value={room}
                onChange={e => setRoom(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Hostel Block</label>
              <input
                type="text"
                required
                className="form-input"
                value={block}
                onChange={e => setBlock(e.target.value)}
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Problem Description</span>
              <span style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} color="#d97706" /> Smart Maintenance AI Assistant
              </span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe the issue in detail (e.g. Room fan is making noise and suddenly stopped working...)"
              className="form-textarea"
              value={description}
              onChange={e => {
                setDescription(e.target.value);
                if (submitError) setSubmitError(null);
              }}
            />
          </div>

          {/* 3 Competition Demo Chips */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              ⚡ Quick Test Examples:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleChipClick('Bathroom tap is leaking continuously.')}
                style={{
                  fontSize: '0.76rem',
                  padding: '5px 10px',
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
                  padding: '5px 10px',
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
                  padding: '5px 10px',
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

          {/* [Analyze with AI] Action Area */}
          <div style={{ marginBottom: '18px' }}>
            <button
              type="button"
              onClick={handleAnalyzeWithAI}
              disabled={isAnalyzing || !description.trim()}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid #fcd34d',
                background: isAnalyzing ? '#fef3c7' : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                color: '#92400e',
                fontSize: '0.86rem',
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

          {/* Compact Professional AI Result Card (Section 9) */}
          {aiResult && (
            <div
              className="animate-fade-in"
              style={{
                background: '#ffffff',
                border: '1.5px solid #fde68a',
                borderRadius: '14px',
                padding: '18px 20px',
                marginBottom: '22px',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.08)'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#d97706" />
                  <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#92400e' }}>
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

              <p style={{ fontSize: '0.78rem', color: '#78350f', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                Describe the problem and AI will suggest the maintenance category, priority and recommended action.
              </p>

              {/* 3 Core Output Metrics: Category, Priority, Urgency */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  background: '#fefce8',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #fef08a',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
                    Category
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#713f12', marginTop: '2px' }}>
                    {aiResult.category}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
                    Priority
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: aiResult.priority === 'Urgent' ? '#dc2626' : '#713f12', marginTop: '2px' }}>
                    {aiResult.priority}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
                    Urgency
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: aiResult.urgency === 'High' ? '#dc2626' : '#713f12', marginTop: '2px' }}>
                    {aiResult.urgency}
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div style={{ marginBottom: '8px', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 800, color: '#78350f' }}>AI Summary: </span>
                <span style={{ color: '#451a03' }}>{aiResult.summary}</span>
              </div>

              {/* Recommended Action */}
              <div style={{ marginBottom: '8px', fontSize: '0.82rem', background: '#fffbeb', padding: '8px 10px', borderRadius: '6px' }}>
                <span style={{ fontWeight: 800, color: '#92400e' }}>Recommended Action: </span>
                <span style={{ color: '#78350f' }}>{aiResult.suggestedAction}</span>
              </div>

              {/* Why this classification? Reasoning */}
              <div style={{ fontSize: '0.78rem', color: '#92400e', marginBottom: '14px', lineHeight: 1.4 }}>
                <strong>Why this classification? </strong>
                {aiResult.reasoning}
              </div>

              {/* Action Buttons: [Use AI Suggestions] [Analyze Again] */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleUseAiSuggestions}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: aiApplied ? '#16a34a' : 'var(--brand-purple)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Check size={15} />
                  {aiApplied ? 'Suggestions Applied ✓' : 'Use AI Suggestions'}
                </button>
                <button
                  type="button"
                  onClick={handleAnalyzeWithAI}
                  disabled={isAnalyzing}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--neutral-border)',
                    background: '#ffffff',
                    color: 'var(--neutral-dark)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCw size={14} />
                  Analyze Again
                </button>
              </div>
            </div>
          )}

          {/* Category & Priority Form Selectors (Resident retains final control) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">
                Category
                {aiApplied && (
                  <span style={{ color: '#16a34a', marginLeft: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                    (AI Populated)
                  </span>
                )}
              </label>
              <select
                className="form-select"
                value={category}
                onChange={e => setCategory(e.target.value as TicketCategory)}
              >
                <option value="Electrical">⚡ Electrical</option>
                <option value="Plumbing">💧 Plumbing</option>
                <option value="Carpentry">🔨 Carpentry</option>
                <option value="Other">🛠️ Other</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                Priority
                {aiApplied && (
                  <span style={{ color: '#16a34a', marginLeft: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                    (AI Populated)
                  </span>
                )}
              </label>
              <select
                className="form-select"
                value={priority}
                onChange={e => setPriority(e.target.value as TicketPriority)}
              >
                <option value="Low">Low (General)</option>
                <option value="Medium">Medium (Normal)</option>
                <option value="High">High (Impacting Routine)</option>
                <option value="Urgent">🚨 Urgent (Immediate / Hazard)</option>
              </select>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ minWidth: '160px' }}
            >
              {submitting ? 'Transmitting...' : 'Submit to Warden'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
