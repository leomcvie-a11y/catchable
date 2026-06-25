import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  'https://csimbrzvrlrbwiobsblj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzaW1icnp2cmxyYndpb2JzYmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5OTgwNTEsImV4cCI6MjA5NzU3NDA1MX0.UCOGEeXXhEYGgryPkOlCjSbBRcz7zKSdn02ZpVbd64g'
);
