import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

function getSafeStorage() {
  try {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
      return undefined;
    }

    const key = "__supabase_test__";
    window.localStorage.setItem(key, "ok");
    window.localStorage.removeItem(key);

    return window.localStorage;
  } catch {
    // Se der erro (ex: modo privado agressivo no iOS), não usa storage
    return undefined;
  }
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: getSafeStorage(),
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
