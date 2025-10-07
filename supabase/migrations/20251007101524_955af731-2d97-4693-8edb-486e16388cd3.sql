-- Create profile_views table for tracking profile visits
CREATE TABLE public.profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  CONSTRAINT fk_profile_views_user FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX idx_profile_views_user_id ON public.profile_views(user_id);
CREATE INDEX idx_profile_views_viewed_at ON public.profile_views(viewed_at DESC);

-- Enable RLS
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profile_views
CREATE POLICY "Users can view their own profile views"
  ON public.profile_views
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert profile views"
  ON public.profile_views
  FOR INSERT
  WITH CHECK (true);

-- Create link_clicks table for tracking link clicks
CREATE TABLE public.link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  link_type TEXT NOT NULL CHECK (link_type IN ('social', 'custom')),
  link_id UUID,
  link_title TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  referrer TEXT,
  CONSTRAINT fk_link_clicks_user FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX idx_link_clicks_user_id ON public.link_clicks(user_id);
CREATE INDEX idx_link_clicks_clicked_at ON public.link_clicks(clicked_at DESC);
CREATE INDEX idx_link_clicks_link_type ON public.link_clicks(link_type);

-- Enable RLS
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for link_clicks
CREATE POLICY "Users can view their own link clicks"
  ON public.link_clicks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert link clicks"
  ON public.link_clicks
  FOR INSERT
  WITH CHECK (true);