"use client";

import { Bell, Search, Wallet, TrendingUp, PieChart as PieChartIcon, Activity, ArrowUpRight } from "lucide-react";
import { useCollection, useDoc, useFirestore } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { ClientRecord, SystemSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/db";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

export default function DashboardPage() {
  const db = useFirestore();
  const { data: clients = [], loading: clientsLoading } = useCollection<ClientRecord>(collection(db, 'investors'));
  const { data: settingsData } = useDoc<SystemSettings>(doc(db, 'settings', 'global'));

  const settings = settingsData || DEFAULT_SETTINGS;

  const totalInvested = clients.reduce((acc, c) => acc + (c.investedAmount || 0), 0);
  const totalValue = clients.reduce((acc, c) => acc + (c.currentValue || 0), 0);
  const totalProfit = totalValue - totalInvested;
  const profitMargin = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  const chartData = clients.length > 0 ? clients.slice(0, 6).map(c => ({
    name: c.name.split(' ')[0],
    value: c.currentValue,
  })) : [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
  ];

  const platformCounts = clients.reduce((acc, c) => {
    acc[c.platform] = (acc[c.platform] || 0) + (c.currentValue || 0);
    return acc;
  }, {} as Record<string, number>);

  const assetTypes = [
    { label: 'Forex', color: '#a855f7', key: 'Forex' },
    { label: 'Crypto', color: '#f97316', key: 'Crypto' },
    { label: 'Stocks', color: '#3b82f6', key: 'Stocks' },
    { label: 'Commodities', color: '#eab308', key: 'Commodities' },
    { label: 'Others', color: '#3f3f46', key: 'Other' },
  ];

  const pieData = assetTypes.map(type => ({
    name: type.label,
    value: platformCounts[type.key] || 0,
    color: type.color
  })).filter(d => d.value > 0);

  return (
    <div className="p-6 space-y-8 bg-[#0a0a0c] min-h-screen text-zinc-100 pb-32">
      <header className="flex items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            placeholder="Search Markets..." 
            className="w-full bg-[#161618] border-none rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#0a0a0c]"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </div>
        </div>
      </header>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Market Intelligence</h1>
        <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Consolidated Global Portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161618] p-6 rounded-2xl space-y-4 border border-white/[0.03] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-orange-500/10 transition-all"></div>
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Assets Managed</p>
            <Wallet className="w-4 h-4 text-orange-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter">{settings.currencySymbol}{totalValue.toLocaleString()}</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-zinc-500 font-medium">Live Connection Active</p>
          </div>
        </div>

        <div className="bg-[#161618] p-6 rounded-2xl space-y-4 border border-white/[0.03]">
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Net Profit</p>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-green-400">+{settings.currencySymbol}{totalProfit.toLocaleString()}</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase">Realized & Unrealized</p>
        </div>

        <div className="bg-[#161618] p-6 rounded-2xl space-y-4 border border-white/[0.03]">
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Growth ROI</p>
            <PieChartIcon className="w-4 h-4 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-blue-400">{profitMargin.toFixed(1)}%</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase">Platform Average</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-[#161618] p-6 rounded-2xl border border-white/[0.03] space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold">Portfolio Composition</h3>
              <p className="text-[10px] text-zinc-500">Visual distribution by market type</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161618', border: 'none', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-zinc-700 font-bold uppercase text-[10px]">No Data Available</div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Diversified</span>
              <span className="text-lg font-bold">{pieData.length} Platforms</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {assetTypes.map(item => {
              const val = platformCounts[item.key] || 0;
              return (
                <div key={item.label} className="bg-[#0a0a0c] p-3 rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">{item.label}</span>
                  </div>
                  <p className="text-sm font-bold">{settings.currencySymbol}{val.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-[#161618] p-6 rounded-2xl border border-white/[0.03] space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold">Market Performance</h3>
              <p className="text-[10px] text-zinc-500">Aggregate growth analytics</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-orange-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161618', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  strokeWidth={3} 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#0a0a0c] p-4 rounded-xl border border-white/5">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Market Health</span>
                <span className="text-[10px] text-green-400 font-bold">BULLISH</span>
             </div>
             <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[75%]"></div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
