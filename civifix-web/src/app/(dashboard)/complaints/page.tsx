"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useComplaints, useWardComplaints, useAssignedComplaints } from "@/hooks/use-complaints";
import { useWards } from "@/hooks/use-wards";
import api from "@/lib/api";
import {
  Search,
  Plus,
  ClipboardList,
  Clock,
  FolderOpen,
  Wrench,
  CheckCircle2,
  XCircle,
  Map,
  Activity,
  TreePine,
  AlertCircle,
  ChevronRight,
  Filter,
  Trash2,
  Lightbulb
} from "lucide-react";

type ComplaintStatus = "OPEN" | "WORKING" | "APPROVAL" | "CLOSED" | "REJECTED" | "IN_PROGRESS" | "RESOLVED";
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

const FILTERS = [
  { key: "ALL", label: "All", icon: ClipboardList },
  { key: "PENDING", label: "Pending", icon: FolderOpen },
  { key: "IN_PROGRESS", label: "In Progress", icon: Wrench },
  { key: "REOPENED", label: "Reopened", icon: AlertCircle },
  { key: "RESOLVED", label: "Resolved", icon: CheckCircle2 },
  { key: "REJECTED", label: "Rejected", icon: XCircle },
];

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  OPEN: { label: "Pending", color: "text-accent", bg: "bg-accent/10" },
  PENDING: { label: "Pending", color: "text-accent", bg: "bg-accent/10" },
  WORKING: { label: "In Progress", color: "text-primary", bg: "bg-primary/10" },
  IN_PROGRESS: { label: "In Progress", color: "text-primary", bg: "bg-primary/10" },
  ASSIGNED: { label: "Assigned", color: "text-primary", bg: "bg-primary/10" },
  APPROVAL: { label: "Review", color: "text-secondary", bg: "bg-secondary/10" },
  CLOSED: { label: "Resolved", color: "text-success", bg: "bg-success/10" },
  RESOLVED: { label: "Resolved", color: "text-success", bg: "bg-success/10" },
  REOPENED: { label: "Reopened", color: "text-amber-600", bg: "bg-amber-500/10" },
  REJECTED: { label: "Rejected", color: "text-destructive", bg: "bg-destructive/10" },
};

const STATUS_GROUPS: Record<string, string[]> = {
  PENDING: ["OPEN", "PENDING"],
  IN_PROGRESS: ["WORKING", "IN_PROGRESS", "ASSIGNED", "APPROVAL"],
  RESOLVED: ["CLOSED", "RESOLVED"],
  REJECTED: ["REJECTED"]
};

const TYPE_META: Record<string, { icon: React.ElementType; color: string; bg: string; title: string }> = {
  ROAD_DAMAGE: { icon: Map, color: "text-destructive", bg: "bg-destructive/10", title: "Road Damage" },
  POTHOLE: { icon: Map, color: "text-destructive", bg: "bg-destructive/10", title: "Pothole" },
  GARBAGE: { icon: Trash2, color: "text-secondary", bg: "bg-secondary/10", title: "Waste Collection" },
  STREETLIGHT: { icon: Lightbulb, color: "text-primary", bg: "bg-primary/10", title: "Street Light" },
  WATER_SUPPLY: { icon: Activity, color: "text-primary", bg: "bg-primary/10", title: "Water Supply" },
  DRAINAGE: { icon: Wrench, color: "text-secondary", bg: "bg-secondary/10", title: "Drainage" },
  SANITATION: { icon: ClipboardList, color: "text-secondary", bg: "bg-secondary/10", title: "Sanitation" },
  TREE_CUTTING: { icon: TreePine, color: "text-success", bg: "bg-success/10", title: "Tree Issue" },
  CONSTRUCTION: { icon: Wrench, color: "text-accent", bg: "bg-accent/10", title: "Construction" },
  OTHER: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", title: "Civic Issue" },
};

