# 🚀 HTTP Client Testing - Quick Start Guide

## 📌 TL;DR - 3 Steps to Run Tests

```bash
# Step 1: Start server
pnpm dev

# Step 2: Seed database (if needed)
pnpm seed

# Step 3: In WebStorm, run HTTP requests in this order:
```

### **File 1: `variable-extractor.http`** (Run First ⚡)
1. Click on SETUP 1 request and press `Ctrl+Alt+Enter`
2. Click on SETUP 2 request and press `Ctrl+Alt+Enter`
3. Click on SETUP 3 request and press `Ctrl+Alt+Enter`
4. Click on SETUP 4 request and press `Ctrl+Alt+Enter` (verify all variables)

### **File 2: `data-fetching-api.http`** (Run After Setup ✅)
- All variables are now populated
- Run any sections in any order
- Tests should pass without variable errors

---

## 🔍 Variables Quick Reference

| Variable | Status | Source | Example |
|----------|--------|--------|---------|
| `@baseUrl` | ✅ Static | Defined in file | `http://localhost:3000/api/data-fetching` |
| `@contentType` | ✅ Static | Defined in file | `application/json` |
| `{{firstPostId}}` | ⚠️ Dynamic | SETUP 1 (Section 0) | `clrm5k6pq0000...` |
| `{{firstUserId}}` | ⚠️ Dynamic | SETUP 1 (Section 0) | `clrm5k6pq0000...` |
| `{{updateTestPostId}}` | ⚠️ Dynamic | SETUP 2 (Section 2.2) | `clrm5k6pq0000...` |
| `{{deleteTestPostId}}` | ⚠️ Dynamic | SETUP 3 (Section 2.3) | `clrm5k6pq0000...` |

---

## 📁 File Organization

```
http/
├── data-fetching-api.http          ← Main test suite (run AFTER setup)
├── variable-extractor.http         ← Setup & variable population (run FIRST)
├── http-client.env.json            ← Environment configuration
├── http-variables-setup.md         ← Detailed documentation
└── http-testing-quick-start.md     ← This file
```

---

## ⚡ What Each Helper File Does

### `variable-extractor.http` 
**Purpose:** Initialize all variables before running main tests

**Contains:**
- **SETUP 1:** Fetch existing posts → Extracts `firstPostId`, `firstUserId`
- **SETUP 2:** Create test post → Extracts `updateTestPostId`
- **SETUP 3:** Create test post → Extracts `deleteTestPostId`
- **SETUP 4:** Diagnostic report → Shows all variables status

**When to use:** Always run first before `data-fetching-api.http`

---

### `data-fetching-api.http`
**Purpose:** Comprehensive API testing with all CRUD operations

**Contains:**
- Section 1: GET operations
- Section 2: POST operations
- Section 3: PUT operations
- Section 4: DELETE operations
- Section 5: Comments API
- Section 6: Search API
- Section 7: Simulate delay
- Section 8: Metrics
- Section 9: Error scenarios
- Section 10: Response validation

**When to use:** After running variable setup with `variable-extractor.http`

---

### `http-client.env.json`
**Purpose:** Environment configuration for multiple environments

**Contains:**
- `dev` environment - Local development (default)
- `staging` environment - Staging server
- `production` environment - Production server

**When to use:** 
- Select environment in WebStorm > File > Settings > Tools > HTTP Client > Default environment
- Or inline: prefix requests with `# @name MyRequest`

---

## 🐛 Troubleshooting

### ❌ Error: "Variable is undefined"
**Solution:** Run `variable-extractor.http` SETUP 1-3 first

### ❌ Error: "No posts found in database"
**Solution:** 
```bash
pnpm seed      # Seed the database with initial data
```

### ❌ Error: "Invalid authorId"
**Solution:** Verify `firstUserId` was populated by checking SETUP 4 diagnostic output

### ❌ Error: "404 Not Found"
**Solution:** Ensure the post ID exists:
1. Run SETUP 1 again to get fresh `firstPostId`
2. Or check database directly with `pnpm exec prisma studio`

