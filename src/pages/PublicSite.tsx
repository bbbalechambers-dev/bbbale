import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Shield, Lock, MessageSquare, CheckCircle2, Building2, Scale, FileText, ArrowRight, Printer } from 'lucide-react';
import { NigerianEagleLogo } from '../components/Branding';
import { useFirm } from '../context/FirmContext';

// Public Header adhering strictly to the 3-Zone Top Bar Contract
export const PublicHeader: React.FC = () => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 lg:px-12 py-4 bg-[#1a2a4a] text-white border-b border-[#c9a227]/30 no-print">
      <Link
        to="/"
        className="font-serif-display text-lg font-bold tracking-wide text-white whitespace-nowrap shrink-0"
      >
        B. B. BALE &amp; CO CHAMBERS
      </Link>

      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-200">
        <Link
          to="/practice-areas"
          className="hover:text-[#c9a227] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Practice Areas
        </Link>
        <Link
          to="/properties"
          className="hover:text-[#c9a227] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Properties
        </Link>
        <Link
          to="/gallery"
          className="hover:text-[#c9a227] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Gallery
        </Link>
        <Link
          to="/about"
          className="hover:text-[#c9a227] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          About Us
        </Link>
        <Link
          to="/contact"
          className="hover:text-[#c9a227] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Contact
        </Link>
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        <Link
          to="/book"
          className="px-4 py-2 text-xs font-semibold bg-[#c9a227] text-[#1a2a4a] rounded hover:bg-[#d8b236] transition-colors whitespace-nowrap shrink-0"
        >
          Book Consultation
        </Link>
      </div>
    </header>
  );
};

