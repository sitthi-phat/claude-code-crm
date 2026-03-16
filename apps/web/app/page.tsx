import { kpiData } from "@/lib/mock-data/analytics";
import { mockAIInsights } from "@/lib/mock-data/ai-insights";
import { mockTasks } from "@/lib/mock-data/tasks";
import { mockActivities } from "@/lib/mock-data/activities";
import KPICard from "@/components/dashboard/KPICard";
import AIInsightsFeed from "@/components/dashboard/AIInsightsFeed";
import TasksList from "@/components/dashboard/TasksList";
import ActivityStream from "@/components/dashboard/ActivityStream";
import QuickAddButtons from "@/components/dashboard/QuickAddButtons";
import { Printer, TrendingUp, Clock, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const urgentTasks = mockTasks.filter(t => t.priority === "urgent" && t.status !== "completed").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">แดชบอร์ด</h1>
          <p className="text-sm text-muted-foreground mt-1">
            วันจันทร์ที่ 16 มีนาคม 2569 • ภาพรวมธุรกิจพิมพ์
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ระบบทำงานปกติ</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="งานผลิตที่ Active"
          value={kpiData.activeJobs.toString()}
          subtitle="งานในระบบ"
          trend={kpiData.activeJobsTrend}
          trendLabel="vs เดือนที่แล้ว"
          icon={Printer}
          iconColor="text-blue-400"
          iconBg="bg-blue-400/10"
          valueColor="text-blue-400"
        />
        <KPICard
          title="Pipeline รายเดือน"
          value={`฿${(kpiData.monthlyRevenuePipeline / 1000).toFixed(0)}K`}
          subtitle={`Pending ฿${(kpiData.pendingQuotesValue / 1000).toFixed(0)}K • Closed ฿${(kpiData.closedDealsValue / 1000).toFixed(0)}K`}
          trend={12.3}
          trendLabel="vs เดือนที่แล้ว"
          icon={TrendingUp}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-400/10"
          valueColor="text-emerald-400"
        />
        <KPICard
          title="รออนุมัติ"
          value={kpiData.pendingApprovals.toString()}
          subtitle={`${urgentTasks} งานด่วน`}
          trend={null}
          trendLabel=""
          icon={Clock}
          iconColor="text-amber-400"
          iconBg="bg-amber-400/10"
          valueColor="text-amber-400"
          highlight={kpiData.pendingApprovals > 0}
        />
        <KPICard
          title="แจ้งเตือนสต็อก"
          value={kpiData.inventoryAlerts.toString()}
          subtitle="รายการต้องดูแล"
          trend={null}
          trendLabel=""
          icon={AlertTriangle}
          iconColor="text-red-400"
          iconBg="bg-red-400/10"
          valueColor="text-red-400"
          highlight={kpiData.inventoryAlerts > 3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - AI Insights + Activity */}
        <div className="xl:col-span-2 space-y-6">
          <AIInsightsFeed insights={mockAIInsights} />
          <ActivityStream activities={mockActivities} />
        </div>

        {/* Right Column - Tasks */}
        <div className="space-y-6">
          <TasksList tasks={mockTasks} />
        </div>
      </div>

      {/* Quick Add FAB */}
      <QuickAddButtons />
    </div>
  );
}
