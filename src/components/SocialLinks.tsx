import { Instagram, Linkedin, Mail, Globe, Music } from "lucide-react";

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

export const SocialLinks = () => {
  const socialLinks: SocialLink[] = [
    {
      icon: <Instagram className="social-icon" />,
      href: "https://www.instagram.com/ema.visual",
      label: "Instagram"
    },
    {
      icon: <Linkedin className="social-icon" />,
      href: "https://linkedin.com/in/emavisual",
      label: "LinkedIn"
    },
    {
      icon: <Music className="social-icon" />,
      href: "https://tiktok.com/@ema.visual",
      label: "TikTok"
    },
    {
      icon: <Mail className="social-icon" />,
      href: "mailto:emanuel@staymadagency.com",
      label: "Email"
    },
    {
      icon: <Globe className="social-icon" />,
      href: "https://emavisual.vercel.app/",
      label: "Website"
    }
  ];

  return (
    <div className="flex justify-center space-x-6 mb-8">
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-300"
          aria-label={link.label}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};