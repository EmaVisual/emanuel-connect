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
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Panel de Administración</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => navigate("/")} className="flex-1 sm:flex-none text-sm">
              <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Ver Perfil</span>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex-1 sm:flex-none text-sm">
              <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Salir</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1">
            <TabsTrigger value="profile" className="text-xs sm:text-sm py-2 sm:py-2.5">Perfil</TabsTrigger>
            <TabsTrigger value="social" className="text-xs sm:text-sm py-2 sm:py-2.5">Redes</TabsTrigger>
            <TabsTrigger value="custom" className="text-xs sm:text-sm py-2 sm:py-2.5">Links</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 sm:py-2.5">Analíticas</TabsTrigger>
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

        <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50 flex flex-col items-center gap-2 sm:gap-3">
          <img src={connexoLogo} alt="Connexo Logo" className="h-6 sm:h-8" />
          <p className="text-foreground/60 text-xs sm:text-sm">Desarrollado por Connexo</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
