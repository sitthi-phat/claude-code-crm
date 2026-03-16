"use client";

import { AIInsight } from "@/lib/mock-data/ai-insights";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, AlertTriangle, TrendingUp, Lightbulb, Bell, X, Mail, Phone, ShoppingCart, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const insightConfig = {
  risk: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-500/20", badge: "bg-red-400/15 text-red-400" },
  opportunity: { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/20", badge: "bg-emerald-400/15 text-emerald-400" },
  alert: { icon: Bell, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/20", badge: "bg-amber-400/15 text-amber-400" },
  recommendation: { icon: Lightbulb, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-500/20", badge: "bg-blue-400/15 text-blue-400" },
  action: { icon: Bot, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-500/20", badge: "bg-purple-400/15 text-purple-400" },
};

const priorityLabel = {
  critical: "วิกฤต",
  high: "สูง",
  medium: "กลาง",
  low: "ต่ำ",
};

const actionIcons: Record<string, React.ElementType> = {
  mail: Mail,
  phone: Phone,
  "shopping-cart": ShoppingCart,
  package: Package,
  bell: Bell,
};

interface Props {
  insights: AIInsight[];
}

export default function AIInsightsFeed({ insights }: Props) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = insights.filter(i => !dismissed.includes(i.id)).slice(0, 4);

  return (
    <Card className="p-5 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-400/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <h2 className="font-semibold text-foreground">AI Agent Insights</h2>
          <Badge variant="secondary" className="text-xs bg-purple-400/15 text-purple-400 border-0">
            {visible.length} รายการ
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            ไม่มีการแจ้งเตือนใหม่
          </div>
        )}
        {visible.map((insight) => {
          const config = insightConfig[insight.type];
          const TypeIcon = config.icon;

          return (
            <div
              key={insight.id}
              className={cn(
                "rounded-lg p-4 border transition-all",
                config.border,
                insight.priority === "critical" ? "bg-red-400/5" : "bg-card/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", config.bg)}>
                  <TypeIcon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{insight.title}</span>
                      <Badge className={cn("text-xs border-0 shrink-0", config.badge)}>
                        {priorityLabel[insight.priority]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        เชื่อมั่น {insight.confidence}%
                      </span>
                    </div>
                    <button
                      onClick={() => setDismissed(d => [...d, insight.id])}
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{insight.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {insight.suggestedActions.slice(0, 3).map((action, i) => {
                      const ActionIcon = actionIcons[action.icon || ""] || Bot;
                      return (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1.5 border-border hover:bg-secondary"
                        >
                          <ActionIcon className="w-3 h-3" />
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
