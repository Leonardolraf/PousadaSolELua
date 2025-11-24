// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function getSafeStorage() {
  try {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
      return undefined;
    }
    // Testa se dá pra escrever (Safari privado é chato nisso)
    const key = "__supabase_test__";
    window.localStorage.setItem(key, "ok");
    window.localStorage.removeItem(key);
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: getSafeStorage(), // pode ser undefined em caso extremo
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
