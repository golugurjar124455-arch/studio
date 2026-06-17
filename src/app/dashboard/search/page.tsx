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
    <div className="p-6 space-y-8 flex flex-col h-screen">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl font-headline font-bold text-white">ग्लोबल सर्च</h1>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-4 h-6 w-6 text-primary" />
        <Input
          autoFocus
          placeholder="क्लाइंट का नाम या नंबर..."
          className="pl-14 h-16 rounded-[2rem] bg-card border-white/5 text-xl font-medium focus:ring-primary shadow-2xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto scroll-hide space-y-4 pb-20">
        {results.length > 0 ? (
          <div className="space-y-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">सर्च परिणाम ({results.length})</p>
            {results.map((client) => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="flex items-center justify-between p-5 bento-card rounded-[2rem] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white group-hover:text-primary transition-colors">{client.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted/20 rounded-[2.5rem] flex items-center justify-center mx-auto opacity-50 mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">कोई परिणाम नहीं मिला</p>
          </div>
        ) : (
          <div className="text-center py-20 space-y-4">
             <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-primary opacity-50" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">खोज शुरू करने के लिए कुछ टाइप करें</p>
          </div>
        )}
      </div>
    </div>
  );
}