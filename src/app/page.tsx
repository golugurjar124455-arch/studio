"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bitcoin, Lock, User, TrendingUp } from "lucide-react";
import { setSession, getSession } from "@/lib/db";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session?.isLoggedIn) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setSession(username);
      router.push("/dashboard");
    } else {
      setError("Invalid credentials (Try admin/admin)");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 bg-zinc-950">
      <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-orange-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
          <Bitcoin className="w-12 h-12 text-orange-500" />
        </div>
        <div>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tighter">
            COIN<span className="text-orange-500">TRACK</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Professional Investment Gateway</p>
        </div>
      </div>

      <Card className="w-full bg-zinc-900 border-white/5 shadow-2xl animate-in slide-in-from-bottom duration-500">
        <CardHeader>
          <CardTitle className="text-xl text-center">Secure Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Username"
                  className="pl-10 h-12 rounded-xl bg-zinc-800 border-white/10 text-white placeholder:text-zinc-600 focus:ring-orange-500/50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 h-12 rounded-xl bg-zinc-800 border-white/10 text-white placeholder:text-zinc-600 focus:ring-orange-500/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}
            <Button type="submit" className="w-full h-12 text-lg bg-orange-500 text-white hover:bg-orange-600 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <p className="text-zinc-600 text-xs text-center flex items-center gap-1">
        <TrendingUp className="w-3 h-3" /> Encrypted Local-First Architecture
      </p>
    </div>
  );
}
