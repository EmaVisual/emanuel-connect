import { Instagram, Linkedin, Mail, Globe, Music, MessageCircle, Youtube, Twitter, Image as ImageIcon, Facebook, Phone, MapPin, Twitch } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SocialLinksProps {
  links: Array<{
    id: string;
    platform: string;
    url: string;
    user_id: string;
  }>;
}

export const SocialLinks = ({ links }: SocialLinksProps) => {
  const getIcon = (platform: string) => {
    switch (platform) {
      case "whatsapp1":
      case "whatsapp2":
        return <MessageCircle className="social-icon" />;
      case "instagram":
        return <Instagram className="social-icon" />;
      case "linkedin":
        return <Linkedin className="social-icon" />;
      case "tiktok":
        return <Music className="social-icon" />;
      case "email":
        return <Mail className="social-icon" />;
      case "website":
        return <Globe className="social-icon" />;
      case "youtube":
        return <Youtube className="social-icon" />;
      case "twitter":
        return <Twitter className="social-icon" />;
      case "pinterest":
        return <ImageIcon className="social-icon" />;
      case "facebook":
        return <Facebook className="social-icon" />;
      case "threads":
        return <Music className="social-icon" />;
      case "twitch":
        return <Twitch className="social-icon" />;
      case "phone":
        return <Phone className="social-icon" />;
      case "location":
        return <MapPin className="social-icon" />;
      default:
        return <Globe className="social-icon" />;
    }
  };

  const getLabel = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  const handleClick = async (link: any) => {
    await supabase.from("link_clicks").insert({
      user_id: link.user_id,
      link_type: "social",
      link_id: link.id,
      link_title: link.platform,
      referrer: document.referrer || null,
    });
  };

  return (
    <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mb-6 sm:mb-8">
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick(link)}
          className="hover:scale-110 transition-transform duration-300"
          aria-label={getLabel(link.platform)}
        >
          {getIcon(link.platform)}
        </a>
      ))}
    </div>
  );
};