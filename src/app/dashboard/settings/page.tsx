"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Info, LogOut, Percent, Globe, Layout, Save } from "lucide-react";
import { clearSession, getSettings, saveSettings } from "@/lib/db";
import { SystemSettings } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DemoModeBadge } from "@/components/ui/demo-mode-badge";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleSave = () => {
    if (settings) {
      saveSettings(settings);
      toast({
        title: "Settings Saved",
        description: "Your system configuration has been updated.",
      });
    }
  };

  const handleLogout = () => {
    if (confirm("Sign out of professional account?")) {
      clearSession();
      router.push("/");
    }
  };

  if (!settings) return null;

  return (
    <div className="p-6 space-y-8 bg-[#0a0a0c] min-h-screen text-white">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-[#161618] border border-white/5 text-zinc-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold tracking-tighter">System Configuration</h1>
      </header>

      <div className="space-y-6 pb-24">
        <section className="bg-[#161618] border border-white/5 rounded-2xl overflow-hidden p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Percent className="w-5 h-5 text-purple-500" />
            <h2 className="font-bold">Tax & Charges</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">GST Rate (%)</label>
              <Input 
                type="number" 
                value={settings.gstRate} 
                onChange={(e) => setSettings({ ...settings, gstRate: Number(e.target.value) })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">UPI Service Fee (%)</label>
              <Input 
                type="number" 
                value={settings.upiRate} 
                onChange={(e) => setSettings({ ...settings, upiRate: Number(e.target.value) })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#161618] border border-white/5 rounded-2xl overflow-hidden p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Globe className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold">Localization</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Platform Name</label>
              <Input 
                value={settings.platformName} 
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Currency Symbol</label>
              <Input 
                value={settings.currencySymbol} 
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl"
              />
            </div>
          </div>
        </section>

        <Button 
          onClick={handleSave}
          className="w-full h-14 bg-purple-600 hover:bg-purple-700 rounded-2xl gap-2 font-bold text-lg"
        >
          <Save className="w-5 h-5" /> Save Changes
        </Button>

        <button
          onClick={handleLogout}
          className="w-full p-6 bg-[#161618] border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-red-500 hover:bg-red-500/10 transition-all font-bold"
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
