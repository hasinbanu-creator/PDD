"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import authService from "@/services/auth";
import {
  FlaskConical,
  Search,
  MapPin,
  ChevronRight,
  ClipboardList,
  AlertCircle,
  Activity,
  CheckCircle2,
  Clock,
  Wrench,
  Eye,
  Settings,
  Users,
  Map,
  ShieldCheck,
  Building2,
  FileText,
  User
} from "lucide-react";
import { useComplaints, useWardComplaints } from "@/hooks/use-complaints";
import { useInspectorDashboard, useAdminDashboard, useWorkerDashboard } from "@/hooks/use-dashboard";
import api from "@/lib/api";


type ComplaintStatus = "OPEN" | "PENDING" | "WORKING" | "IN_PROGRESS" | "APPROVAL" | "CLOSED" | "RESOLVED" | "REJECTED";
type ComplaintType = "ROAD_DAMAGE" | "POTHOLE" | "GARBAGE" | "STREETLIGHT" | "WATER_SUPPLY" | "DRAINAGE" | "SANITATION" | "TREE_CUTTING" | "CONSTRUCTION" | "OTHER";

const getCleanDistrict = (c: any, districts?: any[]) => {
  const val = c.districtName || c.district_name || c.district?.name || c.district;
  if (typeof val === "string" && val.trim()) {
    if (/^[0-9a-fA-F]{24}$/.test(val) && districts) {
      const match = districts.find(d => (d._id || d.id) === val);
      return match ? match.name : "Not Available";
    }
    return val;
  }
  return "Not Available";
};

const getCleanWard = (c: any) => {
  const val = c.wardName || c.ward_name || c.ward?.ward_name || c.ward?.name || c.ward;
  if (typeof val === "string" && val.trim() && !/^[0-9a-fA-F]{24}$/.test(val)) return val;
  if (c.ward && typeof c.ward === "object") {
    return c.ward.ward_name || c.ward.name || (c.ward.ward_number != null ? `Ward #${c.ward.ward_number}` : "Not Available");
  }
  return "Not Available";
};

// Mock Data / Styles - Updated with premium tokens
const STATUS_STYLES: Record<ComplaintStatus, { label: string; color: string; bg: string }> = {
  OPEN: { label: "Pending", color: "text-accent", bg: "bg-accent/10" },
  PENDING: { label: "Pending", color: "text-accent", bg: "bg-accent/10" },
  WORKING: { label: "In Progress", color: "text-primary", bg: "bg-primary/10" },
  IN_PROGRESS: { label: "In Progress", color: "text-primary", bg: "bg-primary/10" },
  APPROVAL: { label: "Review", color: "text-secondary", bg: "bg-secondary/10" },
  CLOSED: { label: "Resolved", color: "text-success", bg: "bg-success/10" },
  RESOLVED: { label: "Resolved", color: "text-success", bg: "bg-success/10" },
  REOPENED: { label: "Reopened", color: "text-amber-600", bg: "bg-amber-500/10" },
  REJECTED: { label: "Rejected", color: "text-destructive", bg: "bg-destructive/10" },
};

const TYPE_META: Record<ComplaintType, { icon: React.ElementType; color: string; bg: string; title: string }> = {
  ROAD_DAMAGE: { icon: Map, color: "text-destructive", bg: "bg-destructive/10", title: "Road Damage" },
  POTHOLE: { icon: Map, color: "text-destructive", bg: "bg-destructive/10", title: "Pothole" },
  GARBAGE: { icon: ClipboardList, color: "text-secondary", bg: "bg-secondary/10", title: "Waste Collection" },
  STREETLIGHT: { icon: AlertCircle, color: "text-primary", bg: "bg-primary/10", title: "Street Light" },
  WATER_SUPPLY: { icon: Activity, color: "text-primary", bg: "bg-primary/10", title: "Water Supply" },
  DRAINAGE: { icon: Wrench, color: "text-secondary", bg: "bg-secondary/10", title: "Drainage" },
  SANITATION: { icon: ClipboardList, color: "text-secondary", bg: "bg-secondary/10", title: "Sanitation" },
  TREE_CUTTING: { icon: MapPin, color: "text-success", bg: "bg-success/10", title: "Tree Issue" },
  CONSTRUCTION: { icon: Wrench, color: "text-accent", bg: "bg-accent/10", title: "Construction" },
  OTHER: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", title: "Civic Issue" },
};

