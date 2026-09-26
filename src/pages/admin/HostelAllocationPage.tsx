import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { RoomRecord, UserProfile } from '../../types';
import {
  subscribeRooms,
  getAllResidents,
  allocateBed,
  releaseBed,
  smartSuggestAvailableBeds
} from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
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
  ShieldAlert,
  Sparkles,
  Search,
  Filter,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';

export const HostelAllocationPage: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Workflow selection state
  const [selectedResidentUid, setSelectedResidentUid] = useState<string>('');
  const [selectedBlock, setSelectedBlock] = useState<string>('Block A');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedBedNumber, setSelectedBedNumber] = useState<string>('');

  // Smart Allocate Modal
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);

  // Confirmation Modal
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'allocate' | 'release';
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    type: 'allocate',
    title: '',
    description: '',
    onConfirm: async () => {}
  });

  useEffect(() => {
    const unsub = subscribeRooms(allRooms => {
      setRooms(allRooms);
      if (!selectedRoomId && allRooms.length > 0) {
        setSelectedRoomId(allRooms[0].id);
        setSelectedBlock(allRooms[0].block);
        setSelectedFloor(allRooms[0].floor);
      }
    });

    setResidents(getAllResidents());
    return () => unsub();
  }, [selectedRoomId]);

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

  // Open Allocate Confirmation
  const promptAllocate = () => {
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

    setConfirmDialog({
      isOpen: true,
      type: 'allocate',
      title: 'Confirm Room Allocation',
      description: `Assign ${resident.name} (${resident.email}) to Room ${activeRoom.roomNumber} (${activeRoom.block}, ${selectedBedNumber})?`,
      onConfirm: async () => {
        const ok = await allocateBed(activeRoom.id, selectedBedNumber, {
          uid: resident.uid,
          name: resident.name,
          studentId: resident.email.split('@')[0]
        }, user?.name || 'Chief Warden');

        if (ok) {
          setFeedback({
            type: 'success',
            message: `Successfully allocated ${resident.name} to Room ${activeRoom.roomNumber} (${selectedBedNumber})!`
          });
          setResidents(getAllResidents());
          setSelectedBedNumber('');
          setTimeout(() => setFeedback(null), 5000);
        } else {
          setFeedback({ type: 'error', message: 'Allocation failed. Bed may already be occupied.' });
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Open Release Confirmation
  const promptRelease = (roomId: string, bedNumber: string, residentName?: string) => {
    const rm = rooms.find(r => r.id === roomId);
    setConfirmDialog({
      isOpen: true,
      type: 'release',
      title: 'Confirm Bed Release',
      description: `Remove allocation for ${bedNumber} in Room ${rm?.roomNumber || ''} ${residentName ? `(assigned to ${residentName})` : ''}? The bed will immediately become vacant.`,
      onConfirm: async () => {
        const ok = await releaseBed(roomId, bedNumber, user?.name || 'Chief Warden');
        if (ok) {
          setFeedback({
            type: 'success',
            message: `Released ${bedNumber} in Room ${rm?.roomNumber}. Bed is now vacant.`
          });
          setResidents(getAllResidents());
          setTimeout(() => setFeedback(null), 5000);
        } else {
          setFeedback({ type: 'error', message: 'Failed to release bed.' });
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Smart suggestions
  const smartSuggestions = smartSuggestAvailableBeds();

  const handleApplySmartSuggestion = (item: typeof smartSuggestions[0]) => {
    setSelectedBlock(item.block);
    setSelectedFloor(item.floor);
    setSelectedRoomId(item.roomId);
    setSelectedBedNumber(item.bedNumber);
    setIsSmartModalOpen(false);
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
            Real-time atomic allocation, visual bed mapping, automated synchronization, and Warden confirmation.
          </p>
        </div>

        <button
          onClick={() => setIsSmartModalOpen(true)}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            background: 'var(--brand-purple)',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(99, 102, 241, 0.25)'
          }}
        >
          <Sparkles size={16} /> Smart Allocate (Suggest Vacancies)
        </button>
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

        {/* Step 2: Visual Bed Selector & Availability */}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              promptRelease(activeRoom.id, bed.bedNumber, bed.residentName);
                            }}
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
              onClick={promptAllocate}
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
              Requires explicit Warden confirmation before updating Firestore.
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ALL ROOMS & RESIDENT OCCUPANCY DIRECTORY                     */}
      {/* ============================================================ */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
              Live Room Occupancy & Resident Directory
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
              Complete campus room breakdown and resident bed allocations
            </span>
          </div>
        </div>

        <div className="pro-table-wrapper">
          <table className="pro-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Block</th>
                <th>Floor</th>
                <th>Capacity</th>
                <th>Occupancy</th>
                <th>Residents in Room</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(rm => (
                <tr key={rm.id}>
                  <td style={{ fontWeight: 800 }}>Room {rm.roomNumber}</td>
                  <td>{rm.block}</td>
                  <td>Floor {rm.floor}</td>
                  <td>{rm.capacity} beds</td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: rm.occupied === rm.capacity ? '#fee2e2' : '#dcfce7',
                        color: rm.occupied === rm.capacity ? '#dc2626' : '#15803d'
                      }}
                    >
                      {rm.occupied} / {rm.capacity} ({rm.capacity - rm.occupied} free)
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {rm.beds.filter(b => b.isOccupied).length === 0 ? (
                        <span style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>Vacant</span>
                      ) : (
                        rm.beds.filter(b => b.isOccupied).map(b => (
                          <span
                            key={b.bedNumber}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: '#f1f5f9',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#334155'
                            }}
                          >
                            {b.bedNumber}: {b.residentName}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedBlock(rm.block);
                        setSelectedFloor(rm.floor);
                        setSelectedRoomId(rm.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--neutral-border)',
                        background: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Inspect / Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SMART ALLOCATE MODAL (Feature 4 Recommendation Engine)       */}
      {/* ============================================================ */}
      {isSmartModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsSmartModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--neutral-dark)' }}>
                    Smart Allocate Suggestion
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
                    Filtering strictly to currently available beds
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsSmartModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--neutral-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#4b5563', marginBottom: '16px', lineHeight: 1.4 }}>
              The Smart Suggestion engine identifies all verified vacant beds across campus blocks. Select a suggestion below to pre-fill the allocation workflow. Final allocation must be confirmed by you.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {smartSuggestions.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--neutral-muted)', fontSize: '0.85rem' }}>
                  No beds are currently vacant across all hostel blocks.
                </div>
              ) : (
                smartSuggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApplySmartSuggestion(sug)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#eff6ff')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--neutral-dark)' }}>
                        Room {sug.roomNumber} • {sug.bedNumber}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '2px' }}>
                        {sug.block} • Floor {sug.floor} ({sug.availableBeds} beds vacant in room)
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'var(--brand-blue)',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      Select
                    </span>
                  </div>
                ))
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setIsSmartModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--neutral-border)',
                  background: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EXPLICIT CONFIRMATION MODAL                                  */}
      {/* ============================================================ */}
      {confirmDialog.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: confirmDialog.type === 'release' ? '#fee2e2' : '#e0e7ff',
                  color: confirmDialog.type === 'release' ? '#dc2626' : '#4338ca',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {confirmDialog.type === 'release' ? <AlertTriangle size={20} /> : <KeyRound size={20} />}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--neutral-dark)' }}>
                  {confirmDialog.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
                  Warden Action Authorization Required
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
              {confirmDialog.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--neutral-border)',
                  background: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: confirmDialog.type === 'release' ? '#dc2626' : 'var(--brand-blue)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {confirmDialog.type === 'release' ? 'Yes, Release Bed' : 'Yes, Confirm Allocation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
