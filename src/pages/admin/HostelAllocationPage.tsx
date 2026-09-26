import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { RoomRecord, UserProfile } from '../../types';
import {
  subscribeRooms,
  getStoredUsers,
  allocateBed,
  releaseBed
} from '../../services/storageService';
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Building2,
  Bed,
  UserCheck,
  RotateCcw,
  Check,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const HostelAllocationPage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Workflow selection state
  const [selectedResidentUid, setSelectedResidentUid] = useState<string>('');
  const [selectedBlock, setSelectedBlock] = useState<string>('Block A');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedBedNumber, setSelectedBedNumber] = useState<string>('');

  useEffect(() => {
    const unsub = subscribeRooms(allRooms => {
      setRooms(allRooms);
      if (!selectedRoomId && allRooms.length > 0) {
        setSelectedRoomId(allRooms[0].id);
        setSelectedBlock(allRooms[0].block);
        setSelectedFloor(allRooms[0].floor);
      }
    });

    const loadUsers = () => {
      const all = getStoredUsers();
      setResidents(Object.values(all).filter(u => u.role === 'resident'));
    };
    loadUsers();

    return () => unsub();
  }, []);

  // Filter rooms matching block and floor
  const roomsInSelection = rooms.filter(
    r => r.block === selectedBlock && r.floor === selectedFloor
  );

  const activeRoom = rooms.find(r => r.id === selectedRoomId) || roomsInSelection[0];

  const handleBlockChange = (newBlock: string) => {
    setSelectedBlock(newBlock);
    const firstMatch = rooms.find(r => r.block === newBlock && r.floor === selectedFloor);
    if (firstMatch) {
      setSelectedRoomId(firstMatch.id);
      setSelectedBedNumber('');
    }
  };

  const handleFloorChange = (newFloor: number) => {
    setSelectedFloor(newFloor);
    const firstMatch = rooms.find(r => r.block === selectedBlock && r.floor === newFloor);
    if (firstMatch) {
      setSelectedRoomId(firstMatch.id);
      setSelectedBedNumber('');
    }
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    setSelectedBedNumber('');
  };

  const handleAllocate = async () => {
    if (!selectedResidentUid) {
      setFeedback({ type: 'error', message: 'Please select a resident to allocate.' });
      return;
    }
    if (!activeRoom || !selectedBedNumber) {
      setFeedback({ type: 'error', message: 'Please select an available bed from the room layout.' });
      return;
    }

    const resident = residents.find(r => r.uid === selectedResidentUid);
    if (!resident) {
      setFeedback({ type: 'error', message: 'Resident profile not found.' });
      return;
    }

    const ok = await allocateBed(activeRoom.id, selectedBedNumber, {
      uid: resident.uid,
      name: resident.name,
      studentId: resident.email.split('@')[0]
    });

    if (ok) {
      setFeedback({
        type: 'success',
        message: `Successfully allocated ${resident.name} to Room ${activeRoom.roomNumber} (${selectedBedNumber})!`
      });
      // Refresh residents
      const all = getStoredUsers();
      setResidents(Object.values(all).filter(u => u.role === 'resident'));
      setTimeout(() => setFeedback(null), 5000);
    } else {
      setFeedback({ type: 'error', message: 'Allocation failed. Bed may already be occupied.' });
    }
  };

  const handleRelease = async (roomId: string, bedNumber: string) => {
    const ok = await releaseBed(roomId, bedNumber);
    if (ok) {
      setFeedback({
        type: 'success',
        message: `Released ${bedNumber} in Room ${activeRoom?.roomNumber}. Bed is now vacant.`
      });
      // Refresh residents
      const all = getStoredUsers();
      setResidents(Object.values(all).filter(u => u.role === 'resident'));
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <AppLayout
      activeDomain="hostel"
      breadcrumbs={[
        { label: 'Hostel Management', href: '/admin/hostel' },
        { label: 'Room Allocation Workflow' }
      ]}
    >
      {/* Top Banner */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '16px',
          padding: '24px 28px',
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
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--brand-blue)',
                background: 'var(--brand-blue-subtle)',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <KeyRound size={14} /> Warden Administrative Authority
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Room & Bed Allocation Workflow
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Select resident, target hostel block, floor, room, and assign or release specific beds.
          </p>
        </div>
      </div>

      {/* Alert / Feedback message */}
      {feedback && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: '10px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            fontWeight: 600,
            background: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: feedback.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${feedback.type === 'success' ? '#a7f3d0' : '#fecaca'}`
          }}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Allocation Workflow Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}
      >
        {/* Step 1 & 2: Workflow Selectors */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--neutral-dark)', marginBottom: '16px' }}>
            1. Select Target & Resident
          </h2>

          {/* Select Resident */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
              Select Resident to Allocate:
            </label>
            <select
              value={selectedResidentUid}
              onChange={e => setSelectedResidentUid(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--neutral-border)',
                fontSize: '0.86rem',
                background: '#ffffff'
              }}
            >
              <option value="">-- Choose Resident --</option>
              {residents.map(res => (
                <option key={res.uid} value={res.uid}>
                  {res.name} — Current: {res.roomNumber ? `Room ${res.roomNumber} (${res.bedNumber || 'Bed'})` : 'Unallocated'} ({res.email})
                </option>
              ))}
            </select>
          </div>

          {/* Select Block */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
              Select Building Block:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {['Block A', 'Block B', 'Block C'].map(block => (
                <button
                  key={block}
                  type="button"
                  onClick={() => handleBlockChange(block)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: selectedBlock === block ? '2px solid var(--brand-blue)' : '1px solid var(--neutral-border)',
                    background: selectedBlock === block ? 'var(--brand-blue-subtle)' : '#f8fafc',
                    color: selectedBlock === block ? 'var(--brand-blue)' : 'var(--neutral-dark)',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  {block}
                </button>
              ))}
            </div>
          </div>

          {/* Select Floor */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
              Select Floor:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[1, 2, 3].map(floor => (
                <button
                  key={floor}
                  type="button"
                  onClick={() => handleFloorChange(floor)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: selectedFloor === floor ? '2px solid var(--brand-blue)' : '1px solid var(--neutral-border)',
                    background: selectedFloor === floor ? 'var(--brand-blue-subtle)' : '#f8fafc',
                    color: selectedFloor === floor ? 'var(--brand-blue)' : 'var(--neutral-dark)',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  Floor {floor}
                </button>
              ))}
            </div>
          </div>

          {/* Select Room */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
              Select Room on {selectedBlock} - Floor {selectedFloor}:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {roomsInSelection.length === 0 ? (
                <span style={{ fontSize: '0.82rem', color: 'var(--neutral-muted)' }}>
                  No registered rooms configured for this block/floor.
                </span>
              ) : (
                roomsInSelection.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoomSelect(r.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: activeRoom?.id === r.id ? '2px solid var(--brand-blue)' : '1px solid var(--neutral-border)',
                      background: activeRoom?.id === r.id ? 'var(--brand-blue-subtle)' : '#ffffff',
                      color: activeRoom?.id === r.id ? 'var(--brand-blue)' : 'var(--neutral-dark)',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    Room {r.roomNumber} ({r.occupied}/{r.capacity})
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Visual Bed Selector & Availability */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                  2. Visual Bed Selector
                </h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
                  {activeRoom ? `Room ${activeRoom.roomNumber} (${activeRoom.block}, Floor ${activeRoom.floor})` : 'Select a room'}
                </span>
              </div>

              {activeRoom && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '8px',
                    background: activeRoom.occupied === activeRoom.capacity ? '#fee2e2' : '#dcfce7',
                    color: activeRoom.occupied === activeRoom.capacity ? '#b91c1c' : '#15803d'
                  }}
                >
                  {activeRoom.occupied === activeRoom.capacity ? 'Room Full' : `${activeRoom.capacity - activeRoom.occupied} Beds Available`}
                </span>
              )}
            </div>

            {/* Visual Bed Grid */}
            {activeRoom ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {activeRoom.beds.map((bed, idx) => {
                  const isOccupied = !!bed.residentId;
                  const isSelected = selectedBedNumber === bed.bedNumber;

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '10px',
                        border: isSelected
                          ? '2px solid var(--brand-blue)'
                          : isOccupied
                          ? '1px solid var(--neutral-border)'
                          : '1.5px dashed #16a34a',
                        background: isSelected
                          ? 'var(--brand-blue-subtle)'
                          : isOccupied
                          ? '#f8fafc'
                          : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: isOccupied ? 'default' : 'pointer'
                      }}
                      onClick={() => {
                        if (!isOccupied) setSelectedBedNumber(bed.bedNumber);
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: isOccupied ? '#f1f5f9' : '#dcfce7',
                            color: isOccupied ? '#64748b' : '#16a34a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Bed size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--neutral-dark)' }}>
                            {bed.bedNumber}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: isOccupied ? 'var(--neutral-dark)' : '#16a34a', fontWeight: isOccupied ? 600 : 500 }}>
                            {isOccupied ? `Occupied: ${bed.residentName} (${bed.studentId || 'ID Verified'})` : 'Available for allocation'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isOccupied ? (
                          <button
                            type="button"
                            onClick={() => handleRelease(activeRoom.id, bed.bedNumber)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid #fecaca',
                              background: '#fff1f2',
                              color: '#dc2626',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Release Bed
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedBedNumber(bed.bedNumber)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: 'none',
                              background: isSelected ? 'var(--brand-blue)' : '#16a34a',
                              color: '#ffffff',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: 'var(--neutral-muted)', fontSize: '0.85rem' }}>
                Select a room on the left to inspect beds.
              </p>
            )}
          </div>

          {/* Allocate CTA Button */}
          <div>
            <button
              type="button"
              onClick={handleAllocate}
              disabled={!selectedResidentUid || !selectedBedNumber}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: selectedResidentUid && selectedBedNumber ? 'var(--brand-blue)' : '#cbd5e1',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: selectedResidentUid && selectedBedNumber ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <KeyRound size={16} /> Confirm Bed Allocation
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.74rem', color: 'var(--neutral-muted)', marginTop: '8px' }}>
              Assignment updates live room inventory & resident profile in Firestore.
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
