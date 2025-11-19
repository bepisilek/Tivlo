import { createClient } from '@supabase/supabase-js';

// A megadott Supabase Project URL
const SUPABASE_URL = 'https://brggqboddejvzbbqzmso.supabase.co'; 

// A felhasználó által megadott Anon Key
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZ2dxYm9kZGVqdnpiYnF6bXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTI4NDIsImV4cCI6MjA3OTEyODg0Mn0.Cc4dyAzpN7ANl76ndowsVHBBbK8IOi0vW2S2FP-GQoc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);