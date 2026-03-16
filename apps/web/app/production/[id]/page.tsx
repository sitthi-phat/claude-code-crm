import { mockJobs } from "@/lib/mock-data/jobs";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Printer, Calendar, User, AlertCircle, CheckCircle, FileCheck, Package, Truck, Layers, Building2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stageConfig = {
  "pre-press": { label: "Pre-press", color: "text-purple-400", bg: "bg-purple-400/10" },
  printing: { label: "พิมพ์", color: "text-blue-400", bg: "bg-blue-400/10" },
  finishing: { label: "Finishing", color: "text-amber-400", bg: "bg-amber-400/10" },
  shipping: { label: "จัดส่ง", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  done: { label: "เสร็จแล้ว", color: "text-emerald-400", bg: "bg-emerald-400/10" },
};

const priorityConfig = {
  urgent: { label: "ด่วนมาก", color: "text-red-400", bg: "bg-red-400/10" },
  high: { label: "สูง", color: "text-amber-400", bg: "bg-amber-400/10" },
  normal: { label: "ปกติ", color: "text-blue-400", bg: "bg-blue-400/10" },
  low: { label: "ต่ำ", color: "text-slate-400", bg: "bg-slate-400/10" },
};

const allStages = ["pre-press", "printing", "finishing", "shipping", "done"];

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = mockJobs.find(j => j.id === id);
  if (!job) notFound();

  const sConfig = stageConfig[job.stage];
  const pConfig = priorityConfig[job.priority];
  const currentStageIdx = allStages.indexOf(job.stage);

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <Link href="/production" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        กลับ
      </Link>

      {/* Header */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Printer className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-xs font-mono text-muted-foreground mb-1">{job.jobNumber}</div>
                <h1 className="text-xl font-bold text-foreground">{job.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap ml-15">
              <Badge className={cn("border-0", sConfig.bg, sConfig.color)}>{sConfig.label}</Badge>
              <Badge className={cn("border-0", pConfig.bg, pConfig.color)}>Priority: {pConfig.label}</Badge>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-emerald-400">฿{job.value.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">มูลค่างาน</div>
            {job.stage !== "done" && (
              <Button variant="outline" className="mt-3 text-sm">อัพเดทสถานะ</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-border">
          <div>
            <div className="text-xs text-muted-foreground mb-1">ลูกค้า</div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
              {job.clientName}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">ผู้รับผิดชอบ</div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              {job.assignedTo}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">วันเริ่ม</div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              {job.startDate}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">กำหนดส่ง</div>
            <div className={cn("flex items-center gap-1.5 text-sm font-medium", new Date(job.dueDate) < new Date("2026-03-16") && job.stage !== "done" ? "text-red-400" : "text-foreground")}>
              <Calendar className="w-3.5 h-3.5" />
              {job.dueDate}
            </div>
          </div>
        </div>
      </Card>

      {/* Stage Progress */}
      <Card className="p-5 bg-card border-border">
        <h2 className="font-semibold text-foreground mb-4">ขั้นตอนการผลิต</h2>
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-border" />
          {allStages.map((s, i) => {
            const sCfg = stageConfig[s as keyof typeof stageConfig];
            const isCompleted = i < currentStageIdx;
            const isCurrent = i === currentStageIdx;
            const icons = [Layers, Printer, Package, Truck, CheckCircle];
            const StageIcon = icons[i];

            return (
              <div key={s} className="flex flex-col items-center gap-2 relative z-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2",
                  isCompleted ? "bg-emerald-400/20 border-emerald-400" :
                  isCurrent ? `${sCfg.bg} border-current` :
                  "bg-card border-border"
                )}>
                  <StageIcon className={cn("w-4 h-4", isCompleted ? "text-emerald-400" : isCurrent ? sCfg.color : "text-muted-foreground")} />
                </div>
                <span className={cn("text-xs", isCurrent ? sCfg.color : isCompleted ? "text-emerald-400" : "text-muted-foreground")}>
                  {sCfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Status Checks */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-5 bg-card border-border">
          <h3 className="font-medium text-foreground mb-3">สถานะเอกสาร</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {job.filesReceived ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
              <span className={cn("text-sm", job.filesReceived ? "text-foreground" : "text-red-400")}>
                รับไฟล์ Artwork แล้ว
              </span>
            </div>
            <div className="flex items-center gap-3">
              {job.proofApproved ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
              <span className={cn("text-sm", job.proofApproved ? "text-foreground" : "text-amber-400")}>
                ลูกค้าอนุมัติ Proof แล้ว
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-card border-border">
          <h3 className="font-medium text-foreground mb-3">แท็ก</h3>
          <div className="flex flex-wrap gap-2">
            {job.tags.map(tag => (
              <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </Card>
      </div>

      {/* Description & Line Items */}
      <Card className="p-5 bg-card border-border">
        <h3 className="font-medium text-foreground mb-3">รายละเอียดงาน</h3>
        <p className="text-sm text-muted-foreground mb-5">{job.description}</p>
        <h3 className="font-medium text-foreground mb-3">รายการต้นทุน</h3>
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">รายการ</TableHead>
              <TableHead className="text-right text-muted-foreground">จำนวน</TableHead>
              <TableHead className="text-right text-muted-foreground">หน่วย</TableHead>
              <TableHead className="text-right text-muted-foreground">ราคา/หน่วย</TableHead>
              <TableHead className="text-right text-muted-foreground">รวม</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {job.lineItems.map((item, i) => (
              <TableRow key={i} className="border-border hover:bg-secondary/20">
                <TableCell className="text-foreground">{item.description}</TableCell>
                <TableCell className="text-right text-foreground">{item.quantity.toLocaleString()}</TableCell>
                <TableCell className="text-right text-muted-foreground">{item.unit}</TableCell>
                <TableCell className="text-right text-foreground">฿{item.unitPrice.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium text-emerald-400">฿{item.total.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-3 pt-3 border-t border-border">
          <div className="text-base font-bold">
            <span className="text-muted-foreground mr-4">รวมทั้งสิ้น:</span>
            <span className="text-emerald-400">฿{job.value.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
