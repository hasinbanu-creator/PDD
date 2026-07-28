"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  ShieldHalf,
  AlertCircle,
  RefreshCw,
  LogIn,
  CheckCircle2,
} from "lucide-react";

const OTP_LENGTH = 6;

export default function LoginPage() {
  const router = useRouter();
  const { signIn, verifyLogin, error: authError } = useAuth();

  // State for Step 1 (Email)
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  // State for Step 2 (OTP)
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── STEP 1: EMAIL HANDLERS ──
  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    // Stricter validation: rejects leading/trailing dots, consecutive dots, hyphen at domain start
    const strictEmailRe = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+\-]*[a-zA-Z0-9])?@(?!-)(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (/\.\.|^\.|\.$/.test(email.trim()) || !strictEmailRe.test(email.trim())) {
      setEmailError("Enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    
    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase());
      setStep("OTP");
      setTimer(120);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(""));
    } catch (err: any) {
      console.error("Login error:", err);
      // authError from context might handle this, or we can use local state if needed
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2: OTP HANDLERS ──
  useEffect(() => {
    let id: NodeJS.Timeout;
    if (step === "OTP") {
      id = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(id);
  }, [step]);

  const timerLabel = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`;

  const handleOtpChange = (val: string, idx: number) => {
    // Handle paste
    if (val.length === OTP_LENGTH && /^\d+$/.test(val)) {
      const arr = val.split("");
      setOtp(arr);
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      return;
    }

    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    setOtpError("");

    if (digit && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const otpValue = otp.join("");
  const isComplete = otpValue.length === OTP_LENGTH;

  const handleVerify = async () => {
    if (!isComplete) {
      setOtpError("Please enter all 6 digits");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      await verifyLogin(email.trim().toLowerCase(), otpValue);
      // Context will redirect or we can push
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      router.push(redirect || "/dashboard");
    } catch (err: any) {
      setOtpError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await signIn(email.trim().toLowerCase());
      setTimer(120);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setOtpError(err.response?.data?.message || "Unable to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* ── LEFT/HERO SECTION (Desktop & Mobile) ── */}
      <div className={`relative bg-primary overflow-hidden flex-col justify-end w-full md:w-1/2 lg:w-[45%] flex transition-all duration-500 ease-in-out ${step === "OTP" ? "h-[200px] md:h-auto" : "h-[340px] md:h-auto"}`}>
        {/* Decorative circles */}
        <div className="absolute w-44 h-44 rounded-full border-[40px] border-white/10 -top-12 -right-10" />
        <div className="absolute w-32 h-32 rounded-full border-[28px] border-white/10 bottom-2 -left-10" />
        <div className="absolute w-16 h-16 rounded-full bg-white/5 top-24 left-[55%]" />

        {/* Logo and Hero Text */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between pt-16 md:pt-24 pb-8 px-8">
          
          {step === "OTP" ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setStep("EMAIL")}
                className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1">
                <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">Verify OTP</h1>
                <p className="text-white/80 text-sm mt-1">Secure login to CiviFix</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center md:justify-start">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/10 overflow-hidden p-2">
                  <Image src="/logo.png" alt="CiviFix Logo" width={80} height={80} className="object-contain" />
                </div>
              </div>
              <div className="mt-auto">
                <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight mb-2">
                  India&apos;s #1 Civic<br />Issue Reporting App
                </h1>
                <p className="text-white/80 text-sm md:text-base font-semibold tracking-wide mt-2">
                  Report. Track. Resolve.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── RIGHT/FORM SECTION ── */}
      <div className="flex-1 bg-card flex flex-col px-6 py-8 md:p-12 lg:p-16 rounded-t-[40px] md:rounded-t-none -mt-8 md:mt-0 z-20 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)]">
        
        {step === "EMAIL" && (
          <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full pt-4">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm font-bold text-muted-foreground tracking-wide">Log in or sign up</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email-input" className="block text-xs font-bold text-muted-foreground tracking-wider mb-2">
                    EMAIL ADDRESS
                  </label>
                  <div className={`flex items-center gap-3 border-2 rounded-2xl px-5 py-3.5 bg-muted/30 transition-all duration-200 ${emailError ? 'border-destructive bg-destructive/5' : 'border-border focus-within:border-primary focus-within:bg-card focus-within:ring-4 focus-within:ring-primary/10'}`}>
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      placeholder="Enter your email address"
                      className="flex-1 bg-transparent border-none outline-none text-foreground text-sm font-medium"
                      autoCapitalize="none"
                      autoCorrect="off"
                    />
                  </div>
                  {emailError && <p className="text-destructive text-xs mt-1.5 ml-1 font-bold">{emailError}</p>}
                </div>

                {authError && <p className="text-destructive text-sm text-center font-bold">{authError}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-bold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-primary/20 mt-2"
                >
                  {loading ? (
                    <span className="tracking-widest">SENDING OTP...</span>
                  ) : (
                    <>
                      <span className="tracking-widest">CONTINUE</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-2">
                <span className="text-sm font-semibold text-muted-foreground">Don&apos;t have an account?</span>
                <button
                  onClick={() => router.push("/signup")}
                  className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
 
            <div className="mt-8 text-center">
              <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold">
                By continuing, you agree to our<br />
                <Link href="#" className="text-foreground underline decoration-muted-foreground underline-offset-2">Terms of Service</Link>
                {"  ·  "}
                <Link href="#" className="text-foreground underline decoration-muted-foreground underline-offset-2">Privacy Policy</Link>
                {"  ·  "}
                <Link href="#" className="text-foreground underline decoration-muted-foreground underline-offset-2">Content Policies</Link>
              </p>
            </div>
          </div>
        )}
 
        {step === "OTP" && (
          <div className="flex-1 flex flex-col max-w-md mx-auto w-full pt-4">
            
            <div className="flex items-center gap-4 bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-8">
              <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center shadow-sm border border-border">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground tracking-wide mb-0.5">OTP sent to</p>
                <p className="text-sm font-black text-foreground">{maskedEmail}</p>
              </div>
            </div>
 
            <div className="bg-card rounded-[2rem] p-6 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldHalf className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground tracking-wide">Enter 6-digit OTP</h3>
              </div>
 
              <div className="flex justify-between gap-2 mb-8">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className={`w-full aspect-[0.85] text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all duration-200
                      ${digit ? 'border-primary bg-primary/5 text-primary' : 
                        idx === otp.findIndex(d => d === "") ? 'border-primary bg-card ring-4 ring-primary/10' : 
                        (otpError || authError) ? 'border-destructive bg-destructive/5 text-destructive' : 'border-border bg-muted/30 text-foreground'}
                    `}
                  />
                ))}
              </div>
 
              {(otpError || authError) ? (
                <div className="flex items-center justify-center gap-2 mb-6">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="text-xs text-destructive font-bold">{otpError || authError}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center mb-6">
                  {canResend ? (
                    <button
                      onClick={handleResend}
                      disabled={resending}
                      className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-5 py-2.5 rounded-full transition-colors font-bold text-sm"
                    >
                      {resending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          <span>Resend OTP</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <p className="text-sm text-muted-foreground font-semibold">
                      Resend in <span className="text-primary font-bold">{timerLabel}</span>
                    </p>
                  )}
                </div>
              )}
 
              <button
                onClick={handleVerify}
                disabled={!isComplete || loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-primary-foreground font-bold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-primary/20 mb-4 mt-2"
              >
                {loading ? (
                  <span>VERIFYING...</span>
                ) : (
                  <>
                    <span className="tracking-widest">VERIFY & LOGIN</span>
                    <LogIn className="w-5 h-5" />
                  </>
                )}
              </button>
 
              <p className="text-center text-xs text-muted-foreground font-semibold">
                Didn&apos;t get the email? Check your spam folder.
              </p>
            </div>
 
            <div className="mt-10 flex justify-center items-center gap-2">
              <span className="text-sm text-muted-foreground font-semibold">Wrong email?</span>
              <button 
                onClick={() => setStep("EMAIL")}
                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Go back & change
              </button>
            </div>
 
          </div>
        )}
 
      </div>
    </div>
  );
}
