import api, { unwrapResponse, nativeFetchFormData } from "./api";
import { API_URL, ENDPOINTS } from "../constants/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const storeSession = async (session) => {
  if (!session?.access_token) return;
  await AsyncStorage.setItem("authToken", session.access_token);
  if (session.refresh_token) {
    await AsyncStorage.setItem("refreshToken", session.refresh_token);
  }
};

export const authService = {
  register: async (userData) => {
    const response = await api.post(ENDPOINTS.REGISTER, userData);
    return unwrapResponse(response);
  },

  login: async (email) => {
    const response = await api.post(ENDPOINTS.LOGIN, { email });
    return unwrapResponse(response);
  },

  verifyLogin: async (email, otp) => {
    const response = await api.post(ENDPOINTS.VERIFY_LOGIN, {
      email,
      otp,
    });
    const session = unwrapResponse(response);
    await storeSession(session);
    return session;
  },

  verifyRegister: async (email, otp) => {
    const response = await api.post(ENDPOINTS.VERIFY_REGISTER, {
      email,
      otp,
    });
    const session = unwrapResponse(response);
    await storeSession(session);
    return session;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return unwrapResponse(response);
  },

  logout: async () => {
    try {
      await api.post(ENDPOINTS.LOGOUT);
    } catch (error) {
      console.warn("Logout API failed, clearing local storage");
    }
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("user");
  },

  getProfile: async () => {
    const response = await api.get(ENDPOINTS.GET_PROFILE);
    return unwrapResponse(response);
  },

  updateProfile: async (userData) => {
    const response = await api.put(ENDPOINTS.UPDATE_PROFILE, userData);
    return unwrapResponse(response);
  },

  getComplaints: async ({ page = 1, limit = 10, status } = {}) => {
    const response = await api.get(ENDPOINTS.GET_COMPLAINTS, {
      params: { page, limit, status },
    });
    return unwrapResponse(response);
  },

  getComplaint: async (id) => {
    const response = await api.get(ENDPOINTS.GET_COMPLAINT(id));
    return unwrapResponse(response);
  },

  uploadImages: async (formData) => {
    const response = await api.post(ENDPOINTS.UPLOAD_IMAGES, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return unwrapResponse(response);
  },

  createComplaint: async (complaintData) => {
    if (complaintData instanceof FormData) {
      const response = await nativeFetchFormData(ENDPOINTS.CREATE_COMPLAINT, "POST", complaintData);
      return unwrapResponse(response);
    }
    const response = await api.post(ENDPOINTS.CREATE_COMPLAINT, complaintData, {
      timeout: 180000,
      headers: {
        Accept: "application/json",
      },
    });
    return unwrapResponse(response);
  },

  getToken: async () => {
    return await AsyncStorage.getItem("authToken");
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem("authToken");
    return !!token;
  },

  // ─── /auth/me ───────────────────────────────────────────────────────────────
  getMe: async () => {
    const res = await api.get(ENDPOINTS.GET_PROFILE);
    return unwrapResponse(res);
  },

  // ─── SUPER ADMIN ─────────────────────────────────────────────────────────────
  getAdminStats: async () => {
    const res = await api.get("/admin/stats");
    return unwrapResponse(res);
  },

  // ─── DISTRICT ADMIN ──────────────────────────────────────────────────────────
  getInspectors: async () => {
    const res = await api.get("/admin/inspectors");
    return unwrapResponse(res);
  },

  getWorkers: async () => {
    const res = await api.get("/admin/workers");
    return unwrapResponse(res);
  },

  getDistrictUsers: async () => {
    const res = await api.get("/admin/users");
    return unwrapResponse(res);
  },

  // ─── INSPECTOR ───────────────────────────────────────────────────────────────
  getWardComplaints: async ({ page = 1, limit = 20, status, district_id, ward_id } = {}) => {
    const params = { page, limit };
    if (status) params.status = status;
    if (district_id) params.district_id = district_id;
    if (ward_id) params.ward_id = ward_id;
    const res = await api.get("/inspector/complaints", { params });
    return unwrapResponse(res);
  },

  getWardWorkers: async () => {
    const res = await api.get("/inspector/workers");
    return unwrapResponse(res);
  },

  // ─── WORKER ──────────────────────────────────────────────────────────────────
  getAssignedComplaints: async ({ page = 1, limit = 20, status } = {}) => {
    const params = { page, limit };
    if (status) params.status = status;
    const res = await api.get("/worker/complaints", { params });
    return unwrapResponse(res);
  },

  getWardsByDistrict: async (districtId, { page = 1, is_active = true, limit = 60 } = {}) => {
    const res = await api.get(`/wards/district/${districtId}`, {
      params: { page, is_active, limit },
    });
    return unwrapResponse(res);
  },

  getDistricts: async () => {
    const res = await api.get("/admin/districts?active_only=false");
    return unwrapResponse(res);
  },

  getAllWards: async ({ page = 1, limit = 100, district_id } = {}) => {
    console.log("[getAllWards] Calling GET /wards, page:", page, "limit:", limit, "district_id:", district_id);
    const params = { page, limit };
    if (district_id) params.district_id = district_id;
    const res = await api.get("/wards", { params });
    const result = unwrapResponse(res);
    console.log("[getAllWards] Response:", JSON.stringify(result)?.substring(0, 200));
    return result;
  },

  getWards: async ({ page = 1, limit = 20, is_active = true } = {}) => {
    const res = await api.get("/wards/district", {
      params: { page, limit, is_active },
    });
    return unwrapResponse(res);
  },

  getWardDetail: async (wardId) => {
    const res = await api.get(`/wards/${wardId}`);
    return unwrapResponse(res);
  },

  getInspectorWard: async () => {
    const res = await api.get("/wards/inspector/assigned");
    return unwrapResponse(res);
  },

  assignInspectorToWard: async (wardId, inspectorId) => {
    const res = await api.post(`/wards/${wardId}/assign-inspector`, {
      inspector_id: inspectorId,
    });
    return unwrapResponse(res);
  },

  // ─── DASHBOARD ROLE-SPECIFIC ────────────────────────────────────────────────
  getInspectorDashboard: async () => {
    const res = await api.get("/dashboard/inspector/dashboard");
    return unwrapResponse(res);
  },
  getDistrictAdminDashboard: async () => {
    const res = await api.get("/dashboard/district-admin/dashboard");
    return unwrapResponse(res);
  },

  getWorkerDashboard: async () => {
    const res = await api.get("/dashboard/worker/dashboard");
    return unwrapResponse(res);
  },

  getInspectorDashboard: async () => {
    const response = await api.get(ENDPOINTS.GET_INSPECTOR_DASHBOARD);
    return unwrapResponse(response);
  },


  // --- Complaints Additions ---
  saveComplaintDraft: async (complaintData) => {
    const response = await api.post(ENDPOINTS.SAVE_COMPLAINT_DRAFT, complaintData);
    return unwrapResponse(response);
  },

  submitFeedback: async (id, feedbackData) => {
    const response = await api.post(`/complaints/${id}/feedback`, feedbackData);
    return unwrapResponse(response);
  },

  overrideComplaintPriority: async (id, priority) => {
    const response = await api.put(`/inspector/complaints/${id}/priority`, { priority });
    return unwrapResponse(response);
  },



  uploadImages: async (formData) => {
    const response = await api.post(ENDPOINTS.UPLOAD_IMAGES, formData, {
      timeout: 180000,
      headers: {
        Accept: "application/json",
      },
    });
    return unwrapResponse(response);
  },

  verifyImage: async (imageUri, selectedCategory) => {
    let fileUri = imageUri;
    if (Platform.OS === 'android' && fileUri) {
      if (fileUri.startsWith('file:/') && !fileUri.startsWith('file:///')) {
        if (fileUri.startsWith('file://')) {
          fileUri = fileUri.replace('file://', 'file:///');
        } else {
          fileUri = fileUri.replace('file:/', 'file:///');
        }
      } else if (!fileUri.startsWith('file://') && !fileUri.startsWith('content://')) {
        fileUri = 'file://' + fileUri;
      }
    }

    const formData = new FormData();
    formData.append("image", {
      uri: fileUri,
      name: "complaint.jpg",
      type: "image/jpeg",
    });
    formData.append("file", {
      uri: fileUri,
      name: "complaint.jpg",
      type: "image/jpeg",
    });

    if (selectedCategory) {
      formData.append("selected_category", selectedCategory);
      formData.append("complaint_type", selectedCategory);
    }

    try {
      const response = await nativeFetchFormData(ENDPOINTS.VERIFY_IMAGE, "POST", formData);
      return unwrapResponse(response);
    } catch (error) {
      console.error("=== [verifyImage DIAGNOSTICS] FAILURE ===");
      console.error("error.code:", error.code);
      console.error("error.message:", error.message);
      if (error.response) {
        console.error("error.response.status:", error.response.status);
        console.error("error.response.data:", JSON.stringify(error.response.data));
      }
      throw error;
    }
  },

  supportComplaint: async (complaintId) => {
    const response = await api.post(`/complaints/${complaintId}/support`);
    return unwrapResponse(response);
  },

  getFeedback: async (complaintId) => {
    const res = await api.get(`/complaints/${complaintId}/feedback`);
    return unwrapResponse(res);
  },

  submitFeedback: async (complaintId, payload) => {
    const res = await api.post(`/complaints/${complaintId}/feedback`, payload);
    return unwrapResponse(res);
  },

  // ─── INSPECTOR COMPLAINT ACTIONS ─────────────────────────────────────────────
  inspectorStartWork: async (complaintId) => {
    const res = await api.put(`/inspector/complaints/${complaintId}/start-work`);
    return unwrapResponse(res);
  },

  inspectorRejectComplaint: async (complaintId) => {
    const res = await api.put(`/inspector/complaints/${complaintId}/reject`);
    return unwrapResponse(res);
  },

  inspectorResolveComplaint: async (complaintId, payload) => {
    if (payload instanceof FormData) {
      const response = await nativeFetchFormData(`/inspector/complaints/${complaintId}/resolve`, "PUT", payload);
      return unwrapResponse(response);
    }
    const response = await api.put(`/inspector/complaints/${complaintId}/resolve`, payload, {
      headers: {
        Accept: "application/json",
      },
    });
    return unwrapResponse(response);
  },
};

export default authService;