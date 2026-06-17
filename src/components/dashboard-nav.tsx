
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Search, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Market" },
    { href: "/dashboard/clients", icon: Users, label: "Investors" },
    { href: "/dashboard/search", icon: Search, label: "Search" },
    { href: "/dashboard/admin", icon: ShieldAlert, label: "Admin" },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 max-w-md mx-auto bg-[#161618]/90 backdrop-blur-2xl border border-white/5 px-6 py-4 flex justify-around items-center z-50 rounded-[2.5rem] shadow-2xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              isActive ? "text-orange-500 scale-110" : "text-zinc-500 hover:text-white"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all",
              isActive ? "bg-orange-500/10" : ""
            )}>
              <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
