"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, Lock, User } from "lucide-react";
import { setSession, getSession } from "@/lib/db";
import { DemoModeBadge } from "@/components/ui/demo-mode-badge";

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
      setError("गलत यूजरनेम या पासवर्ड (कोशिश करें admin/admin)");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
      <div className="text-center space-y-2 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-primary/30 neon-glow">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">
          डेमो इन्वेस्टमेंट ऐप
        </h1>
        <p className="text-muted-foreground">ऑफ़लाइन सुरक्षित गेटवे</p>
      </div>

      <Card className="w-full bento-card border-white/5 animate-in slide-in-from-bottom duration-500">
        <CardHeader>
          <CardTitle className="text-xl">लॉग इन करें</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="यूजरनेम"
                className="pl-10 h-12 rounded-xl bg-muted/30 border-white/10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="पासवर्ड"
                className="pl-10 h-12 rounded-xl bg-muted/30 border-white/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-xs text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full h-12 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-bold shadow-lg shadow-secondary/20">
              प्रवेश करें
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="fixed bottom-8 left-6 right-6">
        <DemoModeBadge />
      </div>
    </div>
  );
}