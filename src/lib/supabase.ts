import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks to prevent undefined errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create the Supabase client with error handling
let supabase: ReturnType<typeof createClient>;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Some features may not work correctly.');
    // Create a dummy client that won't throw errors when methods are called
    supabase = {
      from: () => ({
        select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        eq: () => ({ select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
      }),
      auth: {
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
        onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} } }),
      },
      rpc: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    } as any;
  } else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create a dummy client as fallback
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }),
      eq: () => ({ select: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }) }),
    }),
    auth: {
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase initialization failed') }),
      onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} } }),
    },
    rpc: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }),
  } as any;
}

export { supabase };

// Contact form submission with error handling
export const submitContactForm = async (data: {
  name: string;
  email: string;
  message: string;
}) => {
  try {
    if (!supabase || !supabase.from) {
      return { success: false, error: 'Supabase client not properly initialized' };
    }
    
    const { error } = await supabase.from('contact_submissions').insert([
      { ...data, timestamp: new Date().toISOString() }
    ]);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error };
  }
};

// Video management with error handling
export const getVideos = async () => {
  try {
    if (!supabase || !supabase.from) {
      return { success: false, error: 'Supabase client not properly initialized', videos: [] };
    }
    
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return { success: true, videos: data };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { success: false, error, videos: [] };
  }
};