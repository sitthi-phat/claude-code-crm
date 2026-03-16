"use client";

import { useState } from "react";
import { mockSuppliers } from "@/lib/mock-data/inventory";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Search, Plus, Mail, Phone, Star, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SuppliersPage() {
  const [search, setSearch] = useState("");

  const filtered = mockSuppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contactName.toLowerCase().includes(search.toLowerCase()) ||
    s.category.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ซัพพลายเออร์</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockSuppliers.length} ราย</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          เพิ่มซัพพลายเออร์
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="ค้นหาซัพพลายเออร์..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-secondary border-border" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map(supplier => (
          <Card key={supplier.id} className="p-5 bg-card border-border hover:border-primary/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{supplier.name}</h3>
                  <Badge className={cn("text-xs border-0", supplier.status === "active" ? "bg-emerald-400/10 text-emerald-400" : "bg-slate-400/10 text-slate-400")}>
                    {supplier.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground mb-3">{supplier.contactName}</div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <a href={`mailto:${supplier.email}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-blue-400 transition-colors">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{supplier.email}</span>
                  </a>
                  <a href={`tel:${supplier.phone}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-emerald-400 transition-colors">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{supplier.phone}</span>
                  </a>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="line-clamp-1">{supplier.address}</span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {supplier.category.map(cat => (
                    <span key={cat} className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">{cat}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {supplier.rating}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Rating</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {supplier.leadTimeDays} วัน
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Lead Time</div>
              </div>
              <div className="text-center">
                <div className="text-foreground font-semibold">{supplier.paymentTerms}</div>
                <div className="text-xs text-muted-foreground mt-0.5">การชำระ</div>
              </div>
            </div>

            {supplier.notes && (
              <div className="mt-3 p-2 bg-secondary/30 rounded text-xs text-muted-foreground">{supplier.notes}</div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
