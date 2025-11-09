/**
 * Supabase Configuration
 * Replace these values with your Supabase project credentials
 */

// Supabase configuration
const SUPABASE_CONFIG = {
  // Your Supabase project URL
  url: 'https://wpskhrfgseqtaozxpxmn.supabase.co',
  
  // Your Supabase anon/public key
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwc2tocmZnc2VxdGFvenhweG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2OTAwNTgsImV4cCI6MjA3ODI2NjA1OH0.a6HidVu4YI9ld1WbLfUq6RmOhg6vpEBvb7LWyuo02xI'
};

// Supabase client instance
let supabaseClient = null;

// Function to initialize Supabase client
function initSupabaseClient() {
  try {
    // Check if supabase library is loaded
    if (typeof supabase === 'undefined') {
      console.warn('Supabase library not loaded yet');
      return null;
    }

    // Create Supabase client
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    
    // Also set on window for global access
    window.supabase = supabaseClient;
    
    console.log('✓ Supabase client initialized');
    return supabaseClient;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    return null;
  }
}

// Get Supabase client (lazy initialization)
function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }
  
  // Try to initialize
  return initSupabaseClient();
}

// Initialize when DOM is ready and library is loaded
function waitForSupabaseLibrary() {
  if (typeof supabase !== 'undefined') {
    initSupabaseClient();
  } else {
    // Retry after a short delay
    setTimeout(waitForSupabaseLibrary, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for library to load
    waitForSupabaseLibrary();
  });
} else {
  // DOM already loaded
  waitForSupabaseLibrary();
}

// Export for use in other scripts
window.SupabaseConfig = {
  client: getSupabaseClient,
  config: SUPABASE_CONFIG,
  init: initSupabaseClient
};
