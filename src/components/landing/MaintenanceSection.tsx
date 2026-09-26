import React, { useState } from 'react';
import {
  Wrench,
  Zap,
  Droplet,
  Hammer,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Cpu
} from 'lucide-react';
import { classifyTicketText } from '../../services/aiClassifier';
import { Link } from 'react-router-dom';

export const MaintenanceSection: React.FC = () => {
  const [demoInput, setDemoInput] = useState<string>('Bathroom tap is leaking heavily');
  const classification = classifyTicketText(demoInput);

  const presetExamples = [
    { label: 'Plumbing Issue', text: 'Bathroom tap is leaking heavily' },
    { label: 'Electrical Issue', text: 'Room ceiling fan is not working and making noise' },
    { label: 'Carpentry Issue', text: 'Door hinge is broken and cupboard handle is loose' },
    { label: 'Emergency Electrical', text: 'Burning smell and spark coming from wall socket' }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Electrical':
        return <Zap size={18} color="#eab308" />;
      case 'Plumbing':
        return <Droplet size={18} color="#0284c7" />;
      case 'Carpentry':
        return <Hammer size={18} color="#d97706" />;
      default:
        return <HelpCircle size={18} color="#64748b" />;
    }
  };

  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' };
      case 'High':
        return { background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' };
      case 'Medium':
        return { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' };
      default:
        return { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' };
    }
  };

  return (
    <section id="maintenance" style={{ padding: '80px 0', background: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#92400e',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px'
            }}
          >
            <Wrench size={14} />
            <span>Shared Maintenance Management</span>
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '16px'
            }}
          >
            Fast, Transparent Hostel Care
          </h2>

          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Say goodbye to lost paper complaints. When something breaks, residents lodge a ticket with smart automated
            trade classification. Wardens prioritize, assign technicians, and update status in real time.
          </p>
        </div>

        {/* 1. Maintenance Workflow Visual: Resident -> Classify -> Warden -> Resolved */}
        <div
          style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '32px 24px',
            marginBottom: '48px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Complete Service Ticket Lifecycle
            </h3>
            <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
              From initial complaint submission to verified technician resolution
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              alignItems: 'center'
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5', background: '#e0e7ff', padding: '2px 8px', borderRadius: '4px' }}>
                  STEP 01
                </span>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                  Resident Lodges
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Student describes the fault (e.g., &ldquo;Ceiling fan vibrating and humming&rdquo;). Room is tagged automatically.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #fde68a',
                borderRadius: '12px',
                padding: '18px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400e', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>
                  STEP 02
                </span>
                <span style={{ fontWeight: 700, color: '#92400e', fontSize: '0.9rem' }}>
                  Smart Classification
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Analyzes text for electrical, plumbing, or carpentry keywords and auto-assigns urgency priority.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                  STEP 03
                </span>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                  Warden Dispatches
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Ticket moves to <strong>In Progress</strong>. Warden assigns maintenance contractor or campus electrician.
              </p>
            </div>

            {/* Step 4 */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #bbf7d0',
                borderRadius: '12px',
                padding: '18px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#065f46', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                  STEP 04
                </span>
                <span style={{ fontWeight: 700, color: '#065f46', fontSize: '0.9rem' }}>
                  Resolved &amp; Logged
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Warden enters resolution notes. Status updates to <strong>Resolved</strong> and archives with audit timestamp.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Interactive Smart Classification Demonstration */}
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#b45309'
                }}
              >
                <Cpu size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Interactive Smart Classification Tester
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Test real problem statements and inspect automated trade recommendation
                </span>
              </div>
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#475569',
                background: '#f1f5f9',
                padding: '4px 10px',
                borderRadius: '6px'
              }}
            >
              Zero-Latency Client-Side NLP Heuristics
            </span>
          </div>

          {/* Quick preset chips */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginRight: '8px' }}>
              Try sample requests:
            </span>
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {presetExamples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setDemoInput(ex.text)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: '1px solid #cbd5e1',
                    background: demoInput === ex.text ? '#f1f5f9' : '#ffffff',
                    color: demoInput === ex.text ? '#0f172a' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="interactive-ticket-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Resident Issue Description:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="interactive-ticket-input"
                type="text"
                value={demoInput}
                onChange={e => setDemoInput(e.target.value)}
                placeholder="e.g. Bathroom tap is leaking or fan capacitor stopped"
                className="input-field"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  border: '1.5px solid #cbd5e1'
                }}
              />
            </div>
          </div>

          {/* Live Classification Result Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#d97706" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Smart Recommendation Output
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Confidence Score: <strong>{classification.confidence}%</strong>
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '16px'
              }}
            >
              {/* Category Output */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Suggested Trade Category
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  {getCategoryIcon(classification.category)}
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    {classification.category}
                  </span>
                </div>
              </div>

              {/* Priority Output */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Computed Priority
                </span>
                <div style={{ marginTop: '4px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      ...getPriorityBadgeStyle(classification.priority)
                    }}
                  >
                    {classification.priority}
                  </span>
                </div>
              </div>

              {/* Matched Keywords */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Detected Keyword Signals
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                  {classification.matchedKeywords.length > 0 ? (
                    classification.matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.72rem',
                          background: '#f1f5f9',
                          color: '#334155',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontFamily: 'monospace'
                        }}
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>None detected</span>
                  )}
                </div>
              </div>
            </div>

            {/* Honest Technical Explanation */}
            <div
              style={{
                fontSize: '0.8rem',
                color: '#475569',
                lineHeight: 1.5,
                borderTop: '1px solid #e2e8f0',
                paddingTop: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Honest Architecture:</strong> Classification runs via client-side contextual pattern matching rules.
                It requires zero external API tokens or remote servers, guaranteeing that sensitive room information remains confidential
                while executing with zero latency.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
