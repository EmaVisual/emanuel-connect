import { ProfileHeader } from "@/components/ProfileHeader";
import { SocialLinks } from "@/components/SocialLinks";
import { LinkButton } from "@/components/LinkButton";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { Heart, Briefcase, Globe, Palette, Zap } from "lucide-react";

const Index = () => {
  const links = [
    {
      title: "Usa Lovable con créditos extra",
      href: "https://lovable.dev/invite/7b3f859c-20a3-4c06-be3d-2f789873bec4",
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: "Mi agencia digital - Daez Digital",
      href: "https://daezdigital.vercel.app",
      icon: <Globe className="w-5 h-5" />
    },
    {
      title: "Stay Mad Agency",
      href: "https://staymadagency.com",
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      title: "Mi Website Personal",
      href: "https://emavisual.vercel.app/",
      icon: <Globe className="w-5 h-5" />
    },
    {
      title: "Portfolio en Behance",
      href: "https://www.behance.net/emavisual",
      icon: <Palette className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6 flex flex-col items-center">
          
          {/* Profile Header */}
          <ProfileHeader 
            name="Emanuel Parra | Graphic Design"
            description="¡Diseño gráfico, diseño web y arte!"
            imageUrl="/lovable-uploads/f877dab3-a083-48f5-841a-3678f90c4eee.png"
          />

          {/* Social Links */}
          <SocialLinks />

          {/* Link Buttons */}
          <div className="space-y-4 w-full">
            {links.map((link, index) => (
              <LinkButton 
                key={index}
                href={link.href}
                icon={link.icon}
              >
                {link.title}
              </LinkButton>
            ))}
          </div>

          {/* Spotify Embed */}
          <div className="pt-6 w-full">
            <SpotifyEmbed />
          </div>

          {/* Footer */}
          <div className="text-center pt-8 pb-4">
            <p className="text-foreground/60 text-sm flex items-center justify-center space-x-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>using Lovable</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;