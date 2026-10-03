import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { DayMenu, WeeklyMessMenu, DigitalMealToken } from '../../types';
import {
  subscribeMessMenu,
  subscribeMealTokens,
  logActivity
} from '../../services/storageService';
import {
  UtensilsCrossed,
  Clock,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Sparkles,
  CalendarDays,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Star,
  Send,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ResidentMessTodayPage: React.FC = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState<WeeklyMessMenu | null>(null);
  const [tokens, setTokens] = useState<DigitalMealToken[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner'>('Lunch');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [dietaryPref, setDietaryPref] = useState<'Vegetarian' | 'High-Protein / Non-Veg' | 'Jain'>('Vegetarian');
  const [prefSaved, setPrefSaved] = useState(false);

  const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

  useEffect(() => {
    const unsubMenu = subscribeMessMenu(m => setMenu(m));
    const unsubTokens = subscribeMealTokens(all => {
      // Find tokens for this user, or fallback to Rahul Sharma demo tokens if user not yet assigned
      const myTokens = all.filter(
        t =>
          (user && (t.studentId === (user as any).studentId || t.studentName === user.name)) ||
          t.roomNumber === user?.roomNumber
      );
      if (myTokens.length > 0) {
        setTokens(myTokens);
      } else {
        // Fallback to all or first set so resident always has valid tokens to view
        setTokens(all.filter(t => t.roomNumber === '204' || t.studentName.includes('Rahul')));
      }
    });

    return () => {
      unsubMenu();
      unsubTokens();
    };
  }, [user]);

  const todayMenu = menu ? menu[todayDayName] || menu['Monday'] : null;

  const currentToken: DigitalMealToken =
    tokens.find(t => t.mealType === selectedMealType) ||
    tokens[0] || {
      id: 'TOK-FALLBACK',
      tokenCode: `MEAL-${selectedMealType.slice(0, 3).toUpperCase()}-${user?.roomNumber || '204'}-8831`,
      studentId: (user as any)?.studentId || 'STU-2024-001',
      studentName: user?.name || 'Rahul Sharma',
      roomNumber: user?.roomNumber || '204',
      hostel: 'Aravali Hall',
      calories: 650,
      date: new Date().toISOString().split('T')[0],
      mealType: selectedMealType,
      dietaryPreference: dietaryPref,
      status: 'Valid'
    };

  const meals = [
    {
      type: 'Breakfast' as const,
      label: 'Breakfast',
      icon: Coffee,
      timing: todayMenu?.breakfast.timing || '07:30 AM - 09:30 AM',
      items: todayMenu?.breakfast.items || 'Paratha, Curd, Pickles, Sprouts & Masala Chai',
      calories: '420 kcal • 14g Protein'
    },
    {
      type: 'Lunch' as const,
      label: 'Lunch',
      icon: Sun,
      timing: todayMenu?.lunch.timing || '12:30 PM - 02:30 PM',
      items: todayMenu?.lunch.items || 'Dal Makhani, Seasonal Sabzi, Steamed Rice, Phulka & Salad',
      calories: '680 kcal • 22g Protein'
    },
    {
      type: 'Snacks' as const,
      label: 'Evening Snacks',
      icon: Cookie,
      timing: todayMenu?.snacks.timing || '05:00 PM - 06:00 PM',
      items: todayMenu?.snacks.items || 'Crispy Samosa with Mint Chutney & Ginger Tea/Coffee',
      calories: '280 kcal • 6g Protein'
    },
    {
      type: 'Dinner' as const,
      label: 'Dinner',
      icon: Moon,
      timing: todayMenu?.dinner.timing || '07:30 PM - 09:30 PM',
      items: todayMenu?.dinner.items || 'Shahi Paneer, Jeera Rice, Tawa Roti, Dal Tadka & Dessert',
      calories: '610 kcal • 19g Protein'
    }
  ];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    logActivity({
      actor: user?.name || 'Rahul Sharma',
      actorRole: 'resident',
      action: `Submitted Mess Feedback (${feedbackRating} Stars)`,
      target: `${selectedMealType} Course: "${feedbackText.trim()}"`
    });

    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackText('');
    }, 4000);
  };

  const handleSaveDietaryPref = () => {
    setPrefSaved(true);
    logActivity({
      actor: user?.name || 'Resident',
      actorRole: 'resident',
      action: 'Updated Dietary Preference',
      target: dietaryPref
    });
    setTimeout(() => setPrefSaved(false), 3000);
  };

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[
        { label: 'Smart Mess', href: '/resident/mess/today' },
        { label: "Today's Dining & QR Pass" }
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
              <UtensilsCrossed size={14} /> Mess Timetable &amp; Token
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#0284c7',
                background: '#e0f2fe',
                padding: '3px 8px',
                borderRadius: '6px'
              }}
            >
              {todayDayName}
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Daily Dining Schedule &amp; Digital Meal Pass
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Present your cryptographic QR token at the dining turnstile to receive today's fresh meals.
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
            gap: '6px',
            textDecoration: 'none'
          }}
        >
          <CalendarDays size={16} /> View 7-Day Timetable
        </Link>
      </div>

      {/* Main Grid: Digital QR Pass + Meals Schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '24px', marginBottom: '32px', alignItems: 'start' }}>
        {/* Dynamic Digital Meal Pass Card */}
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.12)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background:
                currentToken.status === 'Consumed'
                  ? '#94a3b8'
                  : currentToken.status === 'Rebated'
                  ? '#f59e0b'
                  : 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', marginTop: '4px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ARAVALI HALL MESS PASS
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>
                {currentToken.mealType} Token
              </h2>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '9999px',
                background:
                  currentToken.status === 'Consumed'
                    ? '#f1f5f9'
                    : currentToken.status === 'Rebated'
                    ? '#fef3c7'
                    : '#dcfce7',
                color:
                  currentToken.status === 'Consumed'
                    ? '#475569'
                    : currentToken.status === 'Rebated'
                    ? '#b45309'
                    : '#15803d',
                border:
                  currentToken.status === 'Consumed'
                    ? '1px solid #cbd5e1'
                    : currentToken.status === 'Rebated'
                    ? '1px solid #fde68a'
                    : '1px solid #86efac'
              }}
            >
              {currentToken.status === 'Consumed'
                ? 'CONSUMED'
                : currentToken.status === 'Rebated'
                ? 'REBATED (ON LEAVE)'
                : 'VALID • READY FOR SCAN'}
            </span>
          </div>

          {/* Meal Type Quick Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', background: '#f8fafc', padding: '4px', borderRadius: '8px', marginBottom: '18px' }}>
            {(['Breakfast', 'Lunch', 'Snacks', 'Dinner'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedMealType(type)}
                style={{
                  border: 'none',
                  background: selectedMealType === type ? '#0f172a' : 'transparent',
                  color: selectedMealType === type ? '#ffffff' : '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '6px 2px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* QR Code Container */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
              opacity: currentToken.status === 'Consumed' ? 0.6 : 1
            }}
          >
            <div
              style={{
                background: '#ffffff',
                padding: '12px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                marginBottom: '10px'
              }}
            >
              <svg width="150" height="150" viewBox="0 0 100 100" style={{ display: 'block' }}>
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="10" y="10" width="24" height="24" fill="#0f172a" />
                <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
                <rect x="18" y="18" width="8" height="8" fill="#0f172a" />

                <rect x="66" y="10" width="24" height="24" fill="#0f172a" />
                <rect x="70" y="14" width="16" height="16" fill="#ffffff" />
                <rect x="74" y="18" width="8" height="8" fill="#0f172a" />

                <rect x="10" y="66" width="24" height="24" fill="#0f172a" />
                <rect x="14" y="70" width="16" height="16" fill="#ffffff" />
                <rect x="18" y="74" width="8" height="8" fill="#0f172a" />

                <rect x="42" y="12" width="6" height="12" fill="#0f172a" />
                <rect x="52" y="20" width="6" height="16" fill="#0f172a" />
                <rect x="38" y="42" width="14" height="14" fill="#0f172a" />
                <rect x="56" y="44" width="10" height="10" fill="#0f172a" />
                <rect x="42" y="66" width="8" height="20" fill="#0f172a" />
                <rect x="60" y="66" width="14" height="14" fill="#0f172a" />
                <rect x="78" y="52" width="12" height="6" fill="#0f172a" />
                <rect x="78" y="74" width="8" height="14" fill="#0f172a" />
              </svg>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
              {currentToken.tokenCode}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
              Cryptographic Token Hash • Scan at Turnstile
            </div>
          </div>

          {/* Token Metadata Details */}
          <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Resident:</span>
              <strong style={{ color: '#0f172a' }}>{user?.name || currentToken.studentName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Room &amp; Bed:</span>
              <strong style={{ color: '#0f172a' }}>Room {user?.roomNumber || currentToken.roomNumber} ({user?.bedNumber || 'Bed 1'})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Dietary Plan:</span>
              <strong style={{ color: '#0f172a' }}>{currentToken.dietaryPreference || dietaryPref}</strong>
            </div>
            {currentToken.consumedAt && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                <span>Scanned At:</span>
                <span>{new Date(currentToken.consumedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 4 Meals Schedule + Feedback */}
        <div>
          {/* Meals Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {meals.map(meal => {
              const Icon = meal.icon;
              const isSelected = selectedMealType === meal.type;
              return (
                <div
                  key={meal.type}
                  onClick={() => setSelectedMealType(meal.type)}
                  style={{
                    background: '#ffffff',
                    border: isSelected ? '2px solid var(--mess-accent)' : '1px solid var(--neutral-border)',
                    borderRadius: '14px',
                    padding: '20px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.12)' : 'var(--shadow-xs)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: isSelected ? 'var(--mess-accent)' : 'var(--brand-green-subtle)',
                          color: isSelected ? '#ffffff' : 'var(--mess-accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {meal.label}
                        </h3>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {meal.calories}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.78rem',
                      color: 'var(--mess-accent)',
                      fontWeight: 700,
                      marginBottom: '10px'
                    }}
                  >
                    <Clock size={13} /> {meal.timing}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                    {meal.items}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Dietary Preference & Quality Feedback Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Dietary Preference Selector */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--neutral-border)',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                Dietary Preference Selection
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
                Adjust meal preparation preference for the central kitchen:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {(['Vegetarian', 'High-Protein / Non-Veg', 'Jain'] as const).map(p => (
                  <label
                    key={p}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: dietaryPref === p ? '#ecfdf5' : '#f8fafc',
                      border: dietaryPref === p ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: dietaryPref === p ? 700 : 500,
                      color: dietaryPref === p ? '#065f46' : '#334155'
                    }}
                  >
                    <input
                      type="radio"
                      name="dietary"
                      checked={dietaryPref === p}
                      onChange={() => setDietaryPref(p)}
                      style={{ accentColor: '#10b981' }}
                    />
                    {p}
                  </label>
                ))}
              </div>

              <button
                onClick={handleSaveDietaryPref}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {prefSaved ? <Check size={14} /> : null}
                {prefSaved ? 'Saved to Kitchen Registry' : 'Save Preference'}
              </button>
            </div>

            {/* Daily Meal Rating & Feedback */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--neutral-border)',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                Rate Today's Food Quality
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '12px' }}>
                Direct telemetry sent to the Mess Warden Committee:
              </p>

              <form onSubmit={handleFeedbackSubmit}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                    >
                      <Star
                        size={22}
                        color={star <= feedbackRating ? '#f59e0b' : '#cbd5e1'}
                        fill={star <= feedbackRating ? '#f59e0b' : 'none'}
                      />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', alignSelf: 'center', marginLeft: '6px' }}>
                    {feedbackRating} / 5 Stars
                  </span>
                </div>

                <textarea
                  rows={2}
                  placeholder={`Feedback on today's ${selectedMealType} (e.g. food temperature, salt level)...`}
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    marginBottom: '10px',
                    fontFamily: 'inherit'
                  }}
                />

                <button
                  type="submit"
                  disabled={feedbackSubmitted || !feedbackText.trim()}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: feedbackSubmitted ? '#10b981' : 'var(--mess-accent)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: feedbackSubmitted || !feedbackText.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={14} />
                  {feedbackSubmitted ? 'Feedback Sent!' : 'Submit Rating'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
