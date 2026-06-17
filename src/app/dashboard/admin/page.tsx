"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, 
  Percent, 
  Globe, 
  Save, 
  Trash2, 
  LogOut, 
  Users, 
  TrendingUp 
} from "lucide-react";
import { useDoc, useCollection, useFirestore } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { saveSettings, clearSession, resetSystem, DEFAULT_SETTINGS } from "@/lib/db";
import { SystemSettings, ClientRecord } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DemoModeBadge } from "@/components/ui/demo-mode-badge";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

export default function AdminPanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const { data: settingsData } = useDoc<SystemSettings>(doc(db, 'settings', 'global'));
  const { data: clients = [] } = useCollection<ClientRecord>(collection(db, 'investors'));
  
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);
    }
  }, [settingsData]);

  const handleSave = () => {
    saveSettings(settings);
    toast({
      title: "System Update Successful",
      description: "Global settlement rates and branding updated.",
    });
  };

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  return (
    <div className="p-6 space-y-8 bg-[#0a0a0c] min-h-screen text-white pb-32">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-orange-500">
          <ShieldAlert className="w-6 h-6" />
          <h1 className="text-3xl font-bold tracking-tighter uppercase">Admin Command Center</h1>
        </div>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Root System Access • v2.0 Pro</p>
      </header>

      {/* System Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#161618] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total Nodes</span>
          </div>
          <p className="text-2xl font-bold">{clients.length}</p>
        </div>
        <div className="bg-[#161618] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Uptime</span>
          </div>
          <p className="text-2xl font-bold">99.9%</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Settlement Engine */}
        <section className="bg-[#161618] border border-white/5 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <Percent className="w-5 h-5 text-orange-500" />
              <h2 className="font-bold">Settlement Engine</h2>
            </div>
            <span className="bg-orange-500/10 text-orange-500 text-[9px] px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">GST Surcharge (%)</label>
              <Input 
                type="number" 
                value={settings.gstRate} 
                onChange={(e) => setSettings({ ...settings, gstRate: Number(e.target.value) })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl text-white font-bold text-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">UPI Protocol Fee (%)</label>
              <Input 
                type="number" 
                value={settings.upiRate} 
                onChange={(e) => setSettings({ ...settings, upiRate: Number(e.target.value) })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl text-white font-bold text-lg"
              />
            </div>
          </div>
        </section>

        {/* Branding & Identity */}
        <section className="bg-[#161618] border border-white/5 rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Globe className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold">Platform Identity</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Terminal Alias</label>
              <Input 
                value={settings.platformName} 
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl text-white font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Currency Unit</label>
              <Input 
                value={settings.currencySymbol} 
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl text-white font-bold"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4">
          <Button 
            onClick={handleSave}
            className="h-16 bg-orange-600 hover:bg-orange-700 rounded-[2rem] gap-2 font-bold text-lg shadow-xl shadow-orange-500/20"
          >
            <Save className="w-6 h-6" /> Commit Global Changes
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="h-16 bg-zinc-900 border border-white/5 hover:bg-red-500/10 rounded-[2rem] gap-2 font-bold text-red-500">
                <Trash2 className="w-6 h-6" /> Purge System Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#161618] border-white/5 text-white rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Initialize System Purge?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-500">
                  This will permanently erase all investors and transactions from the cloud database. This protocol is irreversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-zinc-800 border-none rounded-xl text-white">Abort</AlertDialogCancel>
                <AlertDialogAction onClick={resetSystem} className="bg-red-600 hover:bg-red-700 rounded-xl">Confirm Purge</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="h-16 bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-[2rem] gap-2 font-bold text-zinc-400"
          >
            <LogOut className="w-6 h-6" /> Terminate Session
          </Button>
        </div>
      </div>

      <div className="pt-8 flex justify-center">
        <DemoModeBadge />
      </div>
    </div>
  );
}
