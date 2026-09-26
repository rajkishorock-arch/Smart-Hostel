import {
  DayMenu,
  RoomRecord,
  Ticket,
  UserProfile,
  WeeklyMessMenu,
  UserRole,
  Announcement,
  MealScheduleItem,
  TicketStatus
} from '../types';
import {
  DEMO_USERS,
  INITIAL_MESS_MENU,
  INITIAL_ROOMS,
  INITIAL_TICKETS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MEAL_SCHEDULE
} from './mockData';
import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { createNotification } from './notificationService';
import { logActivity } from './activityService';

const KEYS = {
  USERS: 'sh_users_v1',
  CURRENT_USER: 'sh_current_user_v1',
  TICKETS: 'sh_tickets_v1',
  MESS_MENU: 'sh_mess_menu_v1',
  ROOMS: 'sh_rooms_v1',
  ANNOUNCEMENTS: 'sh_announcements_v1',
  SCHEDULE: 'sh_schedule_v1',
  INITIALIZED: 'sh_initialized_v2'
};

// Event triggers for local reactivity & cross-tab sync
export const EVENT_TICKETS_CHANGED = 'sh_tickets_updated';
export const EVENT_MENU_CHANGED = 'sh_menu_updated';
export const EVENT_ROOMS_CHANGED = 'sh_rooms_updated';
export const EVENT_AUTH_CHANGED = 'sh_auth_updated';
export const EVENT_ANNOUNCEMENTS_CHANGED = 'sh_announcements_updated';
export const EVENT_SCHEDULE_CHANGED = 'sh_schedule_updated';
export const EVENT_RESIDENTS_CHANGED = 'sh_residents_updated';

function triggerEvent(eventName: string) {
  window.dispatchEvent(new Event(eventName));
}

// ----------------- FIRESTORE AUTO-SEEDING / INITIALIZATION -----------------

let isInitialized = false;

