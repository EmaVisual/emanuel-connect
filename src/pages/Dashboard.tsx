import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Eye, Loader2 } from "lucide-react";
import connexoLogo from "@/assets/connexo-logo.png";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { SocialLinksForm } from "@/components/dashboard/SocialLinksForm";
import { CustomLinksForm } from "@/components/dashboard/CustomLinksForm";
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate("/auth");
    
    setUserId(user.id);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div className="min-h-screen bg-gradient-primary flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gradient-primary p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}><Eye className="mr-2 h-4 w-4" />Ver Perfil</Button>
            <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Salir</Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="social">Redes Sociales</TabsTrigger>
            <TabsTrigger value="custom">Links Personalizados</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileForm userId={userId} />
          </TabsContent>

          <TabsContent value="social">
            <SocialLinksForm userId={userId} />
          </TabsContent>

          <TabsContent value="custom">
            <CustomLinksForm userId={userId} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsCard userId={userId} />
          </TabsContent>
        </Tabs>

        <footer className="mt-12 pb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <img src={connexoLogo} alt="Connexo" className="h-6" />
          <span>Desarrollado por Connexo</span>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
