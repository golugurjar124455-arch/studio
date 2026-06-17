"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, Search, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearSession } from "@/lib/db";

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  const navItems = [
    { href: "/dashboard", icon: Home, label: "डैशबोर्ड" },
    { href: "/dashboard/clients", icon: Users, label: "क्लाइंट" },
    { href: "/dashboard/search", icon: Search, label: "सर्च" },
    { href: "/dashboard/settings", icon: Settings, label: "सेटिंग्स" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card/80 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-white"
            )}
          >
            <div className={cn(
              "p-2 rounded-2xl transition-all",
              isActive ? "bg-primary/10 neon-glow" : ""
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 text-destructive hover:text-destructive/80 transition-all"
      >
        <div className="p-2 rounded-2xl">
          <LogOut className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-medium">लॉगआउट</span>
      </button>
    </nav>
  );
}