export async function ensureFirestoreSeeded(): Promise<void> {
  if (isInitialized || !isFirebaseConfigured || !db) return;
  isInitialized = true;

  try {
    // Check if rooms collection exists
    const roomsSnap = await getDocs(collection(db, 'rooms')).catch(() => null);
    if (!roomsSnap || roomsSnap.empty) {
      for (const r of INITIAL_ROOMS) {
        await setDoc(doc(db, 'rooms', r.id), r).catch(() => {});
      }
    }

    // Check mess menu
    const menuSnap = await getDoc(doc(db, 'mess_menu', 'weekly')).catch(() => null);
    if (!menuSnap || !menuSnap.exists()) {
      await setDoc(doc(db, 'mess_menu', 'weekly'), INITIAL_MESS_MENU).catch(() => {});
    }

    // Check announcements
    const annSnap = await getDocs(collection(db, 'announcements')).catch(() => null);
    if (!annSnap || annSnap.empty) {
      for (const a of INITIAL_ANNOUNCEMENTS) {
        await setDoc(doc(db, 'announcements', a.id), a).catch(() => {});
      }
    }

    // Check tickets
    const tktSnap = await getDocs(collection(db, 'tickets')).catch(() => null);
    if (!tktSnap || tktSnap.empty) {
      for (const t of INITIAL_TICKETS) {
        await setDoc(doc(db, 'tickets', t.id), {
          ...t,
          timeline: [
            {
              status: t.status,
              timestamp: t.createdAt,
              note: 'Initial ticket registration'
            }
          ]
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.warn('Firestore seeding check exception:', err);
  }
}

// Trigger initial seed non-blockingly
if (typeof window !== 'undefined') {
  setTimeout(() => ensureFirestoreSeeded(), 1000);
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
  triggerEvent(EVENT_RESIDENTS_CHANGED);

  if (isFirebaseConfigured && db) {
    setDoc(doc(db, 'users', profile.uid), profile, { merge: true }).catch(err => {
      console.warn('Firestore user save fallback:', err);
    });
  }
}

export function getAllResidents(): UserProfile[] {
  const users = getStoredUsers();
  return Object.values(users).filter(u => u.role === 'resident');
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

export function subscribeResidents(callback: (residents: UserProfile[]) => void): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const usersRef = collection(db, 'users');
      const unsubscribe = onSnapshot(
        usersRef,
        snapshot => {
          if (!snapshot.empty) {
            const list: UserProfile[] = snapshot.docs.map(d => d.data() as UserProfile);
            const residentList = list.filter(u => u.role === 'resident');
            callback(residentList);

            // Update local cache
            const users = getStoredUsers();
            list.forEach(u => { users[u.uid] = u; });
            localStorage.setItem(KEYS.USERS, JSON.stringify(users));
          } else {
            callback(Object.values(getStoredUsers()).filter(u => u.role === 'resident'));
          }
        },
        err => {
          console.warn('Firestore residents subscription error:', err.message);
          callback(Object.values(getStoredUsers()).filter(u => u.role === 'resident'));
        }
      );

      const handleLocal = () =>
        callback(Object.values(getStoredUsers()).filter(u => u.role === 'resident'));
      window.addEventListener(EVENT_RESIDENTS_CHANGED, handleLocal);

      return () => {
        unsubscribe();
        window.removeEventListener(EVENT_RESIDENTS_CHANGED, handleLocal);
      };
    } catch (e) {
      console.warn('Residents subscription exception:', e);
    }
  }

  const handleLocal = () =>
    callback(Object.values(getStoredUsers()).filter(u => u.role === 'resident'));
  window.addEventListener(EVENT_RESIDENTS_CHANGED, handleLocal);
  handleLocal();

  return () => {
    window.removeEventListener(EVENT_RESIDENTS_CHANGED, handleLocal);
  };
}

// ----------------- TICKETS STORAGE & LIFECYCLE -----------------

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

export async function saveTicket(ticket: Ticket, actorName: string = 'Resident'): Promise<Ticket> {
  const now = new Date().toISOString();
  const tickets = getStoredTickets();
  const index = tickets.findIndex(t => t.id === ticket.id);

  // Initialize or update timeline
  const timeline = ticket.timeline || [];
  if (index < 0 && timeline.length === 0) {
    timeline.push({
      status: ticket.status || 'Open',
      timestamp: now,
      note: 'Ticket lodged by resident with AI safety assessment',
      updatedBy: actorName
    });
  }

  const preparedTicket: Ticket = {
    ...ticket,
    timeline,
    updatedAt: now
  };

  if (index >= 0) {
    tickets[index] = preparedTicket;
  } else {
    tickets.unshift(preparedTicket);
  }

  localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
  triggerEvent(EVENT_TICKETS_CHANGED);

  // Firestore sync
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'tickets', preparedTicket.id), preparedTicket);
    } catch (err) {
      console.warn('Firestore ticket sync error, local data active:', err);
    }
  }

  // Activity Log & Notification
  if (index < 0) {
    const isCritical = preparedTicket.priority === 'Critical' || preparedTicket.priority === 'Urgent';
    createNotification({
      targetRole: 'warden',
      title: `${isCritical ? '🚨 CRITICAL' : '📝 New'} Maintenance Ticket #${preparedTicket.id}`,
      message: `${preparedTicket.category} issue reported in Room ${preparedTicket.room} (${preparedTicket.block}): ${preparedTicket.description.slice(0, 70)}...`,
      type: 'ticket',
      link: '/admin/maintenance/tickets'
    });

    logActivity({
      actor: actorName,
      actorRole: 'resident',
      action: 'lodged ticket',
      target: `Ticket #${preparedTicket.id} (${preparedTicket.category})`,
      details: `Room ${preparedTicket.room}, Priority: ${preparedTicket.priority}`
    });
  }

  return preparedTicket;
}

