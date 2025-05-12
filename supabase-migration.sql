-- Create contact table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived BOOLEAN DEFAULT FALSE
);

-- Set up Row Level Security
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for contact form submissions)
CREATE POLICY "Allow public form submissions" 
ON contact FOR INSERT 
TO anon
WITH CHECK (true);

-- Create policy to allow select for authenticated users only
CREATE POLICY "Allow admins to view contacts" 
ON contact FOR SELECT 
TO authenticated
USING (true);

-- Create policy to allow updates for authenticated users only
CREATE POLICY "Allow admins to update contacts" 
ON contact FOR UPDATE 
TO authenticated
USING (true);

-- Grant permissions
GRANT INSERT ON contact TO anon;
GRANT SELECT, UPDATE ON contact TO authenticated; 