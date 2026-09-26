import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { INITIAL_ASSET_REGISTRY } from '../../services/predictiveService';
import { AssetItem } from '../../types/analytics';
import {
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  Phone,
  PlusCircle,
  FileText,
  Search,
  Check
} from 'lucide-react';

export const PreventiveMaintenancePage: React.FC = () => {
  const [assets, setAssets] = useState<AssetItem[]>(INITIAL_ASSET_REGISTRY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [serviceSuccessMsg, setServiceSuccessMsg] = useState<string | null>(null);

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || asset.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleMarkServiced = (assetId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 6);
    const nextFormatted = nextDate.toISOString().split('T')[0];

    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          status: 'Operational',
          conditionScore: Math.min(100, a.conditionScore + 18),
          lastServiceDate: today,
          nextScheduledService: nextFormatted,
          serviceCostHistoryINR: a.serviceCostHistoryINR + 2500
        };
      }
      return a;
    }));

    setServiceSuccessMsg(`Asset ${assetId} preventive maintenance recorded successfully!`);
    setTimeout(() => setServiceSuccessMsg(null), 4000);
  };

  return (
    <AppLayout
      activeDomain="maintenance"
      breadcrumbs={[
        { label: 'Maintenance Desk', href: '/admin/maintenance/resolution' },
        { label: 'Preventive Maintenance & Assets' }
      ]}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
              Preventive Maintenance &amp; Asset Management
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Proactive scheduling, asset lifespan health tracking, and certified technician assignment.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Total Monitored Assets: <strong>{assets.length}</strong>
            </span>
          </div>
        </div>

        {/* Feedback message */}
        {serviceSuccessMsg && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>{serviceSuccessMsg}</span>
          </div>
        )}

        {/* Quick Health Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Operational Status</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', marginTop: '6px' }}>
              {assets.filter(a => a.status === 'Operational').length} Assets
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Healthy &amp; inspected</div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Service Overdue / Imminent</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706', marginTop: '6px' }}>
              {assets.filter(a => a.status === 'Service Due').length} Assets
            </div>
            <div style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '2px' }}>Preventive window active</div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Equipment Health</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-purple)', marginTop: '6px' }}>
              {Math.round(assets.reduce((acc, a) => acc + a.conditionScore, 0) / assets.length)}%
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Composite condition index</div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Historical Service Spend</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
              ₹{assets.reduce((acc, a) => acc + a.serviceCostHistoryINR, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Preventive maintenance spend</div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', minWidth: '260px', flex: 1 }}>
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search assets by ID, name, or location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Water & Plumbing', 'Electrical & Power', 'Safety & Elevator', 'Kitchen & Dining'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 12px',
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
        </div>

        {/* Asset Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {asset.category} &bull; {asset.id}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: asset.status === 'Operational' ? '#ecfdf5' : '#fffbeb',
                      color: asset.status === 'Operational' ? '#047857' : '#b45309',
                      border: `1px solid ${asset.status === 'Operational' ? '#a7f3d0' : '#fde68a'}`
                    }}
                  >
                    {asset.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {asset.name}
                </h3>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  📍 {asset.location} &bull; Spec: {asset.modelOrSpec}
                </div>

                {/* Health Condition Bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Condition Health Index</span>
                    <strong>{asset.conditionScore}%</strong>
                  </div>
                  <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${asset.conditionScore}%`,
                        background: asset.conditionScore > 75 ? '#10b981' : asset.conditionScore > 50 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Last Serviced:</strong> {asset.lastServiceDate} &bull; <strong>Next Due:</strong> {asset.nextScheduledService}
                  </div>
                  <div>
                    <strong>Assigned Tech:</strong> {asset.assignedTechnician} ({asset.technicianContact})
                  </div>
                </div>

                {asset.notes && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '12px' }}>
                    "{asset.notes}"
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total Servicing: ₹{asset.serviceCostHistoryINR.toLocaleString()}
                </span>
                <button
                  onClick={() => handleMarkServiced(asset.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--brand-purple)',
                    background: '#f5f3ff',
                    color: 'var(--brand-purple)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Check size={14} /> Log Service Inspection
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AppLayout>
  );
};
