"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Phone, Wallet, TrendingUp, TrendingDown, Edit2, Share2, Activity, ArrowUp, ArrowDown, Info, BarChart3 } from "lucide-react";
import { getClients, deleteClient, addTransaction, getSettings } from "@/lib/db";
import { ClientRecord, ChartDataPoint, SystemSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
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
    const text = `🚀 *PRO PERFORMANCE REPORT*\n\n*Investor:* ${client.name}\n*Platform:* ${client.platform}\n*Ref Date:* ${reportDate}\n\n📊 *Asset Summary*\n- Initial: ${settings.currencySymbol}${client.investedAmount.toLocaleString()}\n- Valuation: ${settings.currencySymbol}${client.currentValue.toLocaleString()}\n- Net Yield: ${settings.currencySymbol}${client.profitLoss.toLocaleString()} (${performance.toFixed(2)}%)\n\n*Market Analysis:* The portfolio exhibits ${performance >= 0 ? 'bullish accumulation' : 'bearish pressure'}. Recommended action: HOLD.\n\n_Generated via ${settings.platformName} Terminal_`;
    const url = `https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Improved Candle-like data representation
  const candleData = client.transactions.map((t, i) => {
    const prevValue = i === 0 ? 0 : client.transactions.slice(0, i).reduce((sum, tr) => sum + (tr.type === 'deposit' ? tr.amount : -tr.amount), 0);
    const currentValue = prevValue + (t.type === 'deposit' ? t.amount : -t.amount);
    return {
      date: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      open: prevValue,
      close: currentValue,
      amt: currentValue,
      type: t.type
    };
  });

  return (
    <div className="p-6 space-y-8 bg-[#0a0a0c] min-h-screen pb-32">
      <header className="flex items-center justify-between">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-[#161618] border border-white/5 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <Link href={`/dashboard/clients/${client.id}/edit`} className="p-3 rounded-2xl bg-[#161618] border border-white/5 text-purple-500 hover:bg-purple-500/10 transition-colors">
            <Edit2 className="w-5 h-5" />
          </Link>
          <button onClick={handleDelete} className="p-3 rounded-2xl bg-[#161618] border border-white/5 text-red-500 hover:bg-red-500/10 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <section className="text-center space-y-3">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-orange-500/20 rounded-3xl flex items-center justify-center mx-auto border border-white/10 text-white text-4xl font-bold shadow-2xl">
            {client.name.charAt(0)}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-[#0a0a0c] flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tighter">{client.name}</h1>
          <div className="flex items-center justify-center gap-2">
            <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-purple-500/20">{client.platform}</span>
            <span className="text-zinc-500 text-[10px] font-bold uppercase flex items-center gap-1 tracking-wider"><Phone className="w-3 h-3" /> {client.phone}</span>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#161618] p-5 rounded-2xl border border-white/5 space-y-1 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Base Principal</p>
          <p className="text-xl font-bold text-white">{settings.currencySymbol}{client.investedAmount.toLocaleString()}</p>
        </div>
        <div className={`bg-[#161618] p-5 rounded-2xl border border-white/5 space-y-1 relative overflow-hidden ${client.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          <div className={`absolute top-0 left-0 w-1 h-full ${client.profitLoss >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Market Alpha</p>
          <div className="flex items-center gap-1">
            {client.profitLoss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <p className="text-xl font-bold tracking-tight">
              {performance.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Financial Market Chart */}
      <section className="bg-[#161618] p-6 rounded-3xl border border-white/5 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-orange-500" />
            Performance Terminal
          </h3>
          <div className="flex gap-2">
             <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-[9px] text-zinc-500 font-bold uppercase">Bull</span>
             </div>
             <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-[9px] text-zinc-500 font-bold uppercase">Bear</span>
             </div>
          </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={candleData}>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff' }}
                labelStyle={{ color: '#71717a', fontSize: '10px', fontWeight: 'bold' }}
              />
              <ReferenceLine y={0} stroke="#333" strokeDasharray="3 3" />
              <Bar dataKey="close" barSize={20} radius={[4, 4, 0, 0]}>
                {candleData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.close >= entry.open ? '#22c55e' : '#ef4444'} 
                    fillOpacity={0.6}
                    stroke={entry.close >= entry.open ? '#22c55e' : '#ef4444'}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Asset Controls */}
      <section className="bg-[#161618] p-6 rounded-3xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Terminal Actions</h3>
          <Activity className="w-4 h-4 text-zinc-700" />
        </div>
        <div className="space-y-4">
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">{settings.currencySymbol}</span>
             <Input 
                type="number" 
                placeholder="0.00" 
                className="bg-[#0a0a0c] border-white/5 h-14 pl-10 rounded-2xl text-xl text-white font-bold tracking-tight"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleDeposit}
              className="bg-green-600 hover:bg-green-700 h-16 rounded-2xl gap-3 font-bold text-lg shadow-lg shadow-green-500/10"
            >
              <ArrowDown className="w-5 h-5" /> Buy
            </Button>
            <Button 
              onClick={() => setIsWithdrawModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 h-16 rounded-2xl gap-3 font-bold text-lg shadow-lg shadow-red-500/10"
            >
              <ArrowUp className="w-5 h-5" /> Sell
            </Button>
          </div>
        </div>
      </section>

      <Button 
        onClick={handleWhatsAppShare}
        className="w-full h-16 bg-[#161618] hover:bg-zinc-800 border border-white/5 text-purple-400 rounded-3xl gap-3 font-bold text-lg transition-all"
      >
        <Share2 className="w-5 h-5" />
        Broadcast Report
      </Button>

      {/* Professional Withdrawal Settlement */}
      <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
        <DialogContent className="bg-[#161618] border-white/5 text-white rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Settlement Confirmation</DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs">
              Review platform deductions before finalizing the withdrawal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-6">
            <div className="bg-[#0a0a0c] p-4 rounded-2xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-bold uppercase text-[10px]">Requested Principal</span>
                <span className="font-bold text-white">{settings.currencySymbol}{Number(amount).toLocaleString()}</span>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-[11px] text-red-400">
                  <span className="flex items-center gap-1">Regulatory GST ({settings.gstRate}%)</span>
                  <span>-{settings.currencySymbol}{((Number(amount) * settings.gstRate) / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-red-400">
                  <span className="flex items-center gap-1">UPI Processing ({settings.upiRate}%)</span>
                  <span>-{settings.currencySymbol}{((Number(amount) * settings.upiRate) / 100).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center py-4 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Net Credit Amount</span>
              <span className="text-4xl font-bold text-green-400 tracking-tighter">
                {settings.currencySymbol}{(Number(amount) - (Number(amount) * (settings.gstRate + settings.upiRate) / 100)).toLocaleString()}
              </span>
            </div>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-4">
            <Button variant="ghost" className="h-14 rounded-2xl font-bold" onClick={() => setIsWithdrawModalOpen(false)}>Abort</Button>
            <Button onClick={handleWithdrawalSubmit} className="bg-red-600 hover:bg-red-700 h-14 rounded-2xl font-bold">Execute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  function handleDelete() {
    if (confirm("Permanently erase this investor's terminal data?")) {
      deleteClient(client!.id);
      router.push("/dashboard/clients");
    }
  }
}