const ROLE_META: Record<string, { label: string; color: string; bg: string; gradient: string }> = {
  SUPER_ADMIN: { label: "Super Admin", color: "text-primary", bg: "bg-primary/20", gradient: "from-primary to-slate-900" },
  DISTRICT_ADMIN: { label: "District Admin", color: "text-secondary", bg: "bg-secondary/20", gradient: "from-secondary to-indigo-900" },
  INSPECTOR: { label: "Inspector", color: "text-[#0F8A83]", bg: "bg-[#DDF8F5]", gradient: "from-[#0F8A83] to-[#0B6E69]" },
  WORKER: { label: "Worker", color: "text-success", bg: "bg-success/20", gradient: "from-success to-slate-900" },
  CITIZEN: { label: "Citizen", color: "text-accent", bg: "bg-accent/20", gradient: "from-primary to-slate-900" },
};

const ROLE_GREETING: Record<string, { title: string; sub: string }> = {
  SUPER_ADMIN: { title: "Civifix", sub: "Super Admin Panel" },
  DISTRICT_ADMIN: { title: "Civifix", sub: "District Admin Panel" },
  INSPECTOR: { title: "Civifix", sub: "Inspector Dashboard" },
  WORKER: { title: "Civifix", sub: "Worker Dashboard" },
  CITIZEN: { title: "Civifix", sub: "Citizen Platform" },
};

// --- Shared Components ---
function SectionTitle({ left, right, rightHref }: { left: string; right?: string; rightHref?: string }) {
  return (
    <div className="flex justify-between items-center mt-8 mb-5 px-1">
      <h3 className="text-base font-bold text-foreground">{left}</h3>
      {right && rightHref && (
        <Link href={rightHref} className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          {right}
        </Link>
      )}
    </div>
  );
}

