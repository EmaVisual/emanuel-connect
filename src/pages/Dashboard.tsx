import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Save, Eye, Loader2 } from "lucide-react";
import { SocialLinksForm } from "@/components/dashboard/SocialLinksForm";
import { CustomLinksForm } from "@/components/dashboard/CustomLinksForm";
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [profile, setProfile] = useState({ name: "", description: "", avatar_url: "", spotify_embed_url: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate("/auth");
    
    setUserId(user.id);
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (data) setProfile(data);
    setLoading(false);
  };

  const saveProfile = async () => {
    const { error } = await supabase.from("profiles").update(profile).eq("id", userId);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "¡Guardado!", description: "Perfil actualizado correctamente." });
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
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>Actualiza tu información básica y configuración de Spotify</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={profile.description} onChange={(e) => setProfile({...profile, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>URL Avatar</Label>
                  <Input value={profile.avatar_url} onChange={(e) => setProfile({...profile, avatar_url: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Spotify Embed URL</Label>
                  <Input value={profile.spotify_embed_url} onChange={(e) => setProfile({...profile, spotify_embed_url: e.target.value})} />
                </div>
                <Button onClick={saveProfile}><Save className="mr-2 h-4 w-4" />Guardar Perfil</Button>
              </CardContent>
            </Card>
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
      </div>
    </div>
  );
};

export default Dashboard;
