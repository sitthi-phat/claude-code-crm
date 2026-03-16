import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: number | null;
  trendLabel: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  valueColor: string;
  highlight?: boolean;
}

export default function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon: Icon,
  iconColor,
  iconBg,
  valueColor,
  highlight = false,
}: KPICardProps) {
  const isPositive = trend !== null && trend >= 0;

  return (
    <Card className={cn(
      "p-5 bg-card border-border relative overflow-hidden",
      highlight && "border-red-500/30"
    )}>
      {highlight && (
        <div className="absolute top-0 right-0 w-1 h-full bg-red-500/50 rounded-r" />
      )}
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        {trend !== null && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            isPositive ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <div className={cn("text-2xl font-bold mb-1", valueColor)}>{value}</div>
      <div className="text-sm text-foreground font-medium">{title}</div>
      <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
      {trend !== null && trendLabel && (
        <div className="text-xs text-muted-foreground mt-1">{trendLabel}</div>
      )}
    </Card>
  );
}
