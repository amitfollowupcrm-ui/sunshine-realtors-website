# 📝 Update Environment Variables - Instructions

## ✅ What We've Completed

1. ✅ Supabase Project Created: **RMS REALTORS INC**
2. ✅ Storage Bucket Created: **property-photos** (Public)
3. ✅ Project URL: `https://lthrekdtbpguogpcrfiv.supabase.co`

## 📋 Step: Get API Key & Update .env.local

### Get the Anon Key:
1. You're currently on the **API Settings** page
2. Scroll down to find the **"Project API keys"** section
3. Look for **"anon public"** key
4. Click the **eye icon** or **copy button** to reveal/copy the key
5. Copy the entire key (it's a long string starting with `eyJ...`)

### Update .env.local:

Once you have the anon key, we'll add these lines to your `.env.local` file:

```bash
# Supabase Configuration (for property photo storage)
NEXT_PUBLIC_SUPABASE_URL=https://lthrekdtbpguogpcrfiv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-key-here
```

**Please copy the anon key and let me know when you have it, then I'll help you update the .env.local file!**

---

**Current .env.local location**: `sunshine-realtors-website/.env.local`
