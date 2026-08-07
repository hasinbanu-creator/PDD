"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import authService, { UserSession, UserProfile } from "@/services/auth";
import { getErrorMessage } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
  user: UserProfile | null;
  error: string | null;
  districtsList: any[];
  signIn: (email: string) => Promise<any>;
  signUp: (userData: any) => Promise<any>;
  verifyLogin: (email: string, otp: string) => Promise<UserSession>;
  verifyRegister: (email: string, otp: string) => Promise<UserSession>;
  signOut: () => Promise<void>;
  clearError: () => void;
  setError: (msg: string | null) => void;
  setUser: (user: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSignout, setIsSignout] = useState<boolean>(false);
  const [error, setErrorState] = useState<string | null>(null);
  const [districtsList, setDistrictsList] = useState<any[]>([]);

  useEffect(() => {
    authService.getDistricts()
      .then(list => setDistrictsList(list))
      .catch(err => console.warn("Failed to prefetch districts:", err));
  }, []);

  useEffect(() => {
    if (user && districtsList.length > 0) {
      const distVal = user.district;
      if (distVal && typeof distVal === "string" && distVal.length === 24) {
        const match = districtsList.find(d => (d._id || d.id) === distVal);
        if (match && (!user.district_name || /^[0-9a-fA-F]{24}$/.test(user.district_name))) {
          const updatedUser = {
            ...user,
            district_name: match.name,
            districtName: match.name
          };
          setUser(updatedUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        }
      }
    }
  }, [districtsList, user]);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("accessToken");
          const savedUser = localStorage.getItem("user");
          if (token) {
            setUserToken(token);
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            } else {
              try {
                const profile = await authService.getProfile();
                setUser(profile);
                localStorage.setItem("user", JSON.stringify(profile));
              } catch (err) {
                console.warn("Restoring profile failed, clearing tokens", err);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                setUserToken(null);
              }
            }
          }
        }
      } catch (e) {
        console.error("Auth restoration error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapAsync();
  }, []);

  const signIn = useCallback(async (email: string) => {
    try {
      setErrorState(null);
      const response = await authService.login(email);
      return response;
    } catch (err) {
      const errMsg = getErrorMessage(err);
      setErrorState(errMsg);
      throw err;
    }
  }, []);

  const signUp = useCallback(async (userData: any) => {
    try {
      setErrorState(null);
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      const errMsg = getErrorMessage(err);
      setErrorState(errMsg);
      throw err;
    }
  }, []);

  const verifyLogin = useCallback(async (email: string, otp: string) => {
    try {
      setErrorState(null);
      const session = await authService.verifyLogin(email, otp);
      setUserToken(session.access_token);
      
      let userProfile = null;
      try {
        userProfile = await authService.getProfile();
      } catch (profileErr) {
        console.warn("Failed to fetch clean profile, using session user", profileErr);
        userProfile = session.user || {
          id: session.user_id,
          email: email,
          name: "User",
          role: session.role || "CITIZEN",
          district: session.district
        };
      }
      
      setUser(userProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userProfile));
      }
      setIsSignout(false);
      return session;
    } catch (err) {
      const errMsg = getErrorMessage(err);
      setErrorState(errMsg);
      throw err;
    }
  }, []);

  const verifyRegister = useCallback(async (email: string, otp: string) => {
    try {
      setErrorState(null);
      const session = await authService.verifyRegister(email, otp);
      setUserToken(session.access_token);
      
      let userProfile = null;
      try {
        userProfile = await authService.getProfile();
      } catch (profileErr) {
        console.warn("Failed to fetch clean profile, using session user", profileErr);
        userProfile = session.user || {
          id: session.user_id,
          email: email,
          name: "User",
          role: session.role || "CITIZEN",
          district: session.district
        };
      }
      
      setUser(userProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userProfile));
      }
      setIsSignout(false);
      return session;
    } catch (err) {
      const errMsg = getErrorMessage(err);
      setErrorState(errMsg);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    
    queryClient.clear();
    
    setUser(null);
    setUserToken(null);
    setIsSignout(true);
  }, [queryClient]);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const setError = useCallback((msg: string | null) => {
    setErrorState(msg);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        isLoading,
        isSignout,
        error,
        districtsList,
        signIn,
        signUp,
        verifyLogin,
        verifyRegister,
        signOut,
        clearError,
        setError,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