function MetricCard({ icon: Icon, value, label, colorClass, bgClass }: any) {
  return (
    <div className="flex-1 bg-card rounded-2xl p-5 flex flex-col items-center justify-center border border-border shadow-sm hover:shadow-md transition-all duration-300 min-h-[110px] hover:-translate-y-1">
      <div className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center mb-3`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <p className="text-2xl font-black text-foreground">{value}</p>
      <p className="text-xs font-semibold text-muted-foreground text-center mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function ComplaintItem({ complaint, index, total }: any) {
  const { user, districtsList } = useAuth();
  const isInspector = user?.role === "INSPECTOR" || user?.role === "WORKER";

  const type = (complaint.complaint_type as ComplaintType) || "OTHER";
  const meta = TYPE_META[type] || TYPE_META.OTHER;
  const status = STATUS_STYLES[complaint.status as ComplaintStatus] || STATUS_STYLES.OPEN;
  const title = complaint.title || complaint.type || meta.title;
  const desc = complaint.description || "No description provided";
  const Icon = meta.icon;

  const districtName = getCleanDistrict(complaint, districtsList);
  const wardName = getCleanWard(complaint);
  const citizenName = complaint.citizenName || complaint.citizen_name || complaint.citizen?.name || "Not Available";

  return (
    <Link
      href={`/complaints/${complaint.id || complaint._id || complaint.complaint_id}`}
      className={`flex items-start p-5 hover:bg-muted/50 transition-colors duration-200 ${index !== total - 1 ? 'border-b border-border/50' : ''}`}
    >
      <div className={`w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center mr-4 shrink-0 mt-1 shadow-sm`}>
        <Icon className={`w-6 h-6 ${meta.color}`} />
      </div>
      <div className="flex-1 min-w-0 mr-4">
        <h4 className="text-base font-bold text-foreground">{title}</h4>
        <p className="text-sm font-medium text-muted-foreground mt-1 whitespace-pre-line">{desc}</p>
        
        <div className="text-xs space-y-1.5 bg-muted/40 p-2.5 rounded-xl border border-border/50 mt-2">
          <div>
            <span className="font-bold text-muted-foreground">Raised By :</span>{" "}
            <span className="font-semibold text-foreground">{citizenName}</span>
          </div>
          <div>
            <span className="font-bold text-muted-foreground">District :</span>{" "}
            <span className="font-semibold text-foreground">{districtName}</span>
          </div>
          <div>
            <span className="font-bold text-muted-foreground">Ward :</span>{" "}
            <span className="font-semibold text-foreground">{wardName}</span>
          </div>
          <div className="whitespace-pre-line">
            <span className="font-bold text-muted-foreground">Address :</span>{" "}
            <span className="font-semibold text-foreground">{complaint.address || "Not Available"}</span>
          </div>
          <div className="whitespace-pre-line">
            <span className="font-bold text-muted-foreground">Landmark :</span>{" "}
            <span className="font-semibold text-foreground">{complaint.landmark || "Not Available"}</span>
          </div>
        </div>
        
        <div className="text-xs font-bold text-muted-foreground mt-2">
          Complaint ID :
        </div>
        <div className="text-xs font-semibold text-foreground mt-0.5 break-all">
          {complaint.complaint_id || complaint.complaintId || complaint._id || "Not Available"}
        </div>
      </div>
      <div className="flex flex-col items-end gap-3 shrink-0">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
          {status.label}
        </span>
        {isInspector && (() => {
          const rawPriority = (complaint.ai?.priority_prediction?.priority || complaint.ai_priority?.priority || complaint.final_priority || complaint.priority || "MEDIUM").toUpperCase();
          const badgeText = rawPriority === "HIGH" ? "🔴 High" :
                            rawPriority === "MEDIUM" ? "🟡 Medium" :
                            rawPriority === "LOW" ? "🟢 Low" : rawPriority;
          const bgClass = rawPriority === "HIGH" ? "bg-red-500/10 text-red-600 border border-red-200" :
                          rawPriority === "MEDIUM" ? "bg-yellow-500/10 text-yellow-600 border border-yellow-200" :
                          rawPriority === "LOW" ? "bg-green-500/10 text-green-600 border border-green-200" : "bg-muted text-muted-foreground";
          return (
            <span className={`px-3 py-1 rounded-full text-xs font-black ${bgClass}`}>
              {badgeText}
            </span>
          );
        })()}
        <ChevronRight className="w-5 h-5 text-muted-foreground mt-auto" />
      </div>
    </Link>
  );
}

function QuickActionBtn({ icon: Icon, title, colorClass, bgClass, href }: any) {
  return (
    <Link
      href={href}
      className="flex-1 min-h-[100px] rounded-2xl bg-card border border-border flex flex-col items-center justify-center p-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-full ${bgClass} flex items-center justify-center mb-3`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <p className="text-xs leading-snug font-bold text-foreground text-center whitespace-pre-line">
        {title}
      </p>
    </Link>
  );
}

// --- Dashboards ---

