import React, { useState, useEffect } from 'react';
import { NightAttendanceRecord, UserProfile, GatePassRequest } from '../../types';
import {
  subscribeAttendance,
  markAttendanceBatch,
  subscribeResidents,
  subscribeGatePasses
} from '../../services/storageService';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Save,
  Users,
  UserCheck,
  UserX,
  Filter,
  CheckCheck
} from 'lucide-react';

export const NightAttendancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [existingRecords, setExistingRecords] = useState<NightAttendanceRecord[]>([]);
  const [gatePasses, setGatePasses] = useState<GatePassRequest[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, 'present' | 'absent' | 'on_leave' | 'late'>>({});
  const [remarksState, setRemarksState] = useState<Record<string, string>>({});
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load residents, gate passes, and existing attendance
  useEffect(() => {
    const unsubUsers = subscribeResidents((students: UserProfile[]) => {
      setResidents(students);
    });

    const unsubPasses = subscribeGatePasses(passes => {
      setGatePasses(passes);
    });

    return () => {
      unsubUsers();
      unsubPasses();
    };
  }, []);

  useEffect(() => {
    const unsubAtt = subscribeAttendance(selectedDate, (records: NightAttendanceRecord[]) => {
      setExistingRecords(records);
      const stateMap: Record<string, 'present' | 'absent' | 'on_leave' | 'late'> = {};
      const remMap: Record<string, string> = {};

      records.forEach(r => {
        const normStatus = (r.status.toLowerCase().replace(' ', '_')) as 'present' | 'absent' | 'on_leave' | 'late';
        stateMap[r.residentId] = normStatus || 'present';
        if (r.remarks) remMap[r.residentId] = r.remarks;
      });

      // Auto-detect approved gate passes for students without attendance record
      residents.forEach(res => {
        const resId = res.uid;
        if (!stateMap[resId]) {
          const hasActivePass = gatePasses.some(
            p =>
              p.residentId === resId &&
              (p.status === 'Approved' || p.status === 'approved') &&
              p.departureDate <= selectedDate &&
              p.expectedReturnDate >= selectedDate
          );
          stateMap[resId] = hasActivePass ? 'on_leave' : 'present';
        }
      });

      setAttendanceState(stateMap);
      setRemarksState(remMap);
    });

    return () => unsubAtt();
  }, [selectedDate, residents, gatePasses]);

  const handleStatusChange = (residentId: string, status: 'present' | 'absent' | 'on_leave' | 'late') => {
    setAttendanceState(prev => ({ ...prev, [residentId]: status }));
    setSaveSuccess(false);
  };

  const handleMarkAllPresent = () => {
    const updated = { ...attendanceState };
    residents.forEach(res => {
      if (updated[res.uid] !== 'on_leave') {
        updated[res.uid] = 'present';
      }
    });
    setAttendanceState(updated);
    setSaveSuccess(false);
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const recordsToSave = residents.map(res => ({
        residentId: res.uid,
        residentName: res.name,
        roomNumber: res.roomNumber || '204',
        bedNumber: res.bedNumber || 'Bed 1',
        block: res.block || 'Block A',
        date: selectedDate,
        status: (attendanceState[res.uid] === 'on_leave' ? 'On Leave' : attendanceState[res.uid] === 'absent' ? 'Absent' : 'Present') as 'Present' | 'Absent' | 'On Leave',
        remarks: remarksState[res.uid] || '',
        markedBy: 'Chief Warden Office'
      }));

      await markAttendanceBatch(selectedDate, recordsToSave, 'Chief Warden Office');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save night attendance:', err);
    } finally {
      setSaving(false);
    }
  };

  // Filter residents by floor
  const filteredResidents = residents.filter(res => {
    if (selectedFloor === 'all') return true;
    const room = res.roomNumber || '';
    if (selectedFloor === '1' && room.startsWith('1')) return true;
    if (selectedFloor === '2' && room.startsWith('2')) return true;
    if (selectedFloor === '3' && room.startsWith('3')) return true;
    return false;
  });

  // Calculate live stats
  const totalStudents = residents.length;
  const presentCount = Object.values(attendanceState).filter(s => s === 'present').length;
  const absentCount = Object.values(attendanceState).filter(s => s === 'absent').length;
  const onLeaveCount = Object.values(attendanceState).filter(s => s === 'on_leave').length;
  const lateCount = Object.values(attendanceState).filter(s => s === 'late').length;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Night Curfew &amp; Roll-Call Attendance
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Conduct nightly 10:00 PM curfew headcount. Automatically identifies residents on approved leaves.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '6px 14px' }}>
            <Calendar size={16} color="#0284c7" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ border: 'none', outline: 'none', fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}
            />
          </div>

          <button
            disabled={saving}
            onClick={handleSaveAttendance}
            className="btn btn-primary"
            style={{
              background: saveSuccess ? '#059669' : '#1e3a8a',
              borderColor: saveSuccess ? '#059669' : '#1e3a8a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px'
            }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : saveSuccess ? 'Attendance Synced!' : 'Save Roll-Call'}</span>
          </button>
        </div>
      </div>

      {/* Roll-Call Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Enrolled Residents
            </span>
            <Users size={16} color="#64748b" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{totalStudents}</div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Active in Hostel Roster</span>
        </div>

        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' }}>
              Present in Rooms
            </span>
            <UserCheck size={16} color="#059669" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46' }}>{presentCount}</div>
          <span style={{ fontSize: '0.75rem', color: '#059669' }}>
            {totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(0) : 0}% Roll Call Verified
          </span>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>
              On Approved Leave
            </span>
            <Clock size={16} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e3a8a' }}>{onLeaveCount}</div>
          <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>Gate Pass Out-of-Campus</span>
        </div>

        <div style={{ background: absentCount > 0 ? '#fef2f2' : '#f8fafc', border: `1px solid ${absentCount > 0 ? '#fecaca' : '#e2e8f0'}`, borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: absentCount > 0 ? '#b91c1c' : '#64748b', textTransform: 'uppercase' }}>
              Unauthorized Absent
            </span>
            <UserX size={16} color={absentCount > 0 ? '#dc2626' : '#64748b'} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: absentCount > 0 ? '#b91c1c' : '#0f172a' }}>{absentCount}</div>
          <span style={{ fontSize: '0.75rem', color: absentCount > 0 ? '#b91c1c' : '#64748b' }}>
            {absentCount > 0 ? 'Requires Immediate Check' : 'Zero Violations'}
          </span>
        </div>
      </div>

      {/* Filter and Quick Action Toolbar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Filter by Floor:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'all', label: 'All Floors' },
              { id: '1', label: 'Floor 1 (101-104)' },
              { id: '2', label: 'Floor 2 (201-205)' },
              { id: '3', label: 'Floor 3 (301-305)' }
            ].map(fl => (
              <button
                key={fl.id}
                onClick={() => setSelectedFloor(fl.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: selectedFloor === fl.id ? '#1e3a8a' : '#64748b',
                  background: selectedFloor === fl.id ? '#eff6ff' : 'transparent',
                  border: selectedFloor === fl.id ? '1px solid #bfdbfe' : '1px solid transparent',
                  cursor: 'pointer'
                }}
              >
                {fl.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleMarkAllPresent}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem' }}
        >
          <CheckCheck size={15} color="#059669" />
          <span>Mark Remaining Residents as Present</span>
        </button>
      </div>

      {/* Roll Call Attendance Table */}
      <div className="pro-table-wrapper">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Room &amp; Bed</th>
              <th>Resident Student</th>
              <th>Parent Contact</th>
              <th>Curfew Status (Click to Set)</th>
              <th>Remarks / Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No residents match the selected floor filter.
                </td>
              </tr>
            ) : (
              filteredResidents.map(res => {
                const currentStatus = attendanceState[res.uid] || 'present';
                return (
                  <tr key={res.uid}>
                    <td>
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#f1f5f9',
                          fontWeight: 800,
                          color: '#0f172a',
                          fontSize: '0.85rem'
                        }}
                      >
                        Room {res.roomNumber || 'Unassigned'} ({res.bedNumber || 'Bed 1'})
                      </div>
                    </td>

                    <td>
                      <strong style={{ color: '#0f172a', display: 'block' }}>{res.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{res.email}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#334155' }}>
                        {res.parentPhone || '+91 94310 12345'}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleStatusChange(res.uid, 'present')}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: currentStatus === 'present' ? '1.5px solid #059669' : '1px solid #cbd5e1',
                            background: currentStatus === 'present' ? '#ecfdf5' : '#ffffff',
                            color: currentStatus === 'present' ? '#065f46' : '#64748b'
                          }}
                        >
                          ✓ Present
                        </button>

                        <button
                          onClick={() => handleStatusChange(res.uid, 'on_leave')}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: currentStatus === 'on_leave' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                            background: currentStatus === 'on_leave' ? '#eff6ff' : '#ffffff',
                            color: currentStatus === 'on_leave' ? '#1d4ed8' : '#64748b'
                          }}
                        >
                          On Leave
                        </button>

                        <button
                          onClick={() => handleStatusChange(res.uid, 'late')}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: currentStatus === 'late' ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                            background: currentStatus === 'late' ? '#fffbeb' : '#ffffff',
                            color: currentStatus === 'late' ? '#b45309' : '#64748b'
                          }}
                        >
                          Late Check-in
                        </button>

                        <button
                          onClick={() => handleStatusChange(res.uid, 'absent')}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: currentStatus === 'absent' ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
                            background: currentStatus === 'absent' ? '#fef2f2' : '#ffffff',
                            color: currentStatus === 'absent' ? '#b91c1c' : '#64748b'
                          }}
                        >
                          ✗ Absent
                        </button>
                      </div>
                    </td>

                    <td>
                      <input
                        type="text"
                        placeholder="Optional remarks..."
                        value={remarksState[res.uid] || ''}
                        onChange={e => setRemarksState({ ...remarksState, [res.uid]: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          fontSize: '0.8rem',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          outline: 'none'
                        }}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
