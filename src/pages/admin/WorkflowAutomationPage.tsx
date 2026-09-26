import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { getWorkflows, toggleWorkflow, triggerManualWorkflowRun, saveWorkflows } from '../../services/automationService';
import { AutomationWorkflow } from '../../types';
import {
  Zap,
  Play,
  CheckCircle2,
  Clock,
  Filter,
  PlusCircle,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Power,
  RotateCcw
} from 'lucide-react';

export const WorkflowAutomationPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // New Rule Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTrigger, setNewTrigger] = useState('New Maintenance Complaint');
  const [newCondition, setNewCondition] = useState('Priority == "Critical"');
  const [newAction, setNewAction] = useState('Dispatch SMS alert to Chief Warden');
  const [newCategory, setNewCategory] = useState<'Escalation' | 'Billing' | 'Allocation' | 'Maintenance' | 'Security'>('Escalation');

  useEffect(() => {
    setWorkflows(getWorkflows());
    const handler = () => setWorkflows(getWorkflows());
    window.addEventListener('sh_workflows_updated', handler);
    return () => window.removeEventListener('sh_workflows_updated', handler);
  }, []);

  const handleToggle = (id: string) => {
    const updated = toggleWorkflow(id);
    setWorkflows(updated);
  };

  const handleRunNow = (id: string) => {
    const res = triggerManualWorkflowRun(id);
    if (res.success) {
      setActionMsg(res.message);
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newWf: AutomationWorkflow = {
      id: `WF-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      trigger: newTrigger,
      condition: newCondition,
      action: newAction,
      enabled: true,
      runCount: 0,
      lastRunAt: 'Never',
      category: newCategory
    };

    const updated = [newWf, ...workflows];
    saveWorkflows(updated);
    setWorkflows(updated);
    setIsModalOpen(false);
    setNewTitle('');
    setActionMsg(`New workflow "${newWf.title}" deployed successfully!`);
    setTimeout(() => setActionMsg(null), 4000);
  };

  const filteredWorkflows = workflows.filter(w =>
    selectedCategory === 'All' || w.category === selectedCategory
  );

  return (
    <AppLayout
      activeDomain="dashboard"
      breadcrumbs={[
        { label: 'Campus Operations', href: '/admin/dashboard' },
        { label: 'Workflow Automation & Rules' }
      ]}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '6px', background: '#eff6ff', color: 'var(--brand-blue)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              <Zap size={14} /> No-Code Rule Engine
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Autonomous Workflow Engine
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Configure proactive event-driven triggers, conditional logic, and automated operational actions across campus.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--brand-purple)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <PlusCircle size={16} />
            <span>Create Automation Rule</span>
          </button>
        </div>

        {/* Action Message Feedback */}
        {actionMsg && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Automations</span>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#16a34a', marginTop: '6px' }}>
              {workflows.filter(w => w.enabled).length} of {workflows.length}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Operational rules live</div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Autonomous Runs</span>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--brand-purple)', marginTop: '6px' }}>
              {workflows.reduce((acc, w) => acc + w.runCount, 0)} Executions
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Zero human intervention needed</div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Estimated Admin Time Saved</span>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
              ~18.5 Hours/wk
            </div>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>52% reduction in manual calls</div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
          {['All', 'Escalation', 'Billing', 'Allocation', 'Maintenance', 'Security'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: selectedCategory === cat ? 'var(--brand-purple)' : '#f1f5f9',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Workflows List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredWorkflows.map(wf => (
            <div
              key={wf.id}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '20px 24px',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                opacity: wf.enabled ? 1 : 0.65
              }}
            >
              <div style={{ maxWidth: '680px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: '#f1f5f9',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {wf.category} &bull; {wf.id}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                    &bull; Ran {wf.runCount} times ({wf.lastRunAt || 'Never'})
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
                  {wf.title}
                </h3>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <div style={{ background: '#f8fafc', padding: '4px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <strong>WHEN:</strong> {wf.trigger}
                  </div>
                  <div style={{ background: '#f8fafc', padding: '4px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <strong>IF:</strong> {wf.condition}
                  </div>
                  <div style={{ background: '#eff6ff', color: 'var(--brand-blue)', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                    <strong>THEN:</strong> {wf.action}
                  </div>
                </div>
              </div>

              {/* Actions & Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleRunNow(wf.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-default)',
                    background: '#f8fafc',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  title="Test-run this rule immediately"
                >
                  <Play size={14} color="#16a34a" />
                  <span>Run Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggle(wf.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: wf.enabled ? '#ecfdf5' : '#f1f5f9',
                    color: wf.enabled ? '#047857' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Power size={14} />
                  <span>{wf.enabled ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Create Custom Automation Rule */}
        {isModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(3px)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '520px',
                background: '#ffffff',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: 'var(--shadow-lg)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
                Create Custom Automation Workflow
              </h3>

              <form onSubmit={handleCreateRule} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Rule Title:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Auto-Notify Resident on Electrical Ticket Resolution"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Category:</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '0.85rem', outline: 'none', background: '#ffffff' }}
                  >
                    <option value="Escalation">Escalation</option>
                    <option value="Billing">Billing &amp; Payments</option>
                    <option value="Allocation">Room Allocation</option>
                    <option value="Maintenance">Maintenance &amp; Asset</option>
                    <option value="Security">Security &amp; Access</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>WHEN (Event Trigger):</label>
                  <input
                    type="text"
                    required
                    value={newTrigger}
                    onChange={e => setNewTrigger(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>IF (Condition Filter):</label>
                  <input
                    type="text"
                    required
                    value={newCondition}
                    onChange={e => setNewCondition(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>THEN (Autonomous Action):</label>
                  <input
                    type="text"
                    required
                    value={newAction}
                    onChange={e => setNewAction(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-default)', background: '#ffffff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: 'var(--brand-purple)', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Deploy Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};