export default function ComplaintsListPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const role = user?.role || "CITIZEN";

  const isCitizen = role === "CITIZEN";
  const isInspector = role === "INSPECTOR";
  const isWorker = role === "WORKER";
  const isAdmin = role === "SUPER_ADMIN" || role === "DISTRICT_ADMIN";
  const isPrivileged = isInspector || isWorker || isAdmin;

  const activeTabBorder = isPrivileged ? "border-[#0F8A83]" : "border-primary";
  const activeTabBg = isPrivileged ? "bg-[#0F8A83]" : "bg-primary";
  const activeTabShadow = isPrivileged ? "shadow-[#0F8A83]/20" : "shadow-primary/20";
  const activeBadgeBg = isPrivileged ? "bg-[#DDF8F5] text-[#0F8A83]" : "bg-primary-foreground/20 text-primary-foreground";

  // District/Ward Filters for Admins
  const [districtFilter, setDistrictFilter] = useState(
    role === "DISTRICT_ADMIN" ? (user?.district_id || user?.district || "") : ""
  );
  const [wardFilter, setWardFilter] = useState("");
  const [districts, setDistricts] = useState<any[]>([]);

  React.useEffect(() => {
    if (role === "SUPER_ADMIN") {
      api.get("/admin/districts?active_only=false").then((res: any) => {
        const list = res?.data?.data || res?.data || [];
        setDistricts(list);
      }).catch(err => console.error("Failed to load districts", err));
    }
  }, [role]);

  const { data: wardsData } = useWards(districtFilter);
  const wards = useMemo(() => {
    const rawWards = Array.isArray(wardsData) ? wardsData : wardsData?.data || [];
    return [...rawWards].sort((a: any, b: any) => {
      const numA = parseInt(a.ward_number, 10);
      const numB = parseInt(b.ward_number, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return (a.ward_name || "").localeCompare(b.ward_name || "");
    });
  }, [wardsData]);

  const queryParams = useMemo(() => {
    const params: any = { limit: 100 };
    if (isAdmin || isInspector) {
      if (districtFilter) params.district_id = districtFilter;
      if (wardFilter) params.ward_id = wardFilter;
    }
    return params;
  }, [isAdmin, isInspector, districtFilter, wardFilter]);

  const citizenQuery = useComplaints({ limit: 100 }, { enabled: isCitizen });
  const inspectorQuery = useWardComplaints(queryParams, { enabled: isInspector || isAdmin });
  const workerQuery = useAssignedComplaints({ limit: 100 }, { enabled: isWorker });

  const activeQuery = (isInspector || isAdmin) ? inspectorQuery : isWorker ? workerQuery : citizenQuery;
  const loading = activeQuery.isLoading;
  const data: any = activeQuery.data;

  // Memoize complaints to prevent unnecessary recalculations
  const complaints = useMemo(() => data?.complaints || data?.data || [], [data]);

  const counts = useMemo(() => {
    const acc: Record<string, number> = {
      ALL: complaints.length,
      PENDING: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      REJECTED: 0
    };

    complaints.forEach((c: any) => {
      const s = c.status || "OPEN";
      if (STATUS_GROUPS.PENDING.includes(s)) acc.PENDING++;
      else if (STATUS_GROUPS.IN_PROGRESS.includes(s)) acc.IN_PROGRESS++;
      else if (STATUS_GROUPS.RESOLVED.includes(s)) acc.RESOLVED++;
      else if (STATUS_GROUPS.REJECTED.includes(s)) acc.REJECTED++;
    });
    return acc;
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c: any) => {
      // 1. Status Filter
      if (activeFilter !== "ALL") {
        const allowedStatuses = STATUS_GROUPS[activeFilter] || [];
        if (!allowedStatuses.includes(c.status || "OPEN")) {
          return false;
        }
      }
      // 2. Search Term Filter
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        const type = c.complaint_type || "OTHER";
        const meta = TYPE_META[type] || TYPE_META.OTHER;
        const matchesTitle = (c.title || meta.title).toLowerCase().includes(term);
        const matchesDesc = (c.description || "").toLowerCase().includes(term);
        const matchesId = (c.complaint_id || c._id || "").toLowerCase().includes(term);
        const matchesAddress = (c.address || c.ward?.ward_name || "").toLowerCase().includes(term);
        const matchesDistrict = (c.districtName || c.district_name || "").toLowerCase().includes(term);
        const matchesWard = (c.wardName || c.ward_name || "").toLowerCase().includes(term);

        if (!matchesTitle && !matchesDesc && !matchesId && !matchesAddress && !matchesDistrict && !matchesWard) {
          return false;
        }
      }
      return true;
    });
  }, [complaints, activeFilter, searchTerm]);

  const summaryChips = [
    { label: "Total", value: counts.ALL, colorClass: "text-foreground" },
    { label: "Pending", value: counts.PENDING, colorClass: "text-accent" },
    { label: "Active", value: counts.IN_PROGRESS, colorClass: "text-primary" },
    { label: "Resolved", value: counts.RESOLVED, colorClass: "text-success" },
    { label: "Rejected", value: counts.REJECTED, colorClass: "text-destructive" },
  ];

  return (
    <div className="flex-1 bg-background min-h-screen pb-20 md:pb-8">

      {/* Header */}
      <div className={`${isPrivileged ? "bg-gradient-to-br from-[#0F8A83] to-[#0B6E69]" : "bg-primary"} pt-12 pb-16 px-6 md:px-12 md:rounded-b-[60px] rounded-b-[40px] shadow-lg flex items-center justify-between sticky top-0 z-20 md:static`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">My Complaints</h1>
            <p className="text-white/80 font-semibold mt-2">Track your civic issues</p>
          </div>
          {isCitizen && (
            <Link
              href="/complaints/create"
              className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shadow-sm"
            >
              <Plus className="w-6 h-6 text-white" />
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full -mt-8 relative z-10">

        {/* Summary Chips */}
        {!loading && complaints.length > 0 && (
          <div className="mx-6 md:mx-12 bg-card rounded-3xl flex shadow-md border border-border py-4 divide-x divide-border">
            {summaryChips.map(chip => (
              <div key={chip.label} className="flex-1 flex flex-col items-center justify-center">
                <span className={`text-2xl font-black ${chip.colorClass}`}>{chip.value}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 hidden sm:block">{chip.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Filter Tabs */}
        {!loading && complaints.length > 0 && (
          <div className="mt-8 px-6 md:px-12 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 pb-2">
              {FILTERS.map(f => {
                const isSelected = activeFilter === f.key;
                const count = counts[f.key] || 0;
                const Icon = f.icon;

                return (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 border-2 ${isSelected
                        ? `${activeTabBorder} ${activeTabBg} text-primary-foreground shadow-md ${activeTabShadow}`
                        : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-bold ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {f.label}
                    </span>
                    {count > 0 && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isSelected ? activeBadgeBg : 'bg-muted text-muted-foreground'
                        }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Bar & Result Count (Mobile) */}
        {!loading && complaints.length > 0 && (
          <div className="px-6 md:px-12 mt-6 mb-2 flex flex-col md:hidden gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 ${isPrivileged ? 'focus:ring-[#0F8A83]/50' : 'focus:ring-primary/50'}`}
              />
            </div>
            {isAdmin && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <select
                    value={districtFilter}
                    onChange={(e) => {
                      setDistrictFilter(e.target.value);
                      setWardFilter("");
                    }}
                    disabled={role === "DISTRICT_ADMIN"}
                    className="flex-1 bg-card border border-border rounded-xl text-sm font-bold text-foreground px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F8A83]/50 cursor-pointer disabled:opacity-60"
                  >
                    <option value="">All Districts</option>
                    {role === "DISTRICT_ADMIN" ? (
                      <option value={user?.district_id || (user?.district && /^[0-9a-fA-F]{24}$/.test(user.district) ? user.district : "")}>
                        {user?.district && !/^[0-9a-fA-F]{24}$/.test(user.district) ? user.district : (districts.find(d => (d._id || d.id) === (user?.district_id || user?.district))?.name || "My District")}
                      </option>
                    ) : (
                      districts.map(d => (
                        <option key={d._id || d.id} value={d._id || d.id}>{d.name}</option>
                      ))
                    )}
                  </select>

                  <select
                    value={wardFilter}
                    onChange={(e) => setWardFilter(e.target.value)}
                    className="flex-1 bg-card border border-border rounded-xl text-sm font-bold text-foreground px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F8A83]/50 cursor-pointer"
                  >
                    <option value="">All Wards</option>
                    {wards.map(w => (
                      <option key={w._id || w.id} value={w._id || w.id}>{w.ward_name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const response = await api.post(`/admin/complaints/export`, null, {
                        params: {
                          district_id: districtFilter,
                          ward_id: wardFilter,
                        },
                        responseType: 'blob',
                      });
                      const url = window.URL.createObjectURL(new Blob([response.data]));
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `complaints_export_${new Date().toISOString().slice(0, 10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      link.parentNode?.removeChild(link);
                    } catch (err) {
                      console.error("Export failed", err);
                      alert("Failed to export complaints");
                    }
                  }}
                  className="w-full py-3 bg-[#0F8A83] hover:bg-[#0D7D76] text-white text-sm font-black rounded-xl transition-all shadow-md shadow-[#0F8A83]/10"
                >
                  Export CSV
                </button>
              </div>
            )}
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-2">
              {filteredComplaints.length} {activeFilter === "ALL" ? "total" : activeFilter.toLowerCase().replace("_", " ")} complaints
            </p>
          </div>
        )}

        {/* Result Count (Desktop) */}
        {!loading && complaints.length > 0 && (
          <div className="hidden md:block px-6 md:px-12 mt-6 mb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {filteredComplaints.length} {activeFilter === "ALL" ? "total" : activeFilter.toLowerCase().replace("_", " ")} complaints
            </p>
          </div>
        )}

        {/* Complaint List */}
        <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12 mt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 col-span-full">
              <div className={`w-10 h-10 border-4 ${isPrivileged ? 'border-[#0F8A83]' : 'border-primary'} border-t-transparent rounded-full animate-spin`}></div>
              <p className="text-sm font-bold text-muted-foreground mt-4">Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center col-span-full">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <ClipboardList className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-2">No complaints yet</h3>
              <p className="text-sm font-semibold text-muted-foreground mb-8 max-w-md">
                {isCitizen
                  ? "Raise your first civic issue and follow its status right here."
                  : "No complaints have been assigned or registered in your scope yet."}
              </p>
              {isCitizen && (
                <Link
                  href="/complaints/create"
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-1"
                >
                  <Plus className="w-5 h-5" />
                  Raise a Complaint
                </Link>
              )}
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center col-span-full bg-card rounded-3xl border border-border shadow-sm">
              <Filter className="w-12 h-12 text-muted-foreground mb-6" />
              <p className="text-sm font-bold text-muted-foreground">No complaints match your criteria.</p>
              <button
                onClick={() => { setActiveFilter("ALL"); setSearchTerm(""); }}
                className={`${isPrivileged ? 'text-[#0F8A83]' : 'text-primary'} font-black text-sm mt-4 hover:underline`}
              >
                Clear filters and search
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Data Table */}
              <div className="hidden md:block col-span-full bg-card rounded-3xl shadow-sm border border-border overflow-hidden mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-border gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-2 bg-muted border border-border rounded-full text-sm font-semibold text-foreground focus:outline-none focus:ring-2 ${isPrivileged ? 'focus:ring-[#0F8A83]/50' : 'focus:ring-primary/50'} w-64`}
                      />
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-3">
                        <select
                          value={districtFilter}
                          onChange={(e) => {
                            setDistrictFilter(e.target.value);
                            setWardFilter("");
                          }}
                          disabled={role === "DISTRICT_ADMIN"}
                          className="bg-muted border border-border rounded-full text-xs font-bold text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F8A83]/50 cursor-pointer disabled:opacity-60"
                        >
                          <option value="">All Districts</option>
                           {role === "DISTRICT_ADMIN" ? (
                             <option value={user?.district_id || (user?.district && /^[0-9a-fA-F]{24}$/.test(user.district) ? user.district : "")}>
                               {user?.district && !/^[0-9a-fA-F]{24}$/.test(user.district) ? user.district : (districts.find(d => (d._id || d.id) === (user?.district_id || user?.district))?.name || "My District")}
                             </option>
                           ) : (
                            districts.map(d => (
                              <option key={d._id || d.id} value={d._id || d.id}>{d.name}</option>
                            ))
                          )}
                        </select>

                        <select
                          value={wardFilter}
                          onChange={(e) => setWardFilter(e.target.value)}
                          className="bg-muted border border-border rounded-full text-xs font-bold text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F8A83]/50 cursor-pointer"
                        >
                          <option value="">All Wards</option>
                          {wards.map(w => (
                            <option key={w._id || w.id} value={w._id || w.id}>{w.ward_name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <button
                      onClick={async () => {
                        try {
                          const response = await api.post(`/admin/complaints/export`, null, {
                            params: {
                              district_id: districtFilter,
                              ward_id: wardFilter,
                            },
                            responseType: 'blob',
                          });
                          const url = window.URL.createObjectURL(new Blob([response.data]));
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', `complaints_export_${new Date().toISOString().slice(0, 10)}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          link.parentNode?.removeChild(link);
                        } catch (err) {
                          console.error("Export failed", err);
                          alert("Failed to export complaints");
                        }
                      }}
                      className="px-5 py-2 bg-[#0F8A83] hover:bg-[#0D7D76] text-white text-xs font-extrabold rounded-full transition-all shadow-md shadow-[#0F8A83]/10"
                    >
                      Export CSV
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-bold uppercase tracking-wider">
                        <th className="p-4 pl-6 font-semibold">ID</th>
                        <th className="p-4 font-semibold">User</th>
                        <th className="p-4 font-semibold">Type & Title</th>
                        <th className="p-4 font-semibold">Location</th>
                        <th className="p-4 font-semibold">Date</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 pr-6 text-right font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredComplaints.map((complaint: any) => {
                        const type = complaint.complaint_type || "OTHER";
                        const meta = TYPE_META[type] || TYPE_META.OTHER;
                        const status = STATUS_STYLES[complaint.status as string] || STATUS_STYLES.OPEN;
                        const IconType = meta.icon;

                        return (
                          <tr key={complaint._id} className="hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => window.location.href = `/complaints/${complaint.id || complaint._id || complaint.complaint_id}`}>
                            <td className="p-4 pl-6 text-sm font-bold text-foreground">
                              {complaint.complaint_id || (complaint._id && !/^[0-9a-fA-F]{24}$/.test(complaint._id) ? complaint._id : "")}
                            </td>
                            <td className="p-4 text-sm font-bold text-foreground">
                              {complaint.citizen?.name || complaint.citizenName || complaint.citizen_name || "Citizen"}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}>
                                  <IconType className={`w-5 h-5 ${meta.color}`} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-foreground">{complaint.title || meta.title}</p>
                                  <p className="text-xs font-semibold text-muted-foreground">{meta.title}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-xs font-medium text-foreground">
                              <div className="space-y-1">
                                <div><span className="text-muted-foreground font-bold">District:</span> {getCleanDistrict(complaint, districts)}</div>
                                <div><span className="text-muted-foreground font-bold">Ward:</span> {getCleanWard(complaint)}</div>
                                <div className="truncate max-w-[220px]" title={complaint.address}><span className="text-muted-foreground font-bold">Address:</span> {complaint.address || "Not Available"}</div>
                                <div className="truncate max-w-[220px]" title={complaint.landmark}><span className="text-muted-foreground font-bold">Landmark:</span> {complaint.landmark || "Not Available"}</div>
                              </div>
                            </td>
                            <td className="p-4 text-sm font-bold text-muted-foreground">
                              {new Date(complaint.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${status.bg} ${status.color}`}>
                                {status.label}
                              </span>
                              {(() => {
                                const rawPriority = (complaint.ai?.priority_prediction?.priority || complaint.ai_priority?.priority || complaint.final_priority || complaint.priority || "MEDIUM").toUpperCase();
                                const badgeText = rawPriority === "HIGH" ? "🔴 High" :
                                                  rawPriority === "MEDIUM" ? "🟡 Medium" :
                                                  rawPriority === "LOW" ? "🟢 Low" : rawPriority;
                                const bgClass = rawPriority === "HIGH" ? "bg-red-500/10 text-red-600 border border-red-200" :
                                                rawPriority === "MEDIUM" ? "bg-yellow-500/10 text-yellow-600 border border-yellow-200" :
                                                rawPriority === "LOW" ? "bg-green-500/10 text-green-600 border border-green-200" : "bg-muted text-muted-foreground";
                                return (
                                  <span className={`ml-2 px-2.5 py-1 rounded-full text-[10px] font-black border ${bgClass}`}>
                                    {badgeText}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <div className={`w-8 h-8 rounded-full ${isPrivileged ? 'group-hover:bg-[#0F8A83]/10' : 'group-hover:bg-primary/10'} flex items-center justify-center ml-auto transition-colors`}>
                                <ChevronRight className={`w-5 h-5 text-muted-foreground ${isPrivileged ? 'group-hover:text-[#0F8A83]' : 'group-hover:text-primary'}`} />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground font-semibold">
                  <span>Showing 1 to {filteredComplaints.length} of {filteredComplaints.length} entries</span>
                </div>
              </div>

              {/* Mobile Cards (Hidden on desktop) */}
              <div className="md:hidden grid grid-cols-1 gap-4 col-span-full">
                {filteredComplaints.map((complaint: any) => {
                  const type = complaint.complaint_type || "OTHER";
                  const meta = TYPE_META[type as ComplaintType] || TYPE_META.OTHER;
                  const statusStyle = STATUS_STYLES[complaint.status as string] || STATUS_STYLES.OPEN;
                  const IconType = meta.icon;

                  return (
                    <Link
                      key={complaint._id}
                      href={`/complaints/${complaint.id || complaint._id || complaint.complaint_id}`}
                      className="block bg-card rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border group relative overflow-hidden hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${meta.bg} flex items-center justify-center shrink-0 shadow-sm border border-border/50`}>
                          <IconType className={`w-7 h-7 ${meta.color}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-lg font-black text-foreground truncate mb-1.5">
                              {complaint.title || meta.title}
                            </h4>
                            <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black ${statusStyle.bg} ${statusStyle.color} uppercase`}>
                              {statusStyle.label}
                            </span>
                          </div>

                          {isInspector || isWorker ? (
                            <div className="mb-4 space-y-1.5">
                              <div className="text-xs space-y-1 bg-muted/40 p-3 rounded-xl border border-border/50 mb-3">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Location</p>
                                <div><span className="font-bold text-muted-foreground">District:</span> <span className="font-semibold text-foreground">{getCleanDistrict(complaint, districts)}</span></div>
                                <div><span className="font-bold text-muted-foreground">Ward:</span> <span className="font-semibold text-foreground">{getCleanWard(complaint)}</span></div>
                                <div className="line-clamp-2" title={complaint.address}><span className="font-bold text-muted-foreground">Address:</span> <span className="font-semibold text-foreground">{complaint.address || "Not Available"}</span></div>
                                <div className="line-clamp-1" title={complaint.landmark}><span className="font-bold text-muted-foreground">Landmark:</span> <span className="font-semibold text-foreground">{complaint.landmark || "Not Available"}</span></div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-bold text-muted-foreground">
                                  {complaint.citizen?.name || "Citizen"}
                                </span>
                                {complaint.citizen?.phone && (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                                    <span className="text-xs font-bold text-muted-foreground">{complaint.citizen.phone}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="mb-4 space-y-2">
                              <p className="text-sm font-medium text-muted-foreground line-clamp-2">
                                {complaint.description}
                              </p>
                              <div className="text-xs space-y-1 bg-muted/40 p-3 rounded-xl border border-border/50">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Location</p>
                                <div><span className="font-bold text-muted-foreground">District:</span> <span className="font-semibold text-foreground">{getCleanDistrict(complaint, districts)}</span></div>
                                <div><span className="font-bold text-muted-foreground">Ward:</span> <span className="font-semibold text-foreground">{getCleanWard(complaint)}</span></div>
                                <div className="line-clamp-2" title={complaint.address}><span className="font-bold text-muted-foreground">Address:</span> <span className="font-semibold text-foreground">{complaint.address || "Not Available"}</span></div>
                                <div className="line-clamp-1" title={complaint.landmark}><span className="font-bold text-muted-foreground">Landmark:</span> <span className="font-semibold text-foreground">{complaint.landmark || "Not Available"}</span></div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/50">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black text-muted-foreground tracking-wider bg-muted px-2.5 py-1 rounded-md">
                                {complaint.complaint_id || (complaint._id && !/^[0-9a-fA-F]{24}$/.test(complaint._id) ? complaint._id : "")}
                              </span>
                              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(complaint.created_at).toLocaleDateString()}
                              </span>
                              {(() => {
                                const rawPriority = (complaint.ai?.priority_prediction?.priority || complaint.ai_priority?.priority || complaint.final_priority || complaint.priority || "MEDIUM").toUpperCase();
                                const badgeText = rawPriority === "HIGH" ? "🔴 High" :
                                                  rawPriority === "MEDIUM" ? "🟡 Medium" :
                                                  rawPriority === "LOW" ? "🟢 Low" : rawPriority;
                                const bgClass = rawPriority === "HIGH" ? "bg-red-500/10 text-red-600 border border-red-200" :
                                                rawPriority === "MEDIUM" ? "bg-yellow-500/10 text-yellow-600 border border-yellow-200" :
                                                rawPriority === "LOW" ? "bg-green-500/10 text-green-600 border border-green-200" : "bg-muted text-muted-foreground";
                                return (
                                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black border ${bgClass}`}>
                                    {badgeText}
                                  </span>
                                );
                              })()}
                            </div>

                            <div className={`w-10 h-10 rounded-full bg-muted ${isPrivileged ? 'group-hover:bg-[#0F8A83]/10' : 'group-hover:bg-primary/10'} flex items-center justify-center transition-colors`}>
                              <ChevronRight className={`w-5 h-5 text-muted-foreground ${isPrivileged ? 'group-hover:text-[#0F8A83]' : 'group-hover:text-primary'} transition-colors`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Floating Action Button (Mobile mostly) */}
        {!loading && complaints.length > 0 && isCitizen && (
          <Link
            href="/complaints/create"
            className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/40 text-primary-foreground z-20 hover:scale-105 transition-transform"
          >
            <Plus className="w-7 h-7" />
          </Link>
        )}

      </div>
    </div>
  );
}