export async function updateTicketStatus(
  ticketId: string,
  newStatus: TicketStatus,
  wardenNotes?: string,
  assignedTo?: string,
  actorName: string = 'Warden'
): Promise<Ticket | null> {
  const tickets = getStoredTickets();
  const ticket = tickets.find(t => t.id === ticketId);

  if (!ticket) return null;

  const now = new Date().toISOString();
  ticket.status = newStatus;
  ticket.updatedAt = now;

  if (wardenNotes !== undefined) {
    ticket.wardenNotes = wardenNotes;
  }
  if (assignedTo !== undefined) {
    ticket.assignedTo = assignedTo;
  }
  if (newStatus === 'Resolved') {
    ticket.resolvedAt = now;
  }

  // Append to timeline
  ticket.timeline = ticket.timeline || [];
  ticket.timeline.push({
    status: newStatus,
    timestamp: now,
    note: wardenNotes || (assignedTo ? `Assigned to technician: ${assignedTo}` : `Status transitioned to ${newStatus}`),
    updatedBy: actorName
  });

  localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
  triggerEvent(EVENT_TICKETS_CHANGED);

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        status: newStatus,
        updatedAt: now,
        timeline: ticket.timeline,
        ...(wardenNotes !== undefined && { wardenNotes }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(newStatus === 'Resolved' && { resolvedAt: now })
      });
    } catch (err) {
      console.warn('Firestore ticket status update error:', err);
    }
  }

  // Notify resident of ticket progress
  if (ticket.residentId) {
    createNotification({
      userId: ticket.residentId,
      title: `Ticket #${ticket.id} Updated: ${newStatus}`,
      message: wardenNotes
        ? `Warden Note: "${wardenNotes}"`
        : `Your ${ticket.category} ticket for Room ${ticket.room} is now ${newStatus}.`,
      type: 'ticket',
      link: '/resident/maintenance/tickets'
    });
  }

  logActivity({
    actor: actorName,
    actorRole: 'warden',
    action: `updated ticket to ${newStatus}`,
    target: `Ticket #${ticket.id}`,
    details: wardenNotes || (assignedTo ? `Assigned to ${assignedTo}` : '')
  });

  return ticket;
}

export function subscribeTickets(
  callback: (tickets: Ticket[]) => void,
  userFilter?: { role: UserRole; uid: string }
): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const ticketsRef = collection(db, 'tickets');
      const q =
        userFilter && userFilter.role === 'resident' && userFilter.uid
          ? query(ticketsRef, where('residentId', '==', userFilter.uid))
          : ticketsRef;

      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map(d => d.data() as Ticket);
            list.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            callback(list);

            // Update local storage
            if (!userFilter || userFilter.role === 'warden') {
              localStorage.setItem(KEYS.TICKETS, JSON.stringify(list));
            }
          } else {
            callback([]);
          }
        },
        err => {
          console.warn('Firestore tickets snapshot fallback:', err.message);
          const stored = getStoredTickets();
          if (userFilter && userFilter.role === 'resident' && userFilter.uid) {
            callback(stored.filter(t => t.residentId === userFilter.uid));
          } else {
            callback(stored);
          }
        }
      );

      const handleLocal = () => {
        const stored = getStoredTickets();
        if (userFilter && userFilter.role === 'resident' && userFilter.uid) {
          callback(stored.filter(t => t.residentId === userFilter.uid));
        } else {
          callback(stored);
        }
      };
      window.addEventListener(EVENT_TICKETS_CHANGED, handleLocal);

      return () => {
        unsubscribe();
        window.removeEventListener(EVENT_TICKETS_CHANGED, handleLocal);
      };
    } catch (e) {
      console.warn('Firestore tickets subscription exception:', e);
    }
  }

  const handleLocal = () => {
    const stored = getStoredTickets();
    if (userFilter && userFilter.role === 'resident' && userFilter.uid) {
      callback(stored.filter(t => t.residentId === userFilter.uid));
    } else {
      callback(stored);
    }
  };
  window.addEventListener(EVENT_TICKETS_CHANGED, handleLocal);
  handleLocal();

  return () => {
    window.removeEventListener(EVENT_TICKETS_CHANGED, handleLocal);
  };
}

