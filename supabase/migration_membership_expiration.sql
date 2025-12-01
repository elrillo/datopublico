-- Add membership_expires_at column
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS membership_expires_at timestamptz;

-- Function to check if a user has an active membership
CREATE OR REPLACE FUNCTION public.is_active_member(user_id uuid)
RETURNS boolean AS $$
DECLARE
  user_role text;
  expires_at timestamptz;
BEGIN
  SELECT role, membership_expires_at INTO user_role, expires_at
  FROM public.profiles
  WHERE id = user_id;

  -- Staff always active
  IF user_role IN ('admin', 'editor', 'writer') THEN
    RETURN true;
  END IF;

  -- Members active if role is member AND (no expiration OR expiration in future)
  IF user_role = 'member' THEN
    IF expires_at IS NULL OR expires_at > now() THEN
      RETURN true;
    END IF;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
