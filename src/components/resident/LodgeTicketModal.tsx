import React, { useState, useEffect } from 'react';
import { UserProfile, Ticket, TicketCategory, TicketPriority } from '../../types';
import { classifyTicketText, AIClassificationResult } from '../../services/aiClassifier';
import { saveTicket } from '../../services/storageService';
import {
  X,
  Wrench,
  Bot,
  Sparkles,
  Zap,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Droplet,
  Hammer,
  HelpCircle
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
  const [aiResult, setAiResult] = useState<AIClassificationResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userOverridden, setUserOverridden] = useState(false);

  // Run AI classification whenever description changes
  useEffect(() => {
    if (!description.trim()) {
      setAiResult(null);
      return;
    }

    const timer = setTimeout(() => {
      const result = classifyTicketText(description);
      setAiResult(result);

      // Auto-apply AI suggestion if user hasn't deliberately overridden
      if (!userOverridden) {
        setCategory(result.category);
        setPriority(result.priority);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [description, userOverridden]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    try {
      const newTicket: Ticket = {
        id: 'tkt-' + Date.now().toString().slice(-6),
        residentId: user.uid,
        residentName: user.name,
        room: room.trim() || user.roomNumber || '204',
        block: block.trim() || user.block || 'Block A',
        category,
        description: description.trim(),
        priority,
        status: 'Open',
        aiClassified: Boolean(aiResult && aiResult.confidence > 50),
        aiConfidence: aiResult?.confidence || 0,
        aiSuggestedCategory: aiResult?.category,
        aiSuggestedPriority: aiResult?.priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveTicket(newTicket);
      onSuccess(newTicket);
      onClose();
    } catch (err) {
      console.error('Failed to submit ticket:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyPreset = (sampleText: string) => {
    setUserOverridden(false);
    setDescription(sampleText);
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
          maxWidth: '620px',
          maxHeight: '90vh',
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
                background: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f46e5'
              }}
            >
              <Wrench size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Lodge Maintenance Issue
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                Automatic AI classification &amp; direct warden dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: '#64748b',
              background: '#f1f5f9'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Example Scenarios for Testing */}
        <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            ⚡ One-Click Competition Test Prompts:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleApplyPreset('Fan is not working and there is a burning smell.')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.775rem', background: '#fffbeb', borderColor: '#fde68a', color: '#b45309' }}
            >
              ⚡ Fan burning smell (Electrical)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('Bathroom tap is leaking heavily and the basin drain is clogged.')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.775rem', background: '#eff6ff', borderColor: '#bfdbfe', color: '#1d4ed8' }}
            >
              💧 Tap leaking &amp; clogged (Plumbing)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('Wardrobe door hinge is broken and cupboard door fell off.')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.775rem', background: '#fdf4ff', borderColor: '#f5d0fe', color: '#a21caf' }}
            >
              🔨 Broken hinge &amp; cupboard (Carpentry)
            </button>
          </div>
        </div>

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
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Notes / Description</span>
              <span style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Bot size={14} /> AI Auto-Classifier Active
              </span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. Fan is not working and there is a burning smell..."
              className="form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* AI Detection Banner */}
          {aiResult && description.trim().length > 3 && (
            <div className="ai-pulse-box animate-fade-in" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#7c3aed" />
                  <span style={{ fontWeight: 800, color: '#5b21b6', fontSize: '0.875rem' }}>
                    AI Classification Engine: {aiResult.category}
                  </span>
                </div>
                <span
                  style={{
                    background: '#7c3aed',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  {aiResult.confidence}% Confidence
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#4c1d95', margin: 0, lineHeight: 1.5 }}>
                {aiResult.reasoning}
              </p>
            </div>
          )}

          {/* Category & Priority Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">
                Assigned Category
                {aiResult && category === aiResult.category && (
                  <span style={{ color: '#7c3aed', marginLeft: '6px', fontSize: '0.75rem' }}>
                    (AI Verified)
                  </span>
                )}
              </label>
              <select
                className="form-select"
                value={category}
                onChange={e => {
                  setUserOverridden(true);
                  setCategory(e.target.value as TicketCategory);
                }}
              >
                <option value="Electrical">⚡ Electrical</option>
                <option value="Plumbing">💧 Plumbing</option>
                <option value="Carpentry">🔨 Carpentry</option>
                <option value="Other">🛠️ Other</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                Urgency Priority
                {aiResult && priority === aiResult.priority && (
                  <span style={{ color: '#7c3aed', marginLeft: '6px', fontSize: '0.75rem' }}>
                    (AI Suggested)
                  </span>
                )}
              </label>
              <select
                className="form-select"
                value={priority}
                onChange={e => {
                  setUserOverridden(true);
                  setPriority(e.target.value as TicketPriority);
                }}
              >
                <option value="Low">Low (General)</option>
                <option value="Medium">Medium (Normal)</option>
                <option value="High">High (Impacting Routine)</option>
                <option value="Urgent">🚨 Urgent (Immediate / Hazard)</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
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
