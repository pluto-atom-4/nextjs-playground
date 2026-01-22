# HTTP Variables - Visual Reference Guide

## 🎯 Complete Variable Mapping

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   DATA-FETCHING-API.HTTP                                │
│                   (Main Test Suite)                                     │
└─────────────────────────────────────────────────────────────────────────┘

Uses Variables:
  {{baseUrl}}            → http://localhost:3000/api/data-fetching
  {{contentType}}        → application/json
  {{firstPostId}}        → ⚠️ From SETUP 1
  {{firstUserId}}        → ⚠️ From SETUP 1
  {{updateTestPostId}}   → ⚠️ From SETUP 2
  {{deleteTestPostId}}   → ⚠️ From SETUP 3

┌──────────────────────────────────────────────────────────────┐
│ SECTION 0: Initial Setup (extract existing data)            │
├──────────────────────────────────────────────────────────────┤
│ 0.1 GET /posts?page=1&limit=5                               │
│     → Extract: firstPostId, firstUserId                      │
│     → Set via: response.body.posts[0].id/.author.id          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SECTION 1: GET Operations (uses firstPostId)                │
├──────────────────────────────────────────────────────────────┤
│ 1.1 GET /posts                    (no params needed)         │
│ 1.2 GET /posts?page=1&limit=20    (no params needed)        │
│ 1.3 GET /posts?page=2&limit=10    (no params needed)        │
│ 1.4 GET /posts/{{firstPostId}}    ← NEEDS firstPostId       │
│ 1.5 GET /posts?page=1&limit=100   (no params needed)        │
│ 1.6 GET /posts?page=1&limit=5     (no params needed)        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SECTION 2: POST Operations (uses firstUserId)               │
├──────────────────────────────────────────────────────────────┤
│ 2.1 POST /posts                   ← NEEDS firstUserId       │
│     Body: {"authorId": "{{firstUserId}}"}                    │
│     → Extract: newPostId (optional, for reference)           │
│                                                              │
│ 2.2 POST /posts                   ← NEEDS firstUserId       │
│     Body: {"authorId": "{{firstUserId}}"}                    │
│     → Extract: updateTestPostId                              │
│                                                              │
│ 2.3 POST /posts                   ← NEEDS firstUserId       │
│     Body: {"authorId": "{{firstUserId}}"}                    │
│     → Extract: deleteTestPostId                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SECTION 3: PUT Operations (uses updateTestPostId)           │
├──────────────────────────────────────────────────────────────┤
│ 3.1 PUT /posts/{{updateTestPostId}}    ← NEEDS ID           │
│ 3.2 PUT /posts/{{updateTestPostId}}    ← NEEDS ID           │
│ 3.3 PUT /posts/{{updateTestPostId}}    ← NEEDS ID           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SECTION 4: DELETE Operations (uses deleteTestPostId)        │
├──────────────────────────────────────────────────────────────┤
│ 4.1 DELETE /posts/{{deleteTestPostId}}    ← NEEDS ID        │
│ 4.2 GET /posts/{{deleteTestPostId}}       ← Verify deleted  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SECTION 5: Comments (uses firstPostId, firstUserId)         │
├──────────────────────────────────────────────────────────────┤
│ 5.1 GET /posts/{{firstPostId}}/comments           ← NEEDS ID│
│ 5.2 POST /posts/{{firstPostId}}/comments          ← NEEDS ID│
│     Body: {"authorId": "{{firstUserId}}"}                    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SECTION 10: Validation (uses firstPostId, firstUserId)      │
├──────────────────────────────────────────────────────────────┤
│ 10.2 GET /posts/{{firstPostId}}                  ← NEEDS ID  │
│ 10.3 POST /posts                                             │
│      Body: {"authorId": "{{firstUserId}}"}                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Variable Setup Flow

