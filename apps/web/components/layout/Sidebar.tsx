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
  ChevronRight,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    {
      label: t("dashboard"),
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: t("clients"),
      href: "/clients",
      icon: Users,
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
      children: [
        { label: t("materials"), href: "/inventory/materials" },
        { label: t("suppliers"), href: "/inventory/suppliers" },
      ],
    },
    {
      label: t("automation"),
      href: "/automation",
      icon: Bot,
    },
    {
      label: t("settings"),
      href: "/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <div className="flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
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

        {/* User row */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">Admin User</div>
            <div className="text-xs text-muted-foreground">Sales Manager</div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>

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
