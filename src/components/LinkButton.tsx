import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  linkId?: string;
  userId?: string;
}

export const LinkButton = ({ href, children, icon, linkId, userId }: LinkButtonProps) => {
  const handleClick = async () => {
    if (userId) {
      await supabase.from("link_clicks").insert({
        user_id: userId,
        link_type: "custom",
        link_id: linkId || null,
        link_title: children as string,
        referrer: document.referrer || null,
      });
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="link-button flex items-center justify-center space-x-3 group"
    >
      {icon && <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>}
      <span className="flex-1 text-center">{children}</span>
      <ExternalLink className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
    </a>
  );
};