// ----------------- ROOM ALLOCATION & SMART ALLOCATE -----------------

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
      for (const room of rooms) {
        await setDoc(doc(db, 'rooms', room.id), room, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore rooms batch sync error:', err);
    }
  }
}

export function subscribeRooms(callback: (rooms: RoomRecord[]) => void): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const roomsRef = collection(db, 'rooms');
      const unsubscribe = onSnapshot(
        roomsRef,
        snapshot => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map(d => d.data() as RoomRecord);
            list.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
            callback(list);
            localStorage.setItem(KEYS.ROOMS, JSON.stringify(list));
          } else {
            callback(getStoredRooms());
          }
        },
        err => {
          console.warn('Firestore rooms subscription fallback:', err.message);
          callback(getStoredRooms());
        }
      );

      const handleLocal = () => callback(getStoredRooms());
      window.addEventListener(EVENT_ROOMS_CHANGED, handleLocal);

      return () => {
        unsubscribe();
        window.removeEventListener(EVENT_ROOMS_CHANGED, handleLocal);
      };
    } catch (e) {
      console.warn('Firestore room subscription exception:', e);
    }
  }

  const handleLocal = () => callback(getStoredRooms());
  window.addEventListener(EVENT_ROOMS_CHANGED, handleLocal);
  handleLocal();

  return () => {
    window.removeEventListener(EVENT_ROOMS_CHANGED, handleLocal);
  };
}

export async function allocateBed(
  roomId: string,
  bedNumber: string,
  resident: { uid: string; name: string; studentId?: string },
  wardenName: string = 'Warden'
): Promise<boolean> {
  const rooms = getStoredRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false;

  // Release any existing bed for this resident across all rooms to prevent duplicate allocation
  rooms.forEach(rm => {
    rm.beds.forEach(b => {
      if (b.residentId === resident.uid) {
        delete b.residentId;
        delete b.residentName;
        delete b.studentId;
      }
    });
    rm.occupied = rm.beds.filter(b => !!b.residentId).length;
    rm.updatedAt = new Date().toISOString();
  });

  const bed = room.beds.find(b => b.bedNumber === bedNumber);
  if (!bed) return false;

  // Assign bed
  bed.residentId = resident.uid;
  bed.residentName = resident.name;
  bed.studentId = resident.studentId || `STD-${resident.uid.slice(0, 5)}`;
  room.occupied = room.beds.filter(b => !!b.residentId).length;
  room.updatedAt = new Date().toISOString();

  await saveRooms(rooms);

  // Update user profile atomically in Firestore & local cache
  const users = getStoredUsers();
  if (users[resident.uid]) {
    users[resident.uid].roomNumber = room.roomNumber;
    users[resident.uid].block = room.block;
    users[resident.uid].bedNumber = bedNumber;
    saveStoredUser(users[resident.uid]);
  }

  if (isFirebaseConfigured && db) {
    updateDoc(doc(db, 'users', resident.uid), {
      roomNumber: room.roomNumber,
      block: room.block,
      bedNumber: bedNumber,
      updatedAt: new Date().toISOString()
    }).catch(e => console.warn('User profile room update fallback:', e));
  }

  // Create real-time notification for the resident
  createNotification({
    userId: resident.uid,
    title: 'Room Allocation Confirmed',
    message: `You have been allocated to Room ${room.roomNumber} (${room.block}, ${bedNumber}) at Aravali Residence Hall.`,
    type: 'allocation',
    link: '/resident/room'
  });

  logActivity({
    actor: wardenName,
    actorRole: 'warden',
    action: 'allocated room & bed',
    target: `${resident.name} → Room ${room.roomNumber} (${bedNumber})`,
    details: `${room.block}, Capacity: ${room.capacity}`
  });

  return true;
}

