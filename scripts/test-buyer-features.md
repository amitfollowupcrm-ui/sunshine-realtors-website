# Test Buyer Features (Favorites & Cart) - Guide

## 📋 Test Steps

### Step 1: Create a Buyer Account (or use existing)

**Option 1: Register via UI**
1. Go to: https://sunshine-realtors-website.vercel.app/register
2. Fill in:
   - Email: `testbuyer@example.com`
   - Password: `TestBuyer123!`
   - Full Name: `Test Buyer`
   - Phone: `+91-9876543210`
   - Role: `BUYER`
3. Click Register

**Option 2: Use API to create buyer**
```bash
POST https://sunshine-realtors-website.vercel.app/api/auth/register
{
  "email": "testbuyer@example.com",
  "password": "TestBuyer123!",
  "fullName": "Test Buyer",
  "phone": "+91-9876543210",
  "role": "BUYER"
}
```

### Step 2: Login as Buyer

1. Go to: https://sunshine-realtors-website.vercel.app/login
2. Enter:
   - Email: `testbuyer@example.com`
   - Password: `TestBuyer123!`
3. Click Login
4. You should be redirected to the home page or dashboard

### Step 3: Browse Properties

1. Go to: https://sunshine-realtors-website.vercel.app/buy
2. You should see a list of properties
3. Click on any property to view details

### Step 4: Add to Favorites

1. On a property detail page, click the "Favorite" button (🤍)
2. The button should change to "Favorited" (❤️)
3. Go to: https://sunshine-realtors-website.vercel.app/favorites
4. You should see the property in your favorites list

### Step 5: Add to Cart

1. On a property detail page, click the "Add to Cart" button (🛒)
2. The button should change to "In Cart" (🛒 ✓)
3. Go to: https://sunshine-realtors-website.vercel.app/cart
4. You should see the property in your cart

### Step 6: Remove from Favorites/Cart

1. Click the "Favorited" button again to remove from favorites
2. Click the "In Cart" button again to remove from cart
3. Refresh the pages to verify removal

---

## 🔍 API Endpoints to Test

### Get Favorites
```
GET /api/properties/favorites
Headers: Authorization: Bearer <token>
```

### Add to Favorites
```
POST /api/properties/favorites
Headers: Authorization: Bearer <token>
Body: { "propertyId": "property-id" }
```

### Remove from Favorites
```
DELETE /api/properties/favorites/{propertyId}
Headers: Authorization: Bearer <token>
```

### Get Cart
```
GET /api/properties/cart
Headers: Authorization: Bearer <token>
```

### Add to Cart
```
POST /api/properties/cart
Headers: Authorization: Bearer <token>
Body: { "propertyId": "property-id", "inquiryType": "BUY" }
```

### Remove from Cart
```
DELETE /api/properties/cart/{propertyId}
Headers: Authorization: Bearer <token>
```

---

## ✅ Expected Results

1. ✅ Login works for buyer account
2. ✅ Properties display on Buy page
3. ✅ Favorite button works on property pages
4. ✅ Add to Cart button works on property pages
5. ✅ Favorites page shows favorited properties
6. ✅ Cart page shows carted properties
7. ✅ Remove from favorites/cart works
8. ✅ Property count updates correctly

---

## 🐛 Troubleshooting

**Issue: "Unauthorized" errors**
- Solution: Make sure you're logged in and the auth token is valid

**Issue: Buttons don't work**
- Solution: Check browser console for errors, verify user role is BUYER

**Issue: Favorites/Cart pages show "Login Required"**
- Solution: Make sure cookies are being sent with requests

**Issue: Properties don't show in favorites/cart**
- Solution: Check database to verify records were created


