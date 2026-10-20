# B. B. BALE & CO CHAMBERS — Firestore Security Specification

## 1. Data Invariants
1. **Default-Deny Catch-All**: All unmatched paths in `/databases/{database}/documents/{document=**}` are strictly denied (`allow read, write: if false;`).
2. **Path Variable Hardening**: Every document ID (`{userId}`, `{branchId}`, `{recordId}`, `{logId}`) must match `^[a-zA-Z0-9_\-]+$` and be `<= 128` characters.
3. **Identity & Author Integrity**: Every write must originate from an authenticated user (`request.auth != null`) whose `authorUid` or `uid` matches `request.auth.uid`.
4. **Role & Privilege Escalation Guard**: Only the Principal Partner (`isPrincipalPartner()` or bootstrapped admin email `seedatshinge@gmail.com` with `email_verified == true`) can create/modify `/branches/{branchId}` or assign the `"Principal Partner"` / `"Head of Chamber"` role.
5. **Strict Schema & Key Validation**: Every `create` and `update` must pass `isValidUserProfile()`, `isValidBranch()`, `isValidFirmRecord()`, or `isValidAuditLog()` with strict `hasAll` and `hasOnly` key checks and string `.size()` bounds.
6. **Immutable Audit Trail**: `/audit_logs/{logId}` documents can be created by authenticated users with valid schema, but can NEVER be updated or deleted (`allow update, delete: if false;`).
7. **Branch & Public Isolation**: Public visitors can only read `/records/{recordId}` where `resource.data.isPublic == true`. Authenticated staff can read records scoped to their branch (`resource.data.branchId`) or if they are Principal Partner / owner.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Payload 1 (Shadow Field Injection on UserProfile)**: `{ uid: "user_1", username: "Counsel", fullName: "Test", role: "Counsel", branchId: "HQ", mustChangePassword: false, status: "Active", createdAt: "2026-10-20T00:00:00Z", isSuperAdmin: true }` -> Rejected by `.keys().hasOnly(...)`.
2. **Payload 2 (Self-Assigned Principal Partner by Non-Admin)**: Unprivileged user creates `/users/user_2` with `role: "Principal Partner"` -> Rejected by role gate.
3. **Payload 3 (Email Spoofing Without Verification)**: Token with `email: "seedatshinge@gmail.com"` and `email_verified: false` attempting admin write -> Rejected by `request.auth.token.email_verified == true`.
4. **Payload 4 (ID Poisoning / 2KB Document ID)**: Creating `/records/<2000-char-id>` -> Rejected by `isValidId(recordId)`.
5. **Payload 5 (Author UID Spoofing on FirmRecord)**: User `uid_A` creates `/records/rec_1` with `authorUid: "uid_B"` -> Rejected by `data.authorUid == request.auth.uid`.
6. **Payload 6 (Branch Creation by Counsel)**: User with role `"Counsel"` creates `/branches/BBB-ABJ` -> Rejected by `isAdmin()`.
7. **Payload 7 (Value Poisoning on FirmRecord Title)**: Updating `title` to a 50,000-character string or boolean -> Rejected by `isValidFirmRecord(incoming())` size & type check.
8. **Payload 8 (Immutable Field Tampering on FirmRecord)**: Updating `createdAt` or `authorUid` or `uniqueCode` on `/records/rec_1` -> Rejected by immutability checks.
9. **Payload 9 (Audit Log Tampering / Deletion)**: Attempting `update` or `delete` on `/audit_logs/log_1` -> Rejected by `allow update, delete: if false;`.
10. **Payload 10 (Unauthenticated Private Record Scrape)**: Unauthenticated user querying `/records` where `isPublic == false` -> Rejected by `resource.data.isPublic == true || isSignedIn()`.
11. **Payload 11 (PII Profile Leak)**: User `uid_A` attempting `get` on `/users/uid_B` without admin privileges -> Rejected by `request.auth.uid == userId || isAdmin()`.
12. **Payload 12 (Update Gap / Unlisted Key Modification)**: Updating `/branches/br_1` with an undeclared field `secretKey: "123"` -> Rejected by `isValidBranch(incoming())` and `affectedKeys().hasOnly(...)`.
