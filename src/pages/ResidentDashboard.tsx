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
  Wrench,
  UtensilsCrossed,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Bell
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
          {/* Welcome Banner */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '32px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Student Resident Station
                </span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94a3b8' }} />
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {user.hostel || 'Aravali Hostel'}
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Welcome back, {user.name}
              </h1>
            </div>

            <button
              onClick={() => setIsLodgeModalOpen(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Wrench size={18} />
              <span>Report Maintenance Issue</span>
            </button>
          </div>

          {/* Section 1: My Room Information */}
          <div style={{ marginBottom: '32px' }}>
            <MyRoomCard user={user} roomInfo={currentRoomInfo} />
          </div>

          {/* Section 2: Today's Mess & Weekly Mess Menu */}
          <div style={{ marginBottom: '32px' }}>
            <MessMenuSection />
          </div>

          {/* Section 3: Maintenance Summary & My Tickets */}
          <div style={{ marginBottom: '32px' }}>
            <TicketList
              tickets={tickets}
              onOpenLodgeModal={() => setIsLodgeModalOpen(true)}
            />
          </div>
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
