import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendQueryToAssistant, ChatMessage } from '../../services/assistantService';
import {
  getStoredRooms,
  getStoredTickets,
  getStoredMessMenu,
  getStoredAnnouncements,
  getAllResidents,
  detectRepeatedIssues,
  getOperationalPriorities
} from '../../services/storageService';
import { getStoredNotifications } from '../../services/notificationService';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  RefreshCw,
  Minus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SmartHostelAIAssistant: React.FC = () => {
  const { user, isWarden, getIdToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested question chips based on role (Requirement 2)
  const suggestedQuestions = isWarden
    ? [
        "How many beds are available?",
        "Which rooms have vacancies?",
        "How many complaints are pending?",
        "How many critical complaints exist?",
        "Which maintenance category is highest?",
        "Which rooms have repeated complaints?",
        "Which residents are unallocated?",
        "What is today's mess?",
        "What needs attention right now?"
      ]
    : [
        "Which room am I in?",
        "Who are my roommates?",
        "What's today's mess?",
        "Show my pending complaints.",
        "What happened to my complaint?",
        "Are there any important notices?",
        "What should I do if my fan is sparking?"
      ];

  // Initialize initial greeting when opened or user loads
  useEffect(() => {
    if (messages.length === 0 && user) {
      const initialGreeting: ChatMessage = {
        id: 'welcome-0',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: isWarden
          ? `Welcome Warden ${user.name.split(' ')[0]}! I'm SmartHostel AI, your administrative campus co-pilot. I can provide real-time hostel occupancy rates, maintenance breakdowns by category, bed availability, and mess operations derived directly from live database records. How can I assist you today?`
          : `Hello ${user.name.split(' ')[0]}! I'm SmartHostel AI, your verified campus assistant. You can ask me about your live room assignment, roommates, today's or weekly mess menu, your maintenance tickets, or how to report a problem. How can I help you today?`
      };
      setMessages([initialGreeting]);
    }
  }, [user, isWarden, messages.length]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Assemble live snapshot from Firestore services for 100% factual accuracy
      const rooms = getStoredRooms();
      const tickets = getStoredTickets();
      const menu = getStoredMessMenu();
      const notices = getStoredAnnouncements();

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayName = dayNames[new Date().getDay()];
      const todayMenu = menu ? (menu[todayName] || menu['Monday'] || Object.values(menu)[0]) : undefined;

      let clientContext: Record<string, unknown> = {};

      if (isWarden) {
        const residents = getAllResidents();
        const totalRooms = rooms.length;
        const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
        const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupied, 0);
        const availableBeds = Math.max(0, totalBeds - occupiedBeds);
        const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
        const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'AI Classified').length;
        const inProgressTickets = tickets.filter(t => t.status === 'In Progress' || t.status === 'Assigned').length;
        const criticalTickets = tickets.filter(t => t.priority === 'Critical' || t.priority === 'Urgent').length;
        const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;

        const unallocatedList = residents
          .filter(r => r.role === 'resident' && (!r.roomNumber || r.roomNumber.trim() === ''))
          .map(r => ({ name: r.name, uid: r.uid }));

        const roomsWithVacancies = rooms
          .filter(r => r.occupied < r.capacity)
          .map(r => ({
            roomNumber: r.roomNumber,
            block: r.block,
            availableBeds: r.capacity - r.occupied,
            capacity: r.capacity
          }));

        // Category breakdown
        const catCounts: Record<string, number> = {};
        for (const t of tickets) {
          catCounts[t.category] = (catCounts[t.category] || 0) + 1;
        }
        let topCat = 'None';
        let topCatCount = 0;
        for (const [c, cnt] of Object.entries(catCounts)) {
          if (cnt > topCatCount) {
            topCat = c;
            topCatCount = cnt;
          }
        }

        const repIssues = detectRepeatedIssues(tickets);
        const opPriorities = getOperationalPriorities(tickets, residents, rooms);

        clientContext = {
          stats: {
            totalResidents: residents.length,
            totalRooms,
            totalBeds,
            occupiedBeds,
            availableBeds,
            occupancyRate,
            openTickets,
            inProgressTickets,
            criticalTickets,
            resolvedTickets,
            unallocatedCount: unallocatedList.length
          },
          vacantRooms: roomsWithVacancies,
          unallocatedResidents: unallocatedList,
          highestCategory: { category: topCat, count: topCatCount },
          repeatedIssues: repIssues.map(ri => ({
            room: ri.room,
            category: ri.category,
            count: ri.count,
            recentDates: ri.recentDates
          })),
          operationalPriorities: opPriorities.slice(0, 6).map(op => ({
            title: op.title,
            priority: op.priority,
            reason: op.reason
          })),
          tickets: tickets.slice(0, 10).map(t => ({
            id: t.id,
            title: t.title || t.description,
            category: t.category,
            priority: t.priority,
            status: t.status,
            room: t.roomNumber || t.room
          })),
          todayMenu,
          notices: notices.slice(0, 5).map(n => ({
            id: n.id,
            title: n.title,
            priority: n.priority,
            category: n.category
          }))
        };
      } else {
        const myRoom = rooms.find(r => r.roomNumber === user?.roomNumber);
        const roommates = myRoom
          ? myRoom.beds.filter(b => !!b.residentId && b.residentId !== user?.uid).map(b => ({ bed: b.bedNumber, name: b.residentName || 'Resident' }))
          : [];

        const myTickets = tickets.filter(t => t.residentId === user?.uid || (user?.roomNumber && (t.roomNumber === user.roomNumber || t.room === user.roomNumber)));

        const myNotifs = getStoredNotifications()
          .filter(n => n.userId === user?.uid || n.targetRole === 'all')
          .slice(0, 5)
          .map(n => ({ id: n.id, title: n.title, message: n.message, priority: n.priority }));

        clientContext = {
          room: {
            roomNumber: user?.roomNumber || '204',
            block: user?.block || 'Block A',
            bedNumber: user?.bedNumber || 'Bed 1',
            roommates
          },
          tickets: myTickets.map(t => ({
            id: t.id,
            title: t.title || t.description,
            category: t.category,
            priority: t.priority,
            status: t.status
          })),
          notifications: myNotifs,
          todayMenu,
          notices: notices.slice(0, 5).map(n => ({
            id: n.id,
            title: n.title,
            priority: n.priority,
            category: n.category
          }))
        };
      }

      const result = await sendQueryToAssistant(query, messages, getIdToken, clientContext);
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: result.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const fallbackMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'SmartHostel AI is temporarily unavailable. You can still use the Hostel, Smart Mess and Maintenance modules normally.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to render quick navigation links detected in response text
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} style={{ height: '4px' }} />;
          return (
            <p key={idx} style={{ margin: 0, lineHeight: 1.45, fontSize: '0.88rem' }}>
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ============================================================ */}
      {/* FLOATING ACTION BUTTON (BOTTOM-RIGHT)                        */}
      {/* ============================================================ */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open SmartHostel AI Assistant"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 990,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: '9999px',
            background: isWarden
              ? 'linear-gradient(135deg, var(--brand-purple) 0%, #4338ca 100%)'
              : 'linear-gradient(135deg, var(--brand-blue) 0%, #1e40af 100%)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 8px 24px rgba(30, 58, 138, 0.28), 0 2px 6px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            fontWeight: 700,
            fontSize: '0.92rem'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(30, 58, 138, 0.35)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 58, 138, 0.28)';
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <Sparkles size={16} />
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '1.5px solid #ffffff'
              }}
            />
          </div>
          <span>Ask SmartHostel AI</span>
        </button>
      )}

      {/* ============================================================ */}
      {/* CHAT PANEL MODAL                                             */}
      {/* ============================================================ */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="SmartHostel AI Chat Panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '400px',
            maxWidth: 'calc(100vw - 32px)',
            height: '560px',
            maxHeight: 'calc(100vh - 48px)',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 48px -8px rgba(15, 23, 42, 0.22), 0 4px 16px rgba(15, 23, 42, 0.08)',
            border: '1px solid var(--neutral-border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 999,
            animation: 'assistantSlideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: isWarden
                ? 'linear-gradient(135deg, #312e81 0%, #4338ca 100%)'
                : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.98rem', letterSpacing: '-0.01em' }}>
                    SmartHostel AI
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: 'rgba(16, 185, 129, 0.25)',
                      color: '#a7f3d0',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#34d399'
                      }}
                    />
                    Online
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: 'rgba(255, 255, 255, 0.82)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '1px'
                  }}
                >
                  {isWarden ? (
                    <>
                      <ShieldCheck size={12} /> Authority: {user?.name || 'Warden'}
                    </>
                  ) : (
                    <>
                      <GraduationCap size={12} /> Resident: {user?.name || 'Student'}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Minimize Chat Panel"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Notice Bar */}
          <div
            style={{
              padding: '6px 16px',
              background: '#f8fafc',
              borderBottom: '1px solid var(--neutral-border)',
              fontSize: '0.74rem',
              color: 'var(--neutral-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>🔒 Read-only security layer active</span>
            <span>{user?.hostel || 'Aravali Hostel'}</span>
          </div>

          {/* Messages Scroll Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#fbfcfd'
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '11px 15px',
                    borderRadius:
                      msg.sender === 'user'
                        ? '16px 16px 2px 16px'
                        : '16px 16px 16px 2px',
                    backgroundColor:
                      msg.sender === 'user'
                        ? isWarden
                          ? 'var(--brand-purple)'
                          : 'var(--brand-blue)'
                        : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : 'var(--neutral-dark)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--neutral-border)',
                    boxShadow:
                      msg.sender === 'user'
                        ? '0 2px 8px rgba(37, 99, 235, 0.2)'
                        : '0 1px 4px rgba(0, 0, 0, 0.04)',
                    wordBreak: 'break-word'
                  }}
                >
                  {renderMessageContent(msg.text)}
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--neutral-muted)',
                    marginTop: '3px',
                    padding: '0 4px'
                  }}
                >
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing / Loading indicator */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '16px 16px 16px 2px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--neutral-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand-blue)',
                      animation: 'assistantPulse 1s infinite alternate'
                    }}
                  />
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand-blue)',
                      animation: 'assistantPulse 1s infinite 0.2s alternate'
                    }}
                  />
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand-blue)',
                      animation: 'assistantPulse 1s infinite 0.4s alternate'
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)', marginLeft: '4px' }}>
                    Consulting SmartHostel records...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Question Chips */}
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none'
            }}
          >
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                style={{
                  fontSize: '0.74rem',
                  padding: '5px 11px',
                  borderRadius: '14px',
                  border: '1px solid var(--neutral-border)',
                  background: '#f8fafc',
                  color: 'var(--neutral-dark)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = isWarden ? '#f5f3ff' : '#eff6ff';
                    e.currentTarget.style.borderColor = isWarden ? '#c4b5fd' : '#bfdbfe';
                    e.currentTarget.style.color = isWarden ? 'var(--brand-purple)' : 'var(--brand-blue)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = 'var(--neutral-border)';
                  e.currentTarget.style.color = 'var(--neutral-dark)';
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--neutral-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isWarden ? 'Ask about occupancy, tickets, mess...' : 'Ask about your room, mess, tickets...'}
              maxLength={500}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--neutral-border)',
                outline: 'none',
                fontSize: '0.88rem',
                backgroundColor: '#ffffff',
                color: 'var(--neutral-dark)',
                boxSizing: 'border-box'
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = isWarden ? 'var(--brand-purple)' : 'var(--brand-blue)';
                e.currentTarget.style.boxShadow = isWarden
                  ? '0 0 0 3px rgba(109, 40, 217, 0.12)'
                  : '0 0 0 3px rgba(37, 99, 235, 0.12)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'var(--neutral-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              aria-label="Send Message"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: !inputText.trim() || isLoading
                  ? '#cbd5e1'
                  : isWarden
                  ? 'var(--brand-purple)'
                  : 'var(--brand-blue)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !inputText.trim() || isLoading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s ease',
                flexShrink: 0
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
