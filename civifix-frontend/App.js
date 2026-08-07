import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, LogBox } from "react-native";

LogBox.ignoreAllLogs(true);
import { AuthProvider } from "./src/context/AuthContext";
import { NetworkProvider } from "./src/context/NetworkContext";
import OfflineBanner from "./src/components/OfflineBanner";
import RootNavigator from "./src/navigation/RootNavigator";
import { getAndroidTopPadding } from "./src/utils/layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { API_URL } from "./src/constants/endpoints";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  useEffect(() => {
    const runHealthCheck = async () => {
      try {
        const healthUrl = `${API_URL.replace(/\/api\/v1\/?$/, '')}/health`;
        console.log(`[HealthCheck] Starting automatic API health check to: ${healthUrl}`);
        const response = await fetch(healthUrl);
        const json = await response.json();
        console.log("[HealthCheck] Success! API is reachable & healthy:", JSON.stringify(json));
      } catch (err) {
        console.error("[HealthCheck] Automatic API Health check failed on startup:", err.message || err);
      }
    };
    runHealthCheck();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1, paddingTop: getAndroidTopPadding() }}>
      <SafeAreaProvider>
        <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
        <NetworkProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <OfflineBanner />
              <RootNavigator />
            </AuthProvider>
          </QueryClientProvider>
        </NetworkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}