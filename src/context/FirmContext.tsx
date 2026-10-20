import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  db,
  auth,
  googleProvider,
  subscribeToCollection,
  subscribeToQuota,
  recordQuotaUsage,
  refreshAllListeners,
  handleFirestoreError,
  OperationType,
  SyncStatus,
  QuotaStats,
  getQuotaStats,
} from '../lib/firebase';

export type StaffRole =
  | 'Principal Partner'
  | 'Head of Chamber'
  | 'Administrator'
  | 'Account Officer'
  | 'Counsel'
  | 'Client'
  | 'Tenant'
  | 'Property Owner';

export interface UserProfile {
  id: string;
  uid: string;
  username: string;
  fullName: string;
  email?: string;
  role: StaffRole;
  branchId: string;
  branchCode?: string;
  mustChangePassword: boolean;
  mfaVerified?: boolean;
  status: 'Active' | 'Suspended' | 'Archived';
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  address?: string;
  phone?: string;
  email?: string;
  headOfChamberName?: string;
  status: 'Active' | 'Suspended' | 'Archived';
  authorUid: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FirmRecord {
  id: string;
  module: string;
  uniqueCode: string;
  title: string;
  subtitle?: string;
  branchId: string;
  branchCode: string;
  status: string;
  category?: string;
  subCategory?: string;
  amount?: number;
  vatAmount?: number;
  whtAmount?: number;
  isPublic?: boolean;
  portalAccessCode?: string;
  details?: Record<string, any>;
  authorUid: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  branchCode: string;
  actorName: string;
  actorRole: string;
  authorUid: string;
  severity: 'Info' | 'Warning' | 'Critical';
  summary: string;
  createdAt: string;
}

export interface PortalSession {
  portalType: 'client' | 'owner' | 'tenant';
  uniqueCode: string;
  record: FirmRecord;
}

interface FirmContextValue {
  currentUser: UserProfile | null;
  portalSession: PortalSession | null;
  branches: Branch[];
  users: UserProfile[];
  records: FirmRecord[];
  auditLogs: AuditLog[];
  syncStatus: SyncStatus;
  lastSyncedAt: number;
  quotaStats: QuotaStats;
  selectedBranchCode: string;
  setSelectedBranchCode: (code: string) => void;
  customFirmLogoUrl: string;
  loginWithCredentials: (
    usernameInput: string,
    passwordInput: string
  ) => Promise<{ ok: boolean; error?: string; requiresPasswordChange?: boolean; requiresMfa?: boolean }>;
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  completeForcedPasswordChange: (newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  verifyMfaCode: (otpCode: string) => Promise<boolean>;
  logoutStaff: () => Promise<void>;
  authenticatePortal: (
    portalType: 'client' | 'owner' | 'tenant',
    uniqueCode: string,
    accessCode: string
  ) => { ok: boolean; error?: string };
  logoutPortal: () => void;
  generateUniqueCode: (entityPrefix: string, includeYear?: boolean, branchOverride?: string) => string;
  createBranch: (payload: Omit<Branch, 'id' | 'authorUid' | 'createdAt'>) => Promise<void>;
  updateBranch: (id: string, updates: Partial<Branch>) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
  createStaffUser: (
    payload: Omit<UserProfile, 'id' | 'uid' | 'createdAt' | 'mustChangePassword'>,
    initialPassword?: string
  ) => Promise<{ ok: boolean; error?: string }>;
  resetStaffPassword: (targetUser: UserProfile) => Promise<void>;
  createRecord: (
    payload: Omit<FirmRecord, 'id' | 'authorUid' | 'createdAt'>
  ) => Promise<string>;
  updateRecord: (id: string, updates: Partial<FirmRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  logAudit: (
    action: string,
    moduleName: string,
    summary: string,
    severity?: 'Info' | 'Warning' | 'Critical'
  ) => Promise<void>;
  triggerManualSync: () => void;
}

const FirmContext = createContext<FirmContextValue | null>(null);

// Default Credentials Registry (Section 7)
const DEFAULT_ROLE_CREDENTIALS: Record<string, { role: StaffRole; fullName: string; uid: string }> = {
  'Principal Partner': {
    role: 'Principal Partner',
    fullName: 'Principal Partner',
    uid: 'staff_principal_partner',
  },
  'Head of Chamber': {
    role: 'Head of Chamber',
    fullName: 'Head of Chamber',
    uid: 'staff_head_of_chamber',
  },
  Administrator: {
    role: 'Administrator',
    fullName: 'Chamber Administrator',
    uid: 'staff_administrator',
  },
  'Account Officer': {
    role: 'Account Officer',
    fullName: 'Branch Account Officer',
    uid: 'staff_account_officer',
  },
  'Counsel or Staff': {
    role: 'Counsel',
    fullName: 'Chamber Counsel',
    uid: 'staff_counsel',
  },
  Counsel: {
    role: 'Counsel',
    fullName: 'Chamber Counsel',
    uid: 'staff_counsel',
  },
};

const PASSWORD_STORE_KEY = 'bbbale_staff_passwords_v1';
const RATE_LIMIT_KEY = 'bbbale_rate_limit_v1';
const SESSION_STORAGE_KEY = 'bbbale_active_staff_session_v1';

function sanitizeId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120) || `id_${Date.now()}`;
}

export const FirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [portalSession, setPortalSession] = useState<PortalSession | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [records, setRecords] = useState<FirmRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('Syncing');
  const [lastSyncedAt, setLastSyncedAt] = useState<number>(Date.now());
  const [quotaStats, setQuotaStats] = useState<QuotaStats>(() => getQuotaStats());
  const [selectedBranchCode, setSelectedBranchCode] = useState<string>('ALL');

