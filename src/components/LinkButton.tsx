import { ExternalLink } from "lucide-react";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const LinkButton = ({ href, children, icon }: LinkButtonProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-button flex items-center justify-center space-x-3 group"
    >
      {icon && <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>}
      <span className="flex-1 text-center">{children}</span>
      <ExternalLink className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
    </a>
  );
};