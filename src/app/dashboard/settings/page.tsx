"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Info, LogOut, Moon, Database } from "lucide-react";
import { clearSession } from "@/lib/db";
import { DemoModeBadge } from "@/components/ui/demo-mode-badge";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("Sign out of professional account?")) {
      clearSession();
      router.push("/");
    }
  };

  return (
    <div className="p-6 space-y-8 bg-zinc-950 min-h-screen">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-headline font-bold text-white tracking-tighter">System Settings</h1>
      </header>

      <div className="space-y-4">
        <div className="bg-zinc-900 border border-white/5 rounded-[2rem] overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between hover:bg-white/5 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              <p className="font-bold text-white">Security</p>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Update PIN</p>
          </div>
          <div className="p-6 border-b border-white/5 flex items-center justify-between hover:bg-white/5 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Moon className="w-5 h-5" />
              </div>
              <p className="font-bold text-white">Theme</p>
            </div>
            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Dark Mode</p>
          </div>
          <div className="p-6 flex items-center justify-between hover:bg-white/5 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <p className="font-bold text-white">Data</p>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Export CSV</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-[2rem] p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Info className="w-5 h-5" />
            </div>
            <p className="font-bold text-white">About System</p>
          </div>
          <div className="space-y-2 px-1">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Version: 2.1.0 PRO</p>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              Professional local-first architecture. All data is encrypted and stored locally on your device for maximum privacy.
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full p-6 bg-zinc-900 border border-white/5 rounded-[2rem] flex items-center justify-center gap-3 text-red-500 hover:bg-red-500/10 transition-all font-bold"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      <div className="pt-8">
        <DemoModeBadge />
      </div>
    </div>
  );
}
