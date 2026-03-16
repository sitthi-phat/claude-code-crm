"use client";

import { useState } from "react";
import { mockMaterials } from "@/lib/mock-data/inventory";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Search, AlertTriangle, AlertCircle, ShoppingCart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const stockStatusConfig = {
  "in-stock": { label: "มีสต็อก", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  "low-stock": { label: "สต็อกต่ำ", color: "text-amber-400", bg: "bg-amber-400/10" },
  critical: { label: "วิกฤต", color: "text-red-400", bg: "bg-red-400/10" },
  "out-of-stock": { label: "หมดสต็อก", color: "text-red-500", bg: "bg-red-500/15" },
};

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [...new Set(mockMaterials.map(m => m.category))];

  const filtered = mockMaterials.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.sku.toLowerCase().includes(search.toLowerCase()) ||
      m.supplier.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || m.stockStatus === statusFilter;
    const matchCategory = categoryFilter === "all" || m.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const alertCount = mockMaterials.filter(m => m.stockStatus !== "in-stock").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">วัตถุดิบ</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mockMaterials.length} รายการ •
            <span className="text-red-400 ml-1">{alertCount} รายการต้องดูแล</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-400/10">
            <ShoppingCart className="w-4 h-4" />
            สั่งซื้อทั้งหมด ({alertCount})
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            เพิ่มวัตถุดิบ
          </Button>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(stockStatusConfig).map(([key, cfg]) => {
          const count = mockMaterials.filter(m => m.stockStatus === key).length;
          return (
            <Card key={key} className={cn("p-4 bg-card border-border text-center cursor-pointer transition-all hover:border-primary/30",
              statusFilter === key && "border-primary/50 bg-secondary/30"
            )} onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}>
              <div className={cn("text-2xl font-bold", cfg.color)}>{count}</div>
              <div className="text-xs text-muted-foreground mt-1">{cfg.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="ค้นหาชื่อ, SKU, ซัพพลายเออร์..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-secondary border-border" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-40 bg-secondary border-border">
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสถานะ</SelectItem>
            <SelectItem value="in-stock">มีสต็อก</SelectItem>
            <SelectItem value="low-stock">สต็อกต่ำ</SelectItem>
            <SelectItem value="critical">วิกฤต</SelectItem>
            <SelectItem value="out-of-stock">หมดสต็อก</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? "all")}>
          <SelectTrigger className="w-40 bg-secondary border-border">
            <SelectValue placeholder="หมวดหมู่" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">ชื่อ / SKU</TableHead>
              <TableHead className="text-muted-foreground">หมวดหมู่</TableHead>
              <TableHead className="text-muted-foreground text-right">สต็อกปัจจุบัน</TableHead>
              <TableHead className="text-muted-foreground text-right">ขั้นต่ำ</TableHead>
              <TableHead className="text-muted-foreground text-right">ต้นทุน/หน่วย</TableHead>
              <TableHead className="text-muted-foreground">ซัพพลายเออร์</TableHead>
              <TableHead className="text-muted-foreground">ที่เก็บ</TableHead>
              <TableHead className="text-muted-foreground">สถานะ</TableHead>
              <TableHead className="text-muted-foreground text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(material => {
              const sConfig = stockStatusConfig[material.stockStatus];
              const stockPercent = Math.min(100, (material.currentStock / material.maxStock) * 100);

              return (
                <TableRow key={material.id} className="border-border hover:bg-secondary/20">
                  <TableCell>
                    <div className="font-medium text-foreground">{material.name}</div>
                    <div className="text-xs font-mono text-muted-foreground">{material.sku}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">
                      {material.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={cn("font-medium", sConfig.color)}>
                      {material.currentStock} {material.unit}
                    </div>
                    <div className="w-full bg-border rounded-full h-1 mt-1">
                      <div
                        className={cn("h-1 rounded-full", material.stockStatus === "in-stock" ? "bg-emerald-400" : material.stockStatus === "low-stock" ? "bg-amber-400" : "bg-red-400")}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{material.minStock} {material.unit}</TableCell>
                  <TableCell className="text-right text-foreground">฿{material.unitCost.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{material.supplier}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">{material.location}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("border-0 text-xs", sConfig.bg, sConfig.color)}>
                      {material.stockStatus !== "in-stock" && (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {sConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {material.stockStatus !== "in-stock" && (
                      <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                        <ShoppingCart className="w-3 h-3" />
                        สั่งซื้อ
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
