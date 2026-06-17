"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, UserPlus, Search, Settings, ArrowUpRight, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { getClients } from "@/lib/db";
import { ClientRecord } from "@/lib/types";
import { DemoModeBadge } from "@/components/ui/demo-mode-badge";

export default function DashboardPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);

  useEffect(() => {
    setClients(getClients());
  }, []);

  const totalInvested = clients.reduce((acc, c) => acc + c.investedAmount, 0);
  const totalValue = clients.reduce((acc, c) => acc + c.currentValue, 0);
  const totalProfit = totalValue - totalInvested;

  const quickStats = [
    { label: "कुल क्लाइंट", value: clients.length, icon: Users, color: "text-blue-400" },
    { label: "कुल निवेश", value: `₹${totalInvested.toLocaleString()}`, icon: Wallet, color: "text-purple-400" },
    { label: "कुल लाभ/हानि", value: `₹${totalProfit.toLocaleString()}`, icon: totalProfit >= 0 ? TrendingUp : TrendingDown, color: totalProfit >= 0 ? "text-emerald-400" : "text-rose-400" },
  ];

  return (
    <div className="p-6 space-y-8 scroll-hide">
      <header className="space-y-1 animate-staggered-fade-in">
        <h2 className="text-sm font-medium text-muted-foreground">स्वागत है 👋</h2>
        <h1 className="text-3xl font-headline font-bold text-white">डैशबोर्ड</h1>
      </header>

      {/* Stats Bento */}
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, i) => (
          <div
            key={stat.label}
            className={`bento-card p-5 rounded-[2rem] flex flex-col justify-between h-40 animate-staggered-fade-in`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-lg font-headline font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}

        {/* Action Card: Add Client */}
        <Link
          href="/dashboard/add"
          className="bento-card p-5 rounded-[2rem] bg-primary group flex flex-col justify-between h-40 animate-staggered-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
            <UserPlus className="w-5 h-5" />
          </div>
          <div className="flex items-end justify-between">
            <p className="text-lg font-headline font-bold text-white">नया क्लाइंट जोड़ें</p>
            <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </div>
        </Link>
      </div>

      <section className="space-y-4 animate-staggered-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-headline font-bold text-white">हाल के क्लाइंट</h3>
          <Link href="/dashboard/clients" className="text-xs text-primary font-medium hover:underline">सभी देखें</Link>
        </div>
        <div className="space-y-3">
          {clients.slice(0, 3).map((client) => (
            <Link
              key={client.id}
              href={`/dashboard/clients/${client.id}`}
              className="flex items-center justify-between p-4 bento-card rounded-3xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-headline font-bold text-primary">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{client.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-headline font-bold text-white">₹{client.currentValue.toLocaleString()}</p>
                <p className={`text-[10px] font-bold ${client.profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {client.profitLoss >= 0 ? '+' : ''}₹{Math.abs(client.profitLoss).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
          {clients.length === 0 && (
            <div className="text-center py-12 bento-card rounded-[2rem] border-dashed border-white/10 bg-transparent">
              <p className="text-muted-foreground text-sm">कोई क्लाइंट नहीं मिला</p>
            </div>
          )}
        </div>
      </section>

      <div className="pt-4">
        <DemoModeBadge />
      </div>
    </div>
  );
}