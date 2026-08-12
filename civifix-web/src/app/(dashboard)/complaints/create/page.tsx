"use client";

import React, { useState, useEffect, useMemo } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import authService from "@/services/auth";
import { useWards } from "@/hooks/use-wards";
import { useCreateComplaint } from "@/hooks/use-complaints";
import {
  AlertCircle,
  AlertTriangle,
  Map,
  ClipboardList,
  Wrench,
  MapPin,
  Activity,
  Trash2,
  Lightbulb,
  TreePine,
  CheckCircle2,
  ChevronDown,
  Navigation,
  FileText,
  Send,
  X
} from "lucide-react";

const COMPLAINT_TYPES = [
  { value: "garbage_waste",      label: "Garbage / Waste",      icon: Trash2,    color: "text-secondary", bg: "bg-secondary/10" },
  { value: "road_damage",        label: "Road Damage",          icon: Map,       color: "text-destructive",  bg: "bg-destructive/10" },
  { value: "pothole",            label: "Pothole",              icon: Map,       color: "text-destructive",  bg: "bg-destructive/10" },
  { value: "street_light",       label: "Street Light",         icon: Lightbulb, color: "text-primary", bg: "bg-primary/10" },
  { value: "drainage_issue",     label: "Drainage Issue",       icon: Wrench,    color: "text-secondary", bg: "bg-secondary/10" },
  { value: "road_waterlogging",   label: "Road Waterlogging",    icon: Activity,  color: "text-primary", bg: "bg-primary/10" },
  { value: "construction_block", label: "Construction Block",   icon: Wrench,    color: "text-accent", bg: "bg-accent/10" },
];

