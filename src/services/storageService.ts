import { DayMenu, RoomRecord, Ticket, UserProfile, WeeklyMessMenu } from '../types';
import { DEMO_USERS, INITIAL_MESS_MENU, INITIAL_ROOMS, INITIAL_TICKETS } from './mockData';
import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';

const KEYS = {
  USERS: 'sh_users_v1',
  CURRENT_USER: 'sh_current_user_v1',
  TICKETS: 'sh_tickets_v1',
  MESS_MENU: 'sh_mess_menu_v1',
  ROOMS: 'sh_rooms_v1'
};

// Event triggers for local real-time reactivity
export const EVENT_TICKETS_CHANGED = 'sh_tickets_updated';
export const EVENT_MENU_CHANGED = 'sh_menu_updated';
export const EVENT_ROOMS_CHANGED = 'sh_rooms_updated';
export const EVENT_AUTH_CHANGED = 'sh_auth_updated';

function triggerEvent(eventName: string) {
  window.dispatchEvent(new Event(eventName));
}

// ----------------- USER STORAGE -----------------

export function getStoredUsers(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    if (!raw) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEMO_USERS;
  }
}

export function saveStoredUser(profile: UserProfile): void {
  const users = getStoredUsers();
  users[profile.uid] = profile;
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));

  // Sync to Firestore if configured
  if (isFirebaseConfigured && db) {
    setDoc(doc(db, 'users', profile.uid), profile).catch(err => {
      console.warn('Firestore user save fallback:', err);
    });
  }
}

export function getStoredCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredCurrentUser(user: UserProfile | null): void {
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
  triggerEvent(EVENT_AUTH_CHANGED);
}

// ----------------- TICKETS STORAGE -----------------

export function getStoredTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(KEYS.TICKETS);
    if (!raw) {
      localStorage.setItem(KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TICKETS;
  }
}

export async function saveTicket(ticket: Ticket): Promise<Ticket> {
  const tickets = getStoredTickets();
  const index = tickets.findIndex(t => t.id === ticket.id);

  if (index >= 0) {
    tickets[index] = { ...ticket, updatedAt: new Date().toISOString() };
  } else {
    tickets.unshift(ticket);
  }

  localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
  triggerEvent(EVENT_TICKETS_CHANGED);

  // Firestore sync
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'tickets', ticket.id), ticket);
    } catch (err) {
      console.warn('Firestore ticket sync error, local data active:', err);
    }
  }

  return ticket;
}

export async function updateTicketStatus(
  ticketId: string,
  newStatus: Ticket['status'],
  wardenNotes?: string
): Promise<Ticket | null> {
  const tickets = getStoredTickets();
  const ticket = tickets.find(t => t.id === ticketId);

  if (!ticket) return null;

  ticket.status = newStatus;
  ticket.updatedAt = new Date().toISOString();
  if (wardenNotes !== undefined) {
    ticket.wardenNotes = wardenNotes;
  }
  if (newStatus === 'Resolved') {
    ticket.resolvedAt = new Date().toISOString();
  }

  localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
  triggerEvent(EVENT_TICKETS_CHANGED);

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        status: newStatus,
        updatedAt: ticket.updatedAt,
        ...(wardenNotes !== undefined && { wardenNotes }),
        ...(newStatus === 'Resolved' && { resolvedAt: ticket.resolvedAt })
      });
    } catch (err) {
      console.warn('Firestore ticket status update error:', err);
    }
  }

  return ticket;
}

