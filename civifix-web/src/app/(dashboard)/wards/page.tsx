"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useWards } from "@/hooks/use-wards";
import { Map, Search, ChevronRight, Activity, ShieldCheck, MapPin, Loader2 } from "lucide-react";

export default function WardsPage() {
  const { user } = useAuth();
  const districtId = user?.district_id || user?.district;
  const { data: res, isLoading } = useWards(districtId, { limit: 100 });
  const [searchQuery, setSearchQuery] = useState("");

  const wards = useMemo(() => {
    const rawWards = res?.data || (Array.isArray(res) ? res : []) || [];
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
  }, [res]);

  const filteredWards = useMemo(() => {
    return wards.filter((w: any) => {
      const name = (w.ward_name || "").toLowerCase();
      const num = String(w.ward_number || "").toLowerCase();
      const q = searchQuery.toLowerCase();
      return name.includes(q) || num.includes(q);
    });
  }, [wards, searchQuery]);

  const activeCount = useMemo(() => {
    return wards.filter((w: any) => w.is_active !== false).length;
  }, [wards]);

  return (
    <div className="flex-1 bg-background min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-primary pt-12 pb-16 px-6 md:px-12 md:rounded-b-[60px] rounded-b-[40px] shadow-lg flex items-center justify-between sticky top-0 z-20 md:static">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Map className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Wards Management</h1>
              <p className="text-white/80 font-semibold mt-1">Manage jurisdiction zones and inspector coverage</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full -mt-8 relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Stats Strip */}
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border mb-8 flex items-center justify-center divide-x divide-border">
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-primary">{wards.length}</span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Wards</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-success">{activeCount}</span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Active Wards</span>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ward by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:font-medium placeholder:text-muted-foreground shadow-sm"
          />
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-bold text-muted-foreground mt-4">Loading wards list...</p>
          </div>
        ) : filteredWards.length === 0 ? (
          <div className="bg-card rounded-[2rem] p-10 text-center border border-border shadow-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">No wards found</h3>
            <p className="text-sm font-semibold text-muted-foreground">No wards match your search filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWards.map((w: any) => (
              <Link 
                key={w._id || w.id}
                href={`/wards/${w._id || w.id}`}
                className="bg-card border border-border hover:border-primary/30 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-foreground">{w.ward_name}</h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Ward #{w.ward_number}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${w.is_active !== false ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    {w.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
