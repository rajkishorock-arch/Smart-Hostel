import {
  DayMenu,
  RoomRecord,
  Ticket,
  UserProfile,
  WeeklyMessMenu,
  UserRole,
  Announcement,
  MealScheduleItem,
  TicketStatus,
  RepeatedIssueSummary,
  OperationalPriorityItem,
  TicketCategory,
  Invoice,
  IoTSensorReading,
  VendorRecord,
  GatePassRequest,
  NightAttendanceRecord,
  RoomChangeRequest
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

export const subscribeUsers = subscribeResidents;

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
      type: isCritical ? 'critical' : 'ticket',
      priority: isCritical ? 'Critical' : (preparedTicket.priority === 'High' ? 'High' : 'Normal'),
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
    const isCritical = ticket.priority === 'Critical' || ticket.priority === 'Urgent';
    createNotification({
      userId: ticket.residentId,
      title: `Ticket #${ticket.id} Updated: ${newStatus}`,
      message: wardenNotes
        ? `Warden Note: "${wardenNotes}"`
        : `Your ${ticket.category} ticket for Room ${ticket.room} is now ${newStatus}.`,
      type: newStatus === 'Resolved' ? 'success' : (isCritical ? 'critical' : 'ticket'),
      priority: isCritical ? 'Critical' : (ticket.priority === 'High' ? 'High' : 'Normal'),
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
  if (!resident || !resident.uid || !resident.name) {
    console.warn('Cannot allocate: Invalid resident data provided');
    return false;
  }

  const rooms = getStoredRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) {
    console.warn('Cannot allocate: Target room not found');
    return false;
  }

  const targetBed = room.beds.find(b => b.bedNumber === bedNumber);
  if (!targetBed) {
    console.warn('Cannot allocate: Target bed not found in room');
    return false;
  }

  // Prevent overwriting a bed already occupied by another resident
  if (targetBed.residentId && targetBed.residentId !== resident.uid) {
    console.warn('Cannot allocate: Bed is already occupied by another student');
    return false;
  }

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

  // Prevent room over-capacity
  if (room.occupied >= room.capacity && !bed.residentId) {
    console.warn('Cannot allocate: Room has reached maximum capacity');
    return false;
  }

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

// ----------------- SMART REPEATED ISSUE DETECTION -----------------

export function detectRepeatedIssues(tickets: Ticket[]): RepeatedIssueSummary[] {
  const map: Record<string, {
    room: string;
    block?: string;
    category: TicketCategory;
    tickets: Ticket[];
  }> = {};

  for (const t of tickets) {
    const rm = (t.roomNumber || t.room || '').trim();
    if (!rm) continue;
    const cat = t.category;
    const key = `${rm}___${cat}`;
    if (!map[key]) {
      map[key] = {
        room: rm,
        block: t.block,
        category: cat,
        tickets: []
      };
    }
    map[key].tickets.push(t);
  }

  const results: RepeatedIssueSummary[] = [];

  for (const entry of Object.values(map)) {
    if (entry.tickets.length >= 2) {
      const sorted = [...entry.tickets].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const unresolved = sorted.find(t => t.status !== 'Resolved');
      results.push({
        room: entry.room,
        block: entry.block,
        category: entry.category,
        count: entry.tickets.length,
        recentDates: sorted.map(t => t.createdAt.split('T')[0]).slice(0, 4),
        currentUnresolvedTicket: unresolved
      });
    }
  }

  return results.sort((a, b) => b.count - a.count);
}

// ----------------- SMART OPERATIONAL PRIORITY ENGINE -----------------

export function getOperationalPriorities(
  tickets: Ticket[],
  residents: UserProfile[],
  rooms: RoomRecord[]
): OperationalPriorityItem[] {
  const items: OperationalPriorityItem[] = [];

  // 1. Critical unresolved maintenance
  const criticalTickets = tickets.filter(
    t => (t.priority === 'Critical' || t.priority === 'Urgent') && t.status !== 'Resolved'
  );
  criticalTickets.forEach(t => {
    items.push({
      id: `crit-op-${t.id}`,
      type: 'critical_ticket',
      priority: 'Critical',
      title: `Critical ${t.category} ticket — Room ${t.roomNumber || t.room}`,
      reason: t.safetyAlert || `Immediate safety & operational hazard flagged in ${t.category}.`,
      link: '/admin/maintenance/resolution',
      timestamp: t.createdAt
    });
  });

  // 2. High-priority unresolved maintenance
  const highTickets = tickets.filter(
    t => t.priority === 'High' && t.status !== 'Resolved'
  );
  highTickets.forEach(t => {
    items.push({
      id: `high-op-${t.id}`,
      type: 'high_ticket',
      priority: 'High',
      title: `High-priority ${t.category} ticket — Room ${t.roomNumber || t.room}`,
      reason: `Urgent resident complaint requires technician assignment.`,
      link: '/admin/maintenance/resolution',
      timestamp: t.createdAt
    });
  });

  // 3. Residents without allocation
  const unallocated = residents.filter(
    r => r.role === 'resident' && (!r.roomNumber || r.roomNumber.trim() === '')
  );
  unallocated.forEach(r => {
    items.push({
      id: `unalloc-op-${r.uid}`,
      type: 'unallocated_resident',
      priority: 'Normal',
      title: `Resident unallocated — ${r.name}`,
      reason: `Student enrolled but awaiting room & bed assignment.`,
      link: '/admin/hostel/allocation',
      timestamp: r.createdAt || new Date().toISOString()
    });
  });

  // 4. Rooms with repeated issues
  const repeated = detectRepeatedIssues(tickets);
  repeated.forEach(rep => {
    items.push({
      id: `rep-op-${rep.room}-${rep.category}`,
      type: 'repeated_issue',
      priority: rep.currentUnresolvedTicket ? 'High' : 'Normal',
      title: `Repeated ${rep.category} issue — Room ${rep.room}`,
      reason: `${rep.count} related tickets logged. Facility physical inspection recommended.`,
      link: '/admin/maintenance/tickets',
      timestamp: rep.recentDates[0] || new Date().toISOString()
    });
  });

  return items;
}

/* ============================================================ */
/* BILLING, INVOICE & PAYMENT MANAGEMENT (Feature 7)             */
/* ============================================================ */
export const EVENT_INVOICES_CHANGED = 'sh_invoices_updated';
const INVOICES_STORAGE_KEY = 'sh_invoices_v1';

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001',
    studentUid: 'res-demo',
    studentName: 'Rahul Sharma',
    studentEmail: 'demo-resident@hostel.edu',
    roomNumber: '204',
    term: 'Spring Term 2026',
    roomFee: 6500,
    messFee: 4200,
    amenitiesFee: 500,
    totalAmount: 11200,
    amountPaid: 11200,
    status: 'Paid',
    dueDate: '2026-03-31',
    paidAt: '2026-03-15T11:20:00Z',
    paymentMode: 'UPI',
    transactionRef: 'UPI/20260315/99841284',
    createdAt: '2026-03-01T08:00:00Z'
  },
  {
    id: 'INV-2026-002',
    studentUid: 'res-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@hostel.edu',
    roomNumber: '101',
    term: 'Spring Term 2026',
    roomFee: 6500,
    messFee: 4200,
    amenitiesFee: 500,
    totalAmount: 11200,
    amountPaid: 0,
    status: 'Pending',
    dueDate: '2026-04-05',
    createdAt: '2026-03-01T08:00:00Z'
  },
  {
    id: 'INV-2026-003',
    studentUid: 'res-3',
    studentName: 'Kabir Mehta',
    studentEmail: 'kabir.mehta@hostel.edu',
    roomNumber: '204',
    term: 'Spring Term 2026',
    roomFee: 7500,
    messFee: 4200,
    amenitiesFee: 500,
    totalAmount: 12200,
    amountPaid: 0,
    status: 'Overdue',
    dueDate: '2026-03-20',
    createdAt: '2026-02-25T08:00:00Z'
  },
  {
    id: 'INV-2026-004',
    studentUid: 'res-4',
    studentName: 'Dev Patel',
    studentEmail: 'dev.patel@hostel.edu',
    roomNumber: '305',
    term: 'Spring Term 2026',
    roomFee: 6500,
    messFee: 4200,
    amenitiesFee: 500,
    totalAmount: 11200,
    amountPaid: 11200,
    status: 'Paid',
    dueDate: '2026-03-31',
    paidAt: '2026-03-12T14:30:00Z',
    paymentMode: 'NetBanking',
    transactionRef: 'NET/20260312/441289',
    createdAt: '2026-03-01T08:00:00Z'
  }
];

function getStoredInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(INVOICES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(INITIAL_INVOICES));
      return INITIAL_INVOICES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_INVOICES;
  }
}

function saveStoredInvoices(invs: Invoice[]): void {
  try {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invs));
    window.dispatchEvent(new Event(EVENT_INVOICES_CHANGED));
  } catch (err) {
    console.error('Error saving invoices:', err);
  }
}

export function subscribeInvoices(callback: (invoices: Invoice[]) => void): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'invoices'));
      const unsub = onSnapshot(q, snap => {
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Invoice));
          callback(list);
          saveStoredInvoices(list);
        } else {
          callback(getStoredInvoices());
        }
      }, () => {
        callback(getStoredInvoices());
      });
      return unsub;
    } catch {
      // fallback
    }
  }

  callback(getStoredInvoices());
  const handler = () => callback(getStoredInvoices());
  window.addEventListener(EVENT_INVOICES_CHANGED, handler);
  return () => window.removeEventListener(EVENT_INVOICES_CHANGED, handler);
}

export async function payInvoice(
  invoiceId: string,
  paymentMode: 'UPI' | 'NetBanking' | 'Card' | 'Cash',
  transactionRef?: string
): Promise<boolean> {
  const current = getStoredInvoices();
  const index = current.findIndex(i => i.id === invoiceId);
  if (index === -1) return false;

  const now = new Date().toISOString();
  const txRef = transactionRef || `TXN-${Date.now()}`;
  const updatedInvoice: Invoice = {
    ...current[index],
    status: 'Paid',
    amountPaid: current[index].totalAmount,
    paidAt: now,
    paymentMode,
    transactionRef: txRef
  };

  current[index] = updatedInvoice;
  saveStoredInvoices(current);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'invoices', invoiceId), updatedInvoice, { merge: true });
    } catch (e) {
      console.warn('Failed to update invoice in Firestore:', e);
    }
  }

  // Create notifications & log
  createNotification({
    userId: updatedInvoice.studentUid,
    targetRole: 'resident',
    title: 'Payment Successful',
    message: `Payment of ₹${updatedInvoice.totalAmount.toLocaleString()} for ${updatedInvoice.term} verified (${txRef}).`,
    type: 'success',
    priority: 'Normal'
  });

  logActivity({
    actor: 'System / Resident Gateway',
    actorRole: 'system',
    action: 'Invoice Settled',
    target: `Invoice ${invoiceId} — ${updatedInvoice.studentName} (₹${updatedInvoice.totalAmount})`
  });

  return true;
}

