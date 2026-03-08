# dotenvx Setup Guide

**Last Updated:** March 8, 2026  
**Status:** Implemented & Tested  
**Version:** 1.0

---

## Overview

This project uses **dotenvx** for encrypted environment variable management. All sensitive credentials (Clerk API keys, database URLs, etc.) are encrypted and stored in `.env.vault`, ensuring they remain secure even in version control.

### Key Benefits
- ✅ **Encrypted Storage** - Secrets encrypted in `.env.vault` (safe to commit)
- ✅ **Zero Configuration** - Works with existing npm scripts (`pnpm dev`, `pnpm build`, etc.)
- ✅ **Developer Friendly** - Uses `.env.local` for local development (unencrypted)
- ✅ **Team Sharing** - Share encrypted vault with team securely
- ✅ **Cross-Platform** - Works on Windows, Mac, Linux

---

## Quick Start

### For New Developers

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd nextjs-playground
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Copy the .env.local template:**
   ```bash
   cp .env.example .env.local
   ```

4. **Add your credentials to .env.local:**
   ```bash
   # Edit .env.local and add your actual values:
   # - CLERK_SECRET_KEY (from https://dashboard.clerk.com)
   # - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (from Clerk dashboard)
   # - DATABASE_URL (if using custom database)
   ```

5. **Start development:**
   ```bash
   pnpm dev
   ```

   The `pnpm dev` script automatically uses `dotenvx run --` to load environment variables.

### For Existing Developers with Vault Access

If you have the `.env.vault.keys` file (shared securely by your team):

1. **Place `.env.vault.keys` in the project root** (keep this private!)

2. **Start development using the encrypted vault:**
   ```bash
   export DOTENV_PRIVATE_KEY_LOCAL=$(cat .env.vault.keys | grep DOTENV_PRIVATE_KEY_LOCAL | cut -d= -f2)
   pnpm dev
   ```

   Or set it in your shell profile for convenience:
   ```bash
   echo 'export DOTENV_PRIVATE_KEY_LOCAL="<your-key-here>"' >> ~/.bashrc
   source ~/.bashrc
   ```

---

## File Structure

| File | Purpose | Git Tracked? | Notes |
|------|---------|--------------|-------|
| `.env.local` | Unencrypted variables for local development | ❌ No | Use for development only |
| `.env.vault` | Encrypted variables (production-ready) | ✅ Yes | Safe to commit, encrypted |
| `.env.vault.keys` | Decryption keys (PRIVATE) | ❌ No | Never commit! Use .gitignore |
| `.env.example` | Template with all required variables | ✅ Yes | Reference for setting up .env.local |
| `.env.local.example` | Legacy template | ✅ Yes | For backward compatibility |

---

## Common Tasks

### 1. Adding a New Environment Variable

#### Option A: Using .env.local (for development)
```bash
# Edit .env.local and add:
MY_NEW_VAR=my_value

# Then use it in your code:
console.log(process.env.MY_NEW_VAR)
```

#### Option B: Encrypting in the Vault (for secrets)
```bash
# Add the variable to .env.local first
echo "MY_SECRET=secret_value" >> .env.local

# Encrypt it (creates/updates .env.vault and .env.vault.keys)
pnpm dotenvx:encrypt -f .env.local

# Restore unencrypted .env.local for development
cp .env.example .env.local
# Or manually remove sensitive values from .env.local
```

### 2. Decrypting the Vault

View decrypted values (for debugging):
```bash
# With the private key in environment
export DOTENV_PRIVATE_KEY_LOCAL=$(cat .env.vault.keys | grep DOTENV_PRIVATE_KEY_LOCAL | cut -d= -f2)
pnpm dotenvx:decrypt -f .env.vault
```

### 3. Running Commands with Encrypted Secrets

All npm scripts are wrapped with `dotenvx run --`:

```bash
# Development server (with dotenvx)
pnpm dev

# Production build (with dotenvx)
pnpm build

# Run tests (with dotenvx)
pnpm test

# Custom command with dotenvx
dotenvx run -- node your-script.js
```

### 4. Updating Team Encryption Key

If you need to share the vault with new team members:

1. **Backup the current key:**
   ```bash
   cp .env.vault.keys .env.vault.keys.backup
   ```

2. **Export and share the key securely:**
   ```bash
   # Display the key (copy and share via secure channel like 1Password, LastPass, etc.)
   cat .env.vault.keys | grep DOTENV_PRIVATE_KEY_LOCAL
   ```

