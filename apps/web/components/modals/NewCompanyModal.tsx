"use client";

import { useState } from "react";
import { X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toast } from "@/components/ui/toast-simple";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface NewCompanyModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewCompanyModal({ open, onClose }: NewCompanyModalProps) {
  const { language, t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    industry: "",
    tier: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    taxId: "",
    notes: "",
  });
  const [toast, setToast] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    if (!form.name) return;
    setToast(true);
    setTimeout(() => {
      onClose();
      setForm({ name: "", industry: "", tier: "", website: "", phone: "", email: "", address: "", taxId: "", notes: "" });
    }, 1200);
  };

  const industries = [
    { value: "printing", label: language === "th" ? "สิ่งพิมพ์" : "Printing" },
    { value: "publishing", label: language === "th" ? "สำนักพิมพ์" : "Publishing" },
    { value: "packaging", label: language === "th" ? "บรรจุภัณฑ์" : "Packaging" },
    { value: "marketing", label: language === "th" ? "การตลาด" : "Marketing" },
    { value: "education", label: language === "th" ? "การศึกษา" : "Education" },
    { value: "healthcare", label: language === "th" ? "สุขภาพ" : "Healthcare" },
    { value: "retail", label: language === "th" ? "ค้าปลีก" : "Retail" },
    { value: "other", label: language === "th" ? "อื่นๆ" : "Other" },
  ];

  const tiers = [
    { value: "enterprise", label: "Platinum" },
    { value: "mid-market", label: "Gold" },
    { value: "smb", label: "Silver" },
    { value: "prospect", label: "Bronze" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto">
        <div className="bg-background border border-border rounded-xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                {language === "th" ? "เพิ่มบริษัทใหม่" : "Add New Company"}
              </h2>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "th" ? "ชื่อบริษัท" : "Company Name"} <span className="text-red-400">*</span>
              </label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="bg-secondary border-border"
                placeholder={language === "th" ? "เช่น บริษัท ABC จำกัด" : "e.g. ABC Co., Ltd."}
              />
            </div>

            {/* Industry + Tier */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {language === "th" ? "อุตสาหกรรม" : "Industry"}
                </label>
                <Select value={form.industry} onValueChange={v => setForm(f => ({ ...f, industry: v ?? "" }))}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder={language === "th" ? "เลือก..." : "Select..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(i => (
                      <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tier</label>
                <Select value={form.tier} onValueChange={v => setForm(f => ({ ...f, tier: v ?? "" }))}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder={language === "th" ? "เลือก..." : "Select..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Website */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "th" ? "เว็บไซต์ (ไม่บังคับ)" : "Website (optional)"}
              </label>
              <Input
                value={form.website}
                onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                className="bg-secondary border-border"
                placeholder="www.company.co.th"
              />
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {language === "th" ? "โทรศัพท์" : "Phone"}
                </label>
                <Input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="bg-secondary border-border"
                  placeholder="02-xxx-xxxx"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {language === "th" ? "อีเมล" : "Email"}
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="bg-secondary border-border"
                  placeholder="info@company.com"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "th" ? "ที่อยู่" : "Address"}
              </label>
              <textarea
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full min-h-[70px] px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder={language === "th" ? "ที่อยู่บริษัท..." : "Company address..."}
              />
            </div>

            {/* Tax ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "th" ? "เลขประจำตัวผู้เสียภาษี" : "Tax ID"}
              </label>
              <Input
                value={form.taxId}
                onChange={e => setForm(f => ({ ...f, taxId: e.target.value }))}
                className="bg-secondary border-border"
                placeholder="0-0000-00000-00-0"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "th" ? "หมายเหตุ (ไม่บังคับ)" : "Notes (optional)"}
              </label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="w-full min-h-[70px] px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder={language === "th" ? "หมายเหตุเพิ่มเติม..." : "Additional notes..."}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 justify-end mt-6">
            <Button variant="outline" onClick={onClose}>{t("cancel")}</Button>
            <Button onClick={handleSave} disabled={!form.name}>
              {language === "th" ? "บันทึกบริษัท" : "Save Company"}
            </Button>
          </div>
        </div>
      </div>

      <Toast
        visible={toast}
        onClose={() => setToast(false)}
        message={language === "th" ? "เพิ่มบริษัทสำเร็จ!" : "Company added successfully!"}
      />
    </>
  );
}
