-- Drop existing problematic policies
DROP POLICY IF EXISTS "Private tournaments viewable by owner and participants" ON public.tournaments;
DROP POLICY IF EXISTS "Participants viewable by tournament owner and participants" ON public.participants;

-- Create security definer function to check if user is tournament participant
CREATE OR REPLACE FUNCTION public.is_tournament_participant(_tournament_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.participants
    WHERE tournament_id = _tournament_id
      AND user_id = _user_id
  )
$$;

-- Create security definer function to check if user is tournament owner
CREATE OR REPLACE FUNCTION public.is_tournament_owner(_tournament_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tournaments
    WHERE id = _tournament_id
      AND owner_id = _user_id
  )
$$;

-- Recreate tournaments policies using security definer functions
CREATE POLICY "Private tournaments viewable by owner and participants" 
ON public.tournaments 
FOR SELECT 
USING (
  auth.uid() = owner_id 
  OR public.is_tournament_participant(id, auth.uid())
);

-- Recreate participants policies using security definer functions
CREATE POLICY "Participants viewable by tournament owner and participants" 
ON public.participants 
FOR SELECT 
USING (
  public.is_tournament_owner(tournament_id, auth.uid())
  OR auth.uid() = user_id
  OR EXISTS (
    SELECT 1
    FROM public.tournaments
    WHERE id = participants.tournament_id
      AND public = true
  )
);