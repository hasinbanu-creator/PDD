"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import authService from "@/services/auth";
import { 
  ArrowLeft, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Loader2,
  Trash2,
  Calendar
} from "lucide-react";

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  OPEN:        { label: "Pending",     color: "text-accent",    bg: "bg-accent/10" },
  PENDING:     { label: "Pending",     color: "text-accent",    bg: "bg-accent/10" },
  WORKING:     { label: "In Progress", color: "text-primary",   bg: "bg-primary/10" },
  IN_PROGRESS: { label: "In Progress", color: "text-primary",   bg: "bg-primary/10" },
  ASSIGNED:    { label: "Assigned",    color: "text-primary",   bg: "bg-primary/10" },
  APPROVAL:    { label: "Review",      color: "text-secondary", bg: "bg-secondary/10" },
  CLOSED:      { label: "Resolved",    color: "text-success",   bg: "bg-success/10" },
  RESOLVED:    { label: "Resolved",    color: "text-success",   bg: "bg-success/10" },
  REJECTED:    { label: "Rejected",    color: "text-destructive",bg: "bg-destructive/10" },
};

export default function WardDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ward, setWard] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const wardRes = await authService.getWardDetail(String(id));
        setWard(wardRes);
        
        const complaintsRes = await authService.getWardComplaints({ ward_id: String(id), limit: 100 });
        setComplaints(complaintsRes?.complaints || complaintsRes?.data || (Array.isArray(complaintsRes) ? complaintsRes : []) || []);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load ward details.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const stats = React.useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => ["OPEN", "PENDING"].includes(c.status)).length;
    const active = complaints.filter(c => ["IN_PROGRESS", "WORKING", "ACCEPTED", "FIELD_VISIT", "APPROVAL"].includes(c.status)).length;
    const resolved = complaints.filter(c => ["RESOLVED", "CLOSED"].includes(c.status)).length;
    return { total, pending, active, resolved };
  }, [complaints]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-muted-foreground mt-4">Loading ward details...</p>
      </div>
    );
  }

  if (error || !ward) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <p className="text-base font-bold text-foreground">Error Loading Ward</p>
        <p className="text-sm font-medium text-muted-foreground mt-1">{error || "Ward details not found."}</p>
        <button onClick={() => router.push("/wards")} className="mt-4 px-5 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold transition-all shadow-md shadow-primary/20">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-primary pt-12 pb-16 px-6 md:px-12 md:rounded-b-[60px] rounded-b-[40px] shadow-lg sticky top-0 z-20 md:static">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-4">
          <Link href="/wards" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">{ward.ward_name}</h1>
            <p className="text-white/80 font-semibold mt-1">Ward #{ward.ward_number}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full -mt-8 relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Stats Summary Card */}
        <div className="grid grid-cols-4 gap-4 bg-card rounded-3xl p-6 shadow-sm border border-border mb-8">
          <div className="text-center border-r border-border">
            <p className="text-3xl font-black text-foreground">{stats.total}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Issues</p>
          </div>
          <div className="text-center border-r border-border">
            <p className="text-3xl font-black text-accent">{stats.pending}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Pending</p>
          </div>
          <div className="text-center border-r border-border">
            <p className="text-3xl font-black text-primary">{stats.active}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Active</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-success">{stats.resolved}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Resolved</p>
          </div>
        </div>

        {/* Complaints Section */}
        <h3 className="text-xl font-black text-foreground mb-4">Ward Complaints</h3>
        
        {complaints.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-base font-bold text-foreground">No complaints in this ward</p>
            <p className="text-sm font-medium text-muted-foreground mt-1">Issues reported in this ward will appear here.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80 text-xs font-black text-muted-foreground uppercase tracking-wider bg-muted/30">
                    <th className="p-4 pl-6">ID / Category</th>
                    <th className="p-4">Address</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {complaints.map((c: any) => {
                    const isHigh = c.priority === "HIGH";
                    return (
                      <tr key={c._id || c.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-sm font-bold text-foreground">{c.title || c.complaint_type || "Civic Issue"}</p>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                                {c.complaint_id || c._id?.substring(0, 6).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-semibold text-muted-foreground max-w-[200px] truncate" title={c.address}>
                          {c.address || "No address provided"}
                        </td>
                        <td className="p-4 text-sm font-semibold text-muted-foreground">
                          {c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="p-4">
                          {(() => {
                            const status = STATUS_STYLES[c.status as string] || STATUS_STYLES.PENDING;
                            return (
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${status.bg} ${status.color}`}>
                                {status.label}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <Link 
                            href={`/complaints/${c._id || c.id}`}
                            className="inline-flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary text-xs font-black px-3.5 py-2 rounded-xl transition-all"
                          >
                            View details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
