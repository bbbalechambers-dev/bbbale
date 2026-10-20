import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocFromServer,
  getDocs,
  onSnapshot,
  query,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import appletConfig from '../../firebase-applet-config.json';

// Support Cloudflare Pages VITE_FIREBASE_* environment variables with fallback to AI Studio config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || appletConfig.measurementId,
};

const databaseId =
  import.meta.env.VITE_FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId;

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Mandatory Error Handler per Firebase Integration Specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    return true;
  }
}

testConnection();

// ============================================================================
// SECTION 5: CROSS-DEVICE DATA SYNC & QUOTA MONITOR
// ============================================================================

export type SyncStatus = 'Synced' | 'Syncing' | 'Reconnecting' | 'Offline';

export interface QuotaStats {
  dateKey: string; // Pacific Time YYYY-MM-DD
  reads: number;
  writes: number;
  realtimeUnits: number;
  readLimit: number;
  writeLimit: number;
  realtimeLimit: number;
  isAlertActive: boolean;
}

const QUOTA_STORAGE_KEY = 'bbbale_firestore_quota_v1';
const FREE_TIER_LIMITS = {
  reads: 50000,
  writes: 20000,
  realtimeUnits: 50000,
};

function getPacificDateKey(): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

const quotaListeners = new Set<(stats: QuotaStats) => void>();

export function getQuotaStats(): QuotaStats {
  const todayKey = getPacificDateKey();
  try {
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.dateKey === todayKey) {
        const reads = Number(parsed.reads || 0);
        const writes = Number(parsed.writes || 0);
        const realtimeUnits = Number(parsed.realtimeUnits || 0);
        const isAlertActive =
          reads >= FREE_TIER_LIMITS.reads * 0.8 ||
          writes >= FREE_TIER_LIMITS.writes * 0.8 ||
          realtimeUnits >= FREE_TIER_LIMITS.realtimeUnits * 0.8;
        return {
          dateKey: todayKey,
          reads,
          writes,
          realtimeUnits,
          readLimit: FREE_TIER_LIMITS.reads,
          writeLimit: FREE_TIER_LIMITS.writes,
          realtimeLimit: FREE_TIER_LIMITS.realtimeUnits,
          isAlertActive,
        };
      }
    }
  } catch {
    // ignore storage errors
  }
  return {
    dateKey: todayKey,
    reads: 0,
    writes: 0,
    realtimeUnits: 0,
    readLimit: FREE_TIER_LIMITS.reads,
    writeLimit: FREE_TIER_LIMITS.writes,
    realtimeLimit: FREE_TIER_LIMITS.realtimeUnits,
    isAlertActive: false,
  };
}

export function recordQuotaUsage(
  type: 'reads' | 'writes' | 'realtimeUnits',
  count = 1
): QuotaStats {
  const stats = getQuotaStats();
  stats[type] += Math.max(1, count);
  stats.isAlertActive =
    stats.reads >= stats.readLimit * 0.8 ||
    stats.writes >= stats.writeLimit * 0.8 ||
    stats.realtimeUnits >= stats.realtimeLimit * 0.8;
  try {
    localStorage.setItem(
      QUOTA_STORAGE_KEY,
      JSON.stringify({
        dateKey: stats.dateKey,
        reads: stats.reads,
        writes: stats.writes,
        realtimeUnits: stats.realtimeUnits,
      })
    );
  } catch {
    // ignore storage errors
  }
  quotaListeners.forEach((cb) => cb(stats));
  return stats;
}

export function subscribeToQuota(cb: (stats: QuotaStats) => void): () => void {
  quotaListeners.add(cb);
  cb(getQuotaStats());
  return () => {
    quotaListeners.delete(cb);
  };
}

// Active subscription registry for foreground visibility resume
const activeRefreshCallbacks = new Set<() => void>();

export function refreshAllListeners(): void {
  activeRefreshCallbacks.forEach((refresh) => {
    try {
      refresh();
    } catch (err) {
      console.error('Error refreshing listener:', err);
    }
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      refreshAllListeners();
    }
  });
}

// Required Section 5.2 Firestore Listener Pattern with 3-Failure Polling Fallback & Exponential Backoff
const BACKOFF_DELAYS_MS = [1000, 2000, 4000, 8000, 16000, 30000];

export function startPolling<T = DocumentData>(
  collectionName: string,
  filters: QueryConstraint[],
  callback: (data: T[]) => void,
  onStatusChange?: (status: SyncStatus, lastUpdated: number) => void
): () => void {
  const executePoll = async () => {
    try {
      onStatusChange?.('Syncing', Date.now());
      const q = query(collection(db, collectionName), ...filters);
      const snapshot = await getDocs(q);
      recordQuotaUsage('reads', Math.max(1, snapshot.docs.length));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as T));
      callback(data);
      onStatusChange?.('Synced', Date.now());
    } catch (error) {
      onStatusChange?.('Offline', Date.now());
      try {
        handleFirestoreError(error, OperationType.LIST, collectionName);
      } catch {
        // Logged via handleFirestoreError
      }
    }
  };

  executePoll();
  const interval = window.setInterval(executePoll, 30000);
  return () => window.clearInterval(interval);
}

export function subscribeToCollection<T = DocumentData>(
  collectionName: string,
  filters: QueryConstraint[],
  callback: (data: T[]) => void,
  onStatusChange?: (status: SyncStatus, lastUpdated: number) => void
): () => void {
  let unsubscribeSnapshot: (() => void) | null = null;
  let stopPolling: (() => void) | null = null;
  let reconnectTimer: number | null = null;
  let failureCount = 0;
  let disposed = false;

  const cleanupCurrent = () => {
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }
    if (stopPolling) {
      stopPolling();
      stopPolling = null;
    }
    if (reconnectTimer !== null) {
      window.clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  const attachListener = () => {
    if (disposed) return;
    cleanupCurrent();
    onStatusChange?.(failureCount > 0 ? 'Reconnecting' : 'Syncing', Date.now());

    const q = query(collection(db, collectionName), ...filters);
    unsubscribeSnapshot = onSnapshot(
      q,
      (snapshot) => {
        failureCount = 0;
        recordQuotaUsage('realtimeUnits', Math.max(1, snapshot.docChanges().length || 1));
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as T));
        callback(data);
        onStatusChange?.('Synced', Date.now());
      },
      (error) => {
        console.error(`Listener error on ${collectionName}:`, error);
        try {
          handleFirestoreError(error, OperationType.GET, collectionName);
        } catch {
          // Structured JSON error logged by handleFirestoreError
        }
        failureCount += 1;

        if (failureCount >= 3) {
          // Activate 30-second polling fallback after 3 consecutive listener failures
          onStatusChange?.('Reconnecting', Date.now());
          stopPolling = startPolling(collectionName, filters, callback, onStatusChange);
        } else {
          const delay =
            BACKOFF_DELAYS_MS[Math.min(failureCount - 1, BACKOFF_DELAYS_MS.length - 1)];
          onStatusChange?.('Reconnecting', Date.now());
          reconnectTimer = window.setTimeout(() => {
            attachListener();
          }, delay);
        }
      }
    );
  };

  attachListener();
  activeRefreshCallbacks.add(attachListener);

  return () => {
    disposed = true;
    activeRefreshCallbacks.delete(attachListener);
    cleanupCurrent();
  };
}
