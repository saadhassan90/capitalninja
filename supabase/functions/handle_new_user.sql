CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Insert the user as an owner in team_members if no team members exist
  INSERT INTO public.team_members (user_id, role)
  SELECT NEW.id, 'owner'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.team_members
  );
  
  RETURN NEW;
END;
$$;