export async function releaseBed(
  roomId: string,
  bedNumber: string,
  wardenName: string = 'Warden'
): Promise<boolean> {
  const rooms = getStoredRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false;

  const bed = room.beds.find(b => b.bedNumber === bedNumber);
  if (!bed) return false;

  const residentUid = bed.residentId;
  const residentName = bed.residentName || 'Resident';

  delete bed.residentId;
  delete bed.residentName;
  delete bed.studentId;
  room.occupied = room.beds.filter(b => !!b.residentId).length;
  room.updatedAt = new Date().toISOString();

  await saveRooms(rooms);

  if (residentUid) {
    const users = getStoredUsers();
    if (users[residentUid]) {
      users[residentUid].roomNumber = 'Unassigned';
      users[residentUid].bedNumber = 'Unassigned';
      saveStoredUser(users[residentUid]);
    }

    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, 'users', residentUid), {
        roomNumber: 'Unassigned',
        bedNumber: 'Unassigned',
        updatedAt: new Date().toISOString()
      }).catch(() => {});
    }

    createNotification({
      userId: residentUid,
      title: 'Room Allocation Updated',
      message: `Your allocation for Room ${room.roomNumber} has been de-allocated by Hostel Administration.`,
      type: 'allocation',
      link: '/resident/allocation'
    });
  }

  logActivity({
    actor: wardenName,
    actorRole: 'warden',
    action: 'released bed',
    target: `Room ${room.roomNumber} (${bedNumber})`,
    details: `Previous occupant: ${residentName}`
  });

  return true;
}

/**
 * Smart Allocate Algorithm:
 * Suggests available rooms with vacant beds matching optimal block and floor balance.
 * Requires explicit confirmation by the Warden before applying.
 */
export interface SmartBedSuggestion {
  room: RoomRecord;
  roomId: string;
  roomNumber: string;
  block: string;
  floor: number;
  availableBeds: number;
  bedNumber: string;
}

export function smartSuggestAvailableBeds(
  rooms?: RoomRecord[],
  preferredBlock?: string
): SmartBedSuggestion[] {
  const allRooms = rooms || getStoredRooms();
  const suggestions: SmartBedSuggestion[] = [];

  const eligibleRooms = allRooms.filter(r => r.occupied < r.capacity);

  // Prioritize preferred block if specified
  eligibleRooms.sort((a, b) => {
    if (preferredBlock) {
      if (a.block === preferredBlock && b.block !== preferredBlock) return -1;
      if (b.block === preferredBlock && a.block !== preferredBlock) return 1;
    }
    return a.occupied - b.occupied; // Balanced filling
  });

  for (const r of eligibleRooms) {
    for (const b of r.beds) {
      if (!b.residentId) {
        suggestions.push({
          room: r,
          roomId: r.id,
          roomNumber: r.roomNumber,
          block: r.block,
          floor: r.floor,
          availableBeds: r.capacity - r.occupied,
          bedNumber: b.bedNumber
        });
      }
    }
  }

  return suggestions;
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

export async function saveMessMenu(
  menu: WeeklyMessMenu,
  actorName: string = 'Warden Mess Committee'
): Promise<void> {
  localStorage.setItem(KEYS.MESS_MENU, JSON.stringify(menu));
  triggerEvent(EVENT_MENU_CHANGED);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'mess_menu', 'weekly'), menu);
    } catch (err) {
      console.warn('Firestore mess menu sync error:', err);
    }
  }

  createNotification({
    targetRole: 'resident',
    title: 'Weekly Mess Menu Updated',
    message: 'The campus catering committee has updated the weekly nutritional mess timetable.',
    type: 'mess',
    link: '/resident/mess/weekly'
  });

  logActivity({
    actor: actorName,
    actorRole: 'warden',
    action: 'updated mess menu',
    target: 'Weekly Timetable',
    details: '7-day breakfast, lunch, and dinner rotations updated.'
  });
}

