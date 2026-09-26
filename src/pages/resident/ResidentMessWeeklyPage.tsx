import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { DayMenu, WeeklyMessMenu } from '../../types';
import { subscribeMessMenu } from '../../services/storageService';
import {
  CalendarDays,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Sparkles,
  Clock
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ResidentMessWeeklyPage: React.FC = () => {
  const [menu, setMenu] = useState<WeeklyMessMenu | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  useEffect(() => {
    const unsub = subscribeMessMenu(m => setMenu(m));
    return () => unsub();
  }, []);

  const activeDayData = menu ? menu[selectedDay] : null;

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[
        { label: 'Smart Mess', href: '/resident/mess/today' },
        { label: 'Weekly Timetable' }
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
              <CalendarDays size={14} /> 7-Day Timetable
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Weekly Mess Menu (Monday - Sunday)
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Complete 7-day culinary timetable for breakfast, lunch, snacks, and dinner.
          </p>
        </div>
      </div>

      {/* Day Selector Tabs */}
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
              onClick={() => setSelectedDay(day)}
              style={{
                flex: '1 0 auto',
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
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

      {/* Day Courses Details */}
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
              {selectedDay} Culinary Offerings
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)' }}>
              Standard diet timetable prepared under campus guidelines
            </span>
          </div>

          {activeDayData?.specialNote && (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Coffee size={18} color="var(--mess-accent)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Breakfast
              </h3>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)', marginBottom: '8px' }}>
              {activeDayData?.breakfast.timing}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
              {activeDayData?.breakfast.items}
            </div>
          </div>

          {/* Lunch */}
          <div style={{ border: '1px solid var(--neutral-border)', borderRadius: '10px', padding: '18px', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sun size={18} color="var(--mess-accent)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Lunch
              </h3>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)', marginBottom: '8px' }}>
              {activeDayData?.lunch.timing}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
              {activeDayData?.lunch.items}
            </div>
          </div>

          {/* Snacks */}
          <div style={{ border: '1px solid var(--neutral-border)', borderRadius: '10px', padding: '18px', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Cookie size={18} color="var(--mess-accent)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Snacks & Tea
              </h3>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)', marginBottom: '8px' }}>
              {activeDayData?.snacks.timing}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
              {activeDayData?.snacks.items}
            </div>
          </div>

          {/* Dinner */}
          <div style={{ border: '1px solid var(--neutral-border)', borderRadius: '10px', padding: '18px', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Moon size={18} color="var(--mess-accent)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Dinner
              </h3>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)', marginBottom: '8px' }}>
              {activeDayData?.dinner.timing}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
              {activeDayData?.dinner.items}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
