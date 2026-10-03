import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { DayMenu, WeeklyMessMenu, DigitalMealToken } from '../../types';
import {
  subscribeMessMenu,
  saveMessMenu,
  subscribeMealTokens,
  scanAndConsumeMealToken
} from '../../services/storageService';
import {
  Clock,
  UtensilsCrossed,
  Edit2,
  Check,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Sparkles,
  CheckCircle2,
  QrCode,
  Scan,
  AlertTriangle,
  History,
  TrendingUp,
  Scale,
  UserCheck,
  ShieldCheck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search
} from 'lucide-react';

export const MessTodayPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'turnstile' | 'menu' | 'waste'>('turnstile');
  const [menu, setMenu] = useState<WeeklyMessMenu | null>(null);
  const [tokens, setTokens] = useState<DigitalMealToken[]>([]);
  const [editingMeal, setEditingMeal] = useState<'breakfast' | 'lunch' | 'snacks' | 'dinner' | null>(null);
  const [editItems, setEditItems] = useState('');
  const [editTiming, setEditTiming] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Scanner Terminal State
  const [scanInput, setScanInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    token?: DigitalMealToken;
    message: string;
  } | null>(null);
  const [scannerSearchQuery, setScannerSearchQuery] = useState('');

  const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

  useEffect(() => {
    const unsubMenu = subscribeMessMenu(m => setMenu(m));
    const unsubTokens = subscribeMealTokens(all => setTokens(all));
    return () => {
      unsubMenu();
      unsubTokens();
    };
  }, []);

  const todayMenu = menu ? menu[todayDayName] || menu['Monday'] : null;

  // Scanner metrics calculation
  const totalEnrolled = 50;
  const breakfastTokens = tokens.filter(t => t.mealType === 'Breakfast');
  const lunchTokens = tokens.filter(t => t.mealType === 'Lunch');
  const snacksTokens = tokens.filter(t => t.mealType === 'Snacks');
  const dinnerTokens = tokens.filter(t => t.mealType === 'Dinner');

  const breakfastServed = breakfastTokens.filter(t => t.status === 'Consumed').length;
  const lunchServed = lunchTokens.filter(t => t.status === 'Consumed').length;
  const snacksServed = snacksTokens.filter(t => t.status === 'Consumed').length;
  const dinnerServed = dinnerTokens.filter(t => t.status === 'Consumed').length;

  const handleScanToken = async (codeToScan?: string) => {
    const code = codeToScan || scanInput.trim();
    if (!code) return;

    setScanning(true);
    setScanResult(null);

    try {
      const res = await scanAndConsumeMealToken(code, 'Dining Hall Turnstile #1');
      setScanResult(res);
      if (res.success) {
        setScanInput('');
      }
    } catch (e: any) {
      setScanResult({
        success: false,
        message: e.message || 'Scan error occurred.'
      });
    } finally {
      setScanning(false);
    }
  };

  const startEdit = (mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner') => {
    if (!todayMenu) return;
    setEditingMeal(mealType);
    setEditItems(todayMenu[mealType].items);
    setEditTiming(todayMenu[mealType].timing);
  };

  const saveEdit = async () => {
    if (!menu || !editingMeal) return;
    const updatedDay: DayMenu = {
      ...todayMenu!,
      day: todayDayName,
      [editingMeal]: {
        items: editItems,
        timing: editTiming
      }
    };

    const newMenu: WeeklyMessMenu = {
      ...menu,
      [todayDayName]: updatedDay
    };

    await saveMessMenu(newMenu);
    setEditingMeal(null);
    setFeedback(`Today's ${editingMeal.toUpperCase()} menu updated successfully!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const meals = [
    {
      key: 'breakfast' as const,
      label: 'Breakfast',
      icon: Coffee,
      badge: 'Morning Nutrition',
      served: breakfastServed,
      total: totalEnrolled,
      data: todayMenu?.breakfast
    },
    {
      key: 'lunch' as const,
      label: 'Lunch',
      icon: Sun,
      badge: 'Main Buffet Service',
      served: lunchServed,
      total: totalEnrolled,
      data: todayMenu?.lunch
    },
    {
      key: 'snacks' as const,
      label: 'Snacks & Evening Refreshment',
      icon: Cookie,
      badge: 'Cafeteria Slot',
      served: snacksServed,
      total: totalEnrolled,
      data: todayMenu?.snacks
    },
    {
      key: 'dinner' as const,
      label: 'Dinner',
      icon: Moon,
      badge: 'Chef Special Course',
      served: dinnerServed,
      total: totalEnrolled,
      data: todayMenu?.dinner
    }
  ];

  const filteredTokens = tokens.filter(t => {
    if (!scannerSearchQuery) return true;
    const q = scannerSearchQuery.toLowerCase();
    return (
      t.studentName.toLowerCase().includes(q) ||
      t.roomNumber.toLowerCase().includes(q) ||
      t.tokenCode.toLowerCase().includes(q) ||
      t.mealType.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q)
    );
  });

  return (
    <AppLayout
      activeDomain="mess"
      breadcrumbs={[
        { label: 'Smart Mess Management', href: '/admin/mess' },
        { label: "Daily Operations & Turnstile" }
      ]}
    >
      {/* Top Banner */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '24px',
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
                color: 'var(--mess-accent)',
                background: 'var(--brand-green-subtle)',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <UtensilsCrossed size={14} /> Mess Operational Console
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#0284c7',
                background: '#e0f2fe',
                padding: '3px 8px',
                borderRadius: '6px'
              }}
            >
              Live Session: {todayDayName}
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Aravali Residence Hall Dining Hall Console
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Digital meal token validation, turnstile access control, live plate counters, and automated zero-waste surplus dispatch.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('turnstile')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'turnstile' ? '#ffffff' : 'transparent',
              color: activeTab === 'turnstile' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeTab === 'turnstile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Scan size={15} /> Turnstile Scanner &amp; Tokens
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'menu' ? '#ffffff' : 'transparent',
              color: activeTab === 'menu' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeTab === 'menu' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Edit2 size={15} /> Daily Menu Editor
          </button>
          <button
            onClick={() => setActiveTab('waste')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'waste' ? '#ffffff' : 'transparent',
              color: activeTab === 'waste' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeTab === 'waste' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Scale size={15} /> Food Waste Telemetry
          </button>
        </div>
      </div>

      {/* Plate Counters Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {meals.map(m => {
          const Icon = m.icon;
          const pct = Math.round((m.served / m.total) * 100);
          return (
            <div
              key={m.key}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  {m.label}
                </span>
                <Icon size={16} color="var(--mess-accent)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>
                  {m.served}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  / {m.total} plates
                </span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: pct > 80 ? '#10b981' : '#f59e0b',
                    background: pct > 80 ? '#ecfdf5' : '#fffbeb',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}
                >
                  {pct}%
                </span>
              </div>
              <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: pct > 80 ? '#10b981' : 'var(--mess-accent)',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{feedback}</span>
        </div>
      )}

      {/* TAB 1: TURNSTILE SCANNER */}
      {activeTab === 'turnstile' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Scanner Box */}
          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid #0f172a',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#0f172a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Scan size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Turnstile Barcode / QR Scanner
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Dining Hall Entrance #1 • Real-time Validation
                </span>
              </div>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                handleScanToken();
              }}
              style={{ marginBottom: '18px' }}
            >
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Scan or Enter Digital Token Code:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. MEAL-BRK-204-7892 or TOK-01"
                  value={scanInput}
                  onChange={e => setScanInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace'
                  }}
                />
                <button
                  type="submit"
                  disabled={scanning || !scanInput.trim()}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0 16px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: scanning || !scanInput.trim() ? 'not-allowed' : 'pointer',
                    opacity: scanning || !scanInput.trim() ? 0.6 : 1
                  }}
                >
                  Verify
                </button>
              </div>
            </form>

            {/* Scan Result Feedback Banner */}
            {scanResult && (
              <div
                style={{
                  borderRadius: '10px',
                  padding: '14px 16px',
                  marginBottom: '18px',
                  background: scanResult.success ? '#ecfdf5' : '#fef2f2',
                  border: `1.5px solid ${scanResult.success ? '#a7f3d0' : '#fecaca'}`,
                  color: scanResult.success ? '#065f46' : '#991b1b'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  {scanResult.success ? (
                    <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <XCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>
                      {scanResult.success ? 'TURNSTILE UNLOCKED • ACCESS GRANTED' : 'ACCESS DENIED • DUPLICATE / INVALID'}
                    </div>
                    <div style={{ fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.4 }}>
                      {scanResult.message}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick 1-Tap Resident Fast-Scan Buttons */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Instant Turnstile Hardware Simulation (1-Tap):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {tokens.slice(0, 4).map(tok => (
                  <button
                    key={tok.id}
                    onClick={() => handleScanToken(tok.tokenCode)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div>
                      <strong>{tok.studentName}</strong> (Room {tok.roomNumber})
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {tok.mealType} • <span style={{ fontFamily: 'monospace' }}>{tok.tokenCode}</span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: tok.status === 'Consumed' ? '#e2e8f0' : '#ecfdf5',
                        color: tok.status === 'Consumed' ? '#64748b' : '#059669'
                      }}
                    >
                      {tok.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tokens Registry Table */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--neutral-border)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Today's Digital Meal Tokens Registry
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {tokens.length} total issued passes • Auto-linked to gate pass rebates
                </span>
              </div>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Filter by student / code..."
                  value={scannerSearchQuery}
                  onChange={e => setScannerSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px 7px 30px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.78rem'
                  }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Token Code</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Resident</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Room</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Meal</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Diet</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTokens.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                        No tokens found matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredTokens.map(tok => (
                      <tr key={tok.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                          {tok.tokenCode}
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>{tok.studentName}</td>
                        <td style={{ padding: '10px 12px', color: '#64748b' }}>{tok.roomNumber}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontWeight: 600 }}>{tok.mealType}</span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: tok.dietaryPreference === 'Vegetarian' ? '#ecfdf5' : '#eff6ff',
                              color: tok.dietaryPreference === 'Vegetarian' ? '#047857' : '#1d4ed8'
                            }}
                          >
                            {tok.dietaryPreference}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '9999px',
                              background:
                                tok.status === 'Consumed'
                                  ? '#f1f5f9'
                                  : tok.status === 'Rebated'
                                  ? '#fef3c7'
                                  : '#dcfce7',
                              color:
                                tok.status === 'Consumed'
                                  ? '#475569'
                                  : tok.status === 'Rebated'
                                  ? '#b45309'
                                  : '#15803d'
                            }}
                          >
                            {tok.status === 'Consumed' ? 'Consumed' : tok.status === 'Rebated' ? 'Rebate Active' : 'Valid'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {tok.status === 'Valid' ? (
                            <button
                              onClick={() => handleScanToken(tok.tokenCode)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: '1px solid #10b981',
                                background: '#ecfdf5',
                                color: '#047857',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Scan In
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                              {tok.consumedAt ? new Date(tok.consumedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Closed'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MENU EDITOR */}
      {activeTab === 'menu' && (
        <div>
          {todayMenu?.specialNote && (
            <div
              style={{
                background: 'var(--brand-green-subtle)',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Sparkles size={20} color="var(--mess-accent)" />
              <div style={{ fontSize: '0.88rem', color: '#065f46', fontWeight: 600 }}>
                <strong>Chef Note for {todayDayName}:</strong> {todayMenu.specialNote}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {meals.map(meal => {
              const Icon = meal.icon;
              const isEditing = editingMeal === meal.key;

              return (
                <div
                  key={meal.key}
                  style={{
                    background: '#ffffff',
                    border: isEditing ? '2px solid var(--mess-accent)' : '1px solid var(--neutral-border)',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'var(--brand-green-subtle)',
                          color: 'var(--mess-accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                          {meal.label}
                        </h2>
                        <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
                          {meal.badge} • Serving: <strong>{meal.data?.timing || 'Standard window'}</strong>
                        </span>
                      </div>
                    </div>

                    {!isEditing && (
                      <button
                        onClick={() => startEdit(meal.key)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          border: '1px solid var(--neutral-border)',
                          background: '#f8fafc',
                          color: 'var(--mess-accent)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Edit2 size={14} /> Edit Course
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', marginBottom: '4px' }}>
                          Serving Timings:
                        </label>
                        <input
                          type="text"
                          value={editTiming}
                          onChange={e => setEditTiming(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--neutral-border)',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', marginBottom: '4px' }}>
                          Menu Items (comma-separated):
                        </label>
                        <textarea
                          rows={3}
                          value={editItems}
                          onChange={e => setEditItems(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--neutral-border)',
                            fontSize: '0.85rem',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setEditingMeal(null)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid var(--neutral-border)',
                            background: '#ffffff',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--mess-accent)',
                            color: '#ffffff',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Check size={16} /> Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid var(--neutral-border)',
                        fontSize: '0.92rem',
                        color: '#334155',
                        lineHeight: 1.6
                      }}
                    >
                      {meal.data?.items || 'No items configured for this meal.'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FOOD WASTE TELEMETRY */}
      {activeTab === 'waste' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Scale size={20} color="var(--mess-accent)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Daily Weighing &amp; Consumption Balance
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Smart scale readings from the central preparation kitchen against actual resident footfall.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Total Food Prepared:</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>32.50 kg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: '#ecfdf5', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 600 }}>Consumed by Residents:</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#047857' }}>28.60 kg (88%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: '#fffbeb', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 600 }}>Surplus Unserved Food:</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#b45309' }}>3.90 kg (12%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: '#fef2f2', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: 600 }}>Plate Scrap Waste:</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#991b1b' }}>0.45 kg (&lt;1.5%)</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ShieldCheck size={20} color="#0284c7" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Zero-Waste NGO Surplus Dispatch
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Unserved surplus dishes are sealed in food-grade thermal containers and distributed to verified charity partners.
            </p>

            <div style={{ padding: '16px', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong style={{ fontSize: '0.88rem', color: '#166534' }}>Robin Hood Army Chapter</strong>
                <span style={{ fontSize: '0.72rem', background: '#166534', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  SCHEDULED PICKUP
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
                Scheduled Slot: <strong>02:45 PM Today</strong> • Container ID: <code>CNT-ARAVALI-04</code>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
              Food quality parameters (temperature &gt;65°C, cooked within 3 hours) verified by Chief Mess Steward.
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
