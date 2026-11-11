/**
 * index.js — API barrel export.
 *
 * Application code should import from here, not from domain files directly:
 *   import { auth, biodata, http } from '../api';
 *
 * This gives us one place to swap implementations without touching every consumer.
 */

// ── Domain modules ───────────────────────────────────────────────────────────
export * as auth    from './auth';
export * as biodata from './biodata';

// ── Transport layer (for advanced use — direct http calls) ───────────────────
export { http, createAbortController, AUTH_EXPIRED_EVENT } from './http';

// ── Legacy named exports ─────────────────────────────────────────────────────
// Maintained for backward-compat with existing imports in components/hooks.
// These will be removed in a future cleanup once all callers are migrated.
export {
  // Auth
  signUp      as apiSignUp,
  login       as apiLogin,
  googleLogin as apiGoogleLogin,
  logout      as apiLogout,
  getMe       as apiGetMe,
  forgotPassword    as apiForgotPassword,
  resetPassword     as apiResetPassword,
  verifyEmail       as apiVerifyEmail,
  resendVerification as apiResendVerification,
} from './auth';

export {
  // Biodata
  getPublicBiodatas  as apiGetPublicBiodatas,
  getBiodataById     as apiGetBiodataById,
  getBiodataPreview  as apiGetBiodataPreview,
  getBiodataRequestStatus as apiGetBiodataRequestStatus,
  sendBiodataRequest as apiSendBiodataRequest,
  getReceivedBiodataRequests as apiGetReceivedBiodataRequests,
  getSentBiodataRequests as apiGetSentBiodataRequests,
  updateBiodataRequestStatus as apiUpdateBiodataRequestStatus,
  getPrivateBiodata  as apiGetPrivateBiodata,
  getMyBiodatas      as apiGetMyBiodatas,
  createBiodata      as apiCreateBiodata,
  updateBiodata      as apiUpdateBiodata,
  deleteBiodata      as apiDeleteBiodata,
  uploadPhoto        as apiUploadPhoto,
} from './biodata';
