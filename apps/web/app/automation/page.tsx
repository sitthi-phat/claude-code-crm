"use client";

import { useState } from "react";
import { monthlyRevenueData, dealWinRateData, topClientsData, productionTrendData } from "@/lib/mock-data/analytics";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, BarChart3, Zap, Settings, Mail, Phone, MessageSquare, TrendingUp, FileText, ShoppingCart, RefreshCw } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  LineChart, Line, Area, AreaChart
} from "recharts";
import { cn } from "@/lib/utils";

const workflows = [
  { id: "w1", name: "ส่ง Quote Follow-up อัตโนมัติ", description: "ส่งอีเมลติดตามใบเสนอราคาที่ไม่มีการตอบรับภายใน 3 วัน", trigger: "Quote ไม่ตอบรับ 3 วัน", action: "ส่งอีเมล", enabled: true, icon: Mail, runs: 12 },
  { id: "w2", name: "แจ้งเตือนสต็อกต่ำ", description: "แจ้งเตือนทีมจัดซื้อเมื่อสต็อกวัตถุดิบต่ำกว่าระดับขั้นต่ำ", trigger: "สต็อก < ขั้นต่ำ", action: "แจ้งเตือน + สร้าง PO", enabled: true, icon: ShoppingCart, runs: 8 },
  { id: "w3", name: "LINE Notification: งานเสร็จ", description: "ส่ง LINE แจ้งลูกค้าเมื่องานเสร็จและพร้อมจัดส่ง", trigger: "Job เข้า Shipping", action: "ส่ง LINE", enabled: true, icon: MessageSquare, runs: 25 },
  { id: "w4", name: "รายงาน Weekly สรุปยอดขาย", description: "สร้างและส่งรายงานสรุปยอดขายประจำสัปดาห์ให้ทีมผู้บริหาร", trigger: "ทุกวันจันทร์ 08:00", action: "ส่งอีเมล", enabled: true, icon: BarChart3, runs: 6 },
  { id: "w5", name: "Re-engagement Campaign", description: "ส่งโปรโมชั่นให้ลูกค้าที่ไม่ได้สั่งงานเกิน 60 วัน", trigger: "ไม่มีงาน 60 วัน", action: "ส่งอีเมล + สร้าง Task", enabled: false, icon: RefreshCw, runs: 3 },
  { id: "w6", name: "Proof Reminder", description: "แจ้งเตือนลูกค้าให้อนุมัติ proof ภายใน 48 ชั่วโมง", trigger: "ส่ง Proof ไป 48 ชม.", action: "ส่ง LINE + อีเมล", enabled: true, icon: FileText, runs: 18 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function formatTHB(value: number) {
  if (value >= 1000000) return `฿${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `฿${(value / 1000).toFixed(0)}K`;
  return `฿${value}`;
}

export default function AutomationPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(workflows.map(w => [w.id, w.enabled]))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Automation & AI Hub</h1>
        <p className="text-sm text-muted-foreground mt-1">
          จัดการ Workflow อัตโนมัติและดูรายงานวิเคราะห์ธุรกิจ
        </p>
      </div>

      <Tabs defaultValue="workflows">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="workflows">Agent Workflows</TabsTrigger>
          <TabsTrigger value="analytics">รายงาน & Analytics</TabsTrigger>
        </TabsList>

        {/* Workflows */}
        <TabsContent value="workflows" className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-card border-border text-center">
              <div className="text-2xl font-bold text-emerald-400">{Object.values(toggles).filter(Boolean).length}</div>
              <div className="text-xs text-muted-foreground mt-1">Workflows Active</div>
            </Card>
            <Card className="p-4 bg-card border-border text-center">
              <div className="text-2xl font-bold text-blue-400">{workflows.reduce((s, w) => s + w.runs, 0)}</div>
              <div className="text-xs text-muted-foreground mt-1">รันทั้งเดือน</div>
            </Card>
            <Card className="p-4 bg-card border-border text-center">
              <div className="text-2xl font-bold text-purple-400">฿0</div>
              <div className="text-xs text-muted-foreground mt-1">ค่าใช้จ่าย API</div>
            </Card>
          </div>

          <div className="space-y-3">
            {workflows.map(workflow => {
              const Icon = workflow.icon;
              const isEnabled = toggles[workflow.id];

              return (
                <Card key={workflow.id} className={cn("p-5 bg-card border-border transition-all", isEnabled ? "" : "opacity-60")}>
                  <div className="flex items-start gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", isEnabled ? "bg-primary/10" : "bg-secondary")}>
                      <Icon className={cn("w-5 h-5", isEnabled ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{workflow.name}</span>
                        <Badge className={cn("text-xs border-0", isEnabled ? "bg-emerald-400/10 text-emerald-400" : "bg-slate-400/10 text-slate-400")}>
                          {isEnabled ? "เปิดใช้งาน" : "ปิด"}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">รัน {workflow.runs} ครั้ง/เดือน</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>Trigger: {workflow.trigger}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bot className="w-3 h-3 text-blue-400" />
                          <span>Action: {workflow.action}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Settings className="w-3.5 h-3.5 mr-1" />
                        ตั้งค่า
                      </Button>
                      <button
                        onClick={() => setToggles(t => ({ ...t, [workflow.id]: !t[workflow.id] }))}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all duration-200 relative",
                          isEnabled ? "bg-primary" : "bg-secondary border border-border"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200",
                          isEnabled ? "left-7" : "left-1"
                        )} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-4 space-y-6">
          {/* Monthly Revenue */}
          <Card className="p-5 bg-card border-border">
            <h2 className="font-semibold text-foreground mb-1">รายได้รายเดือน vs เป้าหมาย</h2>
            <p className="text-xs text-muted-foreground mb-4">6 เดือนย้อนหลัง</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenueData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.03 240)" />
                <XAxis dataKey="month" tick={{ fill: "oklch(0.65 0.015 240)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `฿${(v / 1000).toFixed(0)}K`} tick={{ fill: "oklch(0.65 0.015 240)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "oklch(0.16 0.025 240)", border: "1px solid oklch(0.25 0.03 240)", borderRadius: "8px" }}
                  labelStyle={{ color: "oklch(0.96 0.005 240)" }}
                  formatter={(value) => [`฿${Number(value).toLocaleString()}`, ""]}
                />
                <Legend wrapperStyle={{ color: "oklch(0.65 0.015 240)", fontSize: 12 }} />
                <Bar dataKey="revenue" name="รายได้จริง" fill="oklch(0.65 0.2 250)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="เป้าหมาย" fill="oklch(0.22 0.03 240)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Win Rate */}
            <Card className="p-5 bg-card border-border">
              <h2 className="font-semibold text-foreground mb-1">อัตราการปิดดีล</h2>
              <p className="text-xs text-muted-foreground mb-4">Win Rate Analysis</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={dealWinRateData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {dealWinRateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "oklch(0.16 0.025 240)", border: "1px solid oklch(0.25 0.03 240)", borderRadius: "8px" }}
                    formatter={(value) => [`${value}%`, ""]}
                  />
                  <Legend wrapperStyle={{ color: "oklch(0.65 0.015 240)", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Production Trend */}
            <Card className="p-5 bg-card border-border">
              <h2 className="font-semibold text-foreground mb-1">แนวโน้มงานผลิต</h2>
              <p className="text-xs text-muted-foreground mb-4">7 สัปดาห์ย้อนหลัง</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={productionTrendData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.03 240)" />
                  <XAxis dataKey="week" tick={{ fill: "oklch(0.65 0.015 240)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "oklch(0.65 0.015 240)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "oklch(0.16 0.025 240)", border: "1px solid oklch(0.25 0.03 240)", borderRadius: "8px" }}
                    labelStyle={{ color: "oklch(0.96 0.005 240)" }}
                  />
                  <Area type="monotone" dataKey="completed" name="เสร็จแล้ว" stroke="#10b981" fill="url(#colorCompleted)" strokeWidth={2} />
                  <Line type="monotone" dataKey="started" name="เริ่มใหม่" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Top Clients */}
          <Card className="p-5 bg-card border-border">
            <h2 className="font-semibold text-foreground mb-4">Top Clients by Revenue</h2>
            <div className="space-y-3">
              {topClientsData.map((client, i) => {
                const maxRevenue = topClientsData[0].revenue;
                const width = (client.revenue / maxRevenue) * 100;

                return (
                  <div key={client.clientId} className="flex items-center gap-4">
                    <div className="w-6 text-center text-sm font-bold text-muted-foreground shrink-0">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground truncate">{client.clientName}</span>
                        <span className="text-sm font-bold text-emerald-400 shrink-0 ml-4">
                          ฿{(client.revenue / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/60"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{client.jobs} งาน</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