```
START
  ↓
┌─────────────────────────────────────────────┐
│ Terminal: pnpm dev                           │
│ (Start development server)                   │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ WebStorm: Open variable-extractor.http      │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ Click: SETUP 1                               │
│ Press: Ctrl+Alt+Enter                        │
│ GET /posts?page=1&limit=1                    │
│                                              │
│ Response Handler Extracts:                   │
│ • firstPostId ← response.body.posts[0].id    │
│ • firstUserId ← response.body.posts[0].author.id
│                                              │
│ Console Output:                              │
│ ✓ Setup complete:                            │
│   firstPostId: clrm5k6pq0000...              │
│   firstUserId: clrm5k6pq0000...              │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ Click: SETUP 2                               │
│ Press: Ctrl+Alt+Enter                        │
│ POST /posts                                  │
│ Uses: {{firstUserId}} (from SETUP 1)        │
│                                              │
│ Response Handler Extracts:                   │
│ • updateTestPostId ← response.body.id        │
│                                              │
│ Console Output:                              │
│ ✓ Post created with ID: clrm5k6pq0001...    │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ Click: SETUP 3                               │
│ Press: Ctrl+Alt+Enter                        │
│ POST /posts                                  │
│ Uses: {{firstUserId}} (from SETUP 1)        │
│                                              │
│ Response Handler Extracts:                   │
│ • deleteTestPostId ← response.body.id        │
│                                              │
│ Console Output:                              │
│ ✓ Post created with ID: clrm5k6pq0002...    │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ Click: SETUP 4                               │
│ Press: Ctrl+Alt+Enter                        │
│ GET /posts?page=1&limit=1 (diagnostic)      │
│                                              │
│ Response Handler Outputs:                    │
│ ✅ baseUrl: http://localhost:3000/...       │
│ ✅ firstPostId: clrm5k6pq0000...             │
│ ✅ firstUserId: clrm5k6pq0000...             │
│ ✅ updateTestPostId: clrm5k6pq0001...        │
│ ✅ deleteTestPostId: clrm5k6pq0002...        │
│ ✨ ALL VARIABLES SET - Ready!               │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ Open: data-fetching-api.http                 │
│ Run any section (1-10)                       │
│ Ctrl+Alt+Enter                               │
│                                              │
│ All variables now populated:                 │
│ • {{baseUrl}} ✅                             │
│ • {{contentType}} ✅                         │
│ • {{firstPostId}} ✅                         │
│ • {{firstUserId}} ✅                         │
│ • {{updateTestPostId}} ✅                    │
│ • {{deleteTestPostId}} ✅                    │
└─────────────────────────────────────────────┘
  ↓
END - TESTS READY ✨
```

---

## 📊 Variable Dependency Matrix

```
                 SETUP 1    SETUP 2    SETUP 3    Data
Variable         Request    Request    Request    Sources
─────────────────────────────────────────────────────────────
baseUrl          Defined    Defined    Defined    Static
contentType      Defined    Defined    Defined    Static
firstPostId      ✓ SET      Used       Used       DB Query
firstUserId      ✓ SET      Used       Used       DB Query
updateTestPostId            ✓ SET      Used       POST Response
deleteTestPostId                       ✓ SET      POST Response
newPostId                   ✓ SET              (Optional, not used)
```

**Legend:**
- ✓ SET = Variable is populated in this step
- Used = Variable is used as input
- Defined = Static variable (hardcoded)
- DB Query = Value fetched from database
- POST Response = Value extracted from API response

---

## 🎮 Interactive Workflow

### Scenario 1: Everything Works ✅

```
SETUP 1 ──→ Database has posts
           ↓
           Extract: firstPostId ✓
           Extract: firstUserId ✓
           ↓
SETUP 2 ──→ Create post using firstUserId
           ↓
           Extract: updateTestPostId ✓
           ↓
SETUP 3 ──→ Create post using firstUserId
           ↓
           Extract: deleteTestPostId ✓
           ↓
SETUP 4 ──→ Verify all variables
           ↓
           Output: ✅ ALL VARIABLES SET
           ↓
           Ready to run data-fetching-api.http
```

