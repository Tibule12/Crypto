const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with error handling
let supabase = null;

const connectDB = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    // Check if Supabase credentials are provided
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl === 'your-supabase-project-url-here' || 
        supabaseKey === 'your-supabase-service-role-key-here') {
      console.warn('⚠️  Supabase credentials not configured. Using mock mode.');
      console.log('📝 Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file');
      console.log('📝 You can get these from your Supabase project settings');
      return { mock: true };
    }

    supabase = createClient(supabaseUrl, supabaseKey);

    // Test the connection by making a simple query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.warn('⚠️  Supabase connection test failed, but continuing in mock mode');
      console.log('📝 Error:', error.message);
      return { mock: true };
    }

    console.log('✅ Supabase connected successfully');
    return supabase;
  } catch (error) {
    console.warn('⚠️  Supabase connection error, continuing in mock mode');
    console.log('📝 Error:', error.message);
    return { mock: true };
  }
};

module.exports = { connectDB, supabase };
