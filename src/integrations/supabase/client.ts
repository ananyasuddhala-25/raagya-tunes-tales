// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://almzsqsyejvakwbzcdbp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbXpzcXN5ZWp2YWt3YnpjZGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDYyNzksImV4cCI6MjA2MTA4MjI3OX0.7K7nEekVUE5B5yNX4P3bLjml_eo9t4I366h10NeZNNk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);