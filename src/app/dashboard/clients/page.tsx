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
        <h1 className="text-3xl font-headline font-bold text-white tracking-tighter">Investors</h1>
        <Link href="/dashboard/add" className="p-3 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-500">
          <UserPlus className="w-6 h-6" />
        </Link>
      </header>

      <div className="relative animate-staggered-fade-in">
        <Search className="absolute left-4 top-4 h-5 w-5 text-zinc-500" />
        <Input
          placeholder="Search by name or mobile..."
          className="pl-12 h-14 rounded-2xl bg-zinc-900 border-white/5 text-lg shadow-xl text-white placeholder:text-zinc-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto scroll-hide pb-24">
        {filteredClients.map((client, i) => (
          <Link
            key={client.id}
            href={`/dashboard/clients/${client.id}`}
            className="flex items-center justify-between p-5 bg-zinc-900 border border-white/5 rounded-[1.5rem] group animate-staggered-fade-in hover:border-orange-500/30 transition-all"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center font-headline font-bold text-2xl text-orange-500 border border-white/5">
                {client.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg text-white group-hover:text-orange-500 transition-colors">{client.name}</p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase">
                  <Phone className="w-3 h-3" />
                  <span>{client.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right flex items-center gap-3">
              <div className="space-y-0.5">
                <p className="font-headline font-bold text-white tracking-tight">${client.currentValue.toLocaleString()}</p>
                <div className={`flex items-center justify-end gap-1 text-[10px] font-bold ${client.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {client.profitLoss >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{client.profitLoss >= 0 ? '+' : ''}${Math.abs(client.profitLoss).toLocaleString()}</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-700 group-hover:text-orange-500 transition-colors" />
            </div>
          </Link>
        ))}

        {filteredClients.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mx-auto opacity-50 border border-white/5">
              <Search className="w-10 h-10 text-zinc-600" />
            </div>
            <p className="text-zinc-500 font-medium">No investors found</p>
          </div>
        )}
      </div>
    </div>
  );
}
