"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Percent, Globe, Save, Trash2, LogOut, Users, TrendingUp } from "lucide-react";
import { useDoc, useCollection, useFirestore } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { saveSettings, clearSession, DEFAULT_SETTINGS } from "@/lib/db";
import { SystemSettings, ClientRecord } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
      title: "सिस्टम अपडेट सफल",
      description: "ग्लोबल रेट्स और ब्रांडिंग अपडेट कर दी गई है।",
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
          <h1 className="text-3xl font-bold tracking-tighter uppercase">Admin Center</h1>
        </div>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Root System Access • v2.0</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#161618] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nodes</span>
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
        <section className="bg-[#161618] border border-white/5 rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Percent className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold">Settlement Rates</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">GST Rate (%)</label>
              <Input 
                type="number" 
                value={settings.gstRate} 
                onChange={(e) => setSettings({ ...settings, gstRate: Number(e.target.value) })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl text-white font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">UPI Fee (%)</label>
              <Input 
                type="number" 
                value={settings.upiRate} 
                onChange={(e) => setSettings({ ...settings, upiRate: Number(e.target.value) })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl text-white font-bold"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#161618] border border-white/5 rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Globe className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold">Branding</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Platform Name</label>
              <Input 
                value={settings.platformName} 
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl text-white font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Currency Symbol</label>
              <Input 
                value={settings.currencySymbol} 
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="bg-[#0a0a0c] border-white/5 h-12 rounded-xl text-white font-bold"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <Button onClick={handleSave} className="h-16 bg-orange-600 hover:bg-orange-700 rounded-[2rem] gap-2 font-bold text-lg shadow-xl shadow-orange-500/20">
            <Save className="w-6 h-6" /> Commit Changes
          </Button>

          <Button onClick={handleLogout} variant="ghost" className="h-16 bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-[2rem] gap-2 font-bold text-zinc-400">
            <LogOut className="w-6 h-6" /> Logout Session
          </Button>
        </div>
      </div>
    </div>
  );
}
