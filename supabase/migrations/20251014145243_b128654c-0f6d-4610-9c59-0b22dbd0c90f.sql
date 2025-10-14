-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  display_name TEXT,
  cpf TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(auth_uid),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = auth_uid);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = auth_uid);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = auth_uid);

-- Create tournaments table
CREATE TABLE public.tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  game TEXT NOT NULL,
  game_mode TEXT,
  tournament_type TEXT NOT NULL,
  rounds INTEGER NOT NULL DEFAULT 1,
  entry_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  max_participants INTEGER NOT NULL,
  public BOOLEAN NOT NULL DEFAULT false,
  prize_pool NUMERIC(10, 2),
  invite_link TEXT,
  adjudication_method TEXT NOT NULL DEFAULT 'host',
  status TEXT NOT NULL DEFAULT 'pending',
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

-- Create participants table (ANTES das políticas que referenciam ela)
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gamertag TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

-- Enable RLS
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- AGORA criar as políticas de tournaments (que referenciam participants)
CREATE POLICY "Public tournaments are viewable by everyone"
ON public.tournaments
FOR SELECT
USING (public = true);

CREATE POLICY "Private tournaments viewable by owner and participants"
ON public.tournaments
FOR SELECT
USING (
  auth.uid() = owner_id OR
  EXISTS (
    SELECT 1 FROM public.participants
    WHERE participants.tournament_id = tournaments.id
    AND participants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create tournaments"
ON public.tournaments
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Tournament owners can update their tournaments"
ON public.tournaments
FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Tournament owners can delete their tournaments"
ON public.tournaments
FOR DELETE
USING (auth.uid() = owner_id);

-- Create policies for participants
CREATE POLICY "Participants viewable by tournament owner and participants"
ON public.participants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tournaments
    WHERE tournaments.id = participants.tournament_id
    AND (tournaments.owner_id = auth.uid() OR tournaments.public = true)
  ) OR
  user_id = auth.uid()
);

CREATE POLICY "Users can join tournaments"
ON public.participants
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their participation"
ON public.participants
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users and tournament owners can delete participation"
ON public.participants
FOR DELETE
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.tournaments
    WHERE tournaments.id = participants.tournament_id
    AND tournaments.owner_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at
BEFORE UPDATE ON public.tournaments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (auth_uid, email, full_name, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();