export async function sendPaymentReminder(invoiceId: string): Promise<boolean> {
  const current = getStoredInvoices();
  const inv = current.find(i => i.id === invoiceId);
  if (!inv) return false;

  createNotification({
    userId: inv.studentUid,
    targetRole: 'resident',
    title: 'Hostel Fee Due Reminder',
    message: `Urgent: Your outstanding dues of ₹${(inv.totalAmount - inv.amountPaid).toLocaleString()} for ${inv.term} are due by ${inv.dueDate}. Please clear at the fee counter or via online portal.`,
    type: 'system',
    priority: 'High'
  });

  logActivity({
    actor: 'Warden Administration',
    actorRole: 'warden',
    action: 'Payment Reminder Sent',
    target: `Invoice ${inv.id} (${inv.studentName})`
  });

  return true;
}

/* ============================================================ */
/* IOT & SMART INFRASTRUCTURE TELEMETRY (Feature 10)             */
/* ============================================================ */
export const EVENT_IOT_CHANGED = 'sh_iot_updated';

const INITIAL_IOT_SENSORS: IoTSensorReading[] = [
  {
    id: 'IOT-PWR-01',
    sensorType: 'Electricity Meter',
    location: 'Main Substation Busbar & Genset Feed',
    currentValue: 48.6,
    unit: 'kW',
    status: 'Normal',
    lastUpdated: 'Live (5 sec ago)',
    alertMessage: 'Power factor balanced at 0.98 pf'
  },
  {
    id: 'IOT-WTR-UG',
    sensorType: 'Water Level',
    location: 'Underground Ground-Water Reservoir',
    currentValue: 84,
    unit: '% Full',
    status: 'Normal',
    lastUpdated: 'Live (12 sec ago)',
    alertMessage: 'Pumping active from municipal supply bore'
  },
  {
    id: 'IOT-WTR-OH',
    sensorType: 'Water Level',
    location: 'Overhead Gravity Feed Rooftop Tanks',
    currentValue: 62,
    unit: '% Full',
    status: 'Normal',
    lastUpdated: 'Live (15 sec ago)',
    alertMessage: 'Booster pump auto-scheduled to trigger at 40%'
  },
  {
    id: 'IOT-PIR-LIB',
    sensorType: 'PIR Occupancy',
    location: 'Block A Ground Reading Room',
    currentValue: 'Occupied',
    unit: 'State',
    status: 'Normal',
    lastUpdated: 'Live (1 sec ago)',
    alertMessage: '14 occupants detected; HVAC active'
  },
  {
    id: 'IOT-PIR-CORR',
    sensorType: 'PIR Occupancy',
    location: 'Block B 2nd Floor Corridor',
    currentValue: 'Empty',
    unit: 'State',
    status: 'Normal',
    lastUpdated: 'Live (30 sec ago)',
    alertMessage: 'Lighting dimmed to 20% eco-mode'
  }
];

