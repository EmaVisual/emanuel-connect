import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  name: string;
  description: string;
  imageUrl: string;
  jobTitle?: string | null;
  company?: string | null;
}

export const ProfileHeader = ({ name, description, imageUrl, jobTitle, company }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-8">
      <Avatar className="profile-avatar w-56 h-56">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
          {name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {name}
        </h1>
        {(jobTitle || company) && (
          <p className="text-foreground/90 text-base">
            {jobTitle || ""}{jobTitle && company ? " • " : ""}{company || ""}
          </p>
        )}
        <p className="text-foreground/80 text-lg max-w-sm text-center">
          {description}
        </p>
      </div>
    </div>
  );
};