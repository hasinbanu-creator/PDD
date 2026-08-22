import { Platform } from "react-native";
import Config from "react-native-config";

const DEFAULT_API_URL = "http://192.168.43.223:8000/api/v1";

const getConfiguredApiUrl = () => {
  return (
    process.env.EXPO_PUBLIC_API_URL ||
    Config.EXPO_PUBLIC_API_URL ||
    Config.API_URL ||
    DEFAULT_API_URL
  );
};

const normalizeApiUrl = (url) => {
  if (!url) return DEFAULT_API_URL;

  return url.endsWith("/") ? url.slice(0, -1) : url;
};

export const API_URL = normalizeApiUrl(getConfiguredApiUrl());

console.log("=================================");
console.log("CiviFix API CONFIGURATION");
console.log("Platform:", Platform.OS);
console.log("API URL:", API_URL);
console.log("=================================");

export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_LOGIN: "/auth/verify-login-otp",
  VERIFY_REGISTER: "/auth/verify-otp",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh-token",

  // User endpoints
  GET_PROFILE: "/auth/me",
  UPDATE_PROFILE: "/auth/me",


  // Uploads
  UPLOAD_IMAGES: "/upload",

  // Complaints endpoints
  GET_COMPLAINTS: "/complaints/my/dashboard",
  CREATE_COMPLAINT: "/complaints",
  VERIFY_IMAGE: "/complaints/verify-image",
  GET_COMPLAINT: (id) => `/complaints/${id}`,
  SAVE_COMPLAINT_DRAFT: "/complaints/draft",
  SUBMIT_FEEDBACK: (id) => `/complaints/${id}/feedback`,


  // Ward/admin endpoints
  GET_WARDS_BY_DISTRICT: (districtId) => `/wards/district/${districtId}`,
  SEARCH_WARDS: (districtId) => `/wards/search/${districtId}`,
  GET_DISTRICTS: "/admin/districts",

  // Ward endpoints
  GET_WARDS: "/wards/district",
  GET_WARD_DETAIL: (wardId) => `/wards/${wardId}`,
  GET_INSPECTOR_WARD: "/wards/inspector/assigned",
  ASSIGN_INSPECTOR_TO_WARD: (wardId) => `/wards/${wardId}/assign-inspector`,

  // Dashboard role-specific
  GET_SUPER_ADMIN_DASHBOARD: "/admin/stats",
  GET_INSPECTOR_DASHBOARD: "/inspector/dashboard",
  GET_DISTRICT_ADMIN_DASHBOARD: "/dashboard/district-admin/dashboard",
  GET_WORKER_DASHBOARD: "/dashboard/worker/dashboard",

  // Admin Specific
  ADMIN_COMPLAINTS: "/admin/complaints",
  ADMIN_ASSIGN_COMPLAINT: (id) => `/admin/complaints/${id}/assign`,
  ADMIN_EXPORT_COMPLAINTS: "/admin/complaints/export",

  ADMIN_USERS: "/admin/users",
  ADMIN_EDIT_USER: (id) => `/admin/users/${id}`,
  ADMIN_SUSPEND_USER: (id) => `/admin/users/${id}/suspend`,
  ADMIN_ACTIVATE_USER: (id) => `/admin/users/${id}/activate`,
  ADMIN_ROLE_USER: (id) => `/admin/users/${id}/role`,

  ADMIN_SLA: "/admin/settings/sla",
  ADMIN_APP_SETTINGS: "/admin/settings/app",

  // Inspector specific endpoints
  INSPECTOR_COMPLAINTS: "/inspector/complaints",
  UPDATE_COMPLAINT_STATUS: (id) => `/inspector/complaints/${id}/status`,
  ADD_INSPECTOR_NOTE: (id) => `/inspector/complaints/${id}/notes`,
  UPDATE_CHECKLIST: (id) => `/inspector/complaints/${id}/checklist`,
  RESOLVE_COMPLAINT: (id) => `/inspector/complaints/${id}/resolve`,
};

export default ENDPOINTS;
