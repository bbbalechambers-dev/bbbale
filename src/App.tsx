/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FirmProvider } from './context/FirmContext';
import {
  HomePage,
  PublicInformationalPage,
  PublicGalleryPage,
  PublicPropertiesPage,
  BookConsultationPage,
  ContactPage,
  PortalAccessPage,
  StaffLoginPage,
} from './pages/PublicSite';
import { InternalWorkspace, INTERNAL_ROUTES } from './pages/InternalSite';

export default function App() {
  return (
    <FirmProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Site Routes (Section 4.2) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<PublicInformationalPage pageKey="about" />} />
          <Route
            path="/practice-areas"
            element={<PublicInformationalPage pageKey="practice-areas" />}
          />
          <Route path="/team" element={<PublicInformationalPage pageKey="team" />} />
          <Route path="/gallery" element={<PublicGalleryPage />} />
          <Route path="/gallery/:branchCode" element={<PublicGalleryPage />} />
          <Route path="/book" element={<BookConsultationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/properties" element={<PublicPropertiesPage />} />
          <Route path="/faq" element={<PublicInformationalPage pageKey="faq" />} />
          <Route path="/terms" element={<PublicInformationalPage pageKey="terms" />} />
          <Route path="/privacy" element={<PublicInformationalPage pageKey="privacy" />} />

          {/* Sensitive Public Portal Routes (Section 4.2) */}
          <Route path="/client-access" element={<PortalAccessPage portalType="client" />} />
          <Route path="/owner-access" element={<PortalAccessPage portalType="owner" />} />
          <Route path="/tenant-access" element={<PortalAccessPage portalType="tenant" />} />
          <Route path="/staff-login" element={<StaffLoginPage />} />

          {/* Internal Site Routes (Section 4.3 — 37 Routes) */}
          {INTERNAL_ROUTES.map((route) => (
            <Route key={route.path} path={route.path} element={<InternalWorkspace />} />
          ))}

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </FirmProvider>
  );
}
