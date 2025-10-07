import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast({ title: "¡Bienvenido!", description: "Has iniciado sesión correctamente." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error al iniciar sesión", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-6 bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">Iniciar Sesión</h1>
          <p className="text-foreground/60">Accede a tu panel de administración</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Iniciando sesión...</> : "Iniciar Sesión"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
