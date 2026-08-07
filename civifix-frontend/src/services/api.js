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
  if (!error) return fallback;

  // Handle timeout explicitly
  if (error.code === "ECONNABORTED" || (error.message && error.message.toLowerCase().includes("timeout"))) {
    return `Request timeout (${error.message || error.code}).`;
  }

  // Handle network connectivity errors
  if (error.message === "Network Error" || error.code === "ERR_NETWORK" || error.code === "ENOTFOUND" || error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
    return `Unable to connect to server (${error.message || error.code}).`;
  }

  const response = error.response;
  if (response) {
    if (response.status === 401) {
      const data = response.data;
      const parsedMsg = data?.message || data?.detail || data?.errors;
      if (parsedMsg && typeof parsedMsg === "string") {
        return parsedMsg;
      }
      return "Invalid credentials.";
    }
    if ([404, 500, 502, 503, 504].includes(response.status)) {
      return "Server unavailable.";
    }

    const data = response.data;
    if (data?.detail && Array.isArray(data.detail)) {
      return data.detail.map(err => `${err.loc?.join(".")}: ${err.msg}`).join("\n");
    }
    if (data?.message && Array.isArray(data.message)) {
      return data.message.join("\n");
    }
    return data?.message || data?.detail || data?.errors || error.message || fallback;
  }

  return error.message || fallback;
};

