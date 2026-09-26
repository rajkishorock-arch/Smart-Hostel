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
  Wrench,
  Users,
  Building2,
  UtensilsCrossed,
  CheckCircle,
  Bell
} from 'lucide-react';

export const WardenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'maintenance' | 'residents' | 'rooms' | 'mess'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // 1. Subscribe to all tickets (Wardens have full administrative read/write access)
    const unsubTickets = subscribeTickets(allTickets => {
      setTickets(allTickets);
    });

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
  }, []);

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
            right: '24px',
            zIndex: 90,
            background: '#065f46',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle size={18} color="#34d399" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main style={{ flexGrow: 1, padding: '36px 0 64px 0' }}>
        <div className="container">
          {/* Top Warden Banner */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '28px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#4338ca',
                    background: '#e0e7ff',
                    padding: '2px 8px',
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
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Administration Desk: {user?.name || 'Chief Warden'}
              </h1>
            </div>

            {/* Quick Section Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  background: activeTab === 'all' ? '#ffffff' : 'transparent',
                  color: activeTab === 'all' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'all' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                All Sections
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  background: activeTab === 'maintenance' ? '#ffffff' : 'transparent',
                  color: activeTab === 'maintenance' ? '#4f46e5' : '#64748b',
                  boxShadow: activeTab === 'maintenance' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                1. Maintenance
              </button>
              <button
                onClick={() => setActiveTab('residents')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  background: activeTab === 'residents' ? '#ffffff' : 'transparent',
                  color: activeTab === 'residents' ? '#4f46e5' : '#64748b',
                  boxShadow: activeTab === 'residents' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                2. Residents
              </button>
              <button
                onClick={() => setActiveTab('rooms')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  background: activeTab === 'rooms' ? '#ffffff' : 'transparent',
                  color: activeTab === 'rooms' ? '#0891b2' : '#64748b',
                  boxShadow: activeTab === 'rooms' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                3. Rooms
              </button>
              <button
                onClick={() => setActiveTab('mess')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  background: activeTab === 'mess' ? '#ffffff' : 'transparent',
                  color: activeTab === 'mess' ? '#059669' : '#64748b',
                  boxShadow: activeTab === 'mess' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                4. Mess Menu
              </button>
            </div>
          </div>

          {/* Metrics Overview (Total Residents, Occupancy, Open, In Progress, Resolved) */}
          <MetricsOverview
            tickets={tickets}
            rooms={rooms}
            residents={residents}
          />

          {/* Module 1: Maintenance Resolution Board */}
          {(activeTab === 'all' || activeTab === 'maintenance') && (
            <div style={{ marginBottom: '32px' }}>
              <MaintenanceBoard
                tickets={tickets}
                onStatusUpdated={() => {
                  setToastMessage('Maintenance status updated and synced to resident!');
                  setTimeout(() => setToastMessage(null), 4000);
                }}
              />
            </div>
          )}

          {/* Module 2: Resident Management */}
          {(activeTab === 'all' || activeTab === 'residents') && (
            <div style={{ marginBottom: '32px' }}>
              <ResidentManagement residents={residents} />
            </div>
          )}

          {/* Module 3: Room Allocation Manager */}
          {(activeTab === 'all' || activeTab === 'rooms') && (
            <div style={{ marginBottom: '32px' }}>
              <RoomAllocationManager
                rooms={rooms}
                residents={residents}
                onRoomsUpdated={refreshData}
              />
            </div>
          )}

          {/* Module 4: Weekly Mess Menu Editor */}
          {(activeTab === 'all' || activeTab === 'mess') && (
            <div style={{ marginBottom: '32px' }}>
              <MessMenuEditor />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
