# How to Get Supabase Service Role Key

## Steps to Get Service Role Key:

1. **Go to your Supabase Dashboard**
   - Navigate to: https://app.supabase.com/
   - Select your project: "dzvbtghyiuhrntflwwtw"

2. **Access Project Settings**
   - In the left sidebar, click on "Settings"
   - Then click on "API"

3. **Find Service Role Key**
   - Look for the "Service Role" section (NOT "Project API keys")
   - Click the "Reveal" button next to the service_role key
   - Copy the entire key (it should start with "eyJ..." like a JWT token)

4. **Important Security Notes:**
   - The service role key has FULL ACCESS to your database
   - Never expose this key in client-side code
   - Keep it secure in your backend environment variables
   - Use the anonymous key for client-side operations only

## What the keys are used for:

- **Anonymous Key**: For client-side operations with limited permissions
- **Service Role Key**: For server-side operations with full database access (required for this backend)

## After getting the service role key:

1. Update your `.env` file with:
   ```
   SUPABASE_URL=https://dzvbtghyiuhrntflwwtw.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key-here
   ```

2. Also set a strong JWT_SECRET (min 32 characters)

3. Restart your backend server

## Verify Database Schema:
Make sure you've run the database schema from `database-schema.sql` in your Supabase SQL editor to create the necessary tables.
