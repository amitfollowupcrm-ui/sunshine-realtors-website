# 🧪 Testing Supabase Integration

## ✅ Configuration Complete

Environment variables have been added to `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL=https://lthrekdtbpguogpcrfiv.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_secret_3pG1-Ea_eavEdVvSCv7JYw_uLTLILcD`

## 🧪 Testing Steps

1. **Restart Development Server**:
   ```bash
   npm run dev
   ```

2. **Test Photo Upload**:
   - Navigate to: `http://localhost:3000/dashboard/properties`
   - Click "+ Add Property" button
   - Fill in property details
   - Try uploading a photo
   - Verify the photo appears in Supabase Storage dashboard

3. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Check for any errors
   - Look for Supabase connection messages

4. **Verify in Supabase Dashboard**:
   - Go to Storage → property-photos bucket
   - Check if uploaded photos appear there

## ⚠️ Note About the Key

The key provided starts with `sb_secret_` which typically indicates a service_role key. 

- **Service Role Key**: Has full access, should only be used server-side
- **Anon Public Key**: Safe for client-side, typically starts with `eyJ...`

If photo uploads don't work, we may need to get the actual **anon public** key from the API Settings page instead.

## 🔍 Troubleshooting

If you see errors:
1. Check browser console for specific error messages
2. Verify the key is correct (might need anon key instead)
3. Check Supabase Storage bucket permissions
4. Verify environment variables are loaded (restart server after adding them)
