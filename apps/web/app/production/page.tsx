"use client";

import { useState } from "react";
import { mockJobs, PrintJob, JobStage } from "@/lib/mock-data/jobs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Calendar, AlertCircle, ChevronRight, Clock, CheckCircle, Package, Truck, Layers, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stages: { id: JobStage; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { id: "pre-press", label: "Pre-press", icon: Layers, color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "printing", label: "พิมพ์", icon: Printer, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "finishing", label: "Finishing", icon: Package, color: "text-amber-400", bg: "bg-amber-400/10" },
  { id: "shipping", label: "จัดส่ง", icon: Truck, color: "text-cyan-400", bg: "bg-cyan-400/10" },
];

const priorityConfig = {
  urgent: { label: "ด่วนมาก", color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30" },
  high: { label: "สูง", color: "text-amber-400", bg: "bg-amber-400/10", border: "" },
  normal: { label: "ปกติ", color: "text-blue-400", bg: "bg-blue-400/10", border: "" },
  low: { label: "ต่ำ", color: "text-slate-400", bg: "bg-slate-400/10", border: "" },
};

function JobCard({ job }: { job: PrintJob }) {
  const pConfig = priorityConfig[job.priority];
  const isOverdue = new Date(job.dueDate) < new Date("2026-03-16");

  return (
    <Link href={`/production/${job.id}`}>
      <div className={cn(
        "bg-card border rounded-lg p-3 hover:border-primary/30 transition-all cursor-pointer group mb-2",
        pConfig.border || "border-border"
      )}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-mono text-muted-foreground">{job.jobNumber}</span>
          <Badge className={cn("text-xs border-0 shrink-0", pConfig.bg, pConfig.color)}>{pConfig.label}</Badge>
        </div>
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {job.title}
        </h3>
        <div className="text-xs text-muted-foreground mb-2">{job.clientName}</div>
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-1 text-xs", isOverdue ? "text-red-400" : "text-muted-foreground")}>
            {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
            <span>{job.dueDate}</span>
          </div>
          <span className="text-xs text-emerald-400 font-medium">฿{(job.value / 1000).toFixed(0)}K</span>
        </div>
        {(!job.proofApproved || !job.filesReceived) && (
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-3 text-xs">
            {!job.filesReceived && <span className="text-red-400">⚠ รอไฟล์</span>}
            {!job.proofApproved && <span className="text-amber-400">⚠ รอ Proof</span>}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function ProductionPage() {
  const activeJobs = mockJobs.filter(j => j.stage !== "done");
  const completedJobs = mockJobs.filter(j => j.stage === "done");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">งานผลิต</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeJobs.length} งาน Active • {completedJobs.length} งานเสร็จแล้ว
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          สร้างงานใหม่
        </Button>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="history">ประวัติงาน</TabsTrigger>
        </TabsList>

        {/* Kanban */}
        <TabsContent value="kanban" className="mt-4">
          <div className="grid grid-cols-4 gap-4 min-h-[600px]">
            {stages.map((stage) => {
              const stageJobs = activeJobs.filter(j => j.stage === stage.id);
              const StageIcon = stage.icon;

              return (
                <div key={stage.id} className="flex flex-col">
                  {/* Column Header */}
                  <div className={cn("flex items-center justify-between p-3 rounded-lg mb-3", stage.bg)}>
                    <div className="flex items-center gap-2">
                      <StageIcon className={cn("w-4 h-4", stage.color)} />
                      <span className={cn("text-sm font-medium", stage.color)}>{stage.label}</span>
                    </div>
                    <Badge className={cn("text-xs border-0", stage.bg, stage.color)}>
                      {stageJobs.length}
                    </Badge>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 space-y-0">
                    {stageJobs.map(job => (
                      <JobCard key={job.id} job={job} />
                    ))}
                    {stageJobs.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground/50 text-xs border-2 border-dashed border-border/30 rounded-lg">
                        ไม่มีงาน
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="mt-4">
          <div className="space-y-3">
            {completedJobs.map(job => (
              <Link key={job.id} href={`/production/${job.id}`}>
                <Card className="p-4 bg-card border-border hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{job.jobNumber}</span>
                        <Badge className="text-xs border-0 bg-emerald-400/10 text-emerald-400">เสร็จแล้ว</Badge>
                      </div>
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">{job.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{job.clientName} • เสร็จ: {job.completedDate}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-medium text-emerald-400">฿{job.value.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{job.assignedTo}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
