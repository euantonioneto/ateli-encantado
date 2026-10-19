import 'react-native-url-polyfill/auto';
import 'expo-sqlite/localStorage/install';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error('Configure a URL e a chave pública do Supabase no arquivo .env');
}

const authStorage = {
  getItem: async (name: string) => typeof localStorage === 'undefined' ? null : localStorage.getItem(name),
  setItem: async (name: string, value: string) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(name);
  },
};

export const supabase = createClient(url, key, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
