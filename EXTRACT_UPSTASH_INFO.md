# 📋 Extract Redis Connection Info from Upstash

## ✅ What I Can See from Your Dashboard:

From your Upstash dashboard, I can see:
- **Endpoint**: `outgoing-mole-27515.upstash.io`
- **Port**: `6379`
- **TLS/SSL**: Enabled
- **Database Name**: `/rms infratech`
- **Region**: N. Virginia, USA (us-east-1)
- **Plan**: Free Tier

---

## 🔍 What You Need to Do:

### Step 1: Get the Redis Connection URL

**Option A: Get from TCP Tab (Recommended for our project)**

1. In your Upstash dashboard, click on the **"TCP"** tab (next to "REST" tab)
2. You should see connection details for TCP connection
3. Look for the **Redis URL** that starts with `redis://`
4. It should look like:
   ```
   redis://default:[YOUR-TOKEN]@outgoing-mole-27515.upstash.io:6379
   ```
5. **Click the eye icon 👁️** to reveal the token (it's masked with asterisks)
6. **Copy the full Redis URL** - you'll need this!

**Option B: Construct it manually**

If you can see the token in the REST section:
1. Switch to **"TCP"** tab
2. You'll see the connection string format
3. Or construct: `redis://default:[TOKEN]@outgoing-mole-27515.upstash.io:6379`

---

### Step 2: Get the Token

**To reveal the token:**
1. Look for the **eye icon 👁️** or **"Show"** button next to the masked token
2. Click it to reveal the actual token
3. Copy the token value

**OR** check the REST section:
1. Stay on the **"REST"** tab
2. Find `UPSTASH_REDIS_REST_TOKEN`
3. Click the eye icon to reveal it
4. The token should be the same for both REST and TCP

---

## 📝 What You'll Get:

### Redis URL Format (for TCP connection):
```
redis://default:[TOKEN]@outgoing-mole-27515.upstash.io:6379
```

**Example (with real token):**
```
redis://default:AXXXkATYyNzUxNXxjYWNjNGQ4YzQwYzZkYTkzNzYzNTk4OWQ5OTY3ZTg0@outgoing-mole-27515.upstash.io:6379
```

---

## 🎯 Quick Actions:

1. **Click "TCP" tab** (next to REST tab in Connect section)
2. **Click eye icon 👁️** to reveal token
3. **Copy the Redis URL** (starts with `redis://`)
4. **Save it** - we'll use it in `.env.local` file

---

## ✅ Once You Have It:

The Redis URL will go into your `.env.local` file as:

```env
REDIS_URL="redis://default:[TOKEN]@outgoing-mole-27515.upstash.io:6379"
```

Replace `[TOKEN]` with the actual token you revealed.

---

**Let me know when you have the Redis URL and we'll continue!**





