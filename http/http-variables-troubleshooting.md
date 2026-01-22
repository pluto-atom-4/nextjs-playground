# HTTP Client Variables - Troubleshooting & Reference

## 🔴 Common Issues & Solutions

### Issue 1: "Variable is undefined"
```
Error: POST http://localhost:3000/api/data-fetching/posts/{{updateTestPostId}}
Response: 404 Not Found
```

**Cause:** Variable not populated or set to `undefined`

**Solutions:**
```
✅ Option 1: Run variable-extractor.http SETUP 1-3 FIRST
✅ Option 2: Manually add variables to data-fetching-api.http top:
   @updateTestPostId = clrm5k6pq0000...
✅ Option 3: Use http-client.env.json and select environment
```

---

### Issue 2: "No posts found in database"
```
SETUP 1 Error: response.body.posts is empty
```

**Cause:** Database has no data

**Solutions:**
```bash
✅ Run seeding script:
   pnpm seed

✅ Or create a post manually in SETUP 1:
   - Change Section 2.1 to create a post first
   - Then run SETUP 1 to extract its ID

✅ Or check database directly:
   pnpm exec prisma studio  # Opens http://localhost:5555
```

---

### Issue 3: "Invalid authorId"
```
POST /api/data-fetching/posts
400 Bad Request: "Author with id not found"
```

**Cause:** `firstUserId` is undefined or invalid

**Solutions:**
```
✅ Verify SETUP 1 ran successfully:
   - Check console output for "firstUserId:" value
   - If empty/undefined, run SETUP 1 again

✅ Check if user exists in database:
   - Open http://localhost:5555 (prisma studio)
   - Check User table has entries

✅ Manually extract valid user ID:
   1. Run: pnpm exec prisma db query
   2. Select: SELECT * FROM User LIMIT 1
   3. Copy the ID to updateTestPostId variable
```

---

### Issue 4: "CORS or connection refused"
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Cause:** Dev server not running

**Solutions:**
```bash
✅ Start dev server:
   pnpm dev

✅ Verify port 3000 is listening:
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
```

---

### Issue 5: "All requests return 404"
```
GET /api/data-fetching/posts
404 Not Found: "Route /api/data-fetching/posts not found"
```

**Cause:** API routes not implemented or server not restarted

**Solutions:**
```bash
✅ Verify API routes exist:
   - Check src/app/api/data-fetching/ folder structure

✅ Restart dev server:
   - Ctrl+C to stop
   - pnpm dev to restart

✅ Check route handlers created:
   - src/app/api/data-fetching/posts/route.ts
   - src/app/api/data-fetching/posts/[id]/route.ts
   - etc.
```

---

### Issue 6: "POST creates resource but variables not set"
```
Response: 201 Created
But updateTestPostId still undefined
```

**Cause:** Response handler (> {% %}) failed or didn't execute

**Solutions:**
```
✅ Check response format:
   - Verify response.body.id exists (not response.body.data.id)
   - Some APIs nest IDs differently

✅ Update response handler:
   // If ID is nested differently:
   const id = response.body.id || response.body.data?.id;
   client.global.set("updateTestPostId", id);

✅ Manually verify response:
   - Look at Response tab in right panel
   - Copy the ID value manually
   - Add it as @variable at top of file
```

---

## 📊 Variable Dependency Tree

```
┌─────────────────────────────────────────┐
│ 1. Static Variables (defined at top)    │
├─────────────────────────────────────────┤
│ @baseUrl = http://localhost:3000/...    │
│ @contentType = application/json         │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────┐
│ 2. SETUP 1 Extraction                    │
├──────────────────────────────────────────┤
│ GET /posts?page=1&limit=1                │
│   → Extract posts[0].id                  │
│   → Set firstPostId                      │
│   → Extract posts[0].author.id           │
│   → Set firstUserId                      │
└─────┬──────────────────────────────────┬─┘
      │                                  │
      ↓                                  ↓
┌──────────────────────────┐  ┌──────────────────────────┐
│ 3a. SETUP 2              │  │ 3b. SETUP 3              │
├──────────────────────────┤  ├──────────────────────────┤
│ POST /posts              │  │ POST /posts              │
│ Uses: {{firstUserId}}    │  │ Uses: {{firstUserId}}    │
│   → Create post          │  │   → Create post          │
│   → Extract ID           │  │   → Extract ID           │
│   → Set updateTestPostId │  │   → Set deleteTestPostId │
└──────────────────────────┘  └──────────────────────────┘
      │                                  │
      └──────────────┬───────────────────┘
                     ↓
        ┌────────────────────────┐
        │ 4. SETUP 4             │
        ├────────────────────────┤
        │ Verify all variables   │
        │ Print diagnostic info  │
        │ Ready for testing      │
        └────────────────────────┘
```

---

