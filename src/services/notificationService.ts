import { AppNotification, UserRole } from '../types';
import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';

const LOCAL_KEY = 'sh_notifications_v1';
export const EVENT_NOTIFICATIONS_CHANGED = 'sh_notifications_updated';

function getStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredNotifications(list: AppNotification[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT_NOTIFICATIONS_CHANGED));
}

export async function createNotification(
  data: Omit<AppNotification, 'id' | 'createdAt' | 'read'>
): Promise<AppNotification> {
  const notif: AppNotification = {
    ...data,
    id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    read: false,
    createdAt: new Date().toISOString()
  };

  const stored = getStoredNotifications();
  stored.unshift(notif);
  saveStoredNotifications(stored);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'notifications', notif.id), notif);
    } catch (err) {
      console.warn('Firestore notification write error:', err);
    }
  }

  return notif;
}

export function subscribeNotifications(
  user: { uid: string; role: UserRole },
  callback: (notifications: AppNotification[]) => void
): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const notifRef = collection(db, 'notifications');
      // For residents: match their userId or targetRole === 'all'
      // For wardens: match targetRole === 'warden' or targetRole === 'all'
      const q =
        user.role === 'resident'
          ? query(notifRef, where('userId', '==', user.uid))
          : query(notifRef, where('targetRole', 'in', ['warden', 'all']));

      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          const remoteList: AppNotification[] = snapshot.docs.map(
            d => d.data() as AppNotification
          );

          // If resident, also combine with broadcast notices ('all')
          remoteList.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          callback(remoteList);
          saveStoredNotifications(remoteList);
        },
        err => {
          console.warn('Firestore notifications subscription fallback:', err.message);
          const localList = getStoredNotifications().filter(n => {
            if (user.role === 'resident') {
              return n.userId === user.uid || n.targetRole === 'all';
            }
            return n.targetRole === 'warden' || n.targetRole === 'all';
          });
          callback(localList);
        }
      );

      const handleLocal = () => {
        const localList = getStoredNotifications().filter(n => {
          if (user.role === 'resident') {
            return n.userId === user.uid || n.targetRole === 'all';
          }
          return n.targetRole === 'warden' || n.targetRole === 'all';
        });
        callback(localList);
      };

      window.addEventListener(EVENT_NOTIFICATIONS_CHANGED, handleLocal);

      return () => {
        unsubscribe();
        window.removeEventListener(EVENT_NOTIFICATIONS_CHANGED, handleLocal);
      };
    } catch (e) {
      console.warn('Notification subscription exception:', e);
    }
  }

  const handleLocal = () => {
    const localList = getStoredNotifications().filter(n => {
      if (user.role === 'resident') {
        return n.userId === user.uid || n.targetRole === 'all';
      }
      return n.targetRole === 'warden' || n.targetRole === 'all';
    });
    callback(localList);
  };

  window.addEventListener(EVENT_NOTIFICATIONS_CHANGED, handleLocal);
  handleLocal();

  return () => {
    window.removeEventListener(EVENT_NOTIFICATIONS_CHANGED, handleLocal);
  };
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const stored = getStoredNotifications();
  const item = stored.find(n => n.id === id);
  if (item) {
    item.read = true;
    saveStoredNotifications(stored);
  }

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (err) {
      console.warn('Firestore notification mark read error:', err);
    }
  }
}

export async function markAllNotificationsAsRead(user: { uid: string; role: UserRole }): Promise<void> {
  const stored = getStoredNotifications();
  stored.forEach(n => {
    if (user.role === 'resident' && (n.userId === user.uid || n.targetRole === 'all')) {
      n.read = true;
    } else if (user.role === 'warden' && (n.targetRole === 'warden' || n.targetRole === 'all')) {
      n.read = true;
    }
  });
  saveStoredNotifications(stored);

  if (isFirebaseConfigured && db) {
    stored.forEach(n => {
      if (n.read) {
        updateDoc(doc(db, 'notifications', n.id), { read: true }).catch(() => {});
      }
    });
  }
}
