"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toast } from "@/components/ui/toast-simple";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { mockCompanies } from "@/lib/mock-data/clients";

interface NewContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewContactModal({ open, onClose }: NewContactModalProps) {
  const { t, language } = useLanguage();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
  });
  const [toast, setToast] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    setToast(true);
    setTimeout(() => {
      onClose();
      setForm({ firstName: "", lastName: "", email: "", phone: "", company: "", role: "" });
    }, 1200);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
        <div className="bg-background border border-border rounded-xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">{t("newContact")}</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {language === "th" ? "ชื่อ" : "First Name"}
                </label>
                <Input
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  className="bg-secondary border-border"
                  placeholder={language === "th" ? "ชื่อ" : "First name"}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {language === "th" ? "นามสกุล" : "Last Name"}
                </label>
                <Input
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  className="bg-secondary border-border"
                  placeholder={language === "th" ? "นามสกุล" : "Last name"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t("email")}</label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="bg-secondary border-border"
                placeholder="email@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "th" ? "โทรศัพท์" : "Phone"}
              </label>
              <Input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="bg-secondary border-border"
                placeholder="08x-xxx-xxxx"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "th" ? "บริษัท" : "Company"}
              </label>
              <Select value={form.company} onValueChange={v => setForm(f => ({ ...f, company: v ?? "" }))}>
                <SelectTrigger className="w-full bg-secondary border-border">
                  <SelectValue placeholder={language === "th" ? "เลือกบริษัท" : "Select company"} />
                </SelectTrigger>
                <SelectContent>
                  {mockCompanies.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "th" ? "ตำแหน่ง / บทบาท" : "Role / Position"}
              </label>
              <Input
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="bg-secondary border-border"
                placeholder={language === "th" ? "เช่น ผู้จัดการฝ่ายจัดซื้อ" : "e.g. Purchasing Manager"}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 justify-end mt-6">
            <Button variant="outline" onClick={onClose}>{t("cancel")}</Button>
            <Button onClick={handleSave}>{t("save")}</Button>
          </div>
        </div>
      </div>

      <Toast
        visible={toast}
        onClose={() => setToast(false)}
        message={language === "th" ? "เพิ่มผู้ติดต่อสำเร็จ!" : "Contact added successfully!"}
      />
    </>
  );
}
