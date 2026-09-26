import React, { useState, useEffect } from 'react';
import { WeeklyMessMenu, DayMenu } from '../../types';
import { subscribeMessMenu } from '../../services/storageService';
import {
  UtensilsCrossed,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Clock,
  Sparkles,
  Calendar
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const MessMenuSection: React.FC = () => {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMessMenu>({});
  const [currentDayName, setCurrentDayName] = useState<string>('Monday');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [viewMode, setViewMode] = useState<'today' | 'weekly'>('today');

  useEffect(() => {
    // Get current day of the week
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    const adjustedDay = dayIndex === 0 ? 'Sunday' : DAYS[dayIndex - 1];
    setCurrentDayName(adjustedDay);
    setSelectedDay(adjustedDay);

    // Subscribe to real-time mess menu changes
    const unsubscribe = subscribeMessMenu(menu => {
      setWeeklyMenu(menu);
    });

    return () => unsubscribe();
  }, []);

  const activeDayData: DayMenu | undefined = weeklyMenu[selectedDay] || weeklyMenu[currentDayName];

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
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669'
            }}
          >
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Campus Mess &amp; Dining Timetable
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              Live nutritionist-approved hostel catering schedule
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => {
              setViewMode('today');
              setSelectedDay(currentDayName);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 700,
              background: viewMode === 'today' ? '#ffffff' : 'transparent',
              color: viewMode === 'today' ? '#059669' : '#64748b',
              boxShadow: viewMode === 'today' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Today ({currentDayName})
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 700,
              background: viewMode === 'weekly' ? '#ffffff' : 'transparent',
              color: viewMode === 'weekly' ? '#059669' : '#64748b',
              boxShadow: viewMode === 'weekly' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Full Week
          </button>
        </div>
      </div>

      {/* Week Day Tabs (Shown when in weekly view or can also be selected) */}
      {viewMode === 'weekly' && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '16px',
            scrollbarWidth: 'thin'
          }}
        >
          {DAYS.map(day => {
            const isToday = day === currentDayName;
            const isSelected = day === selectedDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  background: isSelected ? '#10b981' : isToday ? '#ecfdf5' : '#f8fafc',
                  color: isSelected ? '#ffffff' : isToday ? '#059669' : '#475569',
                  border: isSelected ? '1px solid #059669' : '1px solid #e2e8f0',
                  transition: 'all 0.15s ease'
                }}
              >
                {day} {isToday && '• Today'}
              </button>
            );
          })}
        </div>
      )}

      {/* Meals Grid for the selected day */}
      {activeDayData ? (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            {/* Breakfast */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '16px',
                borderLeft: '4px solid #f59e0b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Coffee size={18} />
                  <span>Breakfast</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#64748b' }}>
                  <Clock size={12} />
                  <span>{activeDayData.breakfast.timing}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                {activeDayData.breakfast.items}
              </p>
            </div>

            {/* Lunch */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '16px',
                borderLeft: '4px solid #0284c7'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Sun size={18} />
                  <span>Lunch</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#64748b' }}>
                  <Clock size={12} />
                  <span>{activeDayData.lunch.timing}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                {activeDayData.lunch.items}
              </p>
            </div>

            {/* Snacks */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '16px',
                borderLeft: '4px solid #8b5cf6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6d28d9', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Cookie size={18} />
                  <span>Evening Snacks</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#64748b' }}>
                  <Clock size={12} />
                  <span>{activeDayData.snacks.timing}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                {activeDayData.snacks.items}
              </p>
            </div>

            {/* Dinner */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '16px',
                borderLeft: '4px solid #10b981'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Moon size={18} />
                  <span>Dinner</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#64748b' }}>
                  <Clock size={12} />
                  <span>{activeDayData.dinner.timing}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                {activeDayData.dinner.items}
              </p>
            </div>
          </div>

          {/* Special note pill */}
          {activeDayData.specialNote && (
            <div
              style={{
                marginTop: '16px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.825rem',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} />
              <span>
                <strong>Hostel Chef's Note:</strong> {activeDayData.specialNote}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
          Loading live mess menu...
        </div>
      )}
    </div>
  );
};
