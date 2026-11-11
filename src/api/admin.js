/**
 * admin.js — Admin API client functions.
 * All admin routes require isAdmin=true on the server.
 */
import http from './http';

// ── Stats ─────────────────────────────────────────────────────────────────────
export const adminGetStats = () => http('/admin/stats');

// ── Analytics ─────────────────────────────────────────────────────────────────
export const adminGetAnalytics = () => http('/admin/biodatas/analytics');

// ── Users ─────────────────────────────────────────────────────────────────────
export const adminGetUsers = ({ page = 1, limit = 20, search = '' } = {}) =>
  http(`/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

export const adminToggleUserDisable = (id) =>
  http(`/admin/users/${id}/disable`, { method: 'PATCH' });

export const adminDeleteUser = (id) =>
  http(`/admin/users/${id}`, { method: 'DELETE' });

// ── Biodatas ──────────────────────────────────────────────────────────────────
export const adminGetBiodatas = ({ page = 1, limit = 20, search = '', filter = 'all' } = {}) =>
  http(`/admin/biodatas?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&filter=${filter}`);

export const adminToggleBiodataVisibility = (id) =>
  http(`/admin/biodatas/${id}/visibility`, { method: 'PATCH' });

export const adminDeleteBiodata = (id) =>
  http(`/admin/biodatas/${id}`, { method: 'DELETE' });

// ── Contact Enquiries ─────────────────────────────────────────────────────────
export const adminGetEnquiries = ({ page = 1, limit = 20, search = '', status = 'All' } = {}) =>
  http(`/admin/enquiries?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`);

export const adminGetEnquiry = (id) =>
  http(`/admin/enquiries/${id}`);

export const adminUpdateEnquiryStatus = (id, status) =>
  http(`/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const adminDeleteEnquiry = (id) =>
  http(`/admin/enquiries/${id}`, { method: 'DELETE' });
