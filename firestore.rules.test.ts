/**
 * Firestore Security Rules Verification Suite — Dirty Dozen Payloads
 * Verifies all 12 adversarial payloads return PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  docId: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on UserProfile',
    collection: 'users',
    docId: 'user_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'counsel@bbbale.com', email_verified: true },
    payload: {
      uid: 'user_1',
      username: 'Counsel',
      fullName: 'Counsel User',
      role: 'Counsel',
      branchId: 'HQ',
      mustChangePassword: false,
      status: 'Active',
      createdAt: '2026-10-20T00:00:00Z',
      isSuperAdmin: true,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Self-Assigned Principal Partner by Non-Admin',
    collection: 'users',
    docId: 'user_2',
    operation: 'create',
    auth: { uid: 'user_2', email: 'intruder@example.com', email_verified: true },
    payload: {
      uid: 'user_2',
      username: 'Principal Partner',
      fullName: 'Intruder',
      role: 'Principal Partner',
      branchId: 'GLOBAL',
      mustChangePassword: false,
      status: 'Active',
      createdAt: '2026-10-20T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Email Spoofing Without Verification',
    collection: 'branches',
    docId: 'BBB-LAG',
    operation: 'create',
    auth: { uid: 'spoof_uid', email: 'seedatshinge@gmail.com', email_verified: false },
    payload: {
      code: 'BBB-LAG',
      name: 'Lagos Branch',
      city: 'Lagos',
      state: 'Lagos',
      status: 'Active',
      authorUid: 'spoof_uid',
      createdAt: '2026-10-20T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'ID Poisoning with Oversized Document ID',
    collection: 'records',
    docId: 'a'.repeat(256),
    operation: 'create',
    auth: { uid: 'user_1', email: 'seedatshinge@gmail.com', email_verified: true },
    payload: {},
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Author UID Spoofing on FirmRecord',
    collection: 'records',
    docId: 'rec_1',
    operation: 'create',
    auth: { uid: 'user_A', email: 'seedatshinge@gmail.com', email_verified: true },
    payload: {
      module: 'matters',
      uniqueCode: 'BBB-LAG/MAT/2026/0001',
      title: 'Valid Title',
      branchId: 'BBB-LAG',
      branchCode: 'BBB-LAG',
      status: 'Open',
      authorUid: 'user_B',
      createdAt: '2026-10-20T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Branch Creation by Non-Principal Partner',
    collection: 'branches',
    docId: 'BBB-ABJ',
    operation: 'create',
    auth: { uid: 'counsel_1', email: 'counsel@bbbale.com', email_verified: true },
    payload: {
      code: 'BBB-ABJ',
      name: 'Abuja Chamber',
      city: 'Abuja',
      state: 'FCT',
      status: 'Active',
      authorUid: 'counsel_1',
      createdAt: '2026-10-20T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Value Poisoning on FirmRecord Title',
    collection: 'records',
    docId: 'rec_1',
    operation: 'update',
    auth: { uid: 'user_A', email: 'seedatshinge@gmail.com', email_verified: true },
    payload: {
      title: 'X'.repeat(5000),
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Immutable Field Tampering on FirmRecord',
    collection: 'records',
    docId: 'rec_1',
    operation: 'update',
    auth: { uid: 'user_A', email: 'seedatshinge@gmail.com', email_verified: true },
    payload: {
      uniqueCode: 'BBB-LAG/MAT/2026/9999',
      authorUid: 'other_uid',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Audit Log Tampering / Deletion',
    collection: 'audit_logs',
    docId: 'log_1',
    operation: 'delete',
    auth: { uid: 'user_A', email: 'seedatshinge@gmail.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Unauthenticated Private Record Scrape',
    collection: 'records',
    docId: 'private_rec_1',
    operation: 'get',
    auth: null,
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'PII Profile Leak Across Users',
    collection: 'users',
    docId: 'user_B',
    operation: 'get',
    auth: { uid: 'user_A', email: 'usera@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Update Gap / Undeclared Key on Branch',
    collection: 'branches',
    docId: 'BBB-LAG',
    operation: 'update',
    auth: { uid: 'admin_1', email: 'seedatshinge@gmail.com', email_verified: true },
    payload: {
      secretKey: 'injected',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
];
