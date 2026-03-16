"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Plug, Shield, Plus, Edit, Trash2, Check, X, MessageCircle, Mail, Webhook, Globe, Key } from "lucide-react";
import { cn } from "@/lib/utils";

const users = [
  { id: "u1", name: "สมหมาย ขายดี", email: "sommai@printcrm.co.th", role: "Sales", status: "active", avatar: "ส", lastLogin: "2026-03-16" },
  { id: "u2", name: "วันดี มีผล", email: "wandee@printcrm.co.th", role: "Sales", status: "active", avatar: "ว", lastLogin: "2026-03-15" },
  { id: "u3", name: "ช่างพิมพ์ A", email: "press_a@printcrm.co.th", role: "Production", status: "active", avatar: "ช", lastLogin: "2026-03-16" },
  { id: "u4", name: "ช่างพิมพ์ C", email: "press_c@printcrm.co.th", role: "Production", status: "active", avatar: "ช", lastLogin: "2026-03-14" },
  { id: "u5", name: "ช่างดีไซน์ B", email: "design_b@printcrm.co.th", role: "Production", status: "active", avatar: "ด", lastLogin: "2026-03-16" },
  { id: "u6", name: "ผู้ดูแลระบบ", email: "admin@printcrm.co.th", role: "Admin", status: "active", avatar: "ผ", lastLogin: "2026-03-16" },
];

const integrations = [
  {
    id: "i1",
    name: "LINE Official Account",
    description: "เชื่อมต่อ LINE OA สำหรับส่งแจ้งเตือนและรับ order จากลูกค้า",
    icon: MessageCircle,
    connected: true,
    accountName: "@printcrm_official",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10"
  },
  {
    id: "i2",
    name: "Email (SMTP / SendGrid)",
    description: "ระบบส่งอีเมลอัตโนมัติสำหรับ quote, follow-up และแจ้งเตือน",
    icon: Mail,
    connected: true,
    accountName: "noreply@printcrm.co.th",
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    id: "i3",
    name: "n8n Automation",
    description: "เชื่อมต่อ n8n workflow automation สำหรับ automation ขั้นสูง",
    icon: Webhook,
    connected: false,
    accountName: null,
    color: "text-purple-400",
    bg: "bg-purple-400/10"
  },
  {
    id: "i4",
    name: "Google Workspace",
    description: "Sync กับ Google Calendar, Drive และ Sheets",
    icon: Globe,
    connected: false,
    accountName: null,
    color: "text-amber-400",
    bg: "bg-amber-400/10"
  },
];

const roleConfig = {
  Admin: { color: "text-red-400", bg: "bg-red-400/10" },
  Sales: { color: "text-blue-400", bg: "bg-blue-400/10" },
  Production: { color: "text-amber-400", bg: "bg-amber-400/10" },
};

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">ตั้งค่าระบบ</h1>
        <p className="text-sm text-muted-foreground mt-1">จัดการผู้ใช้งาน การเชื่อมต่อ และการตั้งค่าระบบ</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="users">ผู้ใช้งาน</TabsTrigger>
          <TabsTrigger value="integrations">การเชื่อมต่อ</TabsTrigger>
          <TabsTrigger value="general">ทั่วไป</TabsTrigger>
        </TabsList>

        {/* Users */}
        <TabsContent value="users" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{users.length} ผู้ใช้งาน</div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              เพิ่มผู้ใช้งาน
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {["Admin", "Sales", "Production"].map(role => {
              const rConfig = roleConfig[role as keyof typeof roleConfig];
              return (
                <Card key={role} className="p-4 bg-card border-border text-center">
                  <div className={cn("text-2xl font-bold", rConfig.color)}>
                    {users.filter(u => u.role === role).length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{role}</div>
                </Card>
              );
            })}
          </div>

          <Card className="bg-card border-border overflow-hidden">
            <div className="divide-y divide-border">
              {users.map(user => {
                const rConfig = roleConfig[user.role as keyof typeof roleConfig];
                return (
                  <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-secondary/20 transition-colors">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0", rConfig.bg, rConfig.color)}>
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-foreground">{user.name}</span>
                        <Badge className={cn("text-xs border-0", rConfig.bg, rConfig.color)}>{user.role}</Badge>
                        <Badge className="text-xs border-0 bg-emerald-400/10 text-emerald-400">Active</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{user.email} • เข้าสู่ระบบล่าสุด: {user.lastLogin}</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-400 hover:bg-red-400/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Roles Info */}
          <Card className="p-5 bg-card border-border">
            <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              สิทธิ์การเข้าถึง
            </h3>
            <div className="space-y-2 text-sm">
              {[
                { role: "Admin", perms: "เข้าถึงทุกส่วน รวมถึงการตั้งค่าระบบและผู้ใช้งาน" },
                { role: "Sales", perms: "ลูกค้า, ใบเสนอราคา, CRM - ไม่สามารถเข้าการตั้งค่าระบบ" },
                { role: "Production", perms: "งานผลิต, คลังสินค้า - ไม่สามารถดูข้อมูลการเงิน" },
              ].map(({ role, perms }) => {
                const rConfig = roleConfig[role as keyof typeof roleConfig];
                return (
                  <div key={role} className="flex items-start gap-3">
                    <Badge className={cn("text-xs border-0 shrink-0", rConfig.bg, rConfig.color)}>{role}</Badge>
                    <span className="text-muted-foreground">{perms}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-4 space-y-4">
          {integrations.map(integration => {
            const Icon = integration.icon;
            return (
              <Card key={integration.id} className="p-5 bg-card border-border">
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", integration.bg)}>
                    <Icon className={cn("w-6 h-6", integration.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{integration.name}</h3>
                      <Badge className={cn("text-xs border-0", integration.connected ? "bg-emerald-400/10 text-emerald-400" : "bg-slate-400/10 text-slate-400")}>
                        {integration.connected ? (
                          <><Check className="w-3 h-3 mr-1" />เชื่อมต่อแล้ว</>
                        ) : (
                          <><X className="w-3 h-3 mr-1" />ยังไม่เชื่อมต่อ</>
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
                    {integration.connected && integration.accountName && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Key className="w-3 h-3" />
                        <span>{integration.accountName}</span>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    {integration.connected ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs">ตั้งค่า</Button>
                        <Button variant="outline" size="sm" className="text-xs border-red-500/30 text-red-400 hover:bg-red-400/10">ยกเลิก</Button>
                      </div>
                    ) : (
                      <Button size="sm" className="text-xs">เชื่อมต่อ</Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        {/* General */}
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card className="p-5 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4">ข้อมูลบริษัท</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">ชื่อบริษัท</label>
                <Input defaultValue="MAllPrint - CRM Co., Ltd." className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">เลขประจำตัวผู้เสียภาษี</label>
                <Input defaultValue="0105567890123" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">เบอร์โทรศัพท์</label>
                <Input defaultValue="02-123-4567" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">อีเมล</label>
                <Input defaultValue="info@printcrm.co.th" className="bg-secondary border-border" />
              </div>
            </div>
            <Button className="mt-4">บันทึกการเปลี่ยนแปลง</Button>
          </Card>

          <Card className="p-5 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4">การตั้งค่าระบบ</h3>
            <div className="space-y-4">
              {[
                { label: "ภาษาระบบ", value: "ภาษาไทย" },
                { label: "สกุลเงิน", value: "THB (บาท)" },
                { label: "รูปแบบวันที่", value: "DD/MM/YYYY" },
                { label: "Timezone", value: "Asia/Bangkok (UTC+7)" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{label}</span>
                  <span className="text-sm text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
