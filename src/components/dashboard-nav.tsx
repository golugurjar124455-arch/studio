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
    if (confirm("Sign out of professional account?")) {
      clearSession();
      router.push("/");
    }
  };

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Market" },
    { href: "/dashboard/clients", icon: Users, label: "Investors" },
    { href: "/dashboard/search", icon: Search, label: "Search" },
    { href: "/dashboard/settings", icon: Settings, label: "System" },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 max-w-md mx-auto bg-[#161618]/90 backdrop-blur-2xl border border-white/5 px-6 py-4 flex justify-between items-center z-50 rounded-[2.5rem] shadow-2xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              isActive ? "text-purple-500 scale-110" : "text-zinc-500 hover:text-white"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all",
              isActive ? "bg-purple-500/10" : ""
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 text-zinc-500 hover:text-red-500 transition-all"
      >
        <div className="p-2 rounded-xl">
          <LogOut className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-tighter">Exit</span>
      </button>
    </nav>
  );
}
