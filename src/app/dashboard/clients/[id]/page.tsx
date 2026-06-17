"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Phone, Wallet, TrendingUp, Sparkles, TrendingDown, Edit2, Share2, Activity, ArrowUp, ArrowDown } from "lucide-react";
import { getClients, deleteClient, addTransaction } from "@/lib/db";
import { ClientRecord, ChartDataPoint } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, Area, Cell } from "recharts";
import { Input } from "@/components/ui/input";

export default function ClientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState<'stats' | 'history'>('stats');

  useEffect(() => {
    const clients = getClients();
    const found = clients.find(c => c.id === id);
    if (found) setClient(found);
  }, [id]);

  if (!client) return null;

  const performance = (client.profitLoss / (client.investedAmount || 1)) * 100;

  const handleAction = (type: 'deposit' | 'withdrawal') => {
    const val = Number(amount);
    if (isNaN(val) || val <= 0) return;
    addTransaction(client.id, type, val);
    setAmount("");
    // Refresh local state
    const clients = getClients();
    setClient(clients.find(c => c.id === id) || null);
  };

  const handleWhatsAppShare = () => {
    const reportDate = new Date().toLocaleDateString();
    const text = `🚀 *Investment Progress Report*\n\n*Client:* ${client.name}\n*Platform:* ${client.platform}\n*Date:* ${reportDate}\n\n📊 *Portfolio Overview*\n- Invested: $${client.investedAmount.toLocaleString()}\n- Current Value: $${client.currentValue.toLocaleString()}\n- Total Yield: $${client.profitLoss.toLocaleString()} (${performance.toFixed(2)}%)\n\n*Analysis:* Your portfolio is showing ${performance >= 0 ? 'bullish' : 'bearish'} momentum. We are monitoring the market closely.\n\n_Generated via CoinTrack Pro_`;
    const url = `https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Generate Mock Candle Data based on transactions
  const candleData: ChartDataPoint[] = client.transactions.map((t, i) => {
    const prevClose = i === 0 ? 0 : client.transactions.slice(0, i).reduce((sum, tr) => sum + (tr.type === 'deposit' ? tr.amount : -tr.amount), 0);
    const close = prevClose + (t.type === 'deposit' ? t.amount : -t.amount);
    return {
      date: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      open: prevClose,
      close: close,
      high: Math.max(prevClose, close) * 1.05,
      low: Math.min(prevClose, close) * 0.95,
    };
  });

  return (
    <div className="p-6 space-y-8 bg-zinc-950 min-h-screen pb-32">
      <header className="flex items-center justify-between">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <Link href={`/dashboard/clients/${client.id}/edit`} className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-orange-500">
            <Edit2 className="w-5 h-5" />
          </Link>
          <button onClick={handleDelete} className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-red-500">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <section className="text-center space-y-2">
        <div className="w-20 h-20 bg-orange-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-orange-500/30 text-orange-500 text-3xl font-headline font-bold">
          {client.name.charAt(0)}
        </div>
        <h1 className="text-3xl font-headline font-bold text-white">{client.name}</h1>
        <div className="flex items-center justify-center gap-2">
          <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{client.platform}</span>
          <span className="text-zinc-500 text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</span>
        </div>
      </section>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-5 rounded-[1.5rem] border border-white/5 space-y-1">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Net Investment</p>
          <p className="text-xl font-headline font-bold text-white">$ {client.investedAmount.toLocaleString()}</p>
        </div>
        <div className={`bg-zinc-900 p-5 rounded-[1.5rem] border border-white/5 space-y-1 ${client.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Yield</p>
          <div className="flex items-center gap-1">
            {client.profitLoss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <p className="text-xl font-headline font-bold tracking-tight">
              {performance.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <section className="bg-zinc-900 p-6 rounded-[2rem] border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-500" />
            Performance Candles
          </h3>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={candleData}>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }}
                labelStyle={{ display: 'none' }}
              />
              <Bar dataKey="close" barSize={15}>
                {candleData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.close >= entry.open ? '#22c55e' : '#ef4444'} 
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Actions Section */}
      <section className="bg-zinc-900 p-6 rounded-[2rem] border border-white/5 space-y-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Execute Transactions</h3>
        <div className="space-y-4">
          <Input 
            type="number" 
            placeholder="Enter Amount ($)" 
            className="bg-zinc-800 border-white/5 h-14 rounded-2xl text-lg text-white font-medium"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => handleAction('deposit')}
              className="bg-green-600 hover:bg-green-700 h-14 rounded-2xl gap-2 font-bold"
            >
              <ArrowDown className="w-4 h-4" /> Invest
            </Button>
            <Button 
              onClick={() => handleAction('withdrawal')}
              className="bg-red-600 hover:bg-red-700 h-14 rounded-2xl gap-2 font-bold"
            >
              <ArrowUp className="w-4 h-4" /> Withdraw
            </Button>
          </div>
        </div>
      </section>

      {/* Sharing Section */}
      <Button 
        onClick={handleWhatsAppShare}
        className="w-full h-16 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-orange-500 rounded-[2rem] gap-3 font-bold text-lg transition-all"
      >
        <Share2 className="w-5 h-5" />
        Share Progress Report
      </Button>
    </div>
  );

  function handleDelete() {
    if (confirm("Permanently delete this investor record?")) {
      deleteClient(client!.id);
      router.push("/dashboard/clients");
    }
  }
}
