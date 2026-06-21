import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://csimbrzvrlrbwiobsblj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jljc3KATEoxD_bsvx1FbrA_HvfnXn4P';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
