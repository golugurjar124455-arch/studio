"use client";

import { useEffect, useState } from "react";
import { Bell, Search, X, Wallet, TrendingUp, PieChart, Activity, ArrowUpRight } from "lucide-react";
import { getClients, getSettings } from "@/lib/db";
import { ClientRecord, SystemSettings } from "@/lib/types";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export default function DashboardPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    setClients(getClients());
    setSettings(getSettings());
  }, []);

  const totalInvested = clients.reduce((acc, c) => acc + c.investedAmount, 0);
  const totalValue = clients.reduce((acc, c) => acc + c.currentValue, 0);
  const totalProfit = totalValue - totalInvested;
  const profitMargin = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  const chartData = clients.length > 0 ? clients.map(c => ({
    name: c.name.split(' ')[0],
    value: c.currentValue,
  })) : [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
  ];

  if (!settings) return null;

  // Platform grouping for UI distribution
  const platformCounts = clients.reduce((acc, c) => {
    acc[c.platform] = (acc[c.platform] || 0) + c.currentValue;
    return acc;
  }, {} as Record<string, number>);

  const assetTypes = [
    { label: 'Forex', color: 'bg-purple-500', key: 'Forex' },
    { label: 'Crypto', color: 'bg-orange-500', key: 'Crypto' },
    { label: 'Stocks', color: 'bg-blue-500', key: 'Stocks' },
    { label: 'Commodities', color: 'bg-yellow-500', key: 'Commodities' },
    { label: 'Others', color: 'bg-zinc-700', key: 'Other' },
  ];

  return (
    <div className="p-6 space-y-8 bg-[#0a0a0c] min-h-screen text-zinc-100 pb-32">
      <header className="flex items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            placeholder="Search Assets..." 
            className="w-full bg-[#161618] border-none rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#0a0a0c]"></span>
          </button>
          <button className="p-2 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Market Overview</h1>
        <p className="text-zinc-500 text-xs">Real-time tracking for Forex, Crypto, and Global Stocks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161618] p-6 rounded-2xl space-y-4 border border-white/[0.03]">
          <div className="flex justify-between items-start">
            <p className="text-xs text-zinc-500 font-medium">Assets Under Management</p>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Wallet className="w-4 h-4 text-orange-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter">{settings.currencySymbol}{totalValue.toLocaleString()}</h2>
          <p className="text-[10px] text-green-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Live Market Feed
          </p>
        </div>

        <div className="bg-[#161618] p-6 rounded-2xl space-y-4 border border-white/[0.03]">
          <div className="flex justify-between items-start">
            <p className="text-xs text-zinc-500 font-medium">Trading Profits</p>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter">{settings.currencySymbol}{totalProfit.toLocaleString()}</h2>
          <p className="text-[10px] text-zinc-500 font-bold">Consolidated P/L</p>
        </div>

        <div className="bg-[#161618] p-6 rounded-2xl space-y-4 border border-white/[0.03]">
          <div className="flex justify-between items-start">
            <p className="text-xs text-zinc-500 font-medium">Average ROI</p>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <PieChart className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter">{profitMargin.toFixed(1)}%</h2>
          <p className="text-[10px] text-zinc-500 font-medium">Across Global Platforms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-[#161618] p-6 rounded-2xl border border-white/[0.03] space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold">Asset Distribution</h3>
              <p className="text-[10px] text-zinc-500">Portfolio split by trading market</p>
            </div>
            <Activity className="w-4 h-4 text-zinc-500" />
          </div>

          <div className="flex h-3 gap-1 rounded-full overflow-hidden">
            {assetTypes.map((type, idx) => {
              const val = platformCounts[type.key] || 0;
              const percent = totalValue > 0 ? (val / totalValue) * 100 : 0;
              return percent > 0 ? (
                <div key={idx} className={`${type.color} h-full`} style={{ width: `${percent}%` }}></div>
              ) : null;
            })}
            {totalValue === 0 && <div className="bg-zinc-800 flex-1 h-full"></div>}
          </div>

          <div className="space-y-4 pt-4">
            {assetTypes.map(item => {
              const val = platformCounts[item.key] || 0;
              const percent = totalValue > 0 ? (val / totalValue) * 100 : 0;
              return (
                <div key={item.label} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <span className="text-zinc-400">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{settings.currencySymbol}{val.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    <span className="bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded text-[9px]">{percent.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-[#161618] p-6 rounded-2xl border border-white/[0.03] space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold">Market Performance</h3>
              <p className="text-[10px] text-zinc-500">Aggregate growth across all trades</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161618', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#f97316" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