---

## 📊 Variable Population Flow

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Run variable-extractor.http                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  SETUP 1 → GET /posts?page=1&limit=1                        │
│    ↓ Extracts response.body.posts[0].id                     │
│    → Sets client.global.set("firstPostId", ...)            │
│    → Sets client.global.set("firstUserId", ...)            │
│                                                               │
│  SETUP 2 → POST /posts (create post)                        │
│    ↓ Uses {{firstUserId}} from SETUP 1                      │
│    → Sets client.global.set("updateTestPostId", ...)       │
│                                                               │
│  SETUP 3 → POST /posts (create post)                        │
│    ↓ Uses {{firstUserId}} from SETUP 1                      │
│    → Sets client.global.set("deleteTestPostId", ...)       │
│                                                               │
│  SETUP 4 → Diagnostic (verify all variables)                │
│    ↓ Logs all variables to console                          │
│    → Output: ✅ ALL VARIABLES SET                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Run data-fetching-api.http                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  All variables now populated & available:                    │
│  • {{baseUrl}} → http://localhost:3000/api/data-fetching    │
│  • {{firstPostId}} → clrm5k6pq0000...                       │
│  • {{firstUserId}} → clrm5k6pq0000...                       │
│  • {{updateTestPostId}} → clrm5k6pq0000...                  │
│  • {{deleteTestPostId}} → clrm5k6pq0000...                  │
│                                                               │
│  Run any section in any order without errors!               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Common Workflows

### Workflow 1: Complete Test Suite
```
1. Terminal: pnpm dev
2. Terminal: pnpm seed (if needed)
3. WebStorm: Open variable-extractor.http
4. WebStorm: Run SETUP 1, SETUP 2, SETUP 3, SETUP 4
5. WebStorm: Open data-fetching-api.http
6. WebStorm: Run all sections in order
```

### Workflow 2: Quick Manual Testing
```
1. Terminal: pnpm dev
2. WebStorm: Open variable-extractor.http
3. WebStorm: Run SETUP 1 (gets first post ID)
4. WebStorm: Open data-fetching-api.http
5. WebStorm: Run Section 1 (GET requests)
```

### Workflow 3: Error Scenario Testing
```
1. Terminal: pnpm dev
2. WebStorm: Open variable-extractor.http
3. WebStorm: Run SETUP 1, SETUP 2, SETUP 3
4. WebStorm: Open data-fetching-api.http
5. WebStorm: Run Section 9 (error scenarios)
```

---

## 📝 HTTP Syntax Cheat Sheet

### Define Variables
```http
@variableName = value
```

### Use Variables
```http
{{variableName}}
```

### Set Variable from Response
```http
> {%
  client.global.set("variableName", response.body.field);
%}
```

### Log to Console
```http
> {%
  console.log("Message:", value);
  console.error("Error:", error);
%}
```

### Conditional Logic
```http
> {%
  if (response.status === 200) {
    client.global.set("success", true);
  } else {
    console.error("Failed");
  }
%}
```

---

## 🔗 Related Documentation

- **Detailed Variable Setup:** `http-variables-setup.md`
- **Implementation Plan:** `docs/implent-plan-fetching-data.md`
- **Database Setup:** `docs/database-setup.md`
- **Test Plan:** `docs/test-plan.md`
- **JetBrains HTTP Client Docs:** https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html

---

## ✨ Pro Tips

1. **Keyboard Shortcut:** Use `Ctrl+Alt+Enter` to run any request
2. **View Response:** Response appears in right panel with tabs for Response, Headers, Cookies
3. **Pretty Print:** Click the formatter icon in response panel for better readability
4. **Export Data:** Right-click response → Copy as cURL/JSON
5. **Multiple Environments:** Use `http-client.env.json` to switch between dev/staging/production

---

**Last Updated:** January 19, 2026  
**Status:** ✅ Ready for Production Testing

