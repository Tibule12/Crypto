# ⚠️ IMPORTANT: You are using an ANONYMOUS key instead of SERVICE ROLE key

## Current Key Issue:
You have placed an ANONYMOUS key in your `.env` file, but the backend requires a SERVICE ROLE key.

## How to identify the keys:

### Anonymous Key (WRONG for backend):
- Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
- Has "role": "anon" in the payload
- Limited permissions - cannot perform database operations

### Service Role Key (CORRECT for backend):
- Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` (same start, but different payload)
- Has "role": "service_role" in the payload
- Full database access permissions

## How to get the Service Role Key:

1. Go to your Supabase dashboard: https://app.supabase.com/
2. Select your project
3. Go to Settings > API
4. Look for "Service Role" section (NOT "Project API keys")
5. Click "Reveal" and copy the service_role key
6. Replace the current `SUPABASE_SERVICE_KEY` in your `.env` file

## Why this matters:
- Anonymous keys are for client-side applications with limited permissions
- Service role keys are for server-side applications with full database access
- Using an anonymous key will cause 500 errors when trying to access the database

## Next Steps:
1. Get your service role key from Supabase dashboard
2. Update the `.env` file with the correct key
3. Restart your backend server
4. The 500 errors should be resolved
