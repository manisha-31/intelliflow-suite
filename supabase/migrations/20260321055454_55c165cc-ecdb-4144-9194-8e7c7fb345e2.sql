
-- Create storage bucket for design assets
INSERT INTO storage.buckets (id, name, public) VALUES ('design-assets', 'design-assets', true);

-- Storage policies
CREATE POLICY "Anyone can view design assets" ON storage.objects FOR SELECT USING (bucket_id = 'design-assets');
CREATE POLICY "Authenticated users can upload design assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'design-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'design-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins can delete design assets" ON storage.objects FOR DELETE USING (bucket_id = 'design-assets' AND public.is_admin());

-- Add ai_prompt column to designs for AI-generated designs
ALTER TABLE public.designs ADD COLUMN IF NOT EXISTS ai_prompt text;
ALTER TABLE public.designs ADD COLUMN IF NOT EXISTS is_ai_generated boolean DEFAULT false;
