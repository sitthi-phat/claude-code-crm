"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockQuotes } from "@/lib/mock-data/quotes";
import { Company } from "@/lib/mock-data/clients";
import { cn } from "@/lib/utils";
import { ExternalLink, TrendingUp, FileText, BarChart2, X } from "lucide-react";
import Link from "next/link";

interface ClientQuoteSummaryModalProps {
  open: boolean;
  onClose: () => void;
  client: Company | null;
}

const quoteStatusConfig = {
  draft: { label: "ร่าง", color: "text-slate-400", bg: "bg-slate-400/10" },
  sent: { label: "ส่งแล้ว", color: "text-blue-400", bg: "bg-blue-400/10" },
  approved: { label: "อนุมัติ", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  rejected: { label: "ปฏิเสธ", color: "text-red-400", bg: "bg-red-400/10" },
  expired: { label: "หมดอายุ", color: "text-amber-400", bg: "bg-amber-400/10" },
};

const tierConfig = {
  enterprise: { label: "Platinum", color: "text-purple-400", bg: "bg-purple-400/10" },
  "mid-market": { label: "Gold", color: "text-amber-400", bg: "bg-amber-400/10" },
  smb: { label: "Silver", color: "text-slate-400", bg: "bg-slate-400/10" },
};

export function ClientQuoteSummaryModal({ open, onClose, client }: ClientQuoteSummaryModalProps) {
  if (!open || !client) return null;

  const clientQuotes = mockQuotes.filter(q => q.clientId === client.id);
  const totalPipeline = clientQuotes.reduce((sum, q) => sum + q.total, 0);
  const approvedQuotes = clientQuotes.filter(q => q.status === "approved");
  const approvedValue = approvedQuotes.reduce((sum, q) => sum + q.total, 0);
  const sentQuotes = clientQuotes.filter(q => q.status === "sent");
  const winRate = clientQuotes.length > 0
    ? Math.round((approvedQuotes.length / clientQuotes.length) * 100)
    : 0;

  const tConfig = tierConfig[client.tier];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Side Panel — slides in from right */}
      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-xl bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right-4 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-border shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">{client.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge className={cn("border-0 text-xs", tConfig.bg, tConfig.color)}>
                  {tConfig.label}
                </Badge>
                <span className="text-xs text-muted-foreground">{client.industry}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: All Quotes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">ใบเสนอราคาทั้งหมด</h3>
            </div>

            {clientQuotes.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground bg-secondary/30 rounded-lg">
                ยังไม่มีใบเสนอราคา
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="text-left text-xs text-muted-foreground px-3 py-2.5 font-medium">เลขที่</th>
                        <th className="text-left text-xs text-muted-foreground px-3 py-2.5 font-medium">วันที่</th>
                        <th className="text-right text-xs text-muted-foreground px-3 py-2.5 font-medium">มูลค่า</th>
                        <th className="text-center text-xs text-muted-foreground px-3 py-2.5 font-medium">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {clientQuotes.map(quote => {
                        const qConfig = quoteStatusConfig[quote.status];
                        return (
                          <tr key={quote.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{quote.quoteNumber}</td>
                            <td className="px-3 py-2.5 text-xs text-muted-foreground">{quote.createdDate}</td>
                            <td className="px-3 py-2.5 text-right font-semibold text-foreground">
                              ฿{quote.total.toLocaleString()}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <Badge className={cn("text-xs border-0", qConfig.bg, qConfig.color)}>
                                {qConfig.label}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Total Pipeline */}
                <div className="mt-3 flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span>Pipeline รวม</span>
                  </div>
                  <span className="font-bold text-primary">฿{totalPipeline.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>

          {/* Section 2: Quick Stats */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">สรุปข้อมูล</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-400">{sentQuotes.length}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Quotes Sent</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-emerald-400">
                  ฿{(approvedValue / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Approved Value</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-amber-400">{winRate}%</div>
                <div className="text-xs text-muted-foreground mt-0.5">Win Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border shrink-0">
          <Link href={`/clients/${client.id}`} onClick={onClose}>
            <Button className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              ดู Client Profile เต็ม
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
