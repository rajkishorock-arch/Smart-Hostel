import React, { useState, useEffect } from 'react';
import { WeeklyMessMenu, DayMenu } from '../../types';
import { getStoredMessMenu, saveMessMenu, subscribeMessMenu } from '../../services/storageService';
import {
  UtensilsCrossed,
  Save,
  CheckCircle,
  Clock,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Sparkles
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const MessMenuEditor: React.FC = () => {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMessMenu>(getStoredMessMenu());
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [currentMenu, setCurrentMenu] = useState<DayMenu>(
    weeklyMenu['Monday'] || {
      day: 'Monday',
      breakfast: { items: '', timing: '07:30 AM - 09:30 AM' },
      lunch: { items: '', timing: '12:30 PM - 02:30 PM' },
      snacks: { items: '', timing: '05:00 PM - 06:00 PM' },
      dinner: { items: '', timing: '07:30 PM - 09:30 PM' },
      specialNote: ''
    }
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeMessMenu(menu => {
      setWeeklyMenu(menu);
      if (menu[selectedDay]) {
        setCurrentMenu(menu[selectedDay]);
      }
    });

    return () => unsubscribe();
  }, [selectedDay]);

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    if (weeklyMenu[day]) {
      setCurrentMenu(weeklyMenu[day]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedWeekly: WeeklyMessMenu = {
        ...weeklyMenu,
        [selectedDay]: currentMenu
      };

      await saveMessMenu(updatedWeekly);
      setWeeklyMenu(updatedWeekly);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save mess menu:', err);
    } finally {
      setIsSaving(false);
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              4. Weekly Mess Menu Editor
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              Publish campus dining schedule with instant real-time synchronization to all resident portals
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div
            style={{
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle size={16} color="#10b981" />
            <span>Menu Published to Firestore &amp; Synced!</span>
          </div>
        )}
      </div>

      {/* Day Select Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '24px'
        }}
      >
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => handleDayChange(day)}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              background: selectedDay === day ? '#10b981' : '#f8fafc',
              color: selectedDay === day ? '#ffffff' : '#475569',
              border: selectedDay === day ? '1px solid #059669' : '1px solid #e2e8f0',
              transition: 'all 0.15s ease'
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Breakfast */}
          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontWeight: 700, fontSize: '0.95rem' }}>
                <Coffee size={18} />
                <span>Breakfast Menu</span>
              </div>
              <input
                type="text"
                className="form-input"
                style={{ width: '150px', padding: '6px 10px', fontSize: '0.775rem' }}
                value={currentMenu.breakfast.timing}
                onChange={e =>
                  setCurrentMenu({
                    ...currentMenu,
                    breakfast: { ...currentMenu.breakfast, timing: e.target.value }
                  })
                }
                placeholder="Timing"
              />
            </div>
            <textarea
              rows={3}
              className="form-textarea"
              value={currentMenu.breakfast.items}
              onChange={e =>
                setCurrentMenu({
                  ...currentMenu,
                  breakfast: { ...currentMenu.breakfast, items: e.target.value }
                })
              }
              placeholder="e.g. Idli, Medu Vada, Coconut Chutney, Sambhar & Filter Coffee"
            />
          </div>

          {/* Lunch */}
          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontWeight: 700, fontSize: '0.95rem' }}>
                <Sun size={18} />
                <span>Lunch Menu</span>
              </div>
              <input
                type="text"
                className="form-input"
                style={{ width: '150px', padding: '6px 10px', fontSize: '0.775rem' }}
                value={currentMenu.lunch.timing}
                onChange={e =>
                  setCurrentMenu({
                    ...currentMenu,
                    lunch: { ...currentMenu.lunch, timing: e.target.value }
                  })
                }
                placeholder="Timing"
              />
            </div>
            <textarea
              rows={3}
              className="form-textarea"
              value={currentMenu.lunch.items}
              onChange={e =>
                setCurrentMenu({
                  ...currentMenu,
                  lunch: { ...currentMenu.lunch, items: e.target.value }
                })
              }
              placeholder="e.g. Rajma Rasila, Boondi Raita, Basmati Rice, Chapati & Mixed Salad"
            />
          </div>

          {/* Snacks */}
          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6d28d9', fontWeight: 700, fontSize: '0.95rem' }}>
                <Cookie size={18} />
                <span>Evening Snacks</span>
              </div>
              <input
                type="text"
                className="form-input"
                style={{ width: '150px', padding: '6px 10px', fontSize: '0.775rem' }}
                value={currentMenu.snacks.timing}
                onChange={e =>
                  setCurrentMenu({
                    ...currentMenu,
                    snacks: { ...currentMenu.snacks, timing: e.target.value }
                  })
                }
                placeholder="Timing"
              />
            </div>
            <textarea
              rows={3}
              className="form-textarea"
              value={currentMenu.snacks.items}
              onChange={e =>
                setCurrentMenu({
                  ...currentMenu,
                  snacks: { ...currentMenu.snacks, items: e.target.value }
                })
              }
              placeholder="e.g. Veg Samosa with Mint Chutney & Ginger Tea"
            />
          </div>

          {/* Dinner */}
          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontWeight: 700, fontSize: '0.95rem' }}>
                <Moon size={18} />
                <span>Dinner Menu</span>
              </div>
              <input
                type="text"
                className="form-input"
                style={{ width: '150px', padding: '6px 10px', fontSize: '0.775rem' }}
                value={currentMenu.dinner.timing}
                onChange={e =>
                  setCurrentMenu({
                    ...currentMenu,
                    dinner: { ...currentMenu.dinner, timing: e.target.value }
                  })
                }
                placeholder="Timing"
              />
            </div>
            <textarea
              rows={3}
              className="form-textarea"
              value={currentMenu.dinner.items}
              onChange={e =>
                setCurrentMenu({
                  ...currentMenu,
                  dinner: { ...currentMenu.dinner, items: e.target.value }
                })
              }
              placeholder="e.g. Shahi Paneer, Jeera Rice, Tawa Roti, Dal Tadka & Gulab Jamun"
            />
          </div>
        </div>

        {/* Special Chef Note */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#10b981" />
            <span>Special Diet / Chef Notice (Optional)</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={currentMenu.specialNote || ''}
            onChange={e => setCurrentMenu({ ...currentMenu, specialNote: e.target.value })}
            placeholder="e.g. Special Feast Night with choice of dessert: Hot Gulab Jamun."
          />
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary"
            style={{ minWidth: '220px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <Save size={18} />
            <span>{isSaving ? 'Publishing...' : `Save & Broadcast ${selectedDay} Menu`}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
