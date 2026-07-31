"use client";

import { useParams, useRouter } from "next/navigation";
import { useComplaint } from "@/hooks/use-complaints";
import { useAuth } from "@/context/auth-context";
import {
  ArrowLeft,
  Activity,
  Check,
  X,
  Clock,
  FileText,
  Wrench,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function StatusTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading: loading } = useComplaint(id);
  const { user } = useAuth();
  const complaint: any = data;

  // Default to empty array if no history
  const history = complaint?.history || [];

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-bold text-slate-400">Loading timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-20 md:pb-8">
      
      {/* Header */}
      <div className="bg-blue-600 pt-8 pb-12 px-6 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Status Tracking</h1>
          <p className="text-white/80 font-medium text-xs mt-0.5">Timeline & Progress</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 min-h-[60vh]">
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">Activity Timeline</h2>
              <p className="text-xs font-semibold text-slate-500">Updates will appear here as your complaint progresses.</p>
            </div>
          </div>

          {history.length > 0 ? (
            <div className="space-y-0 pb-4">
              {history.map((item: any, idx: number) => {
                const isLast = idx === history.length - 1;
                const action = (item.action || "").toUpperCase();
                const newStatus = (item.new_status || "").toUpperCase();
                const isCitizen = user?.role === "CITIZEN";
                
                let statusKey = "SUBMITTED";
                if (action === "CREATED" || newStatus === "PENDING" || newStatus === "OPEN") {
                  statusKey = "SUBMITTED";
                } else if (newStatus === "IN_PROGRESS" || newStatus === "WORKING" || action === "ASSIGNED") {
                  statusKey = "IN_PROGRESS";
                } else if (newStatus === "RESOLVED" || newStatus === "CLOSED") {
                  statusKey = "RESOLVED";
                } else if (newStatus === "REJECTED") {
                  statusKey = "REJECTED";
                } else {
                  if (action === "REJECTED") {
                    statusKey = "REJECTED";
                  } else if (action === "APPROVED") {
                    statusKey = "RESOLVED";
                  }
                }

                let title = "Complaint Submitted";
                let dotColorClass = "bg-amber-500 shadow-amber-500/20";
                let defaultRemarks = "Complaint submitted by citizen.";
                let Icon = FileText;

                if (statusKey === "IN_PROGRESS") {
                  title = isCitizen ? "Work Started by Inspector" : "Work Started";
                  dotColorClass = "bg-blue-500 shadow-blue-500/20";
                  defaultRemarks = "Inspector started working on the complaint.";
                  Icon = Wrench;
                } else if (statusKey === "RESOLVED") {
                  title = isCitizen ? "Complaint Resolved" : "Complaint Resolved";
                  dotColorClass = "bg-emerald-500 shadow-emerald-500/20";
                  defaultRemarks = "Inspector resolved the complaint.";
                  Icon = CheckCircle2;
                } else if (statusKey === "REJECTED") {
                  title = "Complaint Rejected";
                  dotColorClass = "bg-red-500 shadow-red-500/20";
                  defaultRemarks = "Inspector rejected the complaint.";
                  Icon = XCircle;
                }

                const remarksText = item.remarks || defaultRemarks;
                
                return (
                  <div key={item._id || idx} className="flex gap-4">
                    {/* Timeline Line & Dot */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full ${dotColorClass} flex items-center justify-center shadow-lg shrink-0 z-10`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {!isLast && (
                        <div className="w-1 bg-slate-100 flex-1 my-1 rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <h3 className="text-base font-extrabold text-slate-800 mb-1">
                        {title}
                      </h3>
                      
                      {remarksText && (
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-3">
                          <p className="text-sm font-medium text-slate-600 leading-relaxed">
                            {remarksText}
                          </p>
                        </div>
                      )}
                      
                      {(item.timestamp || item.created_at) && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(item.timestamp || item.created_at).toLocaleDateString("en-IN", { 
                            day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" 
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Activity className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-sm font-bold text-slate-500">No activity yet</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
