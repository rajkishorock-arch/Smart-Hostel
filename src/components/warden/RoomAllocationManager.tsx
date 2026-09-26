import React, { useState } from 'react';
import { RoomRecord, UserProfile } from '../../types';
import { saveRooms, saveStoredUser } from '../../services/storageService';
import {
  Building2,
  DoorClosed,
  Bed,
  UserPlus,
  CheckCircle,
  Users,
  Layers,
  ArrowRight
} from 'lucide-react';

interface RoomAllocationManagerProps {
  rooms: RoomRecord[];
  residents: UserProfile[];
  onRoomsUpdated?: () => void;
}

export const RoomAllocationManager: React.FC<RoomAllocationManagerProps> = ({
  rooms,
  residents,
  onRoomsUpdated
}) => {
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [assigningRoom, setAssigningRoom] = useState<RoomRecord | null>(null);
  const [selectedBedNumber, setSelectedBedNumber] = useState('Bed 1');
  const [selectedStudentUid, setSelectedStudentUid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentResidents = residents.filter(r => r.role === 'resident');

  const filteredRooms = rooms.filter(
    r => selectedBlock === 'All' || r.block === selectedBlock
  );

  const handleOpenAssign = (room: RoomRecord) => {
    setAssigningRoom(room);
    // Find first vacant bed if any
    const vacant = room.beds.find(b => !b.residentName);
    setSelectedBedNumber(vacant ? vacant.bedNumber : room.beds[0]?.bedNumber || 'Bed 1');
    setSelectedStudentUid(studentResidents[0]?.uid || '');
  };

  const handleSaveAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningRoom || !selectedStudentUid) return;

    setIsSubmitting(true);
    try {
      const student = studentResidents.find(s => s.uid === selectedStudentUid);
      if (!student) return;

      // Update room beds
      const updatedRooms = rooms.map(r => {
        if (r.id === assigningRoom.id) {
          const updatedBeds = r.beds.map(b => {
            if (b.bedNumber === selectedBedNumber) {
              return {
                ...b,
                residentId: student.uid,
                residentName: student.name,
                studentId: student.email.split('@')[0].toUpperCase()
              };
            }
            return b;
          });
          const newOccupied = updatedBeds.filter(b => b.residentName).length;
          return {
            ...r,
            beds: updatedBeds,
            occupied: newOccupied
          };
        }
        return r;
      });

      // Update user profile room and bed
      const updatedUser: UserProfile = {
        ...student,
        hostel: assigningRoom.hostel,
        block: assigningRoom.block,
        roomNumber: assigningRoom.roomNumber,
        bedNumber: selectedBedNumber
      };

      await saveRooms(updatedRooms);
      saveStoredUser(updatedUser);

      setAssigningRoom(null);
      if (onRoomsUpdated) onRoomsUpdated();
    } catch (err) {
      console.error('Failed to allocate room:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: '24px',
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '18px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#ecfeff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0891b2'
            }}
          >
            <Building2 size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              3. Room &amp; Bed Allocation Manager
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              Map residents to physical rooms and beds with live vacancy tracking
            </p>
          </div>
        </div>

        {/* Wing Filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Block A', 'Block B', 'Block C'].map(block => (
            <button
              key={block}
              onClick={() => setSelectedBlock(block)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: selectedBlock === block ? '#0891b2' : '#f1f5f9',
                color: selectedBlock === block ? '#ffffff' : '#475569',
                border: selectedBlock === block ? '1px solid #0e7490' : '1px solid #cbd5e1'
              }}
            >
              {block}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}
      >
        {filteredRooms.map(room => {
          const isFull = room.occupied >= room.capacity;
          const isVacant = room.occupied === 0;

          return (
            <div
              key={room.id}
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '14px',
                padding: '18px',
                background: '#ffffff',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DoorClosed size={20} color="#0891b2" />
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                      Room {room.roomNumber}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      background: isFull ? '#fee2e2' : isVacant ? '#dcfce7' : '#fef3c7',
                      color: isFull ? '#b91c1c' : isVacant ? '#15803d' : '#b45309'
                    }}
                  >
                    {room.occupied}/{room.capacity} Beds Filled
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
                  <span>{room.block}</span>
                  <span>•</span>
                  <span>Floor {room.floor}</span>
                  <span>•</span>
                  <span>{room.hostel}</span>
                </div>

                {/* Beds list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {room.beds.map((bed, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        background: bed.residentName ? '#f8fafc' : '#f0fdf4',
                        border: bed.residentName ? '1px solid #e2e8f0' : '1px dashed #86efac',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.825rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Bed size={14} color={bed.residentName ? '#475569' : '#16a34a'} />
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{bed.bedNumber}</span>
                      </div>

                      {bed.residentName ? (
                        <span style={{ color: '#0f172a', fontWeight: 700 }}>
                          {bed.residentName}
                        </span>
                      ) : (
                        <span style={{ color: '#16a34a', fontWeight: 700 }}>
                          Available
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleOpenAssign(room)}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <UserPlus size={14} />
                <span>{isFull ? 'Reassign Bed' : 'Allocate Bed to Student'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Allocation Modal */}
      {assigningRoom && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Allocate Bed: Room {assigningRoom.roomNumber}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {assigningRoom.block} • {assigningRoom.hostel}
                </span>
              </div>
              <button
                onClick={() => setAssigningRoom(null)}
                style={{ padding: '6px', borderRadius: '8px', color: '#64748b', background: '#f1f5f9' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAllocation}>
              {/* Target Bed */}
              <div className="form-group">
                <label className="form-label">Select Bed Number</label>
                <select
                  className="form-select"
                  value={selectedBedNumber}
                  onChange={e => setSelectedBedNumber(e.target.value)}
                >
                  {assigningRoom.beds.map((b, i) => (
                    <option key={i} value={b.bedNumber}>
                      {b.bedNumber} {b.residentName ? `(Currently: ${b.residentName})` : '(Available)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Resident */}
              <div className="form-group">
                <label className="form-label">Assign Resident Student</label>
                <select
                  className="form-select"
                  value={selectedStudentUid}
                  onChange={e => setSelectedStudentUid(e.target.value)}
                  required
                >
                  {studentResidents.map(s => (
                    <option key={s.uid} value={s.uid}>
                      {s.name} ({s.email}) — Currently: Room {s.roomNumber || 'None'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setAssigningRoom(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ minWidth: '150px' }}
                >
                  {isSubmitting ? 'Allocating...' : 'Confirm Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
