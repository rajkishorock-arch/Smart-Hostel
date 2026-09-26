import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { INITIAL_WEBHOOKS } from '../../services/automationService';
import { WebhookEndpoint } from '../../types';
import {
  Code2,
  Terminal,
  Webhook,
  Key,
  CheckCircle2,
  Send,
  ExternalLink,
  Copy,
  PlusCircle,
  FileCode,
  ShieldAlert
} from 'lucide-react';

export const DeveloperPortalPage: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(INITIAL_WEBHOOKS);
  const [pingMsg, setPingMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'endpoints' | 'webhooks' | 'keys'>('endpoints');

  const API_ENDPOINTS = [
    {
      method: 'GET',
      path: '/api/v1/hostel/rooms',
      description: 'Fetch complete room inventory, occupancy metrics, and available bed slots.',
      sampleResponse: '{\n  "totalRooms": 18,\n  "occupancyRate": 88.5,\n  "vacantBeds": 4\n}'
    },
    {
      method: 'POST',
      path: '/api/v1/maintenance/tickets',
      description: 'Submit new maintenance ticket with automatic AI categorization and safety triage.',
      sampleResponse: '{\n  "ticketId": "TCK-9921",\n  "category": "Electrical",\n  "priority": "Critical",\n  "safetyAlert": "Non-DIY: Avoid physical contact"\n}'
    },
    {
      method: 'GET',
      path: '/api/v1/mess/menu/today',
      description: 'Retrieve current daily 4-meal dietary schedule, calorie estimates, and timings.',
      sampleResponse: '{\n  "day": "Today",\n  "dinner": "Shahi Paneer, Jeera Rice, Tawa Roti",\n  "timing": "07:30 PM - 09:30 PM"\n}'
    },
    {
      method: 'GET',
      path: '/api/v1/finance/invoices',
      description: 'Query student term billing records, payment verification refs, and dues.',
      sampleResponse: '{\n  "invoiceId": "INV-2026-001",\n  "totalAmount": 11200,\n  "status": "Paid"\n}'
    },
    {
      method: 'POST',
      path: '/api/v1/iot/telemetry',
      description: 'Ingest live telemetry from substation power meters and water reservoir sensors.',
      sampleResponse: '{\n  "status": "Ingested",\n  "powerReadingKW": 48.6,\n  "reservoirPct": 84\n}'
    }
  ];

  const handleTestPing = (whName: string) => {
    setPingMsg(`Test payload successfully delivered to ${whName}! HTTP 200 OK received in 184ms.`);
    setTimeout(() => setPingMsg(null), 4500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <AppLayout
      activeDomain="dashboard"
      breadcrumbs={[
        { label: 'Campus Operations', href: '/admin/dashboard' },
        { label: 'Developer Portal & API' }
      ]}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '6px', background: '#eff6ff', color: 'var(--brand-blue)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              <Code2 size={14} /> Open Campus Ecosystem
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Developer Portal &amp; API Marketplace
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              OpenAPI / Swagger specifications, real-time webhook subscribers, and third-party integrations.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>API Gateway: <strong>v1.4 Production</strong></span>
          </div>
        </div>

        {/* Feedback Message */}
        {pingMsg && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>{pingMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveTab('endpoints')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'endpoints' ? 'var(--brand-purple)' : '#f1f5f9',
              color: activeTab === 'endpoints' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <FileCode size={16} />
            <span>OpenAPI Endpoints</span>
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'webhooks' ? 'var(--brand-purple)' : '#f1f5f9',
              color: activeTab === 'webhooks' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Webhook size={16} />
            <span>Webhooks Console</span>
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'keys' ? 'var(--brand-purple)' : '#f1f5f9',
              color: activeTab === 'keys' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Key size={16} />
            <span>API Keys &amp; Security</span>
          </button>
        </div>

        {/* TAB 1: OPENAPI ENDPOINTS */}
        {activeTab === 'endpoints' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {API_ENDPOINTS.map((ep, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: ep.method === 'GET' ? '#eff6ff' : '#f0fdf4',
                      color: ep.method === 'GET' ? '#1d4ed8' : '#15803d',
                      border: `1px solid ${ep.method === 'GET' ? '#bfdbfe' : '#bbf7d0'}`
                    }}
                  >
                    {ep.method}
                  </span>
                  <code style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {ep.path}
                  </code>
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
                  {ep.description}
                </p>

                {/* Sample JSON response */}
                <div style={{ background: '#0f172a', color: '#38bdf8', padding: '12px 16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.78rem', overflowX: 'auto' }}>
                  <pre style={{ margin: 0 }}>{ep.sampleResponse}</pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: WEBHOOKS CONSOLE */}
        {activeTab === 'webhooks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {webhooks.map(wh => (
              <div
                key={wh.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {wh.name}
                    </h3>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: '#ecfdf5', color: '#047857' }}>
                      Active
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--brand-purple)', fontFamily: 'monospace', marginBottom: '8px' }}>
                    {wh.url}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {wh.events.map(ev => (
                      <span key={ev} style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#f1f5f9', color: 'var(--text-secondary)' }}>
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div>Success Rate: <strong style={{ color: '#16a34a' }}>{wh.deliverySuccessRate}%</strong></div>
                    <div>Last: {wh.lastDeliveredAt}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTestPing(wh.name)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'var(--brand-purple)',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Send size={13} />
                    <span>Send Test Ping</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: API KEYS & CREDENTIALS */}
        {activeTab === 'keys' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
              Institutional Campus API Keys
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              These bearer tokens grant authorized programmatic read/write access to Smart Hostel APIs. Never share secret keys in client-side code.
            </p>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Production Key (Full Scope)</span>
                <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  sh_live_98234102984124987123abcdef
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('sh_live_98234102984124987123abcdef')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  background: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Copy size={13} />
                <span>{copiedKey ? 'Copied!' : 'Copy Key'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};
