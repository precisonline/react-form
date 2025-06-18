-- This function securely invokes the 'provision-tenant' Edge Function.
-- It is called by the trigger below when a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer -- IMPORTANT: Runs with elevated privileges.
set search_path = public
as $$
begin
  -- Invoke the Edge Function using a placeholder for the SERVICE_ROLE_KEY.
  -- This placeholder will be replaced by a secure script during deployment.
  perform net.http_post(
    url := 'https://cmqyyfiyfbvcrrrownei.supabase.co/functions/v1/provision-tenant',
    headers := jsonb_build_object(
      'apikey', '@@SUPABASE_SERVICE_ROLE_KEY@@', -- The placeholder
      'Authorization', 'Bearer ' || '@@SUPABASE_SERVICE_ROLE_KEY@@', -- The placeholder
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'record', jsonb_build_object(
        'id', new.id,
        'email', new.email
      )
    )
  );
  return new;
end;
$$;

-- Drop the trigger if it already exists to ensure a clean setup
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger that calls the function after a new user is created.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();