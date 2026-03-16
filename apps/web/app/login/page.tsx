"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Printer, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise(r => setTimeout(r, 600));

    if (email === "admin@company.com" && password === "admin1234") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    } else {
      setError(language === "th" ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : "Invalid email or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
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
        </div>

        {/* Mock credentials hint */}
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl text-center">
          <p className="text-xs text-muted-foreground mb-1">
            {language === "th" ? "ข้อมูลสำหรับทดสอบ" : "Demo credentials"}
          </p>
          <p className="text-xs font-mono text-foreground">admin@company.com</p>
          <p className="text-xs font-mono text-foreground">admin1234</p>
        </div>
      </div>
    </div>
  );
}