3. **Team member receives the key and saves it:**
   ```bash
   echo 'DOTENV_PRIVATE_KEY_LOCAL=<key-from-team-lead>' > .env.vault.keys
   ```

### 5. Re-encrypting with New Secrets

```bash
# 1. Update .env.local with new values
echo "CLERK_SECRET_KEY=new_key_value" >> .env.local

# 2. Re-encrypt
pnpm dotenvx:encrypt -f .env.local

# 3. Commit the updated .env.vault (encrypted)
git add .env.vault
git commit -m "chore: update encrypted secrets"

# 4. Keep .env.vault.keys private (don't commit)
git status  # Ensure .env.vault.keys is NOT staged
```

---

## Environment Variable Types

### Public Variables (Safe to Commit)
- `NEXT_PUBLIC_*` - Variables exposed to browser
- `PORT`, `NODE_ENV` - Configuration flags
- Non-sensitive URLs and paths

### Secret Variables (Encrypted in .env.vault)
- `CLERK_SECRET_KEY` - API authentication tokens
- `DATABASE_URL` - Database connection strings
- `API_KEYS` - Third-party service credentials
- `ENCRYPTION_KEYS` - Cryptographic keys

### Development Variables (.env.local only)
- Local database paths
- Mock API endpoints
- Development-specific flags

---

## Troubleshooting

### Problem: "Missing env file" warning
**Cause:** dotenvx is checking for a `.env` file (normal behavior)  
**Solution:** This is informational and safe to ignore. Both `.env.local` and `.env.vault` are loaded correctly.

```bash
# Expected output (not an error):
[MISSING_ENV_FILE] missing .env file
[dotenvx@1.54.1] injecting env (4) from .env.local
```

### Problem: Environment variables not loading
**Check:**
1. Is `.env.local` present? → `ls -la .env.local`
2. Does it have correct syntax? → `cat .env.local`
3. Is the script wrapped with `dotenvx run --`? → `grep "dotenvx run" package.json`

**Solution:**
```bash
# Verify dotenvx can load your env file
pnpm dotenvx run -f .env.local -- bash -c 'echo "DATABASE_URL=$DATABASE_URL"'
```

### Problem: Can't decrypt .env.vault
**Cause:** Missing or incorrect `.env.vault.keys`  
**Solution:**
```bash
# Verify the key exists
ls -la .env.vault.keys

# Check the key format
cat .env.vault.keys

# Re-set the environment variable
export DOTENV_PRIVATE_KEY_LOCAL=$(cat .env.vault.keys | grep DOTENV_PRIVATE_KEY_LOCAL | cut -d= -f2)

# Try decrypting again
pnpm dotenvx:decrypt -f .env.vault
```

### Problem: Tests failing with "Env not loaded"
**Cause:** Tests need to run through `dotenvx run --`  
**Solution:** Already fixed in `package.json` - just run:
```bash
pnpm test
```

---

## Security Best Practices

### ✅ DO
- ✅ Keep `.env.vault.keys` in `.gitignore` (already configured)
- ✅ Share `.env.vault.keys` only via secure channels (1Password, team secrets manager)
- ✅ Rotate keys periodically for production
- ✅ Back up `.env.vault.keys` in a secure location
- ✅ Audit access to `.env.vault.keys`

### ❌ DON'T
- ❌ Commit `.env.vault.keys` to git
- ❌ Share encryption keys via email or Slack
- ❌ Store keys in plaintext files outside of `.env.vault.keys`
- ❌ Commit unencrypted secrets to `.env.local`
- ❌ Use the same key across multiple environments

---

## Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| `pnpm dev` | `dotenvx run -- next dev` | Start development server |
| `pnpm build` | `dotenvx run -- next build` | Build for production |
| `pnpm start` | `dotenvx run -- next start` | Start production server |
| `pnpm test` | `dotenvx run -- vitest --watch=false` | Run test suite |
| `pnpm dotenvx:encrypt` | `dotenvx encrypt` | Encrypt .env.local |
| `pnpm dotenvx:decrypt` | `dotenvx decrypt` | Decrypt .env.vault |

---

## Resources

- **dotenvx Documentation:** https://dotenvx.com
- **dotenvx GitHub:** https://github.com/dotenvx/dotenvx
- **Encryption Guide:** https://dotenvx.com/docs/encryption
- **Clerk Auth Docs:** https://clerk.com/docs

---

## Support

For issues or questions:
1. Check the **Troubleshooting** section above
2. Review dotenvx docs: https://dotenvx.com/docs
3. Check project README.md for additional setup info

---

**Version History:**
- **1.0** (March 8, 2026) - Initial setup guide for dotenvx integration
