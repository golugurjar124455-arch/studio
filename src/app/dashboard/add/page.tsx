"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Phone, Wallet, TrendingUp, Save, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addClient } from "@/lib/db";

export default function AddClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    platform: "Stocks",
    investedAmount: "",
    currentValue: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.investedAmount || !formData.currentValue) return;

    addClient({
      name: formData.name,
      phone: formData.phone,
      platform: formData.platform as any,
      investedAmount: Number(formData.investedAmount),
      currentValue: Number(formData.currentValue),
    });
    router.push("/dashboard/clients");
  };

  return (
    <div className="p-6 space-y-8 bg-zinc-950 min-h-screen max-w-md mx-auto">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-headline font-bold text-white">Add Investor</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Account Identity</h2>
            <div className="relative">
              <User className="absolute left-4 top-4 h-5 w-5 text-zinc-600" />
              <Input
                placeholder="Full Name"
                className="pl-12 h-14 rounded-2xl bg-zinc-900 border-white/5 text-white placeholder:text-zinc-700"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-4 h-5 w-5 text-zinc-600" />
              <Input
                placeholder="Mobile Number"
                className="pl-12 h-14 rounded-2xl bg-zinc-900 border-white/5 text-white placeholder:text-zinc-700"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Trading Platform</h2>
            <div className="relative">
              <Globe className="absolute left-4 top-4 h-5 w-5 text-zinc-600 z-10" />
              <Select onValueChange={(val) => setFormData({ ...formData, platform: val })} defaultValue={formData.platform}>
                <SelectTrigger className="pl-12 h-14 rounded-2xl bg-zinc-900 border-white/5 text-white">
                  <SelectValue placeholder="Select Platform" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="Forex">Forex (Currency)</SelectItem>
                  <SelectItem value="Crypto">Crypto (Binance/etc)</SelectItem>
                  <SelectItem value="Stocks">Stock Market</SelectItem>
                  <SelectItem value="Mutual Funds">Mutual Funds</SelectItem>
                  <SelectItem value="Commodities">Commodities (Gold/Oil)</SelectItem>
                  <SelectItem value="Options">Options & Futures</SelectItem>
                  <SelectItem value="Indices">Market Indices</SelectItem>
                  <SelectItem value="Codex">Codex Platform</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Asset Valuation ($)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Wallet className="absolute left-4 top-4 h-5 w-5 text-zinc-600" />
                <Input
                  type="number"
                  placeholder="Invested"
                  className="pl-12 h-14 rounded-2xl bg-zinc-900 border-white/5 text-white placeholder:text-zinc-700"
                  value={formData.investedAmount}
                  onChange={(e) => setFormData({ ...formData, investedAmount: e.target.value })}
                />
              </div>
              <div className="relative">
                <TrendingUp className="absolute left-4 top-4 h-5 w-5 text-zinc-600" />
                <Input
                  type="number"
                  placeholder="Current"
                  className="pl-12 h-14 rounded-2xl bg-zinc-900 border-white/5 text-white placeholder:text-zinc-700"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-16 rounded-[2rem] bg-orange-500 text-white hover:bg-orange-600 text-xl font-bold shadow-xl shadow-orange-500/20 gap-2">
          <Save className="w-6 h-6" />
          Create Investor
        </Button>
      </form>
    </div>
  );
}
