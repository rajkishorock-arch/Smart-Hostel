import { DayMenu, RoomRecord, Ticket, UserProfile, WeeklyMessMenu, UserRole, Announcement, MealScheduleItem } from '../types';
import { DEMO_USERS, INITIAL_MESS_MENU, INITIAL_ROOMS, INITIAL_TICKETS, INITIAL_ANNOUNCEMENTS, INITIAL_MEAL_SCHEDULE } from './mockData';
import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';

const KEYS = {
  USERS: 'sh_users_v1',
  CURRENT_USER: 'sh_current_user_v1',
  TICKETS: 'sh_tickets_v1',
  MESS_MENU: 'sh_mess_menu_v1',
  ROOMS: 'sh_rooms_v1',
  ANNOUNCEMENTS: 'sh_announcements_v1',
  SCHEDULE: 'sh_schedule_v1'
};

// Event triggers for local real-time reactivity
export const EVENT_TICKETS_CHANGED = 'sh_tickets_updated';
export const EVENT_MENU_CHANGED = 'sh_menu_updated';
export const EVENT_ROOMS_CHANGED = 'sh_rooms_updated';
export const EVENT_AUTH_CHANGED = 'sh_auth_updated';
export const EVENT_ANNOUNCEMENTS_CHANGED = 'sh_announcements_updated';
export const EVENT_SCHEDULE_CHANGED = 'sh_schedule_updated';

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

export function subscribeTickets(
  callback: (tickets: Ticket[]) => void,
  userFilter?: { role: UserRole; uid: string }
): () => void {
  // If Firebase configured, attempt real-time onSnapshot with role-appropriate query
  if (isFirebaseConfigured && db) {
    try {
      const ticketsRef = collection(db, 'tickets');
      // For residents, Firestore rules require filtering by residentId to prevent permission denied
      const q = (userFilter && userFilter.role === 'resident' && userFilter.uid)
        ? query(ticketsRef, where('residentId', '==', userFilter.uid))
        : ticketsRef;

      const unsubscribe = onSnapshot(q, snapshot => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as Ticket);
          // Sort descending by creation date
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          callback(list);
          localStorage.setItem(KEYS.TICKETS, JSON.stringify(list));
        } else {
          callback([]);
        }
      }, err => {
        console.warn('Firestore tickets snapshot error, falling back to local store:', err.message);
        const stored = getStoredTickets();
        if (userFilter && userFilter.role === 'resident' && userFilter.uid) {
          callback(stored.filter(t => t.residentId === userFilter.uid));
        } else {
          callback(stored);
        }
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

export async function allocateBed(
  roomId: string,
  bedNumber: string,
  resident: { uid: string; name: string; studentId?: string }
): Promise<boolean> {
  const rooms = getStoredRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false;

  // Release any existing bed for this resident
  rooms.forEach(rm => {
    rm.beds.forEach(b => {
      if (b.residentId === resident.uid) {
        delete b.residentId;
        delete b.residentName;
        delete b.studentId;
      }
    });
    rm.occupied = rm.beds.filter(b => !!b.residentId).length;
  });

  const bed = room.beds.find(b => b.bedNumber === bedNumber);
  if (!bed) return false;

  bed.residentId = resident.uid;
  bed.residentName = resident.name;
  bed.studentId = resident.studentId || `STD-${resident.uid.slice(0, 5)}`;
  room.occupied = room.beds.filter(b => !!b.residentId).length;

  await saveRooms(rooms);

  // Also update user profile room/bed
  const users = getStoredUsers();
  if (users[resident.uid]) {
    users[resident.uid].roomNumber = room.roomNumber;
    users[resident.uid].block = room.block;
    users[resident.uid].bedNumber = bedNumber;
    saveStoredUser(users[resident.uid]);
  }

  return true;
}

export async function releaseBed(roomId: string, bedNumber: string): Promise<boolean> {
  const rooms = getStoredRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false;

  const bed = room.beds.find(b => b.bedNumber === bedNumber);
  if (!bed) return false;

  const residentUid = bed.residentId;
  delete bed.residentId;
  delete bed.residentName;
  delete bed.studentId;
  room.occupied = room.beds.filter(b => !!b.residentId).length;

  await saveRooms(rooms);

  if (residentUid) {
    const users = getStoredUsers();
    if (users[residentUid]) {
      users[residentUid].roomNumber = 'Unassigned';
      users[residentUid].bedNumber = 'Unassigned';
      saveStoredUser(users[residentUid]);
    }
  }

  return true;
}

// ----------------- ANNOUNCEMENTS STORAGE -----------------

export function getStoredAnnouncements(): Announcement[] {
  try {
    const raw = localStorage.getItem(KEYS.ANNOUNCEMENTS);
    if (!raw) {
      localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
      return INITIAL_ANNOUNCEMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ANNOUNCEMENTS;
  }
}

export async function saveAnnouncement(ann: Announcement): Promise<Announcement> {
  const list = getStoredAnnouncements();
  const idx = list.findIndex(a => a.id === ann.id);
  if (idx >= 0) {
    list[idx] = { ...ann, updatedAt: new Date().toISOString() };
  } else {
    list.unshift(ann);
  }
  localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(list));
  triggerEvent(EVENT_ANNOUNCEMENTS_CHANGED);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'announcements', ann.id), ann);
    } catch (e) {
      console.warn('Firestore announcement sync error:', e);
    }
  }
  return ann;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const list = getStoredAnnouncements().filter(a => a.id !== id);
  localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(list));
  triggerEvent(EVENT_ANNOUNCEMENTS_CHANGED);
}

export function subscribeAnnouncements(
  callback: (list: Announcement[]) => void,
  publishedOnly: boolean = false
): () => void {
  const notify = () => {
    const all = getStoredAnnouncements();
    callback(publishedOnly ? all.filter(a => a.published) : all);
  };
  window.addEventListener(EVENT_ANNOUNCEMENTS_CHANGED, notify);
  notify();
  return () => window.removeEventListener(EVENT_ANNOUNCEMENTS_CHANGED, notify);
}

// ----------------- MEAL SCHEDULE STORAGE -----------------

export function getStoredMealSchedule(): MealScheduleItem[] {
  try {
    const raw = localStorage.getItem(KEYS.SCHEDULE);
    if (!raw) {
      localStorage.setItem(KEYS.SCHEDULE, JSON.stringify(INITIAL_MEAL_SCHEDULE));
      return INITIAL_MEAL_SCHEDULE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MEAL_SCHEDULE;
  }
}

export async function saveMealSchedule(schedule: MealScheduleItem[]): Promise<void> {
  localStorage.setItem(KEYS.SCHEDULE, JSON.stringify(schedule));
  triggerEvent(EVENT_SCHEDULE_CHANGED);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'mess_schedule', 'daily'), { schedule });
    } catch (e) {
      console.warn('Firestore meal schedule sync error:', e);
    }
  }
}

export function subscribeMealSchedule(callback: (list: MealScheduleItem[]) => void): () => void {
  const notify = () => callback(getStoredMealSchedule());
  window.addEventListener(EVENT_SCHEDULE_CHANGED, notify);
  notify();
  return () => window.removeEventListener(EVENT_SCHEDULE_CHANGED, notify);
}
