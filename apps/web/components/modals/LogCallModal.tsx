"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toast } from "@/components/ui/toast-simple";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { mockContacts } from "@/lib/mock-data/clients";

interface LogCallModalProps {
  open: boolean;
  onClose: () => void;
}

export function LogCallModal({ open, onClose }: LogCallModalProps) {
  const { t, language } = useLanguage();
  const [form, setForm] = useState({
    contact: "",
    dateTime: "",
    duration: "",
    direction: "",
    outcome: "",
    notes: "",
  });
  const [toast, setToast] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    setToast(true);
    setTimeout(() => {
      onClose();
      setForm({ contact: "", dateTime: "", duration: "", direction: "", outcome: "", notes: "" });
    }, 1200);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
        <div className="bg-background border border-border rounded-xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">{t("logCall")}</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "th" ? "ผู้ติดต่อ" : "Contact"}
              </label>
              <Select value={form.contact} onValueChange={v => setForm(f => ({ ...f, contact: v ?? "" }))}>
                <SelectTrigger className="w-full bg-secondary border-border">
                  <SelectValue placeholder={language === "th" ? "เลือกผู้ติดต่อ" : "Select contact"} />
                </SelectTrigger>
                <SelectContent>
                  {mockContacts.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} — {c.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {language === "th" ? "วัน/เวลา" : "Date / Time"}
                </label>
                <Input
                  type="datetime-local"
                  value={form.dateTime}
                  onChange={e => setForm(f => ({ ...f, dateTime: e.target.value }))}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {language === "th" ? "ระยะเวลา (นาที)" : "Duration (min)"}
                </label>
                <Input
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  className="bg-secondary border-border"
                  placeholder="15"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {language === "th" ? "ทิศทาง" : "Direction"}
                </label>
                <Select value={form.direction} onValueChange={v => setForm(f => ({ ...f, direction: v ?? "" }))}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder={language === "th" ? "เลือก" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">{language === "th" ? "โทรเข้า" : "Inbound"}</SelectItem>
                    <SelectItem value="outbound">{language === "th" ? "โทรออก" : "Outbound"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {language === "th" ? "ผลการโทร" : "Outcome"}
                </label>
                <Select value={form.outcome} onValueChange={v => setForm(f => ({ ...f, outcome: v ?? "" }))}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder={language === "th" ? "เลือก" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interested">{language === "th" ? "สนใจ" : "Interested"}</SelectItem>
                    <SelectItem value="not-interested">{language === "th" ? "ไม่สนใจ" : "Not Interested"}</SelectItem>
                    <SelectItem value="callback">{language === "th" ? "ขอโทรกลับ" : "Callback"}</SelectItem>
                    <SelectItem value="voicemail">{language === "th" ? "Voicemail" : "Voicemail"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "th" ? "หมายเหตุ" : "Notes"}
              </label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring/50"
                placeholder={language === "th" ? "รายละเอียดการโทร..." : "Call details..."}
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
        message={language === "th" ? "บันทึกการโทรสำเร็จ!" : "Call logged successfully!"}
      />
    </>
  );
}
