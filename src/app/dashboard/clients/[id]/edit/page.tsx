"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Phone, Wallet, TrendingUp, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getClients, updateClient } from "@/lib/db";

export default function EditClientPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    investedAmount: "",
    currentValue: "",
    stocks: "0",
    mutualFunds: "0",
    gold: "0",
  });

  useEffect(() => {
    const clients = getClients();
    const client = clients.find(c => c.id === id);
    if (client) {
      setFormData({
        name: client.name,
        phone: client.phone,
        investedAmount: client.investedAmount.toString(),
        currentValue: client.currentValue.toString(),
        stocks: (client.stocks || 0).toString(),
        mutualFunds: (client.mutualFunds || 0).toString(),
        gold: (client.gold || 0).toString(),
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.investedAmount || !formData.currentValue) return;

    updateClient(id as string, {
      name: formData.name,
      phone: formData.phone,
      investedAmount: Number(formData.investedAmount),
      currentValue: Number(formData.currentValue),
      stocks: Number(formData.stocks),
      mutualFunds: Number(formData.mutualFunds),
      gold: Number(formData.gold),
    });
    router.push(`/dashboard/clients/${id}`);
  };

  return (
    <div className="p-6 space-y-8 max-w-md mx-auto">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl font-headline font-bold text-white">संपादित करें</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest px-2">मूल जानकारी</h2>
            <div className="relative">
              <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="नाम"
                className="pl-12 h-14 rounded-3xl bg-card border-white/5"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="फोन"
                className="pl-12 h-14 rounded-3xl bg-card border-white/5"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest px-2">वित्तीय विवरण</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Wallet className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="निवेश"
                  className="pl-12 h-14 rounded-3xl bg-card border-white/5"
                  value={formData.investedAmount}
                  onChange={(e) => setFormData({ ...formData, investedAmount: e.target.value })}
                />
              </div>
              <div className="relative">
                <TrendingUp className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="वर्तमान"
                  className="pl-12 h-14 rounded-3xl bg-card border-white/5"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                />
              </div>
            </div>
          </div>

           <div className="space-y-4">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest px-2">पोर्टफोलियो ब्रेकडाउन (₹)</h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="relative">
                <span className="absolute left-4 top-4 text-xs font-bold text-muted-foreground">Stocks</span>
                <Input
                  type="number"
                  className="pl-16 h-14 rounded-3xl bg-card border-white/5"
                  value={formData.stocks}
                  onChange={(e) => setFormData({ ...formData, stocks: e.target.value })}
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-4 text-xs font-bold text-muted-foreground">MFs</span>
                <Input
                  type="number"
                  className="pl-16 h-14 rounded-3xl bg-card border-white/5"
                  value={formData.mutualFunds}
                  onChange={(e) => setFormData({ ...formData, mutualFunds: e.target.value })}
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-4 text-xs font-bold text-muted-foreground">Gold</span>
                <Input
                  type="number"
                  className="pl-16 h-14 rounded-3xl bg-card border-white/5"
                  value={formData.gold}
                  onChange={(e) => setFormData({ ...formData, gold: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-16 rounded-[2rem] bg-primary text-white hover:bg-primary/90 text-xl font-bold shadow-xl shadow-primary/20 gap-2">
          <Save className="w-6 h-6" />
          अपडेट करें
        </Button>
      </form>
    </div>
  );
}
