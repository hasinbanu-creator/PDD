import { Platform } from "react-native";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";

const DEFAULT_API_URL = "https://cv.onenism.org/api/v1";

const isLocalhostLike = (url) => {
  if (!url) return true;

  try {
    const { hostname } = new URL(url);
    return ["localhost", "127.0.0.1", "0.0.0.0", "10.0.2.2", "::1"].includes(hostname) || hostname.startsWith("192.168.");
  } catch {
    return false;
  }
};

const getMetroHost = () => {
  try {
    const { NativeModules } = require("react-native");
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const address = scriptURL.split("/")[2];
      const host = address.split(":")[0];
      if (host && host !== "localhost" && host !== "127.0.0.1") {
        return host;
      }
    }
  } catch (e) {
    console.warn("Failed to get Metro host IP:", e);
  }
  return null;
};

const getLanIp = () => getMetroHost();

const getConfiguredApiUrl = () => process.env.EXPO_PUBLIC_API_URL || Config.EXPO_PUBLIC_API_URL || Config.API_URL || DEFAULT_API_URL;

const normalizeApiUrl = (url) => {
  if (!url) return url;
  return url.endsWith("/") ? url : `${url}/`;
};

const resolveApiUrl = () => {
  const configuredUrl = normalizeApiUrl(getConfiguredApiUrl());

  if (Platform.OS === "android" && DeviceInfo.isEmulatorSync()) {
    return configuredUrl.replace(/localhost|127\.0\.0\.1|192\.168\.\d+\.\d+/, "10.0.2.2");
  }

  const isLocalhost = isLocalhostLike(configuredUrl);

  if (!isLocalhost || Platform.OS === "web") {
    return configuredUrl;
  }

  // If we are on a physical device, we should try to use the metro host (LAN IP)
  const lanHost = getLanIp();
  if (lanHost) {
    return configuredUrl.replace(/localhost|127\.0\.0\.1|0\.0\.0\.0/, lanHost);
  }

  return configuredUrl;
};

export const API_URL = resolveApiUrl();

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