export function subscribeIoTSensors(callback: (sensors: IoTSensorReading[]) => void): () => void {
  callback(INITIAL_IOT_SENSORS);
  return () => {};
}

export async function logRFIDAttendance(
  studentUid: string,
  meal: string
): Promise<{ success: boolean; message: string; studentName: string }> {
  const residents = getAllResidents();
  const student = residents.find(r => r.uid === studentUid) || {
    uid: studentUid,
    name: 'Verified Student Resident'
  };

  logActivity({
    actor: student.name,
    actorRole: 'resident',
    action: 'RFID Dining Check-In',
    target: `${meal} Counter RFID Gate`
  });

  return {
    success: true,
    message: `RFID Check-in approved for ${meal}. Gate open.`,
    studentName: student.name
  };
}

/* ============================================================ */
/* VENDOR & SUPPLY CHAIN MANAGEMENT (Feature 11)                 */
/* ============================================================ */
export const EVENT_VENDORS_CHANGED = 'sh_vendors_updated';

const INITIAL_VENDORS: VendorRecord[] = [
  {
    id: 'VND-GROC-01',
    name: 'Kisan Fresh Agro Wholesale',
    category: 'Groceries & Provisions',
    contactPerson: 'Harish Patel',
    phone: '+91 98230 11223',
    email: 'orders@kisanfresh.in',
    rating: 4.8,
    activeContract: true,
    pendingOrdersCount: 2,
    lastDeliveryDate: '2026-03-24',
    paymentTerms: 'Net 30 Days'
  },
  {
    id: 'VND-DAIR-02',
    name: 'Amul Cooperative Campus Dairy',
    category: 'Dairy & Fresh Produce',
    contactPerson: 'Sukhvinder Singh',
    phone: '+91 98140 33445',
    email: 'institutional@amuldairy.coop',
    rating: 4.9,
    activeContract: true,
    pendingOrdersCount: 1,
    lastDeliveryDate: '2026-03-26',
    paymentTerms: 'Weekly Settlement'
  },
  {
    id: 'VND-PLMB-03',
    name: 'Standard Plumbing & Pipe Fittings',
    category: 'Plumbing & Hardware',
    contactPerson: 'Mahesh Sharma',
    phone: '+91 94120 55667',
    email: 'supplies@stdplumbing.com',
    rating: 4.5,
    activeContract: true,
    pendingOrdersCount: 0,
    lastDeliveryDate: '2026-03-18',
    paymentTerms: 'Net 15 Days'
  },
  {
    id: 'VND-ELEC-04',
    name: 'Havells & Schneider Commercial Spares',
    category: 'Electrical Supplies',
    contactPerson: 'Deepak Chawla',
    phone: '+91 98990 77889',
    email: 'chawla.electricals@gmail.com',
    rating: 4.6,
    activeContract: true,
    pendingOrdersCount: 1,
    lastDeliveryDate: '2026-03-22',
    paymentTerms: 'Net 30 Days'
  }
];

