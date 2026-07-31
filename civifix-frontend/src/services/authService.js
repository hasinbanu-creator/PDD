import api from "./api";
import { unwrapResponse } from "./api";
import { API_URL, ENDPOINTS } from "../constants/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    console.log("========== TRACE: createComplaint ==========");
    console.log("1. Entered authService.createComplaint()");
    const url = `${api.defaults.baseURL}${ENDPOINTS.CREATE_COMPLAINT}`;
    console.log("2. URL computed:", url);
    
    const token = await AsyncStorage.getItem("authToken");
    const maskedToken = token ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}` : "null";
    console.log("3. Authorization header: Bearer", maskedToken);
    
    console.log("4. Validating FormData...");
    if (complaintData && complaintData._parts) {
      console.log("   - FormData keys:", complaintData._parts.map(p => p[0]));
      console.log("DEBUG: FormData._parts:\n", JSON.stringify(complaintData._parts, null, 2));
    }

    try {
      console.log("5. Calling fetch()...");
      console.log("DEBUG: API request body:", complaintData);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
          // CRITICAL: Do NOT set Content-Type manually for FormData in React Native fetch!
        },
        body: complaintData
      });
      console.log("6. fetch() completed without crashing!");
      console.log("7. Response status:", response.status);
      
      const responseData = await response.json();
      console.log("DEBUG: API response:\n", JSON.stringify(responseData, null, 2));
      
      if (!response.ok) {
        console.error("8. Server returned error:", responseData);
        console.log("DEBUG: Backend error:", responseData);
        let errorMsg = responseData.message;
        if (!errorMsg && Array.isArray(responseData.detail)) {
          console.log("DEBUG: Validation errors:", responseData.detail);
          errorMsg = responseData.detail.map(err => {
            const field = err.loc ? err.loc[err.loc.length - 1] : "Field";
            return `${field}: ${err.msg}`;
          }).join(", ");
        } else if (!errorMsg && typeof responseData.detail === "string") {
          errorMsg = responseData.detail;
        }
        throw new Error(errorMsg || "Failed to create complaint");
      }
      console.log("[createComplaint] API response data:", responseData);
      return responseData.data;
    } catch (err) {
      console.log("DEBUG: Network failures:", err);
      console.error("6. fetch() or execution crashed before returning a response!");
      console.error("   -> Error:", err.message);
      console.error("   -> Stack Trace:", err.stack);
      throw err;
    }
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

  /**
   * Get ALL wards for the authenticated inspector's district.
   * Calls GET /api/v1/wards — backend reads district from JWT token.
   * Response after unwrapResponse: { data: Ward[], total, page, limit, pages }
   */
  getAllWards: async ({ page = 1, limit = 100 } = {}) => {
    console.log("[getAllWards] Calling GET /wards, page:", page, "limit:", limit);
    const res = await api.get("/wards", { params: { page, limit } });
    const result = unwrapResponse(res);
    console.log("[getAllWards] Response:", JSON.stringify(result)?.substring(0, 200));
    return result;
  },


  // ─── WARD MANAGEMENT ─────────────────────────────────────────────────────────
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

  submitFeedback: async (id, data) => {
    const response = await api.put(ENDPOINTS.SUBMIT_FEEDBACK(id), null, { params: data });
    return unwrapResponse(response);
  },



  // --- Uploads ---
  uploadImages: async (formData) => {
    const response = await api.post(ENDPOINTS.UPLOAD_IMAGES, formData, {
      timeout: 180000,
      headers: {
        Accept: "application/json",
      },
    });
    return unwrapResponse(response);
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
    console.log("========== TRACE: inspectorResolveComplaint ==========");
    console.log("1. Entered authService.inspectorResolveComplaint()");
    const url = `${api.defaults.baseURL}/inspector/complaints/${complaintId}/resolve`;
    console.log("2. URL computed:", url);
    
    const token = await AsyncStorage.getItem("authToken");
    const maskedToken = token ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}` : "null";
    console.log("3. Authorization header: Bearer", maskedToken);
    
    console.log("4. Validating FormData...");
    if (payload && payload._parts) {
      console.log("   - FormData keys:", payload._parts.map(p => p[0]));
      const images = payload._parts.filter(p => p[0] === 'images');
      images.forEach((img, i) => {
        console.log(`   - Image ${i + 1} URI:`, img[1]?.uri);
        console.log(`   - Image ${i + 1} MIME type:`, img[1]?.type);
      });
    }

    try {
      console.log("5. Calling fetch()...");
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
          // Do NOT set Content-Type manually
        },
        body: payload
      });
      console.log("6. fetch() completed without crashing!");
      console.log("7. Response status:", response.status);
      
      const responseData = await response.json();
      if (!response.ok) {
        console.error("8. Server returned error:", responseData);
        throw new Error(responseData.message || "Failed to resolve complaint");
      }
      return responseData;
    } catch (err) {
      console.error("6. fetch() or execution crashed before returning a response!");
      console.error("   -> Error:", err.message);
      console.error("   -> Stack Trace:", err.stack);
      throw err;
    }
  },
};

export default authService;