"use client";

import { useState } from "react";
import { mockCompanies } from "@/lib/mock-data/clients";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, Plus, ChevronRight, Users, TrendingUp, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NewCompanyModal } from "@/components/modals/NewCompanyModal";

const tierConfig = {
  enterprise: { label: "Enterprise", color: "text-purple-400", bg: "bg-purple-400/10" },
  "mid-market": { label: "Mid-Market", color: "text-blue-400", bg: "bg-blue-400/10" },
  smb: { label: "SMB", color: "text-slate-400", bg: "bg-slate-400/10" },
};

const statusConfig = {
  active: { label: "Active", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  inactive: { label: "Inactive", color: "text-slate-400", bg: "bg-slate-400/10" },
  prospect: { label: "Prospect", color: "text-amber-400", bg: "bg-amber-400/10" },
};

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [newCompanyOpen, setNewCompanyOpen] = useState(false);

  const filtered = mockCompanies.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchTier = tierFilter === "all" || c.tier === tierFilter;
    return matchSearch && matchStatus && matchTier;
  });

  const totalRevenue = mockCompanies.reduce((sum, c) => sum + c.totalRevenue, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">บริษัทและลูกค้า</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mockCompanies.length} บริษัท • มูลค่ารวม ฿{(totalRevenue / 1000000).toFixed(1)}M
          </p>
        </div>
        <Button className="gap-2" onClick={() => setNewCompanyOpen(true)}>
          <Plus className="w-4 h-4" />
          เพิ่มบริษัทใหม่
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border text-center">
          <div className="text-2xl font-bold text-purple-400">{mockCompanies.filter(c => c.tier === "enterprise").length}</div>
          <div className="text-xs text-muted-foreground mt-1">Enterprise</div>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <div className="text-2xl font-bold text-emerald-400">{mockCompanies.filter(c => c.status === "active").length}</div>
          <div className="text-xs text-muted-foreground mt-1">Active</div>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <div className="text-2xl font-bold text-amber-400">{mockCompanies.filter(c => c.status === "prospect").length}</div>
          <div className="text-xs text-muted-foreground mt-1">Prospects</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาบริษัท อุตสาหกรรม..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-36 bg-secondary border-border">
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสถานะ</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tierFilter} onValueChange={(v) => setTierFilter(v ?? "all")}>
          <SelectTrigger className="w-36 bg-secondary border-border">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุก Tier</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="mid-market">Mid-Market</SelectItem>
            <SelectItem value="smb">SMB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Companies List */}
      <div className="space-y-3">
        {filtered.map((company) => {
          const tConfig = tierConfig[company.tier];
          const sConfig = statusConfig[company.status];

          return (
            <Link key={company.id} href={`/clients/${company.id}`}>
              <Card className="p-4 bg-card border-border hover:border-primary/30 hover:bg-card/80 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {company.name}
                      </span>
                      <Badge className={cn("text-xs border-0 shrink-0", tConfig.bg, tConfig.color)}>
                        {tConfig.label}
                      </Badge>
                      <Badge className={cn("text-xs border-0 shrink-0", sConfig.bg, sConfig.color)}>
                        {sConfig.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{company.industry}</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{company.contacts.length} ผู้ติดต่อ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{company.address.split(" ").slice(-2).join(" ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>฿{(company.totalRevenue / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">มูลค่ารวม</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
                {company.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {company.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            ไม่พบบริษัทที่ค้นหา
          </div>
        )}
      </div>

      <NewCompanyModal open={newCompanyOpen} onClose={() => setNewCompanyOpen(false)} />
    </div>
  );
}
