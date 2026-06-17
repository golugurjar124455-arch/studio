"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, UserPlus, ArrowRight, TrendingUp, TrendingDown, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getClients } from "@/lib/db";
import { ClientRecord } from "@/lib/types";

export default function ClientsPage() {
  const [allClients, setAllClients] = useState<ClientRecord[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setAllClients(getClients());
  }, []);

  const filteredClients = allClients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <div className="p-6 space-y-6 flex flex-col min-h-full">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold text-white">क्लाइंट्स</h1>
        <Link href="/dashboard/add" className="p-3 rounded-2xl bg-primary/20 border border-primary/30 text-primary">
          <UserPlus className="w-6 h-6" />
        </Link>
      </header>

      <div className="relative animate-staggered-fade-in">
        <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="नाम या नंबर से खोजें..."
          className="pl-12 h-14 rounded-3xl bg-card border-white/5 text-lg shadow-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto scroll-hide pb-8">
        {filteredClients.map((client, i) => (
          <Link
            key={client.id}
            href={`/dashboard/clients/${client.id}`}
            className="flex items-center justify-between p-5 bento-card rounded-[2rem] group animate-staggered-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center font-headline font-bold text-2xl text-primary border border-primary/20">
                {client.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg text-white group-hover:text-primary transition-colors">{client.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>{client.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right flex items-center gap-3">
              <div className="space-y-0.5">
                <p className="font-headline font-bold text-white tracking-tight">₹{client.currentValue.toLocaleString()}</p>
                <div className={`flex items-center justify-end gap-1 text-xs font-bold ${client.profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {client.profitLoss >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{client.profitLoss >= 0 ? '+' : ''}₹{Math.abs(client.profitLoss).toLocaleString()}</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
            </div>
          </Link>
        ))}

        {filteredClients.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-muted/20 rounded-[2.5rem] flex items-center justify-center mx-auto opacity-50">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">कोई क्लाइंट नहीं मिला</p>
          </div>
        )}
      </div>
    </div>
  );
}