"use client";

import React from "react";
import { Mail, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="flex-1 bg-background min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-primary pt-12 pb-16 px-6 md:px-12 md:rounded-b-[60px] rounded-b-[40px] shadow-lg flex items-center justify-between sticky top-0 z-20 md:static">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <Link href="/profile" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Contact Support</h1>
            <p className="text-white/80 font-semibold mt-1">Get help and resolve issues</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full -mt-8 relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-[2rem] p-8 md:p-10 shadow-sm border border-border">
          <div className="flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6">
              <HelpCircle className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-2xl font-black text-foreground mb-4">How can we help?</h2>
            <p className="text-sm font-semibold text-muted-foreground leading-relaxed mb-8">
              Have questions about raising a complaint, tracking progress, or using CiviFix?
              Reach out directly and our support team will get back to you as soon as possible.
            </p>

            {/* Email Support Card */}
            <a 
              href="mailto:civifix.support@gmail.com" 
              className="w-full bg-muted/30 hover:bg-muted/50 border-2 border-border hover:border-primary/30 rounded-[2rem] p-6 transition-all duration-300 flex items-center gap-5 group"
            >
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Mail className="w-7 h-7" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Email Support</p>
                <p className="text-base font-bold text-foreground mt-0.5 group-hover:text-primary transition-colors">civifix.support@gmail.com</p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Click to send us an email</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
