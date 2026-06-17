"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Info, LogOut, Moon, Database } from "lucide-react";
import { clearSession } from "@/lib/db";
import { DemoModeBadge } from "@/components/ui/demo-mode-badge";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  return (
    <div className="p-6 space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl font-headline font-bold text-white">सेटिंग्स</h1>
      </header>

      <div className="space-y-4">
        <div className="bento-card rounded-[2rem] overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between hover:bg-white/5 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              <p className="font-bold text-white">सुरक्षा</p>
            </div>
            <p className="text-xs text-muted-foreground font-medium">पिन बदलें</p>
          </div>
          <div className="p-6 border-b border-white/5 flex items-center justify-between hover:bg-white/5 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Moon className="w-5 h-5" />
              </div>
              <p className="font-bold text-white">थीम</p>
            </div>
            <p className="text-xs text-primary font-bold">डार्क मोड</p>
          </div>
          <div className="p-6 flex items-center justify-between hover:bg-white/5 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <p className="font-bold text-white">डेटा</p>
            </div>
            <p className="text-xs text-muted-foreground font-medium">एक्सपोर्ट</p>
          </div>
        </div>

        <div className="bento-card rounded-[2rem] p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Info className="w-5 h-5" />
            </div>
            <p className="font-bold text-white">ऐप के बारे में</p>
          </div>
          <div className="space-y-2 px-1">
            <p className="text-xs text-muted-foreground">वर्जन: 1.0.0 (डेमो)</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              यह एक सुरक्षित निवेश ट्रैकिंग डेमो ऐप है। आपका सारा डेटा आपके ब्राउज़र के लोकल स्टोरेज में ही रहता है।
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full p-6 bento-card rounded-[2rem] flex items-center justify-center gap-3 bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-all font-bold"
        >
          <LogOut className="w-5 h-5" />
          लॉगआउट करें
        </button>
      </div>

      <div className="pt-8">
        <DemoModeBadge />
      </div>
    </div>
  );
}