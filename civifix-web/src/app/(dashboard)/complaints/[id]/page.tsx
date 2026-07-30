"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "@/constants/endpoints";
import authService from "@/services/auth";
import { useParams, useRouter } from "next/navigation";
import { useComplaint } from "@/hooks/use-complaints";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  AlertCircle,
  Map,
  ClipboardList,
  Wrench,
  TreePine,
  Activity,
  Lightbulb,
  CheckCircle2,
  Clock,
  FolderOpen,
  XCircle,
  Info,
  MapPin,
  Navigation,
  FileText,
  User,
  ShieldCheck,
  HardHat,
  ChevronRight,
  Phone,
  Mail,
  Check,
  PenSquare,
  Play,
  X,
  History,
  MoreVertical
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { complaintsApi } from "@/services/api";
import ImageLightbox from "@/components/ImageLightbox";

const STATUS_CONFIG: Record<string, { color: string, bg: string, border: string, icon: any, label: string }> = {
  PENDING:     { color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", icon: Clock, label: "Pending" },
  OPEN:        { color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", icon: FolderOpen, label: "Open" },
  ASSIGNED:    { color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", icon: HardHat, label: "Assigned" },
  WORKING:     { color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20", icon: Wrench, label: "In Progress" },
  IN_PROGRESS: { color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20", icon: Wrench, label: "In Progress" },
  CLOSED:      { color: "text-success", bg: "bg-success/10", border: "border-success/20", icon: CheckCircle2, label: "Resolved" },
  RESOLVED:    { color: "text-success", bg: "bg-success/10", border: "border-success/20", icon: CheckCircle2, label: "Resolved" },
  REJECTED:    { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", icon: XCircle, label: "Rejected" },
};

const PRIORITY_CONFIG: Record<string, { color: string, bg: string, label: string }> = {
  LOW:      { color: "text-success", bg: "bg-success/10", label: "Low" },
  MEDIUM:   { color: "text-accent", bg: "bg-accent/10", label: "Medium" },
  HIGH:     { color: "text-destructive", bg: "bg-destructive/10", label: "High" },
  CRITICAL: { color: "text-destructive", bg: "bg-destructive/20", label: "Critical" },
};

const TYPE_META: Record<string, { icon: any, color: string, bg: string, title: string }> = {
  ROAD_DAMAGE:  { icon: Map, color: "text-destructive", bg: "bg-destructive/10", title: "Road Damage" },
  GARBAGE:      { icon: ClipboardList, color: "text-secondary", bg: "bg-secondary/10", title: "Waste Collection" },
  POTHOLE:      { icon: Map, color: "text-destructive", bg: "bg-destructive/10", title: "Pothole" },
  STREETLIGHT:  { icon: Lightbulb, color: "text-primary", bg: "bg-primary/10", title: "Street Light" },
  WATER_SUPPLY: { icon: Activity, color: "text-primary", bg: "bg-primary/10", title: "Water Supply" },
  DRAINAGE:     { icon: Wrench, color: "text-secondary", bg: "bg-secondary/10", title: "Drainage Issue" },
  SANITATION:   { icon: ClipboardList, color: "text-secondary", bg: "bg-secondary/10", title: "Sanitation" },
  TREE_CUTTING: { icon: TreePine, color: "text-success", bg: "bg-success/10", title: "Tree Issue" },
  CONSTRUCTION: { icon: Wrench, color: "text-accent", bg: "bg-accent/10", title: "Construction Block" },
  OTHER:        { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", title: "Civic Issue" },
};

function InfoRow({ icon: Icon, label, value }: { icon: any, label: string, value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 mb-5">
      <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 mt-1 border border-border/50">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-1">{label}</p>
        <p className="text-sm font-semibold text-foreground leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

function NoteCard({ icon: Icon, label, value, colorClass, borderClass, bgClass }: any) {
  if (!value) return null;
  return (
    <div className={`border-l-4 ${borderClass} bg-muted/30 rounded-2xl p-5 mb-4`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <span className={`text-sm font-bold ${colorClass}`}>{label}</span>
      </div>
      <p className="text-sm font-medium text-muted-foreground leading-relaxed">{value}</p>
    </div>
  );
}


const getFinalImageUri = (img: string) => {
  let finalUri = img;
  if (img && typeof img === 'string' && !img.startsWith('http') && !img.startsWith('data:')) {
    const base = API_URL ? API_URL.replace(/\/api\/v1\/?$/, '') : '';
    // If the backend didn't include 'uploads/', we inject it.
    let path = img.startsWith('/') ? img : '/' + img;
    if (!path.startsWith('/uploads/')) {
      path = '/uploads' + path;
    }
    finalUri = `${base}${path}`;
  }
  return finalUri;
};

export default function ComplaintDetailsPage() {
  const { user } = useAuth();
  const isPrivileged = user?.role === "INSPECTOR" || user?.role === "WORKER" || user?.role === "SUPER_ADMIN" || user?.role === "DISTRICT_ADMIN";
  const isInspectorOrWorker = user?.role === "INSPECTOR" || user?.role === "WORKER";
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading: loading, refetch } = useComplaint(id);
  const complaint: any = data;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (complaint) {
      console.log("--- DEBUG LOGS ---");
      console.log("Complaint Response:", complaint);
      console.log("complaint.images:", complaint.images);
      console.log("complaint.image_urls:", complaint.image_urls);
      console.log("complaint.proof_images:", complaint.proof_images);
    }
  }, [complaint]);


  const [updating, setUpdating] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [selectedProofImages, setSelectedProofImages] = useState<File[]>([]);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [reopenReason, setReopenReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const updateStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      await complaintsApi.updateStatus(id, newStatus);
      refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleAccept = async () => {
    try {
      setUpdating(true);
      await authService.inspectorStartWork(id);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["ward-complaints"] });
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    } catch (e) {
      console.error(e);
      alert("Failed to accept complaint");
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) return alert("Please select a rating");
    try {
      setUpdating(true);
      await complaintsApi.submitFeedback(id, { rating, feedback });
      alert("Feedback submitted successfully!");
      refetch();
    } catch (e: any) {
      alert("Failed to submit feedback");
    } finally {
      setUpdating(false);
    }
  };

  const handleReopen = async () => {
    if (!reopenReason.trim()) return alert("Please provide a reason to reopen");
    try {
      setUpdating(true);
      await complaintsApi.reopenComplaint(id, reopenReason);
      alert("Complaint reopened successfully!");
      refetch();
    } catch (e: any) {
      alert("Failed to reopen complaint");
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }
    
    try {
      setUpdating(true);
      
      // Call existing Reject API
      await authService.inspectorRejectComplaint(id);
      
      // Save the rejection reason via Notes API
      try {
        const { default: api } = await import("@/lib/api");
        await api.post(`/inspector/complaints/${id}/notes`, { note: `Rejection Reason: ${rejectReason}` });
      } catch (noteErr) {
        console.error("Failed to save rejection reason", noteErr);
      }
      
      setShowRejectModal(false);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["ward-complaints"] });
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    } catch (e: any) {
      console.error(e);
      const msg = e.response?.data?.message || e.message || "Failed to reject complaint";
      alert(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handleResolveConfirm = async () => {
    try {
      setUpdating(true);
      
      if (selectedProofImages.length > 0) {
        const formData = new FormData();
        selectedProofImages.forEach(file => {
          formData.append("images", file);
        });
        await complaintsApi.resolveComplaintWithImages(id, formData);
      } else {
        await authService.inspectorResolveComplaint(id);
      }
      
      setShowResolveModal(false);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["ward-complaints"] });
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    } catch (e: any) {
      console.error(e);
      const msg = e.response?.data?.message || e.message || "Failed to resolve complaint";
      alert(msg);
    } finally {
      setUpdating(false);
    }
  };

  const addNote = async () => {
    try {
      setUpdating(true);
      await complaintsApi.addNote(id, { text: newNote });
      setNewNote("");
      setShowNotesModal(false);
      refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to add note");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-bold text-muted-foreground">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-black text-foreground mb-2">Complaint Not Found</h2>
          <button onClick={() => router.back()} className="text-primary font-bold hover:underline">Go Back</button>
        </div>
      </div>
    );
  }




  const typeMeta = TYPE_META[complaint.complaint_type] || TYPE_META.OTHER;
  const statusCfg = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.PENDING;
  const priorityCfg = PRIORITY_CONFIG[complaint.priority] || PRIORITY_CONFIG.MEDIUM;
  const StatusIcon = statusCfg.icon;
  const TypeIcon = typeMeta.icon;

  return (
    <div className="flex-1 bg-background min-h-screen pb-20 md:pb-8">
      
      {/* Header */}
      <div className={`${isInspectorOrWorker ? "bg-gradient-to-br from-[#0F8A83] to-[#0B6E69]" : "bg-primary"} pt-10 pb-16 px-6 md:px-12 md:rounded-b-[60px] rounded-b-[40px] shadow-lg flex items-start justify-between`}>
        <div className="max-w-3xl mx-auto w-full flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button 
              onClick={() => router.back()}
              className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors shadow-sm mt-1"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Complaint Details</h1>
              <p className="text-white/80 font-bold text-sm mt-1 bg-white/10 px-3 py-1 rounded-full inline-block">{complaint.complaint_id}</p>
            </div>
          </div>
          <div className={`w-4 h-4 rounded-full ${statusCfg.bg} border-[3px] border-white/50 shadow-sm mt-3`}></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Hero Card */}
        <div className={`bg-card rounded-[2rem] p-6 shadow-md mb-6 border-t-[6px] ${statusCfg.border.replace('border-', 'border-t-')}`}>
          <div className="flex items-start gap-5 mb-6">
            <div className={`w-16 h-16 rounded-2xl ${typeMeta.bg} flex items-center justify-center shrink-0 border border-border/50`}>
              <TypeIcon className={`w-8 h-8 ${typeMeta.color}`} />
            </div>
            <div className="flex-1 mt-1">
              <h2 className="text-2xl font-black text-foreground tracking-tight leading-tight mb-2">
                {complaint.title || typeMeta.title}
              </h2>
              <p className="text-xs font-bold text-muted-foreground tracking-widest">{complaint.complaint_id}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 border-t border-border/50 pt-5 mt-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${statusCfg.border} ${statusCfg.bg}`}>
              <StatusIcon className={`w-5 h-5 ${statusCfg.color}`} />
              <span className={`text-sm font-bold ${statusCfg.color}`}>{statusCfg.label}</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-border ${priorityCfg.bg}`}>
              <AlertCircle className={`w-5 h-5 ${priorityCfg.color}`} />
              <span className={`text-sm font-bold ${priorityCfg.color}`}>{priorityCfg.label} Priority</span>
            </div>
            <div className="ml-auto text-sm font-bold text-muted-foreground flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border/50">
              <Clock className="w-4 h-4" />
              {new Date(complaint.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-card rounded-[2rem] p-6 shadow-sm border border-border mb-6">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-black text-foreground">Complaint Info</h3>
          </div>

          <InfoRow icon={FileText} label="Description" value={complaint.description} />
          <InfoRow icon={MapPin} label="Address" value={complaint.address} />
          {complaint.landmark && (
            <InfoRow icon={MapPin} label="Landmark / Door No." value={complaint.landmark} />
          )}
          <InfoRow 
            icon={Navigation} 
            label="Coordinates" 
            value={complaint.latitude && complaint.longitude ? `${complaint.latitude}, ${complaint.longitude}` : null} 
          />

          {(() => {
            let complaintImages: string[] = [];
            if (Array.isArray(complaint.images) && complaint.images.length > 0) {
              complaintImages = complaint.images;
            } else if (Array.isArray(complaint.image_urls) && complaint.image_urls.length > 0) {
              complaintImages = complaint.image_urls;
            } else if (Array.isArray(complaint.proof_images) && complaint.proof_images.length > 0) {
              complaintImages = complaint.proof_images;
            }

            if (complaintImages.length > 0) {
              return (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Attached Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {complaintImages.map((url: string, index: number) => {
                      const finalUrl = getFinalImageUri(url);
                      console.log(`[Web] Rendering Image: ${url} -> ${finalUrl}`);
                      return (
                        <div 
                          key={index} 
                          className="relative aspect-square rounded-2xl overflow-hidden border border-border shadow-sm cursor-pointer group"
                          onClick={() => setSelectedImagePreview(finalUrl)}
                        >
                          <img src={finalUrl} alt={`Complaint ${index+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {(complaint.citizen_note || complaint.worker_note || complaint.inspector_note || complaint.rejection_reason) && (
            <>
              <div className="h-px bg-border my-8"></div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-black text-foreground">Notes</h3>
              </div>
              
              <NoteCard 
                icon={User} 
                label="Citizen Note" 
                value={complaint.citizen_note} 
                colorClass="text-primary" 
                borderClass="border-primary" 
              />
              <NoteCard 
                icon={HardHat} 
                label="Worker Note" 
                value={complaint.worker_note} 
                colorClass="text-secondary" 
                borderClass="border-secondary" 
              />
              <NoteCard 
                icon={ShieldCheck} 
                label="Inspector Note" 
                value={complaint.inspector_note} 
                colorClass="text-accent" 
                borderClass="border-accent" 
              />
              <NoteCard 
                icon={XCircle} 
                label="Rejection Reason" 
                value={complaint.rejection_reason} 
                colorClass="text-destructive" 
                borderClass="border-destructive" 
              />
            </>
          )}
        </div>

        {/* Citizen Information */}
        {isPrivileged && complaint.citizen && (
          <div className="bg-card rounded-[2rem] p-6 shadow-sm border border-border mb-6">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <User className="w-5 h-5 text-success" />
              </div>
              <h3 className="text-lg font-black text-foreground">Citizen Information</h3>
            </div>
            <InfoRow icon={User} label="Name" value={complaint.citizen.name} />
            <InfoRow icon={Phone} label="Phone" value={complaint.citizen.phone} />
            <InfoRow icon={Mail} label="Email" value={complaint.citizen.email} />
          </div>
        )}

        {/* Activity Timeline */}
        {isPrivileged && complaint.history && complaint.history.length > 0 && (
          <div className="bg-card rounded-[2rem] p-6 shadow-sm border border-border mb-6">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <History className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-black text-foreground">Activity Timeline</h3>
            </div>
            <div className="relative pl-8 border-l-2 border-border ml-5 pb-4 mt-4">
              {complaint.history.map((h: any, i: number) => {
                const s = STATUS_CONFIG[h.status] || STATUS_CONFIG.PENDING;
                return (
                  <div key={i} className="mb-8 relative">
                    <div className={`absolute -left-[41px] w-5 h-5 rounded-full border-[4px] border-card ${s.bg.replace('bg-', 'bg-').replace('10', '500')} shadow-sm`}></div>
                    <p className="text-sm font-black text-foreground">{s.label}</p>
                    <p className="text-xs font-bold text-muted-foreground mt-1">
                      {new Date(h.timestamp || h.created_at).toLocaleString()}
                    </p>
                    {h.remarks && (
                      <p className="text-sm font-medium text-muted-foreground mt-3 bg-muted/30 p-4 rounded-2xl border border-border/50">{h.remarks}</p>
                    )}
                  </div>
                );
              })}
            </div>
            {complaint.notes && complaint.notes.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border/50">
                <h4 className="text-sm font-bold text-foreground mb-4">Inspector Notes</h4>
                <div className="space-y-4">
                  {complaint.notes.map((note: any, idx: number) => (
                    <div key={idx} className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                      <p className="text-sm font-medium text-amber-900">{note.text}</p>
                      <p className="text-xs font-bold text-amber-700/60 mt-2">
                        {new Date(note.created_at).toLocaleString()} • {note.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Inspector Actions — simplified workflow */}
        {user?.role === "INSPECTOR" && (
          <>
            {/* OPEN: Start Work + Reject */}
            {complaint.status === "OPEN" && (
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 mb-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-[#DDF8F5] flex items-center justify-center">
                    <MoreVertical className="w-5 h-5 text-[#0F8A83]" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800">Complaint Actions</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    disabled={updating}
                    onClick={handleAccept}
                    className="flex items-center justify-center gap-2 bg-[#059669] hover:bg-emerald-700 text-white rounded-2xl py-4 text-sm font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all hover:-translate-y-0.5"
                  >
                    <Play className="w-5 h-5" /> Accept
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => setShowRejectModal(true)}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 text-sm font-bold shadow-md shadow-red-500/20 disabled:opacity-50 transition-all hover:-translate-y-0.5"
                  >
                    <X className="w-5 h-5" /> Reject
                  </button>
                </div>
              </div>
            )}

            {/* IN_PROGRESS: Resolve */}
            {complaint.status === "IN_PROGRESS" && (
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 mb-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-[#DDF8F5] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#0F8A83]" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800">Complaint Actions</h3>
                </div>
                <button
                  disabled={updating}
                  onClick={() => setShowResolveModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#0F8A83] hover:bg-[#0D7D76] text-white rounded-2xl py-4 text-sm font-bold shadow-md shadow-[#0F8A83]/20 disabled:opacity-50 transition-all hover:-translate-y-0.5"
                >
                  <Check className="w-5 h-5" /> Resolve Complaint
                </button>
              </div>
            )}
          </>
        )}

        {/* Citizen Actions — Feedback & Reopen */}
        {user?.role === "CITIZEN" && ["CLOSED", "RESOLVED"].includes(complaint.status) && (
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 mb-6">
            <h3 className="text-lg font-black text-slate-800 mb-4">Provide Feedback</h3>
            
            {!complaint.feedback?.rating ? (
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                      <svg className={`w-8 h-8 ${rating >= star ? 'text-amber-500' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <textarea 
                  value={feedback} 
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write your feedback..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={3}
                />
                <button
                  disabled={updating}
                  onClick={handleSubmitFeedback}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  Submit Feedback
                </button>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-sm font-bold text-amber-800">Feedback Submitted ({complaint.feedback.rating}/5)</p>
                <p className="text-sm text-amber-700 mt-1">{complaint.feedback.comments}</p>
              </div>
            )}

            <div className="border-t border-slate-100 pt-6 mt-2">
              <h3 className="text-lg font-black text-slate-800 mb-4">Not Satisfied?</h3>
              <textarea 
                value={reopenReason} 
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="Reason for reopening..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
              />
              <button
                disabled={updating}
                onClick={handleReopen}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                Reopen Complaint
              </button>
            </div>
          </div>
        )}

        {/* Notes Modal */}
        {showNotesModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-border animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-black text-foreground mb-6">Add Note</h3>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full h-32 bg-muted/30 border-2 border-border rounded-2xl p-5 text-sm font-medium text-foreground mb-6 focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                placeholder="Type your observations..."
              />
              <div className="flex gap-4">
                <button onClick={() => setShowNotesModal(false)} className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-bold py-3.5 rounded-2xl transition-colors">Cancel</button>
                <button disabled={updating || !newNote} onClick={addNote} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-2xl shadow-md shadow-primary/20 disabled:opacity-50 transition-colors">Save Note</button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Confirmation Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-border animate-in fade-in zoom-in duration-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl font-black text-foreground">Reject Complaint</h3>
              </div>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-4">
                Please provide a detailed reason for rejecting this complaint. This will be visible to the citizen.
              </p>
              
              <div className="mb-8">
                <label className="block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase">Reason (Required)</label>
                <textarea 
                  value={rejectReason} 
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="E.g., Issue not found at location, duplicate complaint..."
                  className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                />
              </div>

              <div className="flex gap-4">
                <button
                  disabled={updating}
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-bold py-3.5 rounded-2xl disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={updating || !rejectReason.trim()}
                  onClick={handleRejectConfirm}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-red-500/20 disabled:opacity-50 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resolve Confirmation Modal */}
        {showResolveModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-border animate-in fade-in zoom-in duration-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-black text-foreground">Mark Resolved</h3>
              </div>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">
                Have you verified that the issue has been successfully resolved?
              </p>
              
              <div className="mb-8">
                <label className="block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase">Proof Images (Required)</label>
                <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors relative cursor-pointer group">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      if (e.target.files) {
                        setSelectedProofImages([...selectedProofImages, ...Array.from(e.target.files)]);
                      }
                    }}
                  />
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                     <FileText className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Tap or drag images here</p>
                </div>
                
                {selectedProofImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedProofImages.map((file, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-border group shadow-sm">
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedProofImages(selectedProofImages.filter((_, index) => index !== i));
                          }}
                          className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  disabled={updating}
                  onClick={() => setShowResolveModal(false)}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-bold py-3.5 rounded-2xl disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={updating}
                  onClick={handleResolveConfirm}
                  className="flex-1 bg-[#0F8A83] hover:bg-[#0D7D76] text-white font-bold py-3.5 rounded-2xl shadow-md shadow-[#0F8A83]/20 disabled:opacity-50 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Image Preview Modal */}
        <ImageLightbox
          imageUrl={selectedImagePreview}
          onClose={() => setSelectedImagePreview(null)}
        />

      </div>
    </div>
  );
}
