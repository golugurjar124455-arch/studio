"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight, User, Phone, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getClients } from "@/lib/db";
import { ClientRecord } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [allClients, setAllClients] = useState<ClientRecord[]>([]);
  const router = useRouter();

  useEffect(() => {
    setAllClients(getClients());
  }, []);

  const results = query 
    ? allClients.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) || 
        c.phone.includes(query)
      ) 
    : [];

  return (
    <div className="p-6 space-y-8 flex flex-col h-screen bg-zinc-950">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-headline font-bold text-white tracking-tighter">Global Search</h1>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-4 h-6 w-6 text-orange-500" />
        <Input
          autoFocus
          placeholder="Type name or mobile number..."
          className="pl-14 h-16 rounded-2xl bg-zinc-900 border-white/5 text-xl font-medium text-white placeholder:text-zinc-700 focus:ring-orange-500/50 shadow-2xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto scroll-hide space-y-4 pb-24">
        {results.length > 0 ? (
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Search Results ({results.length})</p>
            {results.map((client) => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="flex items-center justify-between p-5 bg-zinc-900 border border-white/5 rounded-2xl group hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-orange-500 border border-white/5 font-bold">
                    {client.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white group-hover:text-orange-500 transition-colors">{client.name}</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase">
                      <Phone className="w-3 h-3" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-700 group-hover:text-orange-500 transition-colors" />
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-zinc-900 rounded-[2.5rem] border border-white/5 flex items-center justify-center mx-auto opacity-50 mb-4">
              <Search className="w-10 h-10 text-zinc-600" />
            </div>
            <p className="text-zinc-500 font-medium">No records found</p>
          </div>
        ) : (
          <div className="text-center py-20 space-y-4">
             <div className="w-20 h-20 bg-orange-500/5 rounded-[2.5rem] border border-orange-500/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-orange-500 opacity-30" />
            </div>
            <p className="text-zinc-500 text-sm font-medium">Start typing to search investors</p>
          </div>
        )}
      </div>
    </div>
  );
}
