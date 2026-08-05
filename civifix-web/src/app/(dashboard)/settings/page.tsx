"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { User, Phone, Save, Loader2, CheckCircle2, MapPin, Building, ShieldCheck } from "lucide-react";
import authService from "@/services/auth";
import { API_URL } from "@/constants/endpoints";

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    address: "",
    district: "",
    ward: "",
  });
  
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Fetch districts on mount
  useEffect(() => {
    fetch(`${API_URL}/admin/districts?active_only=false`)
      .then(res => res.json())
      .then(json => {
        setDistricts(json.data || []);
        setLoadingDistricts(false);
      })
      .catch(err => {
        console.error("Failed to fetch districts", err);
        setLoadingDistricts(false);
      });
  }, []);

  // 2. Fetch wards when selected district changes
  useEffect(() => {
    if (!formData.district) {
      setWards([]);
      return;
    }
    setLoadingWards(true);
    authService.getWardsByDistrict(formData.district)
      .then(data => {
        const rawWards = Array.isArray(data) ? data : data?.data || [];
        const sortedWards = [...rawWards].sort((a: any, b: any) => {
          const numA = parseInt(a.ward_number, 10);
          const numB = parseInt(b.ward_number, 10);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          const labelA = a.ward_name || "";
          const labelB = b.ward_name || "";
          return labelA.localeCompare(labelB, undefined, { numeric: true, sensitivity: 'base' });
        });
        setWards(sortedWards);
        setLoadingWards(false);
      })
      .catch(err => {
        console.error("Failed to fetch wards", err);
        setWards([]);
        setLoadingWards(false);
      });
  }, [formData.district]);

  // 3. Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.full_name || "",
        mobile_number: user.mobile_number || "",
        address: user.address || "",
        district: user.district_id || (user.district && /^[0-9a-fA-F]{24}$/.test(user.district) ? user.district : ""),
        ward: user.ward_id || (user.ward && /^[0-9a-fA-F]{24}$/.test(user.ward) ? user.ward : ""),
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const payload = {
        name: formData.name.trim(),
        mobile_number: formData.mobile_number.trim(),
        address: formData.address.trim(),
        district: formData.district,
        ward: formData.ward,
      };
      
      await authService.updateProfile(payload);
      const profile = await authService.getProfile();
      setUser(profile);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(profile));
      }
      setSuccessMsg("Profile updated successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "?";
  };

  return (
    <div className="flex-1 bg-background min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-primary pt-12 pb-16 px-6 md:px-12 md:rounded-b-[60px] rounded-b-[40px] shadow-lg flex items-center justify-between sticky top-0 z-20 md:static">
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-black text-white tracking-tight">Settings</h1>
             <p className="text-white/80 font-semibold mt-2">Manage your personal information</p>
           </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full -mt-8 relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-[2rem] p-6 sm:p-8 shadow-sm border border-border">
          
          {/* Avatar Container */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 border-[3px] border-primary/20 flex items-center justify-center shrink-0 shadow-md">
              <span className="text-3xl font-black text-primary">{getInitials(formData.name)}</span>
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-3">Profile Photo</p>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-2xl flex items-center gap-3 text-success">
              <CheckCircle2 className="w-5 h-5" />
              <p className="font-semibold text-sm">{successMsg}</p>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-2xl flex items-center gap-3 text-destructive">
              <p className="font-semibold text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:font-medium placeholder:text-muted-foreground"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  type="tel"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:font-medium placeholder:text-muted-foreground"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Address</label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                </div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:font-medium placeholder:text-muted-foreground resize-none"
                  placeholder="Enter your street address"
                  required
                />
              </div>
            </div>

            {/* District & Ward Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* District */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">District</label>
                <div className="relative">
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-4 appearance-none bg-background border border-border rounded-2xl text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                    disabled={loadingDistricts}
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ward */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Ward</label>
                <div className="relative">
                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    className="w-full px-4 py-4 appearance-none bg-background border border-border rounded-2xl text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                    disabled={loadingWards || !formData.district}
                  >
                    <option value="">Select Ward</option>
                    {wards.map((w) => (
                      <option key={w._id || w.id} value={w._id || w.id}>
                        {w.ward_number ? `${String(w.ward_number).padStart(2, "0")} - ` : ""}{w.ward_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-6 rounded-2xl font-bold transition-all disabled:opacity-50 hover:shadow-md hover:shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
