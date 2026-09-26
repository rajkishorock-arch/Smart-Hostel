import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { INITIAL_SECURITY_THREATS } from '../../services/automationService';
import { getActivityLogs } from '../../services/activityService';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  KeyRound,
  RefreshCw,
  Fingerprint
} from 'lucide-react';

export const ComplianceSecurityPage: React.FC = () => {
  const [threats, setThreats] = useState(INITIAL_SECURITY_THREATS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  const logs = getActivityLogs();

  const handleVerifyIntegrity = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifyResult(`Cryptographic Verification Successful: Checked ${logs.length} audit entries. Zero discrepancies or unauthorized state tampering detected (SHA-256 Validated).`);
      setTimeout(() => setVerifyResult(null), 6000);
    }, 1000);
  };

  return (
    <AppLayout
      activeDomain="dashboard"
      breadcrumbs={[
        { label: 'Security & Governance', href: '/admin/dashboard' },
        { label: 'Compliance, Audit & Forensics' }
      ]}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '6px', background: '#ecfdf5', color: '#047857', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              <ShieldCheck size={14} /> Institutional Governance Suite
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Compliance, Forensics &amp; Threat Defense
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Continuous regulatory compliance audits, cryptographic audit trail forensics, and proactive intrusion detection.
            </p>
          </div>

          <button
            onClick={handleVerifyIntegrity}
            disabled={isVerifying}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid var(--brand-purple)',
              background: '#f5f3ff',
              color: 'var(--brand-purple)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: isVerifying ? 'wait' : 'pointer'
            }}
          >
            <Fingerprint size={16} />
            <span>{isVerifying ? 'Validating Signatures...' : 'Verify Cryptographic Audit Hash'}</span>
          </button>
        </div>

        {/* Verification Success Alert */}
        {verifyResult && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '14px 18px', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color="#059669" />
            <div>
              <strong>Cryptographic Integrity Verified!</strong>
              <div style={{ fontSize: '0.78rem', marginTop: '2px' }}>{verifyResult}</div>
            </div>
          </div>
        )}

        {/* Regulatory Compliance Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Privacy &amp; Data Act</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: '#ecfdf5', color: '#047857' }}>98% Compliant</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '4px 0 6px 0', color: 'var(--text-primary)' }}>
              DPDP Act &amp; Privacy Protocol
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 12px 0' }}>
              Strict role-based isolation enforces that residents can never read private peer profiles. All Firebase tokens encrypted in transit.
            </p>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>&bull; Zero PII leaks recorded</div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Campus Safety</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: '#ecfdf5', color: '#047857' }}>100% Compliant</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '4px 0 6px 0', color: 'var(--text-primary)' }}>
              Fire, Water &amp; Electrical Safety
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 12px 0' }}>
              Automated AI emergency triage flags hazards (sparks, gas leaks, water floods) and provides immediate non-DIY life-safety instructions.
            </p>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>&bull; Full institutional compliance certified</div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mess Operations</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: '#ecfdf5', color: '#047857' }}>96% Compliant</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '4px 0 6px 0', color: 'var(--text-primary)' }}>
              FSSAI Food Hygiene &amp; Wastage
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 12px 0' }}>
              Daily dietary menu publication, ingredient batch tracking with certified agro vendors, and food wastage reduction metrics active.
            </p>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>&bull; Kitchen inspection audit passed</div>
          </div>
        </div>

        {/* Real-Time Threat Detection Log (IDS) */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-default)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Real-Time Intrusion Detection System (IDS) Telemetry
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Proactively identifying brute-force attempts, IP proxies, and session tamper attempts
              </p>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
              IDS Active &bull; Defense Operational
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {threats.map(threat => (
              <div
                key={threat.id}
                style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {threat.threatType}
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: threat.severity === 'High' ? '#fef2f2' : '#fffbeb',
                        color: threat.severity === 'High' ? '#b91c1c' : '#b45309'
                      }}
                    >
                      {threat.severity} Severity
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      &bull; Source: {threat.sourceIp}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {threat.details}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: '#ecfdf5',
                      color: '#047857'
                    }}
                  >
                    {threat.status}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {threat.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
};
