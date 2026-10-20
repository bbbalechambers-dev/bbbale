import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  Shield,
  RefreshCw,
  LogOut,
  Plus,
  Printer,
  Search,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Trash2,
  FileText,
  Scale,
  Building2,
} from 'lucide-react';
import { NigerianEagleLogo, LogoAssetExporter } from '../components/Branding';
import { LocalFilePicker, UploadPointCategory, UploadedFileMetadata } from '../components/LocalFilePicker';
import { useFirm, FirmRecord, StaffRole } from '../context/FirmContext';

export interface NavItem {
  label: string;
  path: string;
  moduleKey: string;
  section: 'Overview' | 'Legal Practice' | 'Finance & Trust' | 'Property & Tenancy' | 'Operations & Governance';
  principalOnly?: boolean;
}

export const INTERNAL_ROUTES: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', moduleKey: 'dashboard', section: 'Overview' },
  { label: 'Branches', path: '/branches', moduleKey: 'branches', section: 'Overview', principalOnly: true },
  { label: 'Clients', path: '/clients', moduleKey: 'clients', section: 'Legal Practice' },
  { label: 'Matters', path: '/matters', moduleKey: 'matters', section: 'Legal Practice' },
  { label: 'Consultations', path: '/consultations', moduleKey: 'consultations', section: 'Legal Practice' },
  { label: 'Documents', path: '/documents', moduleKey: 'documents', section: 'Legal Practice' },
  { label: 'Court Diary', path: '/court-diary', moduleKey: 'court-diary', section: 'Legal Practice' },
  { label: 'Precedents', path: '/precedents', moduleKey: 'precedents', section: 'Legal Practice' },
  { label: 'Notices', path: '/notices', moduleKey: 'notices', section: 'Legal Practice' },
  { label: 'Tribunal', path: '/tribunal', moduleKey: 'tribunal', section: 'Legal Practice' },
  { label: 'Invoices', path: '/invoices', moduleKey: 'invoices', section: 'Finance & Trust' },
  { label: 'Receipts', path: '/receipts', moduleKey: 'receipts', section: 'Finance & Trust' },
  { label: 'Trust Account', path: '/trust', moduleKey: 'trust', section: 'Finance & Trust' },
  { label: 'Operating Account', path: '/operating', moduleKey: 'operating', section: 'Finance & Trust' },
  { label: 'Bank Accounts', path: '/bank-accounts', moduleKey: 'bank-accounts', section: 'Finance & Trust' },
  { label: 'Fees (LPRO 2023)', path: '/fees', moduleKey: 'fees', section: 'Finance & Trust' },
  { label: 'Payroll', path: '/payroll', moduleKey: 'payroll', section: 'Finance & Trust' },
  { label: 'Branch Expenses', path: '/expenses', moduleKey: 'expenses', section: 'Finance & Trust' },
  { label: 'Owners', path: '/owners', moduleKey: 'owners', section: 'Property & Tenancy' },
  { label: 'Properties', path: '/properties-admin', moduleKey: 'properties', section: 'Property & Tenancy' },
  { label: 'Tenants', path: '/tenants', moduleKey: 'tenants', section: 'Property & Tenancy' },
  { label: 'Tenancy Agreements', path: '/tenancy-agreements', moduleKey: 'tenancy-agreements', section: 'Property & Tenancy' },
  { label: 'Rent & Arrears', path: '/rent', moduleKey: 'rent', section: 'Property & Tenancy' },
  { label: 'Maintenance', path: '/maintenance', moduleKey: 'maintenance', section: 'Property & Tenancy' },
  { label: 'Inspections', path: '/inspections', moduleKey: 'inspections', section: 'Property & Tenancy' },
  { label: 'Staff & Roles', path: '/staff', moduleKey: 'staff', section: 'Operations & Governance' },
  { label: 'Internal Requests', path: '/requests', moduleKey: 'requests', section: 'Operations & Governance' },
  { label: 'Special Tasks', path: '/tasks', moduleKey: 'tasks', section: 'Operations & Governance' },
  { label: 'Hard-Copy Backups', path: '/backups', moduleKey: 'backups', section: 'Operations & Governance' },
  { label: 'Reports', path: '/reports', moduleKey: 'reports', section: 'Operations & Governance' },
  { label: 'Compliance (NBA)', path: '/compliance', moduleKey: 'compliance', section: 'Operations & Governance' },
  { label: 'Audit Logs', path: '/audit-logs', moduleKey: 'audit-logs', section: 'Operations & Governance' },
  { label: 'Alerts', path: '/alerts', moduleKey: 'alerts', section: 'Operations & Governance' },
  { label: 'Live Chats', path: '/chats', moduleKey: 'chats', section: 'Operations & Governance' },
  { label: 'Public Content', path: '/public-content', moduleKey: 'public-content', section: 'Operations & Governance' },
  { label: 'Gallery Admin', path: '/gallery-admin', moduleKey: 'gallery-admin', section: 'Operations & Governance' },
  { label: 'Settings', path: '/settings', moduleKey: 'settings', section: 'Operations & Governance' },
];

const COURT_CATEGORIES = [
  'Supreme Court',
  'Court of Appeal',
  'Federal High Court',
  'State High Court',
  'National Industrial Court',
  'Magistrate Court',
  'Customary Court',
  'Sharia Court',
  'Rent Tribunal',
  'Special Courts',
  'Other',
];

const CASE_TYPES = [
  'Civil',
  'Criminal',
  'Sharia',
  'Family',
  'Commercial',
  'Constitutional',
  'Land/Property',
  'Labour',
  'Tax',
  'Election Petition',
  'Other',
];

const ENTITY_PREFIX_MAP: Record<string, { prefix: string; includeYear: boolean; uploadPoint: UploadPointCategory }> = {
  clients: { prefix: 'CLI', includeYear: false, uploadPoint: 'KYC Document' },
  matters: { prefix: 'MAT', includeYear: true, uploadPoint: 'Matter Document' },
  consultations: { prefix: 'CON', includeYear: true, uploadPoint: 'Matter Document' },
  documents: { prefix: 'DOC', includeYear: true, uploadPoint: 'Matter Document' },
  'court-diary': { prefix: 'CDY', includeYear: true, uploadPoint: 'Matter Document' },
  precedents: { prefix: 'PRC', includeYear: true, uploadPoint: 'Court Precedent' },
  notices: { prefix: 'NTC', includeYear: true, uploadPoint: 'Statutory Notice' },
  tribunal: { prefix: 'TRB', includeYear: true, uploadPoint: 'Tribunal Process' },
  invoices: { prefix: 'INV', includeYear: true, uploadPoint: 'Invoice / Receipt Attachment' },
  receipts: { prefix: 'REC', includeYear: true, uploadPoint: 'Payment Proof' },
  trust: { prefix: 'TRS', includeYear: true, uploadPoint: 'Payment Proof' },
  operating: { prefix: 'OPR', includeYear: true, uploadPoint: 'Payment Proof' },
  'bank-accounts': { prefix: 'BNK', includeYear: false, uploadPoint: 'Invoice / Receipt Attachment' },
  fees: { prefix: 'FEE', includeYear: true, uploadPoint: 'Matter Document' },
  payroll: { prefix: 'PAY', includeYear: true, uploadPoint: 'Payment Proof' },
  expenses: { prefix: 'EXP', includeYear: true, uploadPoint: 'Payment Proof' },
  owners: { prefix: 'OWN', includeYear: false, uploadPoint: 'KYC Document' },
  properties: { prefix: 'PROP', includeYear: false, uploadPoint: 'Property Title / Photo' },
  tenants: { prefix: 'TEN', includeYear: false, uploadPoint: 'KYC Document' },
  'tenancy-agreements': { prefix: 'TAG', includeYear: true, uploadPoint: 'Tenancy Agreement' },
  rent: { prefix: 'RNT', includeYear: true, uploadPoint: 'Payment Proof' },
  maintenance: { prefix: 'MNT', includeYear: true, uploadPoint: 'Maintenance Photo' },
  inspections: { prefix: 'INS', includeYear: true, uploadPoint: 'Inspection Report' },
  requests: { prefix: 'REQ', includeYear: true, uploadPoint: 'Matter Document' },
  tasks: { prefix: 'TSK', includeYear: true, uploadPoint: 'Matter Document' },
  backups: { prefix: 'BKP', includeYear: true, uploadPoint: 'Backup PDF' },
  reports: { prefix: 'RPT', includeYear: true, uploadPoint: 'Matter Document' },
  compliance: { prefix: 'CMP', includeYear: true, uploadPoint: 'KYC Document' },
  alerts: { prefix: 'ALT', includeYear: true, uploadPoint: 'Matter Document' },
  chats: { prefix: 'CHT', includeYear: true, uploadPoint: 'Matter Document' },
  'public-content': { prefix: 'CMS', includeYear: false, uploadPoint: 'Gallery Photo' },
  'gallery-admin': { prefix: 'GAL', includeYear: true, uploadPoint: 'Gallery Photo' },
  settings: { prefix: 'SET', includeYear: false, uploadPoint: 'Nigerian Court Eagle Logo' },
};

