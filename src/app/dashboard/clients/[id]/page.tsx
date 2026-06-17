"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Phone, Wallet, TrendingUp, TrendingDown, Edit2, Share2, Activity, ArrowUp, ArrowDown, Info } from "lucide-react";
import { getClients, deleteClient, addTransaction, getSettings } from "@/lib/db";
import { ClientRecord, ChartDataPoint, SystemSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function ClientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [amount, setAmount] = useState("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    const clients = getClients();
    const found = clients.find(c => c.id === id);
    if (found) setClient(found);
    setSettings(getSettings());
  }, [id]);

  if (!client || !settings) return null;

  const performance = (client.profitLoss / (client.investedAmount || 1)) * 100;

  const handleDeposit = () => {
    const val = Number(amount);
    if (isNaN(val) || val <= 0) return;
    addTransaction(client.id, 'deposit', val);
    setAmount("");
    refreshData();
  };

  const handleWithdrawalSubmit = () => {
    const val = Number(amount);
    if (isNaN(val) || val <= 0) return;
    
    const gst = (val * settings.gstRate) / 100;
    const upi = (val * settings.upiRate) / 100;
    
    addTransaction(client.id, 'withdrawal', val, { gst, upi });
    setAmount("");
    setIsWithdrawModalOpen(false);
    refreshData();
  };

  const refreshData = () => {
    const clients = getClients();
    setClient(clients.find(c => c.id === id) || null);
  };

  const handleWhatsAppShare = () => {
    const reportDate = new Date().toLocaleDateString();
    const text = `🚀 *Investment Progress Report*\n\n*Client:* ${client.name}\n*Platform:* ${client.platform}\n*Date:* ${reportDate}\n\n📊 *Portfolio Overview*\n- Invested: ${settings.currencySymbol}${client.investedAmount.toLocaleString()}\n- Current Value: ${settings.currencySymbol}${client.currentValue.toLocaleString()}\n- Total Yield: ${settings.currencySymbol}${client.profitLoss.toLocaleString()} (${performance.toFixed(2)}%)\n\n*Analysis:* Your portfolio is showing ${performance >= 0 ? 'bullish' : 'bearish'} momentum.\n\n_Generated via ${settings.platformName}_`;
    const url = `https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

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
    <div className="p-6 space-y-8 bg-[#0a0a0c] min-h-screen pb-32">
      <header className="flex items-center justify-between">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-[#161618] border border-white/5 text-zinc-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <Link href={`/dashboard/clients/${client.id}/edit`} className="p-3 rounded-2xl bg-[#161618] border border-white/5 text-purple-500">
            <Edit2 className="w-5 h-5" />
          </Link>
          <button onClick={handleDelete} className="p-3 rounded-2xl bg-[#161618] border border-white/5 text-red-500">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <section className="text-center space-y-2">
        <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/30 text-purple-500 text-3xl font-bold">
          {client.name.charAt(0)}
        </div>
        <h1 className="text-3xl font-bold text-white">{client.name}</h1>
        <div className="flex items-center justify-center gap-2">
          <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{client.platform}</span>
          <span className="text-zinc-500 text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</span>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#161618] p-5 rounded-2xl border border-white/5 space-y-1">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Net Investment</p>
          <p className="text-xl font-bold text-white">{settings.currencySymbol}{client.investedAmount.toLocaleString()}</p>
        </div>
        <div className={`bg-[#161618] p-5 rounded-2xl border border-white/5 space-y-1 ${client.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Yield</p>
          <div className="flex items-center gap-1">
            {client.profitLoss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <p className="text-xl font-bold tracking-tight">
              {performance.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <section className="bg-[#161618] p-6 rounded-2xl border border-white/5 space-y-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-500" />
          Performance History
        </h3>
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
      <section className="bg-[#161618] p-6 rounded-2xl border border-white/5 space-y-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Transactions</h3>
        <div className="space-y-4">
          <Input 
            type="number" 
            placeholder={`Amount (${settings.currencySymbol})`} 
            className="bg-[#0a0a0c] border-white/5 h-14 rounded-2xl text-lg text-white font-medium"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleDeposit}
              className="bg-green-600 hover:bg-green-700 h-14 rounded-2xl gap-2 font-bold"
            >
              <ArrowDown className="w-4 h-4" /> Invest
            </Button>
            <Button 
              onClick={() => setIsWithdrawModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 h-14 rounded-2xl gap-2 font-bold"
            >
              <ArrowUp className="w-4 h-4" /> Withdraw
            </Button>
          </div>
        </div>
      </section>

      <Button 
        onClick={handleWhatsAppShare}
        className="w-full h-16 bg-[#161618] hover:bg-zinc-800 border border-white/5 text-purple-500 rounded-2xl gap-3 font-bold text-lg"
      >
        <Share2 className="w-5 h-5" />
        Share Report
      </Button>

      {/* Withdrawal Dialog with Charges */}
      <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
        <DialogContent className="bg-[#161618] border-white/5 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Processing fees will be deducted from the withdrawal amount.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Withdrawal Amount:</span>
              <span className="font-bold">{settings.currencySymbol}{Number(amount).toLocaleString()}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-red-400">
                <span className="flex items-center gap-1"><Info className="w-3 h-3" /> GST ({settings.gstRate}%)</span>
                <span>-{settings.currencySymbol}{((Number(amount) * settings.gstRate) / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-red-400">
                <span className="flex items-center gap-1"><Info className="w-3 h-3" /> UPI Charges ({settings.upiRate}%)</span>
                <span>-{settings.currencySymbol}{((Number(amount) * settings.upiRate) / 100).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-sm font-bold">Net Payout:</span>
              <span className="text-xl font-bold text-green-400">
                {settings.currencySymbol}{(Number(amount) - (Number(amount) * (settings.gstRate + settings.upiRate) / 100)).toLocaleString()}
              </span>
            </div>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-4">
            <Button variant="ghost" onClick={() => setIsWithdrawModalOpen(false)}>Cancel</Button>
            <Button onClick={handleWithdrawalSubmit} className="bg-red-600 hover:bg-red-700">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  function handleDelete() {
    if (confirm("Permanently delete this investor record?")) {
      deleteClient(client!.id);
      router.push("/dashboard/clients");
    }
  }
}