function CitizenDashboard() {
  const { data: rawData, isLoading: loading } = useComplaints({ page: 1, limit: 10 });
  const data: any = rawData;
  const complaints = data?.data || [];

  const counts = useMemo(() => {
    if (data?.meta?.status_counts) {
      return {
        open: data.meta.status_counts.OPEN || 0,
        active: (data.meta.status_counts.WORKING || 0) + (data.meta.status_counts.APPROVAL || 0),
        closed: data.meta.status_counts.CLOSED || 0,
        rejected: data.meta.status_counts.REJECTED || 0,
      };
    }
    return {
      open: complaints.filter((c: any) => c.status === "OPEN").length,
      active: complaints.filter((c: any) => ["WORKING", "APPROVAL"].includes(c.status)).length,
      closed: complaints.filter((c: any) => c.status === "CLOSED").length,
      rejected: complaints.filter((c: any) => c.status === "REJECTED").length,
    };
  }, [complaints, data]);

  const total = counts.open + counts.active + counts.closed + counts.rejected || 1;
  const openPct = (counts.open / total) * 100;
  const activePct = (counts.active / total) * 100;
  const closedPct = (counts.closed / total) * 100;
  const rejectedPct = (counts.rejected / total) * 100;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Profile Stats Row */}
      <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 shadow-md border border-border mb-8 mt-[-3rem] relative z-10 mx-4 md:mx-0">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center border-r border-border">
            <p className="text-3xl font-black text-accent">{counts.open}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Pending</p>
          </div>
          <div className="text-center border-r border-border">
            <p className="text-3xl font-black text-primary">{counts.active}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Active</p>
          </div>
          <div className="text-center border-r border-border">
            <p className="text-3xl font-black text-success">{counts.closed}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Resolved</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-destructive">{counts.rejected}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Rejected</p>
          </div>
        </div>

        {/* Simple Progress Bar Chart */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-foreground">Complaint Progress</span>
            <span className="text-xs font-semibold text-muted-foreground">{total > 1 ? total : 0} Total</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: `${openPct}%` }} className="bg-accent transition-all duration-1000"></div>
            <div style={{ width: `${activePct}%` }} className="bg-primary transition-all duration-1000"></div>
            <div style={{ width: `${closedPct}%` }} className="bg-success transition-all duration-1000"></div>
            <div style={{ width: `${rejectedPct}%` }} className="bg-destructive transition-all duration-1000"></div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-0">
        <SectionTitle left="Quick Actions" />
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <QuickActionBtn icon={FlaskConical} title="Raise\nComplaint" colorClass="text-primary" bgClass="bg-primary/10" href="/complaints/create" />
          <QuickActionBtn icon={Search} title="Track\nStatus" colorClass="text-secondary" bgClass="bg-secondary/10" href="/complaints" />
          <QuickActionBtn icon={User} title="Profile" colorClass="text-muted-foreground" bgClass="bg-muted" href="/profile" />
        </div>

        <SectionTitle left="My Complaints" right="View All" rightHref="/complaints" />
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden mb-8">
          {loading ? (
            <div className="p-10 flex justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-base font-bold text-foreground">No complaints found</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">You haven&apos;t raised any complaints yet.</p>
            </div>
          ) : (
            complaints.map((c: any, i: number) => (
              <ComplaintItem key={c._id || c.id} complaint={c} index={i} total={complaints.length} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const DISTRICTS = [
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kanchipuram",
  "Kanyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Mayiladuthurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivagangai",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar"
];

function InspectorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [districtsList, setDistrictsList] = useState<any[]>([]);
  const [wardsList, setWardsList] = useState<any[]>([]);

  // Fetch districts on mount
  useEffect(() => {
    api.get("/admin/districts?active_only=false").then((res: any) => {
      const data = res?.data?.data ?? res?.data ?? [];
      setDistrictsList(data);
    }).catch(err => console.error("Failed to load districts:", err));
  }, []);

  // Fetch wards dynamically when district changes
  useEffect(() => {
    if (selectedDistrict === "all") {
      setWardsList([]);
      setSelectedWard("all");
      return;
    }
    const distObj = districtsList.find((d: any) => d.name === selectedDistrict);
    const distId = distObj ? distObj._id : selectedDistrict;

    api.get(`/wards?district_id=${distId}&limit=200`).then((res: any) => {
      const unwrapped = res?.data?.data ?? res?.data ?? {};
      const list = Array.isArray(unwrapped) ? unwrapped : (unwrapped.data || []);
      setWardsList(list);
      setSelectedWard("all");
    }).catch(err => {
      console.error("Failed to load wards for district:", err);
      setWardsList([]);
      setSelectedWard("all");
    });
  }, [selectedDistrict, districtsList]);

  const { data: rawRes, isLoading: isLoadingComplaints, refetch } = useWardComplaints({
    district: selectedDistrict === "all" ? "" : selectedDistrict,
    limit: 100,
  });
  const res: any = rawRes;

  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const complaints = res?.complaints || res?.data || (Array.isArray(res) ? res : []) || [];

  // Client-side ward filtering
  const filteredByWard = useMemo(() => {
    if (selectedWard === "all") return complaints;
    return complaints.filter((c: any) => {
      const wardId = c.ward_id || c.wardId || (c.ward?._id ?? c.ward?.id);
      const wardName = getCleanWard(c);
      return wardId === selectedWard || wardName === selectedWard;
    });
  }, [complaints, selectedWard]);

  const stats = useMemo(() => {
    const total = filteredByWard.length;
    const pending = filteredByWard.filter((c: any) => ["OPEN", "PENDING"].includes(c.status)).length;
    const in_progress = filteredByWard.filter((c: any) => ["IN_PROGRESS", "WORKING", "ACCEPTED", "FIELD_VISIT", "APPROVAL"].includes(c.status)).length;
    const resolved = filteredByWard.filter((c: any) => ["RESOLVED", "CLOSED"].includes(c.status)).length;
    const rejected = filteredByWard.filter((c: any) => c.status === "REJECTED").length;
    return { total, pending, in_progress, resolved, rejected };
  }, [filteredByWard]);

  const refreshData = () => {
    refetch();
  };

  const filteredComplaints = useMemo(() => {
    return filteredByWard.filter((c: any) => {
      if (statusFilter !== "All") {
        if (statusFilter === "Pending" && !["OPEN", "PENDING"].includes(c.status)) return false;
        if (statusFilter === "In Progress" && !["IN_PROGRESS", "WORKING", "ACCEPTED", "FIELD_VISIT", "APPROVAL"].includes(c.status)) return false;
        if (statusFilter === "Resolved" && !["RESOLVED", "CLOSED"].includes(c.status)) return false;
        if (statusFilter === "Rejected" && c.status !== "REJECTED") return false;
      }
      if (priorityFilter !== "All") {
        const rawP = (c.ai?.priority_prediction?.priority || c.ai_priority?.priority || c.final_priority || c.priority || "MEDIUM").toUpperCase();
        if (rawP !== priorityFilter.toUpperCase()) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const idMatch = (c.complaint_id || c.complaintId || c._id || "").toLowerCase().includes(q);
        const typeMatch = (c.complaint_type || "").toLowerCase().includes(q);
        const nameMatch = (c.citizen?.name || "").toLowerCase().includes(q);
        const districtName = getCleanDistrict(c, districtsList).toLowerCase();
        const wardName = getCleanWard(c).toLowerCase();
        const addressText = (c.address || "").toLowerCase();
        const landmarkText = (c.landmark || "").toLowerCase();

        if (!idMatch && !typeMatch && !nameMatch && !districtName.includes(q) && !wardName.includes(q) && !addressText.includes(q) && !landmarkText.includes(q)) return false;
      }
      return true;
    });
  }, [filteredByWard, statusFilter, priorityFilter, searchQuery]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Stats Row (Teal Theme) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 mt-[-3rem] relative z-10 mx-4 md:mx-0 flex flex-wrap items-center justify-between">
        {[
          { label: "Total", value: stats.total || 0, filter: "All", color: "text-slate-800" },
          { label: "Pending", value: stats.pending || 0, filter: "Pending", color: "text-[#0F8A83]" },
          { label: "In Progress", value: stats.in_progress || 0, filter: "In Progress", color: "text-[#0D7D76]" },
          { label: "Resolved", value: stats.resolved || 0, filter: "Resolved", color: "text-[#0F8A83]" },
          { label: "Rejected", value: stats.rejected || 0, filter: "Rejected", color: "text-red-500" },
        ].map((s, idx) => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(s.filter)}
            className={`flex-1 text-center py-2 px-2 hover:bg-slate-50 rounded-xl transition-colors ${idx !== 4 ? 'border-r border-slate-100' : ''} ${statusFilter === s.filter ? 'ring-2 ring-[#8EE5DA] bg-[#DDF8F5]/50' : ''}`}
          >
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
          </button>
        ))}
      </div>
      <div className="px-4 md:px-0">
        {/* District and Ward selection and Search */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">District</h3>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-white text-slate-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F8A83] min-w-[200px] shadow-sm cursor-pointer"
              >
                <option value="all">All Districts</option>
                {DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ward</h3>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="bg-white text-slate-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F8A83] min-w-[200px] shadow-sm cursor-pointer"
              >
                <option value="all">All Wards</option>
                {wardsList.map((ward) => {
                  const wardId = ward._id || ward.id;
                  const label = ward.label || `${ward.ward_number} - ${ward.ward_name}`;
                  return (
                    <option key={wardId} value={wardId}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="relative flex-1 max-w-md mt-6 md:mt-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, type, location or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0F8A83] shadow-sm"
            />
          </div>
        </div>


        <div className="flex flex-wrap gap-2 mb-4">
          {["All", "Pending", "In Progress", "Resolved", "Rejected"].map(filter => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm flex items-center ${statusFilter === filter
                  ? "bg-[#0F8A83] text-white shadow-[#0F8A83]/30 ring-2 ring-[#8EE5DA] ring-offset-1"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
            >
              {filter}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-black ${statusFilter === filter ? 'bg-[#0B6E69] text-[#DDF8F5]' : 'bg-slate-100 text-slate-500'}`}>
                {filter === "All" ? stats.total : filter === "Pending" ? stats.pending : filter === "In Progress" ? stats.in_progress : filter === "Resolved" ? stats.resolved : stats.rejected}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100/80">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2">Priority Filter:</span>
          {["All", "High", "Medium", "Low"].map(pFilter => (
            <button
              key={pFilter}
              onClick={() => setPriorityFilter(pFilter)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border ${priorityFilter === pFilter
                  ? "bg-purple-600 text-white border-purple-600 shadow-purple-600/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
            >
              {pFilter}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">            <h3 className="text-lg font-bold text-slate-800">
              {selectedDistrict === "all"
                ? "All Complaints"
                : selectedWard === "all"
                ? `Complaints in ${selectedDistrict}`
                : `Complaints in ${selectedDistrict} - Ward ${
                    wardsList.find((w: any) => (w._id || w.id) === selectedWard)?.label ||
                    wardsList.find((w: any) => (w._id || w.id) === selectedWard)?.ward_name ||
                    "Selected Ward"
                  }`}
            </h3>
            <button onClick={() => refreshData()} className="text-[#0F8A83] hover:text-[#0D7D76] text-sm font-bold flex items-center gap-2 transition-colors">
              Refresh <Activity className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-50/50">
                  <th className="p-5">ID</th>
                  <th className="p-5">User</th>
                  <th className="p-5">Type & Title</th>
                  <th className="p-5">Location</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingComplaints ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center">
                      <div className="w-8 h-8 border-4 border-[#0F8A83] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ClipboardList className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-base font-bold text-slate-700">
                        {selectedDistrict && selectedDistrict !== "all"
                          ? selectedWard !== "all"
                            ? "No complaints found for this ward."
                            : "No complaints found for this district."
                          : "No complaints found"}
                      </p>
                      <p className="text-sm font-medium text-slate-500 mt-1">Try adjusting your filters or search query.</p>
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c: any) => {
                    const statusStyles = STATUS_STYLES[c.status as ComplaintStatus] || STATUS_STYLES.OPEN;
                    const typeMeta = TYPE_META[(c.complaint_type as ComplaintType)] || TYPE_META.OTHER;

                    return (
                      <tr
                        key={c.id || c._id || c.complaint_id}
                        onClick={() => router.push(`/complaints/${c.id || c._id || c.complaint_id}`)}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group cursor-pointer bg-white"
                      >
                        <td className="p-5 align-middle max-w-[200px]">
                          <p className="text-[13px] font-bold text-slate-800 break-words leading-relaxed whitespace-normal">{c.complaint_id || "#CIV-NEW"}</p>
                        </td>
                        <td className="p-5 align-middle">
                          <p className="text-[13px] font-bold text-slate-700">{c.citizen?.name || c.citizenName || c.citizen_name || "Citizen"}</p>
                        </td>
                        <td className="p-5 align-middle">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full ${typeMeta.bg} flex items-center justify-center shrink-0`}>
                              <typeMeta.icon className={`w-5 h-5 ${typeMeta.color}`} />
                            </div>
                            <div>
                              <span className="block text-[13px] font-black text-slate-900 uppercase tracking-wide">{typeMeta.title}</span>
                              <span className="block text-xs font-medium text-slate-500 mt-0.5">{typeMeta.title}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 align-middle">
                          <div className="text-[13px] space-y-0.5 min-w-[280px] max-w-[380px] text-slate-600">
                            <p className="whitespace-normal break-words">
                              <span className="font-bold text-slate-500">District:</span>
                              <span className="font-semibold text-slate-700 ml-1">{getCleanDistrict(c, districtsList)}</span>
                            </p>
                            <p className="whitespace-normal break-words">
                              <span className="font-bold text-slate-500">Ward:</span>
                              <span className="font-semibold text-slate-700 ml-1">{getCleanWard(c)}</span>
                            </p>
                            <p className="truncate">
                              <span className="font-bold text-slate-500">Address:</span>
                              <span className="font-semibold text-slate-700 ml-1">{c.address || "Not Available"}</span>
                            </p>
                            <p className="truncate">
                              <span className="font-bold text-slate-500">Landmark:</span>
                              <span className="font-semibold text-slate-700 ml-1">{c.landmark || "Not Available"}</span>
                            </p>
                          </div>
                        </td>
                        <td className="p-5 align-middle">
                          <p className="text-[13px] font-bold text-slate-600">
                            {c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "N/A"}
                          </p>
                        </td>
                        <td className="p-5 align-middle">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${statusStyles.bg} ${statusStyles.color}`}>
                              {statusStyles.label}
                            </span>
                            {(() => {
                              const rawPriority = (c.ai?.priority_prediction?.priority || c.ai_priority?.priority || c.final_priority || c.priority || "MEDIUM").toUpperCase();
                              const badgeText = rawPriority === "HIGH" ? "🔴 High" :
                                                rawPriority === "MEDIUM" ? "🟡 Medium" :
                                                rawPriority === "LOW" ? "🟢 Low" : rawPriority;
                              const bgClass = rawPriority === "HIGH" ? "bg-red-500/10 text-red-600 border border-red-200" :
                                              rawPriority === "MEDIUM" ? "bg-yellow-500/10 text-yellow-600 border border-yellow-200" :
                                              rawPriority === "LOW" ? "bg-green-500/10 text-green-600 border border-green-200" : "bg-slate-100 text-slate-500 border border-slate-200/60";
                              return (
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${bgClass}`}>
                                  {badgeText}
                                </span>
                              );
                            })()}
                          </div>
                        </td>
                        <td className="p-5 text-right align-middle">
                          <Link href={`/complaints/${c.id || c._id || c.complaint_id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-base font-bold text-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 md:px-0">
      <SectionTitle left="Quick Actions" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <QuickActionBtn icon={Building2} title="Create\nDistrict" colorClass="text-primary" bgClass="bg-primary/10" href="/settings/district/create" />
        <QuickActionBtn icon={Users} title="Create\nInspector" colorClass="text-[#7C3AED]" bgClass="bg-[#7C3AED]/10" href="/settings/inspector/create" />
        <QuickActionBtn icon={Wrench} title="Create\nWorker" colorClass="text-[#059669]" bgClass="bg-[#059669]/10" href="/settings/worker/create" />
        <QuickActionBtn icon={FileText} title="Reports" colorClass="text-accent" bgClass="bg-accent/10" href="/reports" />
      </div>

      <SectionTitle left="District Overview" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={Map} value={data.stats?.total_wards || 0} label="Wards" colorClass="text-primary" bgClass="bg-primary/10" />
        <MetricCard icon={Users} value={data.stats?.total_inspectors || 0} label="Inspectors" colorClass="text-secondary" bgClass="bg-secondary/10" />
        <MetricCard icon={FileText} value={data.stats?.total_complaints || 0} label="Complaints" colorClass="text-accent" bgClass="bg-accent/10" />
        <MetricCard icon={CheckCircle2} value={data.stats?.resolved_complaints || 0} label="Resolved" colorClass="text-success" bgClass="bg-success/10" />
      </div>
    </div>
  );
}

function WorkerDashboard() {
  const { data, isLoading: loading } = useWorkerDashboard();
  const dashboard = data?.data || data || null;

  const tasks = dashboard?.assigned_tasks || {};
  const assignments = dashboard?.recent_assignments || [];
  const completionRate = dashboard?.completion_rate || 0;

  const stats = {
    total: tasks.total || 0,
    pending: tasks.pending || 0,
    completed: tasks.completed || 0,
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 mt-[-3rem] relative z-10 mx-4 md:mx-0 flex flex-wrap items-center justify-between">
        <div className="flex-1 text-center py-2 px-2 border-r border-slate-100">
          <p className="text-3xl font-black text-slate-800">{stats.total}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total</p>
        </div>
        <div className="flex-1 text-center py-2 px-2 border-r border-slate-100">
          <p className="text-3xl font-black text-[#D97706]">{stats.pending}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Pending</p>
        </div>
        <div className="flex-1 text-center py-2 px-2">
          <p className="text-3xl font-black text-[#059669]">{stats.completed}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Done</p>
        </div>
      </div>

      <div className="px-4 md:px-0">
        <SectionTitle left="My Tasks" />
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          <MetricCard icon={ClipboardList} value={stats.total} label="Assigned" colorClass="text-primary" bgClass="bg-primary/10" />
          <MetricCard icon={Wrench} value={stats.pending} label="Pending" colorClass="text-[#D97706]" bgClass="bg-[#FEF3C7]" />
          <MetricCard icon={CheckCircle2} value={stats.completed} label="Completed" colorClass="text-[#059669]" bgClass="bg-[#D1FAE5]" />
        </div>

        {completionRate > 0 && (
          <>
            <SectionTitle left="Performance" />
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-muted-foreground">Completion Rate</span>
                <span className="text-xl font-bold text-primary">{completionRate}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div style={{ width: `${completionRate}%` }} className="h-full bg-primary transition-all duration-1000"></div>
              </div>
            </div>
          </>
        )}

        <SectionTitle left="Recent Assignments" right="View All" rightHref="/complaints" />
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden mb-8">
          {loading ? (
            <div className="p-10 flex justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : assignments.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-base font-bold text-foreground">No tasks assigned</p>
            </div>
          ) : (
            assignments.map((c: any, i: number) => (
              <ComplaintItem key={c._id || c.id || c.complaint_id} complaint={c} index={i} total={assignments.length} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role || "CITIZEN";
  const roleMeta = ROLE_META[role] || ROLE_META.CITIZEN;
  const greeting = ROLE_GREETING[role] || ROLE_GREETING.CITIZEN;

  return (
    <div className="flex-1 bg-background relative pb-20 md:pb-8">
      {/* Dynamic Header Gradient */}
      <div className={`bg-gradient-to-br ${roleMeta.gradient} pt-12 pb-24 px-6 md:px-12 md:rounded-b-[60px] rounded-b-[40px] shadow-lg`}>
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-wide">{greeting.title}</h1>
                <p className="text-sm font-semibold text-white/80 mt-1">{greeting.sub}</p>
              </div>
            </div>
          </div>

          {/* User Greeting */}
          <div className="mt-8 flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-4 border-white/30 shadow-xl">
              <span className="text-3xl font-black text-white">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white mb-1">{user?.name || "Welcome Back"}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black ${roleMeta.bg} ${roleMeta.color} border border-white/10`}>
                  {roleMeta.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Role-based Dashboard Content */}
      <div className="max-w-7xl mx-auto w-full md:px-12">
        {role === "CITIZEN" && <CitizenDashboard />}
        {role === "INSPECTOR" && <InspectorDashboard />}
        {role === "WORKER" && <WorkerDashboard />}
        {(role === "SUPER_ADMIN" || role === "DISTRICT_ADMIN") && <AdminDashboard />}
      </div>
    </div>
  );
}