### Scenario 2: Database Empty ❌

```
SETUP 1 ──→ Database is EMPTY
           ↓
           Error: posts = []
           ✗ firstPostId = undefined
           ✗ firstUserId = undefined
           
Action: Run pnpm seed to populate database
Then: Re-run SETUP 1
```

### Scenario 3: Author Not Found ❌

```
SETUP 1 ──→ ✓ Success
           ↓
SETUP 2 ──→ POST /posts with firstUserId
           ↓
           Error: "Author not found"
           ✗ updateTestPostId = undefined

Action: Verify SETUP 1 completed successfully
Check: Console output shows valid firstUserId
Then: Re-run SETUP 2
```

---

## 🔗 File Structure

```
http/
│
├── variable-extractor.http          ← RUN FIRST
│   ├── SETUP 1: Extract IDs
│   ├── SETUP 2: Create post
│   ├── SETUP 3: Create post
│   └── SETUP 4: Diagnostic
│
├── data-fetching-api.http           ← RUN AFTER
│   ├── Section 0: Setup (not needed if SETUP 1-3 ran)
│   ├── Section 1: GET
│   ├── Section 2: POST
│   ├── Section 3: PUT
│   ├── Section 4: DELETE
│   ├── Section 5: Comments
│   ├── Section 6: Search
│   ├── Section 7: Delay
│   ├── Section 8: Metrics
│   ├── Section 9: Errors
│   └── Section 10: Validation
│
├── http-client.env.json             ← Optional Config
│   ├── dev environment
│   ├── staging environment
│   └── production environment
│
└── Documentation
    ├── http-testing-quick-start.md              (START HERE)
    ├── http-variables-setup.md                  (Technical Docs)
    ├── http-variables-troubleshooting.md        (Problem Solving)
    ├── http-variables-summary.md                (Summary)
    └── http-variables-visual-reference.md       (This File)
```

---

## 💡 Pro Tips

### Tip 1: Run Requests in Sequence
```
Best Order:
1. SETUP 1 (extract data)
2. SETUP 2 (create post)
3. SETUP 3 (create post)
4. SETUP 4 (verify)
✓ Then run data-fetching-api.http sections
```

### Tip 2: View All Variables
```
Run SETUP 4 and check console:
✅ baseUrl: http://localhost:3000/api/data-fetching
✅ firstPostId: clrm5k6pq0000qz1h9w1s9k2a
✅ firstUserId: clrm5k6pq0000qz1h9w1s9k3b
✅ updateTestPostId: clrm5k6pq0001qz1h9w1s9k2a
✅ deleteTestPostId: clrm5k6pq0002qz1h9w1s9k2a
```

### Tip 3: Debug Failed Request
```
1. Look at Response tab (right panel)
2. Check Status Code (200? 400? 500?)
3. Read error message
4. Check console for variable values
5. Refer to troubleshooting guide
```

### Tip 4: Clear Variables for Fresh Start
```
WebStorm: Settings → Tools → HTTP Client → Clear all cookies/variables
Then: Re-run SETUP 1-3 to re-populate
```

### Tip 5: Use Environment Switching
```
Create http-client.env.json with dev/staging/production
Select environment: Alt+E in WebStorm
Automatically substitutes variables for each environment
```

---

## 📞 Quick Reference

**Key Shortcuts:**
- Run Request: `Ctrl+Alt+Enter`
- Select Environment: `Alt+E`
- View History: `View → Tool Windows → HTTP Client`
- Clear Variables: `Settings → Tools → HTTP Client → Clear`

**Common URLs:**
- Dev API: http://localhost:3000/api/data-fetching
- Prisma Studio: http://localhost:5555
- Next.js App: http://localhost:3000

**Commands:**
- Start dev: `pnpm dev`
- Seed DB: `pnpm seed`
- Open studio: `pnpm exec prisma studio`

---

**Last Updated:** January 19, 2026  
**Status:** ✅ Complete Visual Reference

