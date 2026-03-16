"use client";

import { useState } from "react";
import Link from "next/link";
import { Printer, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ForgotPasswordPage() {
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
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
          <h1 className="text-2xl font-bold text-foreground">PrintCRM</h1>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          {!sent ? (
            <>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                {language === "th" ? "ลืมรหัสผ่าน" : "Forgot Password"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {language === "th"
                  ? "กรอกอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้"
                  : "Enter your email and we'll send you a reset link."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{t("email")}</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="bg-secondary border-border"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {language === "th" ? "กำลังส่ง..." : "Sending..."}
                    </span>
                  ) : (
                    t("sendResetLink")
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {language === "th" ? "ส่งลิงก์แล้ว!" : "Link Sent!"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "th"
                  ? `เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ ${email} แล้ว`
                  : `We've sent a password reset link to ${email}`}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