## 🔧 Manual Variable Setup Methods

### Method 1: Direct Assignment in HTTP File
Add at top of `data-fetching-api.http`:

```http
@baseUrl = http://localhost:3000/api/data-fetching
@contentType = application/json
@firstPostId = clrm5k6pq0000qz1h9w1s9k2a
@firstUserId = clrm5k6pq0000qz1h9w1s9k3b
@updateTestPostId = clrm5k6pq0000qz1h9w1s9k4c
@deleteTestPostId = clrm5k6pq0000qz1h9w1s9k5d
```

**Pros:** Simple, fast, no setup needed  
**Cons:** Must update IDs when testing with fresh data

---

### Method 2: Environment File
Create `http-client.env.json`:

```json
{
  "dev": {
    "baseUrl": "http://localhost:3000/api/data-fetching",
    "contentType": "application/json",
    "firstPostId": "clrm5k6pq0000...",
    "firstUserId": "clrm5k6pq0000...",
    "updateTestPostId": "clrm5k6pq0000...",
    "deleteTestPostId": "clrm5k6pq0000..."
  }
}
```

**Pros:** Multi-environment support, centralized config  
**Cons:** Must create and maintain file

---

### Method 3: Inline Environment Variables
At top of `data-fetching-api.http`:

```http
@baseUrl = http://localhost:3000/api/data-fetching
@contentType = application/json

### Set inline with environment defaults
@firstPostId = ${firstPostId:-defaultId}
@firstUserId = ${firstUserId:-defaultId}
@updateTestPostId = ${updateTestPostId:-defaultId}
@deleteTestPostId = ${deleteTestPostId:-defaultId}
```

**Pros:** Flexible, supports fallbacks  
**Cons:** Syntax varies by IDE version

---

## ✅ Verification Checklist

Before running tests, verify:

- [ ] Dev server running: `pnpm dev` (port 3000)
- [ ] Database has data: `pnpm exec prisma studio` (check tables)
- [ ] Ran SETUP 1: `variable-extractor.http` SETUP 1
- [ ] Ran SETUP 2: `variable-extractor.http` SETUP 2
- [ ] Ran SETUP 3: `variable-extractor.http` SETUP 3
- [ ] Ran SETUP 4: Check console output shows "✅ ALL VARIABLES SET"
- [ ] `{{baseUrl}}` resolved to URL (not undefined)
- [ ] `{{firstPostId}}` has value (UUID/ID format)
- [ ] `{{firstUserId}}` has value (UUID/ID format)
- [ ] `{{updateTestPostId}}` has value (UUID/ID format)
- [ ] `{{deleteTestPostId}}` has value (UUID/ID format)

---

## 📈 Debug Output Example

### ✅ Successful Setup
```
✅ VARIABLE STATUS REPORT
==================================================
✅ baseUrl: http://localhost:3000/api/data-fetching
✅ firstPostId: clrm5k6pq0000qz1h9w1s9k2a
✅ firstUserId: clrm5k6pq0000qz1h9w1s9k3b
✅ updateTestPostId: clrm5k6pq0001qz1h9w1s9k2a
✅ deleteTestPostId: clrm5k6pq0002qz1h9w1s9k2a
==================================================
✨ ALL VARIABLES SET - Ready to run data-fetching-api.http
```

### ❌ Failed Setup
```
⚠️ VARIABLE STATUS REPORT
==================================================
✅ baseUrl: http://localhost:3000/api/data-fetching
❌ firstPostId: NOT SET
❌ firstUserId: NOT SET
❌ updateTestPostId: NOT SET
❌ deleteTestPostId: NOT SET
==================================================
⚠️ MISSING VARIABLES - Run previous setup requests
```

**Action:** Go back to SETUP 1 and check if posts exist

---

## 🎯 HTTP Client IDE Features

### WebStorm / IntelliJ IDEA

**Run Request:** `Ctrl+Alt+Enter` or click green arrow  
**View Response:** Opens in right panel  
**Select Environment:** Alt+E or via Settings  
**Clear Variables:** Settings → Tools → HTTP Client → Clear  
**View History:** View → Tool Windows → HTTP Client  
**Copy Response:** Right-click response → Copy as

### VS Code (REST Client Extension)

**Run Request:** `Ctrl+Alt+R` or click arrow  
**View Response:** Side panel  
**Environment:** `.env` or `.env.production` files  
**Variables:** Use `$dotenv varName` syntax

---

## 🔗 External Resources

- **JetBrains HTTP Client:** https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html
- **HTTP Client Variables:** https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html#use_variables
- **Environment Files:** https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html#use_environments
- **Prisma Studio:** https://www.prisma.io/docs/concepts/components/prisma-studio

---

**Last Updated:** January 19, 2026  
**Document Version:** 2.0  
**Status:** Complete Reference Guide

