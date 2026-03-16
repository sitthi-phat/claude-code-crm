"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toast } from "@/components/ui/toast-simple";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AddMaterialModalProps {
  open: boolean;
  onClose: () => void;
}

const mockSuppliers = [
  { id: "s1", name: "Thai Paper Supply Co., Ltd." },
  { id: "s2", name: "Ink Master Thailand" },
  { id: "s3", name: "PrintPack Solutions" },
  { id: "s4", name: "Paper World Co., Ltd." },
  { id: "s5", name: "Binding & Finishing Pro" },
];

export function AddMaterialModal({ open, onClose }: AddMaterialModalProps) {
  const { t, language } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "",
    currentStock: "",
    minStock: "",
    unitCost: "",
    supplier: "",
  });
  const [toast, setToast] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    setToast(true);
    setTimeout(() => {
      onClose();
      setForm({ name: "", category: "", unit: "", currentStock: "", minStock: "", unitCost: "", supplier: "" });
    }, 1200);
  };

  const L = (th: string, en: string) => language === "th" ? th : en;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
        <div className="bg-background border border-border rounded-xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">{t("addMaterial")}</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{L("ชื่อวัตถุดิบ", "Material Name")}</label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="bg-secondary border-border"
                placeholder={L("เช่น กระดาษ Art Coated 150g", "e.g. Art Coated Paper 150g")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{L("หมวดหมู่", "Category")}</label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v ?? "" }))}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder={L("เลือก", "Select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paper">{L("กระดาษ", "Paper")}</SelectItem>
                    <SelectItem value="ink">{L("หมึก", "Ink")}</SelectItem>
                    <SelectItem value="binding">{L("การเข้าเล่ม", "Binding")}</SelectItem>
                    <SelectItem value="finishing">{L("การตกแต่ง", "Finishing")}</SelectItem>
                    <SelectItem value="packaging">{L("บรรจุภัณฑ์", "Packaging")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{L("หน่วย", "Unit")}</label>
                <Select value={form.unit} onValueChange={v => setForm(f => ({ ...f, unit: v ?? "" }))}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder={L("เลือก", "Select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ream">{L("รีม", "Ream")}</SelectItem>
                    <SelectItem value="kg">Kg</SelectItem>
                    <SelectItem value="liter">{L("ลิตร", "Liter")}</SelectItem>
                    <SelectItem value="roll">{L("ม้วน", "Roll")}</SelectItem>
                    <SelectItem value="box">{L("กล่อง", "Box")}</SelectItem>
                    <SelectItem value="sheet">{L("แผ่น", "Sheet")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{L("สต็อกปัจจุบัน", "Current Stock")}</label>
                <Input
                  type="number"
                  min="0"
                  value={form.currentStock}
                  onChange={e => setForm(f => ({ ...f, currentStock: e.target.value }))}
                  className="bg-secondary border-border"
                  placeholder="100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{L("สต็อกขั้นต่ำ", "Min Stock")}</label>
                <Input
                  type="number"
                  min="0"
                  value={form.minStock}
                  onChange={e => setForm(f => ({ ...f, minStock: e.target.value }))}
                  className="bg-secondary border-border"
                  placeholder="20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{L("ต้นทุน/หน่วย (THB)", "Unit Cost (THB)")}</label>
              <Input
                type="number"
                min="0"
                value={form.unitCost}
                onChange={e => setForm(f => ({ ...f, unitCost: e.target.value }))}
                className="bg-secondary border-border"
                placeholder="250"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{L("ซัพพลายเออร์", "Supplier")}</label>
              <Select value={form.supplier} onValueChange={v => setForm(f => ({ ...f, supplier: v ?? "" }))}>
                <SelectTrigger className="w-full bg-secondary border-border">
                  <SelectValue placeholder={L("เลือกซัพพลายเออร์", "Select supplier")} />
                </SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        message={language === "th" ? "เพิ่มวัตถุดิบสำเร็จ!" : "Material added successfully!"}
      />
    </>
  );
}
