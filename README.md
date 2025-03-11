# Next.js with Prisma and PostgreSQL

This is a [Next.js](https://nextjs.org/) project that uses [Prisma](https://www.prisma.io/) as the ORM and [PostgreSQL](https://www.postgresql.org/) as the database.

## Features

- Next.js App Router
- Prisma ORM for database access
- PostgreSQL database
- TypeScript support
- Tailwind CSS for styling
- User management (list, create)

## Prerequisites

- Node.js 18.x or later
- PostgreSQL database

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Make sure you have PostgreSQL running. Update the `.env` file with your database connection string:

```
DATABASE_URL="postgresql://username:password@localhost:5432/mydatabase?schema=public"
```

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
```

This will create the database tables based on the Prisma schema.

### 5. Seed the database

```bash
npm run db:seed
```

This will populate the database with initial data.

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Next.js App Router pages
- `src/app/api`: API routes
- `src/components`: React components
- `src/lib`: Shared utilities (e.g., Prisma client)
- `prisma`: Prisma schema and migrations

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:studio`: Open Prisma Studio to view and edit data
- `npm run db:seed`: Seed the database with initial data

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
