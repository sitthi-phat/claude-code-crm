"use client";

import { useState } from "react";
import { Plus, UserPlus, FileText, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actions = [
  { icon: UserPlus, label: "ผู้ติดต่อใหม่", color: "bg-blue-500 hover:bg-blue-600" },
  { icon: FileText, label: "ร่างใบเสนอราคา", color: "bg-emerald-500 hover:bg-emerald-600" },
  { icon: Phone, label: "บันทึกการโทร", color: "bg-purple-500 hover:bg-purple-600" },
];

export default function QuickAddButtons() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-50">
      {open && (
        <div className="flex flex-col items-end gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <div key={action.label} className="flex items-center gap-3">
                <span className="text-sm text-foreground bg-card border border-border px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                  {action.label}
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className={cn(
                    "w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-all",
                    action.color
                  )}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-200",
          open ? "bg-red-500 hover:bg-red-600 rotate-45" : "bg-primary hover:bg-primary/90"
        )}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
