import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  subscribeNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../../services/notificationService';
import { AppNotification } from '../../types';
import { Bell, CheckCheck, Clock, ShieldAlert, Sparkles, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationBell: React.FC = () => {
  const { user, isWarden } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const role = isWarden ? 'warden' : 'resident';
    const unsubscribe = subscribeNotifications({ uid: user.uid, role }, (list: AppNotification[]) => {
      setNotifications(list);
    });
    return () => unsubscribe();
  }, [user, isWarden]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = async (notif: AppNotification) => {
    if (!notif.read) {
      await markNotificationAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    const role = isWarden ? 'warden' : 'resident';
    await markAllNotificationsAsRead({ uid: user.uid, role });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
      case 'emergency':
        return <ShieldAlert size={16} color="#ef4444" />;
      case 'success':
        return <CheckCircle2 size={16} color="#10b981" />;
      case 'system':
      case 'maintenance':
        return <Sparkles size={16} color="#6366f1" />;
      default:
        return <Info size={16} color="#0284c7" />;
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          border: '1px solid var(--neutral-border)',
          background: isOpen ? '#f1f5f9' : '#ffffff',
          color: 'var(--neutral-dark)',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        aria-label="Notifications"
        title="Notification Center"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 800,
              minWidth: '18px',
              height: '18px',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '44px',
            right: 0,
            width: '340px',
            maxHeight: '440px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid var(--neutral-border)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--neutral-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--neutral-dark)' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: '#e0e7ff',
                    color: '#3730a3',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--brand-blue)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCheck size={14} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', maxHeight: '340px' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--neutral-muted)' }}>
                <Bell size={28} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>No notifications yet</div>
                <div style={{ fontSize: '0.72rem', marginTop: '2px' }}>Real-time updates will appear here.</div>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    background: n.read ? '#ffffff' : '#f8faff',
                    cursor: n.link ? 'pointer' : 'default',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: n.read ? '#f1f5f9' : '#e0e7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    {getIcon(n.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: n.read ? 600 : 700,
                          color: 'var(--neutral-dark)'
                        }}
                      >
                        {n.title}
                      </span>
                      {!n.read && (
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#3b82f6',
                            flexShrink: 0
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--neutral-muted)',
                        marginTop: '3px',
                        lineHeight: 1.35
                      }}
                    >
                      {n.message}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '6px',
                        fontSize: '0.68rem',
                        color: '#94a3b8'
                      }}
                    >
                      <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {n.link && (
                        <span style={{ color: 'var(--brand-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          View <ArrowRight size={10} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
