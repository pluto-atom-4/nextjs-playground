# HTTP Client Variables Setup Guide

## 📋 Variable Analysis for `data-fetching-api.http`

### Defined Variables
These variables are **defined** at the top of the file:
- `@baseUrl` = `http://localhost:3000/api/data-fetching`
- `@contentType` = `application/json`

### Dynamically Set Variables
These variables are **populated at runtime** by response handlers:
- `firstPostId` - Set by Section 0.1 (extract first post ID)
- `firstUserId` - Set by Section 0.1 (extract first user ID)
- `newPostId` - Set by Section 2.1 (after creating a post)
- `updateTestPostId` - Set by Section 2.2 (after creating a post for updates)
- `deleteTestPostId` - Set by Section 2.3 (after creating a post for deletion)

### Variables Used Throughout File

| Variable | Used In | Purpose | Dependencies |
|----------|---------|---------|--------------|
| `{{baseUrl}}` | All requests | Base URL for API | ✅ Defined at top |
| `{{contentType}}` | POST/PUT headers | Content-Type header | ✅ Defined at top |
| `{{firstPostId}}` | Sections 1.4, 5.1, 5.2, 10.2 | Read existing post | ⚠️ Set by 0.1 |
| `{{firstUserId}}` | Sections 2.x, 10.3 | Create posts as author | ⚠️ Set by 0.1 |
| `{{updateTestPostId}}` | Sections 3.x, 10.3 | Update test post | ⚠️ Set by 2.2 |
| `{{deleteTestPostId}}` | Sections 4.x | Delete test post | ⚠️ Set by 2.3 |
| `{{newPostId}}` | Not directly used | Post creation result | ⚠️ Set by 2.1 |

### ⚠️ Unresolved Variable Issues

**Problem:** If Section 0 is not run first, or if the initial API calls fail:
- `{{firstPostId}}` → undefined (causes 404 errors)
- `{{firstUserId}}` → undefined (causes 404 errors)
- `{{updateTestPostId}}` → undefined (causes 404 errors)
- `{{deleteTestPostId}}` → undefined (causes 404 errors)

**Impact:** Tests in Sections 1.4, 3.x, 4.x, 5.x will fail with undefined IDs.

---

## 🚀 Execution Order Requirements

### Step 1: Setup Phase (Required First)
```
✅ Section 0.1: GET /api/data-fetching/posts?page=1&limit=5
   └─ Populates: firstPostId, firstUserId
```

### Step 2: Create Test Data
```
✅ Section 2.1: POST /api/data-fetching/posts (creates newPostId)
✅ Section 2.2: POST /api/data-fetching/posts (creates updateTestPostId)
✅ Section 2.3: POST /api/data-fetching/posts (creates deleteTestPostId)
```

### Step 3: Run Other Sections
```
✅ Section 1: GET operations (uses firstPostId, firstUserId)
✅ Section 3: PUT operations (uses updateTestPostId)
✅ Section 4: DELETE operations (uses deleteTestPostId)
✅ Section 5-10: Other tests
```

---

## 🔧 Alternative: Manual ID Substitution

If you want to manually set variables without running Section 0:

### Option A: Edit HTTP File Directly
Add these lines at the top (replacing with actual IDs from your database):

```http
@firstPostId = clrm5k6pq0000qz1h9w1s9k2a
@firstUserId = clrm5k6pq0000qz1h9w1s9k3b
```

### Option B: Use HTTP Client Environment Files
Create `http-client.env.json` in the project root:

```json
{
  "dev": {
    "baseUrl": "http://localhost:3000/api/data-fetching",
    "contentType": "application/json",
    "firstPostId": "clrm5k6pq0000qz1h9w1s9k2a",
    "firstUserId": "clrm5k6pq0000qz1h9w1s9k3b",
    "updateTestPostId": "clrm5k6pq0000qz1h9w1s9k4c",
    "deleteTestPostId": "clrm5k6pq0000qz1h9w1s9k5d"
  }
}
```

Then select the `dev` environment in your IDE.

---

## 📝 Recommended Workflow

### For Complete Testing Session:
1. ✅ Start dev server: `pnpm dev`
2. ✅ Seed database: `pnpm seed` (or ensure data exists)
3. ✅ Open `data-fetching-api.http` in WebStorm
4. ✅ **Run Section 0.1 FIRST** to populate `firstPostId` and `firstUserId`
5. ✅ Run Section 2 to create test posts
6. ✅ Run remaining sections (1, 3, 4, 5-10) in any order

### For Quick Testing (Skip Setup):
1. Extract IDs from database or logs
2. Create `http-client.env.json` with those IDs
3. Run sections directly without needing Section 0

---

## 📚 Related Files
- **HTTP Client Tests:** `http/data-fetching-api.http`
- **Environment Config:** `http-client.env.json` (to be created)
- **Variable Setup Helper:** `http/variable-extractor.http` (optional)
- **API Routes:** `src/app/api/data-fetching/*/route.ts`
- **Database Schema:** `prisma/schema.prisma`