export function subscribeMessMenu(callback: (menu: WeeklyMessMenu) => void): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const unsubscribe = onSnapshot(
        doc(db, 'mess_menu', 'weekly'),
        snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.data() as WeeklyMessMenu;
            callback(data);
            localStorage.setItem(KEYS.MESS_MENU, JSON.stringify(data));
          } else {
            callback(getStoredMessMenu());
          }
        },
        err => {
          console.warn('Firestore menu snapshot fallback:', err.message);
          callback(getStoredMessMenu());
        }
      );

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
  handleLocal();

  return () => {
    window.removeEventListener(EVENT_MENU_CHANGED, handleLocal);
  };
}

// ----------------- ANNOUNCEMENTS & NOTICES STORAGE -----------------

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

export async function saveAnnouncement(
  ann: Announcement,
  actorName: string = 'Warden Desk'
): Promise<Announcement> {
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

  if (ann.published && idx < 0) {
    createNotification({
      targetRole: 'resident',
      title: `Notice: ${ann.title}`,
      message: `${ann.content.slice(0, 80)}...`,
      type: 'notice',
      link: '/resident/announcements'
    });

    logActivity({
      actor: actorName,
      actorRole: 'warden',
      action: 'posted notice',
      target: ann.title,
      details: `Category: ${ann.category}, Priority: ${ann.priority || 'Normal'}`
    });
  }

  return ann;
}

export async function deleteAnnouncement(
  id: string,
  actorName: string = 'Warden Desk'
): Promise<void> {
  const list = getStoredAnnouncements();
  const deleted = list.find(a => a.id === id);
  const updated = list.filter(a => a.id !== id);

  localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(updated));
  triggerEvent(EVENT_ANNOUNCEMENTS_CHANGED);

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (e) {
      console.warn('Firestore announcement delete error:', e);
    }
  }

  if (deleted) {
    logActivity({
      actor: actorName,
      actorRole: 'warden',
      action: 'removed notice',
      target: deleted.title
    });
  }
}

/**
 * Subscribes to announcements.
 * Automatically filters out expired notices for resident view.
 */
export function subscribeAnnouncements(
  callback: (list: Announcement[]) => void,
  publishedOnly: boolean = false
): () => void {
  const filterActive = (items: Announcement[]) => {
    const now = Date.now();
    return items.filter(a => {
      if (publishedOnly && !a.published) return false;
      if (publishedOnly && a.expiryAt) {
        return new Date(a.expiryAt).getTime() > now;
      }
      return true;
    });
  };

  if (isFirebaseConfigured && db) {
    try {
      const annRef = collection(db, 'announcements');
      const unsubscribe = onSnapshot(
        annRef,
        snapshot => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map(d => d.data() as Announcement);
            list.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            callback(filterActive(list));
            localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(list));
          } else {
            callback(filterActive(getStoredAnnouncements()));
          }
        },
        err => {
          console.warn('Firestore announcements fallback:', err.message);
          callback(filterActive(getStoredAnnouncements()));
        }
      );

      const handleLocal = () => callback(filterActive(getStoredAnnouncements()));
      window.addEventListener(EVENT_ANNOUNCEMENTS_CHANGED, handleLocal);

      return () => {
        unsubscribe();
        window.removeEventListener(EVENT_ANNOUNCEMENTS_CHANGED, handleLocal);
      };
    } catch (e) {
      console.warn('Announcements subscription exception:', e);
    }
  }

  const handleLocal = () => callback(filterActive(getStoredAnnouncements()));
  window.addEventListener(EVENT_ANNOUNCEMENTS_CHANGED, handleLocal);
  handleLocal();

  return () => {
    window.removeEventListener(EVENT_ANNOUNCEMENTS_CHANGED, handleLocal);
  };
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
