"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, UserPlus, TrendingUp, TrendingDown, Wallet, Activity, Search, Bell, X, PieChart, ArrowUpRight } from "lucide-react";
import { getClients, getSettings } from "@/lib/db";
import { ClientRecord, SystemSettings } from "@/lib/types";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Progress } from "@/components/ui/progress";

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

  return (
    <div className="p-6 space-y-8 bg-[#0a0a0c] min-h-screen text-zinc-100 pb-32">
      {/* Top Header Mockup from image */}
      <header className="flex items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            placeholder="Search Investments..." 
            className="w-full bg-[#161618] border-none rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-purple-500 transition-all"
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
        <h1 className="text-2xl font-bold tracking-tight">Welcome Back, Advisor</h1>
        <p className="text-zinc-500 text-xs">Happy to see you again. Get update of your assets today, good luck!!</p>
      </div>

      {/* Stats Grid - matching the layout in reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161618] p-6 rounded-2xl space-y-4 border border-white/[0.03]">
          <div className="flex justify-between items-start">
            <p className="text-xs text-zinc-500 font-medium">My Investment Asset</p>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Wallet className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter">{settings.currencySymbol}{totalValue.toLocaleString()}</h2>
          <p className="text-[10px] text-green-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +$150 today
          </p>
        </div>

        <div className="bg-[#161618] p-6 rounded-2xl space-y-4 border border-white/[0.03]">
          <div className="flex justify-between items-start">
            <p className="text-xs text-zinc-500 font-medium">Yearly Profits</p>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter">{settings.currencySymbol}{totalProfit.toLocaleString()}</h2>
          <p className="text-[10px] text-green-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 10% profit increased
          </p>
        </div>

        <div className="bg-[#161618] p-6 rounded-2xl space-y-4 border border-white/[0.03]">
          <div className="flex justify-between items-start">
            <p className="text-xs text-zinc-500 font-medium">Profit Margin</p>
            <div className="p-2 bg-zinc-800 rounded-lg">
              <PieChart className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter">{profitMargin.toFixed(1)}%</h2>
          <p className="text-[10px] text-zinc-500 font-medium">Across all portfolios</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Investment Details Bar-chart-like Section */}
        <section className="bg-[#161618] p-6 rounded-2xl border border-white/[0.03] space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold">Investment Details</h3>
              <p className="text-[10px] text-zinc-500">Assets you have in your account</p>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors">
              <Activity className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl font-bold">{settings.currencySymbol}{totalValue.toLocaleString()}</h4>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-400 font-bold">6.75%</span>
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-zinc-500">This Month</span>
            </div>
          </div>

          <div className="flex h-3 gap-1 rounded-full overflow-hidden">
            <div className="bg-purple-500 w-[32%] h-full"></div>
            <div className="bg-blue-500 w-[18%] h-full"></div>
            <div className="bg-emerald-500 w-[12%] h-full"></div>
            <div className="bg-zinc-700 flex-1 h-full"></div>
          </div>

          <div className="space-y-4 pt-4">
            {[
              { label: 'Money Market', color: 'bg-purple-500', percent: 32, value: totalValue * 0.32 },
              { label: 'Stocks', color: 'bg-blue-500', percent: 18, value: totalValue * 0.18 },
              { label: 'Bonds', color: 'bg-emerald-500', percent: 12, value: totalValue * 0.12 },
              { label: 'Others', color: 'bg-zinc-700', percent: 38, value: totalValue * 0.38 },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <span className="text-zinc-400">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{settings.currencySymbol}{item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  <span className="bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded text-[9px]">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Investment Statistic Chart */}
        <section className="bg-[#161618] p-6 rounded-2xl border border-white/[0.03] space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold">Investment Statistic</h3>
              <p className="text-[10px] text-zinc-500">Revealing risk and growth in investments</p>
            </div>
            <div className="flex bg-[#0a0a0c] p-1 rounded-lg">
              <button className="px-3 py-1 text-[10px] rounded-md bg-[#161618] text-white">All</button>
              <button className="px-3 py-1 text-[10px] rounded-md text-zinc-500">Stocks</button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161618', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
