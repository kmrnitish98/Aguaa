/**
 * biodata.js — Biodata domain API module.
 *
 * All biodata-related API calls live here, including:
 *  - Paginated public list (cursor-based, ready for infinite scroll)
 *  - CRUD operations
 *  - Photo upload with XHR progress tracking
 *
 * Import from '../api' (barrel) in application code.
 */

import { API_URL } from '../config/env';
import { http, createAbortController } from './http';
import { PAGINATION, UPLOAD, TIMEOUTS } from '../constants/limits';
import logger from '../lib/logger';

// ── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetch paginated public biodatas.
 *
 * Backend supports:
 *   GET /biodata/public?page=1&limit=12&search=rahul&religion=Hindu&caste=Brahmin&location=Patna&ageRange=21-25
 *
 * @param {{
 *   page?: number,
 *   limit?: number,
 *   search?: string,
 *   name?: string,
 *   city?: string,
 *   religion?: string,
 *   caste?: string,
 *   location?: string,
 *   ageRange?: string,
 *   minAge?: number,
 *   maxAge?: number,
 *   filter?: string,
 *   signal?: AbortSignal
 * }} params
 * @returns {Promise<{ biodatas: object[], pagination: { currentPage: number, totalPages: number, totalProfiles: number, limit: number }, data: object[], total: number, page: number, totalPages: number, hasMore: boolean }>}
 */
export const getPublicBiodatas = async ({
  page     = 1,
  limit    = PAGINATION.EXPLORE_PAGE_SIZE,
  search   = '',
  name     = '',
  city     = '',
  religion = '',
  caste    = '',
  location = '',
  age      = '',
  ageRange = '',
  minAge,
  maxAge,
  filter   = 'All',
  signal,
} = {}) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set('search', search.trim());
  if (name) params.set('name', name.trim());
  if (city) params.set('city', city.trim());
  if (religion && religion !== 'All') params.set('religion', religion.trim());
  if (caste && caste !== 'All') params.set('caste', caste.trim());
  if (location && location !== 'All') params.set('location', location.trim());
  const effectiveAge = age || ageRange;
  if (effectiveAge && effectiveAge !== 'All') {
    params.set('age', effectiveAge.trim());
    params.set('ageRange', effectiveAge.trim());
  }
  if (minAge) params.set('minAge', String(minAge));
  if (maxAge) params.set('maxAge', String(maxAge));
  if (filter && filter !== 'All') params.set('filter', filter.trim());

  const result = await http(`/biodata/public?${params}`, { signal });

  // ── Normalise response ──────────────────────────────────────────────────
  if (Array.isArray(result)) {
    return {
      biodatas:   result,
      data:       result,
      pagination: {
        currentPage:   1,
        totalPages:    1,
        totalProfiles: result.length,
        limit,
      },
      total:      result.length,
      page:       1,
      totalPages: 1,
      hasMore:    false,
    };
  }

  const biodatas = result.biodatas ?? result.data ?? [];
  const pagination = result.pagination ?? {
    currentPage:   result.page ?? page,
    totalPages:    result.totalPages ?? 1,
    totalProfiles: result.total ?? biodatas.length,
    limit,
  };

  return {
    biodatas,
    pagination,
    data:       biodatas,
    total:      pagination.totalProfiles,
    page:       pagination.currentPage,
    totalPages: pagination.totalPages,
    hasMore:    pagination.currentPage < pagination.totalPages,
  };
};

/**
 * Fetch a single public biodata by ID.
 * @param {string} id
 * @param {AbortSignal} [signal]
 */
export const getBiodataById = (id, signal) =>
  http(`/biodata/${id}`, { signal });

/**
 * Fetch a public preview of a biodata by ID (contact details omitted).
 * @param {string} id
 * @param {AbortSignal} [signal]
 */
export const getBiodataPreview = (id, signal) =>
  http(`/biodata/${id}/preview`, { signal });

/**
 * Get current user's access request status for a specific biodata.
 * @param {string} biodataId
 */
export const getBiodataRequestStatus = (biodataId) =>
  http(`/biodata-requests/status/${biodataId}`);

/**
 * Send an access request for a specific biodata.
 * @param {string} biodataId
 * @param {string} [message]
 */
export const sendBiodataRequest = (biodataId, message = '') =>
  http('/biodata-requests', {
    method: 'POST',
    body: JSON.stringify({ biodataId, message }),
  });

/**
 * Fetch all incoming biodata access requests for the authenticated owner.
 */
export const getReceivedBiodataRequests = () =>
  http('/biodata-requests/received');

/**
 * Fetch all access requests sent by the authenticated requester.
 */
export const getSentBiodataRequests = () =>
  http('/biodata-requests/sent');

/**
 * Accept or reject a biodata access request.
 * @param {string} requestId
 * @param {'ACCEPTED' | 'REJECTED'} status
 */
export const updateBiodataRequestStatus = (requestId, status) =>
  http(`/biodata-requests/${requestId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

/**
 * Fetch a private biodata (owner only).
 * @param {string} userId
 * @param {AbortSignal} [signal]
 */
export const getPrivateBiodata = (userId, signal) =>
  http(`/biodata/user/${userId}/private`, { signal });

/**
 * Fetch all biodatas belonging to the currently authenticated user.
 * @param {AbortSignal} [signal]
 */
export const getMyBiodatas = (signal) =>
  http('/biodata/user/me', { signal });

// ── Write ────────────────────────────────────────────────────────────────────

/**
 * Create a new biodata.
 * @param {object} data — biodata payload
 * @returns {Promise<{ _id: string }>}
 */
export const createBiodata = (data) =>
  http('/biodata', {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * Partially update a biodata.
 * @param {string} id
 * @param {Partial<object>} data — fields to update
 */
export const updateBiodata = (id, data) =>
  http(`/biodata/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

/**
 * Delete a biodata by ID.
 * @param {string} id
 */
export const deleteBiodata = (id) =>
  http(`/biodata/${id}`, { method: 'DELETE' });

// ── Upload ───────────────────────────────────────────────────────────────────

/**
 * Upload a photo to Cloudinary via the backend.
 * Uses XHR for upload progress reporting.
 *
 * @param {File} file — validated by UPLOAD limits before calling
 * @param {(pct: number) => void} [onProgress]
 * @returns {Promise<{ photoURL: string, photoPublicId: string }>}
 */
export const uploadPhoto = (file, onProgress) => {
  // ── Client-side validation ──────────────────────────────────────────────
  if (file.size > UPLOAD.MAX_PHOTO_BYTES) {
    return Promise.reject(
      new Error(`Photo must be under ${UPLOAD.MAX_PHOTO_BYTES / 1024 / 1024} MB`)
    );
  }
  if (!UPLOAD.ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    return Promise.reject(
      new Error('Only JPEG, PNG and WebP images are supported')
    );
  }

  const formData = new FormData();
  formData.append('photo', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/biodata/upload-photo`);
    xhr.withCredentials = true;
    xhr.timeout = TIMEOUTS.UPLOAD_MS;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          const err = new Error(data.message || 'Upload failed');
          err.status = xhr.status;
          logger.apiError('/biodata/upload-photo', err);
          reject(err);
        }
      } catch {
        reject(new Error('Upload failed — invalid server response'));
      }
    };

    xhr.ontimeout = () => reject(new Error('Upload timed out. Please try again.'));
    xhr.onerror   = () => reject(new Error('Network error during upload'));

    xhr.send(formData);
  });
};
