"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Phone, Wallet, TrendingUp, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addClient } from "@/lib/db";

export default function AddClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    investedAmount: "",
    currentValue: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.investedAmount || !formData.currentValue) return;

    addClient({
      name: formData.name,
      phone: formData.phone,
      investedAmount: Number(formData.investedAmount),
      currentValue: Number(formData.currentValue),
    });
    router.push("/dashboard/clients");
  };

  return (
    <div className="p-6 space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl font-headline font-bold text-white">नया क्लाइंट</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">क्लाइंट का नाम</label>
            <div className="relative">
              <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="उदा. राहुल शर्मा"
                className="pl-12 h-14 rounded-3xl bg-card border-white/5 text-lg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">फोन नंबर</label>
            <div className="relative">
              <Phone className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="उदा. 9876543210"
                className="pl-12 h-14 rounded-3xl bg-card border-white/5 text-lg"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">निवेशित राशि</label>
              <div className="relative">
                <Wallet className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="₹ 0"
                  className="pl-12 h-14 rounded-3xl bg-card border-white/5 text-lg"
                  value={formData.investedAmount}
                  onChange={(e) => setFormData({ ...formData, investedAmount: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">वर्तमान वैल्यू</label>
              <div className="relative">
                <TrendingUp className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="₹ 0"
                  className="pl-12 h-14 rounded-3xl bg-card border-white/5 text-lg"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-16 rounded-[2rem] bg-primary text-white hover:bg-primary/90 text-xl font-bold shadow-xl shadow-primary/20 gap-2">
          <Save className="w-6 h-6" />
          क्लाइंट सहेजें
        </Button>
      </form>
    </div>
  );
}