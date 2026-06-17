"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, LogOut, Percent, Globe, Save, Trash2, Database, AlertTriangle } from "lucide-react";
import { clearSession, getSettings, saveSettings, resetSystem } from "@/lib/db";
import { SystemSettings } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DemoModeBadge } from "@/components/ui/demo-mode-badge";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
        title: "Admin Action: Success",
        description: "Global system configuration updated.",
      });
    }
  };

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  if (!settings) return null;

  return (
    <div className="p-6 space-y-8 bg-[#0a0a0c] min-h-screen text-white pb-32">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-[#161618] border border-white/5 text-zinc-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tighter">Admin Control Panel</h1>
          <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest flex items-center gap-1">
            <Shield className="w-3 h-3" /> System Root Access
          </p>
        </div>
      </header>

      <div className="space-y-6">
        {/* Tax Control Section */}
        <section className="bg-[#161618] border border-white/5 rounded-2xl overflow-hidden p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Percent className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold">Global Settlement Rates</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">GST Rate (%)</label>
              <Input 
                type="number" 
                value={settings.gstRate} 
                onChange={(e) => setSettings({ ...settings, gstRate: Number(e.target.value) })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl text-white font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">UPI Fee (%)</label>
              <Input 
                type="number" 
                value={settings.upiRate} 
                onChange={(e) => setSettings({ ...settings, upiRate: Number(e.target.value) })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl text-white font-bold"
              />
            </div>
          </div>
        </section>

        {/* Branding Section */}
        <section className="bg-[#161618] border border-white/5 rounded-2xl overflow-hidden p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Globe className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold">Platform Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Terminal Brand Name</label>
              <Input 
                value={settings.platformName} 
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl text-white font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Default Currency Symbol</label>
              <Input 
                value={settings.currencySymbol} 
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl text-white font-bold"
              />
            </div>
          </div>
        </section>

        {/* Maintenance Section */}
        <section className="bg-red-500/5 border border-red-500/10 rounded-2xl overflow-hidden p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-red-500/10 pb-4">
            <Database className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-red-500">System Maintenance</h2>
          </div>
          
          <div className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full h-14 rounded-2xl gap-2 font-bold uppercase tracking-tighter text-xs">
                  <Trash2 className="w-4 h-4" /> Wipe Local Database
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#161618] border-white/5 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500">
                    This action will permanently delete all investor data and reset all system settings to default. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-800 border-none">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetSystem} className="bg-red-600 hover:bg-red-700">Wipe Everything</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={handleSave}
            className="h-16 bg-orange-600 hover:bg-orange-700 rounded-3xl gap-2 font-bold shadow-xl shadow-orange-500/10"
          >
            <Save className="w-5 h-5" /> Save Admin
          </Button>

          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="h-16 bg-zinc-900 border border-white/5 hover:bg-red-500/10 rounded-3xl gap-2 font-bold text-red-500"
          >
            <LogOut className="w-5 h-5" /> Exit
          </Button>
        </div>
      </div>

      <div className="pt-8 opacity-50">
        <DemoModeBadge />
      </div>
    </div>
  );
}
