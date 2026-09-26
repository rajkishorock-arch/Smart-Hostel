import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { DayMenu, WeeklyMessMenu } from '../../types';
import { subscribeMessMenu } from '../../services/storageService';
import {
  UtensilsCrossed,
  Clock,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Sparkles,
  CalendarDays,
  ArrowRight
} from 'lucide-react';

export const ResidentMessTodayPage: React.FC = () => {
  const [menu, setMenu] = useState<WeeklyMessMenu | null>(null);
  const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

  useEffect(() => {
    const unsub = subscribeMessMenu(m => setMenu(m));
    return () => unsub();
  }, []);

  const todayMenu = menu ? menu[todayDayName] || menu['Monday'] : null;

  const meals = [
    {
      label: 'Breakfast',
      icon: Coffee,
      badge: 'Morning Nutrition',
      timing: todayMenu?.breakfast.timing || '07:30 AM - 09:30 AM',
      items: todayMenu?.breakfast.items || 'Paratha, Curd, Pickles, Sprouts & Masala Chai'
    },
    {
      label: 'Lunch',
      icon: Sun,
      badge: 'Main Afternoon Meal',
      timing: todayMenu?.lunch.timing || '12:30 PM - 02:30 PM',
      items: todayMenu?.lunch.items || 'Dal Makhani, Seasonal Sabzi, Steamed Rice, Phulka & Salad'
    },
    {
      label: 'Evening Snacks & Tea',
      icon: Cookie,
      badge: 'Cafeteria Window',
      timing: todayMenu?.snacks.timing || '05:00 PM - 06:00 PM',
      items: todayMenu?.snacks.items || 'Crispy Samosa with Mint Chutney & Ginger Tea/Coffee'
    },
    {
      label: 'Dinner',
      icon: Moon,
      badge: 'Chef Special Course',
      timing: todayMenu?.dinner.timing || '07:30 PM - 09:30 PM',
      items: todayMenu?.dinner.items || 'Shahi Paneer, Jeera Rice, Tawa Roti, Dal Tadka & Dessert'
    }
  ];

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[
        { label: 'Smart Mess', href: '/resident/mess/today' },
        { label: "Today's Dining Menu" }
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
              <UtensilsCrossed size={14} /> Mess Timetable
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Today's Menu: {todayDayName}
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Daily culinary dishes and serving times published by the Hostel Mess Committee.
          </p>
        </div>

        <Link
          to="/resident/mess/weekly"
          style={{
            padding: '9px 16px',
            borderRadius: '8px',
            background: 'var(--mess-accent)',
            color: '#ffffff',
            fontSize: '0.84rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <CalendarDays size={16} /> View 7-Day Timetable
        </Link>
      </div>

      {/* Chef Special Note */}
      {todayMenu?.specialNote && (
        <div
          style={{
            background: 'var(--brand-green-subtle)',
            border: '1px solid #a7f3d0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Sparkles size={20} color="var(--mess-accent)" />
          <div style={{ fontSize: '0.88rem', color: '#065f46', fontWeight: 600 }}>
            <strong>Chef Announcement for Today:</strong> {todayMenu.specialNote}
          </div>
        </div>
      )}

      {/* Meals Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        {meals.map(meal => {
          const Icon = meal.icon;
          return (
            <div
              key={meal.label}
              className="card-mess"
              style={{
                borderRadius: '14px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: 'var(--brand-green-subtle)',
                        color: 'var(--mess-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                        {meal.label}
                      </h3>
                      <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)' }}>
                        {meal.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    color: 'var(--mess-accent)',
                    fontWeight: 700,
                    marginBottom: '12px'
                  }}
                >
                  <Clock size={14} /> Serving: {meal.timing}
                </div>

                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  {meal.items}
                </p>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.74rem', color: 'var(--neutral-muted)' }}>
                Ground Floor Dining Hall • Self Service
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};
