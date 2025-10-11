import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  name: string;
  description: string;
  imageUrl: string;
  coverImageUrl?: string | null;
  jobTitle?: string | null;
  company?: string | null;
}

export const ProfileHeader = ({ name, description, imageUrl, coverImageUrl, jobTitle, company }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8 w-full">
      <div className="relative w-full">
        {coverImageUrl && (
          <div className="w-full h-32 sm:h-48 rounded-xl overflow-hidden mb-4">
            <img src={coverImageUrl} alt="Portada" className="w-full h-full object-cover" />
          </div>
        )}
        <Avatar className="profile-avatar w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback className="text-xl sm:text-2xl md:text-3xl font-bold bg-primary text-primary-foreground">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
          {name}
        </h1>
        {(jobTitle || company) && (
          <p className="text-foreground/90 text-sm sm:text-base">
            {jobTitle || ""}{jobTitle && company ? " • " : ""}{company || ""}
          </p>
        )}
        <p className="text-foreground/80 text-base sm:text-lg max-w-sm text-center px-2">
          {description}
        </p>
      </div>
    </div>
  );
};