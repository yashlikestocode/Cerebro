import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL) {
  console.error("ENV:", process.env);
  throw new Error("SUPABASE_URL missing");
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);