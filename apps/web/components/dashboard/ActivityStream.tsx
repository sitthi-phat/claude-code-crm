import { Activity } from "@/lib/mock-data/activities";
import { Card } from "@/components/ui/card";
import { Activity as ActivityIcon, CheckCircle, FileText, Users, Package, DollarSign, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const activityConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  job_created: { icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10" },
  job_stage_changed: { icon: ActivityIcon, color: "text-purple-400", bg: "bg-purple-400/10" },
  job_completed: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  quote_sent: { icon: FileText, color: "text-amber-400", bg: "bg-amber-400/10" },
  quote_approved: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  quote_rejected: { icon: FileText, color: "text-red-400", bg: "bg-red-400/10" },
  client_added: { icon: Users, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  call_logged: { icon: Phone, color: "text-blue-400", bg: "bg-blue-400/10" },
  email_sent: { icon: Mail, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  payment_received: { icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  inventory_alert: { icon: Package, color: "text-red-400", bg: "bg-red-400/10" },
  note_added: { icon: FileText, color: "text-slate-400", bg: "bg-slate-400/10" },
};

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date("2026-03-16T10:00:00");
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  return `${days} วันที่แล้ว`;
}

interface Props {
  activities: Activity[];
}

export default function ActivityStream({ activities }: Props) {
  const sorted = [...activities].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 8);

  return (
    <Card className="p-5 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <ActivityIcon className="w-4.5 h-4.5 text-primary" />
        <h2 className="font-semibold text-foreground">กิจกรรมล่าสุด</h2>
      </div>

      <div className="space-y-1">
        {sorted.map((activity, i) => {
          const config = activityConfig[activity.type] || activityConfig.note_added;
          const Icon = config.icon;

          return (
            <div key={activity.id} className="flex items-start gap-3 py-2.5 group">
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5", config.bg)}>
                <Icon className={cn("w-3.5 h-3.5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">{activity.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-1">
                  {activity.description}
                </p>
              </div>
              <div className="text-xs text-muted-foreground shrink-0 mt-0.5">
                {formatTime(activity.timestamp)}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
