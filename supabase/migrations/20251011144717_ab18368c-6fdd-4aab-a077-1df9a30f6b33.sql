-- Add cover_image_url to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS cover_image_url text;

COMMENT ON COLUMN public.profiles.cover_image_url IS 'URL of the cover image for the profile';