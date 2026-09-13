-- Migration: Profile Customization (Player Name & Avatar URL)
-- Adds customizable display_name and avatar_url to public.profiles

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT DEFAULT 'Knight Protector',
ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '/images/avatars/knight_protector.jpg';

COMMENT ON COLUMN public.profiles.display_name IS 'Customizable in-game character name for player';
COMMENT ON COLUMN public.profiles.avatar_url IS 'Customizable avatar image URL or Data URI (PNG only for uploads)';
