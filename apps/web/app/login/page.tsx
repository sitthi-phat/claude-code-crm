"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Printer } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void
          prompt: () => void
          renderButton: (element: HTMLElement, config: object) => void
        }
      }
    }
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google) initGoogleSignIn();
  });

  const initGoogleSignIn = () => {
    if (!window.google || !googleBtnRef.current) return;
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (response: { credential: string }) => {
        setLoading(true);
        setError("");
        const success = await loginWithGoogle(response.credential);
        setLoading(false);
        if (success) {
          router.push("/");
        } else {
          setError(
            language === "th"
              ? "ไม่พบบัญชีผู้ใช้งาน หรือบัญชีถูกระงับ กรุณาติดต่อผู้ดูแลระบบ"
              : "Access denied. Your account was not found or is inactive. Please contact your administrator."
          );
        }
      },
    });
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      width: googleBtnRef.current.offsetWidth || 320,
      text: "signin_with",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={initGoogleSignIn}
        strategy="afterInteractive"
      />

      {/* Language switcher */}
      <div className="fixed top-4 right-4 flex items-center gap-1 text-sm">
        <button
          onClick={() => setLanguage("en")}
          className={`px-2.5 py-1 rounded font-medium transition-colors ${language === "en" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          EN
        </button>
        <span className="text-muted-foreground/40">|</span>
        <button
          onClick={() => setLanguage("th")}
          className={`px-2.5 py-1 rounded font-medium transition-colors ${language === "th" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          TH
        </button>
      </div>

      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-5 shadow-lg shadow-primary/30">
            <Printer className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">MAllPrint</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Customer Relationship Management</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-7">
            <h2 className="text-lg font-semibold text-foreground">
              {language === "th" ? "เข้าสู่ระบบ" : "Sign in to your account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "th" ? "ใช้บัญชี Google ขององค์กร" : "Use your organisation Google account"}
            </p>
          </div>

          {/* GIS rendered button */}
          <div className="flex justify-center">
            <div ref={googleBtnRef} className="w-full" style={{ minHeight: 44 }} />
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 mt-5 text-sm text-muted-foreground">
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              {language === "th" ? "กำลังตรวจสอบสิทธิ์..." : "Verifying access..."}
            </div>
          )}

          {error && (
            <div className="mt-5 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-center">
              {error}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-5">
          {language === "th"
            ? "เฉพาะบัญชีที่ได้รับอนุมัติเท่านั้น • เซสชันหมดอายุเวลา 01:00 น."
            : "Authorised accounts only • Session expires at 1:00 AM"}
        </p>
      </div>
    </div>
  );
}