api.interceptors.request.use(
  async (config) => {
    // Ensure baseURL ends with a slash and url does not start with a slash
    if (config.baseURL && !config.baseURL.endsWith("/")) {
      config.baseURL = `${config.baseURL}/`;
    }
    if (config.url && config.url.startsWith("/")) {
      config.url = config.url.substring(1);
    }

    // For FormData uploads, dynamically remove any explicit Content-Type to let Axios set boundaries automatically
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
        if (typeof config.headers.delete === "function") {
          config.headers.delete("Content-Type");
          config.headers.delete("content-type");
        }
      }
    }

    const resolvedBaseUrl = config.baseURL || normalizedBaseUrl;
    console.log(`API Base URL: ${resolvedBaseUrl}`);
    console.log(`Login URL: ${resolvedBaseUrl}${ENDPOINTS.LOGIN.startsWith("/") ? "" : "/"}${ENDPOINTS.LOGIN}`);
    console.log(`Register URL: ${resolvedBaseUrl}${ENDPOINTS.REGISTER.startsWith("/") ? "" : "/"}${ENDPOINTS.REGISTER}`);

    const cleanUrl = config.url ? (config.url.startsWith("/") ? config.url : `/${config.url}`) : "";
    const publicPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/verify-login-otp",
      "/auth/verify-otp",
      "/health"
    ];
    const isPublic = publicPaths.some(path => cleanUrl && cleanUrl.includes(path));

    if (!isPublic) {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Extensive request debugging - wrapped in try/catch to guarantee no serialization crash aborts the request
    try {
      const fullUrl = `${config.baseURL || ""}${config.baseURL?.endsWith("/") ? "" : "/"}${config.url || ""}`.replace(/([^:]\/)\/+/g, "$1");
      console.log(`[API REQUEST] => Method: ${config.method?.toUpperCase()} | URL: ${fullUrl}`);
      
      let bodyLog = "";
      if (config.data instanceof FormData) {
        const fields = config.data._parts ? config.data._parts.map(p => {
          const fieldName = p[0];
          const val = p[1];
          if (val && typeof val === "object" && val.uri) {
            return `${fieldName}: [File URI: ${val.uri}, type: ${val.type}]`;
          }
          try {
            return `${fieldName}: ${JSON.stringify(val)}`;
          } catch {
            return `${fieldName}: [Unserializable value]`;
          }
        }) : [];
        bodyLog = `[FormData] fields: ${JSON.stringify(fields)}`;
      } else {
        try {
          bodyLog = JSON.stringify(config.data);
        } catch {
          bodyLog = "[Unserializable Body]";
        }
      }

      let headersLog = "";
      try {
        const headersCopy = {};
        if (config.headers) {
          const keys = typeof config.headers.toJSON === "function" 
            ? Object.keys(config.headers.toJSON()) 
            : Object.keys(config.headers);
            
          keys.forEach(key => {
            const val = typeof config.headers.get === "function" 
              ? config.headers.get(key) 
              : config.headers[key];
            headersCopy[key] = key.toLowerCase() === "authorization" ? "[REDACTED]" : val;
          });
        }
        headersLog = JSON.stringify(headersCopy);
      } catch (hErr) {
        headersLog = "[Unparseable Headers]";
      }

      console.log(`[API REQUEST DETAILS] Headers: ${headersLog} | Body: ${bodyLog}`);
    } catch (logError) {
      console.warn("Failed to print API request logs:", logError.message);
    }

    // Add logging for every authentication request
    const isAuth = cleanUrl && (
      cleanUrl.includes("/auth/login") ||
      cleanUrl.includes("/auth/register") ||
      cleanUrl.includes("/auth/verify-login-otp") ||
      cleanUrl.includes("/auth/verify-otp") ||
      cleanUrl.includes("/auth/logout") ||
      cleanUrl.includes("/auth/refresh-token")
    );

    if (isAuth) {
      const actionName = cleanUrl.includes("/auth/login") ? "Login" :
                         cleanUrl.includes("/auth/register") ? "Register" :
                         cleanUrl.includes("/auth/verify-login-otp") ? "Verify Login" :
                         cleanUrl.includes("/auth/verify-otp") ? "Verify Register" :
                         cleanUrl.includes("/auth/logout") ? "Logout" :
                         cleanUrl.includes("/auth/refresh-token") ? "Refresh Token" : "Auth";
      console.log(`Sending ${actionName} Request...`);
      let pathname = config.url;
      try {
        const fullUrl = `${config.baseURL || ""}${config.baseURL?.endsWith("/") ? "" : "/"}${config.url || ""}`.replace(/([^:]\/)\/+/g, "$1");
        const match = fullUrl.match(/https?:\/\/[^\/]+(\/.*)/);
        if (match) {
          pathname = match[1];
        }
      } catch (e) {}
      console.log(`${config.method?.toUpperCase()} ${pathname}`);
    }

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

    const isAuth = response.config.url && (
      response.config.url.includes("/auth/login") ||
      response.config.url.includes("/auth/register") ||
      response.config.url.includes("/auth/verify-login-otp") ||
      response.config.url.includes("/auth/verify-otp") ||
      response.config.url.includes("/auth/logout") ||
      response.config.url.includes("/auth/refresh-token")
    );

    if (isAuth) {
      console.log("Response:");
      console.log(`${response.status} OK`);
    }

    return response;
  },
  async (error) => {
    console.error("Complete Exception:", error);
    const originalRequest = error.config;

    const isAuth = error.config?.url && (
      error.config.url.includes("/auth/login") ||
      error.config.url.includes("/auth/register") ||
      error.config.url.includes("/auth/verify-login-otp") ||
      error.config.url.includes("/auth/verify-otp") ||
      error.config.url.includes("/auth/logout") ||
      error.config.url.includes("/auth/refresh-token")
    );

    if (isAuth) {
      console.log("Connection failed:");
      console.log(error.message || "Unknown error");
    }
    
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

export const nativeFetchFormData = async (url, method, formData) => {
  const token = await AsyncStorage.getItem("authToken");
  const resolvedBaseUrl = normalizedBaseUrl.endsWith("/") ? normalizedBaseUrl : `${normalizedBaseUrl}/`;
  const relativeUrl = url.startsWith("/") ? url.substring(1) : url;
  const finalUrl = resolvedBaseUrl + relativeUrl;

  const maskedToken = token ? `${token.substring(0, 6)}...${token.substring(token.length - 6)}` : "none";
  const requestHeaders = {
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
  const maskedHeaders = {
    Accept: "application/json",
    Authorization: token ? `Bearer ${maskedToken}` : "none",
  };

  console.log(`\n=================== [NATIVE FETCH FORM DATA START] ===================`);
  console.log(`Final URL: ${finalUrl}`);
  console.log(`Method: ${method}`);
  console.log(`Authorization Header (masked): Bearer ${maskedToken}`);
  console.log(`Headers:`, JSON.stringify(maskedHeaders, null, 2));

  if (formData && formData._parts) {
    console.log(`FormData Parts Count: ${formData._parts.length}`);
    formData._parts.forEach(([key, value], idx) => {
      if (typeof value === 'string') {
        console.log(`  Part [${idx}] Key: "${key}" | Type: string | Length: ${value.length} | Value: "${value.length > 100 ? value.substring(0, 100) + '...' : value}"`);
      } else if (value && typeof value === 'object') {
        const valKeys = Object.keys(value).join(", ");
        console.log(`  Part [${idx}] Key: "${key}" | Type: object (${valKeys}) | Value:`, JSON.stringify(value));
      } else {
        console.log(`  Part [${idx}] Key: "${key}" | Type: ${typeof value} | Value:`, value);
      }
    });
  } else {
    console.log(`FormData Parts: [No _parts property present or empty]`);
  }

  const fetchOptions = {
    method: method,
    headers: maskedHeaders,
    body: "[FormData object]",
  };
  console.log(`Native Fetch Options:`, JSON.stringify(fetchOptions, null, 2));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000);

  try {
    console.log(`Executing native fetch()...`);
    const response = await fetch(finalUrl, {
      method: method,
      headers: requestHeaders,
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log(`Native fetch() completed. Status: ${response.status} ${response.statusText}`);

    const jsonBody = await response.json().catch(() => ({}));
    console.log(`Response JSON Body:`, JSON.stringify(jsonBody, null, 2));
    console.log(`=================== [NATIVE FETCH FORM DATA END] ===================\n`);

    if (!response.ok) {
      const err = new Error(jsonBody.detail || jsonBody.message || "Server error");
      err.response = { status: response.status, data: jsonBody };
      throw err;
    }

    return {
      status: response.status,
      data: jsonBody,
      headers: response.headers,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`!!! [NATIVE FETCH FORM DATA EXCEPTION] !!!`);
    console.error(`Error Name: ${err.name}`);
    console.error(`Error Message: ${err.message}`);
    console.error(`Error Stack:\n${err.stack}`);
    console.error(`Full Error Object:`, JSON.stringify(err, Object.getOwnPropertyNames(err)));
    console.log(`=================== [NATIVE FETCH FORM DATA END WITH ERROR] ===================\n`);

    if (err.name === 'AbortError' || err.message.includes('timeout')) {
      const timeoutErr = new Error("timeout of 180000ms exceeded");
      timeoutErr.code = "ECONNABORTED";
      throw timeoutErr;
    }
    if (!err.response) {
      const netErr = new Error("Network Error");
      netErr.code = "ERR_NETWORK";
      throw netErr;
    }
    throw err;
  }
};

export default api;

