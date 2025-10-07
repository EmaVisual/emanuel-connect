import { Instagram, Linkedin, Mail, Globe, Music } from "lucide-react";
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
    <div className="flex justify-center space-x-6 mb-8">
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