const PRIORITIES = [
  { value: "LOW",    label: "Low",    color: "text-success", bg: "bg-success/10", border: "border-success", icon: CheckCircle2 },
  { value: "MEDIUM", label: "Medium", color: "text-accent", bg: "bg-accent/10", border: "border-accent", icon: AlertCircle },
  { value: "HIGH",   label: "High",   color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive", icon: AlertCircle },
];

export default function CreateComplaintPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState({
    ward_id: "",
    complaint_type: "",
    description: "",
    latitude: "",
    longitude: "",
    address: "",
    landmark: "",
    citizen_note: "",
    priority: "MEDIUM",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [createdComplaint, setCreatedComplaint] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [districts, setDistricts] = useState<any[]>([]);

  const [verifying, setVerifying] = useState(false);
  const [aiVerifiedPayload, setAiVerifiedPayload] = useState<any>(null);
  const [verificationPopup, setVerificationPopup] = useState<string | null>(null);
  const [aiVerificationError, setAiVerificationError] = useState<string | null>(null);

  const [duplicateMatch, setDuplicateMatch] = useState<any>(null);
  const [duplicatePopup, setDuplicatePopup] = useState(false);
  const [supporting, setSupporting] = useState(false);

  const handleSupportExisting = async () => {
    if (!duplicateMatch || !duplicateMatch.existing_complaint) return;
    setSupporting(true);
    try {
      await api.post(`/complaints/${duplicateMatch.existing_complaint.id}/support`);
      alert(`You are now supporting complaint ${duplicateMatch.matched_complaint_id}!`);
      setDuplicatePopup(false);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Support existing failed", err);
      alert(err?.response?.data?.detail || "You have already supported this complaint.");
    } finally {
      setSupporting(false);
    }
  };

  const verifyImage = async (file: File) => {
    setVerifying(true);
    setVerificationPopup("loading");
    setAiVerificationError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await api.post("/complaints/verify-image", formData);
      const result = response.data?.data;
      
      setAiVerifiedPayload(result);
      
      if (!result) {
        setAiVerificationError("No verification data received from server.");
        setVerificationPopup("unavailable");
        return;
      }
      
      if (result.is_low_quality) {
        setVerificationPopup("low_quality");
        return;
      }
      
      if (!result.contains_civic_issue) {
        setVerificationPopup("fail");
        return;
      }
      
      // Check for category mismatch
      const formCat = String(form.complaint_type).replace(/_/g, "").toLowerCase();
      const aiCat = String(result.predicted_category).replace(/_/g, "").toLowerCase();
      
      if (formCat && aiCat && formCat !== aiCat && result.predicted_category !== "OTHER") {
        setVerificationPopup("mismatch");
      } else {
        setVerificationPopup("success");
      }
      
    } catch (err: any) {
      console.error("AI image verification error:", err);
      let errMsg = "Unable to verify the uploaded image at the moment. Please try again later.";
      if (err?.response?.data) {
        const data = err.response.data;
        if (data.error) {
          errMsg = data.error;
        } else if (data.detail) {
          errMsg = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
        }
      } else if (err?.message) {
        errMsg = err.message;
      }
      setAiVerificationError(errMsg);
      setVerificationPopup("unavailable");
    } finally {
      setVerifying(false);
    }
  };

  const isSubmitDisabled = () => {
    if (verifying) return true;
    if (selectedImages.length > 0) {
      if (!aiVerifiedPayload) return true;
      if (!aiVerifiedPayload.contains_civic_issue || aiVerifiedPayload.is_low_quality) return true;
    }
    return false;
  };

  useEffect(() => {
    api.get("/admin/districts?active_only=false").then((res: any) => {
      const data = Array.isArray(res) ? res : res?.data || [];
      setDistricts(data);
    }).catch(err => console.error("Failed to load districts", err));
  }, []);

  const resolvedDistrictId = useMemo(() => {
    if (user?.district_id) return user.district_id;
    const dist = user?.district;
    if (dist && /^[0-9a-fA-F]{24}$/.test(dist)) return dist;
    const found = districts.find(d => d.name === dist);
    return found?._id || found?.id || "";
  }, [user, districts]);
  const districtName = useMemo(() => {
    if (user?.district_name && !/^[0-9a-fA-F]{24}$/.test(user.district_name)) return user.district_name;
    const dist = user?.district;
    if (dist && !/^[0-9a-fA-F]{24}$/.test(dist)) return dist;
    const found = districts.find(d => (d._id || d.id) === (user?.district_id || user?.district));
    return found?.name || "";
  }, [user, districts]);

  const { data: wardsData, isLoading: wardsLoading, isError: wardsError, refetch: refetchWards } = useWards(resolvedDistrictId);
  const wards = useMemo(() => {
    const rawWards = Array.isArray(wardsData) ? wardsData : wardsData?.data || [];
    return [...rawWards].sort((a: any, b: any) => {
      const numA = parseInt(a.ward_number, 10);
      const numB = parseInt(b.ward_number, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      const labelA = a.ward_name || "";
      const labelB = b.ward_name || "";
      return labelA.localeCompare(labelB, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [wardsData]);
  const createComplaint = useCreateComplaint();

  useEffect(() => {
    if (user && user.role !== "CITIZEN") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (user && user.role !== "CITIZEN") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleGetLocation = () => {
    if (gpsLoading) return;
    setGpsLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setGpsLoading(false);
      return;
    }
    
    const onLocationSuccess = async (position: GeolocationPosition) => {
      const lat = position.coords.latitude.toFixed(6);
      const lon = position.coords.longitude.toFixed(6);
      updateField("latitude", lat);
      updateField("longitude", lon);
      if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
      
      try {
        const deduplicateAddress = (addressStr: string) => {
          if (!addressStr) return "";
          const rawParts = addressStr.split(",");
          const cleanedParts: string[] = [];
          const seenNormalized = new Set<string>();
          
          for (const part of rawParts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            if (trimmed.toLowerCase() === "india") continue;
            
            let normalized = trimmed.toLowerCase();
            normalized = normalized.replace(/\b(district|municipality|taluk|state|city|town|village|county)\b/g, "");
            normalized = normalized.replace(/\s+/g, "").trim();
            
            if (!normalized) continue;
            
            let isDuplicate = false;
            for (const seen of seenNormalized) {
              if (seen.includes(normalized) || normalized.includes(seen) ||
                  (normalized.substring(0, 5) === seen.substring(0, 5))) {
                isDuplicate = true;
                break;
              }
            }
            
            if (!isDuplicate) {
              seenNormalized.add(normalized);
              cleanedParts.push(trimmed);
            }
          }
          
          if (cleanedParts.length >= 2) {
            const last = cleanedParts[cleanedParts.length - 1];
            const prev = cleanedParts[cleanedParts.length - 2];
            const isPostalCode = /^\d{6}$/.test(last);
            if (isPostalCode) {
              cleanedParts.splice(cleanedParts.length - 2, 2, `${prev} ${last}`);
            }
          }
          
          return cleanedParts.join(", ");
        };

        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          let formatted = "";
          
          if (data.display_name) {
            formatted = deduplicateAddress(data.display_name);
          }
          
          if (!formatted || formatted.split(",").length < 3) {
            const parts = [];
            const streetPart = [];
            if (addr.house_number || addr.house || addr.flat || addr.apartment || addr.unit) {
              streetPart.push(addr.house_number || addr.house || addr.flat || addr.apartment || addr.unit);
            }
            if (addr.building || addr.amenity || addr.landmark || addr.shop || addr.office) {
              streetPart.push(addr.building || addr.amenity || addr.landmark || addr.shop || addr.office);
            }
            if (addr.road || addr.street || addr.pedestrian || addr.footway) {
              streetPart.push(addr.road || addr.street || addr.pedestrian || addr.footway);
            }
            if (streetPart.length > 0) {
              parts.push(streetPart.join(" "));
            }
            
            const locality = addr.suburb || addr.neighbourhood || addr.village || addr.sublocality || addr.residential || addr.hamlet;
            if (locality) parts.push(locality);
            if (addr.ward) parts.push(addr.ward);
            
            const city = addr.city || addr.town || addr.municipality;
            if (city) {
              parts.push(city);
            } else if (addr.county || addr.state_district) {
              parts.push(addr.county || addr.state_district);
            }
            
            const regionPart = [];
            if (addr.state || addr.province) regionPart.push(addr.state || addr.province);
            if (addr.postcode) regionPart.push(addr.postcode);
            if (regionPart.length > 0) parts.push(regionPart.join(" "));
            
            formatted = deduplicateAddress(parts.join(", "));
          }
          
          updateField("address", formatted || `${lat}, ${lon}`);
        } else {
           throw new Error("Invalid geocoding response");
        }
      } catch (error) {
        console.error("Failed to reverse geocode:", error);
        updateField("address", `${lat}, ${lon}`);
      } finally {
        setGpsLoading(false);
      }
    };

    const handleLocationError = (error: GeolocationPositionError) => {
      console.warn("High accuracy location error:", error);
      // Fallback to standard accuracy
      navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        (finalError: GeolocationPositionError) => {
          console.error("Final geolocation error:", finalError);
          if (finalError.code === finalError.PERMISSION_DENIED) {
            alert("Location permission denied. Please allow location access in your browser settings to proceed.");
          } else if (finalError.code === finalError.POSITION_UNAVAILABLE) {
            alert("Location unavailable. Please check if location services / GPS are enabled on your device.");
          } else if (finalError.code === finalError.TIMEOUT) {
            alert("Location request timed out. Please check your network and GPS connection.");
          } else {
            alert("Unable to retrieve your location. Please try again.");
          }
          setGpsLoading(false);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    };

    navigator.geolocation.getCurrentPosition(
      onLocationSuccess,
      handleLocationError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!user?.district_id && !user?.district) {
      next.district = "District is required";
    }
    if (!form.ward_id) next.ward_id = "Please select a ward";
    if (!form.complaint_type) next.complaint_type = "Please select a complaint type";
    if (form.description.trim().length < 10) next.description = "Description must be at least 10 characters";
    if (!form.latitude || !form.longitude) next.location = "Please use your current location to proceed";
    if (!form.address || !form.address.trim()) next.address = "Address is required";
    if (!form.landmark || !form.landmark.trim()) next.landmark = "Landmark / Door No. is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, bypassDuplicateCheck = false) => {
    if (e) e.preventDefault();
    
    const next: Record<string, string> = {};
    if (!user?.district_id && !user?.district) {
      next.district = "District is required";
    }
    if (!form.ward_id) next.ward_id = "Please select a ward";
    if (!form.complaint_type) next.complaint_type = "Please select a complaint type";
    if (form.description.trim().length < 10) next.description = "Description must be at least 10 characters";
    if (!form.latitude || !form.longitude) next.location = "Please use your current location to proceed";
    if (!form.address || !form.address.trim()) next.address = "Address is required";
    if (!form.landmark || !form.landmark.trim()) next.landmark = "Landmark / Door No. is required";
    
    setErrors(next);
    
    if (Object.keys(next).length > 0) {
      if (next.complaint_type || next.description) {
        setStep(1);
      } else {
        setStep(2);
      }
      return;
    }
    
    setLoading(true);
    setServerError("");
    try {
      const selectedWard = wards.find((w: any) => (w._id || w.id) === form.ward_id);
      const wardName = selectedWard ? selectedWard.ward_name : "";

      const formData = new FormData();
      formData.append("ward_id", form.ward_id);
      formData.append("wardId", form.ward_id);
      formData.append("wardName", wardName);
      formData.append("ward_name", wardName);
      formData.append("district_id", resolvedDistrictId || "");
      formData.append("districtId", resolvedDistrictId || "");
      formData.append("district_name", districtName || "");
      formData.append("districtName", districtName || "");
      formData.append("complaint_type", form.complaint_type);
      formData.append("description", form.description);
      formData.append("priority", form.priority);
      formData.append("latitude", form.latitude);
      formData.append("longitude", form.longitude);
      if (form.address) formData.append("address", form.address);
      if (form.landmark) formData.append("landmark", form.landmark);
      if (form.citizen_note) formData.append("citizen_note", form.citizen_note.trim());
      if (aiVerifiedPayload) {
        formData.append("ai_verification", JSON.stringify(aiVerifiedPayload));
      }
      if (bypassDuplicateCheck) {
        formData.append("force_create", "true");
        if (duplicateMatch) {
          formData.append("duplicate_detection", JSON.stringify(duplicateMatch));
        }
      }
      
      if (selectedImages.length === 0) {
        formData.append("images", new Blob([""], { type: "application/octet-stream" }), "");
      } else {
        selectedImages.forEach((file) => {
          formData.append("images", file);
        });
      }
      
      console.log("Submitting Complaint Payload:");
      formData.forEach((value, key) => {
        console.log(`- ${key}:`, value);
      });

      const result = await createComplaint.mutateAsync(formData as any);
      if (result && (result.status === "duplicate_check" || result.data?.duplicate)) {
        setDuplicateMatch({
          ...(result.data || result),
          message: result.message || result.reason || result.data?.reason
        });
        setDuplicatePopup(true);
        setLoading(false);
        return;
      }
      setCreatedComplaint(result);
      setShowSuccess(true);
    } catch (err: any) {
      console.error("Submission failed!", err);
      const resData = err?.response?.data;
      if (resData && (resData.status === "duplicate_check" || resData.data?.duplicate)) {
        setDuplicateMatch({
          ...(resData.data || resData),
          message: resData.message || resData.reason || resData.data?.reason
        });
        setDuplicatePopup(true);
        setLoading(false);
        return;
      }
      
      import("@/lib/api").then(({ getErrorMessage }) => {
         setServerError(getErrorMessage(err, "Failed to create complaint"));
      });
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess && createdComplaint) {
    const complaintId = createdComplaint.complaint_id || createdComplaint.id || "N/A";
    
    // Extract AI details
    const aiPriorityObj = createdComplaint.ai_priority || createdComplaint.ai?.priority_prediction;
    const rawPriority = aiPriorityObj?.priority || createdComplaint.final_priority || createdComplaint.priority || "Medium";
    const confidence = aiPriorityObj?.confidence || 0;
    const reason = aiPriorityObj?.reason || "Priority predicted by AI.";
    
    const emojiPriority = String(rawPriority).toUpperCase() === "HIGH" ? "🔴 High" :
                          String(rawPriority).toUpperCase() === "MEDIUM" ? "🟡 Medium" : "🟢 Low";
                          
    return (
      <div className="flex-1 bg-background flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500 min-h-[calc(100vh-100px)]">
        <div className="bg-card rounded-3xl p-8 max-w-md w-full text-center shadow-xl shadow-success/10 border border-success/20">
          <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-1">Complaint Submitted Successfully</h2>
          <p className="text-xs font-semibold text-muted-foreground mb-6">Your report has been logged in the system.</p>
          
          <div className="bg-muted/30 rounded-2xl p-5 mb-6 text-left border border-border space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Complaint ID</span>
              <span className="text-sm font-black text-foreground font-mono">{complaintId}</span>
            </div>
            
            <div className="space-y-3">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest block">AI Analysis</span>
              
              <div className="flex items-center gap-2 text-sm font-extrabold text-success">
                <span>✅ Image Verified</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-bold text-muted-foreground block">Priority</span>
                <span className="text-sm font-black text-foreground">{emojiPriority}</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-bold text-muted-foreground block">Reason</span>
                <p className="text-sm font-medium text-foreground leading-relaxed">{reason}</p>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-bold text-muted-foreground block">Confidence</span>
                <span className="text-sm font-extrabold text-foreground">{confidence}%</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 py-3.5 px-4 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-2xl transition-colors text-sm"
            >
              Done
            </button>
            <button
              onClick={() => router.push(`/complaints/${createdComplaint._id || createdComplaint.id}`)}
              className="flex-1 py-3.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl transition-colors shadow-md shadow-primary/20 text-sm"
            >
              View Complaint
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background relative pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-primary pt-12 pb-24 px-6 md:px-12 md:rounded-b-[60px] rounded-b-[40px] shadow-lg">
        <div className="max-w-3xl mx-auto">
           <h1 className="text-3xl font-black text-white tracking-tight">Raise a Complaint</h1>
           <p className="text-white/80 font-semibold mt-2 text-sm">Help us fix your community by reporting an issue.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-12">
        <div className="bg-card rounded-[2rem] p-6 shadow-md border border-border mb-6">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted z-0">
               <div className="h-full bg-primary transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
            </div>
            {[1, 2, 3].map((s) => (
              <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30' : 'bg-muted text-muted-foreground border-2 border-border'}`}>
                {s}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 px-1 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <span className={step >= 1 ? 'text-primary' : ''}>Issue</span>
            <span className={step >= 2 ? 'text-primary' : ''}>Location</span>
            <span className={step >= 3 ? 'text-primary' : ''}>Review</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: What's the issue */}
          <div className={`transition-all duration-500 ${step === 1 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}`}>
            <div className="bg-card rounded-[2rem] p-6 shadow-sm border border-border">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">What&apos;s the issue?</h2>
                  <p className="text-xs font-semibold text-muted-foreground">Type & description</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase">Complaint Type</label>
                  <div className="relative">
                    <select
                      value={form.complaint_type}
                      onChange={(e) => updateField("complaint_type", e.target.value)}
                      className={`w-full appearance-none bg-muted/30 border-2 ${errors.complaint_type ? 'border-destructive' : 'border-border'} rounded-2xl px-5 py-4 text-sm font-bold text-foreground outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-200`}
                    >
                      <option value="" disabled>Select a category</option>
                      {COMPLAINT_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                  {errors.complaint_type && <p className="text-destructive text-xs font-bold mt-1.5 ml-1">{errors.complaint_type}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Describe the issue clearly (min 10 characters)"
                    rows={4}
                    className={`w-full bg-muted/30 border-2 ${errors.description ? 'border-destructive' : 'border-border'} rounded-2xl px-5 py-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-none`}
                  />
                  {errors.description && <p className="text-destructive text-xs font-bold mt-1.5 ml-1">{errors.description}</p>}
                </div>



                <div>
                  <label className="block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase">Upload Photos (Optional)</label>
                  <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors relative cursor-pointer group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          setSelectedImages([file]);
                          verifyImage(file);
                        }
                      }}
                    />
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                       <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold text-foreground">Tap or drag images here</p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                  </div>
                  
                  {selectedImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {selectedImages.map((file, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border group shadow-sm">
                          <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedImages([]);
                              setAiVerifiedPayload(null);
                            }}
                            className="absolute top-1 right-1 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={isSubmitDisabled()}
                  onClick={() => {
                    let isValid = true;
                    if (!form.complaint_type) { updateField("complaint_type", ""); isValid = false; }
                    if (form.description.length < 10) { updateField("description", ""); isValid = false; }
                    if (isValid) setStep(2);
                  }}
                  className="py-4 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black text-sm tracking-wide shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Where is it */}
          <div className={`transition-all duration-500 ${step === 2 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}`}>
            <div className="bg-card rounded-[2rem] p-6 shadow-sm border border-border">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Where is it?</h2>
                  <p className="text-xs font-semibold text-muted-foreground">Ward, address & GPS location</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase">District</label>
                  <input
                    type="text"
                    value={districtName}
                    readOnly
                    className="w-full bg-muted/20 border-2 border-border rounded-2xl px-5 py-4 text-sm font-bold text-muted-foreground outline-none cursor-not-allowed"
                  />
                  {errors.district && <p className="text-destructive text-xs font-bold mt-1.5 ml-1">{errors.district}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase">Ward</label>
                  <div className="relative">
                    <select
                      value={form.ward_id}
                      onChange={(e) => updateField("ward_id", e.target.value)}
                      disabled={wardsLoading || !user}
                      className={`w-full appearance-none bg-muted/30 border-2 ${errors.ward_id ? 'border-destructive' : 'border-border'} rounded-2xl px-5 py-4 text-sm font-bold text-foreground outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-200 disabled:opacity-50`}
                    >
                      {wardsLoading ? (
                        <option value="" disabled>Loading wards...</option>
                      ) : wards.length === 0 ? (
                        <option value="" disabled>No wards available for the selected district.</option>
                      ) : (
                        <>
                          <option value="" disabled>Select your ward</option>
                          {wards.map((w: any) => (
                            <option key={w._id || w.id} value={w._id || w.id}>
                              {w.ward_number ? `${String(w.ward_number).padStart(2, "0")} - ` : ""}{w.ward_name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                  {errors.ward_id && <p className="text-destructive text-xs font-bold mt-1.5 ml-1">{errors.ward_id}</p>}
                  {wardsError && (
                    <div className="text-destructive text-xs mt-1.5 ml-1 font-bold flex items-center gap-2">
                      <span>Failed to load wards.</span>
                      <button type="button" onClick={() => refetchWards()} className="underline text-primary hover:text-primary/80 font-bold">
                        Retry
                      </button>
                    </div>
                  )}
                </div>
                
                {errors.location && <p className="text-destructive text-xs font-bold mt-1.5 ml-1">{errors.location}</p>}

                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gpsLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary/10 text-primary hover:bg-primary/20 border-2 border-primary/20 rounded-2xl transition-all duration-200 font-bold text-sm"
                >
                  <Navigation className={`w-5 h-5 ${gpsLoading ? 'animate-spin' : ''}`} />
                  {gpsLoading ? "Getting location..." : "Use my current location"}
                </button>

                {(form.latitude || form.longitude) && (
                  <div className="flex items-center gap-3 bg-success/10 border border-success/30 rounded-2xl p-4">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    <span className="flex-1 text-sm font-bold text-success truncate">
                      {form.latitude}, {form.longitude}
                    </span>
                    <button
                      type="button"
                      onClick={() => { updateField("latitude", ""); updateField("longitude", ""); }}
                      className="p-1 hover:bg-success/20 rounded-lg text-success"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase">Address</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="Address will be auto-filled by GPS"
                      className={`w-full bg-muted/30 border-2 ${errors.address ? 'border-destructive' : 'border-border'} rounded-2xl px-5 py-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-200`}
                    />
                    {errors.address && <p className="text-destructive text-xs font-bold mt-1.5 ml-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase">Landmark / Door No.</label>
                    <input
                      type="text"
                      value={form.landmark}
                      onChange={(e) => updateField("landmark", e.target.value)}
                      placeholder="Example: Near Government School, No. 64/13 Rayan Kuttai Street"
                      className={`w-full bg-muted/30 border-2 ${errors.landmark ? 'border-destructive' : 'border-border'} rounded-2xl px-5 py-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-200`}
                    />
                    {errors.landmark && <p className="text-destructive text-xs font-bold mt-1.5 ml-1">{errors.landmark}</p>}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-4 px-6 bg-muted hover:bg-muted/80 text-foreground rounded-2xl font-black text-sm tracking-wide transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    let isValid = true;
                    if (!user?.district_id && !user?.district) {
                      setErrors((prev) => ({ ...prev, district: "District is required" }));
                      isValid = false;
                    }
                    if (!form.ward_id) {
                      setErrors((prev) => ({ ...prev, ward_id: "Please select your ward" }));
                      isValid = false;
                    }
                    if (!form.latitude || !form.longitude) {
                      setErrors((prev) => ({ ...prev, location: "Please use your current location to proceed" }));
                      isValid = false; 
                    }
                    if (isValid) setStep(3);
                  }}
                  className="py-4 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black text-sm tracking-wide shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Additional info & Review */}
          <div className={`transition-all duration-500 ${step === 3 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}`}>
            <div className="bg-card rounded-[2rem] p-6 shadow-sm border border-border">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Review & Submit</h2>
                  <p className="text-xs font-semibold text-muted-foreground">Add any final notes</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase">Citizen Note (Optional)</label>
                <textarea
                  value={form.citizen_note}
                  onChange={(e) => updateField("citizen_note", e.target.value)}
                  placeholder="Anything else we should know?"
                  rows={3}
                  className="w-full bg-muted/30 border-2 border-border rounded-2xl px-5 py-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-none"
                />
              </div>
              
              <div className="mt-6 bg-muted/50 rounded-2xl p-4 border border-border/50">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Summary</p>
                <div className="space-y-2 text-sm font-medium">
                    <div className="flex justify-between"><span className="text-muted-foreground">Type:</span> <span className="text-foreground">{COMPLAINT_TYPES.find(t=>t.value===form.complaint_type)?.label}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">District:</span> <span className="text-foreground truncate ml-4">{districtName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Ward:</span> <span className="text-foreground truncate ml-4">{wards.find((w:any)=>(w._id || w.id)===form.ward_id)?.ward_name}</span></div>
                   {selectedImages.length > 0 && (
                     <div className="flex justify-between"><span className="text-muted-foreground">Attachments:</span> <span className="text-foreground">{selectedImages.length} photo(s)</span></div>
                   )}
                </div>
              </div>

              {serverError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold p-5 rounded-2xl flex items-center gap-3 mt-6">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  {serverError}
                </div>
              )}
              
              <div className="mt-8 flex justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-4 px-6 bg-muted hover:bg-muted/80 text-foreground rounded-2xl font-black text-sm tracking-wide transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* AI Image Verification Dialog Overlay */}
      {verificationPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-[2rem] p-8 max-w-md w-full shadow-2xl scale-in duration-200">
            {verificationPopup === "loading" && (
              <div className="text-center py-6">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-xl font-black text-foreground">🤖 Verifying uploaded image...</h3>
                <p className="text-sm text-muted-foreground mt-2 font-medium">AI is verifying your image...</p>
              </div>
            )}

            {verificationPopup === "success" && aiVerifiedPayload && (
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 text-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-[#059669]" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2">✅ Image Verified</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6">
                  AI has successfully verified this image as a valid civic issue.
                </p>
                <div className="bg-muted/30 border border-border rounded-2xl p-4 text-left mb-6 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-border/50">
                    <span className="font-bold text-muted-foreground">Detected Category:</span>
                    <span className="font-extrabold text-foreground capitalize">
                      {String(aiVerifiedPayload.predicted_category).replace(/_/g, " ").toLowerCase()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-bold text-muted-foreground">Confidence:</span>
                    <span className="font-extrabold text-foreground">
                      {(() => {
                        const conf = aiVerifiedPayload.confidence;
                        return conf <= 1.0 ? `${Math.round(conf * 100)}%` : `${conf}%`;
                      })()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImages([]);
                      setAiVerifiedPayload(null);
                      setVerificationPopup(null);
                    }}
                    className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl text-xs transition-colors"
                  >
                    Upload Another
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationPopup(null)}
                    className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs shadow-md shadow-primary/10 transition-colors"
                  >
                    Continue Complaint
                  </button>
                </div>
              </div>
            )}

            {verificationPopup === "fail" && aiVerifiedPayload && (
              <div className="text-center">
                <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2">⚠ Image Verification Failed</h3>
                <p className="text-sm text-muted-foreground font-medium mb-4">
                  The uploaded image does not appear to contain a civic issue.
                </p>
                <div className="bg-destructive/5 border border-destructive/10 rounded-2xl p-4 text-left mb-6 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="font-bold text-destructive">AI Detected:</span>
                    <span className="font-extrabold text-destructive capitalize">
                      {String(aiVerifiedPayload.predicted_category || "Unrelated Object").replace(/_/g, " ").toLowerCase()}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-left mb-3">
                  Please upload an image showing an actual civic issue:
                </p>
                <div className="grid grid-cols-2 gap-2 text-left mb-6 text-[11px] font-bold text-slate-500">
                  <span>• Garbage</span>
                  <span>• Road Pothole</span>
                  <span>• Water Leakage</span>
                  <span>• Drainage Blockage</span>
                  <span>• Broken Street Light</span>
                  <span>• Damaged Park</span>
                  <span className="col-span-2">• Illegal Dumping</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImages([]);
                    setAiVerifiedPayload(null);
                    setVerificationPopup(null);
                  }}
                  className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs transition-colors"
                >
                  Upload Another Image
                </button>
              </div>
            )}

            {verificationPopup === "low_quality" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2">⚠ Image Quality Too Low</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6">
                  The uploaded image is too blurry or unclear for AI verification. Please upload a clearer image.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImages([]);
                      setAiVerifiedPayload(null);
                      setVerificationPopup(null);
                    }}
                    className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl text-xs transition-colors"
                  >
                    Retake Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImages([]);
                      setAiVerifiedPayload(null);
                      setVerificationPopup(null);
                    }}
                    className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs transition-colors"
                  >
                    Choose Another
                  </button>
                </div>
              </div>
            )}

            {verificationPopup === "mismatch" && aiVerifiedPayload && (
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2">⚠ Category Mismatch</h3>
                <p className="text-sm text-muted-foreground font-medium mb-4">
                  AI believes this image belongs to:
                </p>
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 text-center mb-4">
                  <span className="font-extrabold text-amber-600 text-lg capitalize">
                    {String(aiVerifiedPayload.predicted_category).replace(/_/g, " ").toLowerCase()}
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground mb-6">
                  Would you like to update the complaint category?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setVerificationPopup(null)}
                    className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl text-xs transition-colors"
                  >
                    Keep My Selection
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateField("complaint_type", aiVerifiedPayload.predicted_category);
                      setVerificationPopup(null);
                    }}
                    className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs transition-colors"
                  >
                    Use AI Category
                  </button>
                </div>
              </div>
            )}

            {verificationPopup === "unavailable" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2">⚠ AI Verification Unavailable</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6">
                  {aiVerificationError || "Unable to verify the uploaded image at the moment. Please try again later."}
                </p>
                <button
                  type="button"
                  onClick={() => setVerificationPopup(null)}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Duplicate Complaint Warning Dialog */}
      {duplicatePopup && duplicateMatch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-[2rem] p-8 max-w-md w-full shadow-2xl scale-in duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">Duplicate Complaint Found</h3>
              <p className="text-sm text-foreground font-semibold mb-6 px-2">
                {duplicateMatch.message || duplicateMatch.reason || (duplicateMatch.is_same_citizen ? "You have already reported this complaint." : "This complaint has already been reported by another citizen.")}
              </p>
              
              <div className="bg-muted/30 border border-border rounded-2xl p-4 text-left mb-6 text-sm space-y-2">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="font-bold text-muted-foreground">Complaint ID:</span>
                  <span className="font-extrabold text-foreground">{duplicateMatch.matched_complaint_id || duplicateMatch.existing_complaint?.complaint_id || duplicateMatch.existing_complaint?.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="font-bold text-muted-foreground">Current Status:</span>
                  <span className="font-extrabold text-foreground capitalize">{String(duplicateMatch.existing_complaint?.status || "OPEN").toLowerCase()}</span>
                </div>
                {duplicateMatch.similarity !== undefined && (
                  <div className="flex justify-between py-1">
                    <span className="font-bold text-muted-foreground">Similarity Score:</span>
                    <span className="font-extrabold text-amber-600">{duplicateMatch.similarity}%</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDuplicatePopup(false);
                    const targetId = duplicateMatch.existing_complaint?.id || duplicateMatch.matched_complaint_id;
                    router.push(`/complaints/${targetId}`);
                  }}
                  className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl text-xs transition-colors shadow-md shadow-primary/10"
                >
                  View Existing Complaint
                </button>
                <button
                  type="button"
                  onClick={() => setDuplicatePopup(false)}
                  className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl text-xs transition-colors"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
