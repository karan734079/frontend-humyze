-- Create reports table
CREATE TABLE reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  file_name text,
  file_url text,
  original_text text,
  humanized_text text,
  human_score integer,
  ai_score integer,
  confidence text,
  ai_sentences jsonb,
  analysis text,
  created_at timestamp with time zone default now()
);

-- Note: To execute Edge Functions securely from the database or RLS, further extensions might be needed.

-- Enable Row Level Security (RLS)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies for reports table
-- Users can read their own reports
CREATE POLICY "Users can view their own reports"
  ON reports
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own reports
CREATE POLICY "Users can insert their own reports"
  ON reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users can update their own reports"
  ON reports
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete their own reports"
  ON reports
  FOR DELETE
  USING (auth.uid() = user_id);

-- Set up storage 'uploads' bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage
-- Note: 'storage.objects' must have RLS enabled. It's usually enabled by default in new projects.

-- Users can upload files to 'uploads' bucket
CREATE POLICY "Users can upload their own files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'uploads' AND 
    auth.uid() = owner
  );

-- Users can read their own files
CREATE POLICY "Users can view their own files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'uploads' AND
    auth.uid() = owner
  );

-- Users can delete their own files
CREATE POLICY "Users can delete their own files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'uploads' AND
    auth.uid() = owner
  );
