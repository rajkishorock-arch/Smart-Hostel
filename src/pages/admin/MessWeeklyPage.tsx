import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { DayMenu, WeeklyMessMenu } from '../../types';
import { subscribeMessMenu, saveMessMenu } from '../../services/storageService';
import {
  CalendarDays,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Edit2,
  Check,
  CheckCircle2,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const MessWeeklyPage: React.FC = () => {
  const [menu, setMenu] = useState<WeeklyMessMenu | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states for selected day
  const [formState, setFormState] = useState<{
    breakfast: { items: string; timing: string };
    lunch: { items: string; timing: string };
    snacks: { items: string; timing: string };
    dinner: { items: string; timing: string };
    specialNote: string;
  }>({
    breakfast: { items: '', timing: '' },
    lunch: { items: '', timing: '' },
    snacks: { items: '', timing: '' },
    dinner: { items: '', timing: '' },
    specialNote: ''
  });

  useEffect(() => {
    const unsub = subscribeMessMenu(m => setMenu(m));
    return () => unsub();
  }, []);

  const activeDayData = menu ? menu[selectedDay] : null;

  useEffect(() => {
    if (activeDayData) {
      setFormState({
        breakfast: { ...activeDayData.breakfast },
        lunch: { ...activeDayData.lunch },
        snacks: { ...activeDayData.snacks },
        dinner: { ...activeDayData.dinner },
        specialNote: activeDayData.specialNote || ''
      });
      setIsEditing(false);
    }
  }, [selectedDay, menu]);

  const handleSave = async () => {
    if (!menu) return;
    const updatedMenu: WeeklyMessMenu = {
      ...menu,
      [selectedDay]: {
        day: selectedDay,
        breakfast: formState.breakfast,
        lunch: formState.lunch,
        snacks: formState.snacks,
        dinner: formState.dinner,
        specialNote: formState.specialNote
      }
    };

    await saveMessMenu(updatedMenu);
    setIsEditing(false);
    setFeedback(`Weekly schedule for ${selectedDay} successfully updated!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <AppLayout
      activeDomain="mess"
      breadcrumbs={[
        { label: 'Smart Mess Management', href: '/admin/mess' },
        { label: 'Weekly 7-Day Timetable' }
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
              <CalendarDays size={14} /> 7-Day Culinary Timetable
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Weekly Mess Menu Planner
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Configure and synchronize 7-day culinary cycles across all dining sessions.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--mess-accent)',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Edit2 size={16} /> Edit {selectedDay}'s Menu
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsEditing(false)}
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
              onClick={handleSave}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--mess-accent)',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Check size={16} /> Save Day Schedule
            </button>
          </div>
        )}
      </div>

      {/* Feedback Toast */}
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

      {/* Monday-Sunday Navigation Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '12px',
          padding: '8px',
          marginBottom: '28px',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        {DAYS.map(day => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              type="button"
              onClick={() => {
                if (!isEditing) setSelectedDay(day);
              }}
              style={{
                flex: '1 0 auto',
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: isEditing ? 'not-allowed' : 'pointer',
                background: isSelected ? 'var(--mess-accent)' : 'transparent',
                color: isSelected ? '#ffffff' : 'var(--neutral-dark)',
                fontWeight: 700,
                fontSize: '0.86rem',
                transition: 'all 0.15s ease'
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Day Menu Card Details / Editor */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '14px',
          padding: '28px',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
              {selectedDay} Culinary Schedule
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)' }}>
              {isEditing ? 'Editing active dishes and serving hours' : 'Published institutional timetable for residents'}
            </span>
          </div>

          {activeDayData?.specialNote && !isEditing && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'var(--brand-green-subtle)',
                color: '#065f46',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <Sparkles size={16} />
              <span>{activeDayData.specialNote}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Breakfast */}
          <div style={{ border: '1px solid var(--neutral-border)', borderRadius: '10px', padding: '18px', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Coffee size={18} color="var(--mess-accent)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Breakfast
              </h3>
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Timing e.g. 07:30 AM - 09:30 AM"
                  value={formState.breakfast.timing}
                  onChange={e =>
                    setFormState({
                      ...formState,
                      breakfast: { ...formState.breakfast, timing: e.target.value }
                    })
                  }
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--neutral-border)', fontSize: '0.82rem' }}
                />
                <textarea
                  rows={3}
                  value={formState.breakfast.items}
                  onChange={e =>
                    setFormState({
                      ...formState,
                      breakfast: { ...formState.breakfast, items: e.target.value }
                    })
                  }
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--neutral-border)', fontSize: '0.82rem', fontFamily: 'inherit' }}
                />
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)', marginBottom: '6px' }}>
                  {activeDayData?.breakfast.timing}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--neutral-dark)', lineHeight: 1.5 }}>
                  {activeDayData?.breakfast.items}
                </div>
              </div>
            )}
          </div>

          {/* Lunch */}
          <div style={{ border: '1px solid var(--neutral-border)', borderRadius: '10px', padding: '18px', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sun size={18} color="var(--mess-accent)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Lunch
              </h3>
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Timing e.g. 12:30 PM - 02:30 PM"
                  value={formState.lunch.timing}
                  onChange={e =>
                    setFormState({
                      ...formState,
                      lunch: { ...formState.lunch, timing: e.target.value }
                    })
                  }
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--neutral-border)', fontSize: '0.82rem' }}
                />
                <textarea
                  rows={3}
                  value={formState.lunch.items}
                  onChange={e =>
                    setFormState({
                      ...formState,
                      lunch: { ...formState.lunch, items: e.target.value }
                    })
                  }
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--neutral-border)', fontSize: '0.82rem', fontFamily: 'inherit' }}
                />
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)', marginBottom: '6px' }}>
                  {activeDayData?.lunch.timing}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--neutral-dark)', lineHeight: 1.5 }}>
                  {activeDayData?.lunch.items}
                </div>
              </div>
            )}
          </div>

          {/* Snacks */}
          <div style={{ border: '1px solid var(--neutral-border)', borderRadius: '10px', padding: '18px', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Cookie size={18} color="var(--mess-accent)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Snacks
              </h3>
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Timing e.g. 05:00 PM - 06:00 PM"
                  value={formState.snacks.timing}
                  onChange={e =>
                    setFormState({
                      ...formState,
                      snacks: { ...formState.snacks, timing: e.target.value }
                    })
                  }
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--neutral-border)', fontSize: '0.82rem' }}
                />
                <textarea
                  rows={3}
                  value={formState.snacks.items}
                  onChange={e =>
                    setFormState({
                      ...formState,
                      snacks: { ...formState.snacks, items: e.target.value }
                    })
                  }
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--neutral-border)', fontSize: '0.82rem', fontFamily: 'inherit' }}
                />
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)', marginBottom: '6px' }}>
                  {activeDayData?.snacks.timing}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--neutral-dark)', lineHeight: 1.5 }}>
                  {activeDayData?.snacks.items}
                </div>
              </div>
            )}
          </div>

          {/* Dinner */}
          <div style={{ border: '1px solid var(--neutral-border)', borderRadius: '10px', padding: '18px', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Moon size={18} color="var(--mess-accent)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Dinner
              </h3>
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Timing e.g. 07:30 PM - 09:30 PM"
                  value={formState.dinner.timing}
                  onChange={e =>
                    setFormState({
                      ...formState,
                      dinner: { ...formState.dinner, timing: e.target.value }
                    })
                  }
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--neutral-border)', fontSize: '0.82rem' }}
                />
                <textarea
                  rows={3}
                  value={formState.dinner.items}
                  onChange={e =>
                    setFormState({
                      ...formState,
                      dinner: { ...formState.dinner, items: e.target.value }
                    })
                  }
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--neutral-border)', fontSize: '0.82rem', fontFamily: 'inherit' }}
                />
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)', marginBottom: '6px' }}>
                  {activeDayData?.dinner.timing}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--neutral-dark)', lineHeight: 1.5 }}>
                  {activeDayData?.dinner.items}
                </div>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', marginBottom: '4px' }}>
              Chef Special Note / Festival Alert:
            </label>
            <input
              type="text"
              placeholder="e.g. Special Sweet: Hot Gulab Jamun served during dinner."
              value={formState.specialNote}
              onChange={e => setFormState({ ...formState, specialNote: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--neutral-border)', fontSize: '0.85rem' }}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};
