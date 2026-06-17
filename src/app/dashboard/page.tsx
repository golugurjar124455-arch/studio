"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, UserPlus, TrendingUp, TrendingDown, Wallet, ArrowUpRight, Bitcoin, CreditCard, Activity } from "lucide-react";
import { getClients } from "@/lib/db";
import { ClientRecord } from "@/lib/types";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, AreaChart, Area } from "recharts";

export default function DashboardPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);

  useEffect(() => {
    setClients(getClients());
  }, []);

  const totalInvested = clients.reduce((acc, c) => acc + c.investedAmount, 0);
  const totalValue = clients.reduce((acc, c) => acc + c.currentValue, 0);
  const totalProfit = totalValue - totalInvested;

  const quickStats = [
    { label: "Assets Under Mgmt", value: `$${totalValue.toLocaleString()}`, icon: Activity, color: "text-orange-400" },
    { label: "Active Investors", value: clients.length, icon: Users, color: "text-blue-400" },
    { label: "Total Yield", value: `$${totalProfit.toLocaleString()}`, icon: totalProfit >= 0 ? TrendingUp : TrendingDown, color: totalProfit >= 0 ? "text-green-400" : "text-red-400" },
  ];

  const chartData = clients
    .map(c => ({
      name: c.name.split(' ')[0],
      profit: c.profitLoss,
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  return (
    <div className="p-6 space-y-8 bg-zinc-950 min-h-screen">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            <Bitcoin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-headline font-bold text-white tracking-tighter">Portfolio Dashboard</h1>
            <p className="text-zinc-500 text-xs font-medium">Market Live Status</p>
          </div>
        </div>
        <Link href="/dashboard/add" className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-orange-500 hover:bg-zinc-800 transition-all">
          <UserPlus className="w-5 h-5" />
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
           {quickStats.slice(1).map((stat, i) => (
            <div key={stat.label} className="bg-zinc-900 p-5 rounded-[1.5rem] border border-white/5 flex flex-col justify-between h-32">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-headline font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
          <Activity className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 opacity-70" />
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">Total Assets Managed</p>
            </div>
            <h2 className="text-4xl font-headline font-bold tracking-tighter">$ {totalValue.toLocaleString()}</h2>
            <div className="flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              {(totalProfit / (totalInvested || 1) * 100).toFixed(2)}% Performance
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart Analysis */}
      {clients.length > 0 && (
        <section className="bg-zinc-900 p-6 rounded-[2rem] border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Growth Leaderboard</h3>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-headline font-bold text-white">Latest Investors</h3>
          <Link href="/dashboard/clients" className="text-xs text-orange-500 font-bold hover:underline">View All</Link>
        </div>
        <div className="space-y-3 pb-24">
          {clients.slice(0, 4).map((client) => (
            <Link
              key={client.id}
              href={`/dashboard/clients/${client.id}`}
              className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center font-headline font-bold text-orange-500 border border-white/5">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white group-hover:text-orange-500 transition-colors">{client.name}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">{client.platform}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-headline font-bold text-white">$ {client.currentValue.toLocaleString()}</p>
                <div className={`flex items-center justify-end gap-1 text-[10px] font-bold ${client.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                   {client.profitLoss >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                   <span>{client.profitLoss >= 0 ? '+' : '-'}$ {Math.abs(client.profitLoss).toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