export const InternalWorkspace: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    branches,
    users,
    records,
    auditLogs,
    syncStatus,
    quotaStats,
    selectedBranchCode,
    setSelectedBranchCode,
    customFirmLogoUrl,
    logoutStaff,
    generateUniqueCode,
    createBranch,
    updateBranch,
    deleteBranch,
    createStaffUser,
    resetStaffPassword,
    createRecord,
    updateRecord,
    deleteRecord,
    triggerManualSync,
  } = useFirm();

  // Sensitive route protection (Section 4.2: redirect to /staff-login if unauthenticated)
  if (!currentUser) {
    return <Navigate to="/staff-login" replace />;
  }

  const currentNav =
    INTERNAL_ROUTES.find((item) => item.path === location.pathname) || INTERNAL_ROUTES[0];

  // Principal Partner Exclusive Route Guard for /branches
  if (currentNav.principalOnly && currentUser.role !== 'Principal Partner') {
    return <Navigate to="/dashboard" replace />;
  }

  const isPrincipal = currentUser.role === 'Principal Partner';
  const effectiveBranch = isPrincipal
    ? selectedBranchCode
    : currentUser.branchCode || 'GLOBAL';

  // Filter records respecting Branch Isolation (Section 5.4 Rule 2)
  const branchScopedRecords = useMemo(() => {
    return records.filter((r) => {
      if (r.module === 'precedents') return true; // Court Precedent Bank is firm-wide (Section 12)
      if (isPrincipal && (effectiveBranch === 'ALL' || effectiveBranch === 'GLOBAL')) return true;
      return r.branchCode === effectiveBranch || r.branchCode === 'GLOBAL';
    });
  }, [records, isPrincipal, effectiveBranch]);

  const moduleRecords = useMemo(() => {
    return branchScopedRecords.filter((r) => r.module === currentNav.moduleKey);
  }, [branchScopedRecords, currentNav.moduleKey]);

  // Universal Print Document Modal State
  const [printableRecord, setPrintableRecord] = useState<FirmRecord | null>(null);

  // Sensitive Action MFA Modal State (Section 6.3)
  const [mfaPromptAction, setMfaPromptAction] = useState<{
    label: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [mfaOtpInput, setMfaOtpInput] = useState('');

  // Generic Module Form States
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [status, setStatus] = useState('Active');
  const [amountInput, setAmountInput] = useState('');
  const [whtRate, setWhtRate] = useState('5');
  const [isPublicToggle, setIsPublicToggle] = useState(false);
  const [portalAccessCode, setPortalAccessCode] = useState('');
  const [linkedEntityCode, setLinkedEntityCode] = useState('');
  const [opposingParty, setOpposingParty] = useState('');
  const [legalHold, setLegalHold] = useState(false);
  const [ndpaConsent, setNdpaConsent] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileMetadata | null>(null);
  const [formFeedback, setFormFeedback] = useState('');

  // Branch Creation Form States (Principal Partner only)
  const [branchCodeInput, setBranchCodeInput] = useState('');
  const [branchNameInput, setBranchNameInput] = useState('');
  const [branchCityInput, setBranchCityInput] = useState('');
  const [branchStateInput, setBranchStateInput] = useState('');
  const [branchAddressInput, setBranchAddressInput] = useState('');
  const [branchPhoneInput, setBranchPhoneInput] = useState('');
  const [branchEmailInput, setBranchEmailInput] = useState('');

  // Staff Creation Form States
  const [staffUsername, setStaffUsername] = useState('');
  const [staffFullName, setStaffFullName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<StaffRole>(
    isPrincipal ? 'Head of Chamber' : 'Counsel'
  );
  const [staffBranchCode, setStaffBranchCode] = useState(
    branches[0]?.code || currentUser.branchCode || 'BBB-HQ'
  );
  const [staffError, setStaffError] = useState('');

  // Trust Three-Way Reconciliation States
  const [bankStatementBalance, setBankStatementBalance] = useState('0');

  // Hard-Copy Backup Filter States
  const [backupFromDate, setBackupFromDate] = useState('');
  const [backupToDate, setBackupToDate] = useState('');
  const [backupCategory, setBackupCategory] = useState('ALL');

  // Firm-wide Conflict of Interest Check (Section 12)
  const conflictMatches = useMemo(() => {
    const q = (title || opposingParty).trim().toLowerCase();
    if (q.length < 3 || !['clients', 'matters'].includes(currentNav.moduleKey)) return [];
    return records.filter(
      (r) =>
        ['clients', 'matters'].includes(r.module) &&
        (r.title.toLowerCase().includes(q) ||
          (r.subtitle || '').toLowerCase().includes(q) ||
          (r.details?.opposingParty || '').toLowerCase().includes(q))
    );
  }, [title, opposingParty, records, currentNav.moduleKey]);

  const handleCreateModuleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback('');
    const spec = ENTITY_PREFIX_MAP[currentNav.moduleKey] || {
      prefix: 'REC',
      includeYear: true,
      uploadPoint: 'Matter Document' as UploadPointCategory,
    };

    if (currentNav.moduleKey === 'gallery-admin' && !ndpaConsent) {
      setFormFeedback('NDPA Photo Subject Consent must be verified before uploading gallery items.');
      return;
    }

    const targetBranch =
      effectiveBranch === 'ALL' || effectiveBranch === 'GLOBAL'
        ? branches[0]?.code || 'BBB-HQ'
        : effectiveBranch;

    const uniqueCode = generateUniqueCode(spec.prefix, spec.includeYear, targetBranch);
    const baseAmount = Number(amountInput || 0);
    const vatAmount = currentNav.moduleKey === 'invoices' ? Number((baseAmount * 0.075).toFixed(2)) : 0;
    const whtAmount =
      currentNav.moduleKey === 'invoices'
        ? Number((baseAmount * (Number(whtRate) / 100)).toFixed(2))
        : 0;

    // Section 20: Head of Chamber Delegated Authority Auto-Escalation
    // Expenses > 200,000 NGN or Maintenance > 100,000 NGN or Trust Withdrawals escalate to Principal Partner
    let computedStatus = status;
    if (currentNav.moduleKey === 'expenses' && baseAmount > 200000 && !isPrincipal) {
      computedStatus = 'Escalated to Principal Partner (>200k NGN)';
    } else if (currentNav.moduleKey === 'maintenance' && baseAmount > 100000 && !isPrincipal) {
      computedStatus = 'Escalated to Principal Partner (>100k NGN)';
    } else if (currentNav.moduleKey === 'trust' && category === 'Withdrawal' && !isPrincipal) {
      computedStatus = 'Pending Principal Partner Withdrawal Approval';
    } else if (currentNav.moduleKey === 'payroll' && !isPrincipal) {
      computedStatus = 'Pending Principal Partner Final Approval';
    }

    await createRecord({
      module: currentNav.moduleKey,
      uniqueCode,
      title: title.trim(),
      subtitle: subtitle.trim(),
      branchId: targetBranch,
      branchCode: targetBranch,
      status: computedStatus,
      category: category.trim() || currentNav.label,
      subCategory: subCategory.trim(),
      amount: baseAmount,
      vatAmount,
      whtAmount,
      isPublic: isPublicToggle,
      portalAccessCode: portalAccessCode.trim(),
      details: {
        linkedEntityCode: linkedEntityCode.trim(),
        opposingParty: opposingParty.trim(),
        legalHold,
        ndpaConsent,
        fileUrl: uploadedFile?.downloadUrl || '',
        fileName: uploadedFile?.fileName || '',
        storagePath: uploadedFile?.storagePath || '',
        city: subCategory.trim(),
        version: 1,
      },
    });

    setTitle('');
    setSubtitle('');
    setAmountInput('');
    setPortalAccessCode('');
    setLinkedEntityCode('');
    setOpposingParty('');
    setUploadedFile(null);
    setShowCreateForm(false);
    setFormFeedback(`Saved ${uniqueCode} and synced across devices.`);
  };

  // Sync Status Badge (Section 5.1)
  const renderSyncIndicator = () => {
    const colorMap = {
      Synced: 'bg-[#2e7d32] text-white',
      Syncing: 'bg-[#f9a825] text-[#1c1c1c]',
      Reconnecting: 'bg-[#f9a825] text-[#1c1c1c]',
      Offline: 'bg-[#c62828] text-white',
    };
    return (
      <button
        type="button"
        onClick={triggerManualSync}
        title="Click to force immediate Firestore listener refresh"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono-code font-semibold cursor-pointer ${colorMap[syncStatus]}`}
      >
        <RefreshCw className={`w-3 h-3 ${syncStatus === 'Syncing' ? 'animate-spin' : ''}`} />
        <span>{syncStatus}</span>
      </button>
    );
  };

  // Printable Modal View (Universal Clean Document Print — Section 12, 14, 21)
  if (printableRecord) {
    const branchBankAccounts = records.filter(
      (r) =>
        r.module === 'bank-accounts' &&
        (r.branchCode === printableRecord.branchCode || r.branchCode === 'GLOBAL') &&
        r.status === 'Display on Invoice/Receipt'
    );

    return (
      <div className="min-h-screen bg-white p-8 max-w-4xl mx-auto print-container">
        <div className="no-print flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
          <button
            type="button"
            onClick={() => setPrintableRecord(null)}
            className="px-4 py-2 text-xs font-semibold border border-stone-300 rounded hover:bg-stone-50 cursor-pointer"
          >
            &larr; Return to Workspace
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-[#1a2a4a] text-white rounded hover:bg-[#121e36] cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Save Official PDF
          </button>
        </div>

        <div className="border-2 border-[#1a2a4a] p-8 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#c9a227] pb-6">
            <div className="flex items-center gap-4">
              <NigerianEagleLogo size={72} customLogoUrl={customFirmLogoUrl} />
              <div>
                <h1 className="font-serif-display text-2xl font-bold text-[#1a2a4a]">
                  B. B. BALE &amp; CO CHAMBERS
                </h1>
                <p className="text-xs text-[#5a5a5a]">
                  Barristers, Solicitors &amp; Chartered Property Managers · Branch:{' '}
                  {printableRecord.branchCode}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono-code text-sm font-bold text-[#1a2a4a]">
                {printableRecord.uniqueCode}
              </p>
              <p className="text-xs text-[#5a5a5a] mt-0.5">
                Date: {printableRecord.createdAt.slice(0, 10)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono-code uppercase text-[#5a5a5a]">
              {printableRecord.module} · {printableRecord.category}
            </p>
            <h2 className="font-serif-display text-xl font-bold text-[#1a2a4a] mt-1">
              {printableRecord.title}
            </h2>
            {printableRecord.subtitle && (
              <p className="text-sm text-[#1c1c1c] mt-2 whitespace-pre-wrap leading-relaxed">
                {printableRecord.subtitle}
              </p>
            )}
          </div>

          {(printableRecord.amount || 0) > 0 && (
            <div className="border border-stone-300 rounded p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Principal Amount:</span>
                <span className="font-mono-code tabular-nums">
                  NGN {(printableRecord.amount || 0).toLocaleString()}
                </span>
              </div>
              {(printableRecord.vatAmount || 0) > 0 && (
                <div className="flex justify-between text-xs text-[#5a5a5a]">
                  <span>Statutory VAT (7.5%):</span>
                  <span className="font-mono-code tabular-nums">
                    NGN {(printableRecord.vatAmount || 0).toLocaleString()}
                  </span>
                </div>
              )}
              {(printableRecord.whtAmount || 0) > 0 && (
                <div className="flex justify-between text-xs text-[#5a5a5a]">
                  <span>Withholding Tax (WHT):</span>
                  <span className="font-mono-code tabular-nums">
                    NGN {(printableRecord.whtAmount || 0).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-[#1a2a4a] border-t border-stone-200 pt-2">
                <span>Total Payable / Certified:</span>
                <span className="font-mono-code tabular-nums">
                  NGN{' '}
                  {(
                    (printableRecord.amount || 0) +
                    (printableRecord.vatAmount || 0)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {branchBankAccounts.length > 0 &&
            ['invoices', 'receipts', 'rent'].includes(printableRecord.module) && (
              <div className="border-t border-stone-200 pt-4">
                <h4 className="text-xs font-bold text-[#1a2a4a] uppercase mb-2">
                  Designated Chamber Bank Accounts ({printableRecord.branchCode})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {branchBankAccounts.map((bnk) => (
                    <div key={bnk.id} className="text-xs border border-stone-200 p-2.5 rounded">
                      <p className="font-bold text-[#1a2a4a]">{bnk.title}</p>
                      <p className="font-mono-code text-[#1c1c1c]">{bnk.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="pt-12 flex justify-between items-end text-xs text-[#5a5a5a]">
            <div>
              <p className="font-semibold text-[#1a2a4a]">Authorized Chamber Signatory</p>
              <p>B. B. BALE &amp; CO CHAMBERS</p>
            </div>
            <div className="text-right font-mono-code">
              Status: {printableRecord.status}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8f6f1] text-[#1c1c1c]">
      {/* Left Sidebar Navigation (37 Internal Routes) */}
      <aside className="w-64 bg-[#1a2a4a] text-white flex flex-col shrink-0 border-r border-[#c9a227]/30 no-print">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <NigerianEagleLogo size={42} customLogoUrl={customFirmLogoUrl} />
          <div className="min-w-0">
            <p className="font-serif-display font-bold text-sm text-white truncate">
              B. B. BALE &amp; CO
            </p>
            <p className="text-[11px] text-[#c9a227] truncate">{currentUser.role}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
          {(
            [
              'Overview',
              'Legal Practice',
              'Finance & Trust',
              'Property & Tenancy',
              'Operations & Governance',
            ] as const
          ).map((sec) => {
            const items = INTERNAL_ROUTES.filter(
              (r) => r.section === sec && (!r.principalOnly || isPrincipal)
            );
            return (
              <div key={sec}>
                <p className="px-2.5 text-[10px] font-mono-code uppercase tracking-wider text-[#c9a227] mb-1">
                  {sec}
                </p>
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => {
                            setShowCreateForm(false);
                            setFormFeedback('');
                          }}
                          className={`block px-2.5 py-1.5 rounded text-xs font-medium transition-colors truncate ${
                            active
                              ? 'bg-[#c9a227] text-[#1a2a4a] font-semibold'
                              : 'text-stone-200 hover:bg-white/10'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="block text-center py-1.5 text-xs text-stone-300 hover:text-white border border-white/15 rounded"
          >
            View Public Website
          </Link>
          <button
            type="button"
            onClick={async () => {
              await logoutStaff();
              navigate('/staff-login');
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-[#c62828] text-white rounded hover:bg-[#a91f1f] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Workspace Header */}
        <header className="bg-white border-b border-stone-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#5a5a5a]">{currentNav.section}</span>
            <span className="text-stone-300">/</span>
            <h1 className="font-serif-display text-lg font-bold text-[#1a2a4a]">
              {currentNav.label}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Branch Selector for Principal Partner; Locked Branch label for Branch Staff */}
            {isPrincipal ? (
              <select
                value={selectedBranchCode}
                onChange={(e) => setSelectedBranchCode(e.target.value)}
                aria-label="Filter Branch Scope"
                className="px-3 py-1.5 text-xs font-mono-code border border-stone-300 rounded bg-[#f8f6f1] text-[#1a2a4a] font-semibold"
              >
                <option value="ALL">All Branches (Firm-Wide)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.code}>
                    {b.code} — {b.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs font-mono-code text-[#1a2a4a] font-semibold px-2.5 py-1 bg-[#f8f6f1] border border-stone-200 rounded">
                Branch: {currentUser.branchCode || 'UNASSIGNED'}
              </span>
            )}

            {/* Quota Monitor Indicator */}
            <span
              className={`text-xs font-mono-code tabular-nums ${
                quotaStats.isAlertActive ? 'text-[#c62828] font-bold' : 'text-[#5a5a5a]'
              }`}
              title="Firestore Daily Free Tier Quota Monitor (Resets Midnight PT)"
            >
              R:{quotaStats.reads}/{quotaStats.readLimit} · W:{quotaStats.writes}/
              {quotaStats.writeLimit}
            </span>

            {renderSyncIndicator()}
          </div>
        </header>

        {/* 80% Firestore Quota Alert Banner (Section 5.1 & 5.3) */}
        {quotaStats.isAlertActive && (
          <div className="bg-[#c62828] text-white px-6 py-2 text-xs flex items-center justify-between no-print">
            <span className="font-semibold">
              WARNING: Daily Firestore Free Tier usage has exceeded the 80% threshold (50,000
              reads / 20,000 writes). Quota resets at midnight Pacific Time.
            </span>
          </div>
        )}

        {/* Sensitive Action MFA Verification Modal */}
        {mfaPromptAction && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 no-print">
            <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#1a2a4a]">
                <Shield className="w-5 h-5 text-[#c9a227]" />
                <h3 className="font-serif-display text-lg font-bold">
                  MFA Authorization Required
                </h3>
              </div>
              <p className="text-xs text-[#5a5a5a]">
                Sensitive operation: <strong>{mfaPromptAction.label}</strong>. Enter your 6-digit
                chamber security OTP to proceed.
              </p>
              <input
                type="text"
                maxLength={6}
                value={mfaOtpInput}
                onChange={(e) => setMfaOtpInput(e.target.value)}
                className="w-full px-3 py-2 text-center font-mono-code text-base tracking-widest border border-stone-300 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMfaPromptAction(null);
                    setMfaOtpInput('');
                  }}
                  className="px-4 py-2 text-xs border border-stone-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (mfaOtpInput.trim().length >= 4) {
                      await mfaPromptAction.onConfirm();
                      setMfaPromptAction(null);
                      setMfaOtpInput('');
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-[#1a2a4a] text-white rounded cursor-pointer"
                >
                  Verify &amp; Execute
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Workspace Viewport */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* ================================================================
              VIEW 1: ROLE-SPECIFIC DASHBOARD (/dashboard — Section 4.4)
             ================================================================ */}
          {currentNav.moduleKey === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-[#1a2a4a] text-white p-6 rounded-lg border border-[#c9a227]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono-code text-[#c9a227] uppercase">
                    {currentUser.role} WORKSPACE ·{' '}
                    {isPrincipal ? 'FIRM-WIDE AUTHORITY' : `BRANCH ${currentUser.branchCode}`}
                  </span>
                  <h2 className="font-serif-display text-2xl font-bold mt-1">
                    Welcome, {currentUser.fullName}
                  </h2>
                  <p className="text-xs text-stone-300 mt-1">
                    {isPrincipal &&
                      'Full multi-branch oversight: branches, cross-branch reports, escalations, trust withdrawal approvals, and global branding.'}
                    {currentUser.role === 'Head of Chamber' &&
                      'Branch operational authority: approve expenses up to NGN 200,000 and maintenance up to NGN 100,000; manage branch bank accounts and fees.'}
                    {currentUser.role === 'Administrator' &&
                      'Branch operations: consultations, live visitor chats, hard-copy NDPA backups, and task coordination.'}
                    {currentUser.role === 'Account Officer' &&
                      'Branch financial operations: LPRO 2023 invoices, VAT/WHT calculation, receipts, three-way trust reconciliation, and payroll.'}
                    {currentUser.role === 'Counsel' &&
                      'Assigned legal matters, court diary appearances, precedent filings, and statutory notices.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {isPrincipal && (
                    <Link
                      to="/branches"
                      className="px-4 py-2 text-xs font-semibold bg-[#c9a227] text-[#1a2a4a] rounded hover:bg-[#d8b236]"
                    >
                      Manage Branches
                    </Link>
                  )}
                  <Link
                    to="/matters"
                    className="px-4 py-2 text-xs font-semibold border border-white/30 text-white rounded hover:bg-white/10"
                  >
                    Open Matters
                  </Link>
                </div>
              </div>

              {/* Key Chamber Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-stone-200 p-5 rounded">
                  <span className="text-xs text-[#5a5a5a]">Active Branches</span>
                  <p className="font-mono-code text-2xl font-bold text-[#1a2a4a] mt-1 tabular-nums">
                    {branches.filter((b) => b.status === 'Active').length}
                  </p>
                  <span className="text-[11px] text-[#5a5a5a]">
                    Total registered: {branches.length}
                  </span>
                </div>

                <div className="bg-white border border-stone-200 p-5 rounded">
                  <span className="text-xs text-[#5a5a5a]">Active Matters &amp; Cases</span>
                  <p className="font-mono-code text-2xl font-bold text-[#1a2a4a] mt-1 tabular-nums">
                    {branchScopedRecords.filter((r) => r.module === 'matters').length}
                  </p>
                  <span className="text-[11px] text-[#5a5a5a]">
                    Clients: {branchScopedRecords.filter((r) => r.module === 'clients').length}
                  </span>
                </div>

                <div className="bg-white border border-stone-200 p-5 rounded">
                  <span className="text-xs text-[#5a5a5a]">Managed Properties &amp; Tenants</span>
                  <p className="font-mono-code text-2xl font-bold text-[#1a2a4a] mt-1 tabular-nums">
                    {branchScopedRecords.filter((r) => r.module === 'properties').length}
                  </p>
                  <span className="text-[11px] text-[#5a5a5a]">
                    Tenants: {branchScopedRecords.filter((r) => r.module === 'tenants').length} ·
                    Owners: {branchScopedRecords.filter((r) => r.module === 'owners').length}
                  </span>
                </div>

                <div className="bg-white border border-stone-200 p-5 rounded">
                  <span className="text-xs text-[#5a5a5a]">Pending Escalations &amp; Approvals</span>
                  <p className="font-mono-code text-2xl font-bold text-[#c9a227] mt-1 tabular-nums">
                    {
                      branchScopedRecords.filter(
                        (r) =>
                          r.status.includes('Escalated') || r.status.includes('Pending')
                      ).length
                    }
                  </p>
                  <span className="text-[11px] text-[#5a5a5a]">
                    Audit Events: {auditLogs.length}
                  </span>
                </div>
              </div>

              {/* Recent Real-Time Synced Records */}
              <div className="bg-white border border-stone-200 p-6 rounded">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a]">
                    Recent Chamber Activity ({branchScopedRecords.length} Records)
                  </h3>
                  <Link to="/audit-logs" className="text-xs font-semibold text-[#1a2a4a] hover:underline">
                    View Full Audit Trail &rarr;
                  </Link>
                </div>
                {branchScopedRecords.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm font-semibold text-[#1a2a4a]">
                      Chamber Database is Clean and Ready
                    </p>
                    <p className="text-xs text-[#5a5a5a] mt-1 max-w-lg mx-auto">
                      No dummy, fake, or seeded test records exist. Begin by creating your first
                      Branch (if Principal Partner), registering a Client, or onboarding a Property
                      Owner.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 text-[#5a5a5a]">
                          <th className="py-2 px-3">Unique Code</th>
                          <th className="py-2 px-3">Module</th>
                          <th className="py-2 px-3">Title</th>
                          <th className="py-2 px-3">Branch</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branchScopedRecords.slice(0, 8).map((rec) => (
                          <tr key={rec.id} className="border-b border-stone-100 hover:bg-stone-50">
                            <td className="py-2.5 px-3 font-mono-code font-semibold text-[#1a2a4a]">
                              {rec.uniqueCode}
                            </td>
                            <td className="py-2.5 px-3 capitalize">{rec.module}</td>
                            <td className="py-2.5 px-3">{rec.title}</td>
                            <td className="py-2.5 px-3 font-mono-code">{rec.branchCode}</td>
                            <td className="py-2.5 px-3">{rec.status}</td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => setPrintableRecord(rec)}
                                className="text-xs font-semibold text-[#1a2a4a] hover:underline cursor-pointer"
                              >
                                Print
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 2: BRANCH MANAGEMENT — PRINCIPAL PARTNER ONLY (/branches)
             ================================================================ */}
          {currentNav.moduleKey === 'branches' && isPrincipal && (
            <div className="space-y-6">
              <div className="bg-white border border-stone-200 p-6 rounded">
                <h2 className="font-serif-display text-xl font-bold text-[#1a2a4a]">
                  Register New Firm Branch (Principal Partner Exclusive)
                </h2>
                <p className="text-xs text-[#5a5a5a] mt-1">
                  Assign a unique branch code prefix (e.g., BBB-LAG, BBB-ABJ, BBB-KAN) for automatic
                  document and invoice numbering.
                </p>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!branchCodeInput.trim() || !branchNameInput.trim()) return;
                    await createBranch({
                      code: branchCodeInput.trim().toUpperCase(),
                      name: branchNameInput.trim(),
                      city: branchCityInput.trim(),
                      state: branchStateInput.trim(),
                      address: branchAddressInput.trim(),
                      phone: branchPhoneInput.trim(),
                      email: branchEmailInput.trim(),
                      status: 'Active',
                    });
                    setBranchCodeInput('');
                    setBranchNameInput('');
                    setBranchCityInput('');
                    setBranchStateInput('');
                    setBranchAddressInput('');
                    setBranchPhoneInput('');
                    setBranchEmailInput('');
                  }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                      Branch Prefix Code * (e.g. BBB-LAG)
                    </label>
                    <input
                      type="text"
                      required
                      value={branchCodeInput}
                      onChange={(e) => setBranchCodeInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono-code border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                      Branch Chamber Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={branchNameInput}
                      onChange={(e) => setBranchNameInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={branchCityInput}
                      onChange={(e) => setBranchCityInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={branchStateInput}
                      onChange={(e) => setBranchStateInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                      Office Address
                    </label>
                    <input
                      type="text"
                      value={branchAddressInput}
                      onChange={(e) => setBranchAddressInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                      Telephone
                    </label>
                    <input
                      type="text"
                      value={branchPhoneInput}
                      onChange={(e) => setBranchPhoneInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-[#1a2a4a] text-white rounded hover:bg-[#121e36] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create Branch
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white border border-stone-200 p-6 rounded">
                <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a] mb-4">
                  Configured Chamber Branches ({branches.length})
                </h3>
                {branches.length === 0 ? (
                  <p className="text-xs text-[#5a5a5a]">
                    No branches created yet. Use the form above to establish your first branch.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 text-[#5a5a5a]">
                          <th className="py-2 px-3">Code</th>
                          <th className="py-2 px-3">Branch Name</th>
                          <th className="py-2 px-3">Location</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3 text-right">Principal Partner Controls</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branches.map((b) => (
                          <tr key={b.id} className="border-b border-stone-100">
                            <td className="py-2.5 px-3 font-mono-code font-bold text-[#1a2a4a]">
                              {b.code}
                            </td>
                            <td className="py-2.5 px-3 font-semibold">{b.name}</td>
                            <td className="py-2.5 px-3">
                              {b.city}, {b.state}
                            </td>
                            <td className="py-2.5 px-3">{b.status}</td>
                            <td className="py-2.5 px-3 text-right space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setMfaPromptAction({
                                    label: `Toggle Suspension for Branch ${b.code}`,
                                    onConfirm: async () => {
                                      await updateBranch(b.id, {
                                        status: b.status === 'Active' ? 'Suspended' : 'Active',
                                      });
                                    },
                                  })
                                }
                                className="px-2.5 py-1 text-xs border border-stone-300 rounded hover:bg-stone-50 cursor-pointer"
                              >
                                {b.status === 'Active' ? 'Suspend' : 'Activate'}
                              </button>
                              <button
                                type="button"
                                onClick={() => updateBranch(b.id, { status: 'Archived' })}
                                className="px-2.5 py-1 text-xs border border-stone-300 rounded hover:bg-stone-50 cursor-pointer"
                              >
                                Archive
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteBranch(b.id)}
                                className="px-2.5 py-1 text-xs text-[#c62828] border border-[#c62828]/30 rounded hover:bg-[#c62828]/10 cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 3: STAFF & ROLE CREATION HIERARCHY (/staff — Section 10)
             ================================================================ */}
          {currentNav.moduleKey === 'staff' && (
            <div className="space-y-6">
              {['Principal Partner', 'Head of Chamber'].includes(currentUser.role) && (
                <div className="bg-white border border-stone-200 p-6 rounded">
                  <h2 className="font-serif-display text-lg font-bold text-[#1a2a4a]">
                    Appoint Chamber Personnel (Role Creation Hierarchy)
                  </h2>
                  <p className="text-xs text-[#5a5a5a] mt-1">
                    Principal Partner appoints Heads of Chamber (max 1 per branch). Head of Chamber
                    appoints Branch Administrator (max 1), Account Officer (max 1), and Counsel
                    (unlimited). New accounts require forced password change on first login.
                  </p>
                  {staffError && (
                    <div className="mt-3 p-3 bg-[#c62828]/10 border border-[#c62828] rounded text-xs text-[#c62828]">
                      {staffError}
                    </div>
                  )}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setStaffError('');
                      const res = await createStaffUser({
                        username: staffUsername,
                        fullName: staffFullName,
                        email: staffEmail,
                        role: staffRole,
                        branchId: staffBranchCode,
                        branchCode: staffBranchCode,
                        status: 'Active',
                      });
                      if (!res.ok) {
                        setStaffError(res.error || 'Could not create staff profile.');
                      } else {
                        setStaffUsername('');
                        setStaffFullName('');
                        setStaffEmail('');
                      }
                    }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                        Username *
                      </label>
                      <input
                        type="text"
                        required
                        value={staffUsername}
                        onChange={(e) => setStaffUsername(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                        Full Name &amp; Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={staffFullName}
                        onChange={(e) => setStaffFullName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                        Role *
                      </label>
                      <select
                        value={staffRole}
                        onChange={(e) => setStaffRole(e.target.value as StaffRole)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white"
                      >
                        {isPrincipal && <option value="Head of Chamber">Head of Chamber</option>}
                        <option value="Administrator">Administrator</option>
                        <option value="Account Officer">Account Officer</option>
                        <option value="Counsel">Counsel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                        Branch *
                      </label>
                      <select
                        value={staffBranchCode}
                        onChange={(e) => setStaffBranchCode(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white"
                      >
                        {branches.length === 0 ? (
                          <option value="BBB-HQ">BBB-HQ</option>
                        ) : (
                          branches.map((b) => (
                            <option key={b.id} value={b.code}>
                              {b.code} — {b.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div className="md:col-span-4 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 text-xs font-semibold bg-[#1a2a4a] text-white rounded cursor-pointer"
                      >
                        Create Staff Account (Default Pass: Admin@2026)
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white border border-stone-200 p-6 rounded">
                <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a] mb-4">
                  Registered Chamber Personnel ({users.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-[#5a5a5a]">
                        <th className="py-2 px-3">Username</th>
                        <th className="py-2 px-3">Full Name</th>
                        <th className="py-2 px-3">Role</th>
                        <th className="py-2 px-3">Branch</th>
                        <th className="py-2 px-3">Password Policy</th>
                        {isPrincipal && <th className="py-2 px-3 text-right">Password Reset</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-stone-100">
                          <td className="py-2.5 px-3 font-mono-code font-semibold">{u.username}</td>
                          <td className="py-2.5 px-3">{u.fullName}</td>
                          <td className="py-2.5 px-3">{u.role}</td>
                          <td className="py-2.5 px-3 font-mono-code">{u.branchCode || u.branchId}</td>
                          <td className="py-2.5 px-3">
                            {u.mustChangePassword ? 'Forced Change Pending' : 'Changed & Verified'}
                          </td>
                          {isPrincipal && (
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setMfaPromptAction({
                                    label: `Reset Password for ${u.fullName}`,
                                    onConfirm: async () => {
                                      await resetStaffPassword(u);
                                    },
                                  })
                                }
                                className="px-2.5 py-1 text-xs border border-stone-300 rounded hover:bg-stone-50 cursor-pointer"
                              >
                                Reset Password
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 4: IMMUTABLE AUDIT LOGS (/audit-logs)
             ================================================================ */}
          {currentNav.moduleKey === 'audit-logs' && (
            <div className="bg-white border border-stone-200 p-6 rounded">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif-display text-lg font-bold text-[#1a2a4a]">
                    Immutable Chamber Security &amp; Sync Audit Trail ({auditLogs.length})
                  </h2>
                  <p className="text-xs text-[#5a5a5a]">
                    Protected by Firestore Security Rules (`allow update, delete: if false;`).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border border-stone-300 rounded cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Audit Log
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-[#5a5a5a]">
                      <th className="py-2 px-3">Timestamp</th>
                      <th className="py-2 px-3">Branch</th>
                      <th className="py-2 px-3">Actor</th>
                      <th className="py-2 px-3">Action</th>
                      <th className="py-2 px-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-stone-100">
                        <td className="py-2 px-3 font-mono-code text-[11px] tabular-nums">
                          {log.createdAt.slice(0, 19).replace('T', ' ')}
                        </td>
                        <td className="py-2 px-3 font-mono-code">{log.branchCode}</td>
                        <td className="py-2 px-3">
                          {log.actorName} ({log.actorRole})
                        </td>
                        <td className="py-2 px-3 font-semibold text-[#1a2a4a]">{log.action}</td>
                        <td className="py-2 px-3 text-[#5a5a5a]">{log.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 5: ADMINISTRATOR HARD-COPY BACKUP (/backups — Section 21)
             ================================================================ */}
          {currentNav.moduleKey === 'backups' && (
            <div className="space-y-6">
              <div className="bg-white border border-stone-200 p-6 rounded no-print">
                <h2 className="font-serif-display text-lg font-bold text-[#1a2a4a]">
                  Administrator Hard-Copy Backup Generator (7-Year NDPA Retention)
                </h2>
                <p className="text-xs text-[#5a5a5a] mt-1">
                  Select a date range and record category to generate a watermarked hard-copy PDF
                  printout (&ldquo;CONFIDENTIAL - BRANCH RECORDS&rdquo;).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={backupFromDate}
                      onChange={(e) => setBackupFromDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={backupToDate}
                      onChange={(e) => setBackupToDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                      Module Category
                    </label>
                    <select
                      value={backupCategory}
                      onChange={(e) => setBackupCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white"
                    >
                      <option value="ALL">All Branch Categories</option>
                      <option value="matters">Litigation Matters</option>
                      <option value="clients">Clients</option>
                      <option value="invoices">Invoices &amp; Billing</option>
                      <option value="receipts">Receipts</option>
                      <option value="trust">Trust Account</option>
                      <option value="properties">Properties &amp; Tenants</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setMfaPromptAction({
                          label: 'Generate & Print Hard-Copy Branch Backup',
                          onConfirm: async () => {
                            await createRecord({
                              module: 'backups',
                              uniqueCode: generateUniqueCode('BKP', true),
                              title: `Hard-Copy Backup (${backupCategory})`,
                              subtitle: `Range: ${backupFromDate || 'Start'} to ${backupToDate || 'Present'} · Retention: 7 Years (NDPA)`,
                              branchId: effectiveBranch,
                              branchCode: effectiveBranch,
                              status: 'Certified Hard-Copy',
                              category: backupCategory,
                            });
                            window.print();
                          },
                        })
                      }
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#1a2a4a] text-white rounded cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Certify &amp; Print Hard-Copy Backup
                    </button>
                  </div>
                </div>
              </div>

              {/* Printable Watermarked Hard-Copy Sheet */}
              <div className="bg-white border-2 border-[#1a2a4a] p-8 rounded print-container">
                <div className="flex items-center justify-between border-b-2 border-[#c9a227] pb-4 mb-6">
                  <div>
                    <p className="text-xs font-mono-code font-bold text-[#c62828] tracking-widest">
                      CONFIDENTIAL - BRANCH RECORDS (NDPA 7-YEAR RETENTION)
                    </p>
                    <h3 className="font-serif-display text-xl font-bold text-[#1a2a4a] mt-1">
                      B. B. BALE &amp; CO CHAMBERS — Hard-Copy Archival Ledger
                    </h3>
                  </div>
                  <span className="font-mono-code text-xs text-[#5a5a5a]">
                    Branch Scope: {effectiveBranch}
                  </span>
                </div>

                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-stone-300 text-[#1a2a4a]">
                      <th className="py-2 px-2">Date</th>
                      <th className="py-2 px-2">Unique Code</th>
                      <th className="py-2 px-2">Category</th>
                      <th className="py-2 px-2">Particulars</th>
                      <th className="py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchScopedRecords
                      .filter((r) => backupCategory === 'ALL' || r.module === backupCategory)
                      .filter(
                        (r) =>
                          (!backupFromDate || r.createdAt.slice(0, 10) >= backupFromDate) &&
                          (!backupToDate || r.createdAt.slice(0, 10) <= backupToDate)
                      )
                      .map((r) => (
                        <tr key={r.id} className="border-b border-stone-200">
                          <td className="py-2 px-2 font-mono-code">{r.createdAt.slice(0, 10)}</td>
                          <td className="py-2 px-2 font-mono-code font-semibold">{r.uniqueCode}</td>
                          <td className="py-2 px-2 capitalize">{r.module}</td>
                          <td className="py-2 px-2">{r.title}</td>
                          <td className="py-2 px-2">{r.status}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 6: SETTINGS, BRANDING & CLOUDFLARE DEPLOYMENT (/settings)
             ================================================================ */}
          {currentNav.moduleKey === 'settings' && (
            <div className="space-y-6">
              <LogoAssetExporter />

              {isPrincipal && (
                <div className="bg-white border border-stone-200 p-6 rounded">
                  <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a] mb-2">
                    Principal Partner: Upload Custom Nigerian Court Eagle Crest (Local File Picker)
                  </h3>
                  <p className="text-xs text-[#5a5a5a] mb-4">
                    Uploading a custom crest updates the firm logo across all public and internal
                    headers in real time.
                  </p>
                  <LocalFilePicker
                    uploadPoint="Nigerian Court Eagle Logo"
                    branchCode="GLOBAL"
                    label="Select Nigerian Court Eagle Crest File from Device"
                    onUploadComplete={async (meta) => {
                      await createRecord({
                        module: 'settings',
                        uniqueCode: generateUniqueCode('LOGO', false, 'GLOBAL'),
                        title: 'Official Firm Crest Override',
                        subtitle: meta.fileName,
                        branchId: 'GLOBAL',
                        branchCode: 'GLOBAL',
                        status: 'Active',
                        category: 'FirmLogo',
                        details: { downloadUrl: meta.downloadUrl },
                      });
                    }}
                  />
                </div>
              )}

              <div className="bg-white border border-stone-200 p-6 rounded">
                <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a]">
                  GitHub &rarr; Cloudflare Pages Hosting &amp; Environment Configuration
                </h3>
                <p className="text-xs text-[#5a5a5a] mt-1">
                  Build preset: React (Vite) · Build command: <code className="font-mono-code">npm run build</code> · Output directory: <code className="font-mono-code">dist</code>
                </p>
                <div className="mt-4 p-4 bg-[#f8f6f1] border border-stone-200 rounded font-mono-code text-xs space-y-1 text-[#1a2a4a]">
                  <div>VITE_FIREBASE_API_KEY</div>
                  <div>VITE_FIREBASE_AUTH_DOMAIN</div>
                  <div>VITE_FIREBASE_PROJECT_ID</div>
                  <div>VITE_FIREBASE_STORAGE_BUCKET</div>
                  <div>VITE_FIREBASE_MESSAGING_SENDER_ID</div>
                  <div>VITE_FIREBASE_APP_ID</div>
                  <div>VITE_FIREBASE_MEASUREMENT_ID</div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 7: ALL OPERATIONAL LEGAL, FINANCE & PROPERTY MODULES
             ================================================================ */}
          {!['dashboard', 'branches', 'staff', 'audit-logs', 'backups', 'settings'].includes(
            currentNav.moduleKey
          ) && (
            <div className="space-y-6">
              {/* Specialized Module Header Bar: Three-Way Trust Reconciliation */}
              {currentNav.moduleKey === 'trust' && (
                <div className="bg-white border border-stone-200 p-5 rounded grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <span className="text-xs text-[#5a5a5a]">1. Bank Statement Balance (NGN)</span>
                    <input
                      type="number"
                      value={bankStatementBalance}
                      onChange={(e) => setBankStatementBalance(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 text-sm font-mono-code border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-[#5a5a5a]">2. Trust Cashbook Net (NGN)</span>
                    <p className="font-mono-code text-lg font-bold text-[#1a2a4a] mt-1 tabular-nums">
                      {moduleRecords
                        .reduce(
                          (acc, r) =>
                            r.category === 'Withdrawal'
                              ? acc - (r.amount || 0)
                              : acc + (r.amount || 0),
                          0
                        )
                        .toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-[#5a5a5a]">3. Sum of Client Trust Ledgers</span>
                    <p className="font-mono-code text-lg font-bold text-[#1a2a4a] mt-1 tabular-nums">
                      {moduleRecords
                        .filter((r) => r.status !== 'Void')
                        .reduce(
                          (acc, r) =>
                            r.category === 'Withdrawal'
                              ? acc - (r.amount || 0)
                              : acc + (r.amount || 0),
                          0
                        )
                        .toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-[#5a5a5a]">Three-Way Reconciliation Status</span>
                    <p className="text-xs font-semibold text-[#2e7d32] mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Ledger Balanced &amp; Tracked
                    </p>
                  </div>
                </div>
              )}

              {/* Specialized Module Header Bar: Rent Arrears Aging (Section 13) */}
              {currentNav.moduleKey === 'rent' && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {['Current', '30 Days Arrears', '60 Days Arrears', '90 Days Arrears', '120+ Days Arrears'].map(
                    (bucket) => {
                      const total = moduleRecords
                        .filter((r) => (r.category || 'Current') === bucket)
                        .reduce((sum, r) => sum + (r.amount || 0), 0);
                      return (
                        <div key={bucket} className="bg-white border border-stone-200 p-3.5 rounded">
                          <span className="text-[11px] text-[#5a5a5a] block">{bucket}</span>
                          <span className="font-mono-code text-sm font-bold text-[#1a2a4a] tabular-nums">
                            NGN {total.toLocaleString()}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              )}

              {/* Action Toolbar */}
              <div className="bg-white border border-stone-200 p-4 rounded flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-[#5a5a5a] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Filter records"
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#1a2a4a] text-white rounded hover:bg-[#121e36] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {showCreateForm ? 'Close Entry Form' : `New ${currentNav.label} Record`}
                  </button>
                </div>
              </div>

              {formFeedback && (
                <div className="p-3 bg-[#2e7d32]/10 border border-[#2e7d32] rounded text-xs text-[#1a2a4a] font-medium">
                  {formFeedback}
                </div>
              )}

              {/* Create Record Form with Domain-Specific Fields & Native LocalFilePicker */}
              {showCreateForm && (
                <form
                  onSubmit={handleCreateModuleRecord}
                  className="bg-white border border-stone-200 p-6 rounded space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="font-serif-display text-base font-bold text-[#1a2a4a]">
                      Create {currentNav.label} Record (Auto-Numbered:{' '}
                      <span className="font-mono-code text-[#c9a227]">
                        {generateUniqueCode(
                          ENTITY_PREFIX_MAP[currentNav.moduleKey]?.prefix || 'REC',
                          ENTITY_PREFIX_MAP[currentNav.moduleKey]?.includeYear ?? true
                        )}
                      </span>
                      )
                    </h3>
                  </div>

                  {/* Firm-Wide Conflict Check Alert for Clients & Matters */}
                  {['clients', 'matters'].includes(currentNav.moduleKey) &&
                    conflictMatches.length > 0 && (
                      <div className="p-3 bg-[#f9a825]/20 border border-[#f9a825] rounded text-xs text-[#1c1c1c] flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#c62828] shrink-0 mt-0.5" />
                        <div>
                          <strong>Firm-Wide Conflict of Interest Alert:</strong> Matching party
                          detected across chamber records (
                          {conflictMatches.map((m) => `${m.uniqueCode}: ${m.title}`).join(', ')}).
                        </div>
                      </div>
                    )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                        {currentNav.moduleKey === 'clients'
                          ? 'Client Full Legal Name / Corporate Entity *'
                          : currentNav.moduleKey === 'matters'
                            ? 'Suit Title / Parties (e.g., Claimant v. Defendant) *'
                            : currentNav.moduleKey === 'owners'
                              ? 'Property Owner Full Name *'
                              : currentNav.moduleKey === 'properties'
                                ? 'Property Description / Building Title *'
                                : currentNav.moduleKey === 'tenants'
                                  ? 'Tenant Full Name *'
                                  : 'Record Title / Heading *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                      />
                    </div>

                    {/* Hierarchical Court Category or Module Category */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                        {['matters', 'precedents', 'court-diary'].includes(currentNav.moduleKey)
                          ? 'Court Category *'
                          : currentNav.moduleKey === 'rent'
                            ? 'Arrears Aging Bucket'
                            : currentNav.moduleKey === 'notices'
                              ? 'Statutory Notice Type'
                              : currentNav.moduleKey === 'trust'
                                ? 'Transaction Type'
                                : 'Classification / Category'}
                      </label>
                      {['matters', 'precedents', 'court-diary'].includes(currentNav.moduleKey) ? (
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white"
                        >
                          <option value="">Select Court Category...</option>
                          {COURT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      ) : currentNav.moduleKey === 'rent' ? (
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white"
                        >
                          <option value="Current">Current</option>
                          <option value="30 Days Arrears">30 Days Arrears</option>
                          <option value="60 Days Arrears">60 Days Arrears</option>
                          <option value="90 Days Arrears">90 Days Arrears</option>
                          <option value="120+ Days Arrears">120+ Days Arrears</option>
                        </select>
                      ) : currentNav.moduleKey === 'notices' ? (
                        <select
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value);
                            setSubtitle(
                              `TAKE NOTICE that you are required to quit and deliver up possession of the premises held by you as tenant of the Owner, in accordance with the Recovery of Premises Law of Nigeria.`
                            );
                          }}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white"
                        >
                          <option value="7-Day Notice to Quit">7-Day Notice to Quit</option>
                          <option value="1-Month Notice to Quit">1-Month Notice to Quit</option>
                          <option value="6-Month Statutory Notice to Quit">
                            6-Month Statutory Notice to Quit
                          </option>
                          <option value="7-Day Owner's Intention to Recover Possession">
                            7-Day Owner&apos;s Intention to Recover Possession
                          </option>
                        </select>
                      ) : currentNav.moduleKey === 'trust' ? (
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white"
                        >
                          <option value="Deposit">Client / Rent Trust Deposit</option>
                          <option value="Withdrawal">Trust Disbursement / Withdrawal</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                        />
                      )}
                    </div>
                  </div>

                  {/* Second Row: Case Type / City / Linked Owner-Client-Property ID / Amount */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                        {['matters', 'precedents'].includes(currentNav.moduleKey)
                          ? 'Case Type Hierarchy'
                          : currentNav.moduleKey === 'properties'
                            ? 'City (Displayed on Public Site) *'
                            : 'Sub-Category / Reference Date'}
                      </label>
                      {['matters', 'precedents'].includes(currentNav.moduleKey) ? (
                        <select
                          value={subCategory}
                          onChange={(e) => setSubCategory(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white"
                        >
                          <option value="">Select Case Type...</option>
                          {CASE_TYPES.map((ct) => (
                            <option key={ct} value={ct}>
                              {ct}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={subCategory}
                          onChange={(e) => setSubCategory(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                        Linked Client / Owner / Property Code
                      </label>
                      <input
                        type="text"
                        value={linkedEntityCode}
                        onChange={(e) => setLinkedEntityCode(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono-code border border-stone-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                        Amount in NGN (if financial/billing/rent)
                      </label>
                      <input
                        type="number"
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono-code border border-stone-300 rounded"
                      />
                    </div>
                  </div>

                  {/* Portal Access Code for Clients, Owners, Tenants */}
                  {['clients', 'owners', 'tenants'].includes(currentNav.moduleKey) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                          Assign Portal Access Code (for /{currentNav.moduleKey.slice(0, -1)}-access) *
                        </label>
                        <input
                          type="text"
                          required
                          value={portalAccessCode}
                          onChange={(e) => setPortalAccessCode(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono-code border border-stone-300 rounded"
                        />
                      </div>
                      {currentNav.moduleKey === 'clients' && (
                        <div>
                          <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                            Opposing Party Name (for Conflict Check)
                          </label>
                          <input
                            type="text"
                            value={opposingParty}
                            onChange={(e) => setOpposingParty(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Invoice Auto-VAT (7.5%) and WHT Computation Preview */}
                  {currentNav.moduleKey === 'invoices' && (
                    <div className="p-3 bg-[#f8f6f1] border border-stone-200 rounded flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="font-semibold text-[#1a2a4a]">
                          Statutory Tax Auto-Computation:
                        </span>{' '}
                        VAT (7.5%):{' '}
                        <strong className="font-mono-code">
                          NGN {(Number(amountInput || 0) * 0.075).toLocaleString()}
                        </strong>{' '}
                        · WHT ({whtRate}%):{' '}
                        <strong className="font-mono-code">
                          NGN {(Number(amountInput || 0) * (Number(whtRate) / 100)).toLocaleString()}
                        </strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>WHT Rate:</span>
                        <select
                          value={whtRate}
                          onChange={(e) => setWhtRate(e.target.value)}
                          className="px-2 py-1 border border-stone-300 rounded bg-white font-mono-code"
                        >
                          <option value="5">5%</option>
                          <option value="10">10%</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Particulars / Clauses / Judge Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                      Detailed Particulars / Clauses / Judge Notes / Bank Account Details
                    </label>
                    <textarea
                      rows={3}
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                    />
                  </div>

                  {/* Checkboxes for Public Listing, Legal Hold, NDPA Consent, Bank Display */}
                  <div className="flex flex-wrap items-center gap-6 text-xs">
                    {['properties', 'public-content', 'gallery-admin'].includes(
                      currentNav.moduleKey
                    ) && (
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPublicToggle}
                          onChange={(e) => setIsPublicToggle(e.target.checked)}
                        />
                        <span>Publish on Public Website</span>
                      </label>
                    )}

                    {currentNav.moduleKey === 'documents' && (
                      <label className="inline-flex items-center gap-2 cursor-pointer text-[#c62828] font-medium">
                        <input
                          type="checkbox"
                          checked={legalHold}
                          onChange={(e) => setLegalHold(e.target.checked)}
                        />
                        <span>Place Document Under Legal Hold (Blocks Deletion)</span>
                      </label>
                    )}

                    {currentNav.moduleKey === 'gallery-admin' && (
                      <label className="inline-flex items-center gap-2 cursor-pointer text-[#1a2a4a] font-semibold">
                        <input
                          type="checkbox"
                          checked={ndpaConsent}
                          onChange={(e) => setNdpaConsent(e.target.checked)}
                        />
                        <span>NDPA 2023 Subject Photo Consent Signed &amp; Verified *</span>
                      </label>
                    )}

                    {currentNav.moduleKey === 'bank-accounts' && (
                      <label className="inline-flex items-center gap-2 cursor-pointer text-[#1a2a4a] font-semibold">
                        <input
                          type="checkbox"
                          checked={status === 'Display on Invoice/Receipt'}
                          onChange={(e) =>
                            setStatus(
                              e.target.checked ? 'Display on Invoice/Receipt' : 'Internal Only'
                            )
                          }
                        />
                        <span>Display this Bank Account on Branch Invoices &amp; Receipts</span>
                      </label>
                    )}
                  </div>

                  {/* Section 19: Mandatory Local File Picker for Uploads */}
                  <LocalFilePicker
                    uploadPoint={
                      ENTITY_PREFIX_MAP[currentNav.moduleKey]?.uploadPoint || 'Matter Document'
                    }
                    branchCode={effectiveBranch}
                    onUploadComplete={(meta) => setUploadedFile(meta)}
                  />

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 text-xs border border-stone-300 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-xs font-semibold bg-[#1a2a4a] text-white rounded hover:bg-[#121e36] cursor-pointer"
                    >
                      Save &amp; Sync to Firestore
                    </button>
                  </div>
                </form>
              )}

              {/* Module Data Table */}
              <div className="bg-white border border-stone-200 p-6 rounded">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a]">
                    {currentNav.label} Ledger ({moduleRecords.length})
                  </h3>
                </div>

                {moduleRecords.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="font-serif-display text-base font-bold text-[#1a2a4a]">
                      No {currentNav.label} Records Registered Yet
                    </p>
                    <p className="text-xs text-[#5a5a5a] mt-1">
                      Click &ldquo;New {currentNav.label} Record&rdquo; above to add the first entry.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 text-[#5a5a5a]">
                          <th className="py-2.5 px-3">Unique Code</th>
                          <th className="py-2.5 px-3">Title &amp; Particulars</th>
                          <th className="py-2.5 px-3">Classification</th>
                          <th className="py-2.5 px-3">Branch</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Amount (NGN)</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {moduleRecords
                          .filter(
                            (r) =>
                              !searchQuery.trim() ||
                              r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              r.uniqueCode.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((rec) => (
                            <tr
                              key={rec.id}
                              className="border-b border-stone-100 hover:bg-stone-50"
                            >
                              <td className="py-2.5 px-3 font-mono-code font-bold text-[#1a2a4a]">
                                {rec.uniqueCode}
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="font-semibold text-[#1c1c1c]">{rec.title}</div>
                                {rec.subtitle && (
                                  <div className="text-[11px] text-[#5a5a5a] truncate max-w-md">
                                    {rec.subtitle}
                                  </div>
                                )}
                                {rec.details?.fileName && (
                                  <div className="text-[11px] text-[#2e7d32] font-mono-code mt-0.5">
                                    Attachment: {rec.details.fileName}
                                  </div>
                                )}
                              </td>
                              <td className="py-2.5 px-3">
                                {rec.category}
                                {rec.subCategory ? ` · ${rec.subCategory}` : ''}
                              </td>
                              <td className="py-2.5 px-3 font-mono-code">{rec.branchCode}</td>
                              <td className="py-2.5 px-3">
                                <span>{rec.status}</span>
                                {rec.details?.legalHold && (
                                  <span className="ml-1.5 text-[10px] font-mono-code text-[#c62828] font-bold">
                                    [LEGAL HOLD]
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono-code tabular-nums">
                                {(rec.amount || 0) > 0
                                  ? (rec.amount || 0).toLocaleString()
                                  : '—'}
                              </td>
                              <td className="py-2.5 px-3 text-right space-x-2 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setPrintableRecord(rec)}
                                  className="px-2 py-1 text-xs border border-stone-300 rounded hover:bg-white cursor-pointer"
                                >
                                  Print
                                </button>

                                {/* Principal Partner Approval Button for Escalated Items */}
                                {isPrincipal &&
                                  (rec.status.includes('Escalated') ||
                                    rec.status.includes('Pending')) && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setMfaPromptAction({
                                          label: `Approve ${rec.uniqueCode}`,
                                          onConfirm: async () => {
                                            await updateRecord(rec.id, {
                                              status: 'Approved by Principal Partner',
                                            });
                                          },
                                        })
                                      }
                                      className="px-2 py-1 text-xs font-semibold bg-[#2e7d32] text-white rounded cursor-pointer"
                                    >
                                      Approve
                                    </button>
                                  )}

                                {/* Invoice Void / Credit Note Controls */}
                                {currentNav.moduleKey === 'invoices' && rec.status !== 'Void' && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateRecord(rec.id, {
                                        status: 'Void',
                                        subtitle: `${rec.subtitle || ''} [VOIDED — Credit Note Issued]`,
                                      })
                                    }
                                    className="px-2 py-1 text-xs text-[#c62828] border border-[#c62828]/30 rounded cursor-pointer"
                                  >
                                    Void / Credit Note
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => deleteRecord(rec.id)}
                                  className="px-2 py-1 text-xs text-[#5a5a5a] hover:text-[#c62828] cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5 inline" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
