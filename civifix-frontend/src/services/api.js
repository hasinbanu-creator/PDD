import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, ENDPOINTS } from "../constants/endpoints";
import NetInfo from "@react-native-community/netinfo";

const normalizedBaseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;

const api = axios.create({
  baseURL: normalizedBaseUrl,
  timeout: 180000,
});

if (process.env.EXPO_PUBLIC_ENABLE_DEBUG === "true") {
  console.log("[API CONFIG] API_URL=", API_URL);
  console.log("[API CONFIG] axios baseURL=", normalizedBaseUrl);
}

export const unwrapResponse = (response) => response?.data?.data ?? response?.data;

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;
  if (data?.detail && Array.isArray(data.detail)) {
    return data.detail.map(err => `${err.loc?.join(".")}: ${err.msg}`).join("\n");
  }
  if (data?.message && Array.isArray(data.message)) {
    return data.message.join("\n");
  }
  return data?.message || data?.detail || data?.errors || error?.message || fallback;
};

api.interceptors.request.use(
  async (config) => {
    // Sanitize config.url to avoid double slashes when appended to baseURL
    if (config.url && config.url.startsWith("/")) {
      if (config.baseURL && config.baseURL.endsWith("/")) {
        config.url = config.url.substring(1);
      }
    }

    const publicPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/verify-login-otp",
      "/auth/verify-otp",
      "/health"
    ];
    const isPublic = publicPaths.some(path => config.url && config.url.includes(path));

    if (!isPublic) {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Extensive request debugging
    const fullUrl = `${config.baseURL || ""}${config.baseURL?.endsWith("/") ? "" : "/"}${config.url || ""}`.replace(/([^:]\/)\/+/g, "$1");
    console.log(`[API REQUEST] => Method: ${config.method?.toUpperCase()} | URL: ${fullUrl}`);
    
    let bodyLog = "";
    if (config.data instanceof FormData) {
      bodyLog = `[FormData] fields: ${JSON.stringify(config.data._parts?.map(p => p[0]))}`;
    } else {
      try {
        bodyLog = JSON.stringify(config.data);
      } catch {
        bodyLog = "[Unserializable Body]";
      }
    }
    console.log(`[API REQUEST DETAILS] Headers: ${JSON.stringify(config.headers)} | Body: ${bodyLog}`);

    return config;
  },
  (error) => {
    console.error("[API REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    const fullUrl = `${response.config.baseURL || ""}${response.config.url || ""}`;
    console.log(`[API RESPONSE] <= Success | Status: ${response.status} | URL: ${fullUrl}`);
    let dataLog = "";
    try {
      dataLog = JSON.stringify(response.data);
    } catch {
      dataLog = "[Unserializable Data]";
    }
    console.log(`[API RESPONSE DETAILS] Data: ${dataLog}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log reachability
    let netReachable = "Unknown";
    try {
      const netState = await NetInfo.fetch();
      netReachable = `Reachable: ${netState.isInternetReachable}, Type: ${netState.type}`;
    } catch (netErr) {
      console.warn("Failed to check NetInfo reachability:", netErr.message);
    }

    // Extensive diagnostic logs for any failure
    const { config, response, code, message } = error;
    console.error("=============== AXIOS ERROR DIAGNOSTICS ===============");
    console.error(`Error Message: ${message}`);
    console.error(`Error Code: ${code}`);
    console.error(`Network Reachability: ${netReachable}`);
    
    if (config) {
      const fullUrl = `${config.baseURL || ""}${config.baseURL?.endsWith("/") ? "" : "/"}${config.url || ""}`.replace(/([^:]\/)\/+/g, "$1");
      console.error(`Request URL: ${fullUrl}`);
      console.error(`HTTP Method: ${config.method?.toUpperCase()}`);
      console.error(`Request Headers: ${JSON.stringify(config.headers)}`);
      console.error(`Request Body: ${JSON.stringify(config.data)}`);
      console.error(`Timeout Configured: ${config.timeout}ms`);
    }
    
    if (response) {
      console.error(`Response Status: ${response.status}`);
      console.error(`Response Body: ${JSON.stringify(response.data)}`);
      console.error(`Response Headers: ${JSON.stringify(response.headers)}`);
    } else {
      console.error("No Response received (possible Network Error, DNS resolution failure, SSL error, or request Timeout)");
      if (error.isAxiosError && !response) {
        console.error("Axios confirmed request was sent but no response was received.");
      }
    }
    console.error("======================================================");

    // Retry failed GET requests once before showing an error
    if (config && config.method?.toLowerCase() === "get" && !config._getRetry) {
      config._getRetry = true;
      console.log(`[API RETRY] Retrying failed GET request: ${config.url}`);
      return api(config);
    }

    // Dynamic verification on 401 or 403
    if (response?.status === 401 || response?.status === 403) {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const hasAuthHeader = !!config?.headers?.Authorization;
        
        console.warn("--- AUTHENTICATION DIAGNOSTICS ---");
        console.warn(`HTTP Status: ${response.status}`);
        console.warn(`Access Token exists locally: ${!!token}`);
        console.warn(`Refresh Token exists locally: ${!!refreshToken}`);
        console.warn(`Authorization Header attached to request: ${hasAuthHeader}`);
        
        if (token) {
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
              let output = '';
              let str = String(parts[1].replace(/-/g, '+').replace(/_/g, '/')).replace(/=+$/, '');
              for (
                let bc = 0, bs, rcx, idx = 0;
                rcx = str.charAt(idx++);
                ~rcx && (bs = bc % 4 ? bs * 64 + rcx : rcx, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
              ) {
                rcx = chars.indexOf(rcx);
              }
              const payload = JSON.parse(output);
              const now = Math.floor(Date.now() / 1000);
              const isExpired = payload.exp && payload.exp < now;
              console.warn(`Token Expiry Time (UTC): ${payload.exp ? new Date(payload.exp * 1000).toISOString() : "N/A"}`);
              console.warn(`Token expired: ${isExpired}`);
            }
          } catch (jwtErr) {
            console.warn("Could not parse JWT token in diagnostics:", jwtErr.message);
          }
        }
        console.warn("----------------------------------");
      } catch (diagnosticsErr) {
        console.warn("Diagnostics failed:", diagnosticsErr);
      }
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        const cleanedRefreshUrl = `${API_URL}${ENDPOINTS.REFRESH_TOKEN}`.replace(/([^:]\/)\/+/g, "$1");
        const refreshResponse = await axios.post(cleanedRefreshUrl, {
          refresh_token: refreshToken,
        });
        const tokens = unwrapResponse(refreshResponse);
        const { access_token } = tokens || {};
        if (!access_token) {
          throw new Error("Refresh token response did not include an access token");
        }
        await AsyncStorage.setItem("authToken", access_token);
        api.defaults.headers.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("refreshToken");
        import('react-native').then(({ DeviceEventEmitter }) => {
          DeviceEventEmitter.emit('SESSION_EXPIRED');
        });
        // Return original auth error/expired session error rather than mask as network error
        const authError = new Error("Authentication failed (session expired)");
        authError.response = error.response;
        authError.status = 401;
        return Promise.reject(authError);
      }
    }
    
    // Also handle 403 or 503 globally if needed
    if (error.response?.status === 403 || error.response?.status === 503) {
      import('react-native').then(({ DeviceEventEmitter }) => {
        DeviceEventEmitter.emit('GLOBAL_ERROR', error.response.status);
      });
    }

    return Promise.reject(error);
  }
);

export default api;
