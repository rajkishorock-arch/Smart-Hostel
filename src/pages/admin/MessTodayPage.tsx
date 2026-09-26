import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { DayMenu, WeeklyMessMenu } from '../../types';
import { subscribeMessMenu, saveMessMenu } from '../../services/storageService';
import {
  Clock,
  UtensilsCrossed,
  Edit2,
  Check,
  X,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const MessTodayPage: React.FC = () => {
  const [menu, setMenu] = useState<WeeklyMessMenu | null>(null);
  const [editingMeal, setEditingMeal] = useState<'breakfast' | 'lunch' | 'snacks' | 'dinner' | null>(null);
  const [editItems, setEditItems] = useState('');
  const [editTiming, setEditTiming] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

  useEffect(() => {
    const unsub = subscribeMessMenu(m => setMenu(m));
    return () => unsub();
  }, []);

  const todayMenu = menu ? menu[todayDayName] || menu['Monday'] : null;

  const startEdit = (mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner') => {
    if (!todayMenu) return;
    setEditingMeal(mealType);
    setEditItems(todayMenu[mealType].items);
    setEditTiming(todayMenu[mealType].timing);
  };

  const saveEdit = async () => {
    if (!menu || !editingMeal) return;
    const updatedDay: DayMenu = {
      ...todayMenu!,
      day: todayDayName,
      [editingMeal]: {
        items: editItems,
        timing: editTiming
      }
    };

    const newMenu: WeeklyMessMenu = {
      ...menu,
      [todayDayName]: updatedDay
    };

    await saveMessMenu(newMenu);
    setEditingMeal(null);
    setFeedback(`Today's ${editingMeal.toUpperCase()} menu updated successfully!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const meals = [
    {
      key: 'breakfast' as const,
      label: 'Breakfast',
      icon: Coffee,
      badge: 'Morning Nutrition',
      data: todayMenu?.breakfast
    },
    {
      key: 'lunch' as const,
      label: 'Lunch',
      icon: Sun,
      badge: 'Full Buffet Service',
      data: todayMenu?.lunch
    },
    {
      key: 'snacks' as const,
      label: 'Snacks & Evening Refreshment',
      icon: Cookie,
      badge: 'Cafeteria Slot',
      data: todayMenu?.snacks
    },
    {
      key: 'dinner' as const,
      label: 'Dinner',
      icon: Moon,
      badge: 'Chef Special Course',
      data: todayMenu?.dinner
    }
  ];

  return (
    <AppLayout
      activeDomain="mess"
      breadcrumbs={[
        { label: 'Smart Mess Management', href: '/admin/mess' },
        { label: "Today's Daily Menu" }
      ]}
    >
      {/* Banner */}
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
              <Clock size={14} /> Daily Menu Editor
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Today's Menu: {todayDayName}
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Warden administrative console to edit daily dishes, dietary items, and dining hall serving windows.
          </p>
        </div>
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

      {/* Special Note Box */}
      {todayMenu?.specialNote && (
        <div
          style={{
            background: 'var(--brand-green-subtle)',
            border: '1px solid #a7f3d0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Sparkles size={20} color="var(--mess-accent)" />
          <div style={{ fontSize: '0.88rem', color: '#065f46', fontWeight: 600 }}>
            <strong>Chef Note for {todayDayName}:</strong> {todayMenu.specialNote}
          </div>
        </div>
      )}

      {/* Meals Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {meals.map(meal => {
          const Icon = meal.icon;
          const isEditing = editingMeal === meal.key;

          return (
            <div
              key={meal.key}
              style={{
                background: '#ffffff',
                border: isEditing ? '2px solid var(--mess-accent)' : '1px solid var(--neutral-border)',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'var(--brand-green-subtle)',
                      color: 'var(--mess-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                      {meal.label}
                    </h2>
                    <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
                      {meal.badge} • Serving: <strong>{meal.data?.timing || 'Standard window'}</strong>
                    </span>
                  </div>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => startEdit(meal.key)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--neutral-border)',
                      background: '#f8fafc',
                      color: 'var(--mess-accent)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Edit2 size={14} /> Edit Course
                  </button>
                )}
              </div>

              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', marginBottom: '4px' }}>
                      Serving Timings:
                    </label>
                    <input
                      type="text"
                      value={editTiming}
                      onChange={e => setEditTiming(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--neutral-border)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', marginBottom: '4px' }}>
                      Menu Items (comma-separated):
                    </label>
                    <textarea
                      rows={3}
                      value={editItems}
                      onChange={e => setEditItems(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--neutral-border)',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setEditingMeal(null)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--neutral-border)',
                        background: '#ffffff',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--mess-accent)',
                        color: '#ffffff',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Check size={16} /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid var(--neutral-border)',
                    fontSize: '0.92rem',
                    color: '#334155',
                    lineHeight: 1.6
                  }}
                >
                  {meal.data?.items || 'No items configured for this meal.'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};