export function subscribeVendors(callback: (vendors: VendorRecord[]) => void): () => void {
  callback(INITIAL_VENDORS);
  return () => {};
}

/* ============================================================ */
/* GATE PASS & STUDENT OUTING / LEAVE MANAGEMENT (Real Service) */
/* ============================================================ */
export const EVENT_GATE_PASSES_CHANGED = 'sh_gate_passes_updated';
const GATE_PASSES_STORAGE_KEY = 'sh_gate_passes_v1';

const INITIAL_GATE_PASSES: GatePassRequest[] = [
  {
    id: 'GP-2026-101',
    residentId: 'res-demo',
    residentName: 'Rahul Sharma',
    studentEmail: 'demo-resident@hostel.edu',
    roomNumber: '204',
    block: 'Block A',
    leaveType: 'Local Outing',
    departureDate: new Date(Date.now() - 3600000 * 4).toISOString(),
    expectedReturnDate: new Date(Date.now() + 3600000 * 2).toISOString(),
    reason: 'Purchase technical textbooks and project hardware components',
    parentContact: '+91 98765 00111',
    status: 'Approved',
    reviewedBy: 'Dr. Rajeshwar K. Sundaram (Warden)',
    reviewRemarks: 'Permitted. Return strictly before 09:30 PM curfew.',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'GP-2026-102',
    residentId: 'res-1',
    residentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@hostel.edu',
    roomNumber: '101',
    block: 'Block A',
    leaveType: 'Home Visit',
    departureDate: new Date(Date.now() + 86400000).toISOString(),
    expectedReturnDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    reason: 'Family wedding ceremony at home town',
    parentContact: '+91 98765 00112',
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
];

export function getStoredGatePasses(): GatePassRequest[] {
  try {
    const raw = localStorage.getItem(GATE_PASSES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(GATE_PASSES_STORAGE_KEY, JSON.stringify(INITIAL_GATE_PASSES));
      return INITIAL_GATE_PASSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_GATE_PASSES;
  }
}

function saveStoredGatePasses(passes: GatePassRequest[]): void {
  try {
    localStorage.setItem(GATE_PASSES_STORAGE_KEY, JSON.stringify(passes));
    window.dispatchEvent(new Event(EVENT_GATE_PASSES_CHANGED));
  } catch (err) {
    console.error('Error saving gate passes:', err);
  }
}

export function subscribeGatePasses(
  callback: (passes: GatePassRequest[]) => void,
  userFilter?: { role: UserRole; uid: string }
): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'gate_passes');
      const q = userFilter && userFilter.role === 'resident' && userFilter.uid
        ? query(colRef, where('residentId', '==', userFilter.uid))
        : colRef;

      const unsub = onSnapshot(q, snap => {
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as GatePassRequest));
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          callback(list);
          if (!userFilter || userFilter.role === 'warden') {
            saveStoredGatePasses(list);
          }
        } else {
          const stored = getStoredGatePasses();
          if (userFilter && userFilter.role === 'resident' && userFilter.uid) {
            callback(stored.filter(p => p.residentId === userFilter.uid));
          } else {
            callback(stored);
          }
        }
      }, () => {
        const stored = getStoredGatePasses();
        if (userFilter && userFilter.role === 'resident' && userFilter.uid) {
          callback(stored.filter(p => p.residentId === userFilter.uid));
        } else {
          callback(stored);
        }
      });
      return unsub;
    } catch {}
  }

  const handler = () => {
    const stored = getStoredGatePasses();
    if (userFilter && userFilter.role === 'resident' && userFilter.uid) {
      callback(stored.filter(p => p.residentId === userFilter.uid));
    } else {
      callback(stored);
    }
  };
  window.addEventListener(EVENT_GATE_PASSES_CHANGED, handler);
  handler();
  return () => window.removeEventListener(EVENT_GATE_PASSES_CHANGED, handler);
}

