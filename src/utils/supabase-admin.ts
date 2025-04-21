import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase URL or Service Role Key');
}

// Create a Supabase client with the service role key which bypasses RLS
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Add a function to execute SQL directly
export const executeSQL = async (sql: string) => {
  try {
    const { data, error } = await supabaseAdmin.rpc('execute_sql', { 
      sql_query: sql 
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error executing SQL:", error);
    return { data: null, error };
  }
};

// Add a function to list tables - since the RPC function isn't available
export const listTables = async () => {
  try {
    const { data, error } = await executeSQL(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (error) throw error;
    
    // Format the response to match what the original RPC would return
    return { 
      data: data.map((row: any) => row.table_name), 
      error: null 
    };
  } catch (error) {
    console.error("Error listing tables:", error);
    return { data: null, error };
  }
}; 