export const PublicFooter: React.FC = () => {
  const { customFirmLogoUrl } = useFirm();
  return (
    <footer className="bg-[#1a2a4a] text-stone-300 border-t border-[#c9a227]/30 py-12 px-6 lg:px-12 no-print">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <NigerianEagleLogo size={48} customLogoUrl={customFirmLogoUrl} />
            <div>
              <p className="font-serif-display font-bold text-white text-base">
                B. B. BALE &amp; CO
              </p>
              <p className="text-xs text-[#c9a227] tracking-widest">CHAMBERS</p>
            </div>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Barristers, Solicitors &amp; Chartered Property Managers operating across the
            Federal Republic of Nigeria.
          </p>
        </div>

        <div>
          <h4 className="font-serif-display font-semibold text-white text-sm mb-3">
            Firm Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/about" className="hover:text-[#c9a227]">About the Chambers</Link></li>
            <li><Link to="/practice-areas" className="hover:text-[#c9a227]">Practice Areas</Link></li>
            <li><Link to="/team" className="hover:text-[#c9a227]">Our Legal Team</Link></li>
            <li><Link to="/gallery" className="hover:text-[#c9a227]">Chamber Gallery</Link></li>
            <li><Link to="/properties" className="hover:text-[#c9a227]">Public Property Listings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif-display font-semibold text-white text-sm mb-3">
            Verified Access Portals
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/client-access" className="hover:text-[#c9a227]">Client Matter Portal</Link></li>
            <li><Link to="/owner-access" className="hover:text-[#c9a227]">Property Owner Portal</Link></li>
            <li><Link to="/tenant-access" className="hover:text-[#c9a227]">Tenant Lifecycle Portal</Link></li>
            <li><Link to="/staff-login" className="hover:text-[#c9a227] font-semibold text-[#c9a227]">Staff Secure Access</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif-display font-semibold text-white text-sm mb-3">
            Regulatory &amp; Legal
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/faq" className="hover:text-[#c9a227]">Frequently Asked Questions</Link></li>
            <li><Link to="/terms" className="hover:text-[#c9a227]">Terms of Engagement (LPRO 2023)</Link></li>
            <li><Link to="/privacy" className="hover:text-[#c9a227]">NDPA 2023 Privacy Notice</Link></li>
            <li><Link to="/book" className="hover:text-[#c9a227]">Schedule Legal Consultation</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
        <span>&copy; {new Date().getFullYear()} B. B. BALE &amp; CO CHAMBERS. All rights reserved.</span>
        <span>Legal Practitioners Act &amp; Nigeria Data Protection Act (NDPA) Compliant</span>
      </div>
    </footer>
  );
};

// 1. HOMEPAGE (/)
export const HomePage: React.FC = () => {
  const { branches, records, customFirmLogoUrl } = useFirm();
  const publicProperties = records.filter((r) => r.module === 'properties' && r.isPublic);
  const publicCmsHero = records.find(
    (r) => r.module === 'public-content' && r.category === 'HomepageHero' && r.isPublic
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f1]">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Split */}
        <section className="bg-[#1a2a4a] text-white py-16 lg:py-24 px-6 lg:px-12 border-b border-[#c9a227]/40">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-mono-code text-[#c9a227] tracking-widest">
                LEGAL PRACTITIONERS · SOLICITORS · CHARTERED PROPERTY MANAGERS
              </p>
              <h1
                className="font-serif-display font-bold text-white leading-tight"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
              >
                {publicCmsHero?.title ||
                  'Authoritative Representation in Nigerian Litigation, Corporate Law & Real Estate.'}
              </h1>
              <p className="text-base text-stone-200 max-w-2xl leading-relaxed">
                {publicCmsHero?.subtitle ||
                  'B. B. BALE & CO CHAMBERS delivers multi-branch appellate litigation, statutory property administration, trust accounting, and commercial advisory across Nigeria.'}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-[#c9a227] text-[#1a2a4a] rounded hover:bg-[#d8b236] transition-colors whitespace-nowrap shrink-0"
                >
                  Schedule Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/client-access"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border border-white/30 text-white rounded hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
                >
                  Client &amp; Property Portals
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#121e36] border border-[#c9a227]/40 rounded-lg p-8 text-center">
              <NigerianEagleLogo size={180} customLogoUrl={customFirmLogoUrl} />
              <h2 className="font-serif-display text-xl font-bold text-white mt-5">
                B. B. BALE &amp; CO CHAMBERS
              </h2>
              <p className="text-xs text-[#c9a227] mt-1">
                Supreme Court · Court of Appeal · High Courts · Rent Tribunals
              </p>
              <div className="w-full border-t border-white/10 mt-6 pt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="block font-mono-code text-lg font-bold text-white tabular-nums">
                    {branches.filter((b) => b.status === 'Active').length}
                  </span>
                  <span className="text-[11px] text-stone-300">Active Branches</span>
                </div>
                <div>
                  <span className="block font-mono-code text-lg font-bold text-white tabular-nums">
                    11
                  </span>
                  <span className="text-[11px] text-stone-300">Court Jurisdictions</span>
                </div>
                <div>
                  <span className="block font-mono-code text-lg font-bold text-white tabular-nums">
                    {publicProperties.length}
                  </span>
                  <span className="text-[11px] text-stone-300">Public Listings</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Practice Pillars */}
        <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-serif-display text-2xl lg:text-3xl font-bold text-[#1a2a4a]">
                Core Legal &amp; Property Mandates
              </h2>
              <p className="text-sm text-[#5a5a5a] mt-1">
                Structured representation governed by the Legal Practitioners Remuneration Order 2023.
              </p>
            </div>
            <Link
              to="/practice-areas"
              className="text-sm font-semibold text-[#1a2a4a] hover:text-[#c9a227] whitespace-nowrap shrink-0"
            >
              View All Practice Areas &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-200 p-6 rounded">
              <span className="text-xs font-mono-code text-[#5a5a5a]">01 · LITIGATION</span>
              <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a] mt-2">
                Appellate &amp; Superior Court Advocacy
              </h3>
              <p className="text-sm text-[#5a5a5a] mt-2 leading-relaxed">
                Representation before the Supreme Court of Nigeria, Court of Appeal, Federal and
                State High Courts, National Industrial Court, Sharia and Customary Courts.
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-6 rounded">
              <span className="text-xs font-mono-code text-[#5a5a5a]">02 · REAL ESTATE</span>
              <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a] mt-2">
                Chartered Property &amp; Tenancy Administration
              </h3>
              <p className="text-sm text-[#5a5a5a] mt-2 leading-relaxed">
                End-to-end portfolio management for property owners, KYC-verified tenant
                onboarding, statutory quit notices, rent collection, and Rent Tribunal recovery.
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-6 rounded">
              <span className="text-xs font-mono-code text-[#5a5a5a]">03 · CORPORATE &amp; TRUST</span>
              <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a] mt-2">
                Commercial Advisory &amp; Client Trust Accounts
              </h3>
              <p className="text-sm text-[#5a5a5a] mt-2 leading-relaxed">
                Three-way reconciled client trust accounting, conveyancing, title perfection,
                statutory compliance, and commercial contract drafting.
              </p>
            </div>
          </div>
        </section>

        {/* Access Portals Strip */}
        <section className="py-12 px-6 lg:px-12 bg-white border-y border-stone-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link
              to="/client-access"
              className="border border-stone-200 p-5 rounded hover:border-[#1a2a4a] transition-colors"
            >
              <Scale className="w-5 h-5 text-[#1a2a4a] mb-2" />
              <h3 className="font-serif-display font-bold text-base text-[#1a2a4a]">
                Client Access
              </h3>
              <p className="text-xs text-[#5a5a5a] mt-1">
                Inspect matter progress, court dates, invoices, and receipts with your Client ID.
              </p>
            </Link>

            <Link
              to="/owner-access"
              className="border border-stone-200 p-5 rounded hover:border-[#1a2a4a] transition-colors"
            >
              <Building2 className="w-5 h-5 text-[#1a2a4a] mb-2" />
              <h3 className="font-serif-display font-bold text-base text-[#1a2a4a]">
                Owner Access
              </h3>
              <p className="text-xs text-[#5a5a5a] mt-1">
                Review multi-property portfolios, tenant occupancy, and net remittances.
              </p>
            </Link>

            <Link
              to="/tenant-access"
              className="border border-stone-200 p-5 rounded hover:border-[#1a2a4a] transition-colors"
            >
              <FileText className="w-5 h-5 text-[#1a2a4a] mb-2" />
              <h3 className="font-serif-display font-bold text-base text-[#1a2a4a]">
                Tenant Access
              </h3>
              <p className="text-xs text-[#5a5a5a] mt-1">
                View tenancy agreements, rent schedules, receipts, and log maintenance tickets.
              </p>
            </Link>

            <Link
              to="/staff-login"
              className="border border-[#1a2a4a] bg-[#1a2a4a] text-white p-5 rounded hover:bg-[#121e36] transition-colors"
            >
              <Shield className="w-5 h-5 text-[#c9a227] mb-2" />
              <h3 className="font-serif-display font-bold text-base text-white">
                Staff Secure Access
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                Internal multi-branch chamber workspace for Partners, Heads of Chamber &amp; Counsel.
              </p>
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
};

// 2. PUBLIC CONTENT PAGES (/about, /practice-areas, /team, /faq, /terms, /privacy)
export const PublicInformationalPage: React.FC<{
  pageKey: 'about' | 'practice-areas' | 'team' | 'faq' | 'terms' | 'privacy';
}> = ({ pageKey }) => {
  const { records, branches } = useFirm();
  const cmsItems = records.filter(
    (r) => r.module === 'public-content' && r.subCategory === pageKey && r.isPublic
  );
  const teamMembers = records.filter((r) => r.module === 'staff' && r.isPublic);

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
  ];

  const CASE_TYPES = [
    'Civil Litigation',
    'Criminal Defence & Fiat',
    'Sharia Personal & Commercial',
    'Family & Matrimonial Causes',
    'Commercial & Corporate',
    'Constitutional & Human Rights',
    'Land, Title & Property Recovery',
    'Labour & Employment',
    'Taxation & Revenue Appeals',
    'Election Petitions',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f1]">
      <PublicHeader />
      <main className="flex-1 max-w-6xl w-full mx-auto py-12 px-6">
        {pageKey === 'about' && (
          <div className="space-y-8">
            <div className="bg-white border border-stone-200 p-8 rounded">
              <span className="text-xs font-mono-code text-[#5a5a5a]">CHAMBER HERITAGE</span>
              <h1 className="font-serif-display text-3xl font-bold text-[#1a2a4a] mt-2">
                About B. B. BALE &amp; CO CHAMBERS
              </h1>
              <p className="text-sm text-[#1c1c1c] leading-relaxed mt-4">
                B. B. BALE &amp; CO CHAMBERS is an integrated multi-branch Nigerian law firm and
                chartered property management practice. Under the leadership of the Principal
                Partner and branch Heads of Chamber, the firm combines courtroom advocacy with
                fiduciary real estate administration.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-stone-200">
                <div>
                  <h3 className="font-serif-display font-bold text-[#1a2a4a]">
                    Multi-Branch Governance
                  </h3>
                  <p className="text-xs text-[#5a5a5a] mt-1">
                    Each branch is led by a Head of Chamber with delegated operational authority
                    and real-time synchronization to the Principal Partner.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-[#1a2a4a]">
                    Three-Way Trust Integrity
                  </h3>
                  <p className="text-xs text-[#5a5a5a] mt-1">
                    Client funds and landlord rent collections are held in designated trust
                    accounts subject to mandatory Principal Partner withdrawal oversight.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-[#1a2a4a]">
                    Active Chamber Branches ({branches.filter((b) => b.status === 'Active').length})
                  </h3>
                  <p className="text-xs text-[#5a5a5a] mt-1">
                    {branches.filter((b) => b.status === 'Active').length === 0
                      ? 'Branches appear here automatically once configured by the Principal Partner.'
                      : branches
                          .filter((b) => b.status === 'Active')
                          .map((b) => `${b.name} (${b.city})`)
                          .join(' · ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {pageKey === 'practice-areas' && (
          <div className="space-y-8">
            <div>
              <h1 className="font-serif-display text-3xl font-bold text-[#1a2a4a]">
                Practice Areas &amp; Court Jurisdictions
              </h1>
              <p className="text-sm text-[#5a5a5a] mt-1">
                Hierarchical litigation and advisory organization across Nigerian superior and
                specialized courts.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-stone-200 p-6 rounded">
                <h2 className="font-serif-display text-lg font-bold text-[#1a2a4a] mb-4">
                  Courts of Record &amp; Tribunals
                </h2>
                <ul className="space-y-2.5 text-sm text-[#1c1c1c]">
                  {COURT_CATEGORIES.map((c, idx) => (
                    <li key={c} className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span>{c}</span>
                      <span className="font-mono-code text-xs text-[#5a5a5a]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-stone-200 p-6 rounded">
                <h2 className="font-serif-display text-lg font-bold text-[#1a2a4a] mb-4">
                  Specialized Case Divisions
                </h2>
                <ul className="space-y-2.5 text-sm text-[#1c1c1c]">
                  {CASE_TYPES.map((t, idx) => (
                    <li key={t} className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span>{t}</span>
                      <span className="font-mono-code text-xs text-[#5a5a5a]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {pageKey === 'team' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif-display text-3xl font-bold text-[#1a2a4a]">
                Our Legal &amp; Administrative Team
              </h1>
              <p className="text-sm text-[#5a5a5a] mt-1">
                Published counsel and chamber leadership across active branches.
              </p>
            </div>
            {teamMembers.length === 0 && cmsItems.length === 0 ? (
              <div className="bg-white border border-stone-200 p-10 rounded text-center">
                <p className="font-serif-display text-lg font-bold text-[#1a2a4a]">
                  No Public Team Profiles Published Yet
                </p>
                <p className="text-xs text-[#5a5a5a] mt-1">
                  The system starts clean with zero fabricated profiles. Team profiles published by
                  the Principal Partner in Public Content / Staff Management appear here in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...teamMembers, ...cmsItems].map((member) => (
                  <div key={member.id} className="bg-white border border-stone-200 p-6 rounded">
                    <p className="text-xs font-mono-code text-[#c9a227]">{member.branchCode}</p>
                    <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a] mt-1">
                      {member.title}
                    </h3>
                    <p className="text-xs text-[#5a5a5a] mt-0.5">{member.subtitle || member.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {pageKey === 'faq' && (
          <div className="bg-white border border-stone-200 p-8 rounded space-y-6">
            <h1 className="font-serif-display text-3xl font-bold text-[#1a2a4a]">
              Frequently Asked Questions
            </h1>
            <div className="space-y-4 text-sm">
              <div className="border-b border-stone-200 pb-4">
                <h3 className="font-semibold text-[#1a2a4a]">
                  How do clients, landlords, and tenants access their records?
                </h3>
                <p className="text-[#5a5a5a] mt-1">
                  Each registered Client, Property Owner, and Tenant is issued a branch-prefixed
                  Unique ID (e.g., BBB-LAG/CLI/0001) and a private Portal Access Code by the
                  chamber. Enter both on the respective Access Portal page.
                </p>
              </div>
              <div className="border-b border-stone-200 pb-4">
                <h3 className="font-semibold text-[#1a2a4a]">
                  How are legal fees and statutory charges computed?
                </h3>
                <p className="text-[#5a5a5a] mt-1">
                  Legal fees comply with the Legal Practitioners Remuneration Order (LPRO) 2023
                  scales set by the Principal Partner, with statutory Value Added Tax (7.5% VAT)
                  and applicable Withholding Tax (WHT) automatically itemized on branch invoices.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a2a4a]">
                  Why do public property listings only show the city?
                </h3>
                <p className="text-[#5a5a5a] mt-1">
                  In compliance with owner security protocols and the Nigeria Data Protection Act
                  (NDPA), public property listings display city-level location and specification
                  details only. Full inspection particulars are provided upon verified inquiry.
                </p>
              </div>
            </div>
          </div>
        )}

        {pageKey === 'terms' && (
          <div className="bg-white border border-stone-200 p-8 rounded space-y-4">
            <h1 className="font-serif-display text-3xl font-bold text-[#1a2a4a]">
              Terms of Legal Engagement &amp; Portal Use
            </h1>
            <p className="text-sm text-[#5a5a5a] leading-relaxed">
              Engagement of B. B. BALE &amp; CO CHAMBERS is subject to mandatory firm-wide
              conflict-of-interest clearance, Know-Your-Client (KYC) verification, and execution of
              a formal retainer or property management mandate governed by the laws of the Federal
              Republic of Nigeria and the Legal Practitioners Remuneration Order 2023.
            </p>
          </div>
        )}

        {pageKey === 'privacy' && (
          <div className="bg-white border border-stone-200 p-8 rounded space-y-4">
            <h1 className="font-serif-display text-3xl font-bold text-[#1a2a4a]">
              Privacy Notice &amp; NDPA 2023 Compliance
            </h1>
            <p className="text-sm text-[#5a5a5a] leading-relaxed">
              B. B. BALE &amp; CO CHAMBERS processes personal, litigation, and property records in
              strict compliance with the Nigeria Data Protection Act (NDPA) 2023. Branch records
              are isolated by branch authority, gallery photography requires documented NDPA subject
              consent, and statutory hard-copy backups are retained for 7 years.
            </p>
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
};

// 3. GALLERY & BRANCH GALLERY (/gallery and /gallery/:branchCode)
export const PublicGalleryPage: React.FC = () => {
  const { branchCode } = useParams<{ branchCode?: string }>();
  const navigate = useNavigate();
  const { branches, records } = useFirm();
  const activeFilter = branchCode || 'ALL';

  const galleryRecords = records.filter(
    (r) =>
      r.module === 'gallery-admin' &&
      r.isPublic &&
      r.details?.ndpaConsent === true &&
      (activeFilter === 'ALL' || r.branchCode === activeFilter)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f1]">
      <PublicHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif-display text-3xl font-bold text-[#1a2a4a]">
              Chamber &amp; Branch Gallery
            </h1>
            <p className="text-sm text-[#5a5a5a] mt-1">
              NDPA-consented chamber events, facilities, and branch milestones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded border border-stone-200">
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-[#1a2a4a] text-white'
                  : 'text-[#5a5a5a] hover:text-[#1a2a4a]'
              }`}
            >
              All Branches
            </button>
            {branches
              .filter((b) => b.status === 'Active')
              .map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => navigate(`/gallery/${b.code}`)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                    activeFilter === b.code
                      ? 'bg-[#1a2a4a] text-white'
                      : 'text-[#5a5a5a] hover:text-[#1a2a4a]'
                  }`}
                >
                  {b.name} ({b.code})
                </button>
              ))}
          </div>
        </div>

        {galleryRecords.length === 0 ? (
          <div className="bg-white border border-stone-200 p-12 rounded text-center">
            <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a]">
              No Gallery Photographs Published Yet
            </h3>
            <p className="text-xs text-[#5a5a5a] mt-1">
              Photographs uploaded via the native file picker with verified NDPA consent in Gallery
              Admin appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryRecords.map((item) => (
              <div key={item.id} className="bg-white border border-stone-200 rounded overflow-hidden">
                {item.details?.fileUrl ? (
                  <img
                    src={item.details.fileUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-56 object-cover bg-stone-100"
                  />
                ) : (
                  <div className="w-full h-56 bg-[#1a2a4a] flex items-center justify-center text-[#c9a227] text-xs font-mono-code">
                    {item.uniqueCode}
                  </div>
                )}
                <div className="p-4">
                  <div className="text-xs text-[#5a5a5a]">
                    <span>{item.branchCode}</span>
                    <span className="mx-1.5">·</span>
                    <span>NDPA Consent Verified</span>
                  </div>
                  <h3 className="font-serif-display font-bold text-base text-[#1a2a4a] mt-1">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs text-[#5a5a5a] mt-1">{item.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
};

// 4. PUBLIC PROPERTY LISTINGS (/properties — City-Level Only per Section 13)
export const PublicPropertiesPage: React.FC = () => {
  const { records } = useFirm();
  const [cityFilter, setCityFilter] = useState('ALL');
  const publicProps = records.filter((r) => r.module === 'properties' && r.isPublic);
  const cities = Array.from(
    new Set(publicProps.map((p) => p.details?.city || p.category || 'Unspecified'))
  );

  const filtered = publicProps.filter(
    (p) => cityFilter === 'ALL' || (p.details?.city || p.category) === cityFilter
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f1]">
      <PublicHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif-display text-3xl font-bold text-[#1a2a4a]">
              Public Property Listings (City-Level Directory)
            </h1>
            <p className="text-sm text-[#5a5a5a] mt-1">
              Managed residential and commercial properties. Exact street addresses and owner
              identities are restricted until formal inquiry.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCityFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded cursor-pointer ${
                cityFilter === 'ALL' ? 'bg-[#1a2a4a] text-white' : 'bg-white border border-stone-200'
              }`}
            >
              All Cities
            </button>
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCityFilter(c)}
                className={`px-3 py-1.5 text-xs font-medium rounded cursor-pointer ${
                  cityFilter === c ? 'bg-[#1a2a4a] text-white' : 'bg-white border border-stone-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-stone-200 p-12 rounded text-center">
            <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a]">
              No Public Property Listings Currently Published
            </h3>
            <p className="text-xs text-[#5a5a5a] mt-1">
              Properties marked for public listing by branch administrators appear here with
              city-level privacy protection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((prop) => (
              <div key={prop.id} className="bg-white border border-stone-200 p-6 rounded flex flex-col justify-between">
                <div>
                  <div className="text-xs text-[#5a5a5a] font-mono-code">
                    <span>{prop.uniqueCode}</span>
                    <span className="mx-1.5">·</span>
                    <span>City: {prop.details?.city || prop.category || 'Nigeria'}</span>
                  </div>
                  <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a] mt-2">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-[#5a5a5a] mt-1">
                    Property Type: {prop.subCategory || 'Residential / Commercial'} · Status:{' '}
                    {prop.status}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono-code text-sm font-bold text-[#1a2a4a] tabular-nums">
                    NGN {(prop.amount || 0).toLocaleString()} / yr
                  </span>
                  <Link
                    to="/book"
                    className="px-3 py-1.5 text-xs font-semibold bg-[#1a2a4a] text-white rounded hover:bg-[#121e36]"
                  >
                    Request Viewing
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
};

// 5. CONSULTATION BOOKING (/book) & CONTACT + LIVE CHAT (/contact)
export const BookConsultationPage: React.FC = () => {
  const { branches, createRecord, generateUniqueCode } = useFirm();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [branchCode, setBranchCode] = useState(branches[0]?.code || 'BBB-HQ');
  const [practiceArea, setPracticeArea] = useState('Civil Litigation');
  const [preferredDate, setPreferredDate] = useState('');
  const [summary, setSummary] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !preferredDate) return;
    const code = generateUniqueCode('CON', true, branchCode);
    await createRecord({
      module: 'consultations',
      uniqueCode: code,
      title: `${fullName.trim()} — ${practiceArea}`,
      subtitle: `Preferred Date: ${preferredDate} · Tel: ${phone.trim()}`,
      branchId: branchCode,
      branchCode,
      status: 'Pending Confirmation',
      category: practiceArea,
      subCategory: preferredDate,
      isPublic: false,
      details: {
        clientName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        summary: summary.trim(),
      },
    });
    setBookingRef(code);
    setFullName('');
    setPhone('');
    setEmail('');
    setSummary('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f1]">
      <PublicHeader />
      <main className="flex-1 max-w-3xl w-full mx-auto py-12 px-6">
        <div className="bg-white border border-stone-200 p-8 rounded">
          <h1 className="font-serif-display text-2xl font-bold text-[#1a2a4a]">
            Schedule a Legal or Property Consultation
          </h1>
          <p className="text-xs text-[#5a5a5a] mt-1">
            Your consultation request is routed directly to the selected branch Administrator and
            Head of Chamber in real time.
          </p>

          {bookingRef && (
            <div className="mt-6 p-4 bg-[#2e7d32]/10 border border-[#2e7d32] rounded flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#2e7d32] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#1a2a4a]">
                  Consultation Request Registered
                </p>
                <p className="text-xs text-[#5a5a5a] mt-0.5">
                  Reference Code:{' '}
                  <span className="font-mono-code font-bold text-[#1a2a4a]">{bookingRef}</span>
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#1a2a4a]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                  Telephone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#1a2a4a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#1a2a4a]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                  Chamber Branch *
                </label>
                <select
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded bg-white focus:outline-none focus:border-[#1a2a4a]"
                >
                  {branches.length === 0 ? (
                    <option value="BBB-HQ">Headquarters (BBB-HQ)</option>
                  ) : (
                    branches.map((b) => (
                      <option key={b.id} value={b.code}>
                        {b.name} ({b.code})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#1a2a4a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                Practice Area / Subject *
              </label>
              <select
                value={practiceArea}
                onChange={(e) => setPracticeArea(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded bg-white focus:outline-none focus:border-[#1a2a4a]"
              >
                <option value="Civil Litigation">Civil Litigation</option>
                <option value="Criminal Defence">Criminal Defence</option>
                <option value="Land & Property Management">Land &amp; Property Management</option>
                <option value="Corporate & Commercial">Corporate &amp; Commercial</option>
                <option value="Family & Probate">Family &amp; Probate</option>
                <option value="Sharia & Customary">Sharia &amp; Customary Law</option>
                <option value="Rent Tribunal & Recovery">Rent Tribunal &amp; Recovery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                Brief Statement of Matter *
              </label>
              <textarea
                rows={4}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#1a2a4a]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold bg-[#1a2a4a] text-white rounded hover:bg-[#121e36] transition-colors cursor-pointer"
            >
              Submit Consultation Booking
            </button>
          </form>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

// 6. CONTACT & LIVE CHAT WITH ADMINISTRATOR + WHATSAPP FALLBACK (/contact)
export const ContactPage: React.FC = () => {
  const { branches, records, createRecord, generateUniqueCode } = useFirm();
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [branchCode, setBranchCode] = useState(branches[0]?.code || 'BBB-HQ');
  const [messageText, setMessageText] = useState('');
  const [chatSentCode, setChatSentCode] = useState('');

  const whatsappSetting = records.find(
    (r) => r.module === 'settings' && r.category === 'WhatsAppFallback'
  );
  const whatsappNumber = whatsappSetting?.subtitle || '';

  const handleSendLiveChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !messageText.trim()) return;
    const code = generateUniqueCode('CHAT', true, branchCode);
    await createRecord({
      module: 'chats',
      uniqueCode: code,
      title: `${senderName.trim()} (${senderContact.trim() || 'Visitor'})`,
      subtitle: messageText.trim(),
      branchId: branchCode,
      branchCode,
      status: 'Active Inquiry',
      category: 'Live Chat',
      isPublic: false,
      details: {
        senderName: senderName.trim(),
        senderContact: senderContact.trim(),
        message: messageText.trim(),
      },
    });
    setChatSentCode(code);
    setMessageText('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f1]">
      <PublicHeader />
      <main className="flex-1 max-w-6xl w-full mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <h1 className="font-serif-display text-3xl font-bold text-[#1a2a4a]">
            Chamber Branch Directory
          </h1>
          <p className="text-sm text-[#5a5a5a]">
            Connect directly with our branch chambers or initiate a real-time chat with the
            Branch Administrator.
          </p>

          {branches.filter((b) => b.status === 'Active').length === 0 ? (
            <div className="bg-white border border-stone-200 p-6 rounded">
              <p className="text-sm font-semibold text-[#1a2a4a]">
                No Branch Offices Configured Yet
              </p>
              <p className="text-xs text-[#5a5a5a] mt-1">
                Once the Principal Partner registers branch offices in `/branches`, their addresses
                and telephone numbers appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {branches
                .filter((b) => b.status === 'Active')
                .map((b) => (
                  <div key={b.id} className="bg-white border border-stone-200 p-5 rounded">
                    <span className="font-mono-code text-xs text-[#c9a227] font-semibold">
                      {b.code}
                    </span>
                    <h3 className="font-serif-display text-lg font-bold text-[#1a2a4a]">
                      {b.name} — {b.city}, {b.state}
                    </h3>
                    {b.address && <p className="text-xs text-[#5a5a5a] mt-1">{b.address}</p>}
                    <p className="text-xs text-[#1c1c1c] mt-2 font-mono-code">
                      {b.phone || 'Tel pending'} · {b.email || 'Email pending'}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 bg-white border border-stone-200 p-8 rounded">
          <div className="flex items-center gap-2 text-[#1a2a4a]">
            <MessageSquare className="w-5 h-5 text-[#c9a227]" />
            <h2 className="font-serif-display text-xl font-bold">
              Live Chat with Branch Administrator
            </h2>
          </div>
          <p className="text-xs text-[#5a5a5a] mt-1">
            Messages sync instantaneously to the Branch Administrator&apos;s `/chats` console.
          </p>

          {chatSentCode && (
            <div className="mt-4 p-3 bg-[#2e7d32]/10 border border-[#2e7d32] rounded text-xs text-[#1a2a4a]">
              Live chat session <span className="font-mono-code font-bold">{chatSentCode}</span>{' '}
              transmitted to the Administrator.
            </div>
          )}

          <form onSubmit={handleSendLiveChat} className="space-y-4 mt-5">
            <div>
              <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                Phone or Email *
              </label>
              <input
                type="text"
                required
                value={senderContact}
                onChange={(e) => setSenderContact(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                Target Branch
              </label>
              <select
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded bg-white"
              >
                {branches.length === 0 ? (
                  <option value="BBB-HQ">Headquarters (BBB-HQ)</option>
                ) : (
                  branches.map((b) => (
                    <option key={b.id} value={b.code}>
                      {b.name} ({b.code})
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">Message *</label>
              <textarea
                rows={3}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold bg-[#1a2a4a] text-white rounded hover:bg-[#121e36] cursor-pointer"
              >
                Transmit Live Chat
              </button>
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-xs font-semibold border border-[#2e7d32] text-[#2e7d32] rounded hover:bg-[#2e7d32] hover:text-white transition-colors"
                >
                  WhatsApp Fallback
                </a>
              )}
            </div>
          </form>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

// 7. CLIENT, OWNER & TENANT PORTAL ACCESS (/client-access, /owner-access, /tenant-access)
export const PortalAccessPage: React.FC<{
  portalType: 'client' | 'owner' | 'tenant';
}> = ({ portalType }) => {
  const { portalSession, authenticatePortal, logoutPortal, records, createRecord, generateUniqueCode } =
    useFirm();
  const [uniqueIdInput, setUniqueIdInput] = useState('');
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  const titles = {
    client: 'Client Matter & Billing Portal',
    owner: 'Property Owner Portfolio & Remittance Portal',
    tenant: 'Tenant Lease, Rent & Maintenance Portal',
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = authenticatePortal(portalType, uniqueIdInput, accessCodeInput);
    if (!res.ok) {
      setErrorMsg(res.error || 'Invalid credentials. Please try again.');
    }
  };

  const isAuthenticatedForThisPortal =
    portalSession && portalSession.portalType === portalType;

  const relatedRecords = isAuthenticatedForThisPortal
    ? records.filter(
        (r) =>
          r.details?.linkedEntityCode === portalSession.uniqueCode ||
          r.subtitle?.includes(portalSession.uniqueCode)
      )
    : [];

  const handleTenantMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticatedForThisPortal || !ticketTitle.trim()) return;
    const code = generateUniqueCode('MNT', true, portalSession.record.branchCode);
    await createRecord({
      module: 'maintenance',
      uniqueCode: code,
      title: ticketTitle.trim(),
      subtitle: `Tenant: ${portalSession.uniqueCode} — ${ticketDesc.trim()}`,
      branchId: portalSession.record.branchId,
      branchCode: portalSession.record.branchCode,
      status: 'Open Ticket',
      category: 'Tenant Maintenance Request',
      details: {
        linkedEntityCode: portalSession.uniqueCode,
        description: ticketDesc.trim(),
      },
    });
    setTicketTitle('');
    setTicketDesc('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f1]">
      <PublicHeader />
      <main className="flex-1 max-w-5xl w-full mx-auto py-12 px-6">
        {!isAuthenticatedForThisPortal ? (
          <div className="max-w-md mx-auto bg-white border border-stone-200 p-8 rounded">
            <div className="flex items-center gap-2.5 text-[#1a2a4a] mb-2">
              <Lock className="w-5 h-5 text-[#c9a227]" />
              <h1 className="font-serif-display text-xl font-bold">{titles[portalType]}</h1>
            </div>
            <p className="text-xs text-[#5a5a5a] mb-6">
              Enter your assigned Chamber Unique Code and Portal Access Code.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-[#c62828]/10 border border-[#c62828] rounded text-xs text-[#c62828] font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                  Assigned Unique ID
                </label>
                <input
                  type="text"
                  required
                  value={uniqueIdInput}
                  onChange={(e) => setUniqueIdInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-code border border-stone-300 rounded focus:outline-none focus:border-[#1a2a4a]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                  Portal Access Code
                </label>
                <input
                  type="password"
                  required
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#1a2a4a]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold bg-[#1a2a4a] text-white rounded hover:bg-[#121e36] cursor-pointer"
              >
                Verify &amp; Open Portal
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 p-6 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono-code text-xs text-[#c9a227] font-bold">
                  {portalSession.uniqueCode} · Branch {portalSession.record.branchCode}
                </span>
                <h1 className="font-serif-display text-2xl font-bold text-[#1a2a4a]">
                  {portalSession.record.title}
                </h1>
                <p className="text-xs text-[#5a5a5a]">{portalSession.record.subtitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-stone-300 rounded hover:bg-stone-50 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Statement
                </button>
                <button
                  type="button"
                  onClick={logoutPortal}
                  className="px-4 py-2 text-xs font-semibold bg-[#c62828] text-white rounded cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-6 rounded">
              <h2 className="font-serif-display text-lg font-bold text-[#1a2a4a] mb-4">
                Linked Chamber Records ({relatedRecords.length})
              </h2>
              {relatedRecords.length === 0 ? (
                <p className="text-xs text-[#5a5a5a]">
                  No linked matters, invoices, or property statements have been tagged to{' '}
                  <span className="font-mono-code">{portalSession.uniqueCode}</span> yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-[#5a5a5a]">
                        <th className="py-2 px-3">Code</th>
                        <th className="py-2 px-3">Module</th>
                        <th className="py-2 px-3">Title / Particulars</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3 text-right">Amount (NGN)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatedRecords.map((r) => (
                        <tr key={r.id} className="border-b border-stone-100">
                          <td className="py-2.5 px-3 font-mono-code font-semibold">{r.uniqueCode}</td>
                          <td className="py-2.5 px-3 capitalize">{r.module}</td>
                          <td className="py-2.5 px-3">{r.title}</td>
                          <td className="py-2.5 px-3">{r.status}</td>
                          <td className="py-2.5 px-3 text-right font-mono-code tabular-nums">
                            {(r.amount || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {portalType === 'tenant' && (
              <div className="bg-white border border-stone-200 p-6 rounded">
                <h3 className="font-serif-display text-base font-bold text-[#1a2a4a] mb-3">
                  Log Property Maintenance Request
                </h3>
                <form onSubmit={handleTenantMaintenanceSubmit} className="space-y-3">
                  <input
                    type="text"
                    required
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                  />
                  <textarea
                    rows={2}
                    required
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-[#1a2a4a] text-white rounded cursor-pointer"
                  >
                    Submit Maintenance Ticket
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
};

// 8. SECURE LOGIN PAGE (/staff-login — Section 6 & 7)
// - Firm logo (Nigerian Court Eagle)
// - "Secure Access" header with shield icon
// - Empty input fields (NO placeholder text!)
// - Shield-logo "SIGN IN" button
// - Neutral error: "Invalid credentials. Please try again."
// - Forced password change on first login & MFA verification
export const StaffLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    customFirmLogoUrl,
    loginWithCredentials,
    loginWithGoogle,
    completeForcedPasswordChange,
    verifyMfaCode,
  } = useFirm();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState<'login' | 'force-password' | 'mfa'>(() => {
    if (currentUser?.mustChangePassword) return 'force-password';
    return 'login';
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const result = await loginWithCredentials(username, password);
    if (!result.ok) {
      setErrorMsg('Invalid credentials. Please try again.');
      return;
    }
    if (result.requiresPasswordChange) {
      setStep('force-password');
    } else if (result.requiresMfa) {
      setStep('mfa');
    } else {
      navigate('/dashboard');
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    const res = await completeForcedPasswordChange(newPassword);
    if (!res.ok) {
      setErrorMsg(res.error || 'Password change failed.');
      return;
    }
    setStep('mfa');
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await verifyMfaCode(mfaCode);
    if (!ok) {
      setErrorMsg('Enter a valid 6-digit verification code.');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f1]">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-stone-200 rounded-lg p-8 shadow-xs">
          <div className="flex flex-col items-center text-center mb-6">
            <NigerianEagleLogo size={84} customLogoUrl={customFirmLogoUrl} />
            <div className="flex items-center gap-2 mt-4 text-[#1a2a4a]">
              <Shield className="w-5 h-5 text-[#c9a227]" />
              <h1 className="font-serif-display text-2xl font-bold">Secure Access</h1>
            </div>
            <p className="text-xs text-[#5a5a5a] mt-1">
              B. B. BALE &amp; CO CHAMBERS — Authorized Personnel Only
            </p>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="mb-5 p-3 bg-[#c62828]/10 border border-[#c62828] rounded text-xs text-[#c62828] font-medium text-center"
            >
              {errorMsg}
            </div>
          )}

          {step === 'login' && (
            <form onSubmit={handleSignIn} className="space-y-4" autoComplete="off">
              <div>
                <label
                  htmlFor="staff-username"
                  className="block text-xs font-semibold text-[#1a2a4a] mb-1.5"
                >
                  Username
                </label>
                {/* Section 6.1: Empty input fields (strictly no placeholder attribute) */}
                <input
                  id="staff-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded bg-white text-[#1c1c1c] focus:outline-none focus:border-[#1a2a4a]"
                />
              </div>

              <div>
                <label
                  htmlFor="staff-password"
                  className="block text-xs font-semibold text-[#1a2a4a] mb-1.5"
                >
                  Password
                </label>
                {/* Section 6.1: Empty input fields (strictly no placeholder attribute) */}
                <input
                  id="staff-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded bg-white text-[#1c1c1c] focus:outline-none focus:border-[#1a2a4a]"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold tracking-wider bg-[#1a2a4a] text-white rounded hover:bg-[#121e36] transition-colors cursor-pointer"
              >
                <Shield className="w-4 h-4 text-[#c9a227]" />
                SIGN IN
              </button>

              <div className="pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={async () => {
                    const res = await loginWithGoogle();
                    if (res.ok) navigate('/dashboard');
                    else setErrorMsg('Invalid credentials. Please try again.');
                  }}
                  className="w-full py-2 px-3 text-xs font-medium border border-stone-300 text-[#1a2a4a] rounded hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Verify with Firebase Google Auth
                </button>
              </div>
            </form>
          )}

          {step === 'force-password' && (
            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div className="p-3 bg-[#f9a825]/15 border border-[#f9a825] rounded text-xs text-[#1c1c1c]">
                <strong>Mandatory First-Login Security Policy:</strong> You must change the default
                password before accessing the chamber workspace. This step cannot be skipped and
                previous passwords cannot be reused.
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold bg-[#1a2a4a] text-white rounded hover:bg-[#121e36] cursor-pointer"
              >
                <Shield className="w-4 h-4 text-[#c9a227]" />
                UPDATE PASSWORD &amp; CONTINUE
              </button>
            </form>
          )}

          {step === 'mfa' && (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="p-3 bg-stone-100 border border-stone-200 rounded text-xs text-[#1c1c1c]">
                <strong>New Device Multi-Factor Verification (MFA):</strong> Enter your 6-digit
                chamber security OTP to authorize this device for real-time Firestore sync.
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a2a4a] mb-1">
                  6-Digit Security OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full px-3.5 py-2 text-center font-mono-code text-base tracking-widest border border-stone-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold bg-[#1a2a4a] text-white rounded hover:bg-[#121e36] cursor-pointer"
              >
                <Shield className="w-4 h-4 text-[#c9a227]" />
                VERIFY DEVICE &amp; ENTER CHAMBER
              </button>
            </form>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};
