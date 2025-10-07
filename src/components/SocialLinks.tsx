import { Instagram, Linkedin, Mail, Globe, Music } from "lucide-react";

interface SocialLinksProps {
  links: Array<{
    platform: string;
    url: string;
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

  return (
    <div className="flex justify-center space-x-6 mb-8">
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-300"
          aria-label={getLabel(link.platform)}
        >
          {getIcon(link.platform)}
        </a>
      ))}
    </div>
  );
};