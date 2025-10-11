import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, Linkedin, Mail, Globe, Music, MessageCircle, Youtube, Twitter, Image as ImageIcon, Facebook, Phone, MapPin, Twitch } from "lucide-react";

interface SocialLinksFormProps {
  userId: string;
}

interface SocialLink {
  id?: string;
  platform: string;
  url: string;
}

export const SocialLinksForm = ({ userId }: SocialLinksFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<SocialLink[]>([
    { platform: "whatsapp1", url: "" },
    { platform: "whatsapp2", url: "" },
    { platform: "instagram", url: "" },
    { platform: "website", url: "" },
    { platform: "youtube", url: "" },
    { platform: "tiktok", url: "" },
    { platform: "twitter", url: "" },
    { platform: "pinterest", url: "" },
    { platform: "facebook", url: "" },
    { platform: "linkedin", url: "" },
    { platform: "threads", url: "" },
    { platform: "twitch", url: "" },
    { platform: "email", url: "" },
    { platform: "phone", url: "" },
    { platform: "location", url: "" },
  ]);

  useEffect(() => {
    loadSocialLinks();
  }, [userId]);

  const loadSocialLinks = async () => {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("user_id", userId);

    if (data) {
      const loadedLinks = links.map((link) => {
        const saved = data.find((d) => d.platform === link.platform);
        return saved ? { ...link, id: saved.id, url: saved.url } : link;
      });
      setLinks(loadedLinks);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    for (const link of links) {
      if (link.url) {
        await supabase.from("social_links").upsert({
          id: link.id,
          user_id: userId,
          platform: link.platform,
          url: link.url,
          order_index: links.indexOf(link),
        });
      } else if (link.id) {
        await supabase.from("social_links").delete().eq("id", link.id);
      }
    }

    toast({
      title: "Guardado",
      description: "Redes sociales actualizadas",
    });

    setLoading(false);
    loadSocialLinks();
  };

  const updateLink = (platform: string, url: string) => {
    setLinks(links.map((link) =>
      link.platform === platform ? { ...link, url } : link
    ));
  };

  const getIcon = (platform: string) => {
    switch (platform) {
      case "whatsapp1": case "whatsapp2": return <MessageCircle className="w-4 h-4" />;
      case "instagram": return <Instagram className="w-4 h-4" />;
      case "linkedin": return <Linkedin className="w-4 h-4" />;
      case "tiktok": return <Music className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "website": return <Globe className="w-4 h-4" />;
      case "youtube": return <Youtube className="w-4 h-4" />;
      case "twitter": return <Twitter className="w-4 h-4" />;
      case "pinterest": return <ImageIcon className="w-4 h-4" />;
      case "facebook": return <Facebook className="w-4 h-4" />;
      case "threads": return <Music className="w-4 h-4" />;
      case "twitch": return <Twitch className="w-4 h-4" />;
      case "phone": return <Phone className="w-4 h-4" />;
      case "location": return <MapPin className="w-4 h-4" />;
      default: return null;
    }
  };

  const getLabel = (platform: string) => {
    switch (platform) {
      case "whatsapp1": return "WhatsApp 1";
      case "whatsapp2": return "WhatsApp 2";
      case "phone": return "Teléfono";
      case "location": return "Ubicación";
      default: return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redes Sociales</CardTitle>
        <CardDescription>Configura los enlaces a tus redes sociales</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          {links.map((link) => (
            <div key={link.platform} className="space-y-2">
              <Label htmlFor={link.platform} className="flex items-center gap-2">
                {getIcon(link.platform)}
                {getLabel(link.platform)}
              </Label>
              <Input
                id={link.platform}
                value={link.url}
                onChange={(e) => updateLink(link.platform, e.target.value)}
                placeholder={`URL de ${getLabel(link.platform)}`}
              />
            </div>
          ))}

          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
