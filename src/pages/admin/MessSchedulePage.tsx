import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { MealScheduleItem } from '../../types';
import {
  getStoredMealSchedule,
  saveMealSchedule,
  subscribeMealSchedule
} from '../../services/storageService';
import {
  Clock,
  Edit2,
  Check,
  CheckCircle2,
  UtensilsCrossed,
  MapPin,
  Sparkles
} from 'lucide-react';

export const MessSchedulePage: React.FC = () => {
  const [schedule, setSchedule] = useState<MealScheduleItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Upcoming' | 'Completed'>('Upcoming');
  const [formLocation, setFormLocation] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeMealSchedule(list => setSchedule(list));
    return () => unsub();
  }, []);

  const startEdit = (item: MealScheduleItem) => {
    setEditingId(item.id);
    setFormStart(item.startTime);
    setFormEnd(item.endTime);
    setFormStatus(item.status);
    setFormLocation(item.location);
  };

  const saveEdit = async (id: string) => {
    const updated = schedule.map(item => {
      if (item.id === id) {
        return {
          ...item,
          startTime: formStart,
          endTime: formEnd,
          status: formStatus,
          location: formLocation
        };
      }
      return item;
    });

    await saveMealSchedule(updated);
    setEditingId(null);
    setFeedback('Meal serving timings updated successfully!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const activeMeal = schedule.find(s => s.status === 'Active');

  return (
    <AppLayout
      activeDomain="mess"
      breadcrumbs={[
        { label: 'Smart Mess Management', href: '/admin/mess' },
        { label: 'Meal Schedule & Timings' }
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
              <Clock size={14} /> Mess Operational Schedule
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Daily Meal Serving Windows
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Configure active serving windows, counter locations, and real-time meal availability status.
          </p>
        </div>

        {activeMeal && (
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              fontSize: '0.84rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: '#16a34a' }}>● Currently Serving:</span>
            <span>{activeMeal.meal} ({activeMeal.startTime} - {activeMeal.endTime})</span>
          </div>
        )}
      </div>

      {feedback && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '24px',
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

      {/* Schedule Table / Cards */}
      <div className="pro-table-wrapper" style={{ marginBottom: '32px' }}>
        <table className="pro-table">
          <thead>
            <tr>
              <th>Meal</th>
              <th>Course Name</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Dining Location</th>
              <th>Current Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(item => {
              const isEditing = editingId === item.id;
              return (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--neutral-dark)' }}>
                      {item.meal}
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formStart}
                        onChange={e => setFormStart(e.target.value)}
                        style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--neutral-border)', fontSize: '0.8rem', width: '100px' }}
                      />
                    ) : (
                      item.startTime
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formEnd}
                        onChange={e => setFormEnd(e.target.value)}
                        style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--neutral-border)', fontSize: '0.8rem', width: '100px' }}
                      />
                    ) : (
                      item.endTime
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formLocation}
                        onChange={e => setFormLocation(e.target.value)}
                        style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--neutral-border)', fontSize: '0.8rem', width: '160px' }}
                      />
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--neutral-muted)' }}>
                        <MapPin size={13} /> {item.location}
                      </span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <select
                        value={formStatus}
                        onChange={e => setFormStatus(e.target.value as any)}
                        style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--neutral-border)', fontSize: '0.8rem' }}
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Active">Active (Serving)</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background:
                            item.status === 'Active' ? '#dcfce7' : item.status === 'Upcoming' ? '#eff6ff' : '#f1f5f9',
                          color:
                            item.status === 'Active' ? '#15803d' : item.status === 'Upcoming' ? '#1d4ed8' : '#64748b'
                        }}
                      >
                        ● {item.status}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {isEditing ? (
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--neutral-border)',
                            background: '#ffffff',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(item.id)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            background: 'var(--mess-accent)',
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Check size={14} /> Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(item)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--neutral-border)',
                          background: '#f8fafc',
                          color: 'var(--mess-accent)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Edit2 size={13} /> Edit Timings
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};
