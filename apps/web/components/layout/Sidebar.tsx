"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Printer,
  Package,
  Bot,
  Settings,
  ChevronRight,
  Zap,
  Bell,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "แดชบอร์ด",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "ลูกค้า & ผู้ติดต่อ",
    href: "/clients",
    icon: Users,
    children: [
      { label: "บริษัท", href: "/clients" },
      { label: "ผู้ติดต่อ", href: "/contacts" },
    ],
  },
  {
    label: "การขาย",
    href: "/sales",
    icon: TrendingUp,
    badge: "3",
    children: [
      { label: "Lead", href: "/sales?tab=leads" },
      { label: "ใบเสนอราคา", href: "/sales?tab=quotes" },
      { label: "ดีล", href: "/sales?tab=deals" },
    ],
  },
  {
    label: "งานผลิต",
    href: "/production",
    icon: Printer,
    badge: "10",
    children: [
      { label: "Kanban Board", href: "/production" },
      { label: "ประวัติงาน", href: "/production?tab=history" },
    ],
  },
  {
    label: "คลังสินค้า",
    href: "/inventory",
    icon: Package,
    alert: true,
    children: [
      { label: "วัตถุดิบ", href: "/inventory/materials" },
      { label: "ซัพพลายเออร์", href: "/inventory/suppliers" },
    ],
  },
  {
    label: "Automation & AI",
    href: "/automation",
    icon: Bot,
  },
  {
    label: "ตั้งค่า",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <div className="flex flex-col w-64 min-h-screen bg-[oklch(0.10_0.02_240)] border-r border-[oklch(0.22_0.03_240)] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[oklch(0.22_0.03_240)]">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Printer className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="font-bold text-sm text-foreground">PrintCRM</div>
          <div className="text-xs text-muted-foreground">ระบบบริหารงานพิมพ์</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-[oklch(0.22_0.03_240)] hover:text-foreground"
                )}
              >
                <Icon className={cn("w-4.5 h-4.5 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} size={18} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 bg-primary/20 text-primary border-0">
                    {item.badge}
                  </Badge>
                )}
                {item.alert && (
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Bottom User Panel */}
      <div className="px-3 py-4 border-t border-[oklch(0.22_0.03_240)]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[oklch(0.22_0.03_240)] cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
            ส
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">สมหมาย ขายดี</div>
            <div className="text-xs text-muted-foreground">Sales Manager</div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
      </div>
    </div>
  );
}
