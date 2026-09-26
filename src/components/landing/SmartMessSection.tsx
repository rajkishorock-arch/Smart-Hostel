import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Clock,
  Calendar,
  CheckCircle2,
  ChefHat,
  Coffee,
  Sun,
  Sunset,
  Moon,
  ArrowRight,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SmartMessSection: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Today');

  const todayMeals = [
    {
      meal: 'Breakfast',
      time: '7:30 AM – 9:00 AM',
      icon: <Coffee size={18} color="#059669" />,
      tag: 'Morning Nutrition',
      items: ['Idli & Crispy Vada', 'Fresh Coconut Chutney', 'Hot Sambar', 'Tea / Fresh Milk']
    },
    {
      meal: 'Lunch',
      time: '12:30 PM – 2:00 PM',
      icon: <Sun size={18} color="#059669" />,
      tag: 'Hearty Meal',
      items: ['Shahi Paneer / Chicken Curry', 'Dal Tadka & Steamed Rice', 'Tandoori Roti', 'Green Salad & Boondi Raita']
    },
    {
      meal: 'Snacks (High Tea)',
      time: '4:30 PM – 5:30 PM',
      icon: <Sunset size={18} color="#059669" />,
      tag: 'Evening Refreshment',
      items: ['Vegetable Pakora / Samosa', 'Mint & Tamarind Chutney', 'Cardamom Masala Tea', 'Biscuits']
    },
    {
      meal: 'Dinner',
      time: '7:30 PM – 9:30 PM',
      icon: <Moon size={18} color="#059669" />,
      tag: 'Nutritious Supper',
      items: ['Aloo Gobi Matar', 'Yellow Dal Fry', 'Hot Phulkas & Steamed Rice', 'Gulab Jamun (Sweet)']
    }
  ];

  const weeklySchedule = [
    { day: 'Mon', bf: 'Poha & Jalebi', lunch: 'Rajma Chawal & Roti', snk: 'Veg Sandwich & Tea', din: 'Mix Veg & Dal Tadka' },
    { day: 'Tue', bf: 'Masala Dosa & Sambar', lunch: 'Chole Bhature & Salad', snk: 'Bhel Puri & Coffee', din: 'Paneer Bhurji & Roti' },
    { day: 'Wed', bf: 'Aloo Paratha & Curd', lunch: 'Kadhi Pakora & Jeera Rice', snk: 'Bread Pakora & Tea', din: 'Egg Curry / Dal Makhani' },
    { day: 'Thu', bf: 'Upma & Chutney', lunch: 'Veg Biryani & Mirchi Salan', snk: 'Corn Chaat & Lemonade', din: 'Kadhai Paneer & Naan' },
    { day: 'Fri', bf: 'Idli Vada & Sambar', lunch: 'Shahi Paneer & Rice', snk: 'Samosa & Tea', din: 'Aloo Matar & Phulka' },
    { day: 'Sat', bf: 'Puri Sabzi & Halwa', lunch: 'Dal Fry & Veg Pulao', snk: 'Biscuits & Tea', din: 'Special Feast Dinner' },
    { day: 'Sun', bf: 'Club Sandwiches & Milk', lunch: 'Special Sunday Thali', snk: 'Puff Pastry & Cold Coffee', din: 'Light Khichdi & Curd' }
  ];

  return (
    <section id="mess" style={{ padding: '80px 0', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px'
            }}
          >
            <UtensilsCrossed size={14} />
            <span>Smart Mess Management</span>
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '16px'
            }}
          >
            Manage What Residents Eat
          </h2>

          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6 }}>
            No more uncertainty about what is being cooked or dining timings. Smart Mess offers a transparent,
            dynamic 7-day culinary timetable managed directly by the Warden and visible to all residents in real time.
          </p>
        </div>

        {/* Today's 4-Meal Cards Grid */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChefHat size={20} color="#059669" />
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Today&apos;s Active Dining Schedule
              </h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Standard Central Mess • Continuous Hygiene Verified
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px'
            }}
          >
            {todayMeals.map((meal, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.2s ease, transform 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#ecfdf5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {meal.icon}
                    </div>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                      {meal.meal}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: '#f1f5f9',
                      color: '#475569'
                    }}
                  >
                    {meal.tag}
                  </span>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.78rem',
                    color: '#059669',
                    fontWeight: 700,
                    marginBottom: '14px',
                    background: '#ecfdf5',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    width: 'fit-content'
                  }}
                >
                  <Clock size={13} />
                  <span>{meal.time}</span>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', flexGrow: 1 }}>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.86rem', color: '#334155', lineHeight: 1.6 }}>
                    {meal.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Timetable & Warden Controls Preview */}
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669'
                }}
              >
                <Calendar size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  7-Day Rotating Weekly Menu
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Managed by Warden &amp; Mess Committee • Real-Time Sync
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.78rem',
                  color: '#475569',
                  fontWeight: 600
                }}
              >
                <Info size={14} color="#059669" />
                <span>Special Diet &amp; Allergy Friendly Options Available</span>
              </div>
            </div>
          </div>

          {/* Desktop/Tablet Weekly Table with responsive horizontal container */}
          <div style={{ overflowX: 'auto', marginBottom: '20px', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', color: '#0f172a', fontWeight: 700, width: '70px' }}>Day</th>
                  <th style={{ padding: '10px 14px', color: '#0f172a', fontWeight: 700 }}>Breakfast</th>
                  <th style={{ padding: '10px 14px', color: '#0f172a', fontWeight: 700 }}>Lunch</th>
                  <th style={{ padding: '10px 14px', color: '#0f172a', fontWeight: 700 }}>Snacks</th>
                  <th style={{ padding: '10px 14px', color: '#0f172a', fontWeight: 700 }}>Dinner</th>
                </tr>
              </thead>
              <tbody>
                {weeklySchedule.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: row.day === 'Fri' ? '#f0fdf4' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: row.day === 'Fri' ? '#065f46' : '#0f172a' }}>
                      {row.day} {row.day === 'Fri' && <span style={{ fontSize: '0.7rem', color: '#059669' }}>• Today</span>}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{row.bf}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{row.lunch}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{row.snk}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{row.din}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
              Wardens can update any meal item directly from their operations console.
            </span>
            <Link
              to="/login"
              className="btn btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.825rem',
                padding: '6px 16px',
                borderColor: '#a7f3d0',
                color: '#065f46'
              }}
            >
              <span>Explore Mess Portal</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