export async function createGatePass(
  pass: Omit<GatePassRequest, 'id' | 'createdAt' | 'status'>
): Promise<GatePassRequest> {
  const current = getStoredGatePasses();
  const newPass: GatePassRequest = {
    ...pass,
    id: `GP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  current.unshift(newPass);
  saveStoredGatePasses(current);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'gate_passes', newPass.id), newPass);
    } catch (e) {
      console.warn('Failed to save gate pass to Firestore:', e);
    }
  }

  createNotification({
    targetRole: 'warden',
    title: 'New Out-Pass Request',
    message: `${pass.residentName} (Room ${pass.roomNumber}) requested a ${pass.leaveType}.`,
    type: 'notice',
    priority: 'Normal',
    link: '/admin/hostel/leaves'
  });

  logActivity({
    actor: pass.residentName,
    actorRole: 'resident',
    action: 'Requested Gate Pass',
    target: `${pass.leaveType} (${pass.reason.slice(0, 40)}...)`
  });

  return newPass;
}

export async function updateGatePassStatus(
  passId: string,
  status: GatePassRequest['status'],
  remarks?: string,
  wardenName: string = 'Warden'
): Promise<boolean> {
  const current = getStoredGatePasses();
  const index = current.findIndex(p => p.id === passId);
  if (index === -1) return false;

  current[index].status = status;
  current[index].reviewedBy = wardenName;
  if (remarks) current[index].reviewRemarks = remarks;
  current[index].updatedAt = new Date().toISOString();

  saveStoredGatePasses(current);

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'gate_passes', passId), {
        status,
        reviewedBy: wardenName,
        reviewRemarks: remarks || '',
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Failed to update gate pass in Firestore:', e);
    }
  }

  // Notify resident
  createNotification({
    userId: current[index].residentId,
    targetRole: 'resident',
    title: `Out-Pass Request ${status}`,
    message: `Your ${current[index].leaveType} request #${passId} has been ${status.toLowerCase()} by ${wardenName}.`,
    type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'critical' : 'notice',
    priority: status === 'Approved' ? 'Normal' : 'High',
    link: '/resident/leave'
  });

  logActivity({
    actor: wardenName,
    actorRole: 'warden',
    action: `Gate pass ${status}`,
    target: `${current[index].residentName} — ${current[index].id}`
  });

  return true;
}

/* ============================================================ */
/* NIGHT ATTENDANCE & CURFEW ROLL-CALL (Real Service)           */
/* ============================================================ */
export const EVENT_ATTENDANCE_CHANGED = 'sh_attendance_updated';
const ATTENDANCE_STORAGE_KEY = 'sh_attendance_v1';

export function getStoredAttendance(): NightAttendanceRecord[] {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredAttendance(records: NightAttendanceRecord[]): void {
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event(EVENT_ATTENDANCE_CHANGED));
  } catch (err) {
    console.error('Error saving attendance:', err);
  }
}

