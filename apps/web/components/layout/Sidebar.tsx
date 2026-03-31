"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Printer,
  Package,
  Bot,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { canView } from "@/lib/auth/permissions";
import { MenuPermissions } from "@/lib/auth/types";

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
  alert?: boolean
  permKey: keyof MenuPermissions
  children?: { label: string; href: string }[]
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, permissions, logout } = useAuth();

  const allNavItems: NavItem[] = [
    {
      label: t("dashboard"),
      href: "/",
      icon: LayoutDashboard,
      permKey: "dashboard",
    },
    {
      label: t("clients"),
      href: "/clients",
      icon: Users,
      permKey: "clients",
      children: [
        { label: t("companies"), href: "/clients" },
        { label: t("contacts"), href: "/contacts" },
      ],
    },
    {
      label: t("sales"),
      href: "/sales",
      icon: TrendingUp,
      badge: "3",
      permKey: "sales",
      children: [
        { label: t("leads"), href: "/sales?tab=leads" },
        { label: t("quotes"), href: "/sales?tab=quotes" },
        { label: t("deals"), href: "/sales?tab=deals" },
      ],
    },
    {
      label: t("production"),
      href: "/production",
      icon: Printer,
      badge: "10",
      permKey: "production",
      children: [
        { label: t("activeJobs"), href: "/production" },
        { label: t("jobHistory"), href: "/production?tab=history" },
      ],
    },
    {
      label: t("inventory"),
      href: "/inventory",
      icon: Package,
      alert: true,
      permKey: "inventory",
      children: [
        { label: t("materials"), href: "/inventory/materials" },
        { label: t("suppliers"), href: "/inventory/suppliers" },
      ],
    },
    {
      label: t("automation"),
      href: "/automation",
      icon: Bot,
      permKey: "automation",
    },
    {
      label: t("settings"),
      href: "/settings",
      icon: Settings,
      permKey: "settings",
    },
  ];

  // Filter nav items based on permissions
  const navItems = permissions
    ? allNavItems.filter(item => canView(permissions, item.permKey))
    : allNavItems;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Build avatar initials color based on role
  const avatarColors: Record<string, string> = {
    'role-super-admin': 'bg-red-500/20 text-red-500',
    'role-sales-manager': 'bg-blue-500/20 text-blue-500',
    'role-sales-rep': 'bg-cyan-500/20 text-cyan-500',
    'role-production-manager': 'bg-amber-500/20 text-amber-500',
    'role-production-staff': 'bg-orange-500/20 text-orange-500',
    'role-viewer': 'bg-slate-500/20 text-slate-400',
  };
  const avatarColor = user ? (avatarColors[user.roleId] ?? 'bg-primary/20 text-primary') : 'bg-primary/20 text-primary';

  return (
    <div className="flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Printer className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="font-bold text-sm text-foreground">MAllPrint - CRM</div>
          <div className="text-xs text-muted-foreground">ระบบบริหารงานพิมพ์</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isViewOnly = permissions && permissions[item.permKey] === 'view';

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "w-4.5 h-4.5 shrink-0",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  size={18}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {isViewOnly && (
                  <span className="text-xs text-muted-foreground/70 shrink-0">(view)</span>
                )}
                {item.badge && !isViewOnly && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 bg-primary/20 text-primary border-0">
                    {item.badge}
                  </Badge>
                )}
                {item.alert && !isViewOnly && (
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Bottom Panel */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
        {/* Theme + Language Row */}
        <div className="flex items-center justify-between px-2 py-1">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-sidebar-accent"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setLanguage("en")}
              className={cn(
                "px-2 py-1 rounded font-medium transition-colors",
                language === "en"
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              )}
            >
              EN
            </button>
            <span className="text-muted-foreground/40">|</span>
            <button
              onClick={() => setLanguage("th")}
              className={cn(
                "px-2 py-1 rounded font-medium transition-colors",
                language === "th"
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              )}
            >
              TH
            </button>
          </div>
        </div>

        {/* User profile section */}
        {user && (
          <div className="px-3 py-2.5 rounded-lg bg-secondary/30 space-y-1">
            <div className="flex items-center gap-3">
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0", avatarColor)}>
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-0.5">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                avatarColor
              )}>
                {user.roleName}
              </span>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{t("logout")}</span>
        </button>
      </div>
    </div>
  );
}
