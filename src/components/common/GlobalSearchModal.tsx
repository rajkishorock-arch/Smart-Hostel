import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getAllResidents,
  getStoredRooms,
  getStoredTickets,
  getStoredAnnouncements
} from '../../services/storageService';
import { Search, X, User, DoorOpen, Wrench, Megaphone, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  category: 'Resident' | 'Room' | 'Ticket' | 'Notice';
  title: string;
  subtitle: string;
  badge?: string;
  path: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isWarden = user?.role === 'warden';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      return;
    }

    const residents = getAllResidents();
    const rooms = getStoredRooms();
    const tickets = getStoredTickets();
    const notices = getStoredAnnouncements();

    const matched: SearchItem[] = [];

    // Search Residents (WARDEN ONLY - residents cannot spy on other residents)
    if (isWarden) {
      for (const res of residents) {
        if (
          res.name.toLowerCase().includes(q) ||
          res.email.toLowerCase().includes(q) ||
          (res.roomNumber && res.roomNumber.toLowerCase().includes(q))
        ) {
          matched.push({
            id: `res-${res.uid}`,
            category: 'Resident',
            title: res.name,
            subtitle: `${res.email} • Room ${res.roomNumber || 'Not Allocated'}`,
            badge: res.roomNumber ? 'Allocated' : 'Unallocated',
            path: '/admin/hostel/allocation'
          });
        }
      }

      // Search Rooms (Warden link)
      for (const rm of rooms) {
        if (
          rm.roomNumber.toLowerCase().includes(q) ||
          rm.block.toLowerCase().includes(q) ||
          rm.beds.some(b => b.residentName?.toLowerCase().includes(q))
        ) {
          matched.push({
            id: `room-${rm.id}`,
            category: 'Room',
            title: `Room ${rm.roomNumber} (${rm.block})`,
            subtitle: `Capacity: ${rm.capacity} • Occupied: ${rm.occupied} bed(s)`,
            badge: rm.occupied === rm.capacity ? 'Full' : `${rm.capacity - rm.occupied} Available`,
            path: '/admin/hostel/rooms'
          });
        }
      }
    } else {
      // For Resident Student: Only search their own allocated room
      if (user?.roomNumber && user.roomNumber.toLowerCase().includes(q)) {
        matched.push({
          id: `room-my`,
          category: 'Room',
          title: `My Room ${user.roomNumber} (${user.block || 'Block A'})`,
          subtitle: `Bed: ${user.bedNumber || 'Bed 1'} • Allocated`,
          badge: 'My Room',
          path: '/resident/room'
        });
      }
    }

    // Search Maintenance Tickets
    for (const tkt of tickets) {
      // If resident, only allow their own tickets or their room's tickets
      if (!isWarden && tkt.residentId && tkt.residentId !== user?.id && tkt.roomNumber !== user?.roomNumber) {
        continue;
      }

      const ticketTitle = tkt.title || tkt.description;
      if (
        tkt.id.toLowerCase().includes(q) ||
        ticketTitle.toLowerCase().includes(q) ||
        tkt.category.toLowerCase().includes(q) ||
        (tkt.roomNumber && tkt.roomNumber.toLowerCase().includes(q)) ||
        (tkt.room && tkt.room.toLowerCase().includes(q))
      ) {
        matched.push({
          id: `tkt-${tkt.id}`,
          category: 'Ticket',
          title: `#${tkt.id}: ${ticketTitle}`,
          subtitle: `Room ${tkt.roomNumber || tkt.room || 'N/A'} • ${tkt.category} • Priority: ${tkt.priority}`,
          badge: tkt.status,
          path: isWarden ? '/admin/maintenance/resolution' : '/resident/maintenance/tickets'
        });
      }
    }

    // Search Public Notices (accessible to all)
    for (const note of notices) {
      const noteDesc = note.content || note.description || '';
      if (
        note.title.toLowerCase().includes(q) ||
        noteDesc.toLowerCase().includes(q) ||
        note.category.toLowerCase().includes(q)
      ) {
        matched.push({
          id: `note-${note.id}`,
          category: 'Notice',
          title: note.title,
          subtitle: `${note.category} • ${noteDesc.slice(0, 60)}...`,
          badge: note.priority || 'General',
          path: isWarden ? '/admin/mess/announcements' : '/resident/announcements'
        });
      }
    }

    setResults(matched.slice(0, 15));
  }, [query, isWarden, user]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchItem) => {
    navigate(item.path);
    onClose();
  };

  const getCategoryIcon = (category: SearchItem['category']) => {
    switch (category) {
      case 'Resident':
        return <User size={15} color="#3b82f6" />;
      case 'Room':
        return <DoorOpen size={15} color="#10b981" />;
      case 'Ticket':
        return <Wrench size={15} color="#f59e0b" />;
      case 'Notice':
        return <Megaphone size={15} color="#8b5cf6" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(3px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          background: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--neutral-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Search size={20} color="var(--neutral-muted)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search residents, rooms, maintenance tickets, notices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.95rem',
              color: 'var(--neutral-dark)'
            }}
          />
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--neutral-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Area */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
          {query.trim().length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--neutral-muted)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Global Warden Directory Search</div>
              <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                Type a name, room number, ticket code (e.g. TKT), or announcement topic.
              </div>
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--neutral-muted)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No results found for "{query}"</div>
              <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Try searching by resident name, room number, or ticket category.</div>
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  borderBottom: '1px solid #f8fafc'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {getCategoryIcon(item.category)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--neutral-dark)' }}>
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: '#f1f5f9',
                          color: '#475569'
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--neutral-muted)',
                        marginTop: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: '#eff6ff',
                        color: '#1d4ed8'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ArrowRight size={14} color="#94a3b8" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '10px 16px',
            background: '#f8fafc',
            borderTop: '1px solid var(--neutral-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--neutral-muted)'
          }}
        >
          <span>Tip: Press ESC or click outside to close</span>
          <span>{results.length} result(s)</span>
        </div>
      </div>
    </div>
  );
};
