"use client";

import { Task } from "@/lib/mock-data/tasks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckSquare, Clock, AlertCircle, Phone, Mail, Package, Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const priorityConfig = {
  urgent: { label: "ด่วนมาก", color: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400" },
  high: { label: "สูง", color: "text-amber-400", bg: "bg-amber-400/10", dot: "bg-amber-400" },
  medium: { label: "กลาง", color: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
  low: { label: "ต่ำ", color: "text-slate-400", bg: "bg-slate-400/10", dot: "bg-slate-400" },
};

const typeIcons = {
  "follow-up": Mail,
  "approval": CheckSquare,
  "call": Phone,
  "meeting": Calendar,
  "delivery": Package,
  "design": CheckSquare,
  "admin": Clock,
};

interface Props {
  tasks: Task[];
}

export default function TasksList({ tasks }: Props) {
  const [completed, setCompleted] = useState<string[]>([]);

  const pending = tasks
    .filter(t => t.status !== "completed" && !completed.includes(t.id))
    .sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 6);

  return (
    <Card className="p-5 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4.5 h-4.5 text-primary" />
          <h2 className="font-semibold text-foreground">งานและ Follow-up</h2>
          <Badge variant="secondary" className="text-xs bg-primary/15 text-primary border-0">
            {pending.length}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground gap-1">
          <Plus className="w-3 h-3" />
          เพิ่ม
        </Button>
      </div>

      <div className="space-y-2">
        {pending.map((task) => {
          const pConfig = priorityConfig[task.priority];
          const TypeIcon = typeIcons[task.type] || Clock;
          const isOverdue = task.status === "overdue";

          return (
            <div
              key={task.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group",
                isOverdue ? "border-red-500/20 bg-red-400/5" : "border-border/50 hover:border-border hover:bg-secondary/30"
              )}
            >
              <button
                onClick={() => setCompleted(c => [...c, task.id])}
                className="w-4 h-4 mt-0.5 rounded border-2 border-muted-foreground/30 hover:border-primary flex-shrink-0 transition-colors"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className={cn("text-sm font-medium leading-snug", isOverdue ? "text-red-400" : "text-foreground")}>
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={cn("text-xs px-1.5 py-0.5 rounded-full", pConfig.bg, pConfig.color)}>
                    {pConfig.label}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className={isOverdue ? "text-red-400 font-medium" : ""}>
                      {task.dueDate}{task.dueTime ? ` ${task.dueTime}` : ""}
                    </span>
                  </div>
                  {task.relatedClientName && (
                    <span className="text-xs text-muted-foreground truncate max-w-[100px]">{task.relatedClientName}</span>
                  )}
                </div>
              </div>
              <TypeIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-60" />
            </div>
          );
        })}

        {pending.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            ไม่มีงานที่รอดำเนินการ
          </div>
        )}
      </div>

      {tasks.filter(t => t.status !== "completed").length > 6 && (
        <Button variant="ghost" size="sm" className="w-full mt-3 text-xs text-muted-foreground">
          ดูงานทั้งหมด ({tasks.filter(t => t.status !== "completed").length} รายการ)
        </Button>
      )}
    </Card>
  );
}
