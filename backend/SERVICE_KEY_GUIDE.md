# How to Find Your Service Role Key on Supabase

## Step-by-Step Instructions:

1. **Go to Supabase Dashboard**
   - Navigate to: https://app.supabase.com/
   - Sign in to your account

2. **Select Your Project**
   - Click on your project named "dzvbtghyiuhrntflwwtw"

3. **Navigate to Settings**
   - In the left sidebar, click on "Settings" (gear icon)
   - Then click on "API" from the submenu

4. **Find Service Role Key**
   - Look for the section labeled "Service Role" (NOT "Project API keys")
   - You'll see a key that starts with `sbp_` (not `eyJ` like JWT tokens)
   - Click the "Reveal" button to show the full key
   - Copy the entire key

## Key Differences:
- **Anonymous Key**: Starts with `eyJ` (JWT format) - for client-side use only
- **Service Role Key**: Starts with `sbp_` - for server-side with full database access

## Important Notes:
- The service role key has FULL ACCESS to your database
- Never expose this key in client-side code
- Use it only in your backend environment variables
- If compromised, you can regenerate it from the Supabase dashboard

## What to Look For:
```
Service Role Key Example: sbp_1234567890abcdef1234567890abcdef1234567890abcdef
```

Once you have this key, replace `REPLACE_WITH_YOUR_SERVICE_ROLE_KEY_HERE` in your `.env` file with the actual service role key.
