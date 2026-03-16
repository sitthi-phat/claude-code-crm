"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toast } from "@/components/ui/toast-simple";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { mockCompanies } from "@/lib/mock-data/clients";

interface LineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

interface DraftQuoteModalProps {
  open: boolean;
  onClose: () => void;
}

export function DraftQuoteModal({ open, onClose }: DraftQuoteModalProps) {
  const { t, language } = useLanguage();
  const [client, setClient] = useState("");
  const [title, setTitle] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "", qty: 1, unitPrice: 0 }
  ]);
  const [toast, setToast] = useState(false);

  if (!open) return null;

  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now().toString(), description: "", qty: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const subtotal = items.reduce((sum, i) => sum + (i.qty * i.unitPrice), 0);
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  const handleSave = () => {
    setToast(true);
    setTimeout(() => {
      onClose();
      setClient(""); setTitle(""); setValidUntil("");
      setItems([{ id: "1", description: "", qty: 1, unitPrice: 0 }]);
    }, 1200);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto">
        <div className="bg-background border border-border rounded-xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">{t("draftQuote")}</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Client */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {language === "th" ? "ลูกค้า" : "Client"}
                </label>
                <Select value={client} onValueChange={v => setClient(v ?? "")}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder={language === "th" ? "เลือกลูกค้า" : "Select client"} />
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
                  {language === "th" ? "หมดอายุ" : "Valid Until"}
                </label>
                <Input
                  type="date"
                  value={validUntil}
                  onChange={e => setValidUntil(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "th" ? "หัวข้อใบเสนอราคา" : "Quote Title"}
              </label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="bg-secondary border-border"
                placeholder={language === "th" ? "เช่น โบรชัวร์ A4 10,000 ชิ้น" : "e.g. A4 Brochure 10,000 pcs"}
              />
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "th" ? "รายการสินค้า" : "Line Items"}
              </label>

              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="text-left text-xs text-muted-foreground px-3 py-2 font-medium">
                        {language === "th" ? "รายละเอียด" : "Description"}
                      </th>
                      <th className="text-right text-xs text-muted-foreground px-3 py-2 font-medium w-20">
                        {language === "th" ? "จำนวน" : "Qty"}
                      </th>
                      <th className="text-right text-xs text-muted-foreground px-3 py-2 font-medium w-28">
                        {language === "th" ? "ราคา/หน่วย" : "Unit Price"}
                      </th>
                      <th className="text-right text-xs text-muted-foreground px-3 py-2 font-medium w-24">
                        {language === "th" ? "รวม" : "Total"}
                      </th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map(item => (
                      <tr key={item.id}>
                        <td className="px-3 py-1.5">
                          <Input
                            value={item.description}
                            onChange={e => updateItem(item.id, "description", e.target.value)}
                            className="bg-transparent border-0 p-0 h-7 focus-visible:ring-0 text-sm"
                            placeholder={language === "th" ? "รายละเอียด..." : "Description..."}
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <Input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={e => updateItem(item.id, "qty", Number(e.target.value))}
                            className="bg-transparent border-0 p-0 h-7 focus-visible:ring-0 text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <Input
                            type="number"
                            min="0"
                            value={item.unitPrice}
                            onChange={e => updateItem(item.id, "unitPrice", Number(e.target.value))}
                            className="bg-transparent border-0 p-0 h-7 focus-visible:ring-0 text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-1.5 text-right text-foreground font-medium text-xs">
                          ฿{(item.qty * item.unitPrice).toLocaleString()}
                        </td>
                        <td className="px-2 py-1.5">
                          {items.length > 1 && (
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={addItem}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {language === "th" ? "เพิ่มรายการ" : "Add Item"}
              </button>
            </div>

            {/* Totals */}
            <div className="bg-secondary/50 rounded-lg p-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{language === "th" ? "ยอดรวม" : "Subtotal"}</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VAT 7%</span>
                <span>฿{vat.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground border-t border-border pt-1.5">
                <span>{language === "th" ? "รวมทั้งหมด" : "Total"} (THB)</span>
                <span className="text-primary">฿{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
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
        message={language === "th" ? "บันทึกใบเสนอราคาสำเร็จ!" : "Quote saved successfully!"}
      />
    </>
  );
}
