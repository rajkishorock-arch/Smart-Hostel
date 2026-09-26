import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { DayMenu, WeeklyMessMenu, MealScheduleItem, Announcement } from '../../types';
import {
  subscribeMessMenu,
  subscribeMealSchedule,
  subscribeAnnouncements
} from '../../services/storageService';
import {
  UtensilsCrossed,
  Clock,
  CalendarDays,
  Megaphone,
  Coffee,
  Sun,
  Cookie,
  Moon,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export const MessOverviewPage: React.FC = () => {
  const [menu, setMenu] = useState<WeeklyMessMenu | null>(null);
  const [schedule, setSchedule] = useState<MealScheduleItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

  useEffect(() => {
    const unsubMenu = subscribeMessMenu(m => setMenu(m));
    const unsubSchedule = subscribeMealSchedule(s => setSchedule(s));
    const unsubAnn = subscribeAnnouncements(a => setAnnouncements(a));

    return () => {
      unsubMenu();
      unsubSchedule();
      unsubAnn();
    };
  }, []);

  const todayMenu = menu ? menu[todayDayName] || menu['Monday'] : null;

  const currentMeal = schedule.find(s => s.status === 'Active') || schedule.find(s => s.status === 'Upcoming') || schedule[0];
  const publishedCount = announcements.filter(a => a.published).length;

  return (
    <AppLayout
      activeDomain="mess"
      breadcrumbs={[
        { label: 'Smart Mess Management', href: '/admin/mess' },
        { label: 'Mess Operations Overview' }
      ]}
    >
      {/* Header Banner */}
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
              <UtensilsCrossed size={14} /> Culinary & Dining Command
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Smart Mess & Dining Overview
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Supervise daily meal rosters, weekly dietary schedule, dining operating windows, and announcements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/admin/mess/today"
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid var(--neutral-border)',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: 'var(--neutral-dark)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Clock size={16} color="var(--mess-accent)" /> Today's Menu
          </Link>
          <Link
            to="/admin/mess/weekly"
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
            <CalendarDays size={16} /> Edit 7-Day Timetable
          </Link>
        </div>
      </div>

      {/* Overview Stat Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            Current Serving Session
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--mess-accent)', marginTop: '8px' }}>
            {currentMeal ? currentMeal.meal : 'Active'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            {currentMeal ? `${currentMeal.startTime} - ${currentMeal.endTime}` : 'Operational'}
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            Today's Day Cycle
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', marginTop: '8px' }}>
            {todayDayName}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            4 distinct nutrition meal slots
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            Weekly Menu Status
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', marginTop: '8px' }}>
            Synchronized
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            All 7 days published & active
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            Live Announcements
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', marginTop: '8px' }}>
            {publishedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            Active campus broadcasts
          </div>
        </div>
      </div>

      {/* Today's 4 Distinct Meal Cards */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
              Today's Meal Timetable ({todayDayName})
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)' }}>
              Curated dining courses provided to residents today
            </span>
          </div>
          <Link
            to="/admin/mess/today"
            style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--mess-accent)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Edit Today's Menu <ArrowRight size={14} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}
        >
          {/* Breakfast */}
          <div
            className="card-mess"
            style={{
              borderRadius: '12px',
              padding: '22px',
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
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--brand-green-subtle)',
                      color: 'var(--mess-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Coffee size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                      Breakfast
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)' }}>
                      {todayMenu?.breakfast.timing || '07:30 AM - 09:30 AM'}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                {todayMenu?.breakfast.items || 'Paratha, Curd, Pickles, Sprouts & Masala Chai'}
              </p>
            </div>
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
              Standard Morning Nutrition
            </div>
          </div>

          {/* Lunch */}
          <div
            className="card-mess"
            style={{
              borderRadius: '12px',
              padding: '22px',
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
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--brand-green-subtle)',
                      color: 'var(--mess-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Sun size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                      Lunch
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)' }}>
                      {todayMenu?.lunch.timing || '12:30 PM - 02:30 PM'}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                {todayMenu?.lunch.items || 'Dal Makhani, Seasonal Sabzi, Steamed Rice, Phulka & Salad'}
              </p>
            </div>
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
              Full Buffet Service
            </div>
          </div>

          {/* Snacks */}
          <div
            className="card-mess"
            style={{
              borderRadius: '12px',
              padding: '22px',
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
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--brand-green-subtle)',
                      color: 'var(--mess-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Cookie size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                      Snacks & Tea
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)' }}>
                      {todayMenu?.snacks.timing || '05:00 PM - 06:00 PM'}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                {todayMenu?.snacks.items || 'Crispy Samosa with Mint Chutney & Ginger Tea/Coffee'}
              </p>
            </div>
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
              Cafeteria Counter
            </div>
          </div>

          {/* Dinner */}
          <div
            className="card-mess"
            style={{
              borderRadius: '12px',
              padding: '22px',
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
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--brand-green-subtle)',
                      color: 'var(--mess-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Moon size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                      Dinner
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)' }}>
                      {todayMenu?.dinner.timing || '07:30 PM - 09:30 PM'}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                {todayMenu?.dinner.items || 'Shahi Paneer, Jeera Rice, Tawa Roti, Dal Tadka & Dessert'}
              </p>
            </div>
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
              Special Dessert Night
            </div>
          </div>
        </div>
      </div>

      {/* AI Dining Demand & Wastage Optimization Widget */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          borderRadius: '14px',
          padding: '20px 24px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} color="#a7f3d0" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                AI Mess Demand &amp; Food Wastage Intelligence
              </h3>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', color: '#a7f3d0' }}>
                Active Prediction
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.825rem', color: '#d1fae5' }}>
              Optimized meal preparation forecasting reduces weekly buffet wastage by up to 28% based on historical dining attendance.
            </p>
          </div>
        </div>

        <Link
          to="/admin/analytics/predictive"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            background: '#ffffff',
            color: '#065f46',
            fontSize: '0.8rem',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          <TrendingUp size={15} />
          <span>View Dining Forecasts</span>
        </Link>
      </div>

      {/* Quick Links Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}
      >
        <Link
          to="/admin/mess/schedule"
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--brand-green-subtle)',
                color: 'var(--mess-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--neutral-dark)' }}>
                Meal Schedule & Timings
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
                Configure daily dining hall hours
              </div>
            </div>
          </div>
          <ArrowRight size={16} color="#94a3b8" />
        </Link>

        <Link
          to="/admin/mess/announcements"
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--brand-green-subtle)',
                color: 'var(--mess-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Megaphone size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--neutral-dark)' }}>
                Mess Announcements Board
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
                Publish dining alerts & special events
              </div>
            </div>
          </div>
          <ArrowRight size={16} color="#94a3b8" />
        </Link>
      </div>
    </AppLayout>
  );
};