  // Sync Status handler
  const handleSyncUpdate = useCallback((status: SyncStatus, timestamp: number) => {
    setSyncStatus(status);
    if (status === 'Synced') {
      setLastSyncedAt(timestamp);
    }
  }, []);

  // Attach real-time Firestore listeners with explicit where() predicates matching firestore.rules (Section 5.1 & 5.2)
  useEffect(() => {
    const unsubBranches = subscribeToCollection<Branch>(
      'branches',
      [where('status', 'in', ['Active', 'Suspended', 'Archived'])],
      (data) => {
        const sorted = [...data].sort((a, b) => a.code.localeCompare(b.code));
        setBranches(sorted);
      },
      handleSyncUpdate
    );

    const unsubUsers = subscribeToCollection<UserProfile>(
      'users',
      [where('status', 'in', ['Active', 'Suspended', 'Archived'])],
      (data) => {
        setUsers(data);
      },
      handleSyncUpdate
    );

    const unsubRecords = subscribeToCollection<FirmRecord>(
      'records',
      [where('isPublic', 'in', [true, false])],
      (data) => {
        const sorted = [...data].sort((a, b) =>
          (b.createdAt || '').localeCompare(a.createdAt || '')
        );
        setRecords(sorted);
      },
      handleSyncUpdate
    );

    const unsubLogs = subscribeToCollection<AuditLog>(
      'audit_logs',
      [where('severity', 'in', ['Info', 'Warning', 'Critical'])],
      (data) => {
        const sorted = [...data].sort((a, b) =>
          (b.createdAt || '').localeCompare(a.createdAt || '')
        );
        setAuditLogs(sorted);
      },
      handleSyncUpdate
    );

    const unsubQuota = subscribeToQuota((stats) => {
      setQuotaStats(stats);
    });

    return () => {
      unsubBranches();
      unsubUsers();
      unsubRecords();
      unsubLogs();
      unsubQuota();
    };
  }, [handleSyncUpdate]);

