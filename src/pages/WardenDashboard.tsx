import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Ticket, RoomRecord, UserProfile } from '../types';
import {
  subscribeTickets,
  subscribeRooms,
  getStoredUsers
} from '../services/storageService';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MetricsOverview } from '../components/warden/MetricsOverview';
import { MaintenanceBoard } from '../components/warden/MaintenanceBoard';
import { ResidentManagement } from '../components/warden/ResidentManagement';
import { RoomAllocationManager } from '../components/warden/RoomAllocationManager';
import { MessMenuEditor } from '../components/warden/MessMenuEditor';
import {
  ShieldCheck,
  Building2,
  UtensilsCrossed,
  Wrench,
  CheckCircle,
  Users,
  DoorOpen
} from 'lucide-react';

export const WardenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'hostel' | 'mess' | 'maintenance'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // 1. Subscribe to all tickets (Wardens have administrative access across all tickets)
    const unsubTickets = subscribeTickets(
      allTickets => {
        setTickets(allTickets);
      },
      { role: 'warden', uid: user?.uid || '' }
    );

    // 2. Subscribe to room records
    const unsubRooms = subscribeRooms(allRooms => {
      setRooms(allRooms);
    });

    // 3. Load residents
    const loadResidents = () => {
      const usersObj = getStoredUsers();
      setResidents(Object.values(usersObj));
    };
    loadResidents();

    return () => {
      unsubTickets();
      unsubRooms();
    };
  }, [user]);

  const refreshData = () => {
    const usersObj = getStoredUsers();
    setResidents(Object.values(usersObj));
    setToastMessage('Hostel administration data synchronized successfully.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            right: '20px',
            zIndex: 90,
            background: '#065f46',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle size={18} color="#34d399" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main style={{ flexGrow: 1, padding: '32px 0 64px 0' }}>
        <div className="container">
          {/* Top Warden Banner */}
          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '28px',
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
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#1e3a8a',
                    background: '#eff6ff',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ShieldCheck size={14} /> Warden Administrative Console
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {user?.hostel || 'Aravali Hostel'} • Full Authority
                </span>
              </div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Operations Desk: {user?.name || 'Chief Warden'}
              </h1>
            </div>

            {/* Quick Domain Filter Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'all' ? '#ffffff' : 'transparent',
                  color: activeTab === 'all' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'all' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                All Operations
              </button>
              <button
                onClick={() => setActiveTab('hostel')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'hostel' ? '#ffffff' : 'transparent',
                  color: activeTab === 'hostel' ? '#1e3a8a' : '#64748b',
                  boxShadow: activeTab === 'hostel' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                1. Hostel Operations
              </button>
              <button
                onClick={() => setActiveTab('mess')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'mess' ? '#ffffff' : 'transparent',
                  color: activeTab === 'mess' ? '#059669' : '#64748b',
                  boxShadow: activeTab === 'mess' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                2. Smart Mess Operations
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'maintenance' ? '#ffffff' : 'transparent',
                  color: activeTab === 'maintenance' ? '#d97706' : '#64748b',
                  boxShadow: activeTab === 'maintenance' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                3. Maintenance Operations
              </button>
            </div>
          </div>

          {/* Operational Metrics Bar */}
          <div style={{ marginBottom: '32px' }}>
            <MetricsOverview
              tickets={tickets}
              rooms={rooms}
              residents={residents}
            />
          </div>

          {/* ============================================================ */}
          {/* DOMAIN 1: HOSTEL OPERATIONS (Residents, Rooms, Allocations)  */}
          {/* ============================================================ */}
          {(activeTab === 'all' || activeTab === 'hostel') && (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1e3a8a'
                  }}
                >
                  <Building2 size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Hostel Operations
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Resident directory, bed allocations, and block occupancy
                  </span>
                </div>
              </div>

              {/* Room Allocation Manager */}
              <div style={{ marginBottom: '24px' }}>
                <RoomAllocationManager
                  rooms={rooms}
                  residents={residents}
                  onRoomsUpdated={refreshData}
                />
              </div>

              {/* Resident Management */}
              <div>
                <ResidentManagement residents={residents} />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* DOMAIN 2: SMART MESS OPERATIONS (Weekly Menu, Serving Times)  */}
          {/* ============================================================ */}
          {(activeTab === 'all' || activeTab === 'mess') && (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669'
                  }}
                >
                  <UtensilsCrossed size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Smart Mess Operations
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Publish 7-day culinary timetable and daily meal menus
                  </span>
                </div>
              </div>

              <MessMenuEditor />
            </div>
          )}

          {/* ============================================================ */}
          {/* DOMAIN 3: MAINTENANCE OPERATIONS (Maintenance Board & Status) */}
          {/* ============================================================ */}
          {(activeTab === 'all' || activeTab === 'maintenance') && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#b45309'
                  }}
                >
                  <Wrench size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Maintenance Operations
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Review smart classified complaints, assign contractors, and mark resolved
                  </span>
                </div>
              </div>

              <MaintenanceBoard
                tickets={tickets}
                onStatusUpdated={() => {
                  setToastMessage('Maintenance status updated and synced to resident!');
                  setTimeout(() => setToastMessage(null), 4000);
                }}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
