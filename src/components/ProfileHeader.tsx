import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  name: string;
  description: string;
  imageUrl: string;
}

export const ProfileHeader = ({ name, description, imageUrl }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-8">
      <Avatar className="profile-avatar">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
          {name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {name}
        </h1>
        <p className="text-foreground/80 text-lg max-w-sm">
          {description}
        </p>
      </div>
    </div>
  );
};