import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SocialLinks } from "@/components/SocialLinks";
import { LinkButton } from "@/components/LinkButton";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import * as LucideIcons from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [customLinks, setCustomLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadData();
    checkAuth();
    trackProfileView();
  }, []);

  const trackProfileView = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (profiles) {
      await supabase.from("profile_views").insert({
        user_id: profiles.id,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      });
    }
  };

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAdmin(!!session);
  };

  const loadData = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (profiles) {
      setProfile(profiles);
    }

    const { data: social } = await supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("order_index");

    if (social) {
      setSocialLinks(social);
    }

    const { data: custom } = await supabase
      .from("custom_links")
      .select("*")
      .eq("is_active", true)
      .order("order_index");

    if (custom) {
      setCustomLinks(custom);
    }

    setLoading(false);
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <LucideIcons.Zap className="w-5 h-5" />;
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <p className="text-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center relative">
      {isAdmin && (
        <Button
          className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 text-xs sm:text-sm"
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard")}
        >
          <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Dashboard</span>
        </Button>
      )}

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 flex justify-center">
        <div className="max-w-md w-full space-y-4 sm:space-y-6 flex flex-col items-center">
          {/* Profile Header */}
          {profile && (
            <ProfileHeader
              name={profile.name || "Emanuel Parra | Graphic Design"}
              description={profile.description || "¡Diseño gráfico, diseño web y arte!"}
              imageUrl={profile.avatar_url || "/lovable-uploads/f877dab3-a083-48f5-841a-3678f90c4eee.png"}
              jobTitle={profile.job_title || ""}
              company={profile.company || ""}
            />
          )}
          {socialLinks.length > 0 && <SocialLinks links={socialLinks} />}

          {/* Custom Link Buttons */}
          <div className="space-y-3 sm:space-y-4 w-full">
            {customLinks.map((link) => (
              <LinkButton 
                key={link.id} 
                href={link.url} 
                icon={getIcon(link.icon_name)}
                linkId={link.id}
                userId={link.user_id}
              >
                {link.title}
              </LinkButton>
            ))}
          </div>

          {/* Spotify Embed */}
          {profile?.spotify_embed_url && (
            <div className="pt-4 sm:pt-6 w-full">
              <SpotifyEmbed url={profile.spotify_embed_url} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Index;