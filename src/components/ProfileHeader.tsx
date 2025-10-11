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
    <div className="flex flex-col items-center text-center mb-6 sm:mb-8 w-full">
      <div className="relative w-full mb-16 sm:mb-20 md:mb-24">
        {coverImageUrl && (
          <div className="w-full h-32 sm:h-48 overflow-hidden">
            <img src={coverImageUrl} alt="Portada" className="w-full h-full object-cover" />
          </div>
        )}
        <div className={`absolute ${coverImageUrl ? '-bottom-16 sm:-bottom-24 md:-bottom-28' : 'top-0'} left-1/2 -translate-x-1/2`}>
          <Avatar className="profile-avatar w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 border-4 border-background">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="text-xl sm:text-2xl md:text-3xl font-bold bg-primary text-primary-foreground">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
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