# Service Role Key Finder - URGENT CHECKLIST

## You have the WRONG type of key!
The key you provided: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- ❌ This is a JWT token, NOT a service role key
- ❌ This will NOT fix the 500 errors
- ❌ This is NOT what your backend needs

## What you NEED to find:
- ✅ Service Role Key starts with: `sbp_`
- ✅ NOT `eyJ` (that's JWT format)
- ✅ NOT any key that looks like a JWT token

## Step-by-Step to Find CORRECT Key:

1. **Go to**: https://app.supabase.com/
2. **Select** your project: "dzvbtghyiuhrntflwwtw"
3. **Click**: Settings (gear icon) → API
4. **Look for**: "Service Role" section (NOT "Project API keys")
5. **Find the key that starts with**: `sbp_`
6. **Click**: "Reveal" to see the full key
7. **Copy**: The entire `sbp_...` key

## Visual Check - What to look for:
```
✅ CORRECT (Service Role): sbp_1234567890abcdef1234567890abcdef
❌ WRONG (JWT token): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
❌ WRONG (Anonymous): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## If you can't find it:
1. Check if you're in the right project
2. Make sure you're looking at "Service Role" not "Project API keys"
3. Contact Supabase support if still not visible

## Once you have the `sbp_...` key:
1. Replace in your `.env` file
2. Restart your backend server
3. The 500 errors should disappear
