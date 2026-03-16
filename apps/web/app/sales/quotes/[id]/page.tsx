import { mockQuotes } from "@/lib/mock-data/quotes";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileText, Printer, Mail, CheckCircle, XCircle, Building2, User, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const statusConfig = {
  draft: { label: "ร่าง", color: "text-slate-400", bg: "bg-slate-400/10" },
  sent: { label: "ส่งแล้ว", color: "text-blue-400", bg: "bg-blue-400/10" },
  approved: { label: "อนุมัติแล้ว", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  rejected: { label: "ปฏิเสธ", color: "text-red-400", bg: "bg-red-400/10" },
  expired: { label: "หมดอายุ", color: "text-amber-400", bg: "bg-amber-400/10" },
};

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = mockQuotes.find(q => q.id === id);
  if (!quote) notFound();

  const sConfig = statusConfig[quote.status];

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <Link href="/sales" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        กลับ
      </Link>

      {/* Quote Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{quote.quoteNumber}</h1>
            <Badge className={cn("border-0 text-sm", sConfig.bg, sConfig.color)}>{sConfig.label}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>{quote.clientName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{quote.contactName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>สร้าง {quote.createdDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>หมดอายุ {quote.validUntil}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {quote.status === "draft" && (
            <Button className="gap-2">
              <Mail className="w-4 h-4" />
              ส่งใบเสนอราคา
            </Button>
          )}
          {quote.status === "sent" && (
            <>
              <Button variant="outline" className="gap-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-400/10">
                <CheckCircle className="w-4 h-4" />
                อนุมัติ
              </Button>
              <Button variant="outline" className="gap-2 border-red-500/30 text-red-400 hover:bg-red-400/10">
                <XCircle className="w-4 h-4" />
                ปฏิเสธ
              </Button>
            </>
          )}
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            พิมพ์
          </Button>
        </div>
      </div>

      {/* Line Items */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-primary" />
            รายการสินค้า / บริการ
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">รายการ</TableHead>
              <TableHead className="text-muted-foreground">รายละเอียด</TableHead>
              <TableHead className="text-muted-foreground text-right">จำนวน</TableHead>
              <TableHead className="text-muted-foreground text-right">หน่วย</TableHead>
              <TableHead className="text-muted-foreground text-right">ราคาต่อหน่วย</TableHead>
              <TableHead className="text-muted-foreground text-right">ส่วนลด</TableHead>
              <TableHead className="text-muted-foreground text-right">รวม</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quote.lineItems.map((item, i) => (
              <TableRow key={item.id} className="border-border hover:bg-secondary/20">
                <TableCell className="font-medium text-foreground">{item.description}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px]">{item.specification}</TableCell>
                <TableCell className="text-right text-foreground">{item.quantity.toLocaleString()}</TableCell>
                <TableCell className="text-right text-muted-foreground">{item.unit}</TableCell>
                <TableCell className="text-right text-foreground">฿{item.unitPrice.toLocaleString()}</TableCell>
                <TableCell className="text-right text-muted-foreground">{item.discount}%</TableCell>
                <TableCell className="text-right font-medium text-foreground">฿{item.total.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Totals */}
        <div className="p-5 border-t border-border">
          <div className="ml-auto max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ราคาก่อน VAT</span>
              <span className="text-foreground">฿{quote.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">VAT 7%</span>
              <span className="text-foreground">฿{quote.vat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-border pt-2">
              <span className="text-foreground">ยอดรวมสุทธิ</span>
              <span className="text-primary">฿{quote.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Notes & Terms */}
      {(quote.notes || quote.terms) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {quote.notes && (
            <Card className="p-5 bg-card border-border">
              <h3 className="font-medium text-foreground mb-2">หมายเหตุ</h3>
              <p className="text-sm text-muted-foreground">{quote.notes}</p>
            </Card>
          )}
          {quote.terms && (
            <Card className="p-5 bg-card border-border">
              <h3 className="font-medium text-foreground mb-2">เงื่อนไขการชำระเงิน</h3>
              <p className="text-sm text-muted-foreground">{quote.terms}</p>
            </Card>
          )}
        </div>
      )}

      {/* Timeline */}
      <Card className="p-5 bg-card border-border">
        <h3 className="font-medium text-foreground mb-4">Timeline</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
            <span className="text-muted-foreground">สร้างใบเสนอราคา:</span>
            <span className="text-foreground">{quote.createdDate}</span>
          </div>
          {quote.sentDate && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
              <span className="text-muted-foreground">ส่งให้ลูกค้า:</span>
              <span className="text-foreground">{quote.sentDate}</span>
            </div>
          )}
          {quote.approvedDate && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-muted-foreground">อนุมัติแล้ว:</span>
              <span className="text-foreground">{quote.approvedDate}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <div className={cn("w-2 h-2 rounded-full shrink-0", new Date(quote.validUntil) < new Date("2026-03-16") ? "bg-red-400" : "bg-amber-400")} />
            <span className="text-muted-foreground">หมดอายุ:</span>
            <span className={cn("font-medium", new Date(quote.validUntil) < new Date("2026-03-16") ? "text-red-400" : "text-foreground")}>{quote.validUntil}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
