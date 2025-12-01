-- Add new columns for better content management
ALTER TABLE public.noticias 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'noticia', -- 'noticia', 'investigacion'
ADD COLUMN IF NOT EXISTS excerpt text,
ADD COLUMN IF NOT EXISTS tags text[];

-- Update existing rows to have default values if needed
UPDATE public.noticias SET category = 'noticia' WHERE category IS NULL;