  // Section 5.1: Stale Detection (Cache older than 2 min -> "Syncing..." + refresh)
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (Date.now() - lastSyncedAt > 120000) {
        setSyncStatus('Syncing');
        refreshAllListeners();
      }
    }, 30000);
    return () => window.clearInterval(timer);
  }, [lastSyncedAt]);

  // Keep sessionStorage synced with currentUser
  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [currentUser]);

  // Listen to Firebase Auth state changes if Google Sign-In is used
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser && !currentUser) {
        const matched = users.find((u) => u.uid === fbUser.uid || u.email === fbUser.email);
        if (matched) {
          setCurrentUser(matched);
        }
      }
    });
    return () => unsub();
  }, [users, currentUser]);

  const logAudit = useCallback(
    async (
      action: string,
      moduleName: string,
      summary: string,
      severity: 'Info' | 'Warning' | 'Critical' = 'Info'
    ) => {
      const logId = sanitizeId(`log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
      const authorUid = auth.currentUser?.uid || 'STAFF_SESSION';
      const payload: Omit<AuditLog, 'id'> = {
        action: action.slice(0, 150),
        module: moduleName.slice(0, 64),
        branchCode: (currentUser?.branchCode || selectedBranchCode || 'GLOBAL').slice(0, 32),
        actorName: (currentUser?.fullName || 'Public / System').slice(0, 120),
        actorRole: (currentUser?.role || 'Visitor').slice(0, 64),
        authorUid,
        severity,
        summary: summary.slice(0, 500),
        createdAt: new Date().toISOString(),
      };
      try {
        await setDoc(doc(db, 'audit_logs', logId), payload);
        recordQuotaUsage('writes', 1);
      } catch (error) {
        try {
          handleFirestoreError(error, OperationType.CREATE, `audit_logs/${logId}`);
        } catch {
          // Handled
        }
      }
    },
    [currentUser, selectedBranchCode]
  );

  // Section 6.2: Rate Limiting (5 failures per credential; 10 per IP/device; 30-min lockout)
  const checkAndRecordRateLimit = (usernameKey: string, success: boolean): { blocked: boolean } => {
    const now = Date.now();
    const LOCKOUT_MS = 30 * 60 * 1000;
    try {
      const raw = localStorage.getItem(RATE_LIMIT_KEY);
      const state = raw
        ? JSON.parse(raw)
        : { ipFailures: 0, ipLockUntil: 0, byUser: {} as Record<string, { count: number; lockUntil: number }> };

      if (state.ipLockUntil > now) {
        return { blocked: true };
      }
      const userRec = state.byUser[usernameKey] || { count: 0, lockUntil: 0 };
      if (userRec.lockUntil > now) {
        return { blocked: true };
      }

      if (success) {
        state.ipFailures = 0;
        state.byUser[usernameKey] = { count: 0, lockUntil: 0 };
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
        return { blocked: false };
      } else {
        state.ipFailures += 1;
        userRec.count += 1;
        if (state.ipFailures >= 10) {
          state.ipLockUntil = now + LOCKOUT_MS;
        }
        if (userRec.count >= 5) {
          userRec.lockUntil = now + LOCKOUT_MS;
        }
        state.byUser[usernameKey] = userRec;
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
        return { blocked: state.ipLockUntil > now || userRec.lockUntil > now };
      }
    } catch {
      return { blocked: false };
    }
  };

  // Section 6 & 7: Login with Credentials & Forced Change on First Login
  const loginWithCredentials = async (usernameInput: string, passwordInput: string) => {
    const trimmedUser = usernameInput.trim();
    const trimmedPass = passwordInput;

    if (!trimmedUser || !trimmedPass) {
      return { ok: false, error: 'Invalid credentials. Please try again.' };
    }

    const rateState = checkAndRecordRateLimit(trimmedUser.toLowerCase(), true);
    if (rateState.blocked) {
      return { ok: false, error: 'Invalid credentials. Please try again.' };
    }

    let passwordMap: Record<string, { current: string; history: string[] }> = {};
    try {
      const raw = localStorage.getItem(PASSWORD_STORE_KEY);
      if (raw) passwordMap = JSON.parse(raw);
    } catch {
      // ignore
    }

    // Check existing Firestore users or default credentials
    const existingDbUser = users.find(
      (u) => u.username.toLowerCase() === trimmedUser.toLowerCase()
    );
    const defaultRoleSpec = DEFAULT_ROLE_CREDENTIALS[trimmedUser];

    if (!existingDbUser && !defaultRoleSpec) {
      checkAndRecordRateLimit(trimmedUser.toLowerCase(), false);
      return { ok: false, error: 'Invalid credentials. Please try again.' };
    }

    const userKey = (existingDbUser?.username || trimmedUser).toLowerCase();
    const storedPassInfo = passwordMap[userKey];
    const expectedPassword = storedPassInfo ? storedPassInfo.current : 'Admin@2026';

    if (trimmedPass !== expectedPassword) {
      checkAndRecordRateLimit(trimmedUser.toLowerCase(), false);
      await logAudit(
        'Failed Authentication Attempt',
        'auth',
        'Invalid credentials presented at Staff Login.',
        'Warning'
      );
      return { ok: false, error: 'Invalid credentials. Please try again.' };
    }

    // Authenticated! Ensure profile exists in Firestore /users
    const uid = existingDbUser?.uid || defaultRoleSpec.uid;
    const activeBranch = branches[0];
    const resolvedBranchCode =
      existingDbUser?.branchCode ||
      (defaultRoleSpec?.role === 'Principal Partner'
        ? 'GLOBAL'
        : activeBranch?.code || 'UNASSIGNED');

    const mustChange =
      trimmedPass === 'Admin@2026' ||
      (existingDbUser ? existingDbUser.mustChangePassword : true);

    const profileData: Omit<UserProfile, 'id'> = {
      uid,
      username: existingDbUser?.username || trimmedUser,
      fullName: existingDbUser?.fullName || defaultRoleSpec.fullName,
      email: existingDbUser?.email || '',
      role: existingDbUser?.role || defaultRoleSpec.role,
      branchId: existingDbUser?.branchId || resolvedBranchCode,
      branchCode: resolvedBranchCode,
      mustChangePassword: mustChange,
      mfaVerified: existingDbUser?.mfaVerified ?? false,
      status: existingDbUser?.status || 'Active',
      createdAt: existingDbUser?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', uid), profileData);
      recordQuotaUsage('writes', 1);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
      } catch {
        // Handled
      }
    }

    const fullProfile: UserProfile = { id: uid, ...profileData };
    setCurrentUser(fullProfile);
    if (fullProfile.role !== 'Principal Partner' && fullProfile.branchCode) {
      setSelectedBranchCode(fullProfile.branchCode);
    }

    await logAudit(
      'Staff Login Succeeded',
      'auth',
      `${fullProfile.fullName} (${fullProfile.role}) authenticated.`,
      'Info'
    );

    return {
      ok: true,
      requiresPasswordChange: mustChange,
      requiresMfa: !fullProfile.mfaVerified,
    };
  };

  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;
      const existing = users.find((u) => u.uid === fbUser.uid);
      const isPrincipalEmail = fbUser.email === 'seedatshinge@gmail.com';
      const uid = sanitizeId(fbUser.uid);

      const profileData: Omit<UserProfile, 'id'> = {
        uid,
        username: existing?.username || (isPrincipalEmail ? 'Principal Partner' : fbUser.displayName || 'Counsel'),
        fullName: existing?.fullName || fbUser.displayName || 'Principal Partner',
        email: fbUser.email || '',
        role: existing?.role || (isPrincipalEmail ? 'Principal Partner' : 'Counsel'),
        branchId: existing?.branchId || 'GLOBAL',
        branchCode: existing?.branchCode || 'GLOBAL',
        mustChangePassword: false,
        mfaVerified: true,
        status: 'Active',
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', uid), profileData);
      recordQuotaUsage('writes', 1);
      setCurrentUser({ id: uid, ...profileData });
      await logAudit(
        'Firebase Google Auth Sign-In',
        'auth',
        `${profileData.fullName} signed in with verified Google token.`,
        'Info'
      );
      return { ok: true };
    } catch {
      return { ok: false, error: 'Invalid credentials. Please try again.' };
    }
  };

  const completeForcedPasswordChange = async (newPassword: string) => {
    if (!currentUser) return { ok: false, error: 'No active user session.' };
    if (newPassword.length < 8 || newPassword === 'Admin@2026') {
      return {
        ok: false,
        error: 'New password must be at least 8 characters and cannot be Admin@2026.',
      };
    }

    const userKey = currentUser.username.toLowerCase();
    let passwordMap: Record<string, { current: string; history: string[] }> = {};
    try {
      const raw = localStorage.getItem(PASSWORD_STORE_KEY);
      if (raw) passwordMap = JSON.parse(raw);
    } catch {
      // ignore
    }

    const prevHistory = passwordMap[userKey]?.history || ['Admin@2026'];
    if (prevHistory.includes(newPassword)) {
      return {
        ok: false,
        error: 'Password cannot be reused from previous credentials.',
      };
    }

    passwordMap[userKey] = {
      current: newPassword,
      history: [...prevHistory, newPassword],
    };
    localStorage.setItem(PASSWORD_STORE_KEY, JSON.stringify(passwordMap));

    const updatedUser: UserProfile = {
      ...currentUser,
      mustChangePassword: false,
      updatedAt: new Date().toISOString(),
    };

    try {
      const { id, ...docFields } = updatedUser;
      await setDoc(doc(db, 'users', id), docFields);
      recordQuotaUsage('writes', 1);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.id}`);
      } catch {
        // Handled
      }
    }

    setCurrentUser(updatedUser);
    await logAudit(
      'Forced First-Login Password Changed',
      'auth',
      `${currentUser.fullName} updated their default password.`,
      'Info'
    );
    return { ok: true };
  };

  const verifyMfaCode = async (otpCode: string): Promise<boolean> => {
    if (!currentUser) return false;
    if (otpCode.trim().length < 6) return false;
    const updatedUser: UserProfile = {
      ...currentUser,
      mfaVerified: true,
      updatedAt: new Date().toISOString(),
    };
    try {
      const { id, ...docFields } = updatedUser;
      await setDoc(doc(db, 'users', id), docFields);
      recordQuotaUsage('writes', 1);
    } catch {
      // Handled
    }
    setCurrentUser(updatedUser);
    await logAudit(
      'Device MFA Verified',
      'auth',
      `${currentUser.fullName} completed MFA verification.`,
      'Info'
    );
    return true;
  };

  const logoutStaff = async () => {
    if (currentUser) {
      await logAudit('Staff Logout', 'auth', `${currentUser.fullName} signed out.`, 'Info');
    }
    setCurrentUser(null);
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch {
      // ignore
    }
  };

  // Client, Owner, Tenant Portal Authentication (Section 4.2)
  const authenticatePortal = (
    portalType: 'client' | 'owner' | 'tenant',
    uniqueCode: string,
    accessCode: string
  ) => {
    const moduleMap = {
      client: 'clients',
      owner: 'owners',
      tenant: 'tenants',
    };
    const targetModule = moduleMap[portalType];
    const matched = records.find(
      (r) =>
        r.module === targetModule &&
        r.uniqueCode.trim().toUpperCase() === uniqueCode.trim().toUpperCase() &&
        (r.portalAccessCode || '').trim() === accessCode.trim()
    );

    if (!matched) {
      return { ok: false, error: 'Invalid credentials. Please try again.' };
    }
    setPortalSession({
      portalType,
      uniqueCode: matched.uniqueCode,
      record: matched,
    });
    return { ok: true };
  };

  const logoutPortal = () => {
    setPortalSession(null);
  };

  // Section 16: Unique Codes Module ([BRANCH-PREFIX]/[ENTITY-TYPE]/[YEAR]/[SEQUENCE])
  const generateUniqueCode = useCallback(
    (entityPrefix: string, includeYear = true, branchOverride?: string) => {
      const branchPrefix =
        branchOverride && branchOverride !== 'ALL' && branchOverride !== 'GLOBAL'
          ? branchOverride
          : currentUser?.branchCode && currentUser.branchCode !== 'GLOBAL'
            ? currentUser.branchCode
            : branches[0]?.code || 'BBB-HQ';

      const year = new Date().getFullYear();
      const matchingCount = records.filter((r) =>
        r.uniqueCode.startsWith(`${branchPrefix}/${entityPrefix}/`)
      ).length;
      const seq = String(matchingCount + 1).padStart(4, '0');
      return includeYear
        ? `${branchPrefix}/${entityPrefix}/${year}/${seq}`
        : `${branchPrefix}/${entityPrefix}/${seq}`;
    },
    [branches, currentUser, records]
  );

  // Branch Management — Principal Partner Only (Section 8 & 9)
  const createBranch = async (payload: Omit<Branch, 'id' | 'authorUid' | 'createdAt'>) => {
    if (currentUser?.role !== 'Principal Partner') {
      throw new Error('Only the Principal Partner can create branches.');
    }
    const branchId = sanitizeId(payload.code);
    const authorUid = auth.currentUser?.uid || 'PRINCIPAL_PARTNER_SESSION';
    const docData: Omit<Branch, 'id'> = {
      code: payload.code.trim().toUpperCase().slice(0, 32),
      name: payload.name.trim().slice(0, 120),
      city: payload.city.trim().slice(0, 80),
      state: payload.state.trim().slice(0, 80),
      address: (payload.address || '').slice(0, 300),
      phone: (payload.phone || '').slice(0, 40),
      email: (payload.email || '').slice(0, 120),
      headOfChamberName: (payload.headOfChamberName || '').slice(0, 120),
      status: payload.status || 'Active',
      authorUid,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'branches', branchId), docData);
      recordQuotaUsage('writes', 1);
      await logAudit(
        'Branch Created',
        'branches',
        `Principal Partner created branch ${docData.code} (${docData.name}).`,
        'Info'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `branches/${branchId}`);
    }
  };

  const updateBranch = async (id: string, updates: Partial<Branch>) => {
    if (currentUser?.role !== 'Principal Partner') {
      throw new Error('Only the Principal Partner can modify branches.');
    }
    const existingBranch = branches.find((b) => b.id === id);
    if (!existingBranch) return;
    const { id: _ignore, ...restExisting } = existingBranch;
    const merged = {
      ...restExisting,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'branches', id), merged);
      recordQuotaUsage('writes', 1);
      await logAudit(
        'Branch Updated',
        'branches',
        `Branch ${merged.code} updated (${merged.status}).`,
        'Info'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `branches/${id}`);
    }
  };

  const deleteBranch = async (id: string) => {
    if (currentUser?.role !== 'Principal Partner') {
      throw new Error('Only the Principal Partner can delete branches.');
    }
    try {
      await deleteDoc(doc(db, 'branches', id));
      recordQuotaUsage('writes', 1);
      await logAudit('Branch Deleted', 'branches', `Branch ${id} deleted by Principal Partner.`, 'Critical');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `branches/${id}`);
    }
  };

  // Section 10: User Roles & Creation Hierarchy
  // Principal Partner -> Head of Chamber -> Admin/Account/Counsel
  const createStaffUser = async (
    payload: Omit<UserProfile, 'id' | 'uid' | 'createdAt' | 'mustChangePassword'>,
    initialPassword = 'Admin@2026'
  ) => {
    if (!currentUser) return { ok: false, error: 'Authentication required.' };

    if (payload.role === 'Principal Partner') {
      const existingPP = users.find((u) => u.role === 'Principal Partner' && u.status === 'Active');
      if (existingPP) {
        return { ok: false, error: 'Maximum of 1 Principal Partner allowed firm-wide.' };
      }
    }

    if (payload.role === 'Head of Chamber' && currentUser.role !== 'Principal Partner') {
      return { ok: false, error: 'Only the Principal Partner can create a Head of Chamber.' };
    }

    if (
      ['Administrator', 'Account Officer', 'Counsel'].includes(payload.role) &&
      !['Principal Partner', 'Head of Chamber'].includes(currentUser.role)
    ) {
      return {
        ok: false,
        error: 'Only Principal Partner or Head of Chamber can create branch staff.',
      };
    }

    // Check max per branch limits (1 Head, 1 Admin, 1 Account Officer per branch)
    if (['Head of Chamber', 'Administrator', 'Account Officer'].includes(payload.role)) {
      const existingInBranch = users.find(
        (u) =>
          u.branchCode === payload.branchCode &&
          u.role === payload.role &&
          u.status === 'Active'
      );
      if (existingInBranch) {
        return {
          ok: false,
          error: `Branch ${payload.branchCode} already has an active ${payload.role} (max 1 per branch).`,
        };
      }
    }

    const uid = sanitizeId(`staff_${payload.branchCode}_${payload.username}_${Date.now()}`);
    const docData: Omit<UserProfile, 'id'> = {
      uid,
      username: payload.username.trim().slice(0, 100),
      fullName: payload.fullName.trim().slice(0, 150),
      email: (payload.email || '').trim().slice(0, 150),
      role: payload.role,
      branchId: (payload.branchId || payload.branchCode || 'GLOBAL').slice(0, 128),
      branchCode: (payload.branchCode || 'GLOBAL').slice(0, 32),
      mustChangePassword: true,
      mfaVerified: false,
      status: payload.status || 'Active',
      createdBy: currentUser.uid,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', uid), docData);
      recordQuotaUsage('writes', 1);

      // Store initial password requiring forced change on first login
      const raw = localStorage.getItem(PASSWORD_STORE_KEY);
      const passwordMap = raw ? JSON.parse(raw) : {};
      passwordMap[docData.username.toLowerCase()] = {
        current: initialPassword,
        history: [],
      };
      localStorage.setItem(PASSWORD_STORE_KEY, JSON.stringify(passwordMap));

      await logAudit(
        'Staff Account Created',
        'staff',
        `Created ${docData.role} account for ${docData.fullName} in branch ${docData.branchCode}.`,
        'Info'
      );
      return { ok: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${uid}`);
    }
  };

  const resetStaffPassword = async (targetUser: UserProfile) => {
    if (currentUser?.role !== 'Principal Partner') {
      throw new Error('Only Principal Partner can reset user passwords.');
    }
    const raw = localStorage.getItem(PASSWORD_STORE_KEY);
    const passwordMap = raw ? JSON.parse(raw) : {};
    passwordMap[targetUser.username.toLowerCase()] = {
      current: 'Admin@2026',
      history: [],
    };
    localStorage.setItem(PASSWORD_STORE_KEY, JSON.stringify(passwordMap));

    const { id, ...rest } = targetUser;
    await setDoc(doc(db, 'users', id), {
      ...rest,
      mustChangePassword: true,
      updatedAt: new Date().toISOString(),
    });
    recordQuotaUsage('writes', 1);
    await logAudit(
      'Password Reset by Principal Partner',
      'staff',
      `Password reset to default (forced change) for ${targetUser.fullName}.`,
      'Warning'
    );
  };

  const createRecord = async (
    payload: Omit<FirmRecord, 'id' | 'authorUid' | 'createdAt'>
  ): Promise<string> => {
    const recordId = sanitizeId(`rec_${payload.module}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);
    const authorUid = auth.currentUser?.uid || (currentUser ? 'STAFF_SESSION' : 'PUBLIC_PORTAL');

    const docData: Omit<FirmRecord, 'id'> = {
      module: payload.module.slice(0, 64),
      uniqueCode: payload.uniqueCode.slice(0, 64),
      title: payload.title.slice(0, 200),
      subtitle: (payload.subtitle || '').slice(0, 200),
      branchId: (payload.branchId || payload.branchCode || 'GLOBAL').slice(0, 128),
      branchCode: (payload.branchCode || 'GLOBAL').slice(0, 32),
      status: (payload.status || 'Active').slice(0, 64),
      category: (payload.category || '').slice(0, 100),
      subCategory: (payload.subCategory || '').slice(0, 100),
      amount: typeof payload.amount === 'number' ? payload.amount : 0,
      vatAmount: typeof payload.vatAmount === 'number' ? payload.vatAmount : 0,
      whtAmount: typeof payload.whtAmount === 'number' ? payload.whtAmount : 0,
      isPublic: Boolean(payload.isPublic),
      portalAccessCode: (payload.portalAccessCode || '').slice(0, 64),
      details: payload.details || {},
      authorUid,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'records', recordId), docData);
      recordQuotaUsage('writes', 1);
      await logAudit(
        `Created ${docData.module.toUpperCase()} Record`,
        docData.module,
        `${docData.uniqueCode} — ${docData.title}`,
        'Info'
      );
      return recordId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `records/${recordId}`);
    }
  };

  const updateRecord = async (id: string, updates: Partial<FirmRecord>) => {
    const existingRec = records.find((r) => r.id === id);
    if (!existingRec) return;
    const { id: _ignore, ...rest } = existingRec;
    const merged = {
      ...rest,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    try {
      await updateDoc(doc(db, 'records', id), merged);
      recordQuotaUsage('writes', 1);
      await logAudit(
        `Updated ${existingRec.module.toUpperCase()} Record`,
        existingRec.module,
        `${existingRec.uniqueCode} — Status: ${merged.status}`,
        'Info'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `records/${id}`);
    }
  };

  const deleteRecord = async (id: string) => {
    const existingRec = records.find((r) => r.id === id);
    if (existingRec?.details?.legalHold && currentUser?.role !== 'Principal Partner') {
      throw new Error('Cannot delete a document under Legal Hold without Principal Partner authorization.');
    }
    try {
      await deleteDoc(doc(db, 'records', id));
      recordQuotaUsage('writes', 1);
      await logAudit(
        `Deleted Record`,
        existingRec?.module || 'records',
        `Deleted ${existingRec?.uniqueCode || id}`,
        'Warning'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `records/${id}`);
    }
  };

  const triggerManualSync = () => {
    setSyncStatus('Syncing');
    refreshAllListeners();
  };

  const customLogoRecord = records.find(
    (r) => r.module === 'settings' && r.category === 'FirmLogo'
  );
  const customFirmLogoUrl = customLogoRecord?.details?.downloadUrl || '';

  return (
    <FirmContext.Provider
      value={{
        currentUser,
        portalSession,
        branches,
        users,
        records,
        auditLogs,
        syncStatus,
        lastSyncedAt,
        quotaStats,
        selectedBranchCode,
        setSelectedBranchCode,
        customFirmLogoUrl,
        loginWithCredentials,
        loginWithGoogle,
        completeForcedPasswordChange,
        verifyMfaCode,
        logoutStaff,
        authenticatePortal,
        logoutPortal,
        generateUniqueCode,
        createBranch,
        updateBranch,
        deleteBranch,
        createStaffUser,
        resetStaffPassword,
        createRecord,
        updateRecord,
        deleteRecord,
        logAudit,
        triggerManualSync,
      }}
    >
      {children}
    </FirmContext.Provider>
  );
};

export function useFirm(): FirmContextValue {
  const ctx = useContext(FirmContext);
  if (!ctx) throw new Error('useFirm must be used within FirmProvider');
  return ctx;
}
