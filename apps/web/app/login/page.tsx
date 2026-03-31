"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Printer, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { mockUsers } from "@/lib/mock-data/users";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void
          prompt: () => void
        }
      }
    }
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { loginWithPassword, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const initGoogleSignIn = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (response: { credential: string }) => {
        setGoogleLoading(true);
        setError("");
        const success = await loginWithGoogle(response.credential);
        setGoogleLoading(false);
        if (success) {
          router.push("/");
        } else {
          setError(language === "th" ? "ไม่พบบัญชีผู้ใช้งาน หรือบัญชีถูกระงับ" : "Account not found or inactive.");
        }
      },
    });
  };

  const handleGoogleSignIn = () => {
    if (!window.google) {
      setError("Google Sign-In not available. Please try again.");
      return;
    }
    setError("");
    window.google.accounts.id.prompt();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await loginWithPassword(email, password);
    if (success) {
      router.push("/");
    } else {
      setError(language === "th" ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : "Invalid email or password.");
    }
    setLoading(false);
  };

  const allDemoUsers = mockUsers.map(u => ({
    email: u.email,
    name: u.name,
    role: u.roleName,
    method: u.loginMethod,
    status: u.status,
  }));

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={initGoogleSignIn}
        strategy="afterInteractive"
      />
      {/* Language switcher top right */}
      <div className="fixed top-4 right-4 flex items-center gap-1 text-sm">
        <button
          onClick={() => setLanguage("en")}
          className={`px-2.5 py-1 rounded font-medium transition-colors ${
            language === "en"
              ? "bg-primary/20 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          EN
        </button>
        <span className="text-muted-foreground/40">|</span>
        <button
          onClick={() => setLanguage("th")}
          className={`px-2.5 py-1 rounded font-medium transition-colors ${
            language === "th"
              ? "bg-primary/20 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          TH
        </button>
      </div>

      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
            <Printer className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">MAllPrint - CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">ระบบบริหารงานพิมพ์</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-foreground mb-6">{t("login")}</h2>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-white dark:bg-secondary hover:bg-gray-50 dark:hover:bg-secondary/80 transition-colors text-sm font-medium text-gray-700 dark:text-foreground shadow-sm mb-5 disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-3.58-13.47-8.79l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            {googleLoading
              ? (language === "th" ? "กำลังเข้าสู่ระบบ..." : "Signing in...")
              : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">— OR —</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t("email")}</label>
              <Input
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t("password")}</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="bg-secondary border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-muted-foreground">{t("rememberMe")}</span>
              </label>
              <Link
                href="/login/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {language === "th" ? "กำลังเข้าสู่ระบบ..." : "Signing in..."}
                </span>
              ) : (
                t("login")
              )}
            </Button>
          </form>

          {/* Session expiry notice */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            {language === "th" ? "เซสชันจะหมดอายุทุกวันเวลา 01:00 น." : "Session expires daily at 1:00 AM"}
          </p>
        </div>

        {/* Demo accounts collapsible */}
        <div className="mt-4 border border-border rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDemoAccounts(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-secondary/30 transition-colors text-sm font-medium text-muted-foreground"
          >
            <span>{language === "th" ? "บัญชีสำหรับทดสอบ" : "Demo accounts"}</span>
            {showDemoAccounts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showDemoAccounts && (
            <div className="bg-card border-t border-border divide-y divide-border">
              {allDemoUsers.map(u => (
                <div key={u.email} className="px-4 py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">{u.name}</div>
                    <div className="text-xs font-mono text-muted-foreground truncate">{u.email}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      u.method === 'google'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {u.method === 'google' ? 'Google' : 'Password'}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      u.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {u.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{u.role}</span>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2 bg-secondary/20">
                <p className="text-xs text-muted-foreground">
                  {language === "th"
                    ? "รหัสผ่านสำหรับ admin: admin1234"
                    : "Password login: admin@company.com / admin1234"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
