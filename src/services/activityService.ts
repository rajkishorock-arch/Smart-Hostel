import { ActivityLog } from '../types';
import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  limit
} from 'firebase/firestore';

const LOCAL_KEY = 'sh_activity_logs_v1';
export const EVENT_ACTIVITY_CHANGED = 'sh_activity_updated';

function getStoredActivityLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredActivityLogs(list: ActivityLog[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list.slice(0, 50)));
  window.dispatchEvent(new Event(EVENT_ACTIVITY_CHANGED));
}

export async function logActivity(
  entry: Omit<ActivityLog, 'id' | 'timestamp'>
): Promise<ActivityLog> {
  const log: ActivityLog = {
    ...entry,
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString()
  };

  const stored = getStoredActivityLogs();
  stored.unshift(log);
  saveStoredActivityLogs(stored);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'activity_logs', log.id), log);
    } catch (err) {
      console.warn('Firestore activity log write error:', err);
    }
  }

  return log;
}

export function subscribeActivityLogs(
  callback: (logs: ActivityLog[]) => void,
  maxCount: number = 10
): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const logsRef = collection(db, 'activity_logs');
      const q = query(logsRef, limit(maxCount * 2));

      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          if (!snapshot.empty) {
            const list: ActivityLog[] = snapshot.docs.map(
              d => d.data() as ActivityLog
            );
            list.sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            const trimmed = list.slice(0, maxCount);
            callback(trimmed);
            saveStoredActivityLogs(trimmed);
          } else {
            callback(getStoredActivityLogs().slice(0, maxCount));
          }
        },
        err => {
          console.warn('Firestore activity log subscription error:', err.message);
          callback(getStoredActivityLogs().slice(0, maxCount));
        }
      );

      const handleLocal = () => callback(getStoredActivityLogs().slice(0, maxCount));
      window.addEventListener(EVENT_ACTIVITY_CHANGED, handleLocal);

      return () => {
        unsubscribe();
        window.removeEventListener(EVENT_ACTIVITY_CHANGED, handleLocal);
      };
    } catch (e) {
      console.warn('Activity subscription exception:', e);
    }
  }

  const handleLocal = () => callback(getStoredActivityLogs().slice(0, maxCount));
  window.addEventListener(EVENT_ACTIVITY_CHANGED, handleLocal);
  handleLocal();

  return () => {
    window.removeEventListener(EVENT_ACTIVITY_CHANGED, handleLocal);
  };
}
