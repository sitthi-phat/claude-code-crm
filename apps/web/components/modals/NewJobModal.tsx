"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toast } from "@/components/ui/toast-simple";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { mockCompanies } from "@/lib/mock-data/clients";

interface NewJobModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewJobModal({ open, onClose }: NewJobModalProps) {
  const { t, language } = useLanguage();
  const [form, setForm] = useState({
    title: "",
    client: "",
    jobType: "",
    quantity: "",
    paperSize: "",
    paperType: "",
    finish: "",
    dueDate: "",
    priority: "",
    notes: "",
  });
  const [toast, setToast] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    setToast(true);
    setTimeout(() => {
      onClose();
      setForm({ title: "", client: "", jobType: "", quantity: "", paperSize: "", paperType: "", finish: "", dueDate: "", priority: "", notes: "" });
    }, 1200);
  };

  const L = (th: string, en: string) => language === "th" ? th : en;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto">
        <div className="bg-background border border-border rounded-xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">{t("createJob")}</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{L("ชื่องาน", "Job Title")}</label>
              <Input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="bg-secondary border-border"
                placeholder={L("เช่น โบรชัวร์ Q2 2026", "e.g. Q2 2026 Brochure")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{L("ลูกค้า", "Client")}</label>
                <Select value={form.client} onValueChange={v => setForm(f => ({ ...f, client: v ?? "" }))}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder={L("เลือกลูกค้า", "Select client")} />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{L("ประเภทงาน", "Job Type")}</label>
                <Select value={form.jobType} onValueChange={v => setForm(f => ({ ...f, jobType: v ?? "" }))}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder={L("เลือกประเภท", "Select type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brochure">{L("โบรชัวร์", "Brochure")}</SelectItem>
                    <SelectItem value="catalog">{L("แคตตาล็อก", "Catalog")}</SelectItem>
                    <SelectItem value="business-cards">{L("นามบัตร", "Business Cards")}</SelectItem>
                    <SelectItem value="poster">{L("โปสเตอร์", "Poster")}</SelectItem>
                    <SelectItem value="banner">{L("แบนเนอร์", "Banner")}</SelectItem>
                    <SelectItem value="packaging">{L("บรรจุภัณฑ์", "Packaging")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{L("จำนวน", "Quantity")}</label>
                <Input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  className="bg-secondary border-border"
                  placeholder="1000"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{L("ขนาดกระดาษ", "Paper Size")}</label>
                <Select value={form.paperSize} onValueChange={v => setForm(f => ({ ...f, paperSize: v ?? "" }))}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder={L("เลือกขนาด", "Select size")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="a5">A5</SelectItem>
                    <SelectItem value="a3">A3</SelectItem>
                    <SelectItem value="custom">{L("กำหนดเอง", "Custom")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{L("ประเภทกระดาษ", "Paper Type")}</label>
                <Input
                  value={form.paperType}
                  onChange={e => setForm(f => ({ ...f, paperType: e.target.value }))}
                  className="bg-secondary border-border"
                  placeholder={L("เช่น Art Coated 150g", "e.g. Art Coated 150g")}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{L("การเคลือบผิว", "Finish")}</label>
                <Select value={form.finish} onValueChange={v => setForm(f => ({ ...f, finish: v ?? "" }))}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder={L("เลือก", "Select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matte">Matte</SelectItem>
                    <SelectItem value="gloss">Gloss</SelectItem>
                    <SelectItem value="soft-touch">Soft Touch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{L("กำหนดส่ง", "Due Date")}</label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{L("ความสำคัญ", "Priority")}</label>
                <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v ?? "" }))}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder={L("เลือก", "Select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">{L("สูง", "High")}</SelectItem>
                    <SelectItem value="medium">{L("กลาง", "Medium")}</SelectItem>
                    <SelectItem value="low">{L("ต่ำ", "Low")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{L("หมายเหตุ", "Notes")}</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring/50"
                placeholder={L("รายละเอียดเพิ่มเติม...", "Additional details...")}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <Button variant="outline" onClick={onClose}>{t("cancel")}</Button>
            <Button onClick={handleSave}>{t("save")}</Button>
          </div>
        </div>
      </div>

      <Toast
        visible={toast}
        onClose={() => setToast(false)}
        message={language === "th" ? "สร้างงานใหม่สำเร็จ!" : "Job created successfully!"}
      />
    </>
  );
}