export function subscribeTickets(callback: (tickets: Ticket[]) => void): () => void {
  // If Firebase configured, attempt real-time onSnapshot
  if (isFirebaseConfigured && db) {
    try {
      const unsubscribe = onSnapshot(collection(db, 'tickets'), snapshot => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as Ticket);
          // Sort descending by creation date
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          callback(list);
          // Also mirror to local storage
          localStorage.setItem(KEYS.TICKETS, JSON.stringify(list));
        } else {
          callback(getStoredTickets());
        }
      }, err => {
        console.warn('Firestore snapshot error, relying on local reactive listener:', err);
        callback(getStoredTickets());
      });

      const handleLocal = () => callback(getStoredTickets());
      window.addEventListener(EVENT_TICKETS_CHANGED, handleLocal);

      return () => {
        unsubscribe();
        window.removeEventListener(EVENT_TICKETS_CHANGED, handleLocal);
      };
    } catch (e) {
      console.warn('Firestore subscription exception:', e);
    }
  }

  // Local reactive listener
  const handleLocal = () => callback(getStoredTickets());
  window.addEventListener(EVENT_TICKETS_CHANGED, handleLocal);
  // Send immediate initial value
  callback(getStoredTickets());

  return () => {
    window.removeEventListener(EVENT_TICKETS_CHANGED, handleLocal);
  };
}

// ----------------- MESS MENU STORAGE -----------------

export function getStoredMessMenu(): WeeklyMessMenu {
  try {
    const raw = localStorage.getItem(KEYS.MESS_MENU);
    if (!raw) {
      localStorage.setItem(KEYS.MESS_MENU, JSON.stringify(INITIAL_MESS_MENU));
      return INITIAL_MESS_MENU;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MESS_MENU;
  }
}

export async function saveMessMenu(menu: WeeklyMessMenu): Promise<void> {
  localStorage.setItem(KEYS.MESS_MENU, JSON.stringify(menu));
  triggerEvent(EVENT_MENU_CHANGED);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'mess_menu', 'weekly'), menu);
    } catch (err) {
      console.warn('Firestore mess menu sync error:', err);
    }
  }
}

export function subscribeMessMenu(callback: (menu: WeeklyMessMenu) => void): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const unsubscribe = onSnapshot(doc(db, 'mess_menu', 'weekly'), snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data() as WeeklyMessMenu;
          callback(data);
          localStorage.setItem(KEYS.MESS_MENU, JSON.stringify(data));
        } else {
          callback(getStoredMessMenu());
        }
      }, err => {
        console.warn('Firestore menu snapshot error, using local listener:', err);
        callback(getStoredMessMenu());
      });

      const handleLocal = () => callback(getStoredMessMenu());
      window.addEventListener(EVENT_MENU_CHANGED, handleLocal);

      return () => {
        unsubscribe();
        window.removeEventListener(EVENT_MENU_CHANGED, handleLocal);
      };
    } catch (e) {
      console.warn('Firestore menu subscription exception:', e);
    }
  }

  const handleLocal = () => callback(getStoredMessMenu());
  window.addEventListener(EVENT_MENU_CHANGED, handleLocal);
  callback(getStoredMessMenu());

  return () => {
    window.removeEventListener(EVENT_MENU_CHANGED, handleLocal);
  };
}

// ----------------- ROOM ALLOCATION STORAGE -----------------

export function getStoredRooms(): RoomRecord[] {
  try {
    const raw = localStorage.getItem(KEYS.ROOMS);
    if (!raw) {
      localStorage.setItem(KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
      return INITIAL_ROOMS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ROOMS;
  }
}

export async function saveRooms(rooms: RoomRecord[]): Promise<void> {
  localStorage.setItem(KEYS.ROOMS, JSON.stringify(rooms));
  triggerEvent(EVENT_ROOMS_CHANGED);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'rooms', 'all'), { rooms });
    } catch (err) {
      console.warn('Firestore room sync error:', err);
    }
  }
}

export function subscribeRooms(callback: (rooms: RoomRecord[]) => void): () => void {
  const handleLocal = () => callback(getStoredRooms());
  window.addEventListener(EVENT_ROOMS_CHANGED, handleLocal);
  callback(getStoredRooms());

  return () => {
    window.removeEventListener(EVENT_ROOMS_CHANGED, handleLocal);
  };
}