export function subscribeAttendance(
  dateStr: string,
  callback: (records: NightAttendanceRecord[]) => void
): () => void {
  const handler = () => {
    const all = getStoredAttendance();
    callback(all.filter(r => r.date === dateStr));
  };

  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'attendance'), where('date', '==', dateStr));
      const unsub = onSnapshot(q, snap => {
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as NightAttendanceRecord));
          callback(list);
        } else {
          handler();
        }
      }, () => handler());
      return unsub;
    } catch {}
  }

  window.addEventListener(EVENT_ATTENDANCE_CHANGED, handler);
  handler();
  return () => window.removeEventListener(EVENT_ATTENDANCE_CHANGED, handler);
}

export async function markAttendanceBatch(
  dateStr: string,
  records: Omit<NightAttendanceRecord, 'id' | 'timestamp'>[],
  wardenName: string = 'Warden'
): Promise<boolean> {
  const current = getStoredAttendance();
  const filtered = current.filter(r => r.date !== dateStr);
  const now = new Date().toISOString();

  const newRecords: NightAttendanceRecord[] = records.map((r, i) => ({
    ...r,
    id: `ATT-${dateStr}-${r.residentId}-${i}`,
    timestamp: now
  }));

  const updated = [...filtered, ...newRecords];
  saveStoredAttendance(updated);

  if (isFirebaseConfigured && db) {
    for (const rec of newRecords) {
      setDoc(doc(db, 'attendance', rec.id), rec, { merge: true }).catch(() => {});
    }
  }

  logActivity({
    actor: wardenName,
    actorRole: 'warden',
    action: 'Logged Night Curfew Attendance',
    target: `Date: ${dateStr} (${newRecords.length} residents marked)`
  });

  return true;
}

/* ============================================================ */
/* ROOM CHANGE / SWAP REQUEST WORKFLOW (Real Service)           */
/* ============================================================ */
export const EVENT_ROOM_REQUESTS_CHANGED = 'sh_room_requests_updated';
const ROOM_REQUESTS_STORAGE_KEY = 'sh_room_requests_v1';

export function getStoredRoomRequests(): RoomChangeRequest[] {
  try {
    const raw = localStorage.getItem(ROOM_REQUESTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredRoomRequests(requests: RoomChangeRequest[]): void {
  try {
    localStorage.setItem(ROOM_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new Event(EVENT_ROOM_REQUESTS_CHANGED));
  } catch (err) {
    console.error('Error saving room requests:', err);
  }
}

export function subscribeRoomChangeRequests(
  callback: (requests: RoomChangeRequest[]) => void,
  userFilter?: { role: UserRole; uid: string }
): () => void {
  const handler = () => {
    const stored = getStoredRoomRequests();
    if (userFilter && userFilter.role === 'resident' && userFilter.uid) {
      callback(stored.filter(r => r.residentId === userFilter.uid));
    } else {
      callback(stored);
    }
  };

  window.addEventListener(EVENT_ROOM_REQUESTS_CHANGED, handler);
  handler();
  return () => window.removeEventListener(EVENT_ROOM_REQUESTS_CHANGED, handler);
}

export async function createRoomChangeRequest(
  req: Omit<RoomChangeRequest, 'id' | 'createdAt' | 'status'>
): Promise<RoomChangeRequest> {
  const current = getStoredRoomRequests();
  const newReq: RoomChangeRequest = {
    ...req,
    id: `RCR-${Date.now().toString().slice(-5)}`,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  current.unshift(newReq);
  saveStoredRoomRequests(current);

  createNotification({
    targetRole: 'warden',
    title: 'Room Transfer Application Lodged',
    message: `${req.residentName} (Room ${req.currentRoom}) requested transfer to ${req.preferredBlock}.`,
    type: 'allocation',
    priority: 'Normal',
    link: '/admin/hostel/allocation'
  });

  logActivity({
    actor: req.residentName,
    actorRole: 'resident',
    action: 'Requested Room Change',
    target: `From Room ${req.currentRoom} to ${req.preferredBlock}`
  });

  return newReq;
}



