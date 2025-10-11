import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SocialLinks } from "@/components/SocialLinks";
import { LinkButton } from "@/components/LinkButton";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { Button } from "@/components/ui/button";
import { Settings, QrCode, Share2, Download } from "lucide-react";
import * as LucideIcons from "lucide-react";
import QRCode from "qrcode";

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

  const handleShareProfile = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile?.name || "Mi Perfil",
          text: profile?.description || "",
          url: url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copiado al portapapeles");
    }
  };

  const handleDownloadQR = async () => {
    try {
      const url = window.location.href;
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 512,
        margin: 2,
      });
      
      const link = document.createElement("a");
      link.href = qrCodeDataUrl;
      link.download = "mi-perfil-qr.png";
      link.click();
    } catch (error) {
      console.error("Error generating QR:", error);
    }
  };

  const handleSaveContact = () => {
    if (!profile) return;
    
    const vCardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.name || ""}`,
      profile.job_title ? `TITLE:${profile.job_title}` : "",
      profile.company ? `ORG:${profile.company}` : "",
      profile.description ? `NOTE:${profile.description}` : "",
      `URL:${window.location.href}`,
      "END:VCARD"
    ].filter(Boolean).join("\n");

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name || "contacto"}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
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
              coverImageUrl={profile.cover_image_url}
              jobTitle={profile.job_title || ""}
              company={profile.company || ""}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-2 w-full">
            <Button variant="outline" size="sm" onClick={handleShareProfile}>
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadQR}>
              <QrCode className="w-4 h-4 mr-2" />
              QR
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveContact}>
              <Download className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
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