-- Add unique constraint to prevent duplicate social links per user
ALTER TABLE social_links 
ADD CONSTRAINT social_links_user_platform_unique 
UNIQUE (user_id, platform);