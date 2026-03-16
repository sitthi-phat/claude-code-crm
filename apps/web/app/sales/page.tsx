"use client";

import { useState } from "react";
import { mockQuotes, mockLeads, mockDeals } from "@/lib/mock-data/quotes";
import { mockCompanies, Company } from "@/lib/mock-data/clients";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, ChevronRight, User, Check, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { DraftQuoteModal } from "@/components/modals/DraftQuoteModal";
import { ClientQuoteSummaryModal } from "@/components/modals/ClientQuoteSummaryModal";

const quoteStatusConfig = {
  draft: { label: "ร่าง", color: "text-slate-400", bg: "bg-slate-400/10" },
  sent: { label: "ส่งแล้ว", color: "text-blue-400", bg: "bg-blue-400/10" },
  approved: { label: "อนุมัติ", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  rejected: { label: "ปฏิเสธ", color: "text-red-400", bg: "bg-red-400/10" },
  expired: { label: "หมดอายุ", color: "text-amber-400", bg: "bg-amber-400/10" },
};

const leadStatusConfig = {
  new: { label: "ใหม่", color: "text-blue-400", bg: "bg-blue-400/10" },
  contacted: { label: "ติดต่อแล้ว", color: "text-purple-400", bg: "bg-purple-400/10" },
  qualified: { label: "คัดเลือกแล้ว", color: "text-amber-400", bg: "bg-amber-400/10" },
  proposal: { label: "เสนอราคาแล้ว", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  lost: { label: "สูญเสีย", color: "text-red-400", bg: "bg-red-400/10" },
};

export default function SalesPage() {
  const [search, setSearch] = useState("");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [clientSummaryOpen, setClientSummaryOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Company | null>(null);
  const { t } = useLanguage();

  const totalPipeline = mockQuotes
    .filter(q => q.status === "sent" || q.status === "draft")
    .reduce((sum, q) => sum + q.total, 0);

  const wonValue = mockDeals.filter(d => d.status === "won").reduce((sum, d) => sum + d.value, 0);
  const winRate = mockDeals.length > 0 ? (mockDeals.filter(d => d.status === "won").length / mockDeals.length * 100).toFixed(0) : 0;

  const openClientSummary = (clientId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const client = mockCompanies.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setClientSummaryOpen(true);
    }
  };

  const openClientSummaryByName = (clientName: string, clientId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const client = mockCompanies.find(c => c.id === clientId) ||
      mockCompanies.find(c => c.name.toLowerCase().includes(clientName.toLowerCase()));
    if (client) {
      setSelectedClient(client);
      setClientSummaryOpen(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("sales")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pipeline รวม ฿{(totalPipeline / 1000).toFixed(0)}K • Win Rate {winRate}%
          </p>
        </div>
        <Button className="gap-2" onClick={() => setQuoteModalOpen(true)}>
          <Plus className="w-4 h-4" />
          {t("createQuote")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border text-center">
          <div className="text-2xl font-bold text-blue-400">{mockLeads.length}</div>
          <div className="text-xs text-muted-foreground mt-1">{t("leads")}</div>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <div className="text-2xl font-bold text-amber-400">{mockQuotes.filter(q => q.status === "sent").length}</div>
          <div className="text-xs text-muted-foreground mt-1">รอตอบรับ</div>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <div className="text-2xl font-bold text-emerald-400">{mockDeals.filter(d => d.status === "won").length}</div>
          <div className="text-xs text-muted-foreground mt-1">Won</div>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <div className="text-2xl font-bold text-emerald-400">฿{(wonValue / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-muted-foreground mt-1">มูลค่า Won</div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="quotes">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="leads">{t("leads")} ({mockLeads.length})</TabsTrigger>
          <TabsTrigger value="quotes">{t("quotes")} ({mockQuotes.length})</TabsTrigger>
          <TabsTrigger value="deals">{t("deals")} ({mockDeals.length})</TabsTrigger>
        </TabsList>

        {/* Leads Tab */}
        <TabsContent value="leads" className="mt-4">
          <div className="space-y-3">
            {mockLeads.map(lead => {
              const sConfig = leadStatusConfig[lead.status as keyof typeof leadStatusConfig];
              const matchedCompany = mockCompanies.find(c =>
                c.name.toLowerCase().includes(lead.companyName.toLowerCase())
              );
              return (
                <Card key={lead.id} className="p-4 bg-card border-border hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {matchedCompany ? (
                          <button
                            className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-2 decoration-dotted"
                            onClick={e => openClientSummary(matchedCompany.id, e)}
                          >
                            {lead.companyName}
                          </button>
                        ) : (
                          <span className="font-medium text-foreground">{lead.companyName}</span>
                        )}
                        <Badge className={cn("text-xs border-0", sConfig.bg, sConfig.color)}>{sConfig.label}</Badge>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">{lead.source}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{lead.contactName}</span>
                        <span>{lead.email}</span>
                        <span>{lead.phone}</span>
                      </div>
                      {lead.notes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{lead.notes}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-medium text-emerald-400">฿{(lead.estimatedValue / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-muted-foreground">ประมาณการ</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setQuoteModalOpen(true)}
                      >
                        {t("createQuote")}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Quotes Tab */}
        <TabsContent value="quotes" className="mt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="ค้นหาใบเสนอราคา..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-secondary border-border" />
            </div>
            <Button className="gap-2 shrink-0" onClick={() => setQuoteModalOpen(true)}>
              <Plus className="w-4 h-4" />
              {t("createQuote")}
            </Button>
          </div>
          <div className="space-y-3">
            {mockQuotes
              .filter(q => q.quoteNumber.toLowerCase().includes(search.toLowerCase()) || q.clientName.toLowerCase().includes(search.toLowerCase()))
              .map(quote => {
                const sConfig = quoteStatusConfig[quote.status];
                return (
                  <Link key={quote.id} href={`/sales/quotes/${quote.id}`}>
                    <Card className="p-4 bg-card border-border hover:border-primary/30 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm text-muted-foreground">{quote.quoteNumber}</span>
                            <Badge className={cn("text-xs border-0", sConfig.bg, sConfig.color)}>{sConfig.label}</Badge>
                          </div>
                          <button
                            className="font-medium text-foreground hover:text-primary transition-colors text-left underline underline-offset-2 decoration-dotted"
                            onClick={e => openClientSummaryByName(quote.clientName, quote.clientId, e)}
                          >
                            {quote.clientName}
                          </button>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {quote.contactName} • สร้าง {quote.createdDate} • หมดอายุ {quote.validUntil}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-lg font-bold text-foreground">฿{quote.total.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">รวม VAT</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </TabsContent>

        {/* Deals Tab */}
        <TabsContent value="deals" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                <Check className="w-4 h-4" /> Won ({mockDeals.filter(d => d.status === "won").length})
              </h3>
              <div className="space-y-2">
                {mockDeals.filter(d => d.status === "won").map(deal => (
                  <Card key={deal.id} className="p-4 bg-card border-emerald-500/20">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground mb-1">{deal.title}</div>
                        <div className="text-xs text-muted-foreground">
                          <button
                            className="hover:text-primary transition-colors underline underline-offset-2 decoration-dotted"
                            onClick={e => openClientSummaryByName(deal.clientName, deal.clientId, e)}
                          >
                            {deal.clientName}
                          </button>
                          {" • "}{deal.closeDate}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">ดูแลโดย: {deal.assignedTo}</div>
                      </div>
                      <div className="text-emerald-400 font-bold shrink-0">฿{(deal.value / 1000).toFixed(0)}K</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
                <X className="w-4 h-4" /> Lost ({mockDeals.filter(d => d.status === "lost").length})
              </h3>
              <div className="space-y-2">
                {mockDeals.filter(d => d.status === "lost").map(deal => (
                  <Card key={deal.id} className="p-4 bg-card border-red-500/20">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground mb-1">{deal.title}</div>
                        <div className="text-xs text-muted-foreground">
                          <button
                            className="hover:text-primary transition-colors underline underline-offset-2 decoration-dotted"
                            onClick={e => openClientSummaryByName(deal.clientName, deal.clientId, e)}
                          >
                            {deal.clientName}
                          </button>
                          {" • "}{deal.closeDate}
                        </div>
                        {deal.reason && (
                          <div className="text-xs text-red-400 mt-0.5">เหตุผล: {deal.reason}</div>
                        )}
                      </div>
                      <div className="text-red-400 font-bold shrink-0">฿{(deal.value / 1000).toFixed(0)}K</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <DraftQuoteModal open={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />

      <ClientQuoteSummaryModal
        open={clientSummaryOpen}
        onClose={() => setClientSummaryOpen(false)}
        client={selectedClient}
      />
    </div>
  );
}
