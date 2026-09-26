import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { subscribeIoTSensors, logRFIDAttendance, getAllResidents } from '../../services/storageService';
import { IoTSensorReading, UserProfile } from '../../types';
import {
  Activity,
  Zap,
  Droplet,
  Users,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Radio,
  Sliders
} from 'lucide-react';

export const SmartInfrastructurePage: React.FC = () => {
  const [sensors, setSensors] = useState<IoTSensorReading[]>([]);
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [selectedStudentUid, setSelectedStudentUid] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<string>('Dinner');
  const [rfidResult, setRfidResult] = useState<{ success: boolean; message: string; studentName: string } | null>(null);

  useEffect(() => {
    const unsub = subscribeIoTSensors(s => setSensors(s));
    setResidents(getAllResidents());
    return () => unsub();
  }, []);

  const handleSimulateScan = async () => {
    if (!selectedStudentUid) return;
    const res = await logRFIDAttendance(selectedStudentUid, selectedMeal);
    setRfidResult(res);
    setTimeout(() => setRfidResult(null), 4000);
  };

  return (
    <AppLayout
      activeDomain="dashboard"
      breadcrumbs={[
        { label: 'Campus Operations', href: '/admin/dashboard' },
        { label: 'IoT & Smart Infrastructure' }
      ]}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '6px', background: '#ecfdf5', color: '#047857', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              <Radio size={14} color="#059669" /> Telemetry Mesh Active
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              IoT &amp; Smart Infrastructure Hub
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Real-time telemetry for electrical busbars, reservoir levels, PIR room occupancy, and RFID dining gates.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span>Telemetry Polling: <strong>WebSocket Live</strong></span>
          </div>
        </div>

        {/* Live Telemetry Sensor Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          {/* Card 1: Power & Electrical Meter */}
          <div style={{ background: '#ffffff', borderRadius: '14px', padding: '22px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Electrical Substation
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Main Busbar Feed</span>
                </div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: '#ecfdf5', color: '#047857' }}>Normal</span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 4px 0' }}>
              48.6 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>kW</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Active load &bull; Power factor balanced at <strong>0.98 pf</strong>
            </div>

            <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '42%', background: 'var(--brand-blue)' }} />
            </div>
          </div>

          {/* Card 2: Underground Water Reservoir */}
          <div style={{ background: '#ffffff', borderRadius: '14px', padding: '22px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplet size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Ground Reservoir
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>50,000L Underground Tank</span>
                </div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: '#ecfdf5', color: '#047857' }}>Adequate</span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669', margin: '8px 0 4px 0' }}>
              84 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>%</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              42,000 L stored &bull; Municipal bore supply active
            </div>

            <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '84%', background: '#059669' }} />
            </div>
          </div>

          {/* Card 3: Overhead Rooftop Tanks */}
          <div style={{ background: '#ffffff', borderRadius: '14px', padding: '22px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplet size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Overhead Gravity Tanks
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Rooftop Distribution Array</span>
                </div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: '#ecfdf5', color: '#047857' }}>Normal</span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-blue)', margin: '8px 0 4px 0' }}>
              62 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>%</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Booster pumps auto-trigger at <strong>40%</strong> threshold
            </div>

            <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '62%', background: 'var(--brand-blue)' }} />
            </div>
          </div>

          {/* Card 4: Reading Room PIR Occupancy */}
          <div style={{ background: '#ffffff', borderRadius: '14px', padding: '22px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f5f3ff', color: 'var(--brand-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Study Hall PIR Motion
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Central Library Floor 1</span>
                </div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: '#eff6ff', color: 'var(--brand-blue)' }}>Occupied</span>
            </div>

            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 4px 0' }}>
              14 Residents Detected
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              HVAC &amp; illumination automatically regulated
            </div>

            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
              &bull; Eco-savings: 3.2 kWh conserved today
            </div>
          </div>
        </div>

        {/* Interactive RFID Dining Scanner Console */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px 28px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={18} />
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Interactive RFID Dining Entrance Console
                </h2>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Simulate resident card tap or digital QR scanning to authorize dining entry and log meal attendance.
              </p>
            </div>
          </div>

          {/* Scanner Feedback Box */}
          {rfidResult && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={24} color="#059669" />
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#065f46' }}>Gate Unlocked &bull; Access Authorized</strong>
                <div style={{ fontSize: '0.8rem', color: '#047857' }}>
                  Resident: <strong>{rfidResult.studentName}</strong> &bull; {rfidResult.message}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>Select Resident Card to Tap:</label>
              <select
                value={selectedStudentUid}
                onChange={e => setSelectedStudentUid(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '0.85rem', outline: 'none', background: '#ffffff' }}
              >
                <option value="">-- Choose Resident Card --</option>
                {residents.map(res => (
                  <option key={res.uid} value={res.uid}>
                    {res.name} ({res.roomNumber ? `Room ${res.roomNumber}` : 'Unallocated'}) &bull; RFID #{res.uid.slice(0, 8)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>Meal Schedule Window:</label>
              <select
                value={selectedMeal}
                onChange={e => setSelectedMeal(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '0.85rem', outline: 'none', background: '#ffffff' }}
              >
                <option value="Breakfast">Breakfast Gate (07:30 AM - 09:30 AM)</option>
                <option value="Lunch">Lunch Gate (12:30 PM - 02:30 PM)</option>
                <option value="Snacks">Snacks &amp; Tea (05:00 PM - 06:00 PM)</option>
                <option value="Dinner">Dinner Gate (07:30 PM - 09:30 PM)</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={!selectedStudentUid}
                style={{
                  width: '100%',
                  padding: '11px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedStudentUid ? 'var(--brand-purple)' : '#e2e8f0',
                  color: selectedStudentUid ? '#ffffff' : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: selectedStudentUid ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Radio size={16} />
                <span>Simulate RFID Tap / QR Scan</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};
