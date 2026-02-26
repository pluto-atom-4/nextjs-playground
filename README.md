This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
## Getting Started
### Install Dependencies
First, install dependencies using `pnpm`:
```bash
pnpm install
```
When prompted, approve the native package builds:
```
$ pnpm approve-builds
✔ Choose which packages to build (Press <space> to select, <a> to toggle all, <i> to invert selection)
  ◯ @biomejs/biome
  ◯ @clerk/shared
  ◯ @prisma/engines
  ◯ esbuild
  ◯ prisma
  ◯ sharp
✔ The next packages will now be built: @biomejs/biome, @clerk/shared, @prisma/engines, esbuild, prisma, sharp
Do you approve? (y/N) · y
```
**How to select:** Press `a` to toggle all packages, then press `y` to confirm. These packages require native compilation for your system.
**Note:** The `prisma generate` command is automatically run after `pnpm install` to ensure the Prisma Client is always in sync with your database schema.
### Initialize the Dev Database
This project uses **Prisma 7** with **SQLite** for local development. Follow these steps to set up your database:
#### 1. Initialize Prisma
First, initialize Prisma in your project:
```bash
pnpm db:init
```
This creates:
- `.env.local` – Environment variables file (with `DATABASE_URL` pre-configured)
- `prisma/schema.prisma` – Database schema definition
#### 2. Run Database Migrations
Create the database schema:
```bash
pnpm db:migrate
```
This creates the SQLite database file at `prisma/dev.db` and applies all migrations.
#### 3. Seed the Database
Populate the database with test data:
```bash
pnpm db:seed
```
**Why this is needed:** These steps set up your local development database with the correct schema and seed data for testing data fetching patterns and features. For detailed database configuration, schema details, and troubleshooting, see [`docs/database-setup.md`](./docs/database-setup.md).
### Start the Development Server
Run the development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
## Database Inspection
### Verify Database Setup
To verify that your database is properly initialized and connected:
```bash
pnpm db:verify
```
This command checks:
- Database file exists at `prisma/dev.db`
- Connection to the database is successful
- Database schema is properly applied
- Expected tables are present
Use this command if you're experiencing database-related issues or want to confirm your setup is correct.
### Explore Database with Prisma Studio
Launch the visual database browser to explore, edit, and manage your database:
```bash
pnpm prisma:studio
```
This opens Prisma Studio at `http://localhost:5555` where you can:
- Browse database tables and records
- Create, update, and delete records visually
- Inspect database schema
- Run custom queries
Perfect for development, testing, and troubleshooting database issues.
## Troubleshooting
### Database Setup Issues
If you encounter issues during database setup:
1. **Verify your database connection:**
   ```bash
   pnpm db:verify
   ```
2. **Inspect your database visually:**
   ```bash
   pnpm prisma:studio
   ```
3. **Check your `.env.local` file:**
   - Ensure `DATABASE_URL` is set to `file:./prisma/dev.db`
   - Verify the file exists at `prisma/dev.db`
4. **Re-run migrations:**
   ```bash
   pnpm db:migrate
   ```
5. **Reseed the database:**
   ```bash
   pnpm db:seed
   ```
For detailed troubleshooting guidance, refer to [`docs/database-setup.md`](./docs/database-setup.md).
## Learn More
To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
