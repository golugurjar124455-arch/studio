"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Edit, Phone, Wallet, TrendingUp, Sparkles, Loader2, TrendingDown } from "lucide-react";
import { getClients, deleteClient } from "@/lib/db";
import { ClientRecord } from "@/lib/types";
import { generateInvestmentNarrative } from "@/ai/flows/generate-investment-narrative-flow";
import { Button } from "@/components/ui/button";

export default function ClientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [narrative, setNarrative] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const clients = getClients();
    const found = clients.find(c => c.id === id);
    if (found) setClient(found);
  }, [id]);

  if (!client) return null;

  const handleDelete = () => {
    if (confirm("क्या आप वाकई इस क्लाइंट को हटाना चाहते हैं?")) {
      deleteClient(client.id);
      router.push("/dashboard/clients");
    }
  };

  const generateNarrative = async () => {
    setIsGenerating(true);
    try {
      const result = await generateInvestmentNarrative({
        investedAmount: client.investedAmount,
        currentValue: client.currentValue,
        profitLoss: client.profitLoss
      });
      setNarrative(result.narrative);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const performance = (client.profitLoss / client.investedAmount) * 100;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex gap-2">
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

        <div className="bento-card p-6 rounded-[2rem] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">वर्तमान वैल्यू</p>
              <p className="text-2xl font-headline font-bold text-white">₹{client.currentValue.toLocaleString()}</p>
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

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-headline font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            इन्वेस्टमेंट नैरेटिव
          </h3>
          <Button
            onClick={generateNarrative}
            disabled={isGenerating}
            size="sm"
            className="rounded-xl bg-primary hover:bg-primary/90 text-white px-4 h-10 font-bold"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "AI सारांश"}
          </Button>
        </div>

        {narrative ? (
          <div className="p-6 bento-card rounded-[2rem] bg-primary/5 border-primary/20 animate-in zoom-in duration-300">
            <p className="text-sm leading-relaxed text-white font-medium italic">
              "{narrative}"
            </p>
          </div>
        ) : (
          <div className="p-10 text-center bento-card rounded-[2rem] border-dashed bg-transparent border-white/5">
            <p className="text-muted-foreground text-sm">क्लाइंट के प्रदर्शन का AI विश्लेषण प्राप्त करने के लिए बटन दबाएं</p>
          </div>
        )}
      </section>
    </div>
  );
}