import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { subscribeRooms, subscribeResidents, subscribeTickets } from '../../services/storageService';
import { generateOccupancyForecast, generateMaintenanceFailureForecasts, generateMessDemandForecast } from '../../services/predictiveService';
import { RoomRecord, UserProfile, Ticket } from '../../types';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  UtensilsCrossed,
  Layers,
  Sparkles,
  Calendar,
  CheckCircle2,
  DollarSign,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';

export const PredictiveAnalyticsPage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // User controls for interactive simulation
  const [forecastHorizon, setForecastHorizon] = useState<30 | 60>(30);
  const [activeTab, setActiveTab] = useState<'occupancy' | 'maintenance' | 'mess'>('occupancy');

  useEffect(() => {
    let unsubs: (() => void)[] = [];
    const unsubRooms = subscribeRooms(r => setRooms(r));
    const unsubResidents = subscribeResidents(res => setResidents(res));
    const unsubTickets = subscribeTickets(t => {
      setTickets(t);
      setLoading(false);
    });

    unsubs = [unsubRooms, unsubResidents, unsubTickets];
    return () => unsubs.forEach(u => u());
  }, []);

  const occupancyForecast = generateOccupancyForecast(rooms, residents, forecastHorizon);
  const maintenanceForecasts = generateMaintenanceFailureForecasts(tickets);
  const messForecasts = generateMessDemandForecast(residents.length);

  return (
    <AppLayout
      activeDomain="dashboard"
      breadcrumbs={[
        { label: 'Intelligence', href: '/admin/dashboard' },
        { label: 'AI Predictive Analytics' }
      ]}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            borderRadius: '16px',
            padding: '28px 32px',
            color: '#ffffff',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '12px' }}>
              <Sparkles size={14} color="#facc15" />
              <span>AI PREDICTIVE INTELLIGENCE ENGINE</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Predictive Analytics &amp; Forecasting
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#e0e7ff', lineHeight: 1.5 }}>
              Continuous algorithmic forecasting for hostel capacity, preemptive infrastructure failure detection, and mess demand wastage optimization.
            </p>
          </div>

          {/* Quick Model Accuracy Badge */}
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              padding: '16px 24px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#c7d2fe', fontWeight: 600 }}>Model Confidence</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ade80', margin: '4px 0' }}>
              {occupancyForecast.confidenceScore}%
            </div>
            <div style={{ fontSize: '0.72rem', color: '#e0e7ff' }}>Historical Validation Target (&gt;85%)</div>
          </div>
        </div>

        {/* Tab Navigation & Horizon Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('occupancy')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'occupancy' ? 'var(--brand-purple)' : '#f1f5f9',
                color: activeTab === 'occupancy' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <TrendingUp size={16} />
              <span>Occupancy Prediction</span>
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'maintenance' ? 'var(--brand-purple)' : '#f1f5f9',
                color: activeTab === 'maintenance' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <AlertTriangle size={16} />
              <span>Maintenance Failure Forecast</span>
            </button>
            <button
              onClick={() => setActiveTab('mess')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'mess' ? 'var(--brand-purple)' : '#f1f5f9',
                color: activeTab === 'mess' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <UtensilsCrossed size={16} />
              <span>Mess Demand &amp; Wastage</span>
            </button>
          </div>

          {activeTab === 'occupancy' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', paddingLeft: '8px' }}>Forecast Horizon:</span>
              <button
                onClick={() => setForecastHorizon(30)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: forecastHorizon === 30 ? '#ffffff' : 'transparent',
                  color: forecastHorizon === 30 ? 'var(--brand-purple)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  boxShadow: forecastHorizon === 30 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer'
                }}
              >
                30 Days
              </button>
              <button
                onClick={() => setForecastHorizon(60)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: forecastHorizon === 60 ? '#ffffff' : 'transparent',
                  color: forecastHorizon === 60 ? 'var(--brand-purple)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  boxShadow: forecastHorizon === 60 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer'
                }}
              >
                60 Days
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: OCCUPANCY PREDICTION ENGINE */}
        {activeTab === 'occupancy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Current Occupancy</span>
                  <Layers size={18} color="var(--brand-blue)" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
                  {occupancyForecast.currentOccupancyRate}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Live Firestore bed verification
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Projected in {forecastHorizon} Days</span>
                  {occupancyForecast.projectedOccupancyRate >= occupancyForecast.currentOccupancyRate ? (
                    <ArrowUpRight size={18} color="#16a34a" />
                  ) : (
                    <ArrowDownRight size={18} color="#dc2626" />
                  )}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-purple)', marginTop: '8px' }}>
                  {occupancyForecast.projectedOccupancyRate}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>
                  {occupancyForecast.projectedOccupancyRate >= occupancyForecast.currentOccupancyRate ? '+' : ''}
                  {(occupancyForecast.projectedOccupancyRate - occupancyForecast.currentOccupancyRate).toFixed(1)}% expected change
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Expected Turnaround</span>
                  <Calendar size={18} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
                  -{occupancyForecast.projectedCheckouts} / +{occupancyForecast.projectedNewAdmissions}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Checkouts vs Admissions
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Net Vacancies Projected</span>
                  <CheckCircle2 size={18} color="#10b981" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '8px' }}>
                  {occupancyForecast.netVacantBeds} Beds
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Available for waitlist allocation
                </div>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '12px', padding: '18px 24px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <Brain size={24} color="#6d28d9" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#5b21b6' }}>
                  AI Re-allocation &amp; Capacity Recommendation
                </div>
                <div style={{ fontSize: '0.825rem', color: '#4c1d95', marginTop: '4px', lineHeight: 1.5 }}>
                  {occupancyForecast.recommendation}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6d28d9', marginTop: '8px', fontWeight: 600 }}>
                  🚨 Forecasted Peak Demand Window: {occupancyForecast.peakDemandPeriod}
                </div>
              </div>
            </div>

            {/* Floor-wise Density Forecast */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
                Floor-wise Occupancy &amp; Density Projection ({forecastHorizon}-Day Outlook)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {occupancyForecast.floorTrends.map((ft, idx) => {
                  const currentPct = ft.capacity > 0 ? Math.round((ft.currentOccupied / ft.capacity) * 100) : 0;
                  const forecastPct = ft.capacity > 0 ? Math.round((ft.forecastOccupied / ft.capacity) * 100) : 0;

                  return (
                    <div key={idx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{ft.floor}</span>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Capacity: <strong>{ft.capacity} beds</strong> | Current: <strong>{ft.currentOccupied}</strong> ({currentPct}%) → Forecast: <strong style={{ color: 'var(--brand-purple)' }}>{ft.forecastOccupied}</strong> ({forecastPct}%)
                        </div>
                      </div>
                      <div style={{ height: '8px', width: '100%', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                        <div style={{ height: '100%', width: `${Math.min(100, forecastPct)}%`, background: forecastPct > 90 ? '#ef4444' : 'var(--brand-purple)', transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MAINTENANCE FAILURE FORECASTING */}
        {activeTab === 'maintenance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <ShieldAlert size={24} color="#d97706" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#b45309' }}>
                  Preemptive Infrastructure Protection
                </div>
                <div style={{ fontSize: '0.8rem', color: '#92400e', marginTop: '2px' }}>
                  Component wear models track run hours, equipment age, and seasonal stresses to detect catastrophic breakdown before resident disruption.
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
              {maintenanceForecasts.map((mf, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid var(--border-default)',
                    boxShadow: 'var(--shadow-xs)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: `5px solid ${
                      mf.failureRiskLevel === 'Critical' ? '#ef4444' :
                      mf.failureRiskLevel === 'High' ? '#f97316' :
                      mf.failureRiskLevel === 'Moderate' ? '#f59e0b' : '#10b981'
                    }`
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {mf.category} &bull; {mf.assetId}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background:
                            mf.failureRiskLevel === 'Critical' ? '#fef2f2' :
                            mf.failureRiskLevel === 'High' ? '#fff7ed' : '#f0fdf4',
                          color:
                            mf.failureRiskLevel === 'Critical' ? '#b91c1c' :
                            mf.failureRiskLevel === 'High' ? '#c2410c' : '#15803d',
                          border: `1px solid ${
                            mf.failureRiskLevel === 'Critical' ? '#fecaca' :
                            mf.failureRiskLevel === 'High' ? '#fed7aa' : '#bbf7d0'
                          }`
                        }}
                      >
                        {mf.failureRiskLevel} Risk
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                      {mf.assetName}
                    </h4>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      📍 {mf.location}
                    </div>

                    {/* Wear progress bar */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Calculated Mechanical Wear</span>
                        <strong style={{ color: mf.wearPercentage > 75 ? '#dc2626' : 'var(--text-primary)' }}>{mf.wearPercentage}%</strong>
                      </div>
                      <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${mf.wearPercentage}%`,
                            background: mf.wearPercentage > 80 ? '#dc2626' : mf.wearPercentage > 65 ? '#f97316' : '#10b981'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                      <strong>Prescribed Action:</strong> {mf.recommendedAction}
                    </div>

                    {mf.seasonalAlert && (
                      <div style={{ fontSize: '0.72rem', color: '#b45309', background: '#fffbeb', padding: '6px 10px', borderRadius: '6px', marginBottom: '10px' }}>
                        ⚠️ {mf.seasonalAlert}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Failure Window</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626' }}>{mf.predictedFailureWindow}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Preventive vs Breakdown</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>
                        ₹{mf.estimatedPreventiveCost} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs ₹{mf.estimatedEmergencyCost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SMART MESS DEMAND & FOOD WASTAGE PREDICTION */}
        {activeTab === 'mess' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Waste Reduction Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Dining Population</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
                  {residents.length || 24} Students
                </div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                  100% Registered Plan
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Weekly Wastage Reduction Goal</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '8px' }}>
                  25 - 30%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Targeted consumption algorithm
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Est. Monthly Food Savings</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-purple)', marginTop: '8px' }}>
                  ₹18,400+
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  From portion size calibration
                </div>
              </div>
            </div>

            {/* 7-Day Demand Schedule Forecast */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  7-Day Dining Demand &amp; Preparation Forecast
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Dynamic model accounts for weekend departure cycles &amp; exam attendance
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border-default)', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>Day &amp; Schedule</th>
                      <th style={{ padding: '12px' }}>Demand Factor</th>
                      <th style={{ padding: '12px' }}>Projected Attendance</th>
                      <th style={{ padding: '12px' }}>Recommended Prep</th>
                      <th style={{ padding: '12px' }}>Est. Wastage Saved</th>
                      <th style={{ padding: '12px' }}>Dietary Split (Veg / Non-Veg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messForecasts.map((mf, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: 700 }}>
                          <div>{mf.dayOfWeek}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>{mf.date} ({mf.meal})</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '12px',
                              background:
                                mf.demandFactor === 'Weekend Drop' ? '#fef3c7' :
                                mf.demandFactor === 'Exam Surge' ? '#eff6ff' : '#f1f5f9',
                              color:
                                mf.demandFactor === 'Weekend Drop' ? '#b45309' :
                                mf.demandFactor === 'Exam Surge' ? '#1d4ed8' : '#475569'
                            }}
                          >
                            {mf.demandFactor}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <strong style={{ color: 'var(--brand-purple)' }}>{mf.projectedAttendance} students</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>({mf.attendanceRate}%)</span>
                        </td>
                        <td style={{ padding: '12px', fontWeight: 600 }}>
                          {mf.projectedFoodPrepKg} kg
                        </td>
                        <td style={{ padding: '12px', color: '#16a34a', fontWeight: 700 }}>
                          -{mf.estimatedWastageKg} kg <span style={{ fontSize: '0.72rem', fontWeight: 400 }}>(₹{mf.potentialCostSavingsINR})</span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Veg: <strong>{mf.dietarySplit.vegetarian}</strong> | Non-Veg: <strong>{mf.dietarySplit.nonVegetarian}</strong> | Jain: <strong>{mf.dietarySplit.jainOrSpecial}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};
