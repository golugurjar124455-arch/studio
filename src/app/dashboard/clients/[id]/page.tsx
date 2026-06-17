"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Phone, Wallet, TrendingUp, Sparkles, TrendingDown, Edit2, Share2, PieChart as PieIcon } from "lucide-react";
import { getClients, deleteClient } from "@/lib/db";
import { ClientRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function ClientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [narrative, setNarrative] = useState("");

  useEffect(() => {
    const clients = getClients();
    const found = clients.find(c => c.id === id);
    if (found) setClient(found);
  }, [id]);

  if (!client) return null;

  const performance = (client.profitLoss / client.investedAmount) * 100;

  const handleWhatsAppShare = () => {
    const text = `नमस्ते ${client.name},\n\nआपके निवेश का संक्षिप्त विवरण:\n🔹 निवेशित राशि: ₹${client.investedAmount.toLocaleString()}\n🔹 वर्तमान वैल्यू: ₹${client.currentValue.toLocaleString()}\n🔹 कुल लाभ/हानि: ₹${client.profitLoss.toLocaleString()} (${performance.toFixed(2)}%)\n\n${narrative || "आपका निवेश सही दिशा में बढ़ रहा है।"}\n\nधन्यवाद!`;
    const url = `https://wa.me/91${client.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const generateLocalNarrative = () => {
    let text = "";
    const profit = client.profitLoss;
    const pct = performance.toFixed(2);

    if (profit > 0) {
      if (performance > 15) {
        text = `शानदार! ${client.name} का पोर्टफोलियो बहुत मजबूत स्थिति में है। इन्होंने ₹${profit.toLocaleString()} का मुनाफा कमाया है, जो कि ${pct}% की असाधारण वृद्धि है। यह सही निवेश रणनीति को दर्शाता है।`;
      } else {
        text = `${client.name} का निवेश सही दिशा में बढ़ रहा है। वर्तमान में ये ₹${profit.toLocaleString()} (${pct}%) के लाभ में हैं। पोर्टफोलियो में स्थिरता बनी हुई है।`;
      }
    } else if (profit < 0) {
      const absProfit = Math.abs(profit);
      if (performance < -10) {
        text = `बाजार की मौजूदा अस्थिरता के कारण पोर्टफोलियो में ₹${absProfit.toLocaleString()} (${pct}%) की गिरावट देखी गई है। यह समय धैर्य रखने और लंबी अवधि के लक्ष्यों पर ध्यान केंद्रित करने का है।`;
      } else {
        text = `पोर्टफोलियो में ₹${absProfit.toLocaleString()} की मामूली गिरावट है। बाजार के उतार-चढ़ाव को देखते हुए ${pct}% का सुधार सामान्य है। जल्द ही रिकवरी की उम्मीद की जा सकती है।`;
      }
    } else {
      text = "निवेश अभी 'ब्रेक-ईवन' स्तर पर है। कोई लाभ या हानि नहीं हुई है। बाजार की चाल पर नज़र रखना बेहतर होगा।";
    }

    setNarrative(text);
  };

  const allocationData = [
    { name: 'Stocks', value: client.stocks || 0, color: '#8b5cf6' },
    { name: 'Mutual Funds', value: client.mutualFunds || 0, color: '#3b82f6' },
    { name: 'Gold', value: client.gold || 0, color: '#fbbf24' },
  ].filter(item => item.value > 0);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-32">
      <header className="flex items-center justify-between">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex gap-2">
          <Link href={`/dashboard/clients/${client.id}/edit`} className="p-3 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
            <Edit2 className="w-5 h-5" />
          </Link>
          <button onClick={handleDelete} className="p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <section className="text-center space-y-4">
        <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center mx-auto border border-primary/30 neon-glow text-primary text-4xl font-headline font-bold">
          {client.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-white">{client.name}</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-1">
            <Phone className="w-4 h-4" /> {client.phone}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4">
        <div className="bento-card p-6 rounded-[2rem] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">निवेशित राशि</p>
              <p className="text-2xl font-headline font-bold text-white">₹{client.investedAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className={`bento-card p-6 rounded-[2rem] flex items-center justify-between ${client.profitLoss >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${client.profitLoss >= 0 ? 'bg-emerald-400/20' : 'bg-rose-400/20'}`}>
              {client.profitLoss >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">कुल लाभ / हानि</p>
              <p className="text-2xl font-headline font-bold">
                {client.profitLoss >= 0 ? '+' : ''}₹{client.profitLoss.toLocaleString()}
                <span className="text-sm font-medium ml-2">({performance.toFixed(2)}%)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {allocationData.length > 0 && (
        <section className="bento-card p-6 rounded-[2rem] space-y-4">
           <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">इन्वेस्टमेंट ब्रेकडाउन</h3>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1424', border: 'none', borderRadius: '12px', color: '#fff' }}
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4">
            {allocationData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{item.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-headline font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            इन्वेस्टमेंट नैरेटिव
          </h3>
          <Button
            onClick={generateLocalNarrative}
            size="sm"
            className="rounded-xl bg-primary hover:bg-primary/90 text-white px-4 h-10 font-bold"
          >
            सारांश देखें
          </Button>
        </div>

        {narrative ? (
          <div className="p-6 bento-card rounded-[2rem] bg-primary/5 border-primary/20 animate-in zoom-in duration-300">
            <p className="text-sm leading-relaxed text-white font-medium italic mb-4">
              "{narrative}"
            </p>
            <Button 
              onClick={handleWhatsAppShare}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold h-12"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp पर शेयर करें
            </Button>
          </div>
        ) : (
          <div className="p-10 text-center bento-card rounded-[2rem] border-dashed bg-transparent border-white/5">
            <p className="text-muted-foreground text-sm">क्लाइंट के प्रदर्शन का विश्लेषण प्राप्त करने के लिए बटन दबाएं</p>
          </div>
        )}
      </section>
    </div>
  );

  function handleDelete() {
    if (confirm("क्या आप वाकई इस क्लाइंट को हटाना चाहते हैं?")) {
      deleteClient(client!.id);
      router.push("/dashboard/clients");
    }
  }
}
