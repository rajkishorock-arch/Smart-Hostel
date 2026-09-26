import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Ticket, RoomRecord } from '../types';
import { subscribeTickets, getStoredRooms } from '../services/storageService';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MyRoomCard } from '../components/resident/MyRoomCard';
import { MessMenuSection } from '../components/resident/MessMenuSection';
import { TicketList } from '../components/resident/TicketList';
import { LodgeTicketModal } from '../components/resident/LodgeTicketModal';
import {
  Building2,
  UtensilsCrossed,
  Wrench,
  CheckCircle,
  Plus,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const ResidentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [isLodgeModalOpen, setIsLodgeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Subscribe to tickets in real-time matching Firestore security rules
    const unsubscribe = subscribeTickets(
      allTickets => {
        setTickets(allTickets);
      },
      { role: 'resident', uid: user.uid }
    );

    setRooms(getStoredRooms());

    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  const currentRoomInfo = rooms.find(
    r => r.roomNumber === user.roomNumber && r.block === user.block
  );

  const handleTicketCreated = (newTicket: Ticket) => {
    setToastMessage(`Ticket #${newTicket.id} (${newTicket.category}) successfully lodged to Warden Desk!`);
    setTimeout(() => setToastMessage(null), 5000);
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
          {/* Welcome & Resident Identity Bar */}
          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
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
                    letterSpacing: '0.04em'
                  }}
                >
                  Resident Portal
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {user.hostel || 'Aravali Hostel'} • Room {user.roomNumber || '204'}
                </span>
              </div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Welcome, {user.name}
              </h1>
            </div>

            <button
              onClick={() => setIsLodgeModalOpen(true)}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#d97706',
                borderColor: '#d97706'
              }}
            >
              <Plus size={18} />
              <span>Report Maintenance Issue</span>
            </button>
          </div>

          {/* ============================================================ */}
          {/* DOMAIN 1: HOSTEL MANAGEMENT (My Room, Bed & Allocation)      */}
          {/* ============================================================ */}
          <section style={{ marginBottom: '40px' }}>
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
                  Hostel Accommodation
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Your assigned room, block, and bed allocation status
                </span>
              </div>
            </div>

            <MyRoomCard user={user} roomInfo={currentRoomInfo} />
          </section>

          {/* ============================================================ */}
          {/* DOMAIN 2: SMART MESS (Today's Meals & Weekly Menu)           */}
          {/* ============================================================ */}
          <section style={{ marginBottom: '40px' }}>
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
                  Smart Mess &amp; Dining Timetable
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Today&apos;s 4 meals and rotating 7-day culinary timetable
                </span>
              </div>
            </div>

            <MessMenuSection />
          </section>

          {/* ============================================================ */}
          {/* DOMAIN 3: SHARED MAINTENANCE (Tickets & Resolution Tracking)  */}
          {/* ============================================================ */}
          <section style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    Maintenance &amp; Service Requests
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Follow Open → In Progress → Resolved in real time
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsLodgeModalOpen(true)}
                className="btn btn-outline"
                style={{
                  fontSize: '0.825rem',
                  padding: '6px 14px',
                  borderColor: '#fde68a',
                  color: '#92400e'
                }}
              >
                + New Ticket
              </button>
            </div>

            <TicketList
              tickets={tickets}
              onOpenLodgeModal={() => setIsLodgeModalOpen(true)}
            />
          </section>
        </div>
      </main>

      {/* Lodge Ticket Modal */}
      <LodgeTicketModal
        user={user}
        isOpen={isLodgeModalOpen}
        onClose={() => setIsLodgeModalOpen(false)}
        onSuccess={handleTicketCreated}
      />

      <Footer />
    </div>